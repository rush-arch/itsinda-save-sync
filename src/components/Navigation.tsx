import { Home, PiggyBank, HandCoins, Users, User, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: PiggyBank, label: "Savings", path: "/savings" },
    { icon: HandCoins, label: "Loans", path: "/loans" },
    { icon: Users, label: "Groups", path: "/my-groups" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logged out',
        description: 'Successfully logged out',
      });
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 transition-colors min-w-[60px] text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
