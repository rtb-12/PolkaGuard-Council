
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Check, FileText, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProofUpload = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [contractAddress, setContractAddress] = useState("");
  const [exploitType, setExploitType] = useState("");
  const { toast } = useToast();

  const totalSteps = 4;

  const steps = [
    { id: 1, title: "Connect Wallet", icon: Shield },
    { id: 2, title: "Upload ZK Proof", icon: Upload },
    { id: 3, title: "Validate & Review", icon: FileText },
    { id: 4, title: "Submit to Registry", icon: Check }
  ];

  const connectWallet = () => {
    console.log("Connecting Polkadot.js wallet...");
    setIsWalletConnected(true);
    setCurrentStep(2);
    toast({
      title: "Wallet Connected",
      description: "Successfully connected to Polkadot.js",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofFile(file);
      console.log("Proof file uploaded:", file.name);
    }
  };

  const validateProof = () => {
    if (!proofFile || !contractAddress || !exploitType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
    console.log("Validating proof...");
  };

  const submitToRegistry = () => {
    setCurrentStep(4);
    console.log("Submitting to registry...");
    toast({
      title: "Proof Submitted",
      description: "Your ZK proof has been registered successfully",
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-polka-purple to-polka-teal bg-clip-text text-transparent">
            ZK Proof Upload & Verification
          </h1>
          <p className="text-lg text-muted-foreground">
            Submit your zero-knowledge security proof for community review
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                  currentStep >= step.id 
                    ? "bg-polka-purple border-polka-purple text-white" 
                    : "border-muted text-muted-foreground"
                }`}>
                  {currentStep > step.id ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 ml-4 transition-all ${
                    currentStep > step.id ? "bg-polka-purple" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <span key={step.id} className={`text-center ${
                currentStep >= step.id ? "text-polka-purple" : "text-muted-foreground"
              }`}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-2xl">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-polka-purple mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">Connect Your Polkadot Wallet</h3>
                <p className="text-muted-foreground mb-8">
                  Connect your Polkadot.js wallet to submit zero-knowledge proofs
                </p>
                {!isWalletConnected ? (
                  <Button onClick={connectWallet} size="lg" className="glow-button bg-polka-purple hover:bg-polka-purple-dark">
                    Connect Polkadot.js
                  </Button>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-green-500">
                    <Check className="h-5 w-5" />
                    <span>Wallet Connected: 5D34...8f2a</span>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="proof-file" className="text-base font-medium">
                    ZK Proof Package (JSON + Verifier Contract)
                  </Label>
                  <div className="mt-2 border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <input
                      id="proof-file"
                      type="file"
                      accept=".json,.zip"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Label htmlFor="proof-file" className="cursor-pointer">
                      <span className="text-polka-purple hover:text-polka-purple-dark">
                        Click to upload
                      </span> or drag and drop
                    </Label>
                    <p className="text-sm text-muted-foreground mt-2">
                      JSON, ZIP files up to 10MB
                    </p>
                    {proofFile && (
                      <div className="mt-4 flex items-center justify-center space-x-2 text-green-500">
                        <Check className="h-4 w-4" />
                        <span>{proofFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contract">Contract Address</Label>
                    <Input
                      id="contract"
                      placeholder="5D34dL5prEUaGNQtPiwd9u9NiPL5xDjql..."
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="exploit-type">Exploit Type</Label>
                    <Input
                      id="exploit-type"
                      placeholder="e.g., Reentrancy, Integer Overflow"
                      value={exploitType}
                      onChange={(e) => setExploitType(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-polka-purple/10 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Proof Validation Results
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Contract:</span>
                      <p className="font-mono">{contractAddress || "5D34...8f2a"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Exploit Type:</span>
                      <p>{exploitType || "Reentrancy"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Timestamp:</span>
                      <p>{new Date().toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Proof Size:</span>
                      <p>{proofFile?.size ? `${(proofFile.size / 1024).toFixed(1)} KB` : "2.4 KB"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Review the information above before submitting to the registry
                  </p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-12">
                <div className="animate-glow">
                  <Check className="h-16 w-16 text-green-500 mx-auto mb-6" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Proof Successfully Registered!</h3>
                <p className="text-muted-foreground mb-8">
                  Your zero-knowledge proof has been submitted to the registry and is now available for DAO review.
                </p>
                <div className="bg-card rounded-lg p-4 mb-8">
                  <p className="text-sm text-muted-foreground">Proof ID:</p>
                  <p className="font-mono text-polka-purple">PG-2024-001-{Date.now().toString().slice(-6)}</p>
                </div>
                <Button 
                  onClick={() => window.location.href = "/council"} 
                  className="glow-button bg-polka-purple hover:bg-polka-purple-dark"
                >
                  View in PolkaGuard Council
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                <Button
                  onClick={currentStep === 2 ? validateProof : currentStep === 3 ? submitToRegistry : nextStep}
                  disabled={currentStep === 1 && !isWalletConnected}
                  className="glow-button bg-polka-purple hover:bg-polka-purple-dark flex items-center"
                >
                  {currentStep === 2 ? "Validate Proof" : currentStep === 3 ? "Submit to Registry" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProofUpload;
