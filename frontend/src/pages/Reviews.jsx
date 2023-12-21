
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';
import PopupModal from '../components/PopupModal';
import Rating from "@mui/material/Rating";
import TitleCard from '../components/TitleCard';

const Reviews = () => {
  const [reviewList,setReviewList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  
  const FetchReviewsData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/review/getreviews`, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

  const handleDeleteClick = (review) => {
    setShowDeletePopup(true);
    setSelectedReview(review.movieID)
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const reviewListData = await FetchReviewsData();
        setReviewList(reviewListData.reviews);
        console.log("this is the number of reviews: "+reviewListData.reviews.length)
        setLoading(false);
      }
      catch (error) {
        console.log(error);
        setLoading(false);

        return [];
      }
    };
    fetchData();
  },[FetchReviewsData]);

  return (
    <div className='p-4 w-full bg-custom-primary-purple text-white'>
      <div className='flex items-center justify-beteween my-4 mr-4 '>
        <TitleCard />
      </div>
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
              <td className='border border-slate-700 rounded-md text-center bg-custom-gold font-bold'>
                {review.movieTitle}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-custom-purple'>
                {review.reviewBody}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                <Rating
                name="movie-rating"
                readOnly
                value={review.rating}
                precision={0.5}
                size='small' 
              />
              </td>
              <td className='border border-slate-700 rounded-md text-center '>
                <div className='flex justify-center gap-x-4'>
                  <Link to={`/explore/${review.movieID}`}>
                    <BsInfoCircle className='text-2xl text-green-500' />
                  </Link>
                  {/*edit symbol */}
                  <Link to={`/reviewMovie/${review.movieID}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-500' />
                  </Link>
                  <button onClick={() => handleDeleteClick(review)} type="button" className="focus:outline-none">
                    <MdOutlineDelete className='text-2xl text-red-500' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <div>
      
      {showDeletePopup && (
        <PopupModal
          title="Delete Review" 
          contentMessage="Are you sure you want to delete this review?" 
          buttonMessage="Delete"
          id={selectedReview}
          onClose={() => setShowDeletePopup(false)} />
      )}
      </div>
    </div>
  );
};

export default Reviews;
