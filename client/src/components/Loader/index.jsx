import { FaSync } from 'react-icons/fa';
import styles from './style.module.css';

function Loader({ size = "small", text }) 
{
    // Big
    if(size.trim().toLowerCase() === "big")
    {
        return (
            <h3 className='text-center fw-bold textTheme'> 
                <FaSync className={styles.spin} size={30} /> { text } 
            </h3>
        );
    }

    // Medium
    if(size.trim().toLowerCase() === "medium")
    {
        return (
            <h4 className='text-center fw-bold textTheme'> 
                <FaSync className={styles.spin} size={30} /> { text } 
            </h4>
        );
    }

    // Small
    if(size.trim().toLowerCase() === "small")
    {
        return (
            <h6 className='text-center fw-bold textTheme'> 
                <FaSync className={styles.spin} size={30} /> &nbsp; { text } 
            </h6>
        );
    } 
}

export default Loader;