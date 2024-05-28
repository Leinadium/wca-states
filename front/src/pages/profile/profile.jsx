import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/footer/footer";
import { useState } from "react";
import styles from "./profile.module.css"
import Axios from "axios";
import Ranking from "../../components/ranking/ranking";

export default function ProfilePage(props){

    
    const [id, setId] = useState("");
    const [dados, setDados] = useState("");
    const [showProfile, setProfile] = useState(false);
    const [wcaprofile, setWcaProfile] = useState("");

    const handleInfos =  e =>{
        e.preventDefault();
        setWcaProfile(`https://www.worldcubeassociation.org/persons/${id}`);
        console.log(`Consulta na api pegando os dados do id: ${id.toUpperCase()}`);
            Axios.get(`https://ranking-estadual-wca.leinadium.dev/api/person/both/${id.toUpperCase()}`).then((response)=>{
                console.log(`response.data = ${response.data}`);


                const ordemEsp = ["333","222", "444" ,"555" ,"666" , "777", "333bf","333fm", "333oh", "clock", "minx", "pyram", "skewb", "sq1" ,"444bf","555bf", "333mbf", "333ft"]

                function comparar(a,b){
                    const ordemA = ordemEsp.indexOf(a.eventId);
                    const ordemB = ordemEsp.indexOf(b.eventId);
                    if(ordemA === -1) return 1;
                    if(ordemB === -1) return -1;
                    return ordemA - ordemB;
                }

                const temporaryData = {...response.data};
                temporaryData.rankings = temporaryData.rankings.filter((data) => {
                    if (data.eventId === "333fm") {
                        data.average /= 100;
                    } else {

                        if (data.eventId === "333mbf") {
                            data.rankingAverage = null;
                            data.single = data.single % 10000;
                        }

                        if (data.average !== null) {
                            const minutes = Math.floor(data.average / 60); 
                            const seconds = (data.average % 60).toFixed(2);
                            if (minutes !== 0) {
                                data.average = `${minutes}:${seconds.padStart(5, '0')}`;
                            } else {
                                data.average = `${seconds.padStart(4, '0')}`;
                            }
                        }else{
                            data.rankingAverage = null;
                        }
                        if (data.single !== null) {
                            const minutes = Math.floor(data.single / 60); 
                            const seconds = (data.single % 60).toFixed(2);
                            if (minutes !== 0) {
                                data.single = `${minutes}:${seconds.padStart(5, '0')}`;
                            } else {
                                data.single = `${seconds.padStart(4, '0')}`;
                            }
                        }
                    }
                    
                    // Remover elementos onde data.single é igual a 0
                    return data.single != 0;
                });

                temporaryData.rankings.sort(comparar);

                setDados(temporaryData)
                setProfile(true);
            }).catch((error) =>{
                setProfile(false);
                if(error.response.status == 404)
                    window.alert(`Não foi possível encontrar o seu ID\n Tem certeza que está correto: ${id} ?`)
                else
                    window.alert("Não conseguimos processar sua requisição!")
            })
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
                    <Ranking dados={dados} wcaProfile={wcaprofile} tipo="average"/>
                )}
                </main>
            </div>

            <Footer />
            </div>
        )
}