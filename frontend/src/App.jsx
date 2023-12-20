import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import Lists from './pages/Lists';
import Community from './pages/Community';
import Reviews from './pages/Reviews';
import Watchlist from './pages/Watchlist';
import Explore from './components/explore/Explore';
import Login from './pages/Login';
import Help from './pages/Help';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Success from './pages/Success';
import ReviewMovie from './pages/ReviewMovie';
import ListView from './pages/ListView';
import SpecificReview from './pages/SpecificReview';
import SpecificWatchlist from './pages/SpecificWatchlist';
import ListCreate from './pages/ListCreate';
import AddToList from './pages/AddToList'
import SpecificLists from './pages/SpecificLists'
import SpecificListView from './pages/SpecificListView';
import { SERVER_URL } from './components/Constants';
import { useState,useEffect } from 'react';


import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import {Home as HomeIcon,User,Settings,LifeBuoy,Users, BookText, List,ListChecks,LogIn,LogOut} from "lucide-react";


export const FetchUserData = async () => {
  try{
    const response = await fetch(`${SERVER_URL}/auth/check`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials:"include",
    });
    const data = await response.json();
    if (data.message === "Unauthorized") {
      console.log("User has not logged in");
      return null;
    }

    return data;
} catch(error){
    console.log(error);
    return null;
  }
};

const App = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(true);

  useEffect(() => {
    if (!user) {
      setShowLoginButton(true);
    }else{
      setShowLoginButton(false);
    }
  }, [user]);
	
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try{
        const userData = await FetchUserData();
        setUser(userData);
        setLoading(false);
      }catch(err){
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
    
      // fetch(`${SERVER_URL}/auth/check`,{
      //   credentials:"include"
      // })
      //   .then(response => {
      //     return response.json();
      //   })
      //   .then(data => {
      //     if(data.message==="Unauthorized"){
      //       console.log("user has not logged in");
      //       setLoading(false);
      //     }else{
      //       setUser(data);
      //       console.log("data from fetch user "+JSON.stringify(data));
      //       setLoading(false);
      //     }
          
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     setLoading(false);
      //   })


  },[]); 

  return (
    <div className="flex">
      <Sidebar user={user}>
        <SidebarItem icon={<HomeIcon    size={20} />} text="Home" link="/" />
        
        <hr className="my-3" />
        {showLoginButton ? (
          <div>
            <SidebarItem icon={<Users       size={20} />} text="MovieVerse Community" link="/community"/>
            <SidebarItem icon={<LogIn       size={20}   />} text="Login" link="/login"/>
          </div>
        ) :
        (
          <div>
            <SidebarItem icon={<User        size={20} />} text="Your Profile"         link="/profile" />
            <SidebarItem icon={<BookText    size={20} />} text="Your Reviews"         link="/yourreviews" />
            <SidebarItem icon={<List        size={20} />} text="Your Lists"           link="/yourlists"/>
            
            <SidebarItem icon={<ListChecks  size={20} />} text="Your Watchlist"       link="/yourwatchlist"/>
            <SidebarItem icon={<LogOut      size={20} />} text="Logout"               link="/logout"/>
          </div>
        )}
        
        <SidebarItem icon={<Settings size={20} />} text="Settings"  link="/yourreviews"/>
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help"      link="/help"/>
      </Sidebar>

      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/explore/:id"        element={<Explore />} />
        <Route path="/yourreviews"        element={user ? <Reviews      />  : <Login />}/>
        <Route path="/yourlists"          element={user ? <Lists        />  : <Login />}/>
        <Route path="/community"          element={<Community /> }/>
        <Route path="/yourwatchlist"      element={user ? <Watchlist    />  : <Login />}/>
        <Route path="/profile"            element={user ? <Profile     user={user} /> : <Login />}/>
        <Route path="/reviewMovie/:id"    element={user ? <ReviewMovie user={user} />   : <Login />}/>
        <Route path="/login"              element={<Login />} />
        <Route path="/help"               element={<Help />} />
        <Route path="/register"           element={<Register />} />
        <Route path="/logout"             element={user ? <Logout />            : <Login />}/>
        <Route path="/success"            element={user ? <Success />           : <Login />}/>
        <Route path="/reviews/:userID"    element={<SpecificReview /> }/>
        <Route path="/watchlist/:userID"  element={ <SpecificWatchlist />}/>
        <Route path="/lists/:userID"  element={ <SpecificLists />}/>
        <Route path="/viewlist/specific/:listID/:userID"   element={<SpecificListView />          }/>
        <Route path="/viewlist/:listID"   element={<ListView /> }/>
        <Route path="/createList"         element={user ? <ListCreate user={user} />        : <Login />}/>
        <Route path="/addToList/:movieID" element={user ? <AddToList  user={user} />        : <Login />}/>
        
      </Routes>
    </div>
  );
};

export default App;
