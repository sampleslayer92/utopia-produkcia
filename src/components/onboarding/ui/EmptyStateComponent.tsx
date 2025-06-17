
import React from 'react';
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateComponentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onAction: () => void;
  className?: string;
}

const EmptyStateComponent = ({ 
  icon: Icon, 
  title, 
  description, 
  buttonText, 
  onAction,
  className = ""
}: EmptyStateComponentProps) => {
  return (
    <div className={`text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 ${className}`}>
      <Icon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{description}</p>
      <Button 
        onClick={onAction}
        variant="outline" 
        className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default EmptyStateComponent;
