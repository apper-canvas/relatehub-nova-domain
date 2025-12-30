import { format } from "date-fns";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const DealCard = ({ deal, contactName, isDragging }) => {
  const stageColors = {
    "Lead": "info",
    "Qualified": "info",
    "Proposal": "warning",
    "Negotiation": "warning",
    "Closed": "success"
  };

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">{deal.title}</h4>
        <Badge variant={stageColors[deal.stage] || "default"}>
          {deal.stage}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Value</span>
          <span className="font-semibold text-primary">
            ${deal.value.toLocaleString()}
          </span>
        </div>

        {contactName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="User" size={14} />
            <span>{contactName}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <ApperIcon name="Clock" size={12} />
          <span>Updated {format(new Date(deal.updatedAt), "MMM d")}</span>
        </div>
      </div>
    </div>
  );
};

export default DealCard;