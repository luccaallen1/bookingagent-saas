"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Megaphone, 
  TrendingUp, 
  Radio, 
  Lightbulb, 
  Zap,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NetworkOverview } from './components/NetworkOverview';
import { LocationsView } from './components/LocationsView';
import { CampaignsView } from './components/CampaignsView';
import { ChannelsView } from './components/ChannelsView';
import { InsightsView } from './components/InsightsView';
import { ActionCenter } from './components/ActionCenter';
import { clsx } from 'clsx';

const navItems = [
  { id: 'overview', label: 'Network Overview', icon: LayoutDashboard },
  { id: 'locations', label: 'Locations', icon: MapPin },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'channels', label: 'Channels', icon: Radio },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'action-center', label: 'Action Center', icon: Zap },
];

export default function HQDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hq_selected_period');
    if (saved) setSelectedPeriod(saved);
  }, []);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    localStorage.setItem('hq_selected_period', value);
  };

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <NetworkOverview period={selectedPeriod} />;
      case 'locations':
        return <LocationsView period={selectedPeriod} />;
      case 'campaigns':
        return <CampaignsView period={selectedPeriod} />;
      case 'channels':
        return <ChannelsView period={selectedPeriod} />;
      case 'insights':
        return <InsightsView period={selectedPeriod} />;
      case 'action-center':
        return <ActionCenter period={selectedPeriod} />;
      default:
        return <NetworkOverview period={selectedPeriod} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">Franchise HQ</h1>
              <p className="text-sm text-slate-500">Network Performance Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="last_30_days">Last 30 days</SelectItem>
                <SelectItem value="last_90_days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={clsx(
          'bg-white border-r border-slate-200 transition-all duration-300',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    activeView === item.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50"
            >
              <ChevronDown 
                className={clsx(
                  'h-5 w-5 text-slate-400 transition-transform',
                  sidebarCollapsed ? '-rotate-90' : 'rotate-90'
                )}
              />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}