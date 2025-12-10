"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export interface CaptchaRef {
  validate: () => boolean;
  reset: () => void;
}

const Captcha = forwardRef<CaptchaRef>((_, ref) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const generateProblem = () => {
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
    setAnswer("");
    setIsValid(null);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  useImperativeHandle(ref, () => ({
    validate: () => {
      const userAnswer = parseInt(answer);
      const correct = num1 + num2 === userAnswer;
      setIsValid(correct);
      if (!correct) {
        generateProblem();
      }
      return correct;
    },
    reset: generateProblem,
  }));

  return (
    <div className="space-y-2">
      <Label>Security Check</Label>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-ink-black-900 text-ink-black-100 font-mono text-lg select-none">
          <span>{num1}</span>
          <span>+</span>
          <span>{num2}</span>
          <span>=</span>
          <span>?</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateProblem}
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <Input
        type="number"
        placeholder="Enter the sum"
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          setIsValid(null);
        }}
        className={
          isValid === false
            ? "border-red-500 focus-visible:ring-red-500"
            : isValid === true
            ? "border-tropical-teal-500 focus-visible:ring-tropical-teal-500"
            : ""
        }
      />
      {isValid === false && (
        <p className="text-xs text-red-500">Incorrect, please try again.</p>
      )}
    </div>
  );
});

Captcha.displayName = "Captcha";

export { Captcha };
