import PulseLoader from "react-spinners/PulseLoader";
import styles from "./style.module.css";

function Loader({ size = "small", text }) 
{
    // Big
    if(size.trim().toLowerCase() === "big")
    {
        return (
            <div className={styles.loaderContainer}>
                <h3 className='text-center fw-bold textTheme'> 
                    <PulseLoader color="#00bcd4" size={20} speedMultiplier={1.2} /> &nbsp; { text }
                </h3>                
            </div>
        );
    }

    // Medium
    if(size.trim().toLowerCase() === "medium")
    {
        return (
            <div className={styles.loaderContainer}>
                <h4 className='text-center fw-bold textTheme'> 
                    <PulseLoader color="#00bcd4" size={20} speedMultiplier={1.2} /> &nbsp; { text }
                </h4>                
            </div>
        );
    }

    // Small
    if(size.trim().toLowerCase() === "small")
    {
        return (
            <div className={styles.loaderContainer}>
                <h6 className='text-center fw-bold textTheme'> 
                    <PulseLoader color="#00bcd4" size={20} speedMultiplier={1.2} /> &nbsp; { text }
                </h6>                
            </div>
        );
    } 
}

export default Loader;