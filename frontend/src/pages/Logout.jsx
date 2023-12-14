import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../components/Constants';
const Login = () => {
  const logoutCall = () => {
    window.open(
      `${SERVER_URL}/auth/logout`,
      "_self"
    );
  };

  return (
    <div className="relative w-full h-screen bg-custom-primary-purple">
      <div className="flex justify-center items-center h-full">
        <form className="max-w-[400px] w-full mx-auto p-8 rounded-lg bg-gray-800 text-white border-4 border-custom-gold">
          {/* Welcome text */}
          <div className="text-center text-2xl font-bold text-gray-200 mb-4">
            Are you sure you want to Logout?
          </div>
          <img
            className="text-4xl font-bold text-center py-4 text-white"
            src="../../logo.svg"
          />
          <button type="button" className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white rounded-lg" onClick={logoutCall}>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
