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

function ResetPassword() 
{
    // Get redirection state
    const location = useLocation();
    const { redirectToVerifyResetPassword = false, _id = null } = location.state || {};

    // Global loader
    const { savingChanges } = useAuth();

    // Navigator
    const navigate = useNavigate();

    // Initial values
    const initialValues = {
        _id,
        password: "",
        cpassword: ""
    };

    // Validation schema
    const validationSchema = Yup.object({
        password:Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Enter strong password")
        .required('Password is required'),

        cpassword:Yup.string()
        .oneOf([Yup.ref('password'), null], "Password & confirm password must be identical")
        .required('Confirm password is required')
    });

    // Handler function
    const formHandler = useCallback(async (payload, action) => {
        try 
        {
            await api.patch({ url:`/security/resetPassword`, payload });
            action.resetForm();
            navigate("/login", { replace:true });
        } 
        catch (error) 
        {
            return error;
        }
    },[]);

    // If user is not redirected from verifying reset code page
    if(!redirectToVerifyResetPassword || !_id) return <Navigate to={`/security/forgotPassword`} replace={true} />

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                {/* Heading */}
                <div className={styles.heading}> <h3> Reset Password </h3> </div>

                {/* Sub heading */}
                <div className={styles.subHeading}> <p> Verification Step-03 </p> </div>

                {/* Form */}
                <FormBS initialValues={initialValues} validationSchema={validationSchema} handlerFunction={formHandler}>
                    {/* New Password */}
                    <div className="form-group">
                        <label htmlFor="password"> New Password </label>
                        <Input type="password" name="password" className="input" placeholder="Enter New Password" />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="cpassword"> Confirm Password </label>
                        <Input type="password" name="cpassword" className="input" placeholder="Re-Enter Password" />
                    </div>                    
                    <hr />

                    {/* Submit */}
                    <div className="form-group">
                        <Button type="submit" disabled={savingChanges===true}> Update </Button>
                    </div>

                    {/* Loader */}
                    {savingChanges && (
                        <div className="mt-3 float-start"> <Loader text="Updating" size="small" /> </div>
                    )}                   
                </FormBS>
            </div>                      
        </div>
    );
}

export default ResetPassword;