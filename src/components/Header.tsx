import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="p-4 sm:p-6 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={20} />
      </button>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">MENTAL AI</h1>
        <p className="text-sm text-gray-500 mt-1">Your Personal Mental Health Assistant</p>
      </div>
    </div>
  );
}