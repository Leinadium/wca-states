import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/footer/footer";
import styles from "./regional.module.css"
export default function RegionalRank(props){
    return(
        <div>
            <Header />
            <div className={styles.rankPage}>
                <h1>Regional Rank</h1>
                <h2>This page will be ready soon.</h2>
            </div>
            <Footer />
        </div>
    )
}