import { SidebarHeader } from './SidebarHeader';
import { SidebarNav } from './SidebarNav';
import { UserProfile } from './UserProfile';
import { SidebarOption } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  handleSidebarOption: (option: SidebarOption) => void;
  activeOption: SidebarOption;
}

export function Sidebar({ isOpen, onClose, handleSidebarOption, activeOption }: SidebarProps) {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          <SidebarHeader onClose={onClose} />
          <SidebarNav handleSidebarOption={handleSidebarOption} activeOption={activeOption} />
          <UserProfile />
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
}