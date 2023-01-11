import styles from "./LogViewer.module.sass";
import {priority} from "../../_helpers";
import * as React from "react";
import {SearchField} from "./SearchField";
import {ViewerPanelDatepicker} from "./DatePicker";

export const Panel = ({from, updateFrom, to, updateTo, severity, updateSeverity, search, lsPrefix}) => {
    const setDateFrom = (date: Date) => {
        localStorage.setItem(lsPrefix + "log-date-from", date.toISOString())
        updateFrom(date)
    }, setDateTo = (date: Date) => {
        localStorage.setItem(lsPrefix + "log-date-to", date.toISOString())
        updateTo(date)
    }, setSeverity = (severity: number) => {
        localStorage.setItem(lsPrefix + "log-severity", severity)
        updateSeverity(severity)
    }, searchFn = value => {
        search(value)
    };

    return <div className={styles.Panel}>
        <SearchField onChange={searchFn}/>
        <label htmlFor="from-date-picker" className={styles.Label}>
            From
        </label>
        <ViewerPanelDatepicker id="from-date-picker" state={from} onChange={setDateFrom}/>
        <label htmlFor="to-date-picker" className={styles.Label}>
            To
        </label>
        <ViewerPanelDatepicker id="to-date-picker" state={to} onChange={setDateTo}/>
        <label htmlFor="severity-select" className={styles.Label}>
            Max Priority
        </label>
        <select className={styles.Select} id="severity-select"
                onChange={e => setSeverity(e.currentTarget.value)} value={severity}>
            {priority.all().map(value => <option value={value} key={value}>
                {priority.getName(value)}
            </option>)}
        </select>
    </div>
}