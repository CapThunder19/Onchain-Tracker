import TransferProduct from "./pages/TransferProduct";
import React from "react";
import  { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import {TrackProduct} from "./pages/TrackProduct";
import {AddProduct} from "./pages/AddProduct";
import VerifyProduct from "./pages/VerifyProduct";
import GrantRole from "./pages/GrantRole";

const App: React.FC = () => {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/track" element={<TrackProduct />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/verify" element={<VerifyProduct />} />
        <Route path="/grant-role" element={<GrantRole />} />
        <Route path="/transfer" element={<TransferProduct />} />
      </Routes>
    </Router>
    
  )
}

export default App;
