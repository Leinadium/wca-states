import React from "react";
import M222 from "../../images/222.png"
import M444 from "../../images/444.png"
import M555 from "../../images/555.png"
import M666 from "../../images/666.png"
import M777 from "../../images/777.png"
import mega from "../../images/mega.png"
import sq1 from "../../images/sq1.png"
import bld3 from "../../images/3bld.png"
import oh3 from "../../images/3oh.png"
import pyra from "../../images/pyra.png"
import skewb from "../../images/skewb.png"
import AppsIcon from '@mui/icons-material/Apps';
import styles from './ranking.module.css'
import CallMadeIcon from '@mui/icons-material/CallMade';
export default function Ranking(props){

    const nomesEventos = {
        "333" : ["Cubo 3x3x3", <AppsIcon />],
        "333ft": ["3x3x3 com os pés", <AppsIcon />],
        "333oh": ["3x3x3 com uma mão", <img className={styles.icon} src={oh3}/>],
        "333bf": ["3x3x3 vendado", <img className={styles.icon} src={bld3}/>],
        "333fm": ["3x3x3 em Menos Movimentos", <AppsIcon />],
        "222" : ["Cubo 2x2x2", <img className={styles.icon} src={M222}/>],
        "444" : ["Cubo 4x4x4", <img className={styles.icon} src={M444}/>],
        "555" : ["Cubo 5x5x5", <img className={styles.icon} src={M555}/>],
        "666" : ["Cubo 6x6x6", <img className={styles.icon} src={M666}/>],
        "777" : ["Cubo 7x7x7", <img className={styles.icon} src={M777}/>],
        "minx": ["Megaminx", <img className={styles.icon} src={mega}/>],
        "pyram": ["Pyraminx", <img className={styles.icon} src={pyra}/>],
        "sq1" : ["Square-1", <img className={styles.icon} src={sq1}/>],
        "skewb": ["Skewb", <img className={styles.icon} src={skewb}/>],
        "clock": ["Clock", <AppsIcon />],
        "333mbf": ["3x3x3 Múltiplos Cubos Vendado", <AppsIcon />],
        "444bf": ["4x4x4 Vendado", <AppsIcon />],
        "555bf": ["5x5x5 Vendado", <AppsIcon />]
    }

    
    return(
        <div className={styles.profile}>
                        <a href={props.wcaProfile} target="_blank" id={styles.wcaProfile}><h1>{props.dados.personName}<CallMadeIcon /></h1> </a>
                        <p>Estado: {props.dados.stateName}</p>
                        <h2>Rankings</h2>
                        <div className={styles.table}>
                        <div className={styles.title}>
                            <span className={styles.rowTitle} id={styles.nameT}>Evento</span>
                            <span className={styles.rowTitle} id={styles.posT}>{props.dados.stateName}R</span>
                            <span className={styles.rowTitle} id={styles.avgT}>Média</span>
                        </div>
                        {props.dados.rankings.map((val,key)=> {
                            const adaptativeData = () =>{
                                if(val.average !== undefined)
                                    return val.average
                                if(val.single !== undefined)
                                    return val.single
                                return 'N/A';
                            }
                             return(
                                <div className={styles.row}>
                                <span
                                    id={styles.eventName}
                                    className={styles.rowCat}
                                    >
                                    {nomesEventos[val.eventId][1]}{nomesEventos[val.eventId][0]}
                                </span>
                                <span
                                    id={styles.posR}
                                    className={styles.rowCat}
                                >
                                    {val.ranking}
                                </span>
                                <span
                                    id={styles.avgR}
                                    className={styles.rowCat}
                                >
                                    {adaptativeData()}
                                </span>
                                </div>
                            )
                        })}
                        </div>
                    </div>
    )
}