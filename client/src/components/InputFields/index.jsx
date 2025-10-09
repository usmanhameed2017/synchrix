import { Field, ErrorMessage, useFormikContext } from 'formik';
import { useState } from 'react';
import styles from "./style.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Input({ type, name, className, placeholder, required = false, accept, rows, multiple, list, autoComplete, onChange, children }) 
{
    // Get field value for file handling
    const { setFieldValue } = useFormikContext();

    // State to toggle show and hide password
    const [showPassword, setShowPassword] = useState(false);

    // Input field styling
    const input = className ? className : styles.input;

    // Password
    if(type === "password") return (
        <>
            {/* Wrapper */}
            <div className={styles.passwordFieldWrapper}>
                {/* Field */}
                <Field type={showPassword ? "text" : "password"} name={name} className={`${input} pe-5`} placeholder={placeholder} required={required}
                onChange={(e) => {
                    // Formik value update
                    setFieldValue(name, e.target.value);

                    // For custom onChange
                    if(onChange) onChange(e);
                }} 
                />

                {/* Icon */}
                <span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEye size={22} /> : <FaEyeSlash size={22} />}
                </span>
            </div> 
            <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>          
        </>
    );

    // File
    if(type === "file") return (
        <>
            <input type={type} name={name} className={input} accept={accept} multiple={multiple} required={required}
            onChange={ (e) => {
                // Formik value update
                setFieldValue(name, multiple ? e.target.files : e.target.files[0]);

                // For custom onChange
                if(onChange) onChange(e);
            }} 
            />
            <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>
        </>
    );

    // Text area
    if(type === "textarea") return (
        <>
            <Field as={type} rows={rows} name={name} className={input} placeholder={placeholder} required={required}
            onChange={(e) => {
                // Formik value update
                setFieldValue(name, e.target.value);

                // For custom onChange
                if(onChange) onChange(e);
            }}              
            />
            <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>
        </>
    );

    // Select - (Dropdown list)
    if(type === "select") return (
        <>
            <Field as={type} name={name} className={input} multiple={multiple} required={required}> 
                { children }
            </Field>
            <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>
        </>
    );

    // Datalist - (Dropdown list with manual typing)
    if(type === "datalist") return (
        <>
            <Field type="text" name={name} list={list} className={input} placeholder={placeholder} required={required} />
            <datalist id={list}> { children } </datalist>
            <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>
        </>
    );

    // Default input types: (Text, Number, Email, Search)
    return (
        <>
            <Field type={type} name={name} className={input} placeholder={placeholder} required={required} autoComplete={autoComplete}
            onChange={(e) => {
                // Formik value update
                setFieldValue(name, e.target.value);

                // For custom onChange
                if(onChange) onChange(e);
            }} 
            />
            <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>
        </>
    );
}

export default Input;