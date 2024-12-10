import { Camera, Mail, Phone, MapPin } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import navy_man from '../img/navy_man.jpg';

export function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="relative px-8 pb-8">
          <div className="flex items-end absolute -top+30">
            <div className="relative">
              <img
                src={navy_man}
                alt="Profile"
                className="h-40 w-40 rounded-xl border-4 border-white"
              />
              <button className="absolute bottom-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Left column is now empty */}
            </div>

            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">Student</p>
                <div className="flex items-center space-x-3 mt-2">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Mumbai, India</span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">About</h3>
              <p className="text-gray-600">
                Passionate learner and a Navy Officer.
              </p>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">+91 (123) 456-7690</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
