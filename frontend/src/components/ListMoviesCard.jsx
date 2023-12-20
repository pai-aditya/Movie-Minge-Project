import ListMovieSingleCard from "./ListMovieSingleCard";
const ListMoviesCard = ({ movies,deleteIcon,listID }) => {
  return (
    <div className='grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
      {console.log("movies reciedved from wathclist"+JSON.stringify(movies))}
    
      {movies.map((item) => (
        <ListMovieSingleCard key={item.movieID} listID={listID} movie={item} deleteIcon={deleteIcon}/>
      ))}
    </div>
  );
};

export default ListMoviesCard;
