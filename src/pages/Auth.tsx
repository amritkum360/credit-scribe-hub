import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { getCurrentUser, login as loginFn, signUp as signUpFn } from "@/lib/localAuth";

function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = description;
      document.head.appendChild(m);
    }
  }, [title, description]);
}

const Auth = () => {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPassword, setSignPassword] = useState("");

  useSEO("Login / Signup | Gmail Extension Web", "Login or create an account to access your dashboard, add credits, and generate API tokens.");

  useEffect(() => {
    if (getCurrentUser()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const handleLogin = () => {
    const { ok, error } = loginFn(loginEmail.trim(), loginPassword);
    if (!ok) return toast({ title: "Login failed", description: error, variant: "destructive" as any });
    toast({ title: "Welcome back", description: "Logged in successfully" });
    navigate("/dashboard");
  };

  const handleSignup = () => {
    const { ok, error } = signUpFn(signEmail.trim(), signPassword);
    if (!ok) return toast({ title: "Signup failed", description: error, variant: "destructive" as any });
    toast({ title: "Account created", description: "You're now logged in" });
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login or Create Account</CardTitle>
          <CardDescription>Frontend-only auth. Data is stored in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="you@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleLogin}>Login</Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" placeholder="you@example.com" value={signEmail} onChange={(e) => setSignEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" placeholder="Create a password" value={signPassword} onChange={(e) => setSignPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSignup}>Create Account</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
