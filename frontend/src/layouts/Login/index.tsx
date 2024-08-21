import { useContext, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HospitalIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryWithoutTokenAPI } from '@/hooks/API/useQueryAPI';
import { UserContext } from '@/hooks/Auth/UserContext';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';

// Define the structure of the API response
interface PublicTokenResponse {
  data: {
    access_token: string;
  };
}

// Login form schema using zod
const loginSchema = z.object({
  username: z.string().min(1, { message: 'Please enter your username' }),
  password: z.string().min(1, { message: 'Please enter your password' })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Component() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const { refetch, isFetching } = useQueryWithoutTokenAPI<PublicTokenResponse>(
    ['auth', form.watch('username')],
    '/api/auth/publicToken',
    {
      'x-auth-string': `${form.watch('username')}:${form.watch('password')}`,
    },
    // {
    //   enabled: false, // disable automatic query execution
    // }
  );

  useEffect(() => {
    const fetchData = async () => {
      const result = await refetch();
      if (result.isSuccess) {
        console.log(result.data);
        // login(result.data.publicToken);
        // navigate('/dashboard');
      }
      // else if (result.isError && result.error?.response) {
      //   form.setError('password', { type: 'custom', message: (result.error.response.data as { detail: string }).detail });
      // }
    };

    if (form.getValues('username') && form.getValues('password')) {
      fetchData();
    }
  }, [refetch, form, login, navigate]);

  const onSubmit = () => {
    refetch();
  };

  return (
    <div className="flex md:flex-row flex-col min-h-screen">
      <div className="md:block relative flex-1 hidden bg-muted">
        <div className='absolute bg-black/60 w-full h-full'></div>
        <img
          src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hospital scene"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="space-y-8 w-full max-w-md">
          <div className="text-center">
            <HospitalIcon className="mx-auto w-20 h-20 text-primary" />
            <h2 className="mt-6 font-bold text-3xl text-primary">Welcome to the Hospital Management System</h2>
            <p className="mt-2 text-muted-foreground text-sm">Please sign in to your account</p>
          </div>
          <form className="space-y-6 mt-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="mt-1"
                  {...form.register('username')}
                />
                <p className="text-red-600">{form.formState.errors.username?.message}</p>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1"
                  {...form.register('password')}
                />
                <p className="text-red-600">{form.formState.errors.password?.message}</p>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isFetching}>
                {isFetching ? <LoaderCircle className='animate-spin' /> : <span>Sign in</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
