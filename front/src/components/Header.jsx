import React from "react";

//aqui no header eu pensei em colocar todos os botões da primeira tela. fazendo com que apareça por padrão em todas as outras


export default function Header(props) {
    return (
        <header>
            <a href="/">HomePage</a>
            <a href="/profile">Ranking Pessoal</a>
            <a href="/regionalRank">Ranking Estadual</a>
        </header>
    );
}
