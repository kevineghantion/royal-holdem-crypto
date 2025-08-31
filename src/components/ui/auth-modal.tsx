import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Checkbox } from './checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    identifier: '', // For email OR username login
    password: ''
  });

  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signup(formData.username, formData.email, formData.password);
        toast({
          title: "Account created successfully!",
          description: "Welcome to Casino Royal.",
        });
      } else {
        await login(formData.identifier, formData.password, rememberMe);
        toast({
          title: "Signed in successfully!",
          description: "Welcome back to Casino Royal.",
        });
      }
      onClose();
      setFormData({ username: '', email: '', identifier: '', password: '' });
      setRememberMe(false);
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', email: '', identifier: '', password: '' });
    setRememberMe(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient-royal">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Enter your username"
              />
            </div>
          )}
          
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
          )}
          
          {!isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                value={formData.identifier}
                onChange={handleInputChange}
                required
                placeholder="Enter your email or username"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {!isSignUp && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me (30 days)
              </Label>
            </div>
          )}
          
          <Button 
            type="submit" 
            variant="royal" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>
        
        <div className="text-center mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 text-accent hover:underline font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
          
          {!isSignUp && (
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
              onClick={() => {
                toast({
                  title: "Forgot password",
                  description: "Password reset functionality is in demo mode.",
                });
              }}
            >
              Forgot password?
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};