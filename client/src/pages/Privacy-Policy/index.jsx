import styles from "./style.module.css";

function PrivacyPolicy() 
{
    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: December 09, 2025</p>

            <section className={styles.section}>
                <h2>Your Privacy Matters</h2>
                <p>
                At <strong>Synchrix</strong>, we are committed to protecting your
                personal information. This Privacy Policy explains what data we
                collect, how we use it, and your rights regarding that data.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Information We Collect</h2>
                <ul>
                <li>Your name and email address (when you log in through Facebook).</li>
                <li>Basic account information required to create your profile.</li>
                <li>Technical data such as IP address, browser type, and device info.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>How We Use Your Information</h2>
                <ul>
                <li>To authenticate your identity using Facebook Login.</li>
                <li>To personalize your experience on Synchrix.</li>
                <li>To ensure platform security and prevent unauthorized access.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>Facebook Login</h2>
                <p>
                When you use Facebook Login, we only request your{" "}
                <strong>name</strong> and <strong>email address</strong>.  
                We do not collect passwords or any sensitive Facebook data.
                </p>
            </section>

            <section className={styles.section}>
                <h2>Data Sharing & Security</h2>
                <p>
                We do <strong>not</strong> sell or share your personal information with
                third parties except:
                </p>
                <ul>
                <li>To comply with legal requirements.</li>
                <li>To protect our rights and prevent fraud.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>Your Data Rights</h2>
                <ul>
                <li>You may request to view your personal data.</li>
                <li>You may request deletion of your account and data.</li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2>Data Deletion Instructions</h2>
                <p>
                If you want us to delete your data, please email us at:  
                <span className={styles.email}>usmanhameed1790@gmail.com</span>
                </p>
            </section>

            <section className={styles.section}>
                <h2>Contact Us</h2>
                <p>
                If you have any questions about this Privacy Policy, please reach out
                at:  
                <span className={styles.email}>usmanhameed1790@gmail.com</span>
                </p>
            </section>
        </div>
    );
}

export default PrivacyPolicy;