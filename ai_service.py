import os
import requests
import json
import urllib.parse
from typing import Optional

SYSTEM_PROMPT = """
You are a mental health support companion AI. Your role is to be a compassionate, non-judgmental, and empathetic listener. 
You are not a therapist, so you should not give advice, but rather provide a safe space for users to express their feelings. 
Encourage users to explore their emotions and offer gentle, supportive responses. 
Always prioritize the user's well-being and, if you sense they are in crisis, gently suggest they seek professional help.
"""

STRESS_ANALYSIS_PROMPT = """
Analyze the following user messages and provide a stress analysis. The user is interacting with a mental health support companion. Based on their messages, determine their stress level and provide brief insights.

Respond with ONLY a JSON object in the following format: {"stress_level": <integer>, "insights": "<string>"}

-   `stress_level`: An integer between 1 (very low stress) and 10 (very high stress).
-   `insights`: A brief, one-sentence summary of the potential sources of stress based on the messages.

Messages to analyze:
"""

MOOD_ANALYSIS_PROMPT = """
Analyze the following user messages and provide a mood analysis. The user is interacting with a mental health support companion. Based on their messages, determine their primary mood and provide brief insights.

Respond with ONLY a JSON object in the following format: {"mood": "<string>", "insights": "<string>"}

-   `mood`: A single word describing the dominant mood (e.g., Happy, Sad, Anxious, Content, Grateful, Angry).
-   `insights`: A brief, one-sentence summary of the potential reasons for the mood based on the messages.

Messages to analyze:
"""

RECOMMENDATION_PROMPT = """
Based on the user's current emotional state, generate effective search queries for Spotify and YouTube. The user is looking for content to support their well-being.

Respond with ONLY a JSON object in the following format: {"spotify_query": "<string>", "youtube_query": "<string>"}

-   `spotify_query`: A search term for Spotify to find playlists or songs. Be specific. For example, if the user is "Sad" and has a stress level of 8, suggest "gentle ambient music for stress relief" instead of just "sad music".
-   `youtube_query`: A search term for YouTube to find calming videos or guided meditations. Be specific. For example, if the user is "Anxious" and has "high stress", suggest "10-minute guided breathing for anxiety" instead of just "calming video".

User's emotional state:
"""

def get_ai_response(prompt: str, model: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "Error: OPENROUTER_API_KEY environment variable not set."
    combined_prompt = f"{SYSTEM_PROMPT}\n\nUser message: {prompt}"
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "messages": [{"role": "user", "content": combined_prompt}]}
        )
        response.raise_for_status()
        data = response.json()
        return data['choices'][0]['message']['content']
    except (requests.exceptions.RequestException, KeyError, IndexError) as e:
        print(f"Error during AI response: {e}")
        return "Error: Failed to get a response from the AI model."

def get_stress_analysis(messages: str, model: str) -> dict:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "OPENROUTER_API_KEY environment variable not set."}
    full_prompt = f"{STRESS_ANALYSIS_PROMPT}\n{messages}"
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "messages": [{"role": "user", "content": full_prompt}]}
        )
        response.raise_for_status()
        ai_response = response.json()['choices'][0]['message']['content']
        clean_json_str = ai_response.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(clean_json_str)
    except (requests.exceptions.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Error during stress analysis: {e}")
        return {"error": "Failed to get or parse stress analysis from AI."}

def get_mood_analysis(messages: str, model: str) -> dict:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "OPENROUTER_API_KEY environment variable not set."}
    full_prompt = f"{MOOD_ANALYSIS_PROMPT}\n{messages}"
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "messages": [{"role": "user", "content": full_prompt}]}
        )
        response.raise_for_status()
        ai_response = response.json()['choices'][0]['message']['content']
        clean_json_str = ai_response.strip().removeprefix("```json").removesuffix("```").strip()
        return json.loads(clean_json_str)
    except (requests.exceptions.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Error during mood analysis: {e}")
        return {"error": "Failed to get or parse mood analysis from AI."}

def get_recommendation_query(mood: str, stress_level: Optional[int], model: str) -> dict:
    """
    Generates search URLs for Spotify and YouTube based on mood and stress level.
    """
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return {"error": "OPENROUTER_API_KEY environment variable not set."}

    prompt_context = f"- Mood: {mood}"
    if stress_level is not None:
        prompt_context += f"\n- Stress Level (1-10): {stress_level}"

    full_prompt = f"{RECOMMENDATION_PROMPT}\n{prompt_context}"

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "messages": [{"role": "user", "content": full_prompt}]}
        )
        response.raise_for_status()
        ai_response = response.json()['choices'][0]['message']['content']
        clean_json_str = ai_response.strip().removeprefix("```json").removesuffix("```").strip()
        queries = json.loads(clean_json_str)

        # Build the full search URLs from the AI-generated queries
        spotify_url = f"https://open.spotify.com/search/{urllib.parse.quote(queries.get('spotify_query', ''))}"
        youtube_url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(queries.get('youtube_query', ''))}"

        return {"spotify_url": spotify_url, "youtube_url": youtube_url}

    except (requests.exceptions.RequestException, KeyError, IndexError, json.JSONDecodeError) as e:
        print(f"Error during recommendation generation: {e}")
        return {"error": "Failed to get or parse recommendations from AI."}
