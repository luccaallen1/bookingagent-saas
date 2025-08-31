"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Users,
  Send,
  Settings,
  Search,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Phone,
  Globe,
  Filter,
  Download,
} from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// AI Agent
import AIAgentChat from "@/components/AIAgentChat";

// charts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ————————————————————————————————————————————
// Demo data for HQ view
// ————————————————————————————————————————————
const franchiseMetrics = {
  totalLocations: 47,
  activeLocations: 42,
  totalBookings: 3254,
  avgConversion: 18.7,
  totalRevenue: 98420,
  totalConversations: 12843,
};

const locationPerformance = [
  { name: "Gadsden, AL", bookings: 124, conv: 17.4, rev: 3210, health: 4, alerts: 1, status: "active" },
  { name: "Huntsville, AL", bookings: 98, conv: 14.1, rev: 2540, health: 3, alerts: 0, status: "active" },
  { name: "Dothan, AL", bookings: 156, conv: 19.8, rev: 4020, health: 5, alerts: 3, status: "active" },
  { name: "Birmingham, AL", bookings: 201, conv: 22.1, rev: 5210, health: 5, alerts: 0, status: "active" },
  { name: "Mobile, AL", bookings: 89, conv: 12.3, rev: 2310, health: 2, alerts: 5, status: "warning" },
  { name: "Montgomery, AL", bookings: 145, conv: 18.2, rev: 3760, health: 4, alerts: 1, status: "active" },
];

const revenueByMonth = [
  { month: "Jan", value: 78000 },
  { month: "Feb", value: 82000 },
  { month: "Mar", value: 85000 },
  { month: "Apr", value: 91000 },
  { month: "May", value: 96000 },
  { month: "Jun", value: 98420 },
];

const channelDistribution = [
  { channel: "Voice", value: 42 },
  { channel: "Web", value: 31 },
  { channel: "Instagram", value: 15 },
  { channel: "Facebook", value: 8 },
  { channel: "WhatsApp", value: 4 },
];

const topIssues = [
  { issue: "Calendar sync failures", locations: 5, severity: "high" },
  { issue: "High abandonment rate", locations: 3, severity: "medium" },
  { issue: "Slow response times", locations: 2, severity: "low" },
];

const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#a78bfa", "#eab308"];

