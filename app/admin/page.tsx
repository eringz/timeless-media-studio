'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'adminStats';

const defaultStats = {
  totalProjects: 12,
  imagesUploaded: 248,
  messages: 8,
};

type Stats = typeof defaultStats;

function loadStats(): Stats {
  if (typeof window === 'undefined') {
    return defaultStats;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as Stats : defaultStats;
  } catch {
    return defaultStats;
  }
}

function saveStats(value: Stats) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [contactLogs, setContactLogs] = useState<Array<{
    id: string;
    name: string;
    phone: string;
    date: string;
    packageType: string;
    message: string;
    email: string;
    timestamp: string;
  }>>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const authenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!authenticated) {
      router.push('/admin/login');
      return;
    }

    setTimeout(() => {
      setIsAuthenticated(true);
      const savedStats = loadStats();
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      const reversedSubmissions = Array.isArray(submissions) ? submissions.reverse() : [];

      setContactLogs(reversedSubmissions);
      const updatedStats = { ...savedStats, messages: reversedSubmissions.length };
      setStats(updatedStats);
      saveStats(updatedStats);
      setLoading(false);
    }, 0);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const updateStats = (updates: Partial<Stats>) => {
    const nextStats = { ...stats, ...updates };
    setStats(nextStats);
    saveStats(nextStats);
  };

  const handleResetUploads = () => updateStats({ imagesUploaded: 0 });
  const handleResetAllCounters = () => updateStats({ totalProjects: 0, imagesUploaded: 0, messages: 0 });
  const handleRestoreDefaults = () => {
    setStats(defaultStats);
    saveStats(defaultStats);
  };
  const handleClearContactLogs = () => {
    localStorage.removeItem('contactSubmissions');
    setContactLogs([]);
    updateStats({ messages: 0 });
  };

  const refreshContactLogs = () => {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    setContactLogs(submissions.reverse());
    updateStats({ messages: submissions.length });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading admin...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600 mt-1">Manage site stats, reset uploads, and keep the studio dashboard current.</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.totalProjects}</p>
              <p className="mt-2 text-sm text-gray-600">Number of active collections and featured projects.</p>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <p className="text-sm font-medium text-gray-500">Images Uploaded</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.imagesUploaded}</p>
              <p className="mt-2 text-sm text-gray-600">Total uploaded images tracked in the admin dashboard.</p>
              <button
                onClick={handleResetUploads}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
              >
                Reset Upload Count
              </button>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <p className="text-sm font-medium text-gray-500">Messages</p>
              <p className="mt-3 text-3xl font-semibold text-gray-900">{stats.messages}</p>
              <p className="mt-2 text-sm text-gray-600">Recent message volume from clients and inquiries.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  <p className="mt-2 text-sm text-gray-600">Reset dashboard counters or restore the demo defaults.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={handleResetAllCounters}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm hover:border-gray-300"
                >
                  Reset All Counters
                </button>
                <button
                  onClick={handleRestoreDefaults}
                  className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Restore Defaults
                </button>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900">Content Management</h2>
              <p className="mt-2 text-sm text-gray-600">Use these quick links to manage gallery and site content without leaving the admin dashboard.</p>
              <div className="mt-6 grid gap-3">
                <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700">
                  Manage Gallery
                </button>
                <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Edit Content
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Contact Form Submissions</h2>
              <div className="flex gap-2">
                <button
                  onClick={refreshContactLogs}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Refresh
                </button>
                <button
                  onClick={handleClearContactLogs}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Clear Logs
                </button>
              </div>
            </div>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {contactLogs.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No contact form submissions yet.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {contactLogs.map((log) => (
                    <li key={log.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-medium text-gray-900">{log.name}</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {log.packageType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Phone:</span> {log.phone}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Date:</span> {log.date}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Message:</span> {log.message}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}