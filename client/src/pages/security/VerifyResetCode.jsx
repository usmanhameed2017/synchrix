import { useNavigate, useLocation, Navigate } from "react-router-dom";
import styles from './style.module.css';
import * as Yup from 'yup';
import FormBS from "../../components/Form";
import Input from "../../components/InputFields";
import Button from "../../components/Button";
import { useCallback } from "react";
import { useAuth } from "../../context/auth";
import Loader from "../../components/Loader";
import api from "../../service/axios";

function VerifyResetCode() 
{
    // Get redirection state
    const location = useLocation();
    const { redirectToVerifyResetCode = false, _id = null } = location.state || {};

    // Global loader
    const { savingChanges } = useAuth();

    // Navigator
    const navigate = useNavigate();

    // Initial values
    const initialValues = {
        _id,
        resetCode: ""
    };

    // Validation schema
    const validationSchema = Yup.object({
        resetCode:Yup.string()
        .min(9, "Reset code must be 9 characters long")
        .max(9, "Reset code must not be longer than 9 characters")
        .required("Reset code is required")
    });

    // Handler function
    const formHandler = useCallback(async (payload, action) => {
        try 
        {
            await api.patch({ url:`/security/verifyResetCode`, payload });
            action.resetForm();
            navigate("/security/resetPassword", { state:{ _id, redirectToVerifyResetPassword:true } });
        } 
        catch (error) 
        {
            return error;
        }
    },[]);

    // If user is not redirected from forgot password page
    if(!redirectToVerifyResetCode || !_id) return <Navigate to={`/security/forgotPassword`} replace={true} />

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                {/* Heading */}
                <div className={styles.heading}> <h3> Code Verification </h3> </div>

                {/* Sub heading */}
                <div className={styles.subHeading}> <p> Verification Step-02 </p> </div>

                {/* Form */}
                <FormBS initialValues={initialValues} validationSchema={validationSchema} handlerFunction={formHandler}>
                    {/* Reset code */}
                    <div className="form-group">
                        <label htmlFor="resetCode"> Reset Code </label>
                        <Input type="text" name="resetCode" className="input" placeholder="Enter Your Code" />
                    </div>
                    <hr />

                    {/* Submit */}
                    <div className="form-group">
                        <Button type="submit" disabled={savingChanges===true}> Submit </Button>
                    </div>

                    {/* Loader */}
                    {savingChanges && (
                        <div className="mt-3 float-start"> <Loader text="Verifying" size="small" /> </div>
                    )}                   
                </FormBS>
            </div>                      
        </div>
    );
}

export default VerifyResetCode;