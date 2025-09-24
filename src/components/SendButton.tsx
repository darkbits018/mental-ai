import React from 'react';
import { Send } from 'lucide-react';

interface SendButtonProps {
    sendMessage: () => void;
    isLoading: boolean;
}

export function SendButton({ sendMessage, isLoading }: SendButtonProps) {
    return (
        <button
            onClick={sendMessage}
            disabled={isLoading}
            className="flex-shrink-0 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm disabled:bg-blue-300"
        >
            <Send size={18} />
        </button>
    );
}