'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LandingPage from './LandingPage';

export default function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showLanding, setShowLanding] = useState(true);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);
  const [checkingFirestore, setCheckingFirestore] = useState(true);

  useEffect(() => {
    async function checkUserCompletion() {
      if (!user) {
        setCheckingFirestore(false);
        return;
      }

      // First check localStorage for quick response
      const completedUsers = JSON.parse(localStorage.getItem('completed_users') || '[]');
      if (completedUsers.includes(user.uid)) {
        setHasCompletedSurvey(true);
        setShowLanding(false);
        setCheckingFirestore(false);
        return;
      }

      // Check Firestore to see if user has submitted before
      try {
        const q = query(
          collection(db, 'user_responses'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // User has submitted before - mark as completed
          const completedUsers = JSON.parse(localStorage.getItem('completed_users') || '[]');
          if (!completedUsers.includes(user.uid)) {
            completedUsers.push(user.uid);
            localStorage.setItem('completed_users', JSON.stringify(completedUsers));
          }
          setHasCompletedSurvey(true);
          setShowLanding(false);
        } else {
          // User hasn't submitted - show survey
          setHasCompletedSurvey(false);
          setShowLanding(true);
        }
      } catch (error) {
        console.error('Error checking Firestore:', error);
        // If Firestore check fails, show survey to be safe
        setShowLanding(true);
      }

      setCheckingFirestore(false);
    }

    checkUserCompletion();
  }, [user]);

  const handleComplete = () => {
    if (user) {
      // Add this user's ID to the list of completed users
      const completedUsers = JSON.parse(localStorage.getItem('completed_users') || '[]');
      if (!completedUsers.includes(user.uid)) {
        completedUsers.push(user.uid);
        localStorage.setItem('completed_users', JSON.stringify(completedUsers));
      }
    }
    setHasCompletedSurvey(true);
    setShowLanding(false);
  };

  // Show loading state while checking auth or Firestore
  if (loading || checkingFirestore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not completed survey
  if (showLanding && !hasCompletedSurvey) {
    return <LandingPage onComplete={handleComplete} />;
  }

  // Show main content
  return <>{children}</>;
}
