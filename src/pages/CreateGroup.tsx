import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Users, MapPin, Tag, TrendingUp, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Separator } from "@/components/ui/separator";

const CreateGroup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    category: "",
    size: "",
    contribution_amount: "",
    meeting_frequency: "weekly"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a group",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }

      const { data: groupData, error: groupError } = await supabase.from("groups").insert([{
        name: formData.name,
        description: formData.description,
        location: formData.location,
        category: formData.category as "women" | "youth" | "family",
        size: parseInt(formData.size),
        member_count: 1,
        current_balance: 0,
        created_by: user.id
      }]).select().single();

      if (groupError) throw groupError;

      // Add creator as a member of the group
      const { error: memberError } = await supabase.from("group_members").insert([{
        group_id: groupData.id,
        user_id: user.id,
        current_balance: 0
      }]);

      if (memberError) throw memberError;

      toast({
        title: "Success",
        description: "Group created successfully! You are now the admin of this group."
      });

      navigate("/my-groups");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container max-w-2xl mx-auto p-4 pt-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Group</CardTitle>
            <CardDescription>
              Set up your savings group with all the necessary details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Tag className="h-5 w-5 text-primary" />
                  <span>Basic Information</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Women Empowerment Savings"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your group's purpose and goals..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="transition-all focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>

              <Separator />

              {/* Location & Category Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Location & Category</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Kigali, Gasabo"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="youth">Youth</SelectItem>
                        <SelectItem value="family">Family</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Group Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Group Settings</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Maximum Members *</Label>
                    <Input
                      id="size"
                      type="number"
                      min="5"
                      max="100"
                      placeholder="e.g., 20"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">Between 5 and 100 members</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contribution">Monthly Contribution (RWF)</Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contribution"
                        type="number"
                        min="0"
                        placeholder="e.g., 5000"
                        value={formData.contribution_amount}
                        onChange={(e) => setFormData({ ...formData, contribution_amount: e.target.value })}
                        className="pl-10 transition-all focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Optional: Set a regular contribution amount</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Meeting Frequency</Label>
                  <Select
                    value={formData.meeting_frequency}
                    onValueChange={(value) => setFormData({ ...formData, meeting_frequency: value })}
                  >
                    <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 text-lg transition-all hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse-subtle">Creating...</span>
                  </span>
                ) : (
                  "Create Group"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGroup;