import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Home from "./pages/Home";
import Explore from './components/explore/Explore';
const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/explore/:id' element={<Explore />}/>
    </Routes>
  )
}

export default App;