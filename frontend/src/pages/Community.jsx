
import { Link } from 'react-router-dom';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';

const Community = () => {
  const [userList,setUserList] = useState([]);
  const [loading,setLoading] = useState(false);
  // const [selectedReview, setSelectedReview] = useState(null);
  const FetchUserData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/alldata`, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);


useEffect(() => {
  setLoading(true);
  const fetchData = async () => {
    try {
      const userListData = await FetchUserData();
      setUserList(userListData.data);
      console.log("this is the number of reviews: "+userListData.reviews.length)
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      setLoading(false);

      return [];
    }
  };
  fetchData();
},[FetchUserData])


  return (
    <div className='p-4 w-full'>
    { loading ? (
      <Spinner />
    ) : (
      <table className='w-full border-separate border-spacing-2'>
        <thead>
          <tr>
            <th className='border border-slate-600 rounded-md'>No</th>
            <th className='border border-slate-600 rounded-md'>Name</th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Username/Email
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Reviews
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Watchlist
            </th>
            {/* <th className='border border-slate-600 rounded-md'>Operations</th> */}
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={user._id} className='h-8'>
              <td className='border border-slate-700 rounded-md text-center'>
                {index + 1}
              </td>
              <td className='border border-slate-700 rounded-md text-center'>
                {user.displayName}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                {user.username}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
              <Link to={`/reviews/${user._id}`} 
                  className='my-1 px-4 py-1 font-bold bg-blue-500 hover:bg-blue-900 inline-block rounded-md '>
                  View Reviews
                </Link>
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
              <Link to={`/watchlist/${user._id}`} 
                  className='my-1 px-4 py-1 font-bold bg-blue-500 hover:bg-blue-900 inline-block rounded-md '>
                  View Watchlist
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <div>
      </div>
    </div>
  );
};

export default Community;
