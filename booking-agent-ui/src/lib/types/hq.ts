import { z } from 'zod';

// Network Overview Types
export const KpiSchema = z.object({
  value: z.number(),
  delta: z.number(),
});

export const NetworkOverviewSchema = z.object({
  period: z.string(),
  kpis: z.object({
    conversations: KpiSchema,
    bookings: KpiSchema,
    conversion: KpiSchema,
    revenue: KpiSchema,
    active_locations: KpiSchema,
  }),
  series: z.object({
    by_day: z.array(z.object({
      date: z.string(),
      conversations: z.number(),
      bookings: z.number(),
    })),
  }),
  channels: z.array(z.object({
    label: z.string(),
    bookings: z.number(),
    tag: z.enum(['Inbound', 'Outreach']),
  })),
  leaderboards: z.object({
    by_bookings: z.array(z.object({
      location: z.string(),
      bookings: z.number(),
    })),
    by_conversion: z.array(z.object({
      location: z.string(),
      conversion: z.number(),
    })),
    growth_movers: z.array(z.object({
      location: z.string(),
      delta_bookings: z.number(),
    })),
  }),
  trending_tactic: z.object({
    title: z.string(),
    result: z.string(),
    cta: z.object({
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Locations Types
export const LocationRowSchema = z.object({
  location: z.string(),
  conversations: z.number(),
  bookings: z.number(),
  conversion: z.number(),
  revenue: z.number(),
  channels: z.array(z.string()),
  calendar_connected: z.boolean(),
  alerts: z.array(z.string()),
});

export const LocationsSchema = z.object({
  rows: z.array(LocationRowSchema),
});

// Campaigns Types
export const CampaignSchema = z.object({
  name: z.string(),
  sends: z.number(),
  open: z.number(),
  click: z.number(),
  bookings: z.number(),
  best_location: z.string(),
});

export const CampaignsDataSchema = z.object({
  top_campaigns: z.array(CampaignSchema),
  by_content_type: z.array(z.object({
    type: z.string(),
    avg_bookings: z.number(),
  })),
  timeline: z.array(z.object({
    date: z.string(),
    sends: z.number(),
    opens: z.number(),
    clicks: z.number(),
    bookings: z.number(),
  })),
  what_worked: z.array(z.string()),
});

// Trends Types
export const TrendsSchema = z.object({
  topics: z.array(z.object({
    label: z.string(),
    count: z.number(),
    delta: z.number(),
  })),
  series_by_region: z.record(z.array(z.object({
    date: z.string(),
    back_pain: z.number().optional(),
    neck_pain: z.number().optional(),
    pricing: z.number().optional(),
  }))),
  callouts: z.array(z.object({
    region: z.string(),
    text: z.string(),
  })),
});

// Channels Types
export const ChannelsSchema = z.object({
  bookings_by_source: z.array(z.object({
    label: z.string(),
    bookings: z.number(),
    tag: z.enum(['Inbound', 'Outreach']),
    percentage: z.number().optional(),
  })),
  funnels: z.array(z.object({
    channel: z.string(),
    conversations: z.number(),
    engaged: z.number(),
    bookings: z.number(),
  })),
  adoption_vs_results: z.array(z.object({
    channel: z.string(),
    adoption_pct: z.number(),
    avg_bookings: z.number(),
  })),
});

// Insights Types
export const InsightCardSchema = z.object({
  id: z.string(),
  icon: z.string(),
  title: z.string(),
  metric: z.string(),
  tag: z.string(),
  evidence_note: z.string(),
  cta: z.object({
    label: z.string(),
    link: z.string(),
  }),
});

export const InsightsSchema = z.object({
  cards: z.array(InsightCardSchema),
});

// Type exports
export type NetworkOverview = z.infer<typeof NetworkOverviewSchema>;
export type LocationRow = z.infer<typeof LocationRowSchema>;
export type Locations = z.infer<typeof LocationsSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type CampaignsData = z.infer<typeof CampaignsDataSchema>;
export type Trends = z.infer<typeof TrendsSchema>;
export type Channels = z.infer<typeof ChannelsSchema>;
export type InsightCard = z.infer<typeof InsightCardSchema>;
export type Insights = z.infer<typeof InsightsSchema>;