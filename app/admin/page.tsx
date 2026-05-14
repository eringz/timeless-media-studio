'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BookingStatus } from '@/lib/supabase/types';

type BookingLog = {
  id: string;
  name: string;
  phone: string;
  email: string;
  email_provider?: string | null;
  booking_date: string;
  package_type: string;
  message?: string | null;
  confirmation_number: string;
  status: BookingStatus;
  created_at: string;
  updated_at?: string | null;
};

const statusOptions: BookingStatus[] = [
  'approved',
  'in_process',
  'for_pick_up',
  'completed',
];

export default function AdminPanel() {
  const router = useRouter();

  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const response = await fetch('/api/bookings', { cache: 'no-store' });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to load bookings.');
      }

      const data = (await response.json()) as BookingLog[];
      setBookingLogs(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isAuthenticated = document.cookie
      .split('; ')
      .some((cookie) => cookie === 'adminAuthenticated=true');

    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    loadData();
    const interval = window.setInterval(loadData, 5000);

    return () => window.clearInterval(interval);
  }, [router]);

  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to update booking status.');
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking.');
    }
  };

  const remove = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to delete booking.');
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete booking.');
    }
  };

  const filteredBookingLogs = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return bookingLogs;

    return bookingLogs.filter((log) =>
      log.confirmation_number?.toLowerCase().includes(q) ||
      log.name?.toLowerCase().includes(q) ||
      log.phone?.toLowerCase().includes(q) ||
      log.email?.toLowerCase().includes(q)
    );
  }, [bookingLogs, search]);

  const formatDate = (d: string) => {
    if (!d) return 'No date';
    return new Date(d).toLocaleString();
  };

  const statusLabel = (status?: BookingStatus) => {
    if (status === 'approved') return 'Approved';
    if (status === 'in_process') return 'In Process';
    if (status === 'for_pick_up') return 'For Pick Up';
    if (status === 'completed') return 'Completed';
    return 'Pending';
  };

  const statusClass = (status?: BookingStatus) => {
    if (status === 'approved') return 'bg-green-600';
    if (status === 'in_process') return 'bg-blue-600';
    if (status === 'for_pick_up') return 'bg-purple-600';
    if (status === 'completed') return 'bg-gray-600';
    return 'bg-yellow-600';
  };

  const logout = () => {
    document.cookie = 'adminAuthenticated=; path=/; max-age=0; SameSite=Lax';
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading admin panel...
      </div>
    );
  }

  const renderLogCard = (log: BookingLog) => (
    <div
      key={log.id}
      className="bg-gray-900 border border-gray-800 p-4 rounded-xl"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <p className="font-bold text-lg">{log.name}</p>

          <p className="text-sm text-green-300 font-bold">
            🔎 Confirmation: {log.confirmation_number}
          </p>

          <p className="text-gray-400 text-sm">📧 {log.email}</p>
          <p className="text-gray-400 text-sm">📞 {log.phone}</p>
          <p className="text-gray-400 text-sm">📅 {log.booking_date}</p>
          <p className="text-gray-400 text-sm">🧾 {log.package_type}</p>

          {log.message && (
            <p className="text-gray-400 text-sm">💬 {log.message}</p>
          )}

          <span
            className={`inline-block mt-3 text-xs px-3 py-1 rounded-full text-white ${statusClass(
              log.status
            )}`}
          >
            {statusLabel(log.status)}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          {formatDate(log.created_at)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => updateStatus(log.id, status)}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 text-xs rounded transition"
          >
            {statusLabel(status)}
          </button>
        ))}

        <button
          onClick={() => remove(log.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm">
            Supabase Booking Management
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-gray-400 text-sm">Total Bookings</p>
            <p className="text-3xl font-black">{bookingLogs.length}</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-3xl font-black">
              {bookingLogs.filter((log) => log.status === 'pending').length}
            </p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-gray-400 text-sm">Completed</p>
            <p className="text-3xl font-black">
              {bookingLogs.filter((log) => log.status === 'completed').length}
            </p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search confirmation number, name, phone, or email..."
            className="w-full h-12 rounded-xl bg-black border border-gray-700 px-4 text-white outline-none focus:border-white"
          />
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

          <div className="space-y-4">
            {filteredBookingLogs.length === 0 ? (
              <p className="text-gray-500">No matching booking requests.</p>
            ) : (
              filteredBookingLogs.map((log) => renderLogCard(log))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
