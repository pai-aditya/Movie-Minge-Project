import express from 'express';
import axios from "axios";
import mongoose from 'mongoose';

const API_KEY = "api_key=bb012497a5716b5ecdaee69ad9cbad2a";
const BASE_URL = "https://api.themoviedb.org/3"
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`; // Template literal
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`
const router = express.Router();

const reviewSchema = {
    movieTitle: String,
    movieID: String,
    rating: Number,
    reviewBody: String
  }
  
const Review = mongoose.model("Review",reviewSchema);

router.get("/:pageNo", async (req, res) => {
    try {
      // const pageNo = req.body.pageNo;
      const {pageNo}=req.params;
      const PAGE_URL = "&page="+pageNo;
      const response = await axios.get(API_URL+PAGE_URL);
      const result = response.data;
      return res.json(result);
      
    } catch (error) {
      console.error("Failed to make request:", error.message);
    }
  });

  router.get("/search/:searchQuery/:pageNo", async (req, res) => {
    try {
      // const pageNo = req.body.pageNo;
      const {pageNo}=req.params;
      const PAGE_URL = "&page="+pageNo;
      const {searchQuery} = req.params;
      const SEARCH_QUERY_URL = "&query="+searchQuery;
      const response = await axios.get(SEARCH_URL+SEARCH_QUERY_URL+PAGE_URL);
      const result = response.data;
      return res.json(result);
      
    } catch (error) {
      console.error("Failed to make request:", error.message);
    }
  });

router.post("/review",async(req,res)=>{
    try {
        if (
          !req.body.movieTitle ||
          !req.body.movieID ||
          !req.body.rating ||
          !req.body.reviewBody
        ) {
          return res.status(400).send({
            message: 'Send all required fields: title, author, publishYear',
          });
        }
        // const newReview ={
        //     movieTitle: "Kabir Singh",
        //     movieID: "movieID",
        //     rating: "3.5",
        //     reviewBody: "This is my review"
        // }
        const newReview ={
            movieTitle: req.body.movieTitle,
            movieID: req.body.movieID,
            rating: req.body.rating,
            reviewBody: req.body.reviewBody
        }
    
        const review = await Review.create(newReview);
    
        return res.status(201).send(review);
      } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
      }
})
export default router;