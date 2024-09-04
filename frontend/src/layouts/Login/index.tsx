import { useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HospitalIcon, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserContext } from '@/hooks/Auth/UserContext';
import { useNavigate } from 'react-router-dom';
import { useMutationWithoutTokenAPI } from '@/hooks/API/useMutationAPI';

// Define the login form schema using zod
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

  const submitUser = useMutationWithoutTokenAPI('/api/auth/login');

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await submitUser.mutateAsync({
        username: data.username,
        password: data.password,
      });

      if (response.data.status === 'success') {
        // Call the login method from UserContext to set the token and user info
        await login(data.username, data.password);

        // Navigate to the dashboard or any other page after successful login
        navigate('/patient');
      }
    } catch (error) {
      console.error('Login failed:', error);
      form.setError('password', { type: 'manual', message: 'Invalid username or password' });
    }
  };

  return (
    <div className="flex md:flex-row flex-col min-h-screen max-h-screen">
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
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <LoaderCircle className='animate-spin' /> : <span>Sign in</span>}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
