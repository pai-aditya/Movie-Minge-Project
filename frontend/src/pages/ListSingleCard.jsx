import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';
import { SERVER_URL } from '../components/Constants';
import PopupModal from '../components/PopupModal';

const ListSingleCard = ({ list,deleteIcon,userID }) => {

  const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'];
  const [loading,setLoading] = useState(false);    
  const navigateTo = useNavigate();
  const linkToGo = deleteIcon ? `viewlist/${list._id}` : `viewlist/specific/${list._id}`; 
  const [showDeletePopup,setShowDeletePopup] = useState(false);
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const randomColor = getRandomColor();


  const handleDelete = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(`${SERVER_URL}/lists/deleteList/${list._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      console.log('Login response:', data);
      if (data.success) {
        setLoading(false);
        navigateTo(0);
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
    <div className={`max-w-xs rounded overflow-hidden shadow-lg relative ${randomColor} transition ease-in-out duration-200 hover:scale-105 hover:brightness-110 ml-4 mt-4 mb-4`}>
      <Link to={deleteIcon ? `/viewlist/${list._id}` : `/viewlist/specific/${list._id}/${userID}`} >
        <div className="flex justify-center items-center flex-col h-full mt-2 mb-8 mr-4 ml-4">
          <h2 className="text-2xl font-bold mb-2 text-white sm:text-3xl sm:mb-4">{list.title}</h2>
          <p className="text-base text-white sm:text-lg">{list.description}</p>
        </div>
      </Link>
      {deleteIcon && 
      <button onClick={handleDelete} className="absolute top-0 right-0 mt-2 mr-2" type="button">
        <MdOutlineDelete className="text-red-500 text-2xl" />
      </button>
      }

      {/* <div>
      
      {showDeletePopup && (
        <PopupModal
          title="Delete Card" 
          contentMessage="Are you sure you want to delete this list?" 
          buttonMessage="Delete"
          id={list._id}
          onClose={() => setShowDeletePopup(false)} />
      )}
      </div> */}
    </div>
  );
};

export default ListSingleCard;
