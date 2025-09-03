"use client";

import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { NetworkOverview as NetworkOverviewType, NetworkOverviewSchema } from '@/lib/types/hq';
import { KpiCard } from '@/components/hq/KpiCard';
import { ChartCard } from '@/components/hq/ChartCard';
import { Tag } from '@/components/hq/Tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, Trophy, Rocket, HelpCircle, Activity, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface NetworkOverviewProps {
  period: string;
}

export function NetworkOverview({ period }: NetworkOverviewProps) {
  const [data, setData] = useState<NetworkOverviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tacticDismissed, setTacticDismissed] = useState(false);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/network_overview.json');
      const json = await response.json();
      const validated = NetworkOverviewSchema.parse(json);
      setData(validated);
    } catch (err) {
      setError('Failed to load network overview data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        {error || 'No data available'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trending Tactic Banner */}
      {!tacticDismissed && data.trending_tactic && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Trending Tactic</p>
                  <p className="text-sm text-slate-600">
                    {data.trending_tactic.title} • {data.trending_tactic.result}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  {data.trending_tactic.cta.label}
                </Button>
                <button
                  onClick={() => setTacticDismissed(true)}
                  className="p-1 hover:bg-white/50 rounded"
                >
                  <X className="h-4 w-4 text-slate-600" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total Conversations"
          value={data.kpis.conversations.value}
          delta={data.kpis.conversations.delta}
        />
        <KpiCard
          title="Total Bookings"
          value={data.kpis.bookings.value}
          delta={data.kpis.bookings.delta}
        />
        <KpiCard
          title="Conversion Rate"
          value={data.kpis.conversion.value}
          delta={data.kpis.conversion.delta}
          format="percentage"
        />
        <KpiCard
          title="Active Locations"
          value={data.kpis.active_locations.value}
          delta={data.kpis.active_locations.delta}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Line Chart */}
        <ChartCard title="Conversations & Bookings Over Time">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.series.by_day}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conversations" 
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={false}
                name="Conversations"
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Bookings by Channel">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.channels}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                        <p className="font-semibold">{data.label}</p>
                        <p className="text-sm">Bookings: {data.bookings}</p>
                        <Tag variant={data.tag === 'Inbound' ? 'inbound' : 'outreach'}>
                          {data.tag}
                        </Tag>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="bookings" 
                fill="#4f46e5"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Bookings */}
        <Card className="rounded-2xl shadow-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Top Locations by Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.leaderboards.by_bookings.map((location, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-6">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium">{location.location}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {location.bookings}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Conversion */}
        <Card className="rounded-2xl shadow-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Top Locations by Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.leaderboards.by_conversion.map((location, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-400 w-6">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium">{location.location}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {(location.conversion * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Common Topics and FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Topics */}
        <Card className="rounded-2xl shadow-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              Common Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Back Pain</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">1,247</span>
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Neck Pain</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">892</span>
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sciatica</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">634</span>
                  <span className="text-xs text-amber-600">+2%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sports Injuries</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">521</span>
                  <span className="text-xs text-orange-600">+45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Headaches</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">456</span>
                  <span className="text-xs text-red-600">-3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ankle Pain</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">412</span>
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Posture Issues</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">389</span>
                  <span className="text-xs text-orange-600">+32%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Shoulder Pain</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">343</span>
                  <span className="text-xs text-orange-600">+24%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frequently Asked Questions */}
        <Card className="rounded-2xl shadow-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-blue-500" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Do you take walk-ins?</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  124 asks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">What&apos;s the price for consultation?</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  98 asks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Do you accept insurance?</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  87 asks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">What are your weekend hours?</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  76 asks
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">How long is a typical session?</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  63 asks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}