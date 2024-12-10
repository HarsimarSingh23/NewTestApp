
import { NavLink } from 'react-router-dom';
import { 
  Home,
  BookOpen, 
  Calendar,
  MessageSquare,
  Settings,
  User,
  BookmarkCheck
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'Courses', path: '/courses' },
  { icon: BookmarkCheck, label: 'Assessment', path: '/assessment' },
  { icon: Calendar, label: 'Schedule', path: '/schedule' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' }
  
];

export function Sidebar() {
  return (
    <div className="h-screen w-64 bg-indigo-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-8">Learning Hub</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-700 text-white'
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}