'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'adminStats';

const defaultStats = {
  totalProjects: 12,
  imagesUploaded: 248,
  messages: 0,
};

type Stats = typeof defaultStats;

type ContactLog = {
  id: string;
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
  email: string;
  timestamp: string;
  status?: 'pending' | 'approved';
};

function loadStats(): Stats {
  if (typeof window === 'undefined') return defaultStats;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultStats;
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
  const [contactLogs, setContactLogs] = useState<ContactLog[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const authenticated =
      localStorage.getItem('adminAuthenticated') === 'true';

    if (!authenticated) {
      router.push('/admin/login');
      return;
    }

    setTimeout(() => {
      setIsAuthenticated(true);

      const savedStats = loadStats();

      const submissions = JSON.parse(
        localStorage.getItem('contactSubmissions') || '[]'
      ) as ContactLog[];

      const normalized = Array.isArray(submissions)
        ? submissions
            .reverse()
            .map((s) => ({
              ...s,
              status: s.status || 'pending',
            }))
        : [];

      setContactLogs(normalized);

      const updatedStats = {
        ...savedStats,
        messages: normalized.length,
      };

      setStats(updatedStats);
      saveStats(updatedStats);

      setLoading(false);
    }, 0);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin/login');
  };

  const saveLogs = (updated: ContactLog[]) => {
    setContactLogs(updated);
    localStorage.setItem(
      'contactSubmissions',
      JSON.stringify(updated)
    );

    const updatedStats = {
      ...stats,
      messages: updated.length,
    };

    setStats(updatedStats);
    saveStats(updatedStats);
  };

  const handleApprove = (id: string) => {
    const updated = contactLogs.map((log) =>
      log.id === id
        ? { ...log, status: 'approved' }
        : log
    );

    saveLogs(updated);
  };

  const handleDelete = (id: string) => {
    const updated = contactLogs.filter(
      (log) => log.id !== id
    );

    saveLogs(updated);
  };

  const handleClearContactLogs = () => {
    localStorage.removeItem('contactSubmissions');
    setContactLogs([]);
    saveLogs([]);
  };

  const refreshContactLogs = () => {
    const submissions = JSON.parse(
      localStorage.getItem('contactSubmissions') || '[]'
    ) as ContactLog[];

    const normalized = submissions
      .reverse()
      .map((s) => ({
        ...s,
        status: s.status || 'pending',
      }));

    setContactLogs(normalized);

    const updatedStats = {
      ...stats,
      messages: normalized.length,
    };

    setStats(updatedStats);
    saveStats(updatedStats);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading admin...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-600">
              Booking & Content Management
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* STATS */}
      <main className="max-w-7xl mx-auto p-6">

        <div className="grid md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-5 rounded shadow">
            <p>Total Projects</p>
            <p className="text-2xl font-bold">
              {stats.totalProjects}
            </p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <p>Images Uploaded</p>
            <p className="text-2xl font-bold">
              {stats.imagesUploaded}
            </p>
          </div>

          <div className="bg-white p-5 rounded shadow">
            <p>Messages</p>
            <p className="text-2xl font-bold">
              {stats.messages}
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="bg-white p-5 rounded shadow mb-6">
          <div className="flex gap-2">
            <button
              onClick={refreshContactLogs}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Refresh
            </button>

            <button
              onClick={handleClearContactLogs}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* BOOKINGS */}
        <div className="bg-white rounded shadow">

          <div className="p-4 border-b font-semibold">
            Contact Form Submissions
          </div>

          {contactLogs.length === 0 ? (
            <div className="p-6 text-gray-500">
              No submissions yet.
            </div>
          ) : (
            <ul className="divide-y">

              {contactLogs.map((log) => (
                <li key={log.id} className="p-4">

                  <div className="flex justify-between">

                    <div>

                      <div className="flex gap-2 items-center">

                        <p className="font-semibold">
                          {log.name}
                        </p>

                        <span className="text-xs px-2 py-1 bg-blue-100 rounded">
                          {log.packageType}
                        </span>

                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            log.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {log.status || 'pending'}
                        </span>

                      </div>

                      <p className="text-sm text-gray-600">
                        📧 {log.email}
                      </p>

                      <p className="text-sm text-gray-600">
                        📞 {log.phone}
                      </p>

                      <p className="text-sm text-gray-600">
                        📅 {log.date}
                      </p>

                      <p className="text-sm text-gray-600">
                        💬 {log.message}
                      </p>

                      {/* ACTIONS */}
                      <div className="flex gap-2 mt-2">

                        <button
                          onClick={() =>
                            handleApprove(log.id)
                          }
                          className="bg-green-600 text-white px-2 py-1 text-xs rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(log.id)
                          }
                          className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                    <span className="text-xs text-gray-500">
                      {formatDate(log.timestamp)}
                    </span>

                  </div>

                </li>
              ))}

            </ul>
          )}

        </div>

      </main>
    </div>
  );
}