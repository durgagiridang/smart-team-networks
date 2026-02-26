// src/app/vendor/showroom/components/VisitorList.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Clock } from 'lucide-react';

interface Visitor {
  id: string;
  name: string;
  avatar?: string;
  joinedAt?: Date | string;
  isActive?: boolean;
}

interface VisitorListProps {
  visitors?: Visitor[];
}

export default function VisitorList({ visitors = [] }: VisitorListProps) {
  return (
    <div className="h-full bg-gray-50 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <User className="w-4 h-4 mr-2" />
        Active Visitors ({visitors.length})
      </h3>
      
      {visitors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No visitors yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visitors.map((visitor, index) => (
            <motion.div
              key={visitor.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-sm"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {visitor.name?.charAt(0) || 'U'}
                </div>
                {visitor.isActive !== false && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{visitor.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Active now
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}