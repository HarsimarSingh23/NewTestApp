import React from 'react';
import { Bell, Lock, Eye, Globe } from 'lucide-react';

const settings = [
  {
    category: 'Notifications',
    icon: Bell,
    options: [
      { label: 'Email Notifications', enabled: true },
      { label: 'Push Notifications', enabled: false },
      { label: 'Course Updates', enabled: true },
    ],
  },
  {
    category: 'Privacy',
    icon: Lock,
    options: [
      { label: 'Profile Visibility', enabled: true },
      { label: 'Show Progress', enabled: true },
    ],
  },
  {
    category: 'Appearance',
    icon: Eye,
    options: [
      { label: 'Dark Mode', enabled: false },
      { label: 'Compact View', enabled: false },
    ],
  },
  {
    category: 'Language',
    icon: Globe,
    options: [
      { label: 'English', enabled: true },
      { label: 'Auto-translate Content', enabled: false },
    ],
  },
];

export function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {settings.map((section) => (
          <div key={section.category} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-4">
              <section.icon className="h-5 w-5 text-gray-400" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">
                {section.category}
              </h2>
            </div>
            <div className="space-y-4">
              {section.options.map((option) => (
                <div
                  key={option.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-gray-700">{option.label}</span>
                  <button
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      option.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        option.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}