import {useState} from "react";
import DatePicker from "react-datepicker";
import styles from "./LogViewer.module.sass";
import * as React from "react";

export const ViewerPanelDatepicker = ({state, onChange, ...props}) => {
    const [getDate, setDate] = useState(state)
    return <DatePicker selected={getDate}
                       onChange={date => setDate(date) || onChange(date)}
                       showTimeSelect
                       showMonthDropdown
                       showYearDropdown
                       timeIntervals={15}
                       dateFormat="MMMM d, yyyy HH:mm"
                       className={styles.DatePicker} {...props} />
}