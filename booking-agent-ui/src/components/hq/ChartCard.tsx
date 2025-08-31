import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <Card className={`rounded-2xl shadow-sm border border-slate-200 bg-white ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}