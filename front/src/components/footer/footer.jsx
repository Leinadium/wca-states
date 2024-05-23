import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import styles from "./footer.module.css"
export default function Footer(props) {
    return (
        <footer>
            <div><strong>&copy;</strong> <a href="https://github.com/SrTesch">Tesch</a> e <a href="https://github.com/Leinadium">Schweppes</a></div>
            <div><a href="https://github.com/Leinadium/wca-states" id={styles.linkGit}><GitHubIcon id={styles.gitIcon} />GitHub Project</a></div>
            <div>Last update: NEVER</div>
        </footer>
    );
}
