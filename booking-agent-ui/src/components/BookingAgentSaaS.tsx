"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Puzzle,
  BarChart3,
  Users,
  Send,
  Settings,
  Building2,
  Calendar,
  Search,
  Phone,
  MessageCircle,
  Instagram,
  Link as LinkIcon,
  Globe,
  Mail,
  ShieldCheck,
  ChevronRight,
  Download,
  Plus,
  Wand2,
  BadgeCheck,
} from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
// Demo data (replace with live API later)
// ————————————————————————————————————————————
const interactions = [
  { d: "Mon", v: 120 },
  { d: "Tue", v: 180 },
  { d: "Wed", v: 160 },
  { d: "Thu", v: 220 },
  { d: "Fri", v: 260 },
  { d: "Sat", v: 140 },
  { d: "Sun", v: 90 },
];

const bookingsByChannel = [
  { c: "Web", v: 62 },
  { c: "Voice", v: 41 },
  { c: "Instagram", v: 23 },
  { c: "Facebook", v: 17 },
  { c: "WhatsApp", v: 12 },
];

const topFaqs = [
  { q: "Do you take walk-ins?", n: 89 },
  { q: "Price for initial eval?", n: 71 },
  { q: "Weekend hours?", n: 56 },
  { q: "Do you accept insurance?", n: 43 },
];

const leadsSeed = [
  { name: "Jane Doe", email: "jane@example.com", phone: "+1 202-555-0123", score: 85, status: "Booked", last: "12:05" },
  { name: "John Smith", email: "john@example.com", phone: "+1 202-555-0144", score: 62, status: "Needs F/U", last: "11:44" },
  { name: "Maria Perez", email: "maria@example.com", phone: "+1 202-555-0198", score: 40, status: "New", last: "10:33" },
  { name: "Alex Kim", email: "alex@example.com", phone: "+1 202-555-0170", score: 77, status: "Warm", last: "09:51" },
];

const campaigns = [
  { name: "Labor Day", type: "Email", segment: "Warm Leads", status: "Draft" },
  { name: "New Service", type: "SMS", segment: "All Contacts", status: "Scheduled" },
];

const locations = [
  { name: "Gadsden, AL", bookings: 124, conv: 17.4, rev: 3210, health: 4, alerts: 1 },
  { name: "Huntsville, AL", bookings: 98, conv: 14.1, rev: 2540, health: 3, alerts: 0 },
  { name: "Dothan, AL", bookings: 156, conv: 19.8, rev: 4020, health: 5, alerts: 3 },
];

const COLORS = ["#0ea5e9", "#22c55e", "#f97316", "#a78bfa", "#eab308"]; // tailwind-ish palette

// Conversation-derived topics → power AI outreach suggestions
const conversationTopics = [
  { topic: "Ankle pain", mentions: 7, audience: "Warm Leads", insight: "7 customers asked about ankle pain this week." },
  { topic: "Lower back pain", mentions: 15, audience: "All Contacts", insight: "Lower back pain is the #1 symptom mentioned." },
  { topic: "Weekend hours", mentions: 12, audience: "All Contacts", insight: "High interest in Saturday availability." },
];

// Helpers to craft drafts from a topic
function craftEmailDraft(t: { topic: string; audience: string }) {
  const noun = t.topic.toLowerCase();
  const seg = t.audience === "Warm Leads" ? "warm" : "all";
  return {
    name: `${t.topic} – Education`,
    type: "email",
    segment: seg,
    subject: `${t.topic}? Here's how chiropractic care can help`,
    content:
      `Hi {{first_name}},\n\nWe noticed many people in our community asked about ${noun}. Here's a quick guide from our clinicians:\n\n• Common causes of ${noun}\n• When to see a chiropractor\n• What to expect during your visit\n• Simple at‑home care tips\n\nIf you're dealing with ${noun}, we'd love to help. Book a consult here: {{booking_link}}\n\n— {{business_name}}\n{{business_phone}}`,
  };
}

function craftBlogDraft(t: { topic: string }) {
  return {
    title: `${t.topic}: Causes, At‑Home Care & Chiropractic Treatment`,
    markdown:
`# ${t.topic}: Causes, At‑Home Care & Chiropractic Treatment\n\n**Estimated read time:** 4–5 minutes\n\n## What is ${t.topic.toLowerCase()}?\nBrief overview of anatomy and common triggers.\n\n## Common Causes\n- Overuse / sports strain\n- Poor mechanics or footwear\n- Previous injury or instability\n\n## When to See a Chiropractor\n- Pain persists beyond a few days\n- Swelling or reduced range of motion\n- Pain with weight bearing\n\n## How Chiropractic Care Can Help\n- Assessment: gait, alignment, mobility\n- Adjustments to restore joint function\n- Soft‑tissue therapy & rehab exercises\n\n## At‑Home Tips\n- RICE (rest/ice/compression/elevation) initially\n- Progressive loading & mobility drills\n- Supportive footwear, return‑to‑activity plan\n\n## Next Steps\nReady to feel better? [Book a visit]({{booking_link}}) or call {{business_phone}}.\n`,
  };
}

