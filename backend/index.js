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
app.use(cors());
app.use(express.urlencoded({extended: true}));


app.use(cors({
  origin: `${process.env.CLIENT_URL}`,
  credentials: true,
}));



app.use(session({
  secret: "TheMovieVerseProject",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });


//all the routes
app.use('/home', homeRoute);
app.use('/explore',exploreRoute);


mongoose.connect(process.env.MONGO_CONNECTION);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String,
    displayName:String,
    photos:String,
    email:String
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
    User.findOrCreate({ username:profile.id, googleId: profile.id , displayName: profile.displayName, photos:profile._json.picture, email:profile._json.email}, function (err, user) {
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
    // Successful authentication, redirect home.
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


//NOT USED
app.post("/register",function(req,res){
  User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        return res.send({"there is some error":err.message})
      } else {
        passport.authenticate("local")(req, res, function(){
          return res.send({"success":`the user has been succesfully registered with username=${req.body.username} and password=${req.body.password}`});
        });
      }
    });
});


//TODO: NOT USED
app.post("/login",function(req,res){
  const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err){
      if (err) {
        console.log(err);
        return res.send({"failure":`the user has been not been logged in with username=${req.body.username} and password=${req.body.password}`});
      } else {
        passport.authenticate("local")(req, res, function(){
          return res.send({"success":`the user has been succesfully logged in with username=${req.body.username} and password=${req.body.password}`});
        });
      }
    });
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



app.get("/auth/test", (req,res) => {
  if (req.isAuthenticated()) {
    // Access the user's data from req.user
    res.json({ user: req.user });
  } else {
    console.log("enterint thissdfkhndsfiouh")
    res.status(401).json({ message: "Unauthorized" });
  }
});


app.get("/",(req,res)=>{
  return res.send("Welcome to  MovieVerse");
});

app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});

// mongoose
//   .connect(process.env.MONGO_CONNECTION)
//   .then(() => {
//     console.log('App connected to database');
//     app.listen(PORT, () => {
//       console.log(`App is listening to port: ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });