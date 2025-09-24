import type React from 'react';
import { Settings, HelpCircle, HeartPulse, Smile, MessageCircle } from 'lucide-react';
import { SidebarOption } from '../types';

type SidebarOptionConfig = {
  icon: React.ElementType;
  label: string;
  action: SidebarOption;
};

const sidebarOptions: SidebarOptionConfig[] = [
  { icon: MessageCircle, label: 'Chat', action: 'chat' },
  { icon: HeartPulse, label: 'Stress Record', action: 'stress-record' },
  { icon: Smile, label: 'Mood Track', action: 'mood-track' },
  { icon: Settings, label: 'Settings', action: 'settings' },
  { icon: HelpCircle, label: 'Help & Support', action: 'help' }
];

interface SidebarNavProps {
  handleSidebarOption: (option: SidebarOption) => void;
  activeOption: SidebarOption;
}

export function SidebarNav({ handleSidebarOption, activeOption }: SidebarNavProps) {
  return (
    <div className="flex-1 p-4">
      <nav className="space-y-2">
        {sidebarOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSidebarOption(option.action)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeOption === option.action
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-50'
              }`}
          >
            <option.icon size={18} />
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}