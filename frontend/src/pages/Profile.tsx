
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Wallet, Vote, Trophy, Bell, Shield, Settings } from "lucide-react";

const Profile = () => {
  const [notifications, setNotifications] = useState({
    newProposals: true,
    votingReminders: true,
    payoutAlerts: true,
    securityUpdates: false
  });

  const userStats = {
    walletAddress: "5D34dL5prEUaGNQtPiwd9u9NiPL5xDjql6eJqhtJqUzrgAXbRH",
    pgtBalance: 1250,
    votingWeight: 1.2,
    proposalsParticipated: 12,
    successfulVotes: 10,
    totalBountiesEarned: "15,500 PGT",
    memberSince: "March 2024"
  };

  const recentActivity = [
    {
      type: "vote",
      action: "Voted FOR",
      target: "Reentrancy Vulnerability Proposal",
      timestamp: "2 hours ago",
      weight: "100 PGT"
    },
    {
      type: "bounty",
      action: "Received Bounty",
      target: "Flash Loan Attack Vector",
      timestamp: "3 days ago",
      amount: "3,000 PGT"
    },
    {
      type: "proposal",
      action: "Created Proposal",
      target: "Integer Overflow in Token Contract",
      timestamp: "1 week ago",
      status: "Approved"
    },
    {
      type: "vote",
      action: "Voted AGAINST",
      target: "Timestamp Manipulation Report",
      timestamp: "2 weeks ago",
      weight: "150 PGT"
    }
  ];

  const achievements = [
    {
      title: "Early Adopter",
      description: "Among the first 100 members",
      icon: Trophy,
      earned: true,
      date: "March 2024"
    },
    {
      title: "Governance Participant",
      description: "Voted on 10+ proposals",
      icon: Vote,
      earned: true,
      date: "April 2024"
    },
    {
      title: "Security Expert",
      description: "Submitted 5+ approved vulnerability reports",
      icon: Shield,
      earned: false,
      progress: "3/5"
    },
    {
      title: "High Earner",
      description: "Earned 10,000+ PGT in bounties",
      icon: Wallet,
      earned: true,
      date: "May 2024"
    }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    console.log(`Updated ${key} to ${value}`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-polka-purple to-polka-teal bg-clip-text text-transparent">
            Profile & Settings
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your PolkaGuard account and preferences
          </p>
        </div>

        {/* Profile Header */}
        <Card className="bg-card/50 border-border mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-polka-purple to-polka-teal rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">PolkaGuard Member</h2>
                <p className="text-muted-foreground font-mono text-sm mb-4">
                  {userStats.walletAddress}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Badge className="bg-polka-purple/20 text-polka-purple">
                    Member since {userStats.memberSince}
                  </Badge>
                  <Badge className="bg-polka-teal/20 text-polka-teal">
                    {userStats.pgtBalance} PGT Balance
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 text-center">
                  <Wallet className="h-8 w-8 text-polka-purple mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.pgtBalance}</p>
                  <p className="text-sm text-muted-foreground">PGT Balance</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 text-center">
                  <Vote className="h-8 w-8 text-polka-teal mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.votingWeight}x</p>
                  <p className="text-sm text-muted-foreground">Voting Weight</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.proposalsParticipated}</p>
                  <p className="text-sm text-muted-foreground">Proposals Voted</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{Math.round((userStats.successfulVotes / userStats.proposalsParticipated) * 100)}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-3xl font-bold text-polka-purple mb-2">
                    {userStats.totalBountiesEarned}
                  </p>
                  <p className="text-muted-foreground">Total Bounties Earned</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    From {userStats.successfulVotes} successful vulnerability reports
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-muted/20 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === "vote" ? "bg-polka-purple/20 text-polka-purple" :
                        activity.type === "bounty" ? "bg-green-500/20 text-green-500" :
                        "bg-polka-teal/20 text-polka-teal"
                      }`}>
                        {activity.type === "vote" ? <Vote className="h-4 w-4" /> :
                         activity.type === "bounty" ? <Wallet className="h-4 w-4" /> :
                         <Shield className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.action} <span className="text-polka-purple">{activity.target}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                      </div>
                      <div className="text-right">
                        {activity.weight && (
                          <p className="text-sm font-medium">{activity.weight}</p>
                        )}
                        {activity.amount && (
                          <p className="text-sm font-medium text-green-500">{activity.amount}</p>
                        )}
                        {activity.status && (
                          <Badge className="bg-green-500/20 text-green-500">{activity.status}</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`bg-card/50 border-border ${achievement.earned ? 'border-polka-purple/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${
                        achievement.earned ? 'bg-polka-purple/20 text-polka-purple' : 'bg-muted text-muted-foreground'
                      }`}>
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.earned && (
                            <Badge className="bg-polka-purple/20 text-polka-purple">Earned</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        {achievement.earned ? (
                          <p className="text-xs text-green-500">Earned {achievement.date}</p>
                        ) : (
                          <p className="text-xs text-muted-foreground">Progress: {achievement.progress}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-proposals">New Proposals</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new vulnerability proposals are submitted
                    </p>
                  </div>
                  <Switch
                    id="new-proposals"
                    checked={notifications.newProposals}
                    onCheckedChange={(value) => handleNotificationChange('newProposals', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voting-reminders">Voting Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Remind me to vote on proposals before they close
                    </p>
                  </div>
                  <Switch
                    id="voting-reminders"
                    checked={notifications.votingReminders}
                    onCheckedChange={(value) => handleNotificationChange('votingReminders', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payout-alerts">Payout Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify me when bounty payouts are available to claim
                    </p>
                  </div>
                  <Switch
                    id="payout-alerts"
                    checked={notifications.payoutAlerts}
                    onCheckedChange={(value) => handleNotificationChange('payoutAlerts', value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="security-updates">Security Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about PolkaGuard security features
                    </p>
                  </div>
                  <Switch
                    id="security-updates"
                    checked={notifications.securityUpdates}
                    onCheckedChange={(value) => handleNotificationChange('securityUpdates', value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Wallet Connection</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connected wallet: {userStats.walletAddress}
                  </p>
                  <Button variant="outline" size="sm">
                    Disconnect Wallet
                  </Button>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Data Export</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download your PolkaGuard activity and voting history
                  </p>
                  <Button variant="outline" size="sm">
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
