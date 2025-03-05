import { useEffect, useState } from 'react';
import { Camera, Mail, Phone, MapPin, Edit3, Save, User, FileText } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../backend/supabaseClient';

export function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [editing, setEditing] = useState({ field: null, value: '' });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    if (error) console.error(error);
    else {
      setProfile(data);
      setImageUrl(data?.profile_picture || 'https://via.placeholder.com/150');
    }
  }

  async function uploadImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const filePath = `${user.id}/${file.name}`;
    const { error } = await supabase.storage.from('profiles').upload(filePath, file, { upsert: true });
    if (error) {
      console.error(error);
    } else {
      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      await supabase.from('users').update({ profile_picture: data.publicUrl }).eq('id', user.id);
      fetchProfile();
    }
  }

  function handleEdit(field, value) {
    setEditing({ field, value });
  }

  async function saveEdit(field) {
    if (editing.value.trim() === '') return;
    const updateData = {};
    updateData[field] = editing.value;
    await supabase.from('users').update(updateData).eq('id', user.id);
    setEditing({ field: null, value: '' });
    fetchProfile();
  }

  // Mapping of fields to icons
  const fieldIcons = {
    designation: <User className="h-5 w-5 text-gray-400" />,
    about: <FileText className="h-5 w-5 text-gray-400" />,
    phone: <Phone className="h-5 w-5 text-gray-400" />,
    location: <MapPin className="h-5 w-5 text-gray-400" />,
    email: <Mail className="h-5 w-5 text-gray-400" />
  };

  // Render profile field with edit functionality
  const renderProfileField = (field, icon, isEditable = true) => {
    const fieldValue = field === 'email' ? user?.[field] : profile?.[field];
    
    return (
      <div className="bg-white shadow rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 capitalize">{field.replace('_', ' ')}</span>
            {editing.field === field ? (
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="text"
                  value={editing.value}
                  onChange={(e) => setEditing({ field, value: e.target.value })}
                  className="border p-1 rounded w-full"
                  placeholder={`Enter ${field}`}
                />
                <Save 
                  className="h-5 w-5 text-green-500 cursor-pointer" 
                  onClick={() => saveEdit(field)} 
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="text-gray-800 font-medium">
                  {fieldValue || 'Not set'}
                </span>
                {isEditable && (
                  <Edit3 
                    className="h-4 w-4 text-gray-500 cursor-pointer" 
                    onClick={() => handleEdit(field, fieldValue || '')} 
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="relative p-6">
          <div className="flex justify-center -mt-16 mb-6">
            <div className="relative">
              <img
                src={imageUrl}
                alt="Profile"
                className="h-32 w-32 rounded-xl border-4 border-white object-cover shadow-lg"
              />
              {!profile?.profile_picture && (
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer">
                  <Camera className="h-5 w-5 text-gray-600" />
                  <input type="file" className="hidden" onChange={uploadImage} />
                </label>
              )}
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          </div>

          <div className="space-y-4">
            {renderProfileField('designation', fieldIcons.designation)}
            {renderProfileField('about', fieldIcons.about)}
            {renderProfileField('phone', fieldIcons.phone)}
            {renderProfileField('location', fieldIcons.location)}
            {renderProfileField('email', fieldIcons.email, false)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;