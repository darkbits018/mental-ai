import React from 'react';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { ModelSelectionDropdown } from './components/ModelSelectionDropdown';
import { SendButton } from './components/SendButton';
import { InputActions } from './components/InputActions';
import { Message, ModelId } from './types';

interface ChatPageProps {
    messages: Message[];
    isLoading: boolean;
    input: string;
    setInput: (input: string) => void;
    sendMessage: () => void;
    selectedModel: ModelId;
    setSelectedModel: (model: ModelId) => void;
    handleQuickAction: (action: string, displayText: string) => void;
}

export function ChatPage({ messages, isLoading, input, setInput, sendMessage, selectedModel, setSelectedModel, handleQuickAction }: ChatPageProps) {
    return (
        <>
            <MessageList messages={messages} isLoading={isLoading} />
            <div className="border-t border-gray-200 p-4 sm:p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ModelSelectionDropdown
                            selectedModel={selectedModel}
                            onSelectModel={setSelectedModel}
                            isLoading={isLoading}
                        />
                        <MessageInput input={input} setInput={setInput} sendMessage={sendMessage} isLoading={isLoading} />
                        <SendButton sendMessage={sendMessage} isLoading={isLoading} />
                    </div>
                    <InputActions handleQuickAction={handleQuickAction} isLoading={isLoading} />
                </div>
            </div>
        </>
    );
}