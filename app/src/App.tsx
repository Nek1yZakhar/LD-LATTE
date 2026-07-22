import React from 'react';
import { AppShell } from '@/components/shell/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { Part1Section } from '@/components/sections/Part1Section';
import { Part2Section } from '@/components/sections/Part2Section';
import { Part3Section } from '@/components/sections/Part3Section';

export function App() {
  return (
    <AppShell>
      {/* 0. Hero Section & Instant Evidence Overview */}
      <HeroSection />

      {/* 1. Part 1 — Interactive AI Pipeline & Discovery Studio */}
      <Part1Section />

      {/* 2. Part 2 — End-to-End Fashion Automation Blueprint */}
      <Part2Section />

      {/* 3. Part 3 — Author Resume, Case Studies & Evidence Navigator */}
      <Part3Section />
    </AppShell>
  );
}

export default App;
