import styles from './style.module.css';

function Restricted({ statusCode, message }) 
{
    return (
        <div className={styles.wrapper}>
            <h2> { statusCode } - { message } </h2>
        </div>
    );
}

export default Restricted;