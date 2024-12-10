import { Search } from 'lucide-react';

const messages = [
  {
    id: 1,
    sender: 'Singh',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    message: 'Hey, do you have notes from yesterday\'s lecture?',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: 2,
    sender: 'Bhatia',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    message: 'Great work on the project presentation!',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 3,
    sender: 'Gill',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    message: 'When is the next team meeting scheduled?',
    time: 'Yesterday',
    unread: false,
  },
];

export function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="divide-y">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
            >
              <img
                src={message.avatar}
                alt={message.sender}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {message.sender}
                  </h3>
                  <p className="text-sm text-gray-500">{message.time}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{message.message}</p>
              </div>
              {message.unread && (
                <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}