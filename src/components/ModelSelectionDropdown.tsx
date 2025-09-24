import React from 'react';
import { Model, ModelId } from '../types';
import { Bot, ChevronDown } from 'lucide-react';

interface ModelSelectionDropdownProps {
    selectedModel: ModelId;
    onSelectModel: (model: ModelId) => void;
    isLoading: boolean;
}

const models: Model[] = [
    { id: 'x-ai/grok-4-fast:free', name: 'Grok-4 Fast' },
    { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B' },
    { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek Chat V3.1' },
    { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 3.2' },
    { id: 'mistralai/mistral-nemo:free', name: 'Mistral Nemo' },
];

export function ModelSelectionDropdown({ selectedModel, onSelectModel, isLoading }: ModelSelectionDropdownProps) {
    return (
        <div className="relative w-12 h-12 sm:w-auto sm:h-auto flex-shrink-0">
            {/* Desktop view: styled select */}
            <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value as ModelId)}
                disabled={isLoading}
                className="w-full h-full appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {models.map((model) => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                ))}
            </select>
            {/* Mobile Icon */}
            <div className="sm:hidden pointer-events-none absolute inset-0 flex items-center justify-center text-gray-600">
                <Bot size={20} />
            </div>
            {/* Desktop Icon */}
            <div className="hidden sm:flex pointer-events-none absolute inset-y-0 right-0 items-center px-3 text-gray-500">
                <ChevronDown size={18} />
            </div>
        </div>
    );
}