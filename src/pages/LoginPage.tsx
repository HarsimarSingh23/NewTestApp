import { LoginForm } from '../components/LoginForm';
import bannerImage from '../img/banner.jpg';
import crestImage from '../img/crest_round.png';

export function LoginPage() {
  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-40 w-auto mb-4"
          src={crestImage}
          alt="Company Logo"
        />
        <h1 className="text-center text-2xl font-extrabold text-white drop-shadow-xl tracking-wide">
          In Pursuit of Excellence with Speed and Accuracy
        </h1>
        
        <LoginForm />
      </div>
    </div>
  );
}
