import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag } from './Tag';
import { ArrowRight } from 'lucide-react';

interface InsightCardProps {
  icon: string;
  title: string;
  metric: string;
  tag: string;
  evidenceNote: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function InsightCard({ 
  icon, 
  title, 
  metric, 
  tag, 
  evidenceNote, 
  onAction,
  actionLabel = 'Apply'
}: InsightCardProps) {
  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <span className="text-2xl">{icon}</span>
            <Tag variant="default" size="sm">{tag}</Tag>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800">{title}</h3>
            <p className="text-2xl font-bold text-indigo-600">{metric}</p>
            <p className="text-xs text-slate-500">{evidenceNote}</p>
          </div>
          
          {onAction && (
            <Button 
              onClick={onAction}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              size="sm"
            >
              {actionLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}