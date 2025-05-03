
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm from "@/components/AuthForm";
import { Disc } from "lucide-react";

const AuthPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Redirect to home if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <Disc className="h-10 w-10 text-thc-blue" />
          <h1 className="text-3xl font-bold ml-2 text-thc-blue">THeeCosystem</h1>
        </div>
        <p className="text-gray-400">Sign in to access artist profiles, upload music, and more.</p>
      </div>
      
      <AuthForm />
    </div>
  );
};

export default AuthPage;
