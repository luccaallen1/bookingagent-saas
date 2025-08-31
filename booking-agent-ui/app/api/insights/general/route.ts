import { NextResponse } from 'next/server';

// Mock data - in production this would come from cross-platform analytics
const generalInsights = [
  {
    id: "general_001",
    title: "Pricing transparency in FAQs reduces drop-offs",
    metric: "30% reduction in price-related exits",
    category: "Website Optimization",
    impact: "High",
    effort: "Low",
    actionType: "settings",
    actionTarget: "/business-details?step=4&focus=pricing",
    dataSource: "2,847 healthcare locations analyzed",
    platformWide: true
  },
  {
    id: "general_002",
    title: "Condition-specific landing pages improve conversions",
    metric: "23% higher conversion vs generic pages",
    category: "Content Strategy", 
    impact: "Medium",
    effort: "High",
    actionType: "playbook",
    actionTarget: "/playbooks/landing-page-optimization",
    dataSource: "1,456 locations with specialized pages",
    platformWide: true
  },
  {
    id: "general_003",
    title: "Before/after content drives social engagement",
    metric: "3x more engagement than generic posts",
    category: "Social Media",
    impact: "Medium",
    effort: "Low",
    actionType: "campaign",
    actionTarget: "/outreach?template=before-after-social",
    dataSource: "4,123 social media posts analyzed",
    platformWide: true
  },
  {
    id: "general_004",
    title: "Appointment reminders with tips reduce no-shows",
    metric: "15% reduction in missed appointments",
    category: "Patient Retention",
    impact: "Medium",
    effort: "Medium",
    actionType: "playbook", 
    actionTarget: "/playbooks/appointment-reminder-optimization",
    dataSource: "890 locations with enhanced reminders",
    platformWide: true
  }
];

export async function GET() {
  try {
    // In production: query cross-platform analytics database
    // Aggregate insights from all franchises/platforms
    // Ensure complete anonymization of individual business data
    
    return NextResponse.json({
      success: true,
      data: generalInsights,
      meta: {
        totalInsights: generalInsights.length,
        platformScope: "all_franchises",
        generatedAt: new Date().toISOString(),
        privacyLevel: "fully_anonymized"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch general insights' },
      { status: 500 }
    );
  }
}