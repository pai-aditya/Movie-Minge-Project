import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
import session from "express-session";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";

const PORT = process.env.PORT || 5555;

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

const movieSchema = new mongoose.Schema({
  movieID: Number,
  movieTitle: String
})

const Movie = new mongoose.model("Movie",movieSchema);

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
    reviews: [reviewSchema],
    watchlist: [movieSchema]
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


/**
 * registers the new user
 */
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

/**
 * logs in the already registered user
 */
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



/**
 * checks if the user is authenticated or not 
 * if authenticated return the user details
 */
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



/**
 * submits the review posted by the user 
 */
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
  console.log("data recieved for submitting review: "+JSON.stringify(submittedReview));
  User.findById(req.user._id)
      .then(function(foundUser){
          if(foundUser){
            const existingReviewIndex = foundUser.reviews.findIndex(
              (review) => String(review.movieID) === String(submittedMovieID)
            );
    
            if (existingReviewIndex >= 0) {
              foundUser.reviews.splice(existingReviewIndex, 1);
            }
            foundUser.reviews.push(submittedReview)

            foundUser
              .save()
              .then(function(){
                res.status(200).json({ success: true, message: "Review saved successfully" });
              })
              .catch(function(err){
                console.log("entering this 2"+err.message);
                res.status(500).json({ success: false, message: "Review cannot be saved, something went wrong" });
              })
          }
      })
      .catch(function(err){
        console.log("entering this 1"+err.message);
        res.status(200).json({ success: false, message: "Review failed" });
      })
    

});


/**
 * get all the reviews list for this particular user
 */
