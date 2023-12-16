
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';

const Reviews = () => {
  const [reviewList,setReviewList] = useState([]);
  const [loading,setLoading] = useState(false);
  
  const FetchReviewsData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/getreviews`, options);
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
      const reviewListData = await FetchReviewsData();
      setReviewList(reviewListData.reviews);
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      setLoading(false);

      return [];
    }
  };
  fetchData();
},[FetchReviewsData])
  return (
    <div className='p-4 w-full'>
    { loading ? (
      <Spinner />
    ) : (
      <table className='w-full border-separate border-spacing-2'>
        <thead>
          <tr>
            <th className='border border-slate-600 rounded-md'>No</th>
            <th className='border border-slate-600 rounded-md'>MovieTitle</th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Review
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Rating
            </th>
            <th className='border border-slate-600 rounded-md'>Operations</th>
          </tr>
        </thead>
        <tbody>
          {reviewList.map((review, index) => (
            <tr key={review._id} className='h-8'>
              <td className='border border-slate-700 rounded-md text-center'>
                {index + 1}
              </td>
              <td className='border border-slate-700 rounded-md text-center'>
                {review.movieTitle}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                {review.reviewBody}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                {review.rating}
              </td>
              <td className='border border-slate-700 rounded-md text-center'>
                <div className='flex justify-center gap-x-4'>
                  <Link to={`/books/details/${review._id}`}>
                    <BsInfoCircle className='text-2xl text-green-800' />
                  </Link>
                  <Link to={`/books/edit/${review._id}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-600' />
                  </Link>
                  <Link to={`/books/delete/${review._id}`}>
                    <MdOutlineDelete className='text-2xl text-red-600' />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default Reviews;
