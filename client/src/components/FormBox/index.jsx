import styles from './style.module.css';

function FormBox({ children, heading = "Synchrix" }) 
{
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}> { heading } </h1>
            { children }
        </div>
    );
}

export default FormBox;