// ————————————————————————————————————————————
// UI Helpers
// ————————————————————————————————————————————
function KpiCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
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
  const conv = 877;
  const engaged = 542;
  const bookings = 165;
  const convRate = ((bookings / engaged) * 100).toFixed(1) + "%";
  const revenue = "$4,860";
  const voiceMin = "312";

  return (
    <div className="space-y-6">
      <SectionTitle icon={LayoutDashboard} title="Overview" desc="Key metrics across all channels" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <KpiCard title="Conversations" value={String(conv)} />
        <KpiCard title="Engaged" value={String(engaged)} />
        <KpiCard title="Bookings" value={String(bookings)} />
        <KpiCard title="Conversion" value={convRate} />
        <KpiCard title="Revenue" value={revenue} />
        <KpiCard title="Voice minutes" value={voiceMin} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Interactions (last 7 days)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interactions} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="d" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Bookings by channel</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByChannel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="c" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="v" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Top FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topFaqs.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="text-sm">{f.q}</div>
                <Badge variant="secondary">{f.n}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm xl:col-span-2">
          <CardHeader>
            <CardTitle>Tool success ratio</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: "Success", value: 86 }, { name: "Retry", value: 9 }, { name: "Fail", value: 5 }]} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {[0, 1, 2].map((idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
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

function Onboarding() {
  const [step, setStep] = useState(1);
  const Next = () => setStep((s) => Math.min(4, s + 1));
  const Back = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="space-y-6">
      <SectionTitle icon={BadgeCheck} title="Onboarding Wizard" desc="Configure your location in a few quick steps" />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={step >= 1 ? "font-semibold text-foreground" : ""}>1. Business</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step >= 2 ? "font-semibold text-foreground" : ""}>2. Hours</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step >= 3 ? "font-semibold text-foreground" : ""}>3. Services</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step >= 4 ? "font-semibold text-foreground" : ""}>4. FAQs & Link</span>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6">
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input placeholder="The Joint Chiropractic – Gadsden" />
              </div>
              <div>
                <Label>Business ID</Label>
                <Input placeholder="loc_104" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input placeholder="(256) 935-1911" />
              </div>
              <div>
                <Label>Email</Label>
                <Input placeholder="clinic22018@thejoint.com" />
              </div>
              <div>
                <Label>Timezone</Label>
                <Select defaultValue="America/Chicago">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Chicago">America/Chicago</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Input placeholder="510 E Meighan Blvd a10, Gadsden, AL 35903" />
              </div>
              <div className="md:col-span-2">
                <Label>Address Description</Label>
                <Input placeholder="River Trace Shopping center near Ross and Hobby Lobby" />
              </div>
              <div>
                <Label>Starting Price ($)</Label>
                <Input type="number" placeholder="29" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {"Mon Tue Wed Thu Fri Sat".split(" ").map((d) => (
                <div key={d} className="space-y-2">
                  <Label>{d}</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Open" defaultValue="10:00" />
                    <Input placeholder="Close" defaultValue={d === "Sat" ? "16:00" : "19:00"} />
                  </div>
                  <Input placeholder="Breaks (e.g., 14:00–14:45)" defaultValue={d === "Sat" ? "" : "14:00–14:45"} />
                </div>
              ))}
              <div className="space-y-2">
                <Label>Sun</Label>
                <div className="text-sm text-muted-foreground">Closed</div>
              </div>
              <Separator className="md:col-span-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-3">
                <div>
                  <Label>Default appointment duration (min)</Label>
                  <Input type="number" defaultValue={30} />
                </div>
                <div>
                  <Label>Slot boundaries</Label>
                  <div className="text-sm text-muted-foreground">HH:00 / HH:30 enforced</div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4">
              {[{ name: "Chiropractic Adjustment", id: "svc_adj", price: 29 }, { name: "Initial Evaluation", id: "svc_eval", price: 49 }].map((s) => (
                <Card key={s.id} className="rounded-xl">
                  <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4">
                    <div className="md:col-span-2">
                      <Label>Service Name</Label>
                      <Input defaultValue={s.name} />
                    </div>
                    <div>
                      <Label>Duration (min)</Label>
                      <Input type="number" defaultValue={30} />
                    </div>
                    <div>
                      <Label>Price ($)</Label>
                      <Input type="number" defaultValue={s.price} />
                    </div>
                    <div className="md:col-span-4">
                      <Label>Description</Label>
                      <Textarea placeholder="Add a short description..." />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="secondary" className="w-fit"><Plus className="h-4 w-4 mr-2" /> Add service</Button>
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-4">
              <div>
                <Label>Booking Link</Label>
                <div className="flex gap-2">
                  <Input readOnly value="https://book.mybrand.com/gadsden" />
                  <Button variant="secondary"><LinkIcon className="h-4 w-4 mr-2" />Copy</Button>
                  <Button><Globe className="h-4 w-4 mr-2" />Preview</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>FAQ Question</Label>
                  <Input defaultValue="Do you take walk-ins?" />
                </div>
                <div>
                  <Label>Answer</Label>
                  <Input defaultValue="Yes, subject to availability." />
                </div>
              </div>
              <Button variant="secondary" className="w-fit"><Plus className="h-4 w-4 mr-2" /> Add FAQ</Button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={Back} disabled={step === 1}>Back</Button>
            {step < 4 ? (
              <Button onClick={Next}>Continue</Button>
            ) : (
              <Button>Finish & Go to Dashboard</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Integrations() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Puzzle} title="Integrations" desc="Connect voice, web, and social channels" />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> Voice Bot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Provision a number or port an existing line. Configure greeting, fallbacks, and transfer rules.</div>
            <div className="flex items-center gap-3">
              <Button>Connect</Button>
              <Button variant="secondary">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Website Chat Widget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted rounded-xl p-3 text-xs font-mono overflow-auto">{"<script src=\"https://cdn.mybrand.com/agent.js\" data-business=\"loc_104\"></script>"}</div>
            <div className="flex items-center gap-3">
              <Button variant="secondary"><Download className="h-4 w-4 mr-2" />Copy Script</Button>
              <Button>Customize</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" /> Google Calendar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Status: <Badge variant="outline">Not connected</Badge></div>
            <Button>Connect Google Calendar</Button>
            <div className="text-xs text-muted-foreground">Scopes: freebusy.read, events</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Instagram className="h-5 w-5" /> Instagram DM</CardTitle>
          </CardHeader>
          <CardContent>
            <Button>Connect</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Facebook Messenger</CardTitle>
          </CardHeader>
          <CardContent>
            <Button>Connect</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5" /> Webhooks (n8n/Zapier)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Send and receive events with your automations layer.</div>
            <Button>Configure</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Insights() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={BarChart3} title="Insights" desc="Performance analytics & trends" />
      <Dashboard />
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Conversation log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input placeholder="Search conversations..." className="max-w-sm" />
            <Select defaultValue="all">
              <SelectTrigger className="w-40"><SelectValue placeholder="Channel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
                <SelectItem value="ig">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Snippet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="hover:bg-muted/40 cursor-pointer">
                  <TableCell>#{10230 + i}</TableCell>
                  <TableCell>{i % 2 ? "Web" : "Voice"}</TableCell>
                  <TableCell>
                    <Badge variant={i % 3 === 0 ? "secondary" : "default"}>{i % 3 === 0 ? "Lead" : "Booked"}</Badge>
                  </TableCell>
                  <TableCell>12:{10 + i}</TableCell>
                  <TableCell className="truncate max-w-[360px]">"I'd like to book tomorrow around 2:30 if possible…"</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Leads() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [lead, setLead] = useState<any>(null);

  const filtered = useMemo(() => {
    return leadsSeed.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.email.includes(q));
  }, [q]);

  return (
    <div className="space-y-6">
      <SectionTitle icon={Users} title="Leads" desc="Capture, score, and follow up" />

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>All leads</CardTitle>
            <div className="flex items-center gap-2">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" className="w-64" />
              <Select defaultValue="all">
                <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l, i) => (
                <TableRow key={i} className="hover:bg-muted/40 cursor-pointer" onClick={() => { setLead(l); setOpen(true); }}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{l.email}</span>
                      <span className="text-xs text-muted-foreground">{l.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{l.score}</TableCell>
                  <TableCell>{l.status}</TableCell>
                  <TableCell>{l.last}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Lead details</DialogTitle>
          </DialogHeader>
          {lead && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9"><AvatarFallback>{lead.name.split(" ").map((p: string) => p[0]).join("")}</AvatarFallback></Avatar>
                <div>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-muted-foreground">{lead.email} · {lead.phone}</div>
                </div>
                <Badge className="ml-auto">Score {lead.score}</Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="text-sm font-medium">Interactions</div>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>2025‑08‑26 12:05 – Booked 2:30 PM</li>
                  <li>2025‑08‑20 11:40 – Asked pricing</li>
                </ul>
              </div>
              <div className="grid gap-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add a note..." />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="secondary"><Mail className="h-4 w-4 mr-2" /> Email</Button>
                <Button><Send className="h-4 w-4 mr-2" /> SMS</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Outreach() {
  const [open, setOpen] = useState(false); // campaign dialog
  const [blogOpen, setBlogOpen] = useState(false); // blog dialog

  const [campaignDraft, setCampaignDraft] = useState({
    name: "Community Health – Topic",
    type: "email",
    segment: "warm",
    subject: "Health tip from our clinicians",
    content: "",
  });

  const [blogDraft, setBlogDraft] = useState<{ title: string; markdown: string }>({ title: "", markdown: "" });

  const startEmailFromTopic = (t: any) => {
    const d = craftEmailDraft(t);
    setCampaignDraft({
      name: d.name,
      type: d.type,
      segment: d.segment,
      subject: d.subject,
      content: d.content,
    });
    setOpen(true);
  };

  const startBlogFromTopic = (t: any) => {
    const d = craftBlogDraft(t);
    setBlogDraft(d);
    setBlogOpen(true);
  };

  return (
    <div className="space-y-6">
      <SectionTitle icon={Send} title="Outreach" desc="Email & SMS campaigns with AI assist and conversation insights" />

      {/* AI Suggestions from Conversations */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>AI Suggestions from Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Mentions</TableHead>
                <TableHead>Insight</TableHead>
                <TableHead>Recommended Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversationTopics.map((t, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{t.topic}</TableCell>
                  <TableCell><Badge variant="secondary">{t.mentions}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.insight}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => startEmailFromTopic(t)}>Draft Email</Button>
                      <Button size="sm" variant="secondary" onClick={() => startBlogFromTopic(t)}>Draft Blog</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaigns list */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" /> New Campaign</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Create Campaign</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={campaignDraft.name} onChange={(e) => setCampaignDraft({ ...campaignDraft, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={campaignDraft.type} onValueChange={(v) => setCampaignDraft({ ...campaignDraft, type: v })}>
                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Segment</Label>
                      <Select value={campaignDraft.segment} onValueChange={(v) => setCampaignDraft({ ...campaignDraft, segment: v })}>
                        <SelectTrigger><SelectValue placeholder="Segment" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warm">Warm Leads</SelectItem>
                          <SelectItem value="all">All Contacts</SelectItem>
                          <SelectItem value="booked">Booked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Send Time</Label>
                      <Select defaultValue="schedule">
                        <SelectTrigger><SelectValue placeholder="Send time" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="now">Send now</SelectItem>
                          <SelectItem value="schedule">Schedule…</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input value={campaignDraft.subject} onChange={(e) => setCampaignDraft({ ...campaignDraft, subject: e.target.value })} />
                  </div>
                  <div>
                    <Label>Content (AI Assist)</Label>
                    <div className="flex gap-2 mb-2">
                      <Button variant="secondary" onClick={() => setCampaignDraft({ ...campaignDraft, content: campaignDraft.content || "Quick reminder to {{audience}} with {{booking_link}}" })}><Wand2 className="h-4 w-4 mr-2" /> Generate Copy</Button>
                      <Button variant="secondary" onClick={() => setCampaignDraft({ ...campaignDraft, content: (campaignDraft.content || "") + "\n\nBook now: {{booking_link}}" })}><LinkIcon className="h-4 w-4 mr-2" /> Insert Booking Link</Button>
                    </div>
                    <Textarea rows={8} value={campaignDraft.content} onChange={(e) => setCampaignDraft({ ...campaignDraft, content: e.target.value })} placeholder="Write your message…" />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary">Send Test</Button>
                    <Button>Schedule</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.segment}</TableCell>
                  <TableCell><Badge variant={c.status === "Scheduled" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign results */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Recent Campaign Results</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard title="Opens" value="41%" />
          <KpiCard title="Clicks" value="18%" />
          <KpiCard title="Bookings" value="54" />
        </CardContent>
      </Card>

      {/* Blog draft dialog */}
      <Dialog open={blogOpen} onOpenChange={setBlogOpen}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Blog Draft</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Label>Title</Label>
            <Input value={blogDraft.title} onChange={(e) => setBlogDraft({ ...blogDraft, title: e.target.value })} />
            <Label>Markdown</Label>
            <Textarea rows={12} value={blogDraft.markdown} onChange={(e) => setBlogDraft({ ...blogDraft, markdown: e.target.value })} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Settings} title="Settings" desc="Team, branding, billing, and API" />
      <Tabs defaultValue="team" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="team">Team & Roles</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>
        <TabsContent value="team" className="mt-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Team</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar><AvatarFallback>LA</AvatarFallback></Avatar>
                  <div>
                    <div className="font-medium">Lucca Allen</div>
                    <div className="text-sm text-muted-foreground">Owner</div>
                  </div>
                </div>
                <Badge>Owner</Badge>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Input placeholder="teammate@example.com" />
                <Select defaultValue="manager">
                  <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Invite</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="branding" className="mt-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label>Logo</Label>
                <Input type="file" />
              </div>
              <div>
                <Label>Primary color</Label>
                <Input type="color" defaultValue="#0ea5e9" />
              </div>
              <div>
                <Label>Accent color</Label>
                <Input type="color" defaultValue="#22c55e" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>Billing</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Plan</Label>
                <Select defaultValue="pro">
                  <SelectTrigger><SelectValue placeholder="Plan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Locations</Label>
                <Input type="number" defaultValue={3} />
              </div>
              <div className="flex items-end">
                <Button>Update</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader><CardTitle>API Keys & Webhooks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Input readOnly value="sk_live_****************" />
                <Button variant="secondary">Generate New</Button>
              </div>
              <div>
                <Label>Webhook URL</Label>
                <Input placeholder="https://hooks.mybrand.com/ingest" />
              </div>
              <div className="flex items-center gap-2"><Switch id="redact" /><Label htmlFor="redact">Enable transcript PII redaction</Label></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HqLocations() {
  return (
    <div className="space-y-6">
      <SectionTitle icon={Building2} title="Franchise HQ" desc="Multi-location roll-up insights" />
      <Card className="rounded-2xl shadow-sm">
        <CardHeader><CardTitle>Locations</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Conv%</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Alerts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell>{l.bookings}</TableCell>
                  <TableCell>{l.conv}%</TableCell>
                  <TableCell>${l.rev.toLocaleString()}</TableCell>
                  <TableCell>{"●".repeat(l.health)}{"○".repeat(5 - l.health)}</TableCell>
                  <TableCell>{l.alerts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ————————————————————————————————————————————
// App Shell
// ————————————————————————————————————————————
const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "onboarding", label: "Onboarding", icon: BadgeCheck },
  { key: "integrations", label: "Integrations", icon: Puzzle },
  { key: "insights", label: "Insights", icon: BarChart3 },
  { key: "leads", label: "Leads", icon: Users },
  { key: "outreach", label: "Outreach", icon: Send },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "hq", label: "HQ", icon: Building2 },
];

export default function BookingAgentSaaS() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 border-b">
        <div className="mx-auto max-w-[1400px] px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="h-8 w-8 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400" />
            <div className="font-semibold tracking-tight">Booking Agent</div>
            <Badge variant="secondary" className="ml-1">SaaS</Badge>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search…" className="pl-9 w-72" />
            </div>
            <Avatar className="h-8 w-8"><AvatarFallback>LA</AvatarFallback></Avatar>
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
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full"><Calendar className="h-4 w-4 mr-2" /> Connect Calendar</Button>
              <Button variant="secondary" className="w-full"><Globe className="h-4 w-4 mr-2" /> Get Chat Script</Button>
              <Button variant="secondary" className="w-full"><Phone className="h-4 w-4 mr-2" /> Configure Voice</Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Compliance</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> HIPAA-ready (health vertical)</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> GDPR tools & data export</div>
            </CardContent>
          </Card>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 xl:col-span-10">
          {active === "dashboard" && <Dashboard />}
          {active === "onboarding" && <Onboarding />}
          {active === "integrations" && <Integrations />}
          {active === "insights" && <Insights />}
          {active === "leads" && <Leads />}
          {active === "outreach" && <Outreach />}
          {active === "settings" && <SettingsScreen />}
          {active === "hq" && <HqLocations />}
        </main>
      </div>

      {/* Footer */}
      <div className="border-t">
        <div className="mx-auto max-w-[1400px] px-4 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <div>© {new Date().getFullYear()} Booking Agent — All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">Status</a>
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
}