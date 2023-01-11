import {Field, useFormikContext} from "formik";
import * as React from "react";
import {SliderField} from "../../../Components/Slider";
import {DatePickerField, time} from "../../../_helpers";
import {Button} from "react-bootstrap";

export const CheckBox = ({label, name, className}) => {
    const {isSubmitting} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${className}`}>
            <Field name={name}>
                {({field}) => (
                    <div className="custom-control custom-switch"
                         style={{display: "flex", alignItems: "center", flexDirection: "row"}}>
                        <input type="checkbox"
                               className="custom-control-input"
                               id={field.name}
                               onChange={field.onChange}
                               onBlur={field.onBlur}
                               checked={field.value}
                               disabled={isSubmitting}/>
                        <label className="custom-control-label"
                               htmlFor={field.name}>
                            {label}
                        </label>
                    </div>
                )}
            </Field>
        </div>
    )
}, SliderInterval = ({label, name, step, min, max, className}) => {
    const {isSubmitting} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${className}`}>
            <SliderField disabled={isSubmitting} title={label}
                         name={name}
                         tooltipLabel={i => time.DurationToString(i)}
                         tooltipDeLabel={i => time.StringToDuration(i)}
                         type={"text"}
                         step={step || 10 * time.Second} max={max || time.Hour} min={min || 0}/>
        </div>
    )
}, SliderFloat = ({label, name, className}) => {
    const {isSubmitting} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${className}`}>
            <SliderField disabled={isSubmitting}
                         title={label} name={name}
                         min={0} max={1} step={0.0001}/>
        </div>
    )
}, NumericField = ({label, name, step, min, className}) => {
    const {isSubmitting} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${className}`}>
            <label htmlFor={name}
                   className={"col-sm-12 col-form-label"}>
                <b>{label}</b>
            </label>
            <div className="col-sm-12">
                <Field type={"number"} name={name} id={name} disabled={isSubmitting}
                       min={typeof min === 'number' ? min : step || 0.0001} step={step || 0.0001}
                       className={"form-control"}/>
            </div>
        </div>
    )
}, TextField = ({label, name, className}) => {
    const {isSubmitting} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${className}`}>
            <label htmlFor={"bot.config.trading_pair"}
                   className={"col-sm-12 col-form-label"}>
                <b>{label}</b>
            </label>
            <div className="col-sm-12">
                <Field type={"text"} name={name} disabled={isSubmitting}
                       id={name} className={"form-control"}/>
            </div>
        </div>
    )
}, SelectBox = ({label, name, values: vals, valueToText, onChange, multi, emptyVal, className}) => {
    const {isSubmitting, setFieldValue} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${className}`}>
            <label htmlFor={name}
                   className={"col-sm-12 col-form-label"}>
                <b>{label}</b>
            </label>
            <div className="col-sm-12">
                <Field name={name} id={name} className={"form-control"} onChange={(e) => {
                    setFieldValue(name, !multi ? e.target.value : [].slice.call(e.target.selectedOptions).map(option => option.value));
                    (onChange || (() => {
                    }))(e)
                }} disabled={isSubmitting} as={"select"} multiple={multi}>
                    {!emptyVal || <option value="" disabled={true}>[Please select]</option>}
                    {(vals || []).map(v => (
                        <option key={v} value={v}>{(valueToText || (a => a))(v)}</option>
                    ))}
                </Field>
            </div>
        </div>
    )
}, DatePicker = ({label, name, ...props}) => {
    const {isSubmitting} = useFormikContext()
    return (
        <div className={`form-group row col-lg-6 col-sm-12 ${props.className}`}>
            <label htmlFor={"bot.state.lastTimestamp"}
                   className={"col-sm-12 col-form-label"}>
                <b>{label}</b>
            </label>
            <div className="col-sm-12">
                <DatePickerField name={name}
                                 disabled={isSubmitting}
                                 showTimeSelect
                                 showMonthDropdown
                                 showYearDropdown
                                 timeFormat="HH:mm"
                                 timeIntervals={15}
                                 timeCaption="time"
                                 dateFormat="MMMM d, yyyy HH:mm"
                                 className={"form-control"}
                                 {...props}
                />
            </div>
        </div>
    )
}, SaveButton = () => {
    const {isSubmitting} = useFormikContext()
    return (
        <Button block={true} variant={"primary"} size={"sm"} type={"submit"}
                disabled={isSubmitting}>
            Save
        </Button>
    )
};

