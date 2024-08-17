import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

function Login() {
  return (
    <div className="flex justify-center items-center m-20 pt-20">
      <Card className="ml-200 w-[300px]">
        <CardHeader className="w-150">
          <CardTitle className="flex justify-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="gap-4 grid">
          <div className="gap-6 grid grid-cols-2">
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="border-t w-full" />
            </div>
          </div>
          <div className="gap-2 grid">
            <Label htmlFor="email">Username</Label>
            <Input id="email" type="email" />
          </div>
          <div className="gap-2 grid">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <div className="gap-2 grid pl-20 w-[50px]">
            <Button>Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>



  );
}

export default Login;
