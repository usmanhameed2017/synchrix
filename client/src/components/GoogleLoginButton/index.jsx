import { backendURL } from "../../constants";
import styles from "./style.module.css";

function GoogleLoginButton({ text = "Sign in with Google" }) 
{
    // Public url of google login button
    const src = "https://developers.google.com/identity/images/g-logo.png";
    return (
        <a href={`${backendURL}/api/v1/auth/google`}>
            <button type='button' className={styles.googleBtn}>
                <img src={src} alt="Google Logo" className={styles.image} />
                Sign in with Google
            </button>
        </a>

    );
}

export default GoogleLoginButton;