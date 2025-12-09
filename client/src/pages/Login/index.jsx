import FormikForm from '../../components/FormikForm';
import Input from '../../components/InputFields';
import Button from '../../components/Button';
import { useAuth } from '../../context/auth';
import { Link, Navigate } from 'react-router-dom';
import { userData } from '../../utils/getUser';
import * as Yup from 'yup';
import GoogleLoginButton from '../../components/GoogleLoginButton';
import FormBox from '../../components/FormBox';

function Login() 
{
    // Initial values
    const initialValues = {
        username:"",
        password:""
    };

    // Validation schema
    const validationSchema = Yup.object({
        username:Yup.string()
        .lowercase()
        .required('Username is required'),

        password:Yup.string()
        .required('Password is required'),
    });    

    // Login Handler
    const { userLogin } = useAuth();

    if(!userData)
    {
        return (
            <div className='d-flex align-items-center justify-content-center min-vh-100'>
                <FormBox>
                    {/* Form */}
                    <FormikForm initialValues={initialValues} validationSchema={validationSchema} handlerFunction={userLogin} heading="LOGIN">
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

                        {/* Login Button */}
                        <div className="form-group d-grid mt-3">
                            <Button type="submit"> Login </Button>
                        </div>   

                        {/* Signup link */}
                        <div className="form-group d-grid mt-3 ms-2">
                            <Link to={`/signup`} title='Create account'> Don't have an account? </Link>
                        </div>     
                        <hr />

                        {/* Google Login Button */}
                        <GoogleLoginButton />                                                    
                    </FormikForm>
                </FormBox>
            </div>
        );        
    }
    else
    {
        return <Navigate to="/home" replace={true} />
    }
}

export default Login;