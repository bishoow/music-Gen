
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Music, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

// ...existing code...
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    toast({
      title: "Error",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  if (password !== confirmPassword) {
    toast({
      title: "Error",
      description: "Passwords do not match",
      variant: "destructive",
    });
    return;
  }

  if (!acceptTerms) {
    toast({
      title: "Error",
      description: "You must accept the terms and conditions",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Error",
        description: data.message || "Registration failed",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Save JWT to sessionStorage
    if (data.access_token) {
      sessionStorage.setItem("accessToken", data.access_token);
    }

    toast({
      title: "Account created!",
      description: "Your account has been successfully created",
    });

    navigate("/login");
  } catch (error) {
    toast({
      title: "Error",
      description: "There was an error creating your account",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
// ...existing code...
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container py-28 px-4 mx-auto flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-music-purple rounded-full flex items-center justify-center">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">Sign up to get started with Music generator</p>
          </div>
          
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms} 
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{" "}
                    <Link to="#" className="text-music-purple hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="text-music-purple hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-music-purple hover:bg-music-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing up...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                    </>
                  )}
                </Button>
                
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-music-purple hover:underline">
                    Sign in instead
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
