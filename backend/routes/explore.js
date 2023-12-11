import express from 'express';
import axios from "axios";
import { API_KEY,BASE_URL } from '../config.js';

const SEARCH_URL = BASE_URL;

const router = express.Router();

router.get("/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const response = await axios.get(BASE_URL+"/movie/"+id+"?"+API_KEY);
        const result = response.data;
      return res.json(result);
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
});

router.get("/credits/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const response = await axios.get(BASE_URL+"/movie/"+id+"/credits?"+API_KEY);
        const result = response.data;
      return res.json(result);
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
});




export default router;