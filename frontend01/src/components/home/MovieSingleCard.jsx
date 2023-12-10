import { Link } from 'react-router-dom';


const MovieSingleCard = ({movie}) => {
    const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
    const image_url = movie.poster_path ? BASE_IMAGE_URL+movie.poster_path:"http://via.placeholder.com/1080x1580";
    // const image_url = BASE_IMAGE_URL+image_path;
    const overview = movie.overview;
    const movie_id = movie.id;
    const movie_title = movie.title;
    const rating = (movie.vote_average / 2).toFixed(1);
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg relative">
          <div className="h-4/5 relative">
            <img className="w-full h-full object-cover" src={image_url} alt={movie_title} />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Link to={`/reviews/${movie_id}`}>
                <div className="text-white text-center">
                  <p className="text-lg">{overview}</p>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                    Review
                  </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="h-1/5 bg-custom-purple bg-opacity-85 text-white text-center flex items-center justify-center">
            <p className="text-lg font-bold font-roboto mr-2">{movie_title}</p>
            <div className="bg-gray-800 text-white px-2 py-1 rounded">{rating}/5</div>
          </div>
        </div>
      );
}

export default MovieSingleCard;