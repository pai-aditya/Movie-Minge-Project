import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './components/explore/Explore';
import Login from './pages/Login';
import Sidebar, {SidebarItem} from './components/Sidebar'; // Import your Sidebar component
import {LayoutDashboard,BarChart3,UserCircle,Boxes,Package,Receipt,Settings,LifeBuoy,Users, BookText, List,ListChecks,LogIn} from "lucide-react"


const App = () => {
  return (
    <div className="flex">
      <Sidebar>
        <SidebarItem icon={<BookText    size={20} />} text="Your Reviews" />
        <SidebarItem icon={<List        size={20}      />} text="Your Lists"         />
        <SidebarItem icon={<Users       size={20}     />} text="MovieVerse Community"/>
        <SidebarItem icon={<ListChecks  size={20}/>} text="Your Watchlist"           />
        <hr className="my-3" />
        <SidebarItem icon={<LogIn       size={20}   />} text="Login"                />
        <SidebarItem icon={<Settings size={20} />} text="Settings" />
        <SidebarItem icon={<LifeBuoy size={20} />} text="Help"/>
      </Sidebar>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore/:id" element={<Explore />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
