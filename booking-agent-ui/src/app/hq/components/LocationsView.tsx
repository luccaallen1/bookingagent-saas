"use client";

import React, { useEffect, useState } from 'react';
import { Locations, LocationsSchema, LocationRow } from '@/lib/types/hq';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/components/hq/Tag';
import { Button } from '@/components/ui/button';
import { 
  Search, AlertCircle, Calendar, CheckCircle2, XCircle,
  TrendingUp, Mail, FileDown, Send
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

interface LocationsViewProps {
  period: string;
}

export function LocationsView({ period }: LocationsViewProps) {
  const [data, setData] = useState<Locations | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<LocationRow | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/locations.json');
      const json = await response.json();
      const validated = LocationsSchema.parse(json);
      setData(validated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = data?.rows.filter(location =>
    location.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getHeatmapColor = (conversion: number) => {
    if (conversion >= 0.35) return 'bg-green-500';
    if (conversion >= 0.30) return 'bg-green-400';
    if (conversion >= 0.25) return 'bg-yellow-400';
    if (conversion >= 0.20) return 'bg-orange-400';
    return 'bg-red-400';
  };

  // Generate mock sparkline data
  const generateSparklineData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i,
      value: Math.floor(Math.random() * 20) + 80
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Performance Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Location Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Conversations</TableHead>
                  <TableHead className="text-right">Bookings</TableHead>
                  <TableHead className="text-right">Conversion %</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Active Channels</TableHead>
                  <TableHead className="text-center">Calendar</TableHead>
                  <TableHead>Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLocations.map((location, idx) => (
                  <TableRow 
                    key={idx}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => {
                      setSelectedLocation(location);
                      setDrawerOpen(true);
                    }}
                  >
                    <TableCell className="font-medium">{location.location}</TableCell>
                    <TableCell className="text-right">{location.conversations}</TableCell>
                    <TableCell className="text-right">{location.bookings}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        location.conversion >= 0.30 ? 'text-green-600' : 
                        location.conversion >= 0.20 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {(location.conversion * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${location.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {location.channels.map((channel, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {location.calendar_connected ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell>
                      {location.alerts.length > 0 && (
                        <div className="flex gap-1">
                          {location.alerts.map((alert, i) => (
                            <Tag key={i} variant="warning" size="sm">
                              {alert}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Heatmap */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Conversion Rate Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {filteredLocations.map((location, idx) => (
              <div
                key={idx}
                className="relative group"
              >
                <div
                  className={`aspect-square rounded-lg ${getHeatmapColor(location.conversion)} opacity-80 hover:opacity-100 transition-opacity`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {(location.conversion * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {location.location}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>35%+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded" />
              <span>25-35%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded" />
              <span>&lt;25%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Details Drawer */}
      {drawerOpen && selectedLocation && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedLocation.location}</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* 90-day sparkline */}
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">90-Day Booking Trend</h3>
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={generateSparklineData()}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Best Channel */}
            <div>
              <h3 className="text-sm font-medium text-slate-600 mb-2">Best Performing Channel</h3>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="font-semibold text-indigo-700">Voice Agent</p>
                <p className="text-sm text-indigo-600">45% of total bookings</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Playbook
              </Button>
              <Button className="w-full" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email GM
              </Button>
              <Button className="w-full" variant="outline">
                <FileDown className="h-4 w-4 mr-2" />
                Export Scorecard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}