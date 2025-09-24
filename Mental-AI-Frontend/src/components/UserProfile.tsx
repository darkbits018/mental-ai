import { User } from 'lucide-react';

export function UserProfile() {
  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
          <p className="text-xs text-gray-500 truncate">john@example.com</p>
        </div>
      </div>
    </div>
  );
}