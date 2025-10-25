import { Formik, Form } from 'formik';
import { forwardRef, useImperativeHandle, useRef } from 'react';

const FormikForm = forwardRef(({ children, initialValues, validationSchema, handlerFunction,
    validateOnBlur = true, validateOnChange = true,  className }, ref) => {
    const formikRef = useRef();

    // Expose Formik submit function to parent
    useImperativeHandle(ref, () => ({
        submitForm: () => {
            if(formikRef.current) formikRef.current.handleSubmit();
        }
    }));

    return (
        <>
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handlerFunction}
                enableReinitialize={true}
                validateOnBlur={validateOnBlur}
                validateOnChange={validateOnChange}>
                {formikProps => (
                    <Form className={className}>
                        {typeof children === "function" ? children(formikProps) : children}
                    </Form>
                )}
            </Formik>
        </>
    );
});

export default FormikForm;