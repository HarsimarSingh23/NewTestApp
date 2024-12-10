import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('src/img/banner.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto mb-4"
          src="src/img/crest.png"
          alt="Company Logo"
        />
        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
          Learning Platform
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}