import { Card } from 'react-bootstrap';
import styles from './style.module.css';
import Button from '../Button';
import { useNavigate } from 'react-router-dom'


function CardBS({ heading, subHeading, description, buttonText, redirectTo, link, icon }) 
{
    const navigate = useNavigate();
    return (
        <div className={styles.cardWrapper}>
            <Card className={`shadow ${styles.card}`}>
            
                {/* Card Header */}
                <Card.Header className={styles.cardHeader}>
                    { heading }
                </Card.Header>

                {/* Card Body */}
                <Card.Body className={styles.cardBody}>
                    <Card.Title className={styles.cardTitle}> { subHeading } </Card.Title>
                    <Card.Text className={styles.cardText}>
                        { 
                            description.length > 90 ? <> { description.substring(0, 90) }... </> : description
                        }
                    </Card.Text>
                </Card.Body>

                {/* Card Footer */}
                <Card.Footer className={styles.cardFooter}>
                    <div>
                    {
                        link && ( <Card.Link href={link} className='link fw-bold'> Download </Card.Link> )
                    }
                    </div>

                    <div className='mt-2 d-grid'>
                        <Button type="button" onClick={ () => navigate(redirectTo) }> { icon || "" } { buttonText } </Button>
                    </div>
                </Card.Footer>                
            </Card>      
        </div>
    );
}

export default CardBS;