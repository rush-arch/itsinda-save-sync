import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Member {
  id: string;
  user_id: string;
  joined_at: string;
  current_balance: number;
  profile?: {
    name: string;
    photo?: string;
  };
}

interface MembersListProps {
  groupId: string;
  isAdmin: boolean;
  creatorId?: string;
}

const MembersList = ({ groupId, isAdmin, creatorId }: MembersListProps) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    setLoading(true);
    const { data: membersData, error } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", groupId);

    if (error) {
      console.error("Error fetching members:", error);
      setLoading(false);
      return;
    }

    // Fetch profiles for all members
    const userIds = membersData.map(m => m.user_id);
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, name, photo")
      .in("user_id", userIds);

    const enrichedMembers = membersData.map(member => ({
      ...member,
      profile: profilesData?.find(p => p.user_id === member.user_id)
    }));

    setMembers(enrichedMembers as Member[]);
    setLoading(false);
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (!isAdmin) return;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", memberId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    } else {
      // Update group member count
      await supabase
        .from("groups")
        .update({ member_count: members.length - 1 })
        .eq("id", groupId);

      toast({
        title: "Success",
        description: "Member removed from group"
      });
      fetchMembers();
    }
    setRemovingMember(null);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Loading members...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => {
              const isCreator = member.user_id === creatorId;
              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profile?.photo} />
                      <AvatarFallback>
                        {member.profile?.name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.profile?.name || "Unknown"}</p>
                        {isCreator && (
                          <Badge variant="secondary" className="gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Balance: {member.current_balance} RWF
                      </p>
                    </div>
                  </div>
                  {isAdmin && !isCreator && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemovingMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this member from the group? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const member = members.find(m => m.id === removingMember);
                if (member) handleRemoveMember(member.id, member.user_id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MembersList;
