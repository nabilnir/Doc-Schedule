"use client"
import React, { useState } from 'react'
import { Check, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSession } from 'next-auth/react'

// CHANGED: "export default function" instead of "export const"
export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const { data: session } = useSession()
  const userId = session?.user?.id

  const handleSubscribe = async (planType) => {
    try {
      if (!userId) return alert("Please login first!");
      
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId, 
          planType: planType 
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert(`Successfully subscribed to the ${planType} plan!`)
      }
    } catch (error) {
      console.error("Subscription error:", error)
    }
  }

  return (
    <section className="py-20 px-4 bg-slate-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-slate-900">
          Membership Pricing for Doctors
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Choose a plan to enjoy exclusive discounts on every booking.
        </p>

        <div className="flex items-center justify-center gap-4 mb-10">
          <Label htmlFor="duration" className={!isYearly ? "font-bold text-slate-900" : "text-muted-foreground"}>
            Monthly
          </Label>
          <Switch 
            id="duration" 
            checked={isYearly} 
            onCheckedChange={setIsYearly} 
          />
          <Label htmlFor="duration" className={isYearly ? "font-bold text-slate-900" : "text-muted-foreground"}>
            Yearly <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 hover:bg-green-100">Save 20%</Badge>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Monthly Plan Card */}
        <Card className={`transition-all duration-300 ${!isYearly ? "border-primary shadow-lg scale-105" : "opacity-70"}`}>
          <CardHeader>
            <CardTitle className="text-2xl">Monthly Plan</CardTitle>
            <CardDescription>Perfect for short-term clinical needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-slate-900">
              $50<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2 font-semibold text-blue-600">
                <Check className="h-5 w-5"/> 5% Discount on All Bookings
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500"/> Digital Prescription Tools
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500"/> 24/7 Priority Support
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleSubscribe('monthly')} 
              className="w-full text-md py-6" 
              variant={!isYearly ? "default" : "outline"}
            >
              Get Monthly Plan
            </Button>
          </CardFooter>
        </Card>

        {/* Yearly Plan Card */}
        <Card className={`transition-all duration-300 relative ${isYearly ? "border-primary shadow-lg scale-105 bg-white" : "opacity-70"}`}>
          {isYearly && (
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600 px-4 py-1">
              Best Value
            </Badge>
          )}
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              Yearly Plan <Zap className="h-5 w-5 fill-orange-400 text-orange-400"/>
            </CardTitle>
            <CardDescription>Maximum savings for busy practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-slate-900">
              $480<span className="text-lg font-normal text-muted-foreground">/yr</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2 font-bold text-blue-700">
                <Check className="h-5 w-5"/> 10% Discount on All Bookings
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <Check className="h-5 w-5 text-green-500"/> Advanced Analytics Dashboard
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500"/> All Premium Features Included
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleSubscribe('yearly')} 
              className="w-full text-md py-6" 
              variant={isYearly ? "default" : "outline"}
            >
              Get Yearly Plan
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}