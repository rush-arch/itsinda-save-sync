import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  User, Phone, Mail, Shield, Bell, HelpCircle, 
  LogOut, ChevronRight, TrendingUp, Users as UsersIcon, Calendar, Receipt
} from "lucide-react";
import Navigation from "@/components/Navigation";
import HeaderControls from "@/components/HeaderControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    setUser(session.user);
    fetchProfile(session.user.id);
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logged out',
        description: 'Successfully logged out.',
      });
      navigate('/home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { icon: Receipt, label: "Transactions", value: "View history", action: "transactions" },
    { icon: Phone, label: "Phone Number", value: profile?.phone || "Not set", action: "edit" },
    { icon: Mail, label: "Email", value: user?.email || "Not set", action: "edit" },
    { icon: Shield, label: "Security", value: "Change PIN", action: "navigate" },
    { icon: Bell, label: "Notifications", value: "Manage preferences", action: "navigate" },
    { icon: HelpCircle, label: "Help & Support", value: "Get help", action: "navigate" },
  ];

  const handleMenuItemClick = (action: string) => {
    if (action === "transactions") {
      navigate("/transactions");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero px-4 pt-8 pb-24 rounded-b-3xl">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-primary-foreground mb-2">{t('profile.title')}</h1>
            <p className="text-primary-foreground/80 text-sm">Manage your account</p>
          </div>
          <HeaderControls />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 -mt-16">
        {/* Profile Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <ProfilePhotoUpload
                  currentPhoto={profile?.photo}
                  userName={profile?.name || user?.email || 'User'}
                  onPhotoUpdate={(url) => setProfile({ ...profile, photo: url })}
                />
              </div>
              <h2 className="text-xl font-bold mb-1">{profile?.name || user?.email || 'User'}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {user?.created_at && `Member since ${new Date(user.created_at).toLocaleDateString()}`}
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <p className="text-2xl font-bold text-primary">
                      {profile?.total_savings?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('profile.totalSavings')}</p>
                </div>
                <div className="text-center cursor-pointer" onClick={() => navigate('/my-groups')}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <UsersIcon className="h-4 w-4 text-primary" />
                    <p className="text-2xl font-bold text-primary">0</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('profile.myGroups')}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-success" />
                    <p className="text-2xl font-bold text-success">0</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Contributions</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 w-full mt-4">
                <Button 
                  onClick={() => navigate('/my-groups')} 
                  variant="default"
                  className="w-full"
                >
                  <UsersIcon className="h-4 w-4 mr-2" />
                  My Groups
                </Button>
                <Button 
                  onClick={() => navigate('/create-group')} 
                  variant="outline"
                  className="w-full"
                >
                  Create Group
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button 
                  className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                  onClick={() => handleMenuItemClick(item.action)}
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.value}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-4">
          Itsinda v1.0.0 • Made with care for communities
        </p>
      </main>

      <Navigation />
    </div>
  );
};

export default Profile;
