'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface School {
  ncessch: string;
  name: string;
  leaid: string;
  districtName: string;
  schoolType: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  gradesLow: string | null;
  gradesHigh: string | null;
  // Add any other fields we need for comparison
}

interface ComparisonContextType {
  comparisonSchools: School[];
  addToComparison: (school: School) => void;
  removeFromComparison: (ncessch: string) => void;
  clearComparison: () => void;
  isInComparison: (ncessch: string) => boolean;
  maxSchools: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_SCHOOLS = 4;

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparisonSchools, setComparisonSchools] = useState<School[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('comparison_schools');
    if (saved) {
      try {
        setComparisonSchools(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse comparison schools from localStorage');
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('comparison_schools', JSON.stringify(comparisonSchools));
  }, [comparisonSchools]);

  const addToComparison = (school: School) => {
    setComparisonSchools((prev) => {
      // Don't add if already in comparison
      if (prev.find(s => s.ncessch === school.ncessch)) {
        return prev;
      }

      // If at max, don't add
      if (prev.length >= MAX_COMPARISON_SCHOOLS) {
        alert(`You can only compare up to ${MAX_COMPARISON_SCHOOLS} schools at once. Remove one first.`);
        return prev;
      }

      return [...prev, school];
    });
  };

  const removeFromComparison = (ncessch: string) => {
    setComparisonSchools((prev) => prev.filter(s => s.ncessch !== ncessch));
  };

  const clearComparison = () => {
    setComparisonSchools([]);
  };

  const isInComparison = (ncessch: string) => {
    return comparisonSchools.some(s => s.ncessch === ncessch);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonSchools,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        maxSchools: MAX_COMPARISON_SCHOOLS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
