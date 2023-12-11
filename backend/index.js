import express from "express";
import {PORT,mongoDBURL} from './config.js'
import mongoose from 'mongoose';
import homeRoute from './routes/home.js'
import exploreRoute from './routes/explore.js'
import cors from "cors";


const app = express();

app.use(express.json());

app.use(cors());

app.get("/",(req,res)=>{
    return res.send("Welcome to  MovieMingle ");
})


app.use('/home', homeRoute);
app.use('/explore',exploreRoute);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });