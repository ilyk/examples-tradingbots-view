import * as React from "react";
import {useField, useFormikContext} from "formik";
import RangeSlider from "react-bootstrap-range-slider";
import {compose, withState} from "recompose";

export const _Slider = ({inputValue, onInputValue, value, onValue, ...props}) => {
    const {setFieldValue} = useFormikContext();
    const [field] = useField(props);

    return (
        <div className={"col-sm-12"}>
            <label htmlFor={props.name}>
                {props.title}
            </label>
            <div className={"row col-sm-12 px-0"}>
                <div className={"col-sm-9 mx-0 px-0"}>
                    <RangeSlider
                        disabled={props.disabled}
                        value={field.value}
                        onChange={(e) => {
                            onInputValue(props.tooltipLabel(e.target.value))
                            field.onChange(e)
                        }}
                        onBlur={field.onBlur}
                        inputProps={{id: props.name, tabIndex: -1}}

                        {...props}
                    />
                </div>
                <div className={"col-sm-3 mx-0 px-0"}>
                    <input className={"form-control px-1"}
                           onChange={e => {
                               onInputValue(e.currentTarget.value)
                               onValue(props.tooltipDeLabel(e.currentTarget.value))
                           }}
                           onBlur={() => {
                               setFieldValue(field.name, value, false);
                           }}
                           value={inputValue || props.tooltipLabel(field.value)}
                           min={props.min} max={props.max} step={props.step}
                           type={props.type}
                    />
                </div>
            </div>
        </div>
    )
}

export const SliderField = compose(
    withState('value', 'onValue', 0),
    withState('inputValue', 'onInputValue', ''),
)(_Slider)
SliderField.defaultProps = {
    title: '',
    name: '',
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    tooltip: "auto",
    tooltipPlacement: "bottom",
    type: 'numeric',
    tooltipLabel: a => a,
    tooltipDeLabel: a => a,
}
