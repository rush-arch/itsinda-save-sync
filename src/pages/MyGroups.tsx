import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, DollarSign, ArrowLeft, MessageSquare, Shield } from 'lucide-react';
import { format } from 'date-fns';
import HeaderControls from '@/components/HeaderControls';
import GroupChat from '@/components/GroupChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JoinRequests from '@/components/JoinRequests';

const MyGroups = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    fetchUserGroups();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const fetchUserGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          groups (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const isGroupAdmin = (groupCreatedBy: string) => {
    return currentUserId === groupCreatedBy;
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/profile')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{t('profile.myGroups')}</h1>
          </div>
          <HeaderControls />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p>Loading...</p>
        ) : groups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't joined any groups yet.</p>
            <Button onClick={() => navigate('/home#groups')}>Find a Group</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((membership) => (
              <Card key={membership.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {membership.groups.name}
                        {isGroupAdmin(membership.groups.created_by) && (
                          <span className="text-primary" aria-label="Admin">
                            <Shield className="h-4 w-4" />
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>{membership.groups.location}</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleGroupExpansion(membership.groups.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {expandedGroupId === membership.groups.id ? 'Hide Chat' : 'Show Chat'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Balance
                      </span>
                      <span className="font-semibold">
                        {membership.current_balance.toLocaleString()} RWF
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Members
                      </span>
                      <span>{membership.groups.member_count}</span>
                    </div>
                    {membership.groups.next_saving_date && (
                      <div className="flex items-center justify-between text-sm col-span-2">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Next Saving
                        </span>
                        <span>{format(new Date(membership.groups.next_saving_date), 'PP')}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button className="w-full" onClick={() => navigate('/dashboard')}>
                    View Dashboard
                  </Button>

                  {expandedGroupId === membership.groups.id && (
                    <div className="pt-4 border-t">
                      <Tabs defaultValue="chat" className="w-full">
                        <TabsList className={`grid w-full ${isGroupAdmin(membership.groups.created_by) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                          <TabsTrigger value="chat">Chat</TabsTrigger>
                          {isGroupAdmin(membership.groups.created_by) && (
                            <TabsTrigger value="requests">Requests</TabsTrigger>
                          )}
                        </TabsList>
                        <TabsContent value="chat">
                          <GroupChat groupId={membership.groups.id} />
                        </TabsContent>
                        {isGroupAdmin(membership.groups.created_by) && (
                          <TabsContent value="requests">
                            <JoinRequests groupId={membership.groups.id} />
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyGroups;
