import express from "express";
import {PORT} from './config.js'
import mongoose from 'mongoose';
import homeRoute from './routes/home.js'
import exploreRoute from './routes/explore.js'
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use(express.json());

app.use(cors());

app.get("/",(req,res)=>{
    return res.send("Welcome to  MovieVerse");
})


app.use('/home', homeRoute);
app.use('/explore',exploreRoute);


mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });