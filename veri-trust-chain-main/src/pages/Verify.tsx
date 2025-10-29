import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Upload, Camera, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Verify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string>("");
  const [selfiePreview, setSelfiePreview] = useState<string>("");

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIdPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelfieFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setSelfiePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!idFile || !selfieFile) {
      toast.error("Please upload both ID and selfie");
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Convert images to base64
      const idBase64 = await fileToBase64(idFile);
      const selfieBase64 = await fileToBase64(selfieFile);

      // Call verification edge function
      const { data, error } = await supabase.functions.invoke("verify-identity", {
        body: { 
          idImage: idBase64,
          selfieImage: selfieBase64,
          userId: user.id
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Verification complete!");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("Failed to process verification");
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-xl animate-pulse-glow">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">VeriTrust+</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Biometric Verification Process
          </p>
        </div>

        <Card className="p-8 gradient-card">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="text-sm font-medium">ID Document</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="text-sm font-medium">Selfie</span>
            </div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="text-sm font-medium">Verify</span>
            </div>
          </div>

          {/* Step 1: ID Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="id-upload" className="text-lg mb-3 block">
                  Upload ID Document
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a clear photo of your government-issued ID (passport, driver's license, etc.)
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Input
                    id="id-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleIdUpload}
                    className="hidden"
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    {idPreview ? (
                      <div>
                        <img src={idPreview} alt="ID Preview" className="max-h-48 mx-auto rounded-lg mb-4" />
                        <p className="text-sm text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!idFile}
                className="w-full gradient-hero"
              >
                Next: Selfie Verification
              </Button>
            </div>
          )}

          {/* Step 2: Selfie Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="selfie-upload" className="text-lg mb-3 block">
                  Take a Selfie
                </Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Take a clear selfie photo for facial verification
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Input
                    id="selfie-upload"
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={handleSelfieUpload}
                    className="hidden"
                  />
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    {selfiePreview ? (
                      <div>
                        <img src={selfiePreview} alt="Selfie Preview" className="max-h-48 mx-auto rounded-lg mb-4" />
                        <p className="text-sm text-muted-foreground">Click to retake</p>
                      </div>
                    ) : (
                      <div>
                        <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">Click to take selfie</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="w-full"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selfieFile}
                  className="w-full gradient-hero"
                >
                  Next: Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle2 className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Verify</h3>
                <p className="text-sm text-muted-foreground">
                  Review your documents and submit for AI-powered verification
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">ID Document</p>
                  {idPreview && (
                    <img src={idPreview} alt="ID" className="w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Selfie</p>
                  {selfiePreview && (
                    <img src={selfiePreview} alt="Selfie" className="w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-full"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full gradient-hero"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Submit Verification
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verify;