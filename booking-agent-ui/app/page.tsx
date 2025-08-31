"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Store, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-400" />
          </motion.div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Booking Agent Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered booking and customer engagement for franchise businesses.
            Choose your view to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/business">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900">
                      <Store className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                    </div>
                    <CardTitle>Business Dashboard</CardTitle>
                  </div>
                  <CardDescription>
                    For individual franchise locations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-sm">Manage bookings & appointments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-sm">Configure AI agent & integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-sm">Track leads & send campaigns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span className="text-sm">View location-specific insights</span>
                    </li>
                  </ul>
                  <Button className="w-full">
                    Enter Business Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/hq">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900">
                      <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>HQ Dashboard</CardTitle>
                  </div>
                  <CardDescription>
                    For franchise headquarters & owners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm">Monitor all franchise locations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm">Cross-location analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm">Coordinate franchise campaigns</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      <span className="text-sm">Enterprise billing & compliance</span>
                    </li>
                  </ul>
                  <Button className="w-full" variant="secondary">
                    Enter HQ Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Demo environment • No real bookings will be processed</p>
        </div>
      </div>
    </div>
  );
}