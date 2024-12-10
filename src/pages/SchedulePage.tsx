
import { Calendar as CalendarIcon } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Instructor Workshop',
    time: '10:00 AM - 11:30 AM',
    date: 'Today',
    type: 'Workshop',
  },
  {
    id: 2,
    title: 'Navigation Advanced Concepts',
    time: '2:00 PM - 3:30 PM',
    date: 'Today',
    type: 'Lecture',
  },
  {
    id: 3,
    title: 'Logistics Fundamentals',
    time: '11:00 AM - 12:30 PM',
    date: 'Tomorrow',
    type: 'Course',
  },
];

export function SchedulePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100">
            <CalendarIcon className="h-4 w-4 mr-2" />
            View Calendar
          </button>
        </div>
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{event.date}</p>
                <p className="text-sm text-gray-600">{event.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}