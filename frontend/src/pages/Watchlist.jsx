import { useState,useEffect,useCallback } from 'react'
import Spinner from '../components/Spinner';
import { SERVER_URL } from '../components/Constants';
import ListMoviesCard from '../components/ListMoviesCard';

const Watchlist = () => {

  const [watchlist,setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const FetchWatchlistData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/watchlist/getList`, options);
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
    try{
        const watchlistData = await FetchWatchlistData();
        console.log("userdata recieved"+JSON.stringify(watchlistData.watchlist));
        setWatchlist(watchlistData.watchlist);
        setLoading(false);
    }catch(err){
        console.log(err);
        setLoading(false);
    }
    };
    fetchData();
},[FetchWatchlistData])

  return (
    
    <div className='p-4 w-full bg-custom-primary-purple'>
      <div className='flex justify-between items-center pt-4 pb-8 text-custom-gold text-4xl font-bold'>
        Your Watchlist
      </div>
        {loading ? (
        <Spinner />
        ) : (
        <ListMoviesCard movies={watchlist} deleteIcon={false}/>
      )}
    </div>
  )
}

export default Watchlist;