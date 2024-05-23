import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/footer/footer";
import { useState } from "react";
import styles from "./profile.module.css"
import AppsIcon from '@mui/icons-material/Apps';

export default function ProfilePage(props){

    const nomesEventos = {
        "222" : "Cubo 2x2x2",
        "333" : ["Cubo 3x3x3", <AppsIcon />],
        "444" : "Cubo 4x4x4",
        "555" : "Cubo 5x5x5",
        "666" : "Cubo 6x6x6",
        "777" : "Cubo 7x7x7",
        "333ft": "3x3x3 com os pés",
        "333oh": "3x3x3 com uma mão",
        "333bf": "3x3x3 vendado",
        "minx": "Megaminx",
        "pyram": "Pyraminx",
        "sq1" : "Square-1",
        "skewb": "Skewb"
    }

    const data = {
        "_personName": "Pedro Henrique Tesch",
        "_stateName": "RJ",
        "rankings": [{
            "eventId": "333",
            "ranking": 17,
            "average": 12.11},{
            "eventId": "333ft",
            "ranking": 2,
            "average": 115.2},{
            "eventId": "333oh",
            "ranking": 7,
            "average": 19.53},{
            "eventId": "444",
            "ranking": 6,
            "average": 42.14},{
            "eventId": "555",
            "ranking": 5,
            "average": 93.26},{
            "eventId": "666",
            "ranking": 4,
            "average": 200.21},{
            "eventId": "777",
            "ranking": 5,
            "average": 336.98},
        ]
        
    }
    
    const [id, setId] = useState("");
    const [dados, setDados] = useState("");
    const [showProfile, setProfile] = useState(false);

    const handleInfos =  e =>{
        e.preventDefault();
        console.log(`Consulta na api simulando os dados do id: ${id}`);
        setDados(data);
        setProfile(true);
        console.log(dados.rankings)
    } 
    return(
        <div>
            <Header />
            <div className={styles.profilePage}>
                <main>
                    <form onSubmit={handleInfos}>
                        <input 
                            type="text"
                            className={styles.input}
                            placeholder="Digite seu ID"
                            value={id}
                            id="id"
                            onChange={e =>{setId(e.target.value)}}
                            required  
                            />
                        <button className="confirmButton">Procurar</button>
                    </form>
                {showProfile && (
                    <div className={styles.profile}>
                        <h1>{dados._personName}</h1>
                        <p>Estado: {dados._stateName}</p>
                        <h2>Rankings</h2>
                        <span className={styles.title}></span>
                        {dados.rankings.map((val,key)=> {
                             return(
                                <div className={styles.profileRanking}>
                                <span
                                    id={styles.eventName}
                                    className={styles.row}
                                >
                                    {nomesEventos[val.eventId][1]}{nomesEventos[val.eventId][0]}
                                </span>
                                <span
                                    id={styles.eventName}
                                    className={styles.row}
                                >
                                    Posição: {val.ranking}
                                </span>
                                <span
                                    id={styles.eventName}
                                    className={styles.row}
                                >
                                    Média: {val.average}
                                </span>
                                </div>
                            )
                        })}
                    </div>
                )}
                </main>
            </div>

            <Footer />
        </div>
    )
}