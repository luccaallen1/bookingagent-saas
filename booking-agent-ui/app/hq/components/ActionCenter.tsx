"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Megaphone, 
  FileDown, 
  CheckCircle2,
  Clock,
  Users,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActionCenterProps {
  period: string;
}

interface RecentAction {
  id: string;
  type: 'playbook' | 'broadcast' | 'export';
  title: string;
  timestamp: Date;
  status: 'completed' | 'pending';
  targetCount?: number;
}

export function ActionCenter({ period }: ActionCenterProps) {
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { toast } = useToast();

  const mockLocations = [
    'Dallas, TX', 'Scottsdale, AZ', 'Nashville, TN', 'Boulder, CO', 
    'Austin, TX', 'Tampa, FL', 'Phoenix, AZ', 'Denver, CO'
  ];

  const handlePublishPlaybook = (title: string, message: string) => {
    const action: RecentAction = {
      id: Date.now().toString(),
      type: 'playbook',
      title: `Playbook: ${title}`,
      timestamp: new Date(),
      status: 'completed',
      targetCount: selectedLocations.length || mockLocations.length
    };
    
    setRecentActions(prev => [action, ...prev.slice(0, 9)]);
    toast({
      title: "Playbook Published",
      description: `Sent to ${action.targetCount} locations.`,
    });
  };

  const handleBroadcast = (title: string, message: string) => {
    const action: RecentAction = {
      id: Date.now().toString(),
      type: 'broadcast',
      title: `Broadcast: ${title}`,
      timestamp: new Date(),
      status: 'completed',
      targetCount: mockLocations.length
    };
    
    setRecentActions(prev => [action, ...prev.slice(0, 9)]);
    toast({
      title: "Broadcast Sent",
      description: `Message sent to all ${action.targetCount} locations.`,
    });
  };

  const handleExport = (type: string) => {
    const action: RecentAction = {
      id: Date.now().toString(),
      type: 'export',
      title: `Export: ${type} Scorecard`,
      timestamp: new Date(),
      status: 'completed'
    };
    
    setRecentActions(prev => [action, ...prev.slice(0, 9)]);
    toast({
      title: "Export Completed",
      description: `${type} scorecard has been generated.`,
    });

    // Simulate CSV download
    const csvContent = `Location,Bookings,Conversion,Revenue\n${mockLocations.map((loc, i) => 
      `${loc},${100 + i * 5},${(0.25 + i * 0.01).toFixed(3)},${5000 + i * 500}`
    ).join('\n')}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase()}_scorecard.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publish Playbooks */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Publish Playbooks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Playbook title (e.g., Back Pain Newsletter Template)" />
            <Textarea 
              placeholder="Select locations and preview message that will be sent to franchisees..."
              rows={4}
            />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select target locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {mockLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => handlePublishPlaybook("Back Pain Newsletter", "New template available")}
            >
              Send to Franchisees
            </Button>
          </CardContent>
        </Card>

        {/* Broadcasts */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Announcement title" />
            <Textarea 
              placeholder="Network-wide announcement message..."
              rows={4}
            />
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => handleBroadcast("Q4 Performance Update", "Great quarter results!")}
            >
              Send Network Broadcast
            </Button>
          </CardContent>
        </Card>

        {/* Scorecards */}
        <Card className="rounded-2xl shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Export Scorecards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleExport('Location Performance')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Location Performance
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('Campaign Results')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Campaign Results
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExport('Channel Analysis')}
                className="flex items-center gap-2"
              >
                <FileDown className="h-4 w-4" />
                Channel Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActions.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No recent actions</p>
          ) : (
            <div className="space-y-3">
              {recentActions.map((action) => {
                const Icon = action.type === 'playbook' ? Send : 
                           action.type === 'broadcast' ? Megaphone : FileDown;
                
                return (
                  <div key={action.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="font-medium text-slate-800">{action.title}</p>
                        <p className="text-xs text-slate-500">
                          {action.timestamp.toLocaleString()}
                          {action.targetCount && ` • ${action.targetCount} locations`}
                        </p>
                      </div>
                    </div>
                    <Badge variant={action.status === 'completed' ? 'default' : 'secondary'}>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {action.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}