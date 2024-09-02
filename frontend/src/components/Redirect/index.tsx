import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '@/hooks/Auth/UserContext';

export function RedirectIfUnAuthenticated() {
    const { loggedIn } = useContext(UserContext);

    if (!loggedIn) {
        // If the user is not logged in, redirect to the landing page
        return <Navigate to="/" />;
    }

    // If the user is logged in, render the children (the protected content)
    return <Outlet />;
}



export const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
    const { loggedIn } = useContext(UserContext);
    if (loggedIn) {
        return <Navigate to="/patient" />;
    }
    return children;
};