app.get("/getreviews", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
      .populate("reviews")
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

/**
 * fetch all the reviews list for the given userID
 */
app.get("/reviews/:userID", (req, res) => {

  User.findById(req.params.userID)
    .populate("reviews")
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
  
});



/**
 * checks if this partiucular movie is already reviewed by the user,
 *  if yes returns the review details
 */
app.get("/reviewData/:movieID", (req, res) => {
  if (req.isAuthenticated()) {
    const movieID = req.params.movieID;

    User.findById(req.user._id)
      .populate("reviews") // Populate the 'reviews' field in the User model
      .exec()
      .then((user) => {
        if (user) {
          const userReviews = user.reviews;
          // Find the review with the matching movieID
          const matchedReview = userReviews.find(
            (review) => String(review.movieID) === movieID
          );

          if (matchedReview) {
            res.status(200).json({error:false, success:true, review: matchedReview });
          } else {
            res.status(200).json({error:false, success:false, message:"Review not found"});
          }
        } else {
          res.status(404).json({error:true, message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching user reviews:", err);
        res.status(500).json({error:true, message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

/**
 * deletes this particular review from the users review list
 */
app.delete("/delete/review/:movieID", function (req, res) {
  const movieIDToDelete = req.params.movieID;

  User.findById(req.user._id)
    .then(function (foundUser) {
      if (foundUser) {
        const reviewIndexToDelete = foundUser.reviews.findIndex(
          (review) => String(review.movieID) === String(movieIDToDelete)
        );

        if (reviewIndexToDelete >= 0) {
          foundUser.reviews.splice(reviewIndexToDelete, 1);

          foundUser
            .save()
            .then(function () {
              res.status(200).json({ success: true, message: "Review deleted successfully" });
            })
            .catch(function (err) {
              console.log("Error saving user after deletion:", err.message);
              res.status(500).json({ success: false, message: "Review deletion failed" });
            });

        } else {
          res.status(404).json({ success: false, message: "Review with the provided movieID not found" });
        }

      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    })
    .catch(function (err) {
      console.log("Error finding user:", err.message);
      res.status(500).json({ success: false, message: "Review deletion failed" });
    });
});


/**
 * adds the movie in the user's watchlist 
 */
app.post("/watchlist/addMovie",function(req,res){
  const submittedMovieID = req.body.id;
  const submittedMovieTitle = req.body.movieTitle;

  const submittedMovie = new Movie({
    movieID: submittedMovieID,
    movieTitle: submittedMovieTitle
  });
  console.log("data recieved for adding movie in watchlist: "+JSON.stringify(submittedMovie));
  User.findById(req.user._id)
      .then(function(foundUser){
          if(foundUser){
            // const existingReviewIndex = foundUser.reviews.findIndex(
            //   (review) => String(review.movieID) === String(submittedMovieID)
            // );
    
            // if (existingReviewIndex >= 0) {
            //   foundUser.reviews.splice(existingReviewIndex, 1);
            // }
            foundUser.watchlist.push(submittedMovie)

            foundUser
              .save()
              .then(function(){
                res.status(200).json({ success: true, message: "Movie added to watchlist successfully" });
              })
              .catch(function(err){
                res.status(500).json({ success: false, message: "Movie cannot be added to watchlist, something went wrong" });
              })
          }
      })
      .catch(function(err){
        res.status(200).json({ success: false, message: "Review failed" });
      })
    

});


/**
 * get all the movies from watchlist of this particular user
 */
app.get("/watchlist/getList", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user._id)
      .populate("watchlist")
      .exec()
      .then((user) => {
        if (user) {
          const userWatchlist = user.watchlist;
          res.status(200).json({ watchlist: userWatchlist });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching user watchlist:", err);
        res.status(500).json({ message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

/**
 * checks if this partiucular movie is already watchlisted by the user
 */
app.get("/watchlist/:movieID", (req, res) => {
  if (req.isAuthenticated()) {
    const movieID = req.params.movieID;

    User.findById(req.user._id)
      .populate("watchlist") 
      .exec()
      .then((user) => {
        if (user) {
          const watchlistMovies = user.watchlist;
          const matchedMovie = watchlistMovies.find(
            (movie) => String(movie.movieID) === movieID
          );

          if (matchedMovie) {
            res.status(200).json({error:false, success:true, message:"movie is found in the user's watchlist" });
          } else {
            res.status(200).json({error:false, success:false, message:"Movie not found in user's watchlist"});
          }
        } else {
          res.status(404).json({error:true, message: "User not found" });
        }
      })
      .catch((err) => {
        console.error("Error fetching user watchlist:", err);
        res.status(500).json({error:true, message: "Internal server error" });
      });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

/**
 * deletes this particular review from the users review list
 */
app.delete("/watchlist/delete/:movieID", function (req, res) {
  const movieIDToDelete = req.params.movieID;

  User.findById(req.user._id)
    .then(function (foundUser) {
      if (foundUser) {
        const movieIndexToDelete = foundUser.watchlist.findIndex(
          (movie) => String(movie.movieID) === String(movieIDToDelete)
        );

        if (movieIndexToDelete >= 0) {
          foundUser.watchlist.splice(movieIndexToDelete, 1);

          foundUser
            .save()
            .then(function () {
              res.status(200).json({ success: true, message: "Movie removed from watchlist successfully" });
            })
            .catch(function (err) {
              console.log("Error saving user after deletion:", err.message);
              res.status(500).json({ success: false, message: "Movie removal from watchlist failed" });
            });

        } else {
          res.status(404).json({ success: false, message: "Movie with the provided movieID not found in watchlist" });
        }

      } else {
        res.status(404).json({ success: false, message: "User not found" });
      }
    })
    .catch(function (err) {
      console.log("Error finding user:", err.message);
      res.status(500).json({ success: false, message: "Review deletion failed" });
    });
});

/**
 * fetch all watchlist for the given userID
 */
app.get("/watchlist/user/:userID", (req, res) => {

  User.findById(req.params.userID)
    .populate("watchlist")
    .exec()
    .then((user) => {
      if (user) {
        const userWatchlist = user.watchlist;
        res.status(200).json({ watchlist: userWatchlist });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      console.error("Error fetching user watchlist:", err);
      res.status(500).json({ message: "Internal server error" });
    });
  
});

/**
 * Endpoint to get the entire database (users and their associated data)
 */
app.get("/alldata", async (req, res) => {
  try {
    const allUserData = await User.find().populate("reviews").exec();
    res.status(200).json({ data: allUserData });
  } catch (error) {
    console.error("Error fetching entire database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Welcome message for the SERVER page
 */
app.get("/",(req,res)=>{
  return res.send("Welcome to  MovieVerse");
});
