import { useState,useEffect } from 'react'
import axios from "axios";
import Spinner from '../components/Spinner';
// import { Link } from 'react-router-dom';
// import { AiOutlineEdit } from 'react-icons/ai';
// import { BsInfoCircle } from 'react-icons/bs';
// import { MdOutlineAddBox } from 'react-icons/md';
import MoviesCard from "../components/home/MoviesCard";
import TitleCard from '../components/TitleCard';
import { backendApiUrl } from '../components/Constants';
import Sidebar, { SidebarItem } from "../components/Sidebar"
import {LayoutDashboard,BarChart3,UserCircle,Boxes,Package,Receipt,Settings,LifeBuoy} from "lucide-react"


const Home = () => {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1); // State to manage the current page number
    const [totalPages,setTotalPages]=useState(100);
    const [searchQuery, setSearchQuery] = useState('');
    // let totalPages = 100; // Assuming total number of pages is 100
    // const [showType,setShowType] = useState('card');

    useEffect(() => {
        setLoading(true);
      if(!searchQuery){
          
        axios
          .get(`${backendApiUrl}/home/${pageNo}`)
          .then((res) => {
            setMovies(res.data.results);
            setTotalPages(res.data.total_pages);
            setLoading(false);
          })
          .catch((err) => {
            console.log("entering error stage brooooo"+err);
            setLoading(false);
          });
        }else{
                axios
                .get(`${backendApiUrl}/home/search/${searchQuery}/${pageNo}`)
                .then((res) => {
                    setMovies(res.data.results); // Update movies state with the search results
                    setTotalPages(res.data.total_pages); // Update total pages if needed
                    setLoading(false); // Set loading state to false after data is fetched
            })  
            .catch((err) => {
                console.log("Error occurred while searching:", err);
                setLoading(false); // Set loading state to false in case of error
            });
        }

      }, [pageNo,totalPages,searchQuery]); 


      const goToNextPage = () => {
        if (pageNo < totalPages) {
          setPageNo(pageNo + 1); // Increment pageNo if not on the last page
        }
      };
    
      const goToPreviousPage = () => {
        if (pageNo > 1) {
          setPageNo(pageNo - 1); // Decrement pageNo if not on the first page
        }
      };

      

    // Existing code...

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };


    return (
        // <div className='bg-red-400 text-white'>Home</div>
        <div className='p-4 w-full bg-custom-primary-purple'>
      {/* <div className='flex justify-center items-center gap-x-4'>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
        //   onClick={() => setShowType('table')}
        >
          Table
        </button>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg'
        //   onClick={() => setShowType('card')}
        >
          Card
        </button>
      </div> */}
      <div className='flex justify-between items-center pt-4 pb-8'>

      


        {/* <h1 className='text-3xl my-8 text-white'>Movies List</h1> */}
        <TitleCard />
        {/* <Link to='/books/create'> */}
          {/* <MdOutlineAddBox className='text-sky-800 text-4xl' /> */}

          <div className='flex items-center'>
                    <input
                        type='text'
                        placeholder='Search a movie...'
                        className='border border-gray-300 px-4 py-2 rounded-lg mr-4 text-white bg-custom-primary-purple'
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    {/* <button
                        className='bg-sky-300 hover:bg-sky-600 px-4 py-2 rounded-lg'
                        onClick={handleSearch}
                    >
                        Search
                    </button> */}
            </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <MoviesCard movies={movies} />
      )}

      <div className='flex justify-center items-center mt-4'>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg mr-2'
          onClick={goToPreviousPage}
        >
          Previous Page
        </button>
        <p className='text-xl text-white'>{`Page ${pageNo} of ${totalPages}`}</p>
        <button
          className='bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg ml-2'
          onClick={goToNextPage}
        >
          Next Page
        </button>
      </div>
    </div>
    
    )
}

export default Home;