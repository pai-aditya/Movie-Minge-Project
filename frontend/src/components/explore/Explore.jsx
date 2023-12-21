import { useEffect,useState,useCallback } from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
import Spinner from '../Spinner';
import BackButton from "../BackButton";
import { SERVER_URL } from '../Constants';
import { FetchUserData } from '../../App';

const Explore = () => {
  const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
  const navigateTo = useNavigate();
  const [movie, setMovie] = useState({genres: []});
  const [movieCredits, setMovieCredits] = useState({cast: [],crew: []});
  const [user,setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const addWatchlistButtonText = "Add to Watchlist";
  const removeWatchlistButtonText = "Remove from Watchlist";
  const [watchlistButtonText, setWatchlistButtonText] = useState(addWatchlistButtonText);
  const { id } = useParams();
    

    const handleWatchlist = async (e) => {
      setLoading(true);
      e.preventDefault();
      const movieTitle = movie.title;
      if(watchlistButtonText===removeWatchlistButtonText){
        try {
          const response = await fetch(`${SERVER_URL}/watchlist/delete/${id}`, {
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
            navigateTo("/yourwatchlist");
            
        } else {
            setLoading(false);
            console.error('Deletion failed:', data.message);
        }
        } catch (error) {
        setLoading(false);
        console.error('Deletion failed:', error.message);
        }
      }else{
        try {
          const response = await fetch(`${SERVER_URL}/watchlist/addMovie`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id,movieTitle }),
            credentials: 'include',
          });
    
          const data = await response.json();
    
          console.log('Watchlist response:', data);
          if (data.success) {
            setLoading(false);
            navigateTo("/yourwatchlist");
          } else {
            setLoading(false);
            console.error('Registration failed:', data.message);
          }
        } catch (error) {
          setLoading(false);
          console.error('Registration failed:', error.message);
        }
      }
      
    };

    
    const FetchWatchlistData = useCallback(async () => {
      try{
          const options = {
              method: 'GET',
              credentials:'include',
              headers: {
                  accept: 'application/json',
              }
          };
          const response = await fetch(`${SERVER_URL}/watchlist/${id}`, options);
          const data = await response.json();
          return data;
      } catch(error){
          console.log(error);
          return [];
      }
    },[id]);

    const FetchMoviesData = useCallback(async () => {
        try{
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjAxMjQ5N2E1NzE2YjVlY2RhZWU2OWFkOWNiYWQyYSIsInN1YiI6IjY1NzQ0MWM0YTFkMzMyMDExYjRlNzZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FZcJY_lm3oMI6s80W1A6nhlvXC-HMOLBF8F3FvV5990'
            }
          };
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, options);
            const data = await response.json();
            console.log(data);
            return data;
        } catch(error){
            console.log(error);
            return [];
        }
      },[id]);

      const FetchMoviesDataCredits = useCallback(async () => {
        try{
          const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjAxMjQ5N2E1NzE2YjVlY2RhZWU2OWFkOWNiYWQyYSIsInN1YiI6IjY1NzQ0MWM0YTFkMzMyMDExYjRlNzZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FZcJY_lm3oMI6s80W1A6nhlvXC-HMOLBF8F3FvV5990'
            }
          };
            const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, options);
            const data = await response.json();
            console.log(data);
            return data;
        } catch(error){
            console.log(error);
            return [];
        }
      },[id]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
        try{
            const userData = await FetchUserData();
            setUser(userData);
            setLoading(false);
        }catch(err){
            console.log(err);
            setLoading(false);
        }
        };
        fetchData();
    },[])

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
              const moviesData = await FetchMoviesData();
              setMovie(moviesData);
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

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
              const moviesData = await FetchMoviesDataCredits();
              setMovieCredits(moviesData);
              setLoading(false);
            }
            catch (error) {
              console.log(error);
              setLoading(false);

              return [];
            }
          };
          fetchData();
    },[FetchMoviesDataCredits])

    useEffect(() => {
      setLoading(true);
      const fetchWatchlistData = async () => {
          try {
            const reviewData = await FetchWatchlistData();
            console.log("review data recieved"+JSON.stringify(reviewData))
            if(!reviewData.error && reviewData.success){
              setWatchlistButtonText(removeWatchlistButtonText);
            }
            setLoading(false);
          }
          catch (error) {
            console.log(error);
            setLoading(false);
            return [];
          }
        };
        fetchWatchlistData();
  },[FetchWatchlistData])
  
    return (
        <div className="p-4 w-full bg-custom-primary-purple text-white">
            <BackButton />
            {loading ? (
                <Spinner />
            ) : (
                <div className=" w-full  ">
                    
                    <div className="max-w-md mx-auto bg-white  rounded-xl shadow-md overflow-hidden md:max-w-2xl border-4 border-blue-500">
                        <img
                            className="w-full  object-cover"
                            src={BASE_IMAGE_URL + movie.backdrop_path}
                            alt={movie.title}
                        />
                        <div className="p-4 bg-gray-900 text-white">
                            <h2 className="text-xl font-bold text-5xl mb-1 flex justify-center">{movie.title}</h2>
                            <p className="text-gray-400  flex justify-center text-2xl">{String(movie.release_date).substring(0,4)}</p>
                            <p className="text-gray-400 mb-1 text-xl">
                                <span className="font-semibold text-2xl mr-3">Runtime</span> {movie.runtime} minutes
                            </p>
                            <p className="text-gray-400 mb-1 text-xl">
                                <span className="font-semibold text-2xl mr-3">Genres</span>{' '}
                                {movie.genres &&
                                    movie.genres.map((genre, index) => (
                                        <span key={genre.id}>
                                            {genre.name}
                                            {index !== movie.genres.length - 1 && ', '}
                                        </span>
                                    ))}
                            </p>
                            <p className="text-gray-400 mb-1 text-xl">
                                <span className="font-semibold text-2xl mr-3">Cast</span>{' '}
                                {movieCredits.cast &&
                                    movieCredits.cast
                                        .slice(0, 3)
                                        .map((castMember, index) => (
                                            <span key={castMember.id}>
                                                {castMember.name}
                                                {index !== 2 && ', '}
                                            </span>
                                        ))}
                            </p>
                            <p className="text-gray-400 mb-1 text-xl">
                                <span className="font-semibold text-2xl mr-3">Director</span>{' '}
                                {movieCredits.crew &&
                                    movieCredits.crew
                                        .filter((crewMember) => crewMember.job === 'Director')
                                        .map((director) => (
                                            <span key={director.id}>{director.name}</span>
                                        ))}
                            </p>
                            <div className='flex justify-center'>
                            <div className="mt-2 mr-2">
                                <Link
                                    to={`/reviewMovie/${id}`}
                                    className="bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded inline-block">
                                    Review
                                </Link>
                            </div>
                            <div className="mt-2  mr-2" >
                                <button
                                    onClick={handleWatchlist}
                                    className="bg-pink-500 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded inline-block disabled:bg-gray-500 disabled:text-gray-300"
                                    disabled={!user}>
                                    {watchlistButtonText}
                                </button>
                            </div>
                            <div className="mt-2 mr-2">
                              <Link to={`/addToList/${id}`} className="mt-2">
                                  <button
                                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-block disabled:bg-gray-500 disabled:text-gray-300"
                                      disabled={!user}>
                                      Add to a List
                                  </button>
                              </Link>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Explore;
