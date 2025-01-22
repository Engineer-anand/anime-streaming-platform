import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnimeDetails from "./pages/AnimeDetails";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import MainPage from "./components/MainPage";
import InnerHome from "./components/InnerHome";
import AnimeEpisode from "./pages/AnimeEpisode";
const App = () => {
  return (
    <Router>
      {/* <Navbar /> */}
      {/* <MainPage /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<InnerHome />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/episodes/:id" element={<AnimeEpisode />} />
      </Routes>
      {/* <Footer /> */}
    </Router> 
  );
};

export default App;
