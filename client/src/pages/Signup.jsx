import FormikForm from '../components/FormikForm';
import Input from '../components/InputFields';
import Button from '../components/Button';
import { useAuth } from '../context/auth';

function Signup() 
{
    // Initial values
    const initialValues = {
        name:"",
        email:"",
        username:"",
        password:""
    };

    // Login Handler
    const { userSignup } = useAuth();

    return (
        <div className='d-flex align-items-center justify-content-center min-vh-100'>
            {/* Form */}
            <FormikForm initialValues={initialValues} handlerFunction={userSignup} heading="SIGNUP">
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
                <hr />

                {/* Login Button */}
                <Button type="submit"> Signup </Button>             
            </FormikForm>
        </div>
    );
}

export default Signup;