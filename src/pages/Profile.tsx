import { 
  User, Phone, Mail, Shield, Bell, HelpCircle, 
  LogOut, ChevronRight, Camera 
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const menuItems = [
    { icon: Phone, label: "Phone Number", value: "+250 788 123 456", action: "edit" },
    { icon: Mail, label: "Email", value: "marie.k@example.com", action: "edit" },
    { icon: Shield, label: "Security", value: "Change PIN", action: "navigate" },
    { icon: Bell, label: "Notifications", value: "Manage preferences", action: "navigate" },
    { icon: HelpCircle, label: "Help & Support", value: "Get help", action: "navigate" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero px-4 pt-8 pb-24 rounded-b-3xl">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">Profile</h1>
          <p className="text-primary-foreground/80 text-sm">Manage your account</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 -mt-16">
        {/* Profile Card */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-24 w-24 ring-4 ring-background">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground text-2xl">
                    MK
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                  variant="default"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold mb-1">Marie Kagabo</h2>
              <p className="text-sm text-muted-foreground mb-4">Member since Jan 2023</p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">845K</p>
                  <p className="text-xs text-muted-foreground">Total Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">190K</p>
                  <p className="text-xs text-muted-foreground">Loans</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">24</p>
                  <p className="text-xs text-muted-foreground">Months</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left">
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
