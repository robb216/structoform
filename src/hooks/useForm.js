import {useState, useEffect} from 'react'
import { copy } from '../constants/helper';

const useForm = (callback, validators) => {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (Object.values(errors).every(x => x === null) && isSubmitting) {
            callback()
        }
        //setIsSubmitting(false)
        // eslint-disable-next-line
    }, [isSubmitting, errors])

    const handleSubmit = (event) => {
        // Access the event properties. https://reactjs.org/docs/events.html
        event.persist()

        if (event) {
            event.preventDefault()
        }

        // Validate & store error message for each input element
        Object.keys(validators).forEach(item =>
            Object.values(event.target.elements).forEach((obj) => {

                if (obj.name === item) {
                    setErrors(errors => ({ ...errors, [obj.name]: validate(obj, validators[item])} ))
                }
            })
        )
console.log(errors)
        setIsSubmitting(true)
    }

    const handleChange = (event) => {
        // Access the event properties. https://reactjs.org/docs/events.html
        event.persist()

        // Remove current error on typing
        setErrors(errors => ({ ...errors, [event.target.name]: null} ))

        // Store values of input elements
        setValues(values => ({ ...values, [event.target.name]: value(event.target)}))
    }

    const value = (target => {
        switch (target.type) {
            case 'checkbox':
                return target.checked
            default:
                return target.value
        }
    })

    return {
        values,
        errors,
        handleSubmit,
        handleChange,
        isSubmitting
    }
}

export default useForm

const validate = (item, validators) => {
    let value = item.value

    // if node is a select item, then check if the selected value is a disabled property. Use this boolean value to
    // check if a option is selected.
    if (item.nodeName === 'SELECT') {
        value = item.options[item.selectedIndex].disabled
    }

    let errors = validators.rules.map(rule => {
        switch (rule) {
            case validate.types.REQUIRED:
                return !value && copy.nl.error_is_required
            case validate.types.EMAIL:
                return !/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) && copy.nl.error_invalid_email
            case validate.types.IS_SELECTED:
                return value && copy.nl.error_is_selected
            case validate.types.IS_CHECKED:
                return !value && copy.nl.error_is_checked
            case validate.types.IS_NUMBER:
                return !/^(?=.*[0-9])/.test(value) && copy.nl.error_not_numeric
            case validate.types.IS_PASSWORD:
                return !value && copy.nl.error_is_password
            default:
                return null
        }
    })
    return errors.filter(item => typeof(item) === 'string')

}

validate.types = {
    REQUIRED: 'isRequired',
    EMAIL: 'isEmail',
    IS_LENGTH: 'isLength',
    IS_SELECTED: 'isSelected',
    IS_CHECKED: 'isChecked',
    IS_NUMBER: 'isNumber',
    IS_PASSWORD: 'isPassword',
}
