import { Link } from 'react-router-dom';
import { useState } from 'react';

const AddToListSingleCard = ({ list,handleSelect }) => {

  const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'];
  const [selected, setSelected] = useState(false);

  
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };
  const randomColor = getRandomColor();

  const handleSelectChange = () => {
    setSelected(!selected);
    handleSelect(list._id, !selected); // Pass the selected ID and its state to the parent
  };


  return (
    <div className={`max-w-xs rounded overflow-hidden shadow-lg relative py-4 
                    px-4 ml-4 mt-4 mb-4 ${randomColor} transition ease-in-out 
                    duration-200 hover:scale-105 hover:brightness-110`}>
      <div className="flex justify-center mt-2 mb-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleSelectChange}
          className="form-checkbox h-5 w-5 text-gray-600 focus:ring-0 border-gray-300 rounded-md"
        />
      </div>
      <Link to={`/viewlist/${list._id}`} className="block">
        <div className="flex justify-center items-center flex-col h-full">
          <h2 className="text-2xl font-bold mb-2 text-white sm:text-3xl sm:mb-4">{list.title}</h2>
          <p className="text-base text-white sm:text-lg">{list.description}</p>
        </div>
      </Link>
      
    </div>

  );
};

export default AddToListSingleCard;
