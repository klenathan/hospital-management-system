import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '@/hooks/Auth/UserContext';

interface RedirectIfUnAuthenticatedProps {
    requiredRoles?: string[];
}

export function RedirectIfUnAuthenticated({ requiredRoles }: RedirectIfUnAuthenticatedProps) {
    const { loggedIn, user } = useContext(UserContext);

    if (!loggedIn) {
        // Redirect to login if the user is not authenticated
        return <Navigate to="/login" replace />;
    }
    if (requiredRoles && !requiredRoles.includes(user.job_type)) {
        // Redirect to a "Not Authorized" page or similar if the user's job_type doesn't match
        return <Navigate to="/not-authorized" replace />;
    }

    return <Outlet />;
}

interface RedirectIfAuthenticatedProps {
    route: string;
    children: JSX.Element;
}

export function RedirectIfAuthenticated({ children, route }: RedirectIfAuthenticatedProps) {
    const { loggedIn } = useContext(UserContext);

    if (loggedIn) {
        return <Navigate to={route} replace />;
    }

    return children;
}


