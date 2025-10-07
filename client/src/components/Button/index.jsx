import style from './style.module.css';

function Button({ children, type, onClick, title, disabled }) 
{
    return (
        <button className={style.buttonTheme} type={type} onClick={onClick} title={title} disabled={disabled}>
            {children}
        </button>
    );
}

export default Button;