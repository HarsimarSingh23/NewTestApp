import React from 'react';
import { Bookmark, Users, Clock, Trophy } from 'lucide-react';

const stats = [
  { label: 'Courses in Progress', value: '4', icon: Bookmark, color: 'bg-blue-500' },
  { label: 'Total Students', value: '1.2k', icon: Users, color: 'bg-green-500' },
  { label: 'Hours Learned', value: '86', icon: Clock, color: 'bg-purple-500' },
  { label: 'Certificates', value: '3', icon: Trophy, color: 'bg-yellow-500' },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}