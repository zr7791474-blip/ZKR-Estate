import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function Empty({
  title,
  description,
  icon,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName
}: EmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center",
        className
      )}
    >
      <div
        className={cn(
          "mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500",
          iconClassName
        )}
      >
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className={cn("text-base font-semibold text-slate-900", titleClassName)}>{title}</h3>
      {description && (
        <p className={cn("mt-1 max-w-sm text-sm text-slate-500", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}