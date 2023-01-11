import React from "react";
import { useField, useFormikContext } from "formik";
import DatePicker from "react-datepicker";
import {time} from "./time";

export const DatePickerField = ({ ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    const formatFn = props.utc ? time.formatUtcFromString : time.formatFromString;
    const dateFn = props.utc ? time.getUTCDate : (s: string) => new Date(s);
    const revDateFn = props.utc ? time.getLocalDate : (s: string) => new Date(s);
    return (
        <DatePicker
            {...field}
            {...props}
            value={(field.value && formatFn(field.value, props.dateFormat)) || null}
            selected={(field.value && dateFn(field.value)) || null}
            onChange={val => {
                setFieldValue(field.name, revDateFn(val.getTime()).getTime());
            }}
        />
    );
};
