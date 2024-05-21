import React from "react";
import Footer from "../../components/footer/footer";
import styles from "./home.module.css"

export default function Home(props){
    return(
        <div className={styles.Home}>
            <h1>*Nome do Projeto*</h1>
            <div className={styles.links}>
                <a href="/profile">Profile Page</a>
                <a href="/regionalRank">Regional Rank</a>
            </div>
            <Footer />
        </div>
    )
}