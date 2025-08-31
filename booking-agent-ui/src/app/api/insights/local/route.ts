import { NextResponse } from 'next/server';

// Mock data - in production this would come from the specific clinic's data
const localInsights = [
  {
    id: "local_001",
    title: "Your ankle pain inquiries surged 45% this month",
    metric: "67 mentions (+30 from last month)",
    category: "Content Opportunity",
    impact: "High",
    effort: "Medium",
    actionType: "campaign",
    actionTarget: "/outreach?template=ankle-pain-education",
    dataSource: "Your conversation analytics",
    urgent: true
  },
  {
    id: "local_002",
    title: "Weekend availability questions cause 28% of drop-offs",
    metric: "56 weekend inquiries, low conversion",
    category: "Scheduling Gap",
    impact: "High",
    effort: "High",
    actionType: "settings", 
    actionTarget: "/business-details?step=3&focus=weekend",
    dataSource: "Your booking analytics",
    urgent: true
  },
  {
    id: "local_003",
    title: "Price inquiries lead to 34% of conversation exits",
    metric: "71 price discussions, 24 conversions",
    category: "Conversion Blocker",
    impact: "High",
    effort: "Low",
    actionType: "settings",
    actionTarget: "/business-details?step=4&focus=pricing",
    dataSource: "Your conversation analytics",
    urgent: false
  },
  {
    id: "local_004", 
    title: "Monday 9-11 AM slot operates at 87% capacity",
    metric: "23 bookings vs 26 max capacity",
    category: "Capacity Optimization",
    impact: "Medium",
    effort: "Medium",
    actionType: "settings",
    actionTarget: "/business-details?step=3&focus=overflow",
    dataSource: "Your scheduling data",
    urgent: false
  }
];

export async function GET() {
  try {
    // In production: query clinic-specific data
    // const locationId = await getCurrentLocationId();
    // const insights = await generateLocalInsights(locationId);
    
    return NextResponse.json({
      success: true,
      data: localInsights,
      meta: {
        totalInsights: localInsights.length,
        locationId: "clinic_gadsden_001",
        generatedAt: new Date().toISOString(),
        dataRange: "last_30_days"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch local insights' },
      { status: 500 }
    );
  }
}