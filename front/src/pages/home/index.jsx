import React from "react";
import Footer from "../../components/footer/footer";
import styles from "./home.module.css"

export default function Home(props){
    return(
        <div className={styles.Home}>
            <h1>Ranking Estadual WCA</h1>
            <div className={styles.links}>
                <a href="/profile">Rankings Pessoais</a>
                <a href="/regionalRank">Rankings Regionais</a>
            </div>
            <Footer />
        </div>
    )
}