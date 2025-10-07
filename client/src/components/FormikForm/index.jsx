import { Formik, Form } from 'formik';
import styles from "./style.module.css";

function FormikForm({ children, initialValues, validationSchema, handlerFunction, className, heading })
{
    return (
        <div className={styles.formContainer}>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handlerFunction} 
            enableReinitialize={true} validateOnBlur={false} validateOnChange={false}>
                {formikProps => (
                    <Form className={className ? className : `${styles.form}`}>
                        {heading && (
                            <div className={styles.heading}> 
                                <h3 style={{ letterSpacing:"1px" }}> { heading } </h3> 
                                <hr />
                            </div>
                        )}         
                        { typeof children === "function" ? children(formikProps) : children }
                    </Form>
                )}            
            </Formik>
        </div>
    );
}

export default FormikForm;