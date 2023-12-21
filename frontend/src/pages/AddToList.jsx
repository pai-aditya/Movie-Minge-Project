import { Link,useParams ,useNavigate} from 'react-router-dom';
import { useCallback,useState,useEffect } from 'react';
import { SERVER_URL } from '../components/Constants';
import { MdOutlineAddBox } from 'react-icons/md';
import TitleCard from '../components/TitleCard';
import AddToListSingleCard from './AddToListSingleCard';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

const AddToList = () => {
    const [loading,setLoading] = useState(false);
    const [lists,setLists] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const { movieID } = useParams();
    const [movieTitle,setMovieTitle] = useState('');
    const navigateTo = useNavigate();
    const handleSelect = (itemId, isSelected) => {
        setSelectedItems((prevItems) => {
            return {
            ...prevItems,
            [itemId]: isSelected,
            };
        });
        };
    
    const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();


    try {
        const response = await fetch(`${SERVER_URL}/lists/addMovie`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieID, selectedItems ,movieTitle}),
            credentials: 'include',
        });
    
        const data = await response.json();
        if (data.success) {
            console.log("entering login success rout from the UI")
            setLoading(false);
            navigateTo("/yourlists");
        } else {
            setLoading(false);
            console.error('Registration failed:', data.message);
        }
        } catch (error) {
        setLoading(false);
        console.error('Registration failed:', error.message);
        }

    };
      

    const FetchMoviesData = useCallback(async () => {
        try{
            const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjAxMjQ5N2E1NzE2YjVlY2RhZWU2OWFkOWNiYWQyYSIsInN1YiI6IjY1NzQ0MWM0YTFkMzMyMDExYjRlNzZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FZcJY_lm3oMI6s80W1A6nhlvXC-HMOLBF8F3FvV5990'
            }
            };
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}`, options);
            const data = await response.json();
            // console.log(data);
            return data;
        } catch(error){
            console.log(error);
            return [];
        }
    },[movieID]);

    const FetchListsData = useCallback(async () => {
        try{
        const options = {
            method: 'GET',
            credentials:'include',
            headers: {
            'Content-Type': 'application/json',
            }
        };
            const response = await fetch(`${SERVER_URL}/lists/getLists`, options);
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
            try {
            const listsData = await FetchListsData();
            setLists(listsData.lists);
            console.log("this is the number of reviews: "+listsData.lists.length)
            setLoading(false);
            }
            catch (error) {
            console.log(error);
            setLoading(false);

            return [];
            }
        };
        fetchData();
        },[FetchListsData]);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const moviesData = await FetchMoviesData();
                setMovieTitle(moviesData.title);
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
    
    return (
        <div className='p-4 w-full bg-custom-primary-purple'>
        <BackButton />
        {loading ? (
            <Spinner />
        ) : (
        
            <div >
                <div className='flex items-center justify-between my-4 mr-4'>
                    <TitleCard />
                    <Link to='/createList' className='ml-auto' >
                        <MdOutlineAddBox className='text-custom-gold text-5xl' />
                    </Link>
                </div>
                    <div className='grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                        {lists.map((item) => (
                        <AddToListSingleCard key={item._id} list={item} handleSelect={handleSelect} />
                        ))}
                    </div>
                    <button 
                        onClick={handleSubmit} 
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
                    >
                        Submit
                    </button>
            </div>
        )}
        </div>
  );
};

export default AddToList;
