import React from "react";
import Header from "../components/Header";
import Footer from "../components/footer";

export default function Home(props){
    return(
        <div className="Home">
            <Header />
            <h1>*Nome do Projeto*</h1>
            <Footer />
        </div>
    )
}