import { useState,useEffect,useCallback } from 'react'
import Spinner from '../components/Spinner';
import { SERVER_URL } from '../components/Constants';
import ListMoviesCard from '../components/ListMoviesCard';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
const ListView = () => {

  const [moviesList,setMoviesList] = useState([]);
  const [listTitle,setListTitle] = useState();
  const [loading, setLoading] = useState(false);
  const {listID} = useParams();

  const FetchListMoviesData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/lists/getList/${listID}`, options);
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
        const listMoviesData = await FetchListMoviesData();
        console.log("userdata recieved"+JSON.stringify(listMoviesData.watchlist));
        setListTitle(listMoviesData.title);
        setMoviesList(listMoviesData.movies);
        setLoading(false);
    }catch(err){
        console.log(err);
        setLoading(false);
    }
    };
    fetchData();
},[FetchListMoviesData])

  return (
    
    <div className='p-4 w-full bg-custom-primary-purple'>
    <BackButton />
      <div className='flex justify-between items-center pt-4 pb-8 text-custom-gold text-4xl font-bold'>
        {listTitle}
      </div>
        {loading ? (
        <Spinner />
        ) : (
        <ListMoviesCard movies={moviesList} listID={listID} deleteIcon={true}/>
      )}
    </div>
  )
}

export default ListView;