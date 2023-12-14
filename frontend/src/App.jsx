import { Routes, Route } from 'react-router-dom';

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
import { SERVER_URL } from './components/Constants';
import { useState,useEffect } from 'react';
import axios from "axios";
// import { Navigate } from 'react-router-dom';


import Sidebar from './components/Sidebar'; // Import your Sidebar component
import SidebarItem from './components/SidebarItem';
import {Home as HomeIcon,User,Settings,LifeBuoy,Users, BookText, List,ListChecks,LogIn,LogOut} from "lucide-react";
import Spinner from './components/Spinner';

const App = () => {
  axios.defaults.withCredentials = true;

  // const logout = () => {
  //   window.open(
  //     `${SERVER_URL}/auth/logout`,
  //     "_self"
  //   );
  // };
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
      
    axios
      .get(`${SERVER_URL}/auth/test`)
      .then((res) => {
        setUser(res.data);
        console.log(JSON.stringify(res.data));
        setLoading(false);
        // setState(true);
      })
      .catch((err) => {
        console.log("entering error stage brooooo"+err);
        setLoading(false);
        // setState(false);
      });

  },[]); 

  return (
    <div className="flex">
      <Sidebar user={user}>
        <SidebarItem icon={<HomeIcon    size={20} />} text="Home" link="/" />
        
        <hr className="my-3" />
        {showLoginButton ? (
          <SidebarItem icon={<LogIn       size={20}   />} text="Login" link="/login"/>
        ) :
        (
          <div>
          <SidebarItem icon={<User        size={20} />} text="Your Profile" link="/profile" />
        <SidebarItem icon={<BookText    size={20} />} text="Your Reviews" link="/yourreviews" />
        <SidebarItem icon={<List        size={20}      />} text="Your Lists" link="/yourlists"/>
        <SidebarItem icon={<Users       size={20}     />} text="MovieVerse Community" link="/community"/>
        <SidebarItem icon={<ListChecks  size={20}/>} text="Your Watchlist" link="/yourwatchlist"/>
          <SidebarItem icon={<LogOut       size={20}   />} text="Logout" link="/logout"/>
          </div>
        )}
        
        <SidebarItem icon={<Settings size={20} />} text="Settings" link="/yourreviews"/>
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" link="/help"/>
      </Sidebar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore/:id" element={<Explore />} />
        <Route path="/yourreviews" element={user ? <Reviews user={user} /> : <Login />}/>
        <Route path="/yourlists" element={user ? <Lists user={user} /> : <Login />}/>
        <Route path="/community" element={user ? <Community user={user} /> : <Login />}/>
        <Route path="/yourwatchlist" element={user ? <Watchlist user={user} /> : <Login />}/>
        <Route path="/profile" element={user ? <Profile user={user} /> : <Login />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/help" element={<Help />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default App;
