"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  User,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Building2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: any;
}

interface AIAgentChatProps {
  context: "business" | "hq";
  businessName?: string;
}

// Sample responses based on context
const sampleResponses = {
  business: {
    newsletter: {
      text: "Last week's newsletter campaign 'Summer Wellness Tips' performed well! Here are the metrics:",
      data: {
        sent: 542,
        opened: 223,
        openRate: "41.1%",
        clicked: 97,
        clickRate: "17.9%",
        bookings: 12,
        revenue: "$348"
      }
    },
    bookings: {
      text: "You have 23 bookings scheduled for this week. Here's the breakdown:",
      data: {
        monday: 4,
        tuesday: 5,
        wednesday: 6,
        thursday: 5,
        friday: 3,
        status: "Normal capacity (65%)"
      }
    },
    topFaq: {
      text: "The top 3 FAQs from customers this week are:",
      data: [
        "Do you take walk-ins? (89 times)",
        "What's the price for initial evaluation? (71 times)",
        "Are you open on weekends? (56 times)"
      ]
    },
    revenue: {
      text: "Your revenue this month is tracking 12% above last month:",
      data: {
        current: "$4,860",
        lastMonth: "$4,340",
        growth: "+12%",
        projection: "$5,200"
      }
    }
  },
  hq: {
    bestFranchise: {
      text: "Birmingham, AL is currently the best performing location:",
      data: {
        location: "Birmingham, AL",
        bookings: 201,
        conversion: "22.1%",
        revenue: "$5,210",
        monthOverMonth: "+18%"
      }
    },
    systemHealth: {
      text: "System health across all 47 locations:",
      data: {
        online: 42,
        warning: 3,
        offline: 2,
        issues: ["Calendar sync failures (5 locations)", "High abandonment rate (3 locations)"]
      }
    },
    campaign: {
      text: "The 'Summer Wellness Check' campaign across all locations:",
      data: {
        locations: "42/47 participating",
        sent: 24500,
        opened: 5635,
        openRate: "23%",
        clicked: 2940,
        clickRate: "12%",
        bookings: 342,
        revenue: "$9,936"
      }
    },
    trends: {
      text: "Top trending topics across all franchise conversations:",
      data: [
        "Lower back pain (312 mentions)",
        "Weekend availability (198 mentions)",
        "Insurance coverage (156 mentions)",
        "New patient specials (134 mentions)"
      ]
    }
  }
};

