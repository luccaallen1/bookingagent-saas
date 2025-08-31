import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  subtitle?: string;
  format?: 'number' | 'currency' | 'percentage';
}

export function KpiCard({ title, value, delta, subtitle, format = 'number' }: KpiCardProps) {
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return typeof val === 'number' ? `$${val.toLocaleString()}` : val;
    }
    if (format === 'percentage') {
      return typeof val === 'number' ? `${(val * 100).toFixed(1)}%` : val;
    }
    return typeof val === 'number' ? val.toLocaleString() : val;
  };

  const isPositive = delta && delta > 0;
  const deltaPercentage = delta ? Math.abs(delta * 100).toFixed(1) : 0;

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200 bg-white">
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{formatValue(value)}</p>
          {(delta !== undefined || subtitle) && (
            <div className="flex items-center gap-2 text-sm">
              {delta !== undefined && (
                <div className={clsx(
                  'flex items-center gap-1',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-medium">{deltaPercentage}%</span>
                </div>
              )}
              {subtitle && <span className="text-slate-500">{subtitle}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}