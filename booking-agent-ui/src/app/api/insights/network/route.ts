import { NextResponse } from 'next/server';

// Mock data - in production this would come from database aggregations
const networkInsights = [
  {
    id: "network_001",
    title: "Chat links in Instagram bios drive immediate bookings",
    metric: "Clinics averaged 4 new patients in first week",
    category: "Social Media",
    impact: "High",
    effort: "Low",
    actionType: "playbook",
    actionTarget: "/playbooks/instagram-bio-setup",
    dataSource: "23 franchise locations over 30 days",
    franchiseId: null // Anonymous
  },
  {
    id: "network_002", 
    title: "Weekend availability messaging increases Saturday bookings",
    metric: "40% increase in weekend appointments",
    category: "Scheduling",
    impact: "High",
    effort: "Medium",
    actionType: "settings",
    actionTarget: "/business-details?step=3",
    dataSource: "47 locations tracked over 90 days",
    franchiseId: null
  },
  {
    id: "network_003",
    title: "Transparent pricing reduces inquiry drop-offs",
    metric: "35% fewer price-related abandons",
    category: "Conversion",
    impact: "High", 
    effort: "Low",
    actionType: "settings",
    actionTarget: "/business-details?step=4",
    dataSource: "156 locations with FAQ pricing updates",
    franchiseId: null
  },
  {
    id: "network_004",
    title: "Condition-specific email campaigns convert consistently",
    metric: "5.2 bookings per campaign send",
    category: "Email Marketing",
    impact: "Medium",
    effort: "Medium", 
    actionType: "campaign",
    actionTarget: "/outreach?template=condition-specific",
    dataSource: "89 franchise locations, 312 campaigns tracked",
    franchiseId: null
  }
];

export async function GET() {
  try {
    // In production: query database for anonymized franchise insights
    // WHERE franchise_id = current_user.franchise_id 
    // AND location_id != current_user.location_id
    // GROUP BY insight_type, anonymize individual metrics
    
    return NextResponse.json({
      success: true,
      data: networkInsights,
      meta: {
        totalInsights: networkInsights.length,
        franchiseId: "anonymized",
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch network insights' },
      { status: 500 }
    );
  }
}