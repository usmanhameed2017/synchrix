
import GroupChatWindow from '../../components/GroupChatWindow';
import PrivateChatWindow from '../../components/PrivateChatWindow';
import Sidebar from '../../components/Sidebar';
import styles from "./style.module.css";

function Home() 
{
    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className={styles.main}>
                <PrivateChatWindow  />
                <GroupChatWindow />
            </main>
        </div>
    );
}

export default Home;