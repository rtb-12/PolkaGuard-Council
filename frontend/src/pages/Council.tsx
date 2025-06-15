
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Users, Vote, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Council = () => {
  const [userTokens] = useState(1250);
  const [voteWeight, setVoteWeight] = useState([100]);
  const { toast } = useToast();

  const proposals = [
    {
      id: "PG-2024-001-123456",
      title: "Reentrancy Vulnerability in DeFi Protocol",
      submitter: "5D34dL5prEUa...",
      exploitScore: 9.2,
      timeSubmitted: "2 hours ago",
      status: "voting",
      votesFor: 1420,
      votesAgainst: 380,
      description: "Critical reentrancy vulnerability discovered in popular DeFi lending protocol affecting user funds.",
      contractAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
    },
    {
      id: "PG-2024-001-789012",
      title: "Integer Overflow in Token Contract",
      submitter: "5FHneW46xGXgs...",
      exploitScore: 7.8,
      timeSubmitted: "6 hours ago",
      status: "voting",
      votesFor: 980,
      votesAgainst: 120,
      description: "Integer overflow vulnerability in token minting function could lead to inflation attacks.",
      contractAddress: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy"
    },
    {
      id: "PG-2024-001-345678",
      title: "Access Control Bypass",
      submitter: "5CiPPseXPECbkjWCa...",
      exploitScore: 8.5,
      timeSubmitted: "1 day ago",
      status: "approved",
      votesFor: 2100,
      votesAgainst: 450,
      description: "Administrative function access control bypass allowing unauthorized privileged operations.",
      contractAddress: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"
    }
  ];

  const executedProposals = [
    {
      id: "PG-2024-001-111111",
      title: "Flash Loan Attack Vector",
      outcome: "approved",
      payout: "500 PGT",
      executedAt: "2 days ago"
    },
    {
      id: "PG-2024-001-222222",
      title: "Timestamp Manipulation",
      outcome: "rejected",
      payout: "0 PGT",
      executedAt: "3 days ago"
    }
  ];

  const handleVote = (proposalId: string, support: boolean) => {
    console.log(`Voting ${support ? "FOR" : "AGAINST"} proposal ${proposalId} with weight ${voteWeight[0]}`);
    toast({
      title: `Vote Cast`,
      description: `You voted ${support ? "FOR" : "AGAINST"} with ${voteWeight[0]} PGT weight`,
    });
  };

  const createProposal = () => {
    console.log("Creating new proposal...");
    toast({
      title: "Proposal Created",
      description: "Your proposal has been submitted for community voting",
    });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-polka-purple to-polka-teal bg-clip-text text-transparent">
            PolkaGuard Council
          </h1>
          <p className="text-lg text-muted-foreground">
            DAO Governance for Security Bounty Approvals
          </p>
        </div>

        {/* User Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-polka-purple" />
              </div>
              <p className="text-2xl font-bold">{userTokens}</p>
              <p className="text-sm text-muted-foreground">PGT Balance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Vote className="h-6 w-6 text-polka-teal" />
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Votes Cast</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-polka-purple" />
              </div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Proposals Approved</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active">Active Proposals</TabsTrigger>
            <TabsTrigger value="executed">Executed Proposals</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Open Proof Proposals</h2>
              <Button onClick={createProposal} className="glow-button bg-polka-purple hover:bg-polka-purple-dark">
                Create Proposal
              </Button>
            </div>

            <div className="space-y-6">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="bg-card/50 border-border hover:border-polka-purple/50 transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{proposal.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>ID: {proposal.id}</span>
                          <span>Submitted {proposal.timeSubmitted}</span>
                          <span>by {proposal.submitter}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={proposal.status === "voting" ? "default" : "secondary"}
                        className={proposal.status === "voting" ? "bg-polka-purple" : ""}
                      >
                        {proposal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{proposal.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Exploit Score:</span>
                        <div className="flex items-center">
                          <span className="font-bold text-lg text-polka-purple">{proposal.exploitScore}</span>
                          <span className="text-muted-foreground">/10</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contract:</span>
                        <p className="font-mono text-xs">{proposal.contractAddress}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Voting Progress:</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-xs">{Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    {proposal.status === "voting" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full glow-button bg-polka-purple hover:bg-polka-purple-dark">
                            <Vote className="mr-2 h-4 w-4" />
                            Vote on Proposal
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle>Vote on Proposal</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">{proposal.title}</h4>
                              <p className="text-sm text-muted-foreground">{proposal.description}</p>
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Vote Weight: {voteWeight[0]} PGT</label>
                              <Slider
                                value={voteWeight}
                                onValueChange={setVoteWeight}
                                max={userTokens}
                                min={1}
                                step={1}
                                className="mt-2"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Available: {userTokens} PGT
                              </p>
                            </div>
                            
                            <div className="flex space-x-4">
                              <Button 
                                onClick={() => handleVote(proposal.id, true)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Vote FOR
                              </Button>
                              <Button 
                                onClick={() => handleVote(proposal.id, false)}
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Vote AGAINST
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {proposal.status === "approved" && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-green-500">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Proposal Approved</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          This proposal has been approved by the DAO and is ready for bounty payout.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="executed" className="space-y-6">
            <h2 className="text-2xl font-semibold">Execution History</h2>
            
            <div className="space-y-4">
              {executedProposals.map((proposal) => (
                <Card key={proposal.id} className="bg-card/50 border-border">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{proposal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {proposal.id} • Executed {proposal.executedAt}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={proposal.outcome === "approved" ? "default" : "destructive"}
                          className={proposal.outcome === "approved" ? "bg-green-600" : ""}
                        >
                          {proposal.outcome}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Payout: {proposal.payout}
                        </p>
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

export default Council;
