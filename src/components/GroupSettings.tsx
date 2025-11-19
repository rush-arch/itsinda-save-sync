import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

interface GroupSettingsProps {
  groupId: string;
  isAdmin: boolean;
}

const GroupSettings = ({ groupId, isAdmin }: GroupSettingsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    size: "",
  });

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error fetching group:", error);
    } else {
      setGroupData({
        name: data.name,
        description: data.description || "",
        location: data.location,
        category: data.category,
        size: data.size.toString(),
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admins can modify group settings",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("groups")
      .update({
        name: groupData.name,
        description: groupData.description,
        location: groupData.location,
        category: groupData.category as "women" | "youth" | "family",
        size: parseInt(groupData.size),
        updated_at: new Date().toISOString(),
      })
      .eq("id", groupId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update group settings",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Group settings updated successfully"
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Group Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Group Name</Label>
          <Input
            id="name"
            value={groupData.name}
            onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
            disabled={!isAdmin}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={groupData.description}
            onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
            rows={3}
            disabled={!isAdmin}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={groupData.location}
            onChange={(e) => setGroupData({ ...groupData, location: e.target.value })}
            disabled={!isAdmin}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={groupData.category}
            onValueChange={(value) => setGroupData({ ...groupData, category: value })}
            disabled={!isAdmin}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="family">Family</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Maximum Members</Label>
          <Input
            id="size"
            type="number"
            min="5"
            max="100"
            value={groupData.size}
            onChange={(e) => setGroupData({ ...groupData, size: e.target.value })}
            disabled={!isAdmin}
          />
        </div>

        {isAdmin && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupSettings;
