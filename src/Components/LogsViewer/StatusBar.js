import styles from "./LogViewer.module.sass";
import * as React from "react";

export const StatusBar = ({text}) => <div className={styles.StatusBar}>
    <p className={""}>{text}</p>
</div>
