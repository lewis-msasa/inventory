import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  ClipboardList,
  Users,
  BookOpen,
  UserCog,
  Settings,
  MessageCircle,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

interface NavItem {
  label: string;
  Icon: LucideIcon;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "My Tofu", Icon: LayoutDashboard },
  { label: "Jobs", Icon: Briefcase, badge: "New" },
  { label: "Invoices", Icon: FileText },
  { label: "Estimates", Icon: ClipboardList },
  { label: "Clients", Icon: Users },
  { label: "Price book", Icon: BookOpen },
  { label: "Workers", Icon: UserCog },
];

const bottomItems: NavItem[] = [
  { label: "Settings", Icon: Settings },
  { label: "Support", Icon: MessageCircle },
];

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-gray-200 flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">N</span>
          </div>
        </div>
        <button className="flex items-center gap-1 mt-2 text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors">
          NaveFarm
          <ChevronDown size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ label, Icon, badge }) => {
          const isActive = activePage === label;
          return (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-stone-100 text-gray-900 font-semibold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? "text-gray-900" : "text-gray-400"}
              />
              <span>{label}</span>
              {badge && (
                <span className="ml-auto text-xs bg-gray-900 text-white px-1.5 py-0.5 rounded-full font-medium">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-2 pb-4 space-y-0.5">
        {bottomItems.map(({ label, Icon }) => {
          const isActive = activePage === label;
          return (
            <button
              key={label}
              onClick={() => onNavigate(label)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-stone-100 text-gray-900 font-semibold"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? "text-gray-900" : "text-gray-400"}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;