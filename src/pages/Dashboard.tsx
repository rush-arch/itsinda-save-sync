import { Wallet, TrendingUp, HandCoins, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const recentActivities = [
    { id: 1, user: "Marie K.", action: "saved", amount: "50,000 RWF", time: "2 hours ago", avatar: "MK" },
    { id: 2, user: "Jean P.", action: "requested loan", amount: "200,000 RWF", time: "5 hours ago", avatar: "JP" },
    { id: 3, user: "Grace N.", action: "repaid", amount: "75,000 RWF", time: "1 day ago", avatar: "GN" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Welcome back!</h1>
              <p className="text-primary-foreground/80 text-sm">Umuganda Savings Group</p>
            </div>
            <Avatar className="h-12 w-12 ring-2 ring-primary-foreground/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-accent text-accent-foreground">UN</AvatarFallback>
            </Avatar>
          </div>
          
          {/* Quick Action */}
          <Button 
            className="w-full bg-card hover:bg-card/90 text-card-foreground font-semibold"
            size="lg"
          >
            <Wallet className="mr-2 h-5 w-5" />
            Send Saving
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 -mt-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            title="Total Saved"
            value="845,000"
            icon={TrendingUp}
            trend="+12% this month"
            variant="success"
          />
          <StatCard
            title="Active Loans"
            value="250,000"
            icon={HandCoins}
            trend="2 loans"
            variant="warning"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            title="Next Payment"
            value="Dec 30"
            icon={Wallet}
            trend="50,000 RWF"
            variant="default"
          />
          <StatCard
            title="Members"
            value="24"
            icon={Users}
            trend="Active"
            variant="accent"
          />
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.user} {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{activity.amount}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default Dashboard;
