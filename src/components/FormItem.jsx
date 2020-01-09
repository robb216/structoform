import React from 'react'
import PropTypes from 'prop-types'
import {direction} from "../constants/helper";

const FormItem = ({label, id, direction, children}) =>
    <div className={`form-item form-item${direction}`}>
        {label !== '' && <label className={`form-item__label`} htmlFor={id}>{label}</label>}
        <div className="form-item__inner">
            {children}
        </div>
    </div>

export default FormItem

FormItem.propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(Object.values(direction)),
    children: PropTypes.array,
}
