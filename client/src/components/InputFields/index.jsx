import { Field, ErrorMessage, useFormikContext } from 'formik';
import { useState } from 'react';
import styles from "./style.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Input({ type, name, className, placeholder, required = false, accept, rows, multiple, list, autoComplete, onChange, ref, children, options }) 
{
    // Get field value for file handling
    const { setFieldValue, values } = useFormikContext();

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
            <input type={type} name={name} className={input} accept={accept} multiple={multiple} required={required} ref={ref}
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

    // Cehckboxes
    if(type === "checkbox") 
    {
        const selected = values[name] || [];

        const toggle = (option) => {
            if(selected.includes(option)) 
            {
                setFieldValue(name, selected.filter(value => value !== option));
            } 
            else 
            {
                setFieldValue(name, [...selected, option]);
            }
        };

        return (
            <>
                {/* Labels */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
                    {options.map((option) => (
                        <label key={option}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 12px",
                                borderRadius: "30px",
                                border: "2px solid #2c2f3a",
                                backgroundColor: selected.includes(option) ? "#ff3333" : "#0f1419",
                                color: selected.includes(option) ? "#e5e7eb" : "gray",
                                cursor: "pointer",
                                userSelect: "none",
                                transition: "all 0.2s",
                            }}>

                            {/* Checkbox input */}
                            <input type="checkbox" name={name} value={option} checked={selected.includes(option)} 
                            onChange={() => toggle(option)} style={{ accentColor: "#ff3333" }} />
                            { option }
                        </label>
                    ))}
                </div>
                <span className={styles.errorMessage}> <ErrorMessage name={name} /> </span>
            </>
        );
    }    

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