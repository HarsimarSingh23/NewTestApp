import { NavLink } from 'react-router-dom';
import crestImage from '../../img/crest_round.png';
import { 
  Home,
  BookOpen, 
  Calendar,
  MessageSquare,
  Settings,
  User,
  BookmarkCheck,
  GraduationCap
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
    <div className="h-screen w-64 bg-indigo-800 text-white fixed left-0 top-0 flex flex-col">
      <div className="flex-1 p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white p-2 rounded-lg">
            <GraduationCap className="h-8 w-8 text-indigo-800" />
          </div>
          <h2 className="text-2xl font-bold">Learning Hub</h2>
        </div>
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

      {/* Centered Image and Text at the Bottom */}
      <div className="p-4 border-t border-indigo-700">
        <div className="flex flex-col items-center">
          <img
            className="h-40 w-auto mb-4"
            src={crestImage}
            alt="Company Logo"
          />
          <p className="text-sm font-medium text-center">In Pursuit of Excellence with Speed and Accuracy</p>
        </div>
      </div>
    </div>
  );
}