import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ContactCard = ({ contact, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={() => onClick(contact)}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <Avatar initials={contact.avatar} size="md" />
        <Badge variant={contact.status.toLowerCase()}>
          {contact.status}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-gray-900 text-base">{contact.name}</h3>
        <p className="text-sm text-gray-600">{contact.company}</p>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ApperIcon name="Mail" size={14} />
          <span className="truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ApperIcon name="Phone" size={14} />
          <span>{contact.phone}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactCard;