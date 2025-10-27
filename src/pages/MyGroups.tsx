import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import HeaderControls from '@/components/HeaderControls';

const MyGroups = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((membership) => (
              <Card key={membership.id}>
                <CardHeader>
                  <CardTitle>{membership.groups.name}</CardTitle>
                  <CardDescription>{membership.groups.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
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
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Next Saving
                      </span>
                      <span>{format(new Date(membership.groups.next_saving_date), 'PP')}</span>
                    </div>
                  )}
                  <Button className="w-full mt-4" onClick={() => navigate('/dashboard')}>
                    View Dashboard
                  </Button>
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
