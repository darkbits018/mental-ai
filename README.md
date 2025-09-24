# Mental AI Application

A mental health support companion with AI-powered analysis and recommendations.

## 🚀 Quick Start (Recommended)

### Easy Setup with Batch Scripts
**Start the Application:**
1. Double-click `start-mental.bat`
2. Both Flask backend and frontend will start in a single command window
3. Wait for both services to initialize (about 5-10 seconds)
4. Open your browser to `http://localhost:5173`

**Stop the Application:**
- **Option 1**: Press `Ctrl+C` in the command window, then type `Y` when prompted
- **Option 2**: Double-click `stop-mental.bat` to force stop all services
- **Option 3**: Simply close the command window


## Manual Setup (if scripts don't work)

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ installed

### Backend Setup
```bash
cd Mental-AI-Backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Frontend Setup (in a new terminal)
```bash
cd Mental-AI-Frontend
npm install
npm run dev
```

## Application URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Environment Variables
Create a `.env` file in the `Mental-AI-Backend` directory:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## 🛑 Stopping the Application

### Using Batch Scripts (Recommended)
- **From running window**: Press `Ctrl+C`, then type `Y` when prompted
- **Force stop**: Double-click `stop-mental.bat` to immediately stop all services
- **Close window**: Simply close the command window (auto-cleanup)



## 📁 Project Structure
```
Mental AI/
├── start-dev.bat          # Main script to start both services (RECOMMENDED)
├── stop-dev.bat           # Script to stop all services
├── start-dev.ps1          # PowerShell alternative
├── Mental-AI-Backend/     # Flask backend
│   ├── app.py            # Main Flask application
│   ├── ai_service.py     # AI integration services
│   ├── requirements.txt  # Python dependencies
│   └── .env             # Environment variables (create this)
├── Mental-AI-Frontend/    # React frontend
│   ├── src/             # Source code
│   ├── package.json     # Node.js dependencies
│   └── ...
└── README.md            # This file
```

## ✨ Features
- AI-powered mental health chat companion
- Stress level analysis
- Mood detection
- Personalized music and video recommendations
- Chat history persistence

## 🔧 Troubleshooting

### Common Issues
1. **Port conflicts**: If ports 5000 or 5173 are in use, stop other applications using these ports
2. **Python not found**: Ensure Python 3.9+ is installed and added to PATH
3. **npm not found**: Ensure Node.js 16+ is installed and added to PATH
4. **Services won't stop**: Use `stop-dev.bat` or check Task Manager for `python.exe`/`node.exe` processes

### Python Version Issues
If you get a `TypeError: unsupported operand type(s) for |: 'type' and 'NoneType'`:
- You're using Python < 3.10 (this is fine, the code has been fixed for 3.9+)
- Make sure you're using the updated code

### Environment Variables
Make sure to create `.env` file in `Mental-AI-Backend/` with your OpenRouter API key:
```
OPENROUTER_API_KEY=your_api_key_here
```
