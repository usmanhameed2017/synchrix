import FormikForm from '../../components/FormikForm';
import Input from '../../components/InputFields';
import Button from '../../components/Button';
import { useAuth } from '../../context/auth';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import FormBox from '../../components/FormBox';

function Signup() 
{
    // Initial values
    const initialValues = {
        name:"",
        email:"",
        username:"",
        password:"",
        cpassword:""
    };

    // Validation schema
    const validationSchema = Yup.object({
        // Name
        name:Yup.string()
        .min(3, "Name must be at least 3 characters long")
        .max(30, "Name must not be longer than 30 characters")
        .required("Name is required"),

        // Email
        email: Yup.string()
        .strict(true)
        .lowercase("Email must contain lowercase letters")
        .min(6, "Email must be at least 6 characters long")
        .max(30, "Email must not be longer than 30 characters")
        .email("Invalid email")
        .required("Email is required"),

        // Username
        username: Yup.string()
        .matches(/^[a-z0-9_@]+$/, "Username can only contain lowercase letters, underscore (_) and @")
        .min(6, "Username must be at least 6 characters long")
        .max(20, "Username must not be longer than 20 characters")
        .required("Username is required"),

        // Password
        password:Yup.string()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, "Enter strong password")
        .required('Password is required'),

        // Confirm Password
        cpassword:Yup.string()
        .oneOf([Yup.ref('password'), null], "Password & confirm password must be identical")
        .required('Confirm password is required')
    });      

    // Signup Handler
    const { userSignup } = useAuth();

    return (
        <div className='d-flex align-items-center justify-content-center min-vh-100'>
            <FormBox>
                {/* Form */}
                <FormikForm initialValues={initialValues} validationSchema={validationSchema} handlerFunction={userSignup} heading="SIGNUP">
                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name"> Name </label>
                        <Input type="text" name="name" className="input" placeholder="Enter Name" />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email"> Email </label>
                        <Input type="text" name="email" className="input" placeholder="Enter Email" />
                    </div>                

                    {/* Username */}
                    <div className="form-group">
                        <label htmlFor="username"> Username </label>
                        <Input type="text" name="username" className="input" placeholder="Enter Username" />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password"> Password </label>
                        <Input type="password" name="password" className="input" placeholder="Enter Password" />
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="cpassword"> Confirm Password </label>
                        <Input type="password" name="cpassword" className="input" placeholder="Re-Enter Password" />
                    </div>                

                    {/* Signup Button */}
                    <div className="form-group mt-3 d-grid">
                        <Button type="submit"> Signup </Button>  
                    </div>  

                    {/* Login link */}
                    <div className="form-group d-grid mt-3 ms-2">
                        <Link to={`/`} title='Back to sign-in'> Already have an account? </Link>
                    </div>
                    <hr />

                    {/* Google Login Button */}
                    <GoogleLoginButton text='Sign up with Google' />                                    
                </FormikForm>
            </FormBox>
        </div>
    );
}

export default Signup;