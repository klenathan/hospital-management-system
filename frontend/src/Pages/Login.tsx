import React from "react";
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

function Login(){
  return (
        <div className="flex justify-center items-center m-20 pt-20">
            <Card className="ml-200 w-[300px]">
        <CardHeader className=" w-150">
            <CardTitle className="flex justify-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
            </div>
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            </div>
            <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input id="email" type="email" />
            </div>
            <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
            </div>
            <div className="flex grid gap-2 w-[50px] pl-20">
            <Button>Login</Button>
            </div>
        </CardContent>
        </Card>
        </div>
            
    
    
  );
}

export default Login;
