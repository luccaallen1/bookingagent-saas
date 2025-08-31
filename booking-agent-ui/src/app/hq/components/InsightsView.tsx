"use client";

import React, { useEffect, useState } from 'react';
import { Insights, InsightsSchema } from '@/lib/types/hq';
import { InsightCard } from '@/components/hq/InsightCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface InsightsViewProps {
  period: string;
}

export function InsightsView({ period }: InsightsViewProps) {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/data/insights_network.json');
      const json = await response.json();
      const validated = InsightsSchema.parse(json);
      setData(validated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsightAction = (title: string, actionLabel: string) => {
    toast({
      title: "Action Taken",
      description: `${actionLabel} for "${title}" has been queued.`,
    });
  };

  const allTags = ['All', ...Array.from(new Set(data?.cards.map(card => card.tag) || []))];
  const filteredCards = selectedTag === 'All' 
    ? data?.cards || []
    : data?.cards.filter(card => card.tag === selectedTag) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-8 w-20 rounded-md" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map(card => (
          <InsightCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            metric={card.metric}
            tag={card.tag}
            evidenceNote={card.evidence_note}
            actionLabel={card.cta.label}
            onAction={() => handleInsightAction(card.title, card.cta.label)}
          />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No insights found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}