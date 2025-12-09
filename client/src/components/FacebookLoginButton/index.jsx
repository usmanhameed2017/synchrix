import { backendURL } from '../../constants';
import styles from './style.module.css';

function FacebookLoginButton({ text = "Sign in with Facebook" }) 
{
    return (
        <div className='d-grid mt-2'>
            <a href={`${backendURL}/api/v1/auth/facebook`}>
                <button className={styles.facebookButton}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook Logo" />
                    {text}
                </button> 
            </a>
        </div>
    );
}

export default FacebookLoginButton;