import React from 'react';
import { QuickActions } from './QuickActions';

interface InputActionsProps {
    handleQuickAction: (action: string, displayText: string) => void;
    isLoading: boolean;
}

export function InputActions({ handleQuickAction, isLoading }: InputActionsProps) {
    return (
        <div className="mt-3 flex justify-center">
            <QuickActions handleQuickAction={handleQuickAction} isLoading={isLoading} />
        </div>
    );
}