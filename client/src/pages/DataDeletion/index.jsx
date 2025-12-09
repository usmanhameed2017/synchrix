import React from "react";
import styles from "./style.module.css";

function DataDeletion() {
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>User Data Deletion</h1>
            <p className={styles.subtitle}>Last updated: December 09, 2025</p>

            <section className={styles.section}>
                <h2>How to Request Data Deletion</h2>
                <p>
                If you have used Facebook Login with <strong>Synchrix</strong> and want
                to request deletion of your personal data (such as your name or email),
                you can submit a request at any time.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Available Deletion Methods</h2>
                <ul>
                <li>
                    Send an email to  
                    <span className={styles.email}> usmanhameed1790@gmail.com </span>
                    requesting deletion.
                </li>
                <li>
                    Include your Facebook account email used during login.
                </li>
                <li>
                    Your data will be permanently removed within 7 business days.
                </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>What Data Will Be Deleted?</h2>
                <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Profile data created within the Synchrix platform</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>What Data Is Retained?</h2>
                <p>
                Only system-level logs (non-personal and anonymized) may be retained for
                security, debugging, or legal compliance.  
                No personal or identifying information is kept.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Need Help?</h2>
                <p>
                If you have any questions, feel free to contact us at  
                <span className={styles.email}>usmanhameed1790@gmail.com</span>
                </p>
            </section>
        </div>
    );
}

export default DataDeletion;