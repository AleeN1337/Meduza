import React from "react";
import ReactDOM from "react-dom";
import { cn } from "../../lib/utils";
import { Button } from "./button";

const Dialog = ({ open, onClose, title, children, className }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "bg-white rounded-lg p-6 text-black w-full max-w-md",
          className
        )}
      >
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        {children}
        {onClose && (
          <div className="pt-4 text-right">
            <Button onClick={onClose}>Zamknij</Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Dialog;
