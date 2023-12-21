import { Link } from 'react-router-dom';
import { useCallback,useState,useEffect } from 'react';
import { SERVER_URL } from '../components/Constants';
import { MdOutlineAddBox } from 'react-icons/md';
import TitleCard from '../components/TitleCard';
import ListSingleCard from './ListSingleCard';
import Spinner from '../components/Spinner';
const Lists = () => {
    const [loading,setLoading] = useState(false);
    const [lists,setLists] = useState([]);

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
      },[FetchListsData])
    
    return (
        <div className='p-4 w-full bg-custom-primary-purple'>
        {loading ? (
            <Spinner />
        ) : (      
            <div>
                <div className='flex items-center justify-between my-4 mr-4'>
                    <TitleCard />
                    <Link to='/createList' className='ml-auto' >
                        <MdOutlineAddBox className='text-custom-gold text-5xl' />
                    </Link>
                </div>
                <div className='grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                    {lists.map((item) => (
                    <ListSingleCard key={item._id} list={item} deleteIcon={true} />
                    ))}
                </div>
            </div>
        )}
        
        </div>
  );
};

export default Lists;
