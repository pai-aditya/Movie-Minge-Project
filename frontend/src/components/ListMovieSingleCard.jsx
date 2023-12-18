import { Link } from 'react-router-dom';
import { useState,useEffect,useCallback,} from 'react';
import Spinner from './Spinner';

const ListMovieSingleCard = ({movie}) => {
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
  const [loading,setLoading] = useState(false);
  const [movieData,setMovieData]=useState();
  const movie_id = movie.movieID;
  const movie_title = movie.movieTitle;

  const FetchMoviesData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjAxMjQ5N2E1NzE2YjVlY2RhZWU2OWFkOWNiYWQyYSIsInN1YiI6IjY1NzQ0MWM0YTFkMzMyMDExYjRlNzZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FZcJY_lm3oMI6s80W1A6nhlvXC-HMOLBF8F3FvV5990'
        }
      };
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}`, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[movie_id]);


  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
        try {
          const moviesData = await FetchMoviesData();
          setMovieData(moviesData);
          console.log("movie data reciegdve"+moviesData)
          setLoading(false);
        }
        catch (error) {
          console.log(error);
          setLoading(false);

          return [];
        }
      };
      fetchData();
},[FetchMoviesData])

  
  

  const image_url = movieData && movieData.poster_path ? BASE_IMAGE_URL+movieData.poster_path:"http://via.placeholder.com/1080x1580";
  // const image_url = BASE_IMAGE_URL+image_path;
  const overview = movieData && movieData.overview;
  
  const rating = movieData ? ( movieData.vote_average / 2).toFixed(1) : 0;
  return (
    
    <div className="max-w-xs rounded overflow-hidden shadow-lg relative">
     {loading ? (
       <Spinner />
     ) : (
        <div className="h-4/5 relative">
          <img className="w-full h-full object-cover" src={image_url} alt={movie_title} />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Link to={`/explore/${movie_id}`}>
              <div className="text-white text-center">
                <p className="text-xs">{overview}</p>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                  Explore
                </button>
              </div>
            </Link>
          </div>
        </div>
        )}
        <div className="h-1/5 bg-custom-title bg-opacity-85 text-white text-center flex items-center justify-center">
          <p className="text-lg font-bold font-roboto mr-2">{movie_title}</p>
          <div className="bg-custom-primary-purple text-custom-gold font-bold px-2 py-1 rounded">{rating}/5</div>
        </div>
    </div>
)}

export default ListMovieSingleCard;