
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Vault as VaultIcon, Plus, ArrowDown, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Vault = () => {
  const [fundAmount, setFundAmount] = useState("");
  const [isAdmin] = useState(true); // Mock admin status
  const { toast } = useToast();

  const vaultBalance = 50000; // PGT tokens
  const totalAllocated = 15000;
  const availableBalance = vaultBalance - totalAllocated;

  const pendingPayouts = [
    {
      id: "PG-2024-001-123456",
      title: "Reentrancy Vulnerability",
      amount: "5000 PGT",
      recipient: "5D34dL5prEUa...",
      status: "approved",
      approvedAt: "2 hours ago"
    },
    {
      id: "PG-2024-001-345678",
      title: "Access Control Bypass",
      amount: "7500 PGT",
      recipient: "5CiPPseXPECbkjWCa...",
      status: "approved",
      approvedAt: "1 day ago"
    }
  ];

  const completedPayouts = [
    {
      id: "PG-2024-001-111111",
      title: "Flash Loan Attack Vector",
      amount: "3000 PGT",
      recipient: "5FLSigC9HGRKVhB9...",
      paidAt: "3 days ago",
      txHash: "0xabcd1234..."
    },
    {
      id: "PG-2024-001-222333",
      title: "Integer Overflow Fix",
      amount: "2500 PGT",
      recipient: "5DAAnrj7VHTznn2A...",
      paidAt: "1 week ago",
      txHash: "0xef567890..."
    }
  ];

  const fundVault = () => {
    if (!fundAmount || parseFloat(fundAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to fund",
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Funding vault with ${fundAmount} PGT`);
    toast({
      title: "Vault Funded",
      description: `Successfully added ${fundAmount} PGT to the bounty vault`,
    });
    setFundAmount("");
  };

  const claimBounty = (payoutId: string) => {
    console.log(`Claiming bounty for ${payoutId}`);
    toast({
      title: "Bounty Claimed",
      description: "Your bounty has been successfully transferred to your wallet",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-polka-purple to-polka-teal bg-clip-text text-transparent">
            PolkaGuard Vault
          </h1>
          <p className="text-lg text-muted-foreground">
            Secure bounty management and automated payouts
          </p>
        </div>

        {/* Vault Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <VaultIcon className="h-8 w-8 text-polka-purple" />
              </div>
              <p className="text-3xl font-bold text-polka-purple">{vaultBalance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Vault Balance</p>
              <p className="text-xs text-muted-foreground mt-1">PGT Tokens</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-yellow-500">{totalAllocated.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Allocated</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Payouts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-green-500">{availableBalance.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-xs text-muted-foreground mt-1">For New Bounties</p>
            </CardContent>
          </Card>
        </div>

        {/* Vault Capacity */}
        <Card className="bg-card/50 border-border mb-8">
          <CardHeader>
            <CardTitle>Vault Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={(totalAllocated / vaultBalance) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Allocated: {((totalAllocated / vaultBalance) * 100).toFixed(1)}%</span>
                <span>Available: {((availableBalance / vaultBalance) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="fund" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="fund">Fund Vault</TabsTrigger>
            <TabsTrigger value="pending">Pending Payouts</TabsTrigger>
            <TabsTrigger value="history">Payout History</TabsTrigger>
          </TabsList>

          <TabsContent value="fund" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Fund Bounty Vault
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isAdmin ? (
                  <>
                    <div>
                      <Label htmlFor="fund-amount">Amount (PGT)</Label>
                      <Input
                        id="fund-amount"
                        type="number"
                        placeholder="Enter amount to fund"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="bg-polka-purple/10 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Funding Information</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Funds will be locked in the smart contract vault</li>
                        <li>• Only approved DAO proposals can trigger payouts</li>
                        <li>• Automatic distribution upon proposal execution</li>
                        <li>• Minimum funding amount: 100 PGT</li>
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={fundVault} 
                      className="w-full glow-button bg-polka-purple hover:bg-polka-purple-dark"
                      disabled={!fundAmount}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Fund Vault
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <VaultIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Only administrators can fund the vault
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Pending Payouts</h2>
              <Badge variant="secondary">
                {pendingPayouts.length} pending
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingPayouts.map((payout) => (
                <Card key={payout.id} className="bg-card/50 border-border hover:border-polka-purple/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{payout.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {payout.id} • Approved {payout.approvedAt}
                        </p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-500">
                        {payout.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <p className="font-semibold text-polka-purple">{payout.amount}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Recipient:</span>
                        <p className="font-mono text-sm">{payout.recipient}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => claimBounty(payout.id)}
                          className="glow-button bg-polka-purple hover:bg-polka-purple-dark"
                        >
                          <ArrowDown className="mr-2 h-4 w-4" />
                          Claim Bounty
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Completed Payouts</h2>
              <Badge variant="secondary">
                {completedPayouts.length} completed
              </Badge>
            </div>

            <div className="space-y-4">
              {completedPayouts.map((payout) => (
                <Card key={payout.id} className="bg-card/50 border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{payout.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {payout.id} • Paid {payout.paidAt}
                        </p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500">
                        completed
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <p className="font-semibold text-green-500">{payout.amount}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Recipient:</span>
                        <p className="font-mono text-sm">{payout.recipient}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Transaction:</span>
                        <p className="font-mono text-sm text-polka-teal">{payout.txHash}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Vault;
