"use client";

import React, { useEffect, useState } from 'react';
import { Locations, LocationsSchema, LocationRow } from '@/lib/types/hq';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/components/hq/Tag';
import { Button } from '@/components/ui/button';
import { 
  Search, Calendar, CheckCircle2, XCircle,
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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