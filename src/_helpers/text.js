import React from 'react'

const styles = {
    wholePart: {
        fontWeight: "bold"
    }, decimalPart: {
        fontSize: "0.8em",
        fontWeight: "lighter",
    }
}
const formatFloat = (float: string | number) => {
    let str = float.toString();
    let periodPos = str.indexOf(".")
    if (periodPos === -1) {
        str += ".0"
        periodPos = str.length - 2
    }

    return <span className={"floatNumber"}>
        <span className="whole-part" style={styles.wholePart}>{str.substr(0, periodPos)}</span>
        <span className="decimal-part" style={styles.decimalPart}>{str.substr(periodPos)}</span>
    </span>
}, capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const text = {
    formatFloat: formatFloat,
    capitalize: capitalize,
}
