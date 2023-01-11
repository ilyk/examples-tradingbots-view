import styles from "./LogViewer.module.sass";
import {priority} from "../../_helpers";
import * as React from "react";

export const Viewer = ({lines, format}) => {
    return (
        <div className={styles.Viewer}>
            {lines.map((line, idx) => (
                <p key={idx} className={`${styles.Line} ${styles[priority.getName(line.priority)]}`}>{format(line)}</p>
            ))}
        </div>
    )
}