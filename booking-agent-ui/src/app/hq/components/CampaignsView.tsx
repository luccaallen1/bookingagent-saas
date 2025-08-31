"use client";

import React, { useEffect, useState } from 'react';
import { CampaignsData, CampaignsDataSchema } from '@/lib/types/hq';
import { ChartCard } from '@/components/hq/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle } from 'lucide-react';

interface CampaignsViewProps {
  period: string;
}

export function CampaignsView({ period }: CampaignsViewProps) {
  const [data, setData] = useState<CampaignsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/campaigns.json');
      const json = await response.json();
      const validated = CampaignsDataSchema.parse(json);
      setData(validated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChartCard title="Top Campaigns Performance">
        <div className="space-y-4">
          {data?.top_campaigns.map((campaign, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{campaign.name}</h3>
                <p className="text-sm text-slate-600">Best: {campaign.best_location}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-500">Sends</p>
                  <p className="font-bold">{campaign.sends.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Open Rate</p>
                  <p className="font-bold text-blue-600">{(campaign.open * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Click Rate</p>
                  <p className="font-bold text-green-600">{(campaign.click * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Bookings</p>
                  <p className="font-bold text-indigo-600">{campaign.bookings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Performance by Content Type">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.by_content_type}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Campaign Timeline">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data?.timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            What Worked This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {data?.what_worked.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-0.5">{idx + 1}</Badge>
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}