import styles from "./LogViewer.module.sass";
import * as React from "react";

export const SearchField = ({onChange}) => {
    return <input id="search-input" className={styles.BlockField} placeholder="Search..." onKeyPress={e => {
        onChange(e.currentTarget.value)
    }} onChange={e => {
        onChange(e.target.value)
    }}/>
}