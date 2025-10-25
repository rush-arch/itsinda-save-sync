import { useState } from "react";
import { Bell, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface ReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingDate: string;
  onSetReminder: (settings: ReminderSettings) => void;
}

export interface ReminderSettings {
  enabled: boolean;
  timeBefore: string;
  smsEnabled: boolean;
  pushEnabled: boolean;
}

const ReminderDialog = ({ open, onOpenChange, meetingDate, onSetReminder }: ReminderDialogProps) => {
  const [timeBefore, setTimeBefore] = useState("1day");
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const handleSave = () => {
    onSetReminder({
      enabled: true,
      timeBefore,
      smsEnabled,
      pushEnabled,
    });
    onOpenChange(false);
  };

  const timeOptions = [
    { value: "15min", label: "15 minutes before", icon: "⚡" },
    { value: "1hour", label: "1 hour before", icon: "🕐" },
    { value: "1day", label: "1 day before", icon: "📅" },
    { value: "1week", label: "1 week before", icon: "📆" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Set Meeting Reminder
          </DialogTitle>
          <DialogDescription>
            Get notified before your group meeting on {meetingDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Time Before Meeting */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Remind me</Label>
            <RadioGroup value={timeBefore} onValueChange={setTimeBefore}>
              {timeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex items-center gap-2 font-normal cursor-pointer"
                  >
                    <span className="text-lg">{option.icon}</span>
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Notification Methods */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Notification method</Label>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Push Notification</p>
                  <p className="text-xs text-muted-foreground">In-app alert</p>
                </div>
              </div>
              <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Clock className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">SMS Reminder</p>
                  <p className="text-xs text-muted-foreground">Text message</p>
                </div>
              </div>
              <Switch checked={smsEnabled} onCheckedChange={setSmsEnabled} />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!smsEnabled && !pushEnabled}
            className="bg-gradient-hero text-primary-foreground"
          >
            Set Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderDialog;
