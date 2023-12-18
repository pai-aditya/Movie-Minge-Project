import { useState, useEffect,useCallback } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import {useNavigate, useParams } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { SERVER_URL } from '../components/Constants';

const ReviewMovie = (userDetails) => {
  const [reviewBody, setReviewBody] = useState('');
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();

  const [movieTitle,setMovieTitle] = useState('sample');
  const {id} = useParams();
  const authorName = userDetails.user.user.displayName;

const FetchMoviesData = useCallback(async () => {
    try{
        const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYjAxMjQ5N2E1NzE2YjVlY2RhZWU2OWFkOWNiYWQyYSIsInN1YiI6IjY1NzQ0MWM0YTFkMzMyMDExYjRlNzZiZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FZcJY_lm3oMI6s80W1A6nhlvXC-HMOLBF8F3FvV5990'
        }
        };
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, options);
        const data = await response.json();
        // console.log(data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
},[id]);

const FetchReviewData = useCallback(async () => {
    try{
        const options = {
            method: 'GET',
            credentials:'include',
            headers: {
                accept: 'application/json',
            }
        };
        const response = await fetch(`${SERVER_URL}/reviewData/${id}`, options);
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
},[id]);


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

useEffect(() => {
    setLoading(true);
    const fetchReviewData = async () => {
        try {
          const reviewData = await FetchReviewData();
          console.log("review data recieved"+JSON.stringify(reviewData))
          if(!reviewData.error && reviewData.success){
            setReviewBody(reviewData.review.reviewBody);
            setRating(reviewData.review.rating);
            console.log("reviewBody = "+reviewBody+" movie rating "+rating);
          }
          setLoading(false);
        }
        catch (error) {
          console.log(error);
          setLoading(false);
          return [];
        }
      };
      fetchReviewData();
},[FetchReviewData])



  const handleSaveReview = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        const response = await fetch(`${SERVER_URL}/submit/review`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, rating, reviewBody,movieTitle }),
          credentials: 'include',
        });
  
        const data = await response.json();
  
        console.log('Registration response:', data);
        if (data.success) {
          setLoading(false);
          navigateTo("/");
          // navigateTo("/profile");
          
        } else {
          setLoading(false);
          console.error('Review post failed:', data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error('Review post failed:', error.message);
      }
  };

  return (
    <div className='p-4'>
      <BackButton />
      {loading ? (
        <Spinner />
       ) : (
        <div className='my-4 flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <h1 className='text-3xl my-4'>Write your movie review</h1>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Movie</label>
          <p>{movieTitle}</p>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Review by</label>
          <p>{authorName}</p>
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Your Review</label>
          <textarea
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            rows={4}
          />
        </div>
        <div className='my-4 flex justify-center item-center'>
          {/* <label className='text-xl mr-4 text-gray-500'>Rating</label> */}
          <Rating
            name="movie-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={0.5}
            size='large'
            sx={{ fontSize: '4rem' }} 
          />
        </div>
        <button className='p-2 font-bold bg-blue-500 hover:bg-blue-900 m-8 disabled:bg-slate-50 disabled:text-slate-500 ' onClick={handleSaveReview} disabled={!reviewBody || !rating}>
          Save Review
        </button>
      </div>
    
      )}
      </div>
      
  );
};

export default ReviewMovie;
