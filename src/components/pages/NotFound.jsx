import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="SearchX" size={48} className="text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Page not found</h2>
          <p className="text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")} variant="primary">
            <ApperIcon name="Home" size={18} />
            Go to Contacts
          </Button>
          <Button onClick={() => navigate(-1)} variant="secondary">
            <ApperIcon name="ArrowLeft" size={18} />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;