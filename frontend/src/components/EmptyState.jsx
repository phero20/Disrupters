import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({ message }) => {
  return (
    <div className="text-center py-16">
      <Inbox size={40} className="mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
