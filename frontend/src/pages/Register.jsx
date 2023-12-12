import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="relative w-full h-screen bg-custom-primary-purple">
      <div className="flex justify-center items-center h-full">
        <form className="max-w-[400px] w-full mx-auto p-8 rounded-lg bg-gray-800 text-white border-4 border-custom-gold">
          {/* Welcome text */}
          <div className="text-center text-2xl font-bold text-gray-200 mb-4">
            Join Us!
          </div>
          <img
            className="text-4xl font-bold text-center py-4 text-white"
            src="../../logo.svg"
          />
          {/* Username and password fields */}
          <div className="flex flex-col mb-4">
            <label htmlFor="username" className="text-sm text-gray-200">
              Username
            </label>
            <input
              id="username"
              className="border rounded-lg relative bg-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-white"
              type="text"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-200">
              Password
            </label>
            <input
              id="password"
              className="border rounded-lg relative bg-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-white"
              type="password"
            />
          </div>
          <button className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-500 relative text-white rounded-lg">
            Register
          </button>
          {/* Google login button */}
          <div className="flex justify-center py-8">
            <p className="px-6 py-2 relative flex items-center rounded-lg shadow-lg hover:shadow-xl bg-indigo-600 text-white">
              <FcGoogle className="mr-2" size={20} /> Google
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
