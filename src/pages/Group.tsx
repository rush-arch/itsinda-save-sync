import { Users, TrendingUp, Calendar, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Group = () => {
  const groupStats = [
    { label: "Total Savings", value: "12.5M RWF", change: "+8.2%" },
    { label: "Active Members", value: "24", change: "+2 this month" },
    { label: "Active Loans", value: "8", change: "4.2M RWF total" },
  ];

  const members = [
    { id: 1, name: "Marie Kagabo", saved: "845,000 RWF", avatar: "MK", role: "Member" },
    { id: 2, name: "Jean Pierre", saved: "750,000 RWF", avatar: "JP", role: "Manager" },
    { id: 3, name: "Grace Niyonzima", saved: "920,000 RWF", avatar: "GN", role: "Member" },
    { id: 4, name: "David Uwase", saved: "680,000 RWF", avatar: "DU", role: "Member" },
    { id: 5, name: "Alice Mutoni", saved: "890,000 RWF", avatar: "AM", role: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-accent px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-accent-foreground">Umuganda Group</h1>
              <p className="text-accent-foreground/70 text-sm">Est. January 2023</p>
            </div>
            <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-accent-foreground/10">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Group Stats */}
          <div className="grid grid-cols-3 gap-3">
            {groupStats.map((stat, index) => (
              <div key={index} className="bg-card/95 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-success mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Next Meeting */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Next Meeting</p>
                <p className="text-sm text-muted-foreground">January 15, 2026 at 10:00 AM</p>
              </div>
              <Button size="sm">Set Reminder</Button>
            </div>
          </CardContent>
        </Card>

        {/* Group Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Group Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Savings Rate</span>
                <span className="font-semibold text-success">98% on-time</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Loan Repayment</span>
                <span className="font-semibold text-success">95% on-time</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Interest Rate</span>
                <span className="font-semibold">10% annual</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Members
              </CardTitle>
              <Button variant="outline" size="sm">Invite</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{member.saved}</p>
                  <p className="text-xs text-muted-foreground">saved</p>
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

export default Group;
