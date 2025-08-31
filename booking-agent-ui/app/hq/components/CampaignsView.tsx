"use client";

import React, { useEffect, useState } from 'react';
import { CampaignsData, CampaignsDataSchema } from '@/lib/types/hq';
import { ChartCard } from '@/components/hq/ChartCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, CheckCircle, Send, Clock, Mail, MessageSquare, 
  Target, Lightbulb, TrendingUp, Calendar, Users, 
  Eye, MousePointer, Star, AlertCircle, X, Copy,
  Filter, Search, MoreHorizontal, Edit, Trash2
} from 'lucide-react';

interface CampaignsViewProps {
  period: string;
}

export function CampaignsView({ period }: CampaignsViewProps) {
  const [data, setData] = useState<CampaignsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaignType, setCampaignType] = useState<'email' | 'sms'>('email');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'now' | 'scheduled'>('now');
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  
  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    content: '',
    audience: 'all_locations',
    scheduledDate: '',
    scheduledTime: '',
    locations: [] as string[],
  });

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

  // Mock data for insights and suggestions
  const topicInsights = [
    { topic: 'Back Pain', mentions: 1247, conversion: 0.32, trending: true },
    { topic: 'Neck Pain', mentions: 892, conversion: 0.28, trending: false },
    { topic: 'Sciatica', mentions: 634, conversion: 0.35, trending: false },
    { topic: 'Sports Injuries', mentions: 521, conversion: 0.41, trending: true },
    { topic: 'Headaches', mentions: 456, conversion: 0.24, trending: false },
    { topic: 'Posture Issues', mentions: 389, conversion: 0.38, trending: true },
  ];

  const faqInsights = [
    { question: 'Do you take walk-ins?', asks: 124, conversion: 0.45 },
    { question: 'What\'s the price for consultation?', asks: 98, conversion: 0.52 },
    { question: 'Do you accept insurance?', asks: 87, conversion: 0.38 },
    { question: 'What are your weekend hours?', asks: 76, conversion: 0.41 },
    { question: 'How long is a typical session?', asks: 63, conversion: 0.35 },
  ];

  const campaignTemplates = {
    email: [
      {
        name: 'Back Pain Relief Special',
        subject: 'Say Goodbye to Back Pain - 50% Off First Visit',
        preview: 'Are you tired of chronic back pain affecting your daily life? Our specialized chiropractic treatments have helped over 1,200 patients find lasting relief...',
        fullTemplate: `Subject: Say Goodbye to Back Pain - 50% Off First Visit

Hi [First Name],

Are you tired of chronic back pain affecting your daily life? You're not alone - back pain is the #1 reason our patients seek treatment, and we've helped over 1,200 people find lasting relief.

🎯 **Limited Time: 50% Off Your First Visit**

Our specialized approach combines:
✓ Advanced spinal adjustments
✓ Personalized treatment plans  
✓ Same-day appointments available
✓ Most insurance plans accepted

Don't let back pain control your life another day. Our patients typically see 85% improvement within just 3 sessions.

**Book your consultation today and take the first step towards a pain-free life.**

[BOOK NOW - 50% OFF]

Questions? Reply to this email or call us at [Phone].

Best regards,
Dr. [Doctor Name]
[Clinic Name]

P.S. This offer expires in 72 hours - don't miss out on finally getting the relief you deserve.`,
        conversionRate: 0.32,
        basedOnTopic: 'Back Pain'
      },
      {
        name: 'Sports Injury Recovery',
        subject: 'Get Back in the Game - Sports Injury Specialists',
        preview: 'Professional athletes and weekend warriors trust us for fast, effective injury recovery. Same-day appointments available...',
        fullTemplate: `Subject: Get Back in the Game - Sports Injury Specialists

Hi [First Name],

Sidelined by a sports injury? We understand how frustrating it can be when pain keeps you from doing what you love.

🏆 **Why Athletes Choose Us:**

✓ Sports-specific injury expertise
✓ 40% faster recovery times
✓ Same-day urgent appointments
✓ Weekend hours for busy schedules
✓ Direct billing to most insurances

**Common injuries we treat:**
• Ankle sprains & strains
• Shoulder impingement  
• Tennis/golf elbow
• Running injuries
• Post-workout soreness

Our sports medicine approach gets you back to peak performance, not just pain-free.

**Ready to get back in the game?**

[BOOK SPORTS ASSESSMENT]

Call/text: [Phone Number]
Weekend appointments available!

Game on,
Dr. [Doctor Name] & Team
[Clinic Name]

*"Got me back to marathons in 3 weeks!" - Sarah M., Local Runner*`,
        conversionRate: 0.41,
        basedOnTopic: 'Sports Injuries'
      },
      {
        name: 'Insurance Coverage Confirmation',
        subject: 'Great News! Your Insurance IS Accepted Here',
        preview: 'We accept most major insurance plans including Blue Cross, Aetna, and Cigna. Your consultation may be fully covered...',
        fullTemplate: `Subject: Great News! Your Insurance IS Accepted Here

Hi [First Name],

Great news! We accept most major insurance plans, and your consultation may be fully covered.

💳 **Insurance Plans We Accept:**
✓ Blue Cross Blue Shield
✓ Aetna & Aetna Better Health
✓ Cigna & Cigna HealthSpring
✓ UnitedHealthcare
✓ Medicare & Medicaid
✓ And 15+ other major carriers

**What's typically covered:**
• Initial consultation & examination
• X-rays (if needed)
• Treatment sessions
• Rehabilitation exercises

**No surprises - we'll verify your benefits before your first visit.**

Most patients pay little to nothing out-of-pocket for their initial consultation.

**Ready to use your benefits?**

[VERIFY MY INSURANCE & BOOK]

Questions about coverage? Call us at [Phone] - we're happy to check your specific plan.

To your health,
[Clinic Name] Team

P.S. Don't let insurance confusion delay your care. We handle all the paperwork!`,
        conversionRate: 0.52,
        basedOnTopic: 'Insurance Questions'
      },
      {
        name: 'Neck Pain & Headache Relief',
        subject: 'Free Neck Pain Assessment - Stop Headaches at the Source',
        preview: 'Chronic neck pain and headaches often go hand-in-hand. Our specialized treatment addresses the root cause...',
        fullTemplate: `Subject: Free Neck Pain Assessment - Stop Headaches at the Source

Hi [First Name],

Do you suffer from both neck pain AND frequent headaches? You're not alone - 70% of headaches actually start in the neck.

🎯 **FREE Comprehensive Neck Assessment This Week**

What we'll discover:
✓ Root cause of your neck pain
✓ Why your headaches keep returning  
✓ Posture issues affecting your pain
✓ Personalized treatment roadmap

**Our proven 3-step approach:**
1. Identify the source (not just symptoms)
2. Correct spinal alignment
3. Strengthen supporting muscles

**Real results from real patients:**
*"My daily headaches stopped after just 2 sessions!"* - Mike T.
*"Finally sleeping through the night again."* - Jennifer K.

**This week only: FREE consultation + assessment**
(Normally $150 - yours free)

[CLAIM MY FREE ASSESSMENT]

Available appointments:
• Today & tomorrow
• Evening slots available
• Weekend options

Don't spend another day in pain.

Relief is closer than you think,
Dr. [Doctor Name]
[Clinic Name]

Questions? Text us at [Phone] for fastest response.`,
        conversionRate: 0.35,
        basedOnTopic: 'Neck Pain'
      },
      {
        name: 'Sciatica Pain Solution',
        subject: 'Sciatica Keeping You Up at Night? We Can Help',
        preview: 'Shooting pain down your leg? Numbness and tingling? Our sciatica specialists have helped hundreds find relief...',
        fullTemplate: `Subject: Sciatica Keeping You Up at Night? We Can Help

Hi [First Name],

That shooting pain down your leg... the numbness... the tingling... we know exactly how debilitating sciatica can be.

The good news? Our sciatica specialists have helped over 600 patients find relief - often in just a few sessions.

🎯 **Sciatica Success Stories:**
• 89% of patients see improvement in first week
• Average treatment time: 4-6 sessions  
• Many avoid surgery completely
• Get back to activities you love

**What makes our approach different:**
✓ Advanced diagnostic imaging
✓ Non-invasive treatment options
✓ Customized exercise programs
✓ Pain management techniques
✓ Prevention strategies

**Red flags that need immediate attention:**
• Pain worsening at night
• Numbness in both legs
• Difficulty walking or standing
• Loss of bladder/bowel control

Don't let sciatica rob you of another good night's sleep.

**Priority scheduling for sciatica patients:**

[BOOK URGENT CONSULTATION]

We often have same-day openings for severe cases.

Call/text: [Phone Number]
*"I avoided surgery thanks to their treatment!" - Robert H.*

To your recovery,
Dr. [Doctor Name]
[Clinic Name] Sciatica Specialists`,
        conversionRate: 0.38,
        basedOnTopic: 'Sciatica'
      },
      {
        name: 'Posture Correction Program',
        subject: 'Your Forward Head Posture is Aging You 10+ Years',
        preview: 'Poor posture doesn\'t just cause pain - it makes you look older, less confident, and can lead to serious health issues...',
        fullTemplate: `Subject: Your Forward Head Posture is Aging You 10+ Years

Hi [First Name],

Look in the mirror right now. Is your head jutting forward? Shoulders rounded? 

This isn't just about looking older (though poor posture can age you 10+ years)...

**Poor posture is silently destroying your health:**
❌ Chronic neck and shoulder pain
❌ Frequent headaches  
❌ Reduced lung capacity
❌ Digestive issues
❌ Low energy levels
❌ Premature spinal degeneration

**The modern epidemic:** We're seeing posture-related issues in people as young as 20 due to phones, laptops, and desk jobs.

🎯 **Our Posture Correction Program:**

**Phase 1:** Assessment & Alignment (Week 1-2)
• Complete postural analysis
• Spinal adjustments to reset alignment
• Ergonomic recommendations

**Phase 2:** Strengthening & Stabilization (Week 3-8)  
• Targeted exercises for weak muscles
• Stretching for tight areas
• Core strengthening protocols

**Phase 3:** Maintenance & Prevention (Ongoing)
• Monthly check-ups
• Advanced exercise progressions
• Lifestyle modifications

**Amazing transformations in just 8 weeks:**
*"I stand 2 inches taller and my confidence is through the roof!"* - Lisa M.
*"No more afternoon headaches at work."* - David R.

**Limited spots available this month:**

[START MY TRANSFORMATION]

Investment: $297/month for 3 months
(Payment plans available)

Ready to stand tall and feel confident again?

To better posture & health,
Dr. [Doctor Name]
Posture Specialist`,
        conversionRate: 0.45,
        basedOnTopic: 'Posture Issues'
      }
    ],
    sms: [
      {
        name: 'Back Pain Same-Day',
        subject: 'Same Day Opening - Back Pain Relief',
        preview: 'Hi [Name], same-day opening at 3pm for back pain treatment. 85% of patients improve in first visit. Book now?',
        fullTemplate: `Hi [First Name]! 

Last-minute opening TODAY at 3pm for back pain treatment.

85% of our patients see improvement after their first visit ✨

Book now: [link]
Or reply STOP to opt out

- Dr. [Name] & Team`,
        conversionRate: 0.58,
        basedOnTopic: 'Back Pain'
      },
      {
        name: 'Sports Injury Urgent',
        subject: 'Injured? Same-day sports injury appointments',
        preview: 'Hi [Name], sports injury? We have urgent slots available. Get back in the game 40% faster. Book: [link]',
        fullTemplate: `[First Name], injured? 🏃‍♂️

Same-day sports injury slots available!

✅ Get back in the game 40% faster
✅ Weekend hours available
✅ Most insurance accepted

Book: [link]
Questions? Reply here

Team [Clinic Name]`,
        conversionRate: 0.51,
        basedOnTopic: 'Sports Injuries'
      },
      {
        name: 'Insurance Reminder',
        subject: 'Your insurance covers chiropractic - use it!',
        preview: 'Hi [Name], your insurance covers chiro visits. Most pay $0 out of pocket. Benefits expire Dec 31st. Book: [link]',
        fullTemplate: `[First Name] - Good news! 

Your insurance covers chiro visits 💳

✅ Most patients pay $0 out-of-pocket
✅ Benefits expire Dec 31st
✅ Use them before you lose them

Book now: [link]
Or text STOP to opt out`,
        conversionRate: 0.47,
        basedOnTopic: 'Insurance Questions'
      },
      {
        name: 'Weekend Hours Alert',
        subject: 'Weekend appointments - no waiting!',
        preview: 'Hi [Name], did you know we\'re open weekends? No waiting, same great care. Saturday 9am-2pm. Book: [link]',
        fullTemplate: `Hey [First Name]! 

Weekend appointments available! 📅

✅ Saturday 9am-2pm  
✅ No waiting lists
✅ Same expert care

Perfect for busy schedules.

Book: [link]
Reply STOP to opt out`,
        conversionRate: 0.31,
        basedOnTopic: 'Weekend Hours'
      },
      {
        name: 'Neck Pain/Headache',
        subject: 'Headaches starting in your neck?',
        preview: 'Hi [Name], 70% of headaches start in the neck. Free assessment this week only. Stop the pain at the source: [link]',
        fullTemplate: `[First Name], headaches again? 🤕

70% of headaches start in the neck.

FREE assessment this week only!
Stop the pain at the source.

Book: [link] 
Text STOP to opt out

Dr. [Name]`,
        conversionRate: 0.42,
        basedOnTopic: 'Neck Pain'
      },
      {
        name: 'Sciatica Relief',
        subject: 'Shooting leg pain? Sciatica help available',
        preview: 'Hi [Name], shooting pain down your leg? 89% of our sciatica patients improve in week 1. Same-day slots: [link]',
        fullTemplate: `[First Name] - Leg pain shooting? ⚡

89% of sciatica patients improve in week 1!

Same-day appointments available.
Don't suffer another night.

Book: [link]
Reply STOP to opt out

Relief is coming 💪`,
        conversionRate: 0.44,
        basedOnTopic: 'Sciatica'
      },
      {
        name: 'Posture Check',
        subject: 'Your phone is ruining your posture',
        preview: 'Hi [Name], text neck is real! Forward head posture ages you 10+ years. Fix it in 8 weeks: [link]',
        fullTemplate: `[First Name], "text neck" is real! 📱

Forward head posture ages you 10+ years.

Our 8-week program fixes it:
✅ Stand taller
✅ Look younger  
✅ Feel confident

Transform: [link]
Text STOP to opt out`,
        conversionRate: 0.33,
        basedOnTopic: 'Posture Issues'
      },
      {
        name: 'Walk-in Welcome',
        subject: 'Yes, we take walk-ins! No appointment needed',
        preview: 'Hi [Name], urgent pain? We accept walk-ins Mon-Fri 8am-6pm. No appointment needed. Just come in!',
        fullTemplate: `[First Name] - In pain NOW? 😣

We take walk-ins!
Mon-Fri: 8am-6pm
No appointment needed.

Just show up, we'll see you.

Address: [Address]
Questions? Call [Phone]

Walk-ins welcome! 🚪`,
        conversionRate: 0.49,
        basedOnTopic: 'Walk-ins'
      }
    ]
  };

  const generateSuggestedContent = (topic: string, type: 'email' | 'sms') => {
    const suggestions = {
      'Back Pain': {
        email: 'Are you tired of chronic back pain affecting your daily life? Our specialized chiropractic treatments have helped over 1,200 patients find relief. Book your consultation today and take the first step towards a pain-free life.',
        sms: 'Struggling with back pain? Our patients see 85% improvement in 3 sessions. Book now: [link]'
      },
      'Sports Injuries': {
        email: 'Get back in the game faster with our sports injury specialists. We understand athlete schedules and offer same-day appointments. Don\'t let an injury sideline your performance.',
        sms: 'Injured athlete? Same-day appointments available. We get you back in the game 40% faster. Book: [link]'
      },
      'Insurance Questions': {
        email: 'Good news! We accept most major insurance plans including Blue Cross, Aetna, and Cigna. Your initial consultation may be fully covered. Check your benefits and book today.',
        sms: 'Yes, we take your insurance! Most consultations are fully covered. Verify benefits: [link]'
      }
    };
    
    return suggestions[topic as keyof typeof suggestions]?.[type] || '';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (showCreateCampaign) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create Campaign</h2>
            <p className="text-slate-600">Use data insights to create targeted outreach</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateCampaign(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Campaign Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Campaign Type */}
                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <Tabs value={campaignType} onValueChange={(value) => setCampaignType(value as 'email' | 'sms')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="sms" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Campaign Name */}
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Enter campaign name"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm(prev => ({...prev, name: e.target.value}))}
                  />
                </div>

                {/* Subject Line (Email only) */}
                {campaignType === 'email' && (
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input
                      id="subject"
                      placeholder="Enter email subject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm(prev => ({...prev, subject: e.target.value}))}
                    />
                  </div>
                )}

                {/* Message Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    placeholder={`Enter your ${campaignType} message...`}
                    rows={campaignType === 'sms' ? 3 : 6}
                    value={campaignForm.content}
                    onChange={(e) => setCampaignForm(prev => ({...prev, content: e.target.value}))}
                    className="resize-none"
                  />
                  {campaignType === 'sms' && (
                    <p className="text-xs text-slate-500">{campaignForm.content.length}/160 characters</p>
                  )}
                </div>

                {/* Audience Selection */}
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={campaignForm.audience} onValueChange={(value) => setCampaignForm(prev => ({...prev, audience: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_locations">All Locations (247 locations)</SelectItem>
                      <SelectItem value="top_performers">Top Performers (12 locations)</SelectItem>
                      <SelectItem value="low_conversion">Low Conversion (31 locations)</SelectItem>
                      <SelectItem value="custom">Custom Selection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Scheduling */}
                <div className="space-y-4">
                  <Label>Send Timing</Label>
                  <Tabs value={scheduleType} onValueChange={(value) => setScheduleType(value as 'now' | 'scheduled')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="now" className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Now
                      </TabsTrigger>
                      <TabsTrigger value="scheduled" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Schedule
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {scheduleType === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={campaignForm.scheduledDate}
                          onChange={(e) => setCampaignForm(prev => ({...prev, scheduledDate: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={campaignForm.scheduledTime}
                          onChange={(e) => setCampaignForm(prev => ({...prev, scheduledTime: e.target.value}))}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1" disabled={!campaignForm.name || !campaignForm.content}>
                    {scheduleType === 'now' ? (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Campaign
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Schedule Campaign
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Sidebar */}
          <div className="space-y-6">
            {/* Smart Templates */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Smart Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaignTemplates[campaignType].map((template, idx) => (
                  <div key={idx} className="p-3 border border-slate-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {(template.conversionRate * 100).toFixed(0)}% CVR
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{template.preview}</p>
                    <p className="text-xs text-indigo-600 mb-3">Based on: {template.basedOnTopic}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7 flex-1"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplatePreview(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="text-xs h-7 flex-1"
                        onClick={() => {
                          setCampaignForm(prev => ({
                            ...prev,
                            name: template.name,
                            subject: campaignType === 'email' ? template.subject : '',
                            content: template.fullTemplate
                          }));
                        }}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Campaign Performance Insights */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                  Campaign Performance Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <h4 className="font-medium text-sm text-indigo-800 mb-1">✨ Best Performing</h4>
                  <p className="text-xs text-indigo-700">SMS campaigns with urgency (same-day appointments) have 58% conversion rates</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-sm text-green-800 mb-1">🎯 Trending Topics</h4>
                  <p className="text-xs text-green-700">Sports injuries are up 45% this month - perfect time to target athletes</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-sm text-blue-800 mb-1">💡 Pro Tip</h4>
                  <p className="text-xs text-blue-700">Insurance-focused emails have 52% higher conversion than general promotions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Campaign Management</h2>
          <p className="text-slate-600">Create data-driven outreach campaigns</p>
        </div>
        <Button 
          onClick={() => setShowCreateCampaign(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Campaigns</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Send className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Open Rate</p>
                <p className="text-2xl font-bold">34.2%</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Click Rate</p>
                <p className="text-2xl font-bold">12.8%</p>
              </div>
              <MousePointer className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Bookings Generated</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns Table */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Campaigns</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.top_campaigns.map((campaign, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${idx % 2 === 0 ? 'bg-indigo-100' : 'bg-green-100'}`}>
                    {idx % 2 === 0 ? <Mail className="h-4 w-4 text-indigo-600" /> : <MessageSquare className="h-4 w-4 text-green-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{campaign.name}</h3>
                    <p className="text-sm text-slate-600">Best performing: {campaign.best_location}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant={idx < 2 ? 'default' : 'secondary'}>
                        {idx < 2 ? 'Active' : 'Completed'}
                      </Badge>
                      <span className="text-xs text-slate-500">2 days ago</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6 text-center">
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

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Insights - Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* What to Send Next */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                What to Send Next
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-800 text-sm">High Priority</span>
                </div>
                <h4 className="font-medium text-sm">Back Pain SMS Campaign</h4>
                <p className="text-xs text-slate-600 mb-2">1,247 recent mentions • 58% conversion rate</p>
                <Button 
                  size="sm" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setCampaignType('sms');
                    setCampaignForm(prev => ({
                      ...prev,
                      name: 'Back Pain Same-Day Relief',
                      content: 'Hi [First Name]! \n\nLast-minute opening TODAY at 3pm for back pain treatment.\n\n85% of our patients see improvement after their first visit ✨\n\nBook now: [link]\nOr reply STOP to opt out\n\n- Dr. [Name] & Team'
                    }));
                    setShowCreateCampaign(true);
                  }}
                >
                  <Send className="h-3 w-3 mr-2" />
                  Create SMS Campaign
                </Button>
              </div>

              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-800 text-sm">Recommended</span>
                </div>
                <h4 className="font-medium text-sm">Insurance Email Follow-up</h4>
                <p className="text-xs text-slate-600 mb-2">124 FAQ asks • 52% conversion rate</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setCampaignType('email');
                    setCampaignForm(prev => ({
                      ...prev,
                      name: 'Insurance Coverage Confirmation',
                      subject: 'Great News! Your Insurance IS Accepted Here',
                      content: `Subject: Great News! Your Insurance IS Accepted Here

Hi [First Name],

Great news! We accept most major insurance plans, and your consultation may be fully covered.

💳 **Insurance Plans We Accept:**
✓ Blue Cross Blue Shield
✓ Aetna & Aetna Better Health
✓ Cigna & Cigna HealthSpring
✓ UnitedHealthcare
✓ Medicare & Medicaid
✓ And 15+ other major carriers

**Ready to use your benefits?**

[VERIFY MY INSURANCE & BOOK]

To your health,
[Clinic Name] Team`
                    }));
                    setShowCreateCampaign(true);
                  }}
                >
                  <Mail className="h-3 w-3 mr-2" />
                  Create Email Campaign
                </Button>
              </div>

              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-semibold text-orange-800 text-sm">Trending</span>
                </div>
                <h4 className="font-medium text-sm">Sports Injuries</h4>
                <p className="text-xs text-slate-600 mb-2">+45% mentions this month • 41% CVR</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setCampaignType('email');
                    setCampaignForm(prev => ({
                      ...prev,
                      name: 'Sports Injury Recovery Campaign',
                      subject: 'Get Back in the Game - Sports Injury Specialists',
                      content: `Subject: Get Back in the Game - Sports Injury Specialists

Hi [First Name],

Sidelined by a sports injury? We understand how frustrating it can be when pain keeps you from doing what you love.

🏆 **Why Athletes Choose Us:**
✓ Sports-specific injury expertise
✓ 40% faster recovery times
✓ Same-day urgent appointments
✓ Weekend hours for busy schedules

**Ready to get back in the game?**

[BOOK SPORTS ASSESSMENT]

Game on,
Dr. [Doctor Name] & Team`
                    }));
                    setShowCreateCampaign(true);
                  }}
                >
                  <TrendingUp className="h-3 w-3 mr-2" />
                  Create Campaign
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Converting Topics */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-green-500" />
                High-Converting Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topicInsights.slice(0, 5).map((topic, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{topic.topic}</span>
                    {topic.trending && <TrendingUp className="h-3 w-3 text-orange-500" />}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      {(topic.conversion * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-slate-500">{topic.mentions}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* FAQ Opportunities */}
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                FAQ Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {faqInsights.slice(0, 3).map((faq, idx) => (
                <div key={idx} className="p-2 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer">
                  <p className="text-sm font-medium">{faq.question}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">{faq.asks} asks</span>
                    <span className="text-xs text-green-600">{(faq.conversion * 100).toFixed(0)}% CVR</span>
                  </div>
                </div>
              ))}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => {
                  setCampaignType('email');
                  setCampaignForm(prev => ({
                    ...prev,
                    name: 'FAQ Response Campaign',
                    subject: 'Answering Your Most Asked Questions',
                    content: `Subject: Answering Your Most Asked Questions

Hi [First Name],

We get these questions a lot, so we thought we'd answer them for you:

❓ **Do you take walk-ins?**
Yes! We accept walk-ins Monday-Friday 8am-6pm. Just come in!

❓ **Do you accept insurance?**
Absolutely! We accept most major insurance plans and handle all paperwork.

❓ **What are your weekend hours?**
Saturday 9am-2pm for your convenience. No waiting lists!

Ready to book? We're here to help.

[BOOK APPOINTMENT]

[Clinic Name] Team`
                  }));
                  setShowCreateCampaign(true);
                }}
              >
                <MessageSquare className="h-3 w-3 mr-2" />
                Create FAQ Campaign
              </Button>
            </CardContent>
          </Card>

      </div>

      {/* Performance Charts */}
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

      {/* Template Preview Modal */}
      {showTemplatePreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                  <p className="text-sm text-slate-600">
                    {campaignType.toUpperCase()} Template • {(selectedTemplate.conversionRate * 100).toFixed(0)}% Conversion Rate
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTemplatePreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Based on Customer Data:</h4>
                  <p className="text-sm text-slate-600">{selectedTemplate.basedOnTopic}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Full Template:</h4>
                  <div className={`p-4 border border-slate-200 rounded-lg whitespace-pre-wrap text-sm ${
                    campaignType === 'sms' ? 'bg-green-50' : 'bg-blue-50'
                  }`}>
                    {selectedTemplate.fullTemplate}
                  </div>
                </div>
                
                {campaignType === 'sms' && (
                  <div className="text-xs text-slate-500">
                    Character count: {selectedTemplate.fullTemplate.length} characters
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200">
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setCampaignForm(prev => ({
                      ...prev,
                      name: selectedTemplate.name,
                      subject: campaignType === 'email' ? selectedTemplate.subject : '',
                      content: selectedTemplate.fullTemplate
                    }));
                    setShowTemplatePreview(false);
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Use This Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplatePreview(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}