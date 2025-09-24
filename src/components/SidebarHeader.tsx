import { X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
      <button
        onClick={onClose}
        className="p-1 rounded-md hover:bg-gray-100"
      >
        <X size={20} />
      </button>
    </div>
  );
}