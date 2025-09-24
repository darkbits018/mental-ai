export type Message = {
    text: string;
    isBot: boolean;
    timestamp: Date;
};

export type SidebarOption = 'chat' | 'stress-record' | 'mood-track' | 'settings' | 'help';

export type QuickAction = 'detect_stress' | 'analyze_mood' | 'recommend_music';

export type ModelId =
    | 'x-ai/grok-4-fast:free'
    | 'nvidia/nemotron-nano-9b-v2:free'
    | 'deepseek/deepseek-chat-v3.1:free'
    | 'mistralai/mistral-small-3.2-24b-instruct:free'
    | 'mistralai/mistral-nemo:free';

export interface Model {
    id: ModelId;
    name: string;
}

export interface StressRecord {
    id: number;
    stress_level: number;
    insights: string;
    timestamp: string;
}