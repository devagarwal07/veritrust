import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle2, Lock, Zap, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-4 mb-6 animate-pulse-glow">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-6xl font-bold">VeriTrust+</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            AI-Powered Biometric Verification &<br />
            <span className="gradient-hero bg-clip-text text-transparent">
              Credit Score System on Blockchain
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure, transparent, and instant identity verification with AI-driven credit scoring 
            and immutable blockchain proof storage.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => navigate("/login")} 
              size="lg" 
              className="gradient-hero shadow-glow text-lg px-8"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")} 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
            >
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          <Card className="p-8 gradient-card border-primary/20 hover:shadow-glow transition-all">
            <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">KYC Verification</h3>
            <p className="text-muted-foreground">
              Advanced AI and computer vision technology to verify ID authenticity and match selfies to documents instantly.
            </p>
          </Card>

          <Card className="p-8 gradient-card border-secondary/20 hover:shadow-glow transition-all">
            <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Credit Score AI</h3>
            <p className="text-muted-foreground">
              Machine learning algorithms generate accurate Credit Scores (0-850) and Trust Scores (0-100) from verified data.
            </p>
          </Card>

          <Card className="p-8 gradient-card border-accent/20 hover:shadow-glow transition-all">
            <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-3">Blockchain Proof</h3>
            <p className="text-muted-foreground">
              Immutable storage of verification and credit score hashes on blockchain for transparent, tamper-proof records.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Documents</h3>
                <p className="text-muted-foreground">
                  Securely upload your government-issued ID and take a live selfie for verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI Verification Process</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes document authenticity, performs facial recognition, and calculates your credit and trust scores.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Blockchain Certification</h3>
                <p className="text-muted-foreground">
                  Verification results are hashed and stored immutably on the blockchain for permanent proof.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Access Your Dashboard</h3>
                <p className="text-muted-foreground">
                  View your verification status, scores, and blockchain receipts in your personalized dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <Card className="p-12 gradient-card max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Verified?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of users who trust VeriTrust+ for secure identity verification and credit scoring.
            </p>
            <Button 
              onClick={() => navigate("/login")} 
              size="lg" 
              className="gradient-hero shadow-glow text-lg px-12"
            >
              Start Verification Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
