import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id='error-page' className="flex flex-col justify-center items-center bg-background min-h-screen text-foreground">
      <h1 className="mb-4 font-bold text-4xl">
        {isRouteErrorResponse(error) && error.status === 404 ? '404 - Page Not Found' : 'Unexpected Application Error!'}
      </h1>
      <p className="mb-8 max-w-md text-center text-xl">
        {isRouteErrorResponse(error)
          ? "Oops! The page you're looking for doesn't exist or has been moved."
          : "Sorry, an unexpected error has occurred."}
      </p>
      <Button asChild>
        <a href="/" className="flex items-center">
          <HomeIcon className="mr-2 w-4 h-4" />
          Go back home
        </a>
      </Button>
    </div>
  );
}
