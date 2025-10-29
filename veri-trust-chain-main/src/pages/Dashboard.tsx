import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, XCircle, Clock, ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";

interface VerificationData {
  id: string;
  user_id: string;
  status: string;
  credit_score: number;
  trust_score: number;
  blockchain_hash: string;
  created_at: string;
  id_verified: boolean;
  selfie_verified: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<VerificationData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    setUser(user);
    await fetchVerificationData(user.id);
  };

  const fetchVerificationData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setVerification(data);
    } catch (error: any) {
      console.error("Error fetching verification:", error);
      toast.error("Failed to load verification data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="w-5 h-5 text-secondary" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <div className="animate-pulse-glow">
          <Shield className="w-16 h-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">VeriTrust+</h1>
              <p className="text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {!verification ? (
          <Card className="p-12 text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Verification Found</h2>
            <p className="text-muted-foreground mb-6">
              Start your verification process to access your credit score and trust rating.
            </p>
            <Button onClick={() => navigate("/verify")} className="gradient-hero">
              Start Verification
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verification Status Card */}
            <Card className="p-6 gradient-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Verification Status</h3>
                <Badge className={getStatusColor(verification.status)}>
                  {getStatusIcon(verification.status)}
                  <span className="ml-2 capitalize">{verification.status}</span>
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm font-medium">ID Verification</span>
                  {verification.id_verified ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <span className="text-sm font-medium">Selfie Verification</span>
                  {verification.selfie_verified ? (
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                  ) : (
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </Card>

            {/* Credit Score Card */}
            <Card className="p-6 gradient-card">
              <h3 className="text-xl font-semibold mb-4">Credit Score</h3>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-primary mb-2">
                  {verification.credit_score}
                </div>
                <p className="text-sm text-muted-foreground">out of 850</p>
              </div>
              <Progress value={(verification.credit_score / 850) * 100} className="h-3" />
            </Card>

            {/* Trust Score Card */}
            <Card className="p-6 gradient-card">
              <h3 className="text-xl font-semibold mb-4">Trust Score</h3>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold gradient-verified bg-clip-text text-transparent mb-2">
                  {verification.trust_score}
                </div>
                <p className="text-sm text-muted-foreground">out of 100</p>
              </div>
              <Progress value={verification.trust_score} className="h-3 [&>div]:gradient-verified" />
            </Card>

            {/* Blockchain Proof Card */}
            <Card className="p-6 gradient-card">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                Blockchain Proof
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                  <code className="text-xs bg-background/50 p-2 rounded block overflow-x-auto">
                    {verification.blockchain_hash}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                  <p className="text-sm">
                    {new Date(verification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {verification && (
          <div className="mt-6 text-center">
            <Button onClick={() => navigate("/verify")} variant="outline">
              Run New Verification
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;