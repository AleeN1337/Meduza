import React from "react";
import { cn } from "../../lib/utils";

const DateTimePicker = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="datetime-local"
    ref={ref}
    className={cn("p-2 rounded border", className)}
    {...props}
  />
));
DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker };
