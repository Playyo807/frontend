"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCheckboxFramer({ isCheckedProp }: { isCheckedProp?: boolean }) {

  return (
    <div className="flex items-center space-x-3">
      <motion.div
        className={`h-6 w-6 border-2 rounded-full pointer-events-none flex items-center justify-center ${
          isCheckedProp ? 'bg-green-500 border-green-500' : 'border-gray-400'
        }`}
      >
        {isCheckedProp && (
          <motion.svg
            className="w-4 h-4 text-white"
            xmlns="www.w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <path d="M20 6L9 17L4 12" />
          </motion.svg>
        )}
      </motion.div>
    </div>
  );
};