import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ title, onSearch, showNewButton, onNewClick, newButtonLabel = "New", onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          
<div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">CRMFlow</span>
          </div>
          
          <h1 className="hidden lg:block text-2xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onSearch && (
            <SearchBar
              placeholder="Search..."
              onSearch={onSearch}
              className="flex-1"
            />
          )}
        </div>

        {showNewButton && (
          <Button onClick={onNewClick} variant="primary" className="hidden sm:flex">
            <ApperIcon name="Plus" size={18} />
            {newButtonLabel}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;