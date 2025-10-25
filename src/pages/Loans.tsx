import { Plus, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Loans = () => {
  const activeLoans = [
    {
      id: 1,
      type: "Saving Loan",
      amount: "200,000 RWF",
      outstanding: "150,000 RWF",
      progress: 25,
      nextPayment: "Jan 15, 2026",
      status: "active",
    },
    {
      id: 2,
      type: "Helping Loan",
      amount: "50,000 RWF",
      outstanding: "40,000 RWF",
      progress: 20,
      nextPayment: "Jan 20, 2026",
      status: "active",
    },
  ];

  const loanRequests = [
    {
      id: 3,
      type: "Saving Loan",
      amount: "300,000 RWF",
      purpose: "School fees",
      requestDate: "Dec 15, 2025",
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-hero px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">Loans</h1>
          <p className="text-primary-foreground/80 text-sm mb-6">Manage your loans</p>
          
          {/* Total Outstanding Card */}
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
            <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
            <p className="text-3xl font-bold text-foreground mb-3">190,000 RWF</p>
            <div className="flex items-center gap-2">
              <Progress value={24} className="flex-1" />
              <span className="text-xs text-muted-foreground">24% paid</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Request Loan Button */}
        <Button 
          className="w-full bg-gradient-hero text-primary-foreground font-semibold"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          Request New Loan
        </Button>

        {/* Pending Requests */}
        {loanRequests.length > 0 && (
          <Card className="border-warning/20 bg-warning/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loanRequests.map((request) => (
                <div key={request.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{request.type}</p>
                      <p className="text-sm text-muted-foreground">{request.purpose}</p>
                      <p className="text-xs text-muted-foreground">{request.requestDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{request.amount}</p>
                      <Badge variant="secondary" className="bg-warning/10 text-warning">
                        Pending
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Active Loans */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Loans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="space-y-3 pb-6 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{loan.type}</p>
                    <p className="text-sm text-muted-foreground">Original: {loan.amount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-destructive">{loan.outstanding}</p>
                    <p className="text-xs text-muted-foreground">outstanding</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{loan.progress}% paid</span>
                  </div>
                  <Progress value={loan.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Next payment</span>
                  </div>
                  <span className="text-sm font-semibold">{loan.nextPayment}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Loan Limits Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Your Loan Limit</p>
                <p className="text-xs text-muted-foreground">
                  Based on your savings, you can borrow up to 400,000 RWF
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
};

export default Loans;
