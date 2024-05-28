import React from "react";
import "@cubing/icons"
import styles from './ranking.module.css'
import CallMadeIcon from '@mui/icons-material/CallMade';

export default function Ranking(props){

    const nomesEventos = {
        "333" : ["Cubo 3x3x3", <span className="cubing-icon event-333" />],
        "333ft": ["3x3x3 com os pés", <span className="cubing-icon event-333ft" />],
        "333oh": ["3x3x3 com uma mão", <span className="cubing-icon event-333oh" />],
        "333bf": ["3x3x3 vendado", <span className="cubing-icon event-333bf" />],
        "333fm": ["3x3x3 FM", <span className="cubing-icon event-333fm" />],
        "222" : ["Cubo 2x2x2", <span className="cubing-icon event-222" />],
        "444" : ["Cubo 4x4x4", <span className="cubing-icon event-444" />],
        "555" : ["Cubo 5x5x5", <span className="cubing-icon event-555" />],
        "666" : ["Cubo 6x6x6", <span className="cubing-icon event-666" />],
        "777" : ["Cubo 7x7x7", <span className="cubing-icon event-777" />],
        "minx": ["Megaminx", <span className="cubing-icon event-minx" />],
        "pyram": ["Pyraminx", <span className="cubing-icon event-pyram" />],
        "sq1" : ["Square-1", <span className="cubing-icon event-sq1" />],
        "skewb": ["Skewb", <span className="cubing-icon event-skewb" />],
        "clock": ["Clock", <span className="cubing-icon event-clock" />],
        "333mbf": ["3x3x3 MultiBlind", <span className="cubing-icon event-333mbf" />],
        "444bf": ["4x4x4 Vendado", <span className="cubing-icon event-444bf" />],
        "555bf": ["5x5x5 Vendado", <span className="cubing-icon event-555bf" />]
    }
    
    return(
        <div className={styles.profile}>
                        <a href={props.wcaProfile} target="_blank" id={styles.wcaProfile}><h1>{props.dados.personName}<CallMadeIcon color="red"/></h1> </a>
                        <p>Estado: {props.dados.stateName}</p>
                        <h2>Rankings</h2>
                        <div className={styles.table}>
                        <div className={styles.title}>
                            <span className={styles.rowTitle} id={styles.nameT}>Evento</span>
                            <span className={styles.rowTitle} id={styles.singleRT}>{props.dados.stateName}R</span>
                            <span className={styles.rowTitle} id={styles.singleT}>Tempo Único</span>
                            <span className={styles.rowTitle} id={styles.avgRT}>Média</span>
                            <span className={styles.rowTitle} id={styles.avgT}>{props.dados.stateName}R</span>
                        </div>
                        {props.dados.rankings.map((val,key)=> {
                             return(
                                <div className={styles.row}>
                                <span
                                    id={styles.eventName}
                                    className={styles.rowCat}
                                >
                                    {nomesEventos[val.eventId][1]}{nomesEventos[val.eventId][0]}
                                </span>
                                <span
                                    id={styles.rankingSingle}
                                    className={styles.rowCat}
                                >
                                    {val.rankingSingle}
                                </span>
                                <span
                                    id={styles.single}
                                    className={styles.rowCat}
                                >
                                    {val.single}
                                </span>
                                <span
                                    id={styles.average}
                                    className={styles.rowCat}
                                >
                                    {val.average}
                                </span>
                                <span
                                    id={styles.rankingAverage}
                                    className={styles.rowCat}
                                    >
                                    {val.rankingAverage}
                                </span>
                                </div>
                            )
                        })}
                        </div>
                    </div>
    )
}