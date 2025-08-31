import { useState } from 'react';

interface Toast {
  title: string;
  description?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description }: Toast) => {
    // For demo purposes, we'll just console.log the toast
    // In a real app, you'd show a toast notification UI
    console.log('Toast:', { title, description });
    
    // Show browser notification as fallback
    if (typeof window !== 'undefined') {
      // Simple alert for demo
      alert(`${title}${description ? ': ' + description : ''}`);
    }
  };

  return { toast };
}