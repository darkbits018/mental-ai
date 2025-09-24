// API Configuration
import { Message } from '../types';
import { StressRecord } from '../types';
const API_BASE_URL = 'http://localhost:5000'; // Change this to your Flask API URL

/**
 * A generic wrapper for the fetch API.
 * @param endpoint The API endpoint to call (e.g., '/chat').
 * @param options The options for the fetch request (method, body, etc.).
 * @returns The JSON response from the API.
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // Re-throw the error so the calling function can handle it.
    throw error;
  }
}

// API Functions
export interface StressDetectResponse {
  stress_level?: number;
  insights?: string;
  message?: string;
}

export interface MoodDetectResponse {
  mood?: string;
  insights?: string;
  message?: string;
}

export interface RecommendationsResponse {
  spotify_url?: string;
  youtube_url?: string;
  message?: string;
}

export const detectMoodAPI = async (model: string): Promise<MoodDetectResponse> => {
  return await fetchAPI<MoodDetectResponse>('/mood/detect', {
    method: 'POST', body: JSON.stringify({ model })
  });
};
export const detectStressAPI = async (model: string): Promise<StressDetectResponse> => {
  return await fetchAPI<StressDetectResponse>(
    '/stress/detect',
    { method: 'POST', body: JSON.stringify({ model }) }
  );
};

export const getRecommendationsAPI = async (model: string): Promise<RecommendationsResponse> => {
  return await fetchAPI<RecommendationsResponse>(`/recommendations?model=${encodeURIComponent(model)}`, {
    method: 'GET'
  });
};

export const getStressHistoryAPI = async (): Promise<StressRecord[]> => {
  const data = await fetchAPI<StressRecord[]>(
    '/stress/history',
    { method: 'GET' }
  );
  return data;
};
export const chatAPI = async (message: string, model: string): Promise<string> => {
  const data = await fetchAPI<{ response: string }>(
    '/chat',
    { method: 'POST', body: JSON.stringify({ prompt: message, model: model }) }
  );
  return data.response;
};

export const quickActionAPI = async (action: string, model: string): Promise<string> => {
  const data = await fetchAPI<{ response: string }>(
    '/quick-action',
    { method: 'POST', body: JSON.stringify({ action: action, model: model }) }
  );
  return data.response;
};

export const newChatAPI = async (): Promise<boolean> => {
  const data = await fetchAPI<{ success: boolean }>(
    '/new-chat',
    { method: 'POST' }
  );
  return data.success;
};

export const getChatHistoryAPI = async (): Promise<Message[]> => {
  const data = await fetchAPI<{ history: Message[] }>(
    '/chat-history',
    { method: 'GET' }
  );
  return data.history;
};

export const getSettingsAPI = async (): Promise<object> => {
  const data = await fetchAPI<{ settings: object }>(
    '/settings',
    { method: 'GET' }
  );
  return data.settings;
};

export const getHelpAPI = async (): Promise<string> => {
  const data = await fetchAPI<{ help: string }>(
    '/help',
    { method: 'GET' }
  );
  return data.help;
};
