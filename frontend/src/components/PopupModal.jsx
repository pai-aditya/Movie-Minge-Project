import { useState,useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { SERVER_URL } from './Constants';
import { useNavigate } from 'react-router-dom';
const PopupModal = ({ title, contentMessage, buttonMessage, reviewMovieID, onClose }) => {

    const navigateTo = useNavigate();
    const [loading,setLoading] = useState(false);
    const handleDeleteReview = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const response = await fetch(`${SERVER_URL}/delete/review/${reviewMovieID}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
        });

        const data = await response.json();

        console.log('Deletion response:', data);
        if (data.success) {
            setLoading(false);
            onClose();
            navigateTo(0);
            // navigateTo("/profile");
            
        } else {
            setLoading(false);
            console.error('Registration failed:', data.message);
        }
        } catch (error) {
        setLoading(false);
        console.error('Registration failed:', error.message);
        }
    };
  
    return (
        <div className='fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center'>
        <div onClick={onClose} className='absolute inset-0 bg-black opacity-25'></div>
        <div className='relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6 text-center'>
            <button onClick={onClose} className='absolute top-3 right-3 text-gray-600 hover:text-gray-800 focus:outline-none'>
            <AiOutlineClose className='text-xl' />
            </button>
            <h2 className='text-2xl font-semibold mb-4'>{title}</h2>
            <p className='text-gray-700 mb-6'>{contentMessage}</p>
            <div className='flex justify-center'>
            <button
                onClick={handleDeleteReview}
                className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline'
            >
                {buttonMessage}
            </button>
            </div>
        </div>
        </div>
    );
};

export default PopupModal;
