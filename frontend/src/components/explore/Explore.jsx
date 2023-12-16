import { useEffect,useState,useCallback } from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
import Spinner from '../Spinner';
import BackButton from "../BackButton";

const Explore = () => {
    // const navigateTo = useNavigate();
    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    
    const [movie, setMovie] = useState({genres: []});
    const [movieCredits, setMovieCredits] = useState({cast: [],crew: []});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    // const handleReviewClick = () => {
    //     navigateTo.push({
    //         pathname: '/reviewMovie',
    //         state: { movieId: id } // Pass movieId as state
    //     });
    // };
    
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


    return (
        <div className='p-4 w-full'>
            <BackButton />
            <h1 className='text-3xl my-4'>Movie Info</h1>
            {loading ? (
                <Spinner />
            ) : (
                <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
                    <div className='my-4'>
                        <span className='text-xl mr-4 text-gray-500'>Id</span>
                        <span>{movie.id}</span>
                    </div>
                    <img className="w-full h-full object-cover" src={BASE_IMAGE_URL+movie.backdrop_path} alt={movie.title} />

                    <div className='my-4'>
                        <span className='text-xl mr-4 text-gray-500'>Title</span>
                        <span>{movie.title}</span>
                    </div>
                    <div className='my-4'>
                        <span className='text-xl mr-4 text-gray-500'>Release Date</span>
                        <span>{movie.release_date}</span>
                    </div>
                    <div className='my-4'>
                        <span className='text-xl mr-4 text-gray-500'>Runtime</span>
                        <span>{movie.runtime} minutes</span>
                    </div>
                    

                    <div className="my-4">
                        <span className="text-xl mr-4 text-gray-500">Genres</span>
                        {movie.genres && movie.genres.map((genre, index) => {
                            const isLastGenre = index === movie.genres.length - 1;
                            return (
                                <span key={genre.id}>
                                {genre.name}
                                {!isLastGenre && ", "}
                                </span>
                            );
                        })}
                    </div>



                    {/* Display Top 3 Cast Members */}
                    <div className='my-4'>
                        <span className='text-xl mr-4 text-gray-500'>Top 3 Cast Members</span>
                    <div>
                    {/* Assuming you want the top 3 cast members */}
                        {movieCredits.cast && movieCredits.cast.slice(0, 3).map((castMember, index) => (
                            <span key={castMember.id}>
                                {castMember.name}{index < 2 && ", "}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Display Director */}
                <div className='my-4'>
                    <span className='text-xl mr-4 text-gray-500'>Director</span>
                    <div>
                        {movieCredits.crew && (
                            movieCredits.crew
                                .filter((crewMember) => crewMember.job === "Director")
                                .map((director, index, array) => (
                                    <span key={director.id}>
                                        {director.name}{index < array.length - 1 && ", "}
                                    </span>
                                ))
                        )}
                    </div>
                </div>
                <div className='mt-8'>
                    <Link to={`/reviewMovie/${id}`} className='bg-blue-500 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded'>
                        Review this movie
                    </Link>
                </div>

            </div>
            )}
        </div>
    );
};

export default Explore;
