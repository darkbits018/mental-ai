# Mental Health Support AI - API Documentation

This document provides details on the simplified API endpoints for the Mental Health Support AI application.

## Base URL

`http://127.0.0.1:5000`

---

## Chat

### 1. Post a Message

Sends a new message from the user to the chat, gets a response from the AI, and saves both to the database.

-   **Endpoint:** `/chat`
-   **Method:** `POST`
-   **Request Body (JSON):**
    ```json
    {
        "prompt": "I'm feeling a bit down today.",
        "model": "x-ai/grok-4-fast:free"
    }
    ```

### 2. Get Chat History

Retrieves the entire chat history.

-   **Endpoint:** `/history`
-   **Method:** `GET`

---

## Analytics

### 3. Detect Stress

Analyzes today's messages to determine a stress level and insights. This is useful for manual triggers.

-   **Endpoint:** `/stress/detect`
-   **Method:** `POST`

### 4. Get Stress History

Retrieves all recorded stress levels.

-   **Endpoint:** `/stress/history`
-   **Method:** `GET`

### 5. Detect Mood

Analyzes today's messages to determine a primary mood and insights. This is useful for manual triggers.

-   **Endpoint:** `/mood/detect`
-   **Method:** `POST`

### 6. Get Mood History

Retrieves all recorded mood analyses.

-   **Endpoint:** `/mood/history`
-   **Method:** `GET`

---

## Smart Recommendations

### 7. Get Media Recommendations

Generates personalized media recommendation URLs. This endpoint intelligently uses the most recent mood and stress data. If today's analysis hasn't been performed, it will automatically run it before generating recommendations.

-   **Endpoint:** `/recommendations`
-   **Method:** `GET`
-   **Request Body:** None
-   **Query Parameters (optional):**
    -   `model`: To specify a different AI model, e.g., `?model=openai/gpt-3.5-turbo`
-   **Success Response (200 OK):**
    Returns a JSON object with direct search URLs for Spotify and YouTube.
    ```json
    {
        "spotify_url": "https://open.spotify.com/search/calming%20ambient%20music",
        "youtube_url": "https://www.youtube.com/results?search_query=10-minute%20guided%20meditation%20for%20anxiety"
    }
    ```
-   **Error Response (404 Not Found):**
    If there are no messages from today to analyze, and no prior mood/stress records exist.

---

## Frontend Integration Guide

The `/recommendations` endpoint provides direct URLs that your frontend application can use immediately.

-   **Usage:** Take the `spotify_url` and `youtube_url` values from the response and use them as the `href` attribute in an anchor (`<a>`) tag.

-   **Example:**
    ```html
    <a :href="recommendations.spotify_url" target="_blank">Listen on Spotify</a>
    <a :href="recommendations.youtube_url" target="_blank">Watch on YouTube</a>
    ```
This approach is simpler and more secure than handling API keys on the frontend.
