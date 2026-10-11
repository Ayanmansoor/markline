"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Sparkles, Palette, Scissors, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepItem {
  icon?: any;
  text: string;
  emoji?: string;
}

const STEPS: StepItem[] = [
  { icon: Eye, text: "Inspecting order details..." },
  { icon: Sparkles, text: "Finding premium materials..." },
  { icon: Palette, text: "Picking handcrafted colors..." },
  { icon: Scissors, text: "Stitching & shaping footwear..." },
  { icon: ShieldCheck, text: "Connecting to secure payment..." },
];

interface AnimatedProcessButtonProps {
  isSubmitting: boolean;
  defaultText: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export default function AnimatedProcessButton({
  isSubmitting,
  defaultText,
  onClick,
  disabled,
  className,
}: AnimatedProcessButtonProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const step = STEPS[currentStepIndex];
  const CurrentIcon = step.icon;

  return (
    <Button
      disabled={isSubmitting || disabled}
      onClick={onClick}
      className={`relative overflow-hidden bg-black text-white px-5 sm:px-7 py-3 rounded-xl text-xs font-bold tracking-wider shadow-lg shadow-black/10 hover:bg-gray-800 transition-all active:scale-95 disabled:bg-black disabled:opacity-95 ${className}`}
    >
      {isSubmitting ? (
        <div className="relative h-6 w-full flex items-center justify-center overflow-hidden min-w-[215px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex items-center justify-center gap-2 text-white font-bold text-xs"
            >
              {step?.emoji ? (
                <span className="text-sm leading-none animate-pulse">{step.emoji}</span>
              ) : CurrentIcon ? (
                <CurrentIcon size={16} className="animate-pulse text-amber-300" />
              ) : null}
              <span>{step.text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <span>{defaultText}</span>
      )}
    </Button>
  );
}
