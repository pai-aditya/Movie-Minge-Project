import { useState, useEffect,useCallback } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import {useNavigate, useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { SERVER_URL } from '../components/Constants';

const ListCreate = (userDetails) => {
  const [listDescription, setListDescription] = useState('');
  const [listName,setListName] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const [movieTitle,setMovieTitle] = useState('');
  const {id} = useParams();
  const authorName = userDetails.user.user.displayName;




  const handleSaveList = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        const response = await fetch(`${SERVER_URL}/lists/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ listName,listDescription }),
          credentials: 'include',
        });
  
        const data = await response.json();
  
        console.log('List creation response:', data);
        if (data.success) {
          setLoading(false);
          navigateTo("/yourlists");
          
        } else {
          setLoading(false);
          console.error('List creation failed:', data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error('List creation failed:', error.message);
      }
  };

  return (
    <div className='p-4'>
      <BackButton />
      {loading ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
       ) : (
        <div className='my-4 flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <h1 className='text-3xl my-4'>Create your list</h1>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>List created by</label>
          <p>{userDetails.user.user.displayName}</p>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>List name</label>
          <textarea
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            rows={1}
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>List Description</label>
          <textarea
            value={listDescription}
            onChange={(e) => setListDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            rows={4}
          />
        </div>
        <button className='p-2 font-bold bg-blue-500 hover:bg-blue-900 m-8 disabled:bg-slate-50 disabled:text-slate-500 ' 
          onClick={handleSaveList} 
          disabled={!listName || !listDescription}>
          Save Review
        </button>
      </div>
    
      )}
      </div>
      
  );
};

export default ListCreate;