// ————————————————————————————————————————————
// UI Helpers
// ————————————————————————————————————————————
function MetricCard({ title, value, sub, trend }: { title: string; value: string; sub?: string; trend?: number }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
          {trend && (
            <div className={`flex items-center text-xs ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? "rotate-180" : ""}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-muted"><Icon className="h-5 w-5" /></div>
        <div>
          <h2 className="text-lg font-semibold leading-tight">{title}</h2>
          {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
        </div>
      </div>
    </div>
  );
}

// ————————————————————————————————————————————
// Screens
// ————————————————————————————————————————————
function Dashboard() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={LayoutDashboard} title="Franchise Overview" desc="All locations performance at a glance" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <MetricCard title="Total Locations" value={String(franchiseMetrics.totalLocations)} />
        <MetricCard title="Active Locations" value={String(franchiseMetrics.activeLocations)} sub="89% active" />
        <MetricCard title="Total Bookings" value={String(franchiseMetrics.totalBookings)} trend={12} />
        <MetricCard title="Avg Conversion" value={`${franchiseMetrics.avgConversion}%`} trend={-2} />
        <MetricCard title="Total Revenue" value={`$${franchiseMetrics.totalRevenue.toLocaleString()}`} trend={8} />
        <MetricCard title="Conversations" value={String(franchiseMetrics.totalConversations)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={channelDistribution} dataKey="value" nameKey="channel" innerRadius={50} outerRadius={80} label>
                  {channelDistribution.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Locations() {
  const [filter, setFilter] = useState("");
  
  return (
    <div className="space-y-6">
      <SectionTitle icon={Building2} title="Location Management" desc="Monitor and manage all franchise locations" />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>All Locations</CardTitle>
            <div className="flex items-center gap-2">
              <Input 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                placeholder="Search locations..." 
                className="w-64" 
              />
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-2" /> Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Conv%</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Alerts</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationPerformance
                .filter(l => l.name.toLowerCase().includes(filter.toLowerCase()))
                .map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>
                    <Badge variant={l.status === "active" ? "default" : "secondary"}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{l.bookings}</TableCell>
                  <TableCell>{l.conv}%</TableCell>
                  <TableCell>${l.rev.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {"●".repeat(l.health)}
                      <span className="text-muted-foreground">{"○".repeat(5 - l.health)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {l.alerts > 0 && (
                      <Badge variant="destructive">{l.alerts}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>System Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topIssues.map((issue, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <AlertCircle className={`h-5 w-5 ${
                    issue.severity === "high" ? "text-red-500" : 
                    issue.severity === "medium" ? "text-yellow-500" : 
                    "text-blue-500"
                  }`} />
                  <div>
                    <div className="font-medium">{issue.issue}</div>
                    <div className="text-sm text-muted-foreground">Affecting {issue.locations} locations</div>
                  </div>
                </div>
                <Badge variant={issue.severity === "high" ? "destructive" : issue.severity === "medium" ? "secondary" : "outline"}>
                  {issue.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Analytics() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={BarChart3} title="Analytics & Insights" desc="Cross-location performance analytics" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Top Performing Locations</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationPerformance.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Conversion Rates by Location</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Bar dataKey="conv" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Average Response Time</Label>
              <div className="text-2xl font-semibold">1.2s</div>
              <div className="text-xs text-muted-foreground">↓ 0.3s from last month</div>
            </div>
            <div className="space-y-2">
              <Label>Tool Success Rate</Label>
              <div className="text-2xl font-semibold">94.3%</div>
              <div className="text-xs text-muted-foreground">↑ 2.1% from last month</div>
            </div>
            <div className="space-y-2">
              <Label>Human Handoff Rate</Label>
              <div className="text-2xl font-semibold">8.4%</div>
              <div className="text-xs text-muted-foreground">↓ 1.2% from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Campaigns() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Send} title="Campaign Management" desc="Coordinate marketing across all locations" />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Campaigns</CardTitle>
            <Button>Create Franchise Campaign</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Locations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Summer Wellness Check</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>42/47 locations</TableCell>
                <TableCell><Badge>Active</Badge></TableCell>
                <TableCell>23% open, 12% click</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">New Patient Special</TableCell>
                <TableCell>SMS</TableCell>
                <TableCell>38/47 locations</TableCell>
                <TableCell><Badge variant="secondary">Scheduled</Badge></TableCell>
                <TableCell>—</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Settings} title="Franchise Settings" desc="Global configuration and governance" />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Franchise Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label>Franchise Name</Label>
                <Input defaultValue="The Joint Chiropractic" />
              </div>
              <div>
                <Label>Corporate Email</Label>
                <Input defaultValue="hq@thejoint.com" />
              </div>
              <div>
                <Label>Default Timezone</Label>
                <Select defaultValue="America/Chicago">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Billing Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Current Plan</div>
                    <div className="text-sm text-muted-foreground">Enterprise - 50 locations</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold">$4,950/mo</div>
                    <div className="text-sm text-muted-foreground">Next billing: July 1</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">Active Locations</div>
                    <div className="text-xl font-semibold">42/50</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Voice Minutes Used</div>
                    <div className="text-xl font-semibold">8,234/15,000</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Conversations</div>
                    <div className="text-xl font-semibold">12,843/∞</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ————————————————————————————————————————————
// Navigation
// ————————————————————————————————————————————
const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "locations", label: "Locations", icon: Building2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "campaigns", label: "Campaigns", icon: Send },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function BookingAgentHQ() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b">
        <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="h-8 w-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400" />
            <div className="font-semibold tracking-tight">Booking Agent</div>
            <Badge variant="secondary" className="ml-1">HQ</Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9 w-72" />
            </div>
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              All Regions
            </Button>
            <Avatar className="h-8 w-8"><AvatarFallback>HQ</AvatarFallback></Avatar>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 xl:col-span-2">
          <nav className="grid gap-1">
            {nav.map((item) => {
              const Icon = item.icon as any;
              const activeCls = active === item.key ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-white/60 dark:bg-slate-900/60";
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm shadow-sm hover:shadow transition ${activeCls}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <Card className="rounded-2xl shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Locations Online</span>
                <Badge variant="outline">42/47</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Active Issues</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Today's Revenue</span>
                <span className="text-xs font-medium">$12,340</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full" size="sm">
                <Building2 className="h-4 w-4 mr-2" /> Add Location
              </Button>
              <Button variant="secondary" className="w-full" size="sm">
                <Send className="h-4 w-4 mr-2" /> Broadcast Message
              </Button>
              <Button variant="secondary" className="w-full" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export Reports
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 xl:col-span-10">
          {active === "dashboard" && <Dashboard />}
          {active === "locations" && <Locations />}
          {active === "analytics" && <Analytics />}
          {active === "campaigns" && <Campaigns />}
          {active === "settings" && <SettingsScreen />}
        </main>
      </div>

      {/* Footer */}
      <div className="border-t">
        <div className="mx-auto max-w-[1400px] px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} Booking Agent HQ — Enterprise Dashboard</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">Documentation</a>
            <a className="hover:underline" href="#">Support</a>
            <a className="hover:underline" href="#">API</a>
          </div>
        </div>
      </div>

      {/* AI Agent Chat */}
      <AIAgentChat context="hq" />
    </div>
  );
}