import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lists from './pages/Lists';
import Community from './pages/Community';
import Reviews from './pages/Reviews';
import Watchlist from './pages/Watchlist';

import Explore from './components/explore/Explore';
import Login from './pages/Login';
import Sidebar from './components/Sidebar'; // Import your Sidebar component
import SidebarItem from './components/SidebarItem';
import {Home as HomeIcon,Settings,LifeBuoy,Users, BookText, List,ListChecks,LogIn} from "lucide-react";


const App = () => {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<HomeIcon    size={20} />} text="Home" link="/" />
        <SidebarItem icon={<BookText    size={20} />} text="Your Reviews" link="/yourreviews" />
        <SidebarItem icon={<List        size={20}      />} text="Your Lists" link="/yourlists"/>
        <SidebarItem icon={<Users       size={20}     />} text="MovieVerse Community" link="/community"/>
        <SidebarItem icon={<ListChecks  size={20}/>} text="Your Watchlist" link="/yourwatchlist"/>
        <hr className="my-3" />
        <SidebarItem icon={<LogIn       size={20}   />} text="Login" link="/login"/>
        <SidebarItem icon={<Settings size={20} />} text="Settings" link="/yourrevies"/>
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help" link="/yourrevies"/>
      </Sidebar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore/:id" element={<Explore />} />
        <Route path="/yourreviews" element={<Reviews />} />
        <Route path="/yourlists" element={<Lists />} />
        <Route path="/community" element={<Community />} />
        <Route path="/yourwatchlist" element={<Watchlist />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
