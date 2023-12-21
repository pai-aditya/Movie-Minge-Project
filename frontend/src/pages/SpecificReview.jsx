
import { useParams } from 'react-router-dom';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';
import Rating from "@mui/material/Rating";
import BackButton from '../components/BackButton';

const Reviews = () => {
  const [reviewList,setReviewList] = useState([]);
  const [loading,setLoading] = useState(false);
  const {userID} = useParams();
  const FetchReviewsData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/review/getreviews/${userID}`, options);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[userID]);

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
},[FetchReviewsData])
  return (
    <div className='p-4 w-full bg-custom-primary-purple text-white'>
    <BackButton />
    { loading ? (
      <Spinner />
    ) : (
      <table className='w-full mt-2 border-separate border-spacing-2'>
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
            {/* <th className='border border-slate-600 rounded-md'>Operations</th> */}
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
              {/* <td className='border border-slate-700 rounded-md text-center'>
                <div className='flex justify-center gap-x-4'>
                  <Link to={`/explore/${review.movieID}`}>
                    <BsInfoCircle className='text-2xl text-green-800' />
                  </Link>
                  {/*edit symbol */}
                  {/* <Link to={`/reviewMovie/${review.movieID}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-600' />
                  </Link> */}
                  {/* <Link to={`/books/delete/${review._id}`}> */}
                  {/* <button onClick={() => handleDeleteClick(review)} type="button" className="focus:outline-none">
                    <MdOutlineDelete className='text-2xl text-red-600' />
                  </button> */}
                  {/* </Link> */}
                {/* </div> */}
              {/* </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <div>
      </div>
    </div>
  );
};

export default Reviews;
