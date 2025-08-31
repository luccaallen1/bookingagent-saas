"use client";

import React, { useEffect, useState } from 'react';
import { Trends, TrendsSchema } from '@/lib/types/hq';
import { ChartCard } from '@/components/hq/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface TrendsViewProps {
  period: string;
}

export function TrendsView({ period }: TrendsViewProps) {
  const [data, setData] = useState<Trends | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/trends.json');
      const json = await response.json();
      const validated = TrendsSchema.parse(json);
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
        <Skeleton className="h-12 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const regions = ['All', 'West', 'South', 'Midwest', 'Northeast'];
  const chartData = selectedRegion !== 'All' && data?.series_by_region[selectedRegion] 
    ? data.series_by_region[selectedRegion] 
    : data?.series_by_region['West'] || [];

  return (
    <div className="space-y-6">
      {/* Region Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700">Region:</label>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Inquiry Topics */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Top Inquiry Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.topics.map((topic, idx) => {
                const isPositive = topic.delta > 0;
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-slate-800">{topic.label}</span>
                      <Badge variant="secondary">{topic.count.toLocaleString()}</Badge>
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {Math.abs(topic.delta * 100).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <ChartCard title={`Topic Trends - ${selectedRegion}`}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="back_pain" stroke="#4f46e5" name="Back Pain" />
              <Line type="monotone" dataKey="neck_pain" stroke="#10b981" name="Neck Pain" />
              <Line type="monotone" dataKey="pricing" stroke="#f59e0b" name="Pricing" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Regional Callouts */}
      {data?.callouts && data.callouts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.callouts.map((callout, idx) => (
            <Card key={idx} className="bg-blue-50 border-blue-200 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <Badge className="mb-2 bg-blue-100 text-blue-700 border-0">
                      {callout.region}
                    </Badge>
                    <p className="text-sm text-blue-800">{callout.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}