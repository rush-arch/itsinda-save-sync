import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp } from "lucide-react";
import Navigation from "@/components/Navigation";
import GroupChat from "@/components/GroupChat";
import JoinRequests from "@/components/JoinRequests";
import DiscussionPanel from "@/components/DiscussionPanel";
import GroupSettings from "@/components/GroupSettings";
import MembersList from "@/components/MembersList";

const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchGroup();
    checkAdmin();
  }, [id]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setCurrentUserId(user.id);
    
    if (id) {
      const { data } = await supabase
        .from("groups")
        .select("created_by")
        .eq("id", id)
        .single();
      
      setIsAdmin(data?.created_by === user.id);
    }
  };

  const fetchGroup = async () => {
    if (!id) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching group:", error);
    } else {
      setGroup(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!group) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Group not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="container max-w-4xl mx-auto p-4 pt-20">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <header className="bg-gradient-accent px-6 py-8 rounded-3xl mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-accent-foreground">{group.name}</h1>
            {isAdmin && (
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                Admin
              </span>
            )}
          </div>
          <p className="text-accent-foreground/70 text-sm mt-1">{group.location}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{group.current_balance || 0} RWF</p>
              <p className="text-sm text-muted-foreground">Total Savings</p>
            </div>
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{group.member_count}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
            <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4">
              <p className="text-2xl font-bold capitalize">{group.category}</p>
              <p className="text-sm text-muted-foreground">Category</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
            {isAdmin && <TabsTrigger value="requests">Requests</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{group.description || "No description available"}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            {id && <GroupChat groupId={id} />}
          </TabsContent>

          <TabsContent value="discussion">
            {id && <DiscussionPanel groupId={id} groupName={group.name} />}
          </TabsContent>

          <TabsContent value="members">
            {id && <MembersList groupId={id} isAdmin={isAdmin} creatorId={group.created_by} />}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="settings">
              {id && <GroupSettings groupId={id} isAdmin={isAdmin} />}
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="requests">
              {id && <JoinRequests groupId={id} />}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default GroupDetail;