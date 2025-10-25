import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "success" | "warning" | "accent";
}

const StatCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatCardProps) => {
  const variantStyles = {
    default: "bg-gradient-hero text-primary-foreground",
    success: "bg-gradient-success text-success-foreground",
    warning: "bg-warning/10 text-warning-foreground border-warning/20",
    accent: "bg-gradient-accent text-accent-foreground",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-lg",
            variantStyles[variant]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
