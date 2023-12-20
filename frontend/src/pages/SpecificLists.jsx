import { Link, useParams } from 'react-router-dom';
import { useCallback,useState,useEffect } from 'react';
import { SERVER_URL } from '../components/Constants';
import { MdOutlineAddBox } from 'react-icons/md';
import TitleCard from '../components/TitleCard';
import ListSingleCard from './ListSingleCard';
import Spinner from '../components/Spinner';
import BackButton from '../components/BackButton';

const SpecificLists = () => {
    const [loading,setLoading] = useState(false);
    const [lists,setLists] = useState([]);
    const {userID} = useParams();
    const FetchListsData = useCallback(async () => {
        try{
          const options = {
            method: 'GET',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json',
            }
          };
            const response = await fetch(`${SERVER_URL}/lists/getLists/${userID}`, options);
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
        <BackButton />
        {loading ? (
            <Spinner />
        ) : (      
        
            <div>
                <div className='flex items-center justify-between my-4 mr-4'>
                    <TitleCard />
                    {/* <Link to='/createList' className='ml-auto' >
                        <MdOutlineAddBox className='text-sky-800 text-5xl' />
                    </Link> */}
                </div>
                <div className='grid xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                    {lists.map((item) => (
                    <ListSingleCard key={item._id} list={item} deleteIcon={false} userID={userID}/>
                    ))}
                </div>
            </div>
        )}
        </div>
  );
};

export default SpecificLists;
