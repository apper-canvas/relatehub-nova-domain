import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox", 
  title = "No items found", 
  description = "Get started by creating your first item.",
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={40} className="text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-secondary text-sm">{description}</p>
        </div>
        {onAction && actionLabel && (
          <Button onClick={onAction} variant="primary">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;