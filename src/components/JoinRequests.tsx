import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";

interface JoinRequest {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  user_name?: string;
  user_phone?: string;
}

interface JoinRequestsProps {
  groupId: string;
}

const JoinRequests = ({ groupId }: JoinRequestsProps) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, [groupId]);

  const fetchRequests = async () => {
    setLoading(true);
    const { data: requestsData, error } = await supabase
      .from("group_join_requests")
      .select("*")
      .eq("group_id", groupId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
      setLoading(false);
      return;
    }

    if (!requestsData) {
      setLoading(false);
      return;
    }

    // Fetch user profiles separately
    const userIds = requestsData.map(r => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, phone")
      .in("user_id", userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, { name: p.name, phone: p.phone }]) || []);
    
    const enrichedRequests = requestsData.map(req => ({
      ...req,
      user_name: profileMap.get(req.user_id)?.name || 'Unknown',
      user_phone: profileMap.get(req.user_id)?.phone || ''
    }));

    setRequests(enrichedRequests);
    setLoading(false);
  };

  const handleRequest = async (requestId: string, status: 'approved' | 'rejected', userId: string) => {
    try {
      const { error: updateError } = await supabase
        .from("group_join_requests")
        .update({ status })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // Get group name for notification
      const { data: groupData } = await supabase
        .from("groups")
        .select("name, member_count")
        .eq("id", groupId)
        .single();

      // If approved, add user to group_members
      if (status === 'approved') {
        const { error: memberError } = await supabase
          .from("group_members")
          .insert({
            group_id: groupId,
            user_id: userId,
            current_balance: 0
          });

        if (memberError) throw memberError;

        // Update group member count
        if (groupData) {
          await supabase
            .from("groups")
            .update({ member_count: (groupData.member_count || 0) + 1 })
            .eq("id", groupId);
        }

        // Send notification
        await supabase.rpc('create_notification', {
          p_user_id: userId,
          p_type: 'join_request_approved',
          p_title: 'Join Request Approved! 🎉',
          p_message: `Your request to join ${groupData?.name || 'the group'} has been approved.`,
          p_related_id: groupId
        });
      } else {
        // Send rejection notification
        await supabase.rpc('create_notification', {
          p_user_id: userId,
          p_type: 'join_request_rejected',
          p_title: 'Join Request Declined',
          p_message: `Your request to join ${groupData?.name || 'the group'} has been declined.`,
          p_related_id: groupId
        });
      }

      toast({
        title: "Success",
        description: `Request ${status}`,
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Join Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No pending requests</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Requests ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{request.user_name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">{request.user_phone}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleRequest(request.id, 'approved', request.user_id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRequest(request.id, 'rejected', request.user_id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinRequests;