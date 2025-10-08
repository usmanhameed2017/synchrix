import { useAuth } from '../../../context/auth';
import { Outlet } from 'react-router-dom';
import Restricted from '../Restricted';

function ProtectedRoute() 
{
    const { isLoggedIn } = useAuth();

    // Check authentication
    if(isLoggedIn === null) return "";
    if(isLoggedIn === false) return <Restricted statusCode={401} message={`UNAUTHORIZED`} />
    
    return <Outlet />;
}

export default ProtectedRoute;