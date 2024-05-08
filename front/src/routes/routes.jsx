import React from "react";
import {Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import ProfilePage from "../pages/profile";
import RegionalRank from "../pages/regionalRank";

const Rotas = () =>{
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} exact />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/regionalRank" element={<RegionalRank />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas;