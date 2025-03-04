import { useState, useEffect } from 'react';
import { supabase } from '../backend/supabaseClient';
import bcrypt from 'bcryptjs';
import { useNavigate } from 'react-router-dom';


export function AddUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);

  // Access environment variable properly with VITE_ prefix
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin';

  // Check if Supabase is properly connected
  const checkSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('users').select('count', { count: 'exact', head: true });
      
      console.log(error)

      if (error) {
        setIsSupabaseConnected(false);
        setMessage(`Supabase connection error: ${error.message}`);
        setIsError(true);
      }
    } catch (error) {
      setIsSupabaseConnected(false);
      setMessage(`Supabase connection error: ${error.message}`);
      setIsError(true);
    }
  };

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsError(false);

    if (!isSupabaseConnected) {
      setMessage('Cannot create user: Supabase is not properly connected.');
      setIsError(true);
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim() || !designation.trim() || !adminPassword.trim()) {
      setMessage('All fields are required.');
      setIsError(true);
      return;
    }

    if (adminPassword !== ADMIN_PASSWORD) {
      console.log("value of adminpassword is ", adminPassword)
      setMessage('Invalid admin password. Access denied.');
      setIsError(true);
      return;
    }

    try {
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

       const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password 
      });
      
      if (authError) throw authError;
      
      if (authData.user) {

        const { error: profileError } = await supabase.from('users').insert([
          { 
            id: authData.user.id, 
            name, 
            email, 
            designation, 
            password_hash: passwordHash 
          }
        ]);
        
        if (profileError) throw profileError;

        setMessage('User created successfully!');
        setName('');
        setEmail('');
        setPassword('');
        setDesignation('');
        setAdminPassword('');
      }
    } catch (error) {
      setMessage(`Signup failed: ${error.message}`);
      setIsError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Create New User</h1>
        <form onSubmit={handleSignUp} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            id="name"
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email"
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700">Designation</label>
          <input 
            id="designation"
            type="designation" 
            placeholder="Designation" 
            value={designation} 
            onChange={(e) => setDesignation(e.target.value)} 
            required 
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">Enter Admin Password</label>
          <input 
            id="adminPassword"
            type="password" 
            placeholder="Admin Password" 
            value={adminPassword} 
            onChange={(e) => 
               setAdminPassword(e.target.value)} 
            required 
            className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={!isSupabaseConnected}
        >
          Create User
          
        </button>

      </form>
        {message && <div className={`mt-4 p-3 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}
      </div>
      <button className="mt-4 bg-gray-500 text-white p-2 rounded hover:bg-gray-600" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}
