"use client";

import React, { useEffect, useState } from 'react';
import { Channels, ChannelsSchema } from '@/lib/types/hq';
import { ChartCard } from '@/components/hq/ChartCard';
import { Tag } from '@/components/hq/Tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface ChannelsViewProps {
  period: string;
}

export function ChannelsView({ period }: ChannelsViewProps) {
  const [data, setData] = useState<Channels | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/channels.json');
      const json = await response.json();
      const validated = ChannelsSchema.parse(json);
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
      {/* Bookings by Source */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Bookings by Source</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data?.bookings_by_source.map((source, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-800">{source.label}</span>
                  <Tag variant={source.tag === 'Inbound' ? 'inbound' : 'outreach'}>
                    {source.tag}
                  </Tag>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">{source.bookings}</div>
                  {source.percentage && (
                    <div className="text-sm text-slate-500">{source.percentage}%</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Performance */}
        <ChartCard title="Channel Funnel Performance">
          <div className="space-y-4">
            {data?.funnels.slice(0, 4).map((funnel, idx) => {
              const conversionRate = (funnel.bookings / funnel.conversations * 100).toFixed(1);
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{funnel.channel}</span>
                    <span className="text-sm font-semibold text-indigo-600">{conversionRate}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(funnel.bookings / funnel.conversations) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-500 w-16 text-right">{funnel.bookings}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* Adoption vs Results */}
        <ChartCard title="Adoption vs Average Results">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="adoption_pct" 
                type="number" 
                domain={[0, 1]}
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                label={{ value: 'Adoption Rate', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                dataKey="avg_bookings"
                type="number"
                label={{ value: 'Avg Bookings', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
                        <p className="font-semibold">{data.channel}</p>
                        <p className="text-sm">Adoption: {(data.adoption_pct * 100).toFixed(1)}%</p>
                        <p className="text-sm">Avg Bookings: {data.avg_bookings}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={data?.adoption_vs_results} fill="#4f46e5" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}