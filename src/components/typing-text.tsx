// src/components/typing-text.tsx
"use client";

import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  words: string[];
  speed?: number; // milliseconds per character
  delay?: number; // milliseconds before starting next word/cycle
  className?: string; // Allows passing additional classes for styling
}

export function TypingText({ words, speed = 100, delay = 1500, className }: TypingTextProps) {
  const [currentText, setCurrentText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const fullWord = words[wordIndex];

      if (isDeleting) {
        setCurrentText(fullWord.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      } else {
        setCurrentText(fullWord.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }

      if (!isDeleting && charIndex === fullWord.length) {
        setTimeout(() => setIsDeleting(true), delay); // Pause at end of typing
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const typingInterval = setInterval(handleTyping, isDeleting ? speed / 2 : speed); // Faster deleting

    return () => clearInterval(typingInterval);
  }, [charIndex, isDeleting, wordIndex, words, speed, delay]);

  return (
    <span className={`inline-block min-w-[5ch] ${className}`}>
      <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-300 dark:to-purple-400 font-extrabold">
        {currentText}
      </span>
      <span className="animate-pulse inline-block w-1 h-full bg-blue-500 dark:bg-blue-300 ml-1"></span>
    </span>
  );
}
