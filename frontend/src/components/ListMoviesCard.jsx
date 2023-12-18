import ListMovieSingleCard from "./ListMovieSingleCard";
const ListMoviesCard = ({ movies }) => {
  return (
    <div className='grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {console.log("movies reciedved from wathclist"+JSON.stringify(movies))}
    
      {movies.map((item) => (
        <ListMovieSingleCard key={item.movieID} movie={item} />
      ))}
    </div>
  );
};

export default ListMoviesCard;
