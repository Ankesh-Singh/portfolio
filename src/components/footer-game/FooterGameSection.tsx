"use client";

import { RunnerGame } from './RunnerGame';

interface FooterGameSectionProps {
  className?: string;
}

export function FooterGameSection({ className = "" }: FooterGameSectionProps) {
  return (
    <footer className={`w-full mt-4 ${className}`}>
      <RunnerGame />
    </footer>
  );
}

export default FooterGameSection;
