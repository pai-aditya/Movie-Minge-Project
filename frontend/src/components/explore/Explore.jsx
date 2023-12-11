import axios from 'axios';
import { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../Spinner';
import BackButton from "../BackButton";
import { backendApiUrl } from '../Constants';

const Explore = () => {
    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    
    const [movie, setMovie] = useState({genres: []});
    const [movieCredits, setMovieCredits] = useState({cast: [],crew: []});
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        axios
        .get(`${backendApiUrl}/explore/${id}`)
        .then((response) => {
            setMovie(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });

        axios
        .get(`${backendApiUrl}/explore/credits/${id}`)
        .then((response) => {
            setMovieCredits(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });

                
    }, []);
    

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






            </div>
        )}
        </div>
    );
};

export default Explore;
