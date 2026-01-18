import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/lib/firebase/AuthContext";
import UserMenu from "./components/UserMenu";

export const metadata: Metadata = {
  title: "School Reality Check | Compare Central Ohio School Districts",
  description: "Honest, data-driven comparison of Olentangy, Dublin, and other Central Ohio school districts to help you make informed decisions about where to live.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900">
        <AuthProvider>
        <nav className="border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-slate-900">School Reality Check</span>
              </Link>
              <div className="flex items-center gap-8">
                <div className="hidden sm:flex space-x-8">
                  <Link href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Compare Districts
                  </Link>
                  <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">
                    About the Data
                  </Link>
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-sm text-slate-500 space-y-2">
              <p>
                <strong>Data Sources:</strong> NCES Common Core of Data (SY 2024-25),
                School District Finance Survey (FY 2022), Ohio School Report Cards (SY 2024-25)
              </p>
              <p>
                <strong>Last Updated:</strong> January 2026 |
                <span className="ml-2">Finance data reflects FY 2022 (~18 month lag)</span>
              </p>
              <p className="text-xs pt-2 border-t border-slate-200 mt-4">
                This tool uses only publicly available data. School-level funding is not available in public datasets.
                Per-pupil expenditure shown is district-level average.
              </p>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