export default function AIAgentChat({ context, businessName = "Booking Agent" }: AIAgentChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: context === "business" 
        ? `Hello! I'm your AI assistant for ${businessName}. I can help you understand your metrics, analyze campaigns, check bookings, and answer questions about your business data. What would you like to know?`
        : "Hello! I'm your franchise HQ assistant. I can help you analyze performance across all locations, compare metrics, identify trends, and answer questions about your franchise network. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  useEffect(() => {
    // Small delay to ensure DOM is updated before scrolling
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const generateResponse = (query: string): { text: string; data?: any } => {
    const lowerQuery = query.toLowerCase();
    
    if (context === "business") {
      if (lowerQuery.includes("newsletter") || lowerQuery.includes("campaign") || lowerQuery.includes("email")) {
        return sampleResponses.business.newsletter;
      }
      if (lowerQuery.includes("booking") || lowerQuery.includes("appointment") || lowerQuery.includes("schedule")) {
        return sampleResponses.business.bookings;
      }
      if (lowerQuery.includes("faq") || lowerQuery.includes("question") || lowerQuery.includes("asked")) {
        return sampleResponses.business.topFaq;
      }
      if (lowerQuery.includes("revenue") || lowerQuery.includes("money") || lowerQuery.includes("earning")) {
        return sampleResponses.business.revenue;
      }
    } else {
      if (lowerQuery.includes("best") || lowerQuery.includes("top") || lowerQuery.includes("performing")) {
        return sampleResponses.hq.bestFranchise;
      }
      if (lowerQuery.includes("health") || lowerQuery.includes("status") || lowerQuery.includes("online")) {
        return sampleResponses.hq.systemHealth;
      }
      if (lowerQuery.includes("campaign") || lowerQuery.includes("marketing") || lowerQuery.includes("email")) {
        return sampleResponses.hq.campaign;
      }
      if (lowerQuery.includes("trend") || lowerQuery.includes("topic") || lowerQuery.includes("conversation")) {
        return sampleResponses.hq.trends;
      }
    }
    
    // Default response with suggestions
    return {
      text: context === "business"
        ? "I can help you with:\n• Campaign performance metrics\n• Booking schedules and availability\n• Customer FAQs and interactions\n• Revenue and conversion tracking\n\nTry asking: 'How did last week's newsletter perform?' or 'What are my bookings this week?'"
        : "I can help you with:\n• Location performance comparisons\n• System health monitoring\n• Franchise-wide campaign results\n• Trending topics and insights\n\nTry asking: 'Which franchise is performing best?' or 'What's the system health status?'"
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        data: response.data,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const renderMessageContent = (message: Message) => {
    if (message.role === "user") {
      return <p className="text-sm">{message.content}</p>;
    }

    return (
      <div className="space-y-3">
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.data && (
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            {typeof message.data === "object" && !Array.isArray(message.data) ? (
              Object.entries(message.data).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span className="font-medium">
                    {Array.isArray(value) ? (
                      <div className="space-y-1">
                        {value.map((item, i) => (
                          <div key={i} className="text-xs">{item}</div>
                        ))}
                      </div>
                    ) : (
                      String(value)
                    )}
                  </span>
                </div>
              ))
            ) : Array.isArray(message.data) ? (
              <ul className="space-y-1">
                {message.data.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-white"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-50 ${
              isMinimized 
                ? "bottom-6 right-6 w-80" 
                : "bottom-6 right-6 w-96 h-[650px] max-h-[90vh]"
            }`}
          >
            <div className="flex flex-col h-full bg-white dark:bg-slate-950 rounded-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      AI Assistant
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-xs opacity-90">
                      {context === "business" ? "Business Analytics" : "Franchise HQ"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-hidden relative bg-slate-50/30 dark:bg-slate-900/30">
                    <ScrollArea className="h-full">
                      <div className="p-4 space-y-4 min-h-full">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${
                              message.role === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                            }`}>
                              {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`flex-1 min-w-0 ${message.role === "user" ? "text-right" : ""}`}>
                              <div className={`inline-block rounded-lg px-4 py-2 max-w-[85%] break-words ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}>
                                {renderMessageContent(message)}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1 px-1">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                          >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-muted rounded-lg px-4 py-2">
                              <div className="flex gap-1">
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    {/* Scroll to bottom button */}
                    <AnimatePresence>
                      {showScrollButton && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute bottom-4 right-4"
                        >
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full shadow-lg"
                            onClick={scrollToBottom}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Suggested Questions */}
                  {messages.length === 1 && (
                    <div className="px-4 pb-2">
                      <div className="text-xs text-muted-foreground mb-2">Suggested questions:</div>
                      <div className="flex flex-wrap gap-2">
                        {context === "business" ? (
                          <>
                            <Badge 
                              variant="secondary" 
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => setInput("How did last week's newsletter perform?")}
                            >
                              Newsletter metrics
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => setInput("What are my bookings this week?")}
                            >
                              Weekly bookings
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => setInput("What are the top FAQs?")}
                            >
                              Top FAQs
                            </Badge>
                          </>
                        ) : (
                          <>
                            <Badge 
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => setInput("Which franchise is performing best?")}
                            >
                              Best location
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => setInput("What's the system health?")}
                            >
                              System status
                            </Badge>
                            <Badge 
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => setInput("Show trending topics")}
                            >
                              Trends
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1"
                      />
                      <Button onClick={handleSend} size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}