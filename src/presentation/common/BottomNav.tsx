import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ClipboardList,
  Users,
  UserCog,
  type LucideIcon,
} from "lucide-react";

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems: { label: string; Icon: LucideIcon }[] = [
  { label: "My Tofu", Icon: LayoutDashboard },
  { label: "Jobs", Icon: Briefcase },
  { label: "Invoices", Icon: FileText },
  { label: "Estimates", Icon: ClipboardList },
  { label: "Clients", Icon: Users },
  { label: "Workers", Icon: UserCog },
];

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  return (
    <nav className="bg-white border-t border-gray-200 flex items-center justify-around px-1 py-2">
      {navItems.map(({ label, Icon }) => {
        const isActive = activePage === label;
        return (
          <button
            key={label}
            onClick={() => onNavigate(label)}
            className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-0 transition-colors"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.8}
              className={isActive ? "text-gray-900" : "text-gray-400"}
            />
            <span
              className={`text-[10px] truncate transition-colors ${
                isActive ? "text-gray-900 font-semibold" : "text-gray-400 font-medium"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;