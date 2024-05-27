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
        console.log(`Consulta na api pegando os dados do id: ${id}...`);
            Axios.get(`https://ranking-estadual-wca.leinadium.dev/api/average/${id}`).then((response)=>{
                console.log(`response.data = ${response.data}`);
                const temporaryData = {...response.data};
                temporaryData.rankings.forEach((data)=>{
                    console.log("antes: "+ data.average)
                    if(data.eventId == "333fm"){
                        data.average /= 100;
                    }
                    
                    if (data.average !== null) {
                        const minutes = Math.floor(data.average / 60); 
                        const seconds = (data.average % 60).toFixed(2);
                        if(minutes != 0 )
                            data.average = `${minutes}:${seconds.padStart(5, '0')}`;
                        else if(minutes == 0)
                            data.average = `${seconds.padStart(4,'0')}`
                    }
                    console.log("depois: "+ data.average)
                })
                setDados(temporaryData)
                console.log("temporary data" + temporaryData)
                setProfile(true);
            }).catch((error) =>{
                setProfile(false);
                window.alert("Infelizmente nao conseguimos achar seu ID");
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