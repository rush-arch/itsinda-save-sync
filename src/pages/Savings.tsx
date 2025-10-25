import { ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Savings = () => {
  const savingsHistory = [
    { id: 1, date: "Dec 20, 2025", amount: "50,000 RWF", status: "completed", method: "MTN Mobile Money" },
    { id: 2, date: "Nov 20, 2025", amount: "50,000 RWF", status: "completed", method: "Airtel Money" },
    { id: 3, date: "Oct 20, 2025", amount: "50,000 RWF", status: "completed", method: "MTN Mobile Money" },
    { id: 4, date: "Sep 20, 2025", amount: "25,000 RWF", status: "pending", method: "MTN Mobile Money" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success hover:bg-success/20";
      case "pending":
        return "bg-warning/10 text-warning hover:bg-warning/20";
      case "failed":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-success px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-success-foreground mb-2">My Savings</h1>
          <p className="text-success-foreground/80 text-sm mb-6">Track your contributions</p>
          
          {/* Total Saved Card */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
            <p className="text-3xl font-bold text-foreground mb-4">845,000 RWF</p>
            <div className="flex items-center gap-2 text-success text-sm">
              <ArrowUpRight className="h-4 w-4" />
              <span>+12% from last month</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Quick Action */}
        <Button 
          className="w-full bg-gradient-success text-success-foreground font-semibold"
          size="lg"
        >
          Make a Payment
        </Button>

        {/* Savings Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">December 30, 2025</p>
                <p className="text-sm text-muted-foreground">Monthly contribution</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary">50,000 RWF</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingsHistory.map((saving) => (
              <div key={saving.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="flex-shrink-0">
                  {getStatusIcon(saving.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{saving.date}</p>
                  <p className="text-xs text-muted-foreground">{saving.method}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-semibold">{saving.amount}</p>
                  <Badge variant="secondary" className={getStatusColor(saving.status)}>
                    {saving.status}
                  </Badge>
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

export default Savings;
