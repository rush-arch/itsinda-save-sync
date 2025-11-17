import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Filter, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  created_at: string;
  group_id: string;
  groups?: {
    name: string;
  };
}

const Transactions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get user's groups
      const { data: memberGroups } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);

      const { data: createdGroups } = await supabase
        .from("groups")
        .select("id")
        .eq("created_by", user.id);

      const groupIds = [
        ...(memberGroups?.map(g => g.group_id) || []),
        ...(createdGroups?.map(g => g.id) || [])
      ];

      if (groupIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*, groups(name)")
        .in("group_id", groupIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesSearch = tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.groups?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const exportToCSV = () => {
    const headers = ["Date", "Type", "Amount", "Group", "Description", "Status"];
    const rows = filteredTransactions.map(tx => [
      new Date(tx.created_at).toLocaleDateString(),
      tx.type,
      tx.amount,
      tx.groups?.name || "Unknown",
      tx.description || "",
      tx.status
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Success",
      description: "Transactions exported successfully"
    });
  };

  const getTypeIcon = (type: string) => {
    if (type === "saving" || type === "repayment" || type === "interest") {
      return <TrendingUp className="h-4 w-4 text-success" />;
    }
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      saving: "bg-success/10 text-success border-success/20",
      loan: "bg-warning/10 text-warning border-warning/20",
      repayment: "bg-success/10 text-success border-success/20",
      interest: "bg-primary/10 text-primary border-primary/20",
      withdrawal: "bg-destructive/10 text-destructive border-destructive/20"
    };
    return colors[type] || "bg-muted";
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="container max-w-4xl mx-auto p-4 pt-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Transaction History</h1>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} transactions
              </p>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="saving">Saving</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="repayment">Repayment</SelectItem>
                  <SelectItem value="interest">Interest</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <Card key={tx.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-muted rounded-lg mt-1">
                        {getTypeIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getTypeColor(tx.type)}>
                            {tx.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {tx.groups?.name || "Unknown Group"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tx.description || "No description"}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        tx.type === "loan" || tx.type === "withdrawal" 
                          ? "text-destructive" 
                          : "text-success"
                      }`}>
                        {tx.type === "loan" || tx.type === "withdrawal" ? "-" : "+"}
                        {tx.amount.toLocaleString()} RWF
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;