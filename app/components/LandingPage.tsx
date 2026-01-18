'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FormData {
  district: string;
  schoolLevel: string;
  zipCode: string;
  additionalNotes: string;
}

export default function LandingPage({ onComplete }: { onComplete: () => void }) {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    district: '',
    schoolLevel: '',
    zipCode: '',
    additionalNotes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setError(''); // Clear any previous errors
      await signInWithGoogle();
    } catch (err: any) {
      // Ignore popup cancelled errors (user closed popup)
      if (err?.code === 'auth/cancelled-popup-request' || err?.code === 'auth/popup-closed-by-user') {
        return; // Silently ignore - user intentionally cancelled
      }
      setError('Failed to sign in. Please try again.');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setSubmitting(true);
    setError('');

    try {
      // Try to save to Firestore
      try {
        await addDoc(collection(db, 'user_responses'), {
          userId: user?.uid,
          email: user?.email,
          displayName: user?.displayName,
          district: formData.district,
          schoolLevel: formData.schoolLevel,
          zipCode: formData.zipCode,
          additionalNotes: formData.additionalNotes,
          timestamp: serverTimestamp(),
        });
        console.log('Response saved to Firestore successfully');
      } catch (firestoreError) {
        // If Firestore isn't enabled, just log it and continue anyway
        console.warn('Firestore not enabled yet - skipping save:', firestoreError);
        // Save to localStorage as backup
        localStorage.setItem('user_response', JSON.stringify({
          userId: user?.uid,
          email: user?.email,
          district: formData.district,
          schoolLevel: formData.schoolLevel,
          zipCode: formData.zipCode,
          additionalNotes: formData.additionalNotes,
        }));
      }

      // Complete the landing page flow regardless of Firestore status
      console.log('Calling onComplete...');
      onComplete();
      console.log('onComplete called successfully');
    } catch (err) {
      setError('Failed to submit. Please try again.');
      console.error('Form submission error:', err);
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                School Reality Check
              </h1>
              <p className="text-slate-600">
                Compare Dublin vs Olentangy school districts with real data
              </p>
            </div>

            <div className="mb-8">
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Official NCES data for 52 schools</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Property tax estimates for $600k homes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Per-pupil spending and revenue sources</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleSignIn}
              className="w-full bg-white border-2 border-slate-300 text-slate-700 py-3 px-4 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            {error && (
              <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
            )}

            <p className="mt-6 text-xs text-slate-500 text-center">
              We collect basic info to understand our users. Your data is never sold.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome!</h2>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Sign out
            </button>
          </div>

          <p className="text-slate-600 mb-6">
            Help us personalize your experience. Tell us a bit about you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Which district are you interested in?
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a district...</option>
                <option value="olentangy">Olentangy Local Schools</option>
                <option value="dublin">Dublin City Schools</option>
                <option value="both">Considering both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What school level?
              </label>
              <select
                value={formData.schoolLevel}
                onChange={(e) => setFormData({ ...formData, schoolLevel: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select level...</option>
                <option value="elementary">Elementary</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
                <option value="all">All levels</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                What ZIP code do you live in?
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                placeholder="e.g., 43016, 43017, 43065..."
                required
                pattern="[0-9]{5}"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Any specific schools or questions? (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                placeholder="e.g., Looking at Wyandot Run ES vs Coffman ES..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Continue to Dashboard →'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Your responses help us improve the tool. We never share your data.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
