import express from "express";
import {PORT} from './config.js'
import mongoose from 'mongoose';
import homeRoute from './routes/home.js'
import exploreRoute from './routes/explore.js'
import cors from "cors";
import dotenv from 'dotenv';

// import authRoute from "./routes/auth.js";


import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true,
}));
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: "TheMovieVerseProject",
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


//all the routes
app.use('/home', homeRoute);
app.use('/explore',exploreRoute);


mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT} at ${new Date()}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


const reviewSchema = new mongoose.Schema({
  movieID : Number,
  rating: Number,
  reviewBody: String,
  movieTitle: String
});
const Review = new mongoose.model("Review",reviewSchema);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
    displayName:String,
    photos: String,
    reviews: [reviewSchema]
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
  },
  function(accessToken, refreshToken, profile, callback) {
    console.log(profile);
    User.findOrCreate({ username:profile._json.email, googleId: profile.id , displayName: profile.displayName, photos:profile._json.picture, email:profile._json.email}, function (err, user) {
      return callback(err, user);
    });
  }
));

app.get("/auth/google",
    passport.authenticate("google", {scope:["profile","email"]})
);


app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/auth/login/failed" }),
  function(req, res) {
    return res.redirect(`${process.env.CLIENT_URL}/profile`);
  }
);

app.get("/auth/login/failed", (req, res) => {
	res.status(401).json({
		error: true,
		message: "Log in failure",
	});
});

app.get("/auth/logout",function(req,res){
  req.logOut(function(err){
      if(err){
          console.log("logout error: "+err);
      }
  });
  res.redirect(`${process.env.CLIENT_URL}`)
});


app.post("/register",function(req,res){
  console.log("entering register api with username: "+req.body.username+" password: "+req.body.password+" with the displayName: "+req.body.displayName);
  User.register({username: req.body.username, displayName: req.body.displayName}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Registration failed" });

      } else {
        passport.authenticate("local")(req, res, function(){
          console.log("entering yesssss")
          res.status(200).json({ success: true, message: "Registration successful" });
        });
      }
    });
});


app.post("/login",function(req,res){
  console.log("entering register api with username: "+req.body.username+" password: "+req.body.password);
  const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Login failed" });
      } else {
        passport.authenticate("local")(req, res, function(){
          res.status(200).json({ success: true, message: "Registration successful" });
        });
      }
    });
});

app.post("/submit/review",function(req,res){
  const submittedMovieID = req.body.id;
  const submittedRating = req.body.rating;
  const submittedReviewBody = req.body.reviewBody;
  const submittedMovieTitle = req.body.movieTitle;

  const submittedReview = new Review({
    movieID: submittedMovieID,
    rating: submittedRating,
    reviewBody: submittedReviewBody,
    movieTitle: submittedMovieTitle
  });
  console.log("tesyt why not working"+JSON.stringify(req.user));
  User.findById(req.user._id)
      .then(function(foundUser){
          if(foundUser){
            foundUser.reviews.push(submittedReview);
            
            foundUser.save()
              .then(function(){
                res.status(200).json({ success: true, message: "Review saved successfully" });
              })
              .catch(function(err){
                res.status(500).json({ success: false, message: "Review cannot be saved, something went wrong" });
              })
          }
      })
      .catch(function(err){
        res.status(200).json({ success: false, message: "Review failed" });
      })
    

});

//TODO
// app.get("/auth/login/success", (req, res) => {
//   console.log("these are my cookiuess"+req);
// 	if (req.user) {
// 		res.status(200).json({
// 			error: false,
// 			message: "Successfully Loged In",
// 			user: req.user,
// 		});
// 	} else {
//     console.log("enteringingingingin with dont know");
// 		res.status(403).json({ error: true, message: "Not Authorized" });
// 	}
// });


app.get("/auth/check", (req,res) => {
  if (req.isAuthenticated()) {
    // Access the user's data from req.user
    console.log(JSON.stringify(req.user));
    res.json({ user: req.user });
  } else {
    console.log(`entering not authenticated phase at ${new Date()}`);
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/getreviews", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
      .populate("reviews") // Populate the 'reviews' field in the User model
      .exec()
      .then((user) => {
        if (user) {
          const userReviews = user.reviews;
          res.status(200).json({ reviews: userReviews });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});



app.get("/",(req,res)=>{
  return res.send("Welcome to  MovieVerse");
});
