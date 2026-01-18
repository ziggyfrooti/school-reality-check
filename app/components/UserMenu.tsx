'use client';

import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    // Don't clear survey completion - it's tracked per user ID
    await signOut();
    // Redirect to home page which will show landing
    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-slate-600 hidden sm:inline">
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
}
