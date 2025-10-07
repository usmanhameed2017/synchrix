import styles from "./style.module.css";
import { BsThreeDots } from "react-icons/bs";
import { useState } from 'react';

function MenuPopup({ item, options, title = "Menu", iconSize = 20 }) 
{
    // State
    const [openMenu, setOpenMenu] = useState(null);
    if(!item) return;

    return (
        <>
            {/* Menu Wrapper */}
            <div className={styles.menuWrapper}>
                {/* 3 Dot menu button */}
                <button className={styles.menuBtn} onClick={() => setOpenMenu(openMenu === item?._id ? null : item._id)}>
                    <BsThreeDots size={iconSize} title={title} />
                </button>

                {/* Dropdown Menu */}
                {openMenu === item?._id && (
                    <div className={styles.dropdownMenu}>
                    {options && Array.isArray(options) && options.length > 0 && (
                        options.map(option => (
                            // Options
                            <button type="button" key={option?.name} onClick={ () => { 
                                setOpenMenu(null);
                                option?.handler(item);
                            }}> 
                                { option?.name || "-" } 
                            </button>
                        ))
                    )}
                    </div>
                )}                                    
            </div>         
        </>
    );
}

export default MenuPopup;