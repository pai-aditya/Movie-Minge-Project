import { useState,useEffect,useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { SERVER_URL } from '../components/Constants';
import ListMoviesCard from '../components/ListMoviesCard';
import BackButton from '../components/BackButton';

const SpecificWatchlist = () => {

  const [watchlist,setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const {userID} = useParams();
  const FetchWatchlistData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/watchlist/user/${userID}`, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[userID]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
    try{
        const watchlistData = await FetchWatchlistData();
        console.log("watchlist for the custom user"+JSON.stringify(watchlistData))
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
    <BackButton />
      <div className='flex justify-between items-center pt-4 pb-8 text-custom-gold text-4xl font-bold'>
        Watchlist
      </div>
        {loading ? (
        <Spinner />
        ) : (
        <ListMoviesCard movies={watchlist} deleteIcon={false} />
      )}
    </div>
  )
}

export default SpecificWatchlist;