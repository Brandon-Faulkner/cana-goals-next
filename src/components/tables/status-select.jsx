import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CircleX,
  BriefcaseBusiness,
  CheckCheck,
  Hourglass,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statuses = [
  {
    value: "Not Working On",
    icon: CircleX,
    color: "border-chart-1 text-chart-1",
  },
  {
    value: "Working On",
    icon: BriefcaseBusiness,
    color: "border-chart-2 text-chart-2",
  },
  {
    value: "Completed",
    icon: CheckCheck,
    color: "border-chart-3 text-chart-3",
  },
  { value: "Waiting", icon: Hourglass, color: "border-chart-4 text-chart-4" },
  { value: "Stuck", icon: TriangleAlert, color: "border-chart-5 text-chart-5" },
];

export function StatusSelect({ value, onValueChange }) {
  const selected = statuses.find((s) => s.value === value);
  const StatusIcon = selected?.icon;
  const bgColor = selected?.color ?? "bg-white";

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-[180px] border-2", bgColor)}>
        <SelectValue>
          <div className="flex items-center gap-2">
            {StatusIcon && <StatusIcon className={cn("h-4 w-4", bgColor)} />}
            <span>{value}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => {
          const Icon = status.icon;
          return (
            <SelectItem
              key={status.value}
              value={status.value}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", status.color.split(" ")[1])} />
                <span>{status.value}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
