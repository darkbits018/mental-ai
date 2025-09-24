import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event
from sqlalchemy.engine import Engine
from dotenv import load_dotenv
from datetime import datetime, date, timezone
from ai_service import get_ai_response, get_stress_analysis, get_mood_analysis, get_recommendation_query

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins

# Database Configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'chats.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Set a busy timeout to prevent "database is locked" errors
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA busy_timeout = 5000")  # 5000ms = 5 seconds
    cursor.close()

# --- Database Models ---
class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class StressRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stress_level = db.Column(db.Integer, nullable=False)
    insights = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class MoodRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mood = db.Column(db.String(80), nullable=False)
    insights = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# --- API Endpoints ---
@app.route('/chat', methods=['POST'])
def post_message():
    data = request.get_json()
    prompt = data.get('prompt')
    model = data.get('model', 'x-ai/grok-4-fast:free')
    if not prompt:
        return jsonify({'error': 'Prompt is missing'}), 400
    user_message = ChatMessage(role='user', content=prompt)
    db.session.add(user_message)
    db.session.commit()
    ai_response_content = get_ai_response(prompt, model)
    ai_message = ChatMessage(role='assistant', content=ai_response_content)
    db.session.add(ai_message)
    db.session.commit()
    return jsonify({'response': ai_response_content})

@app.route('/history', methods=['GET'])
def get_chat_history():
    messages = ChatMessage.query.order_by(ChatMessage.timestamp.asc()).all()
    return jsonify([{'id': msg.id, 'role': msg.role, 'content': msg.content, 'timestamp': msg.timestamp} for msg in messages])

@app.route('/stress/detect', methods=['POST'])
def detect_stress():
    data = request.get_json() or {}
    model = data.get('model', 'x-ai/grok-4-fast:free')
    today_utc = datetime.now(timezone.utc).date()
    messages_today = [m.content for m in ChatMessage.query.filter(db.func.date(ChatMessage.timestamp) == today_utc, ChatMessage.role == 'user').all()]
    if not messages_today:
        return jsonify({'message': 'No user messages from today to analyze.'}), 200
    analysis = get_stress_analysis("\n".join(messages_today), model)
    stress_level = analysis.get('stress_level')
    insights = analysis.get('insights')
    if stress_level is None:
        return jsonify({'error': 'Could not determine stress level from the analysis.'}), 500
    new_record = StressRecord(stress_level=stress_level, insights=insights)
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'stress_level': stress_level, 'insights': insights})

@app.route('/stress/history', methods=['GET'])
def get_stress_history():
    records = StressRecord.query.order_by(StressRecord.timestamp.desc()).all()
    return jsonify([{'id': record.id, 'stress_level': record.stress_level, 'insights': record.insights, 'timestamp': record.timestamp} for record in records])

@app.route('/mood/detect', methods=['POST'])
def detect_mood():
    data = request.get_json() or {}
    model = data.get('model', 'x-ai/grok-4-fast:free')
    today_utc = datetime.now(timezone.utc).date()
    messages_today = [m.content for m in ChatMessage.query.filter(db.func.date(ChatMessage.timestamp) == today_utc, ChatMessage.role == 'user').all()]
    if not messages_today:
        return jsonify({'message': 'No user messages from today to analyze.'}), 200
    analysis = get_mood_analysis("\n".join(messages_today), model)
    mood = analysis.get('mood')
    insights = analysis.get('insights')
    if mood is None:
        return jsonify({'error': 'Could not determine mood from the analysis.'}), 500
    new_record = MoodRecord(mood=mood, insights=insights)
    db.session.add(new_record)
    db.session.commit()
    return jsonify({'mood': mood, 'insights': insights})

@app.route('/mood/history', methods=['GET'])
def get_mood_history():
    records = MoodRecord.query.order_by(MoodRecord.timestamp.desc()).all()
    return jsonify([{'id': record.id, 'mood': record.mood, 'insights': record.insights, 'timestamp': record.timestamp} for record in records])

@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    """Get recommendations based on today's mood and stress, analyzing if necessary."""
    model = request.args.get('model', 'x-ai/grok-4-fast:free')
    today_utc = datetime.now(timezone.utc).date()

    # Check for today's mood record
    todays_mood_record = MoodRecord.query.filter(db.func.date(MoodRecord.timestamp) == today_utc).order_by(MoodRecord.timestamp.desc()).first()
    
    # Check for today's stress record
    todays_stress_record = StressRecord.query.filter(db.func.date(StressRecord.timestamp) == today_utc).order_by(StressRecord.timestamp.desc()).first()

    # If either is missing, we need to analyze today's messages
    if not todays_mood_record or not todays_stress_record:
        messages_today = [m.content for m in ChatMessage.query.filter(db.func.date(ChatMessage.timestamp) == today_utc, ChatMessage.role == 'user').all()]
        if not messages_today:
            return jsonify({'message': 'No messages from today to generate a recommendation.'}), 404
        
        # Analyze and create mood record if it doesn't exist
        if not todays_mood_record:
            mood_analysis = get_mood_analysis("\n".join(messages_today), model)
            mood = mood_analysis.get('mood')
            if mood:
                new_mood_record = MoodRecord(mood=mood, insights=mood_analysis.get('insights'))
                db.session.add(new_mood_record)
                todays_mood_record = new_mood_record

        # Analyze and create stress record if it doesn't exist
        if not todays_stress_record:
            stress_analysis = get_stress_analysis("\n".join(messages_today), model)
            stress_level = stress_analysis.get('stress_level')
            if stress_level is not None:
                new_stress_record = StressRecord(stress_level=stress_level, insights=stress_analysis.get('insights'))
                db.session.add(new_stress_record)
                todays_stress_record = new_stress_record
        
        db.session.commit()

    # We must have a mood to continue
    if not todays_mood_record:
        return jsonify({'error': 'Could not determine mood for today.'}), 500

    mood = todays_mood_record.mood
    stress_level = todays_stress_record.stress_level if todays_stress_record else None

    queries = get_recommendation_query(mood=mood, stress_level=stress_level, model=model)

    if queries.get('error'):
        return jsonify(queries), 500

    return jsonify(queries)

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
