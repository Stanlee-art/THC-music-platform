
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Disc } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <Disc className="h-20 w-20 text-thc-blue mx-auto mb-6 animate-pulse-slow" />
        <h1 className="text-6xl font-bold mb-4 text-thc-blue text-glow">404</h1>
        <p className="text-xl text-gray-400 mb-6">
          Oops! This track doesn't exist
        </p>
        <Button asChild className="bg-thc-blue hover:bg-thc-blue-light">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
