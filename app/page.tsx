"use client";

import React from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import NewsletterCTA from "@/components/landing/NewsletterCTA";
import PricingSection from "@/components/landing/PricingSection";
import GetStartedSteps from "@/components/landing/GetStartedSteps";
import OurStorySection from "@/components/landing/OurStorySection";

export default function Home() {
  const p = [1, 2, 4];
  const a = p.reverse();

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <GetStartedSteps></GetStartedSteps>
      <Stats />
      <OurStorySection />
      <PricingSection />
      <Testimonials />
      <FAQ />
      <NewsletterCTA />
    </>
  );
}
