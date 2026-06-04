'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
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
  'pending',
  'approved',
  'completed',
  'cancelled',
];

const EarningsTrendChart = ({ bookingLogs, startDate, endDate }: { bookingLogs: any[]; startDate: string; endDate: string }) => {
  const getDailyEarnings = () => {
    const dailyMap: { [key: string]: number } = {};
    
    bookingLogs
      .filter((log) => {
        if (log.status !== 'completed') return false;
        if (!startDate || !endDate) return true;
        const logDate = new Date(log.created_at);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return logDate >= start && logDate <= end;
      })
      .forEach((log) => {
        const date = new Date(log.created_at).toLocaleDateString('en-CA');
        const price = log.package_type.includes('BASIC') ? 10 : log.package_type.includes('ELITE') ? 20 : 30;
        dailyMap[date] = (dailyMap[date] || 0) + price;
      });

    return Object.entries(dailyMap).map(([date, earnings]) => ({ date, earnings })).sort((a, b) => a.date.localeCompare(b.date));
  };

  const dailyData = getDailyEarnings();
  const maxEarnings = dailyData.length > 0 ? Math.max(...dailyData.map((d) => d.earnings)) : 100;
  const svgHeight = 250;
  const svgWidth = Math.max(600, dailyData.length * 40);
  const padding = 40;
  const graphHeight = svgHeight - 2 * padding;
  const graphWidth = svgWidth - 2 * padding;

  const points = dailyData.map((d, i) => {
    const x = padding + (i / Math.max(1, dailyData.length - 1)) * graphWidth;
    const y = svgHeight - padding - (d.earnings / maxEarnings) * graphHeight;
    return { x, y, earnings: d.earnings, date: d.date };
  });

  const pathD =
    points.length > 0
      ? `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`
      : '';

  return (
    <div className="overflow-x-auto">
      <svg width={svgWidth} height={svgHeight} className="min-w-full">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`grid-${i}`}
            x1={padding}
            y1={svgHeight - padding - (i / 4) * graphHeight}
            x2={svgWidth - padding}
            y2={svgHeight - padding - (i / 4) * graphHeight}
            stroke="#374151"
            strokeDasharray="5,5"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#9CA3AF" strokeWidth="2" />
        <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#9CA3AF" strokeWidth="2" />

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => (
          <text
            key={`label-${i}`}
            x={padding - 10}
            y={svgHeight - padding - (i / 4) * graphHeight + 5}
            textAnchor="end"
            fill="#9CA3AF"
            fontSize="12"
          >
            ₱{Math.round((i / 4) * maxEarnings)}
          </text>
        ))}

        {/* Line path */}
        {pathD && <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="3" />}

        {/* Data points */}
        {points.map((p, i) => (
          <g key={`point-${i}`}>
            <circle cx={p.x} cy={p.y} r="5" fill="#60A5FA" />
            <title>{`${p.date}: ₱${p.earnings}`}</title>
          </g>
        ))}
      </svg>
      {dailyData.length === 0 && (
        <p className="py-8 text-center text-gray-500">No earnings data available for selected period</p>
      )}
    </div>
  );
};

export default function AdminPanel() {
  const router = useRouter();

  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const isAuthenticated = document.cookie
      .split('; ')
      .some((cookie) => cookie === 'adminAuthenticated=true');

    if (!isAuthenticated) {
      router.push('/admin/login');
      return;
    }

    const runInitialLoad = async () => {
      await loadData();
    };

    void runInitialLoad();

    const interval = window.setInterval(() => {
      void loadData();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };

  }, [loadData, router]);

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

  const reinstateBooking = async (id: string) => {
    await updateStatus(id, 'pending');
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
    
    let filtered = bookingLogs;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((log) => log.status === selectedStatus);
    }

    // Filter by search query
    if (!q) return filtered;

    return filtered.filter(
      (log) =>
        log.confirmation_number?.toLowerCase().includes(q) ||
        log.name?.toLowerCase().includes(q) ||
        log.phone?.toLowerCase().includes(q) ||
        log.email?.toLowerCase().includes(q)
    );
  }, [bookingLogs, search, selectedStatus]);

  const formatDate = (d: string) => {
    if (!d) return 'No date';
    return new Date(d).toLocaleString();
  };

  const getPackagePrice = (packageType: string): number => {
    if (packageType.includes('BASIC')) return 10;
    if (packageType.includes('ELITE')) return 20;
    if (packageType.includes('PREMIUM')) return 30;
    return 0;
  };

  const calculateEarnings = (logs: BookingLog[], startDateStr?: string, endDateStr?: string): number => {
    return logs
      .filter((log) => {
        if (log.status !== 'completed') return false;
        if (!startDateStr || !endDateStr) return true;
        const logDate = new Date(log.created_at);
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        end.setHours(23, 59, 59, 999);
        return logDate >= start && logDate <= end;
      })
      .reduce((total, log) => total + getPackagePrice(log.package_type), 0);
  };

  const statusLabel = (status?: BookingStatus) => {
    if (status === 'pending') return 'Pending';
    if (status === 'approved') return 'Approved';
    if (status === 'completed') return 'Completed';
    if (status === 'cancelled') return 'Cancelled';
    return 'Unknown';
  };

  const statusClass = (status?: BookingStatus) => {
    if (status === 'pending') return 'bg-yellow-600';
    if (status === 'approved') return 'bg-green-600';
    if (status === 'completed') return 'bg-gray-600';
    if (status === 'cancelled') return 'bg-red-600';
    return 'bg-gray-600';
  };

  const logout = () => {
    document.cookie = 'adminAuthenticated=; path=/; max-age=0; SameSite=Lax';
    router.push('/admin/login');
  };

  const renderLogCard = (log: BookingLog) => (
    <div
      key={log.id}
      className="rounded-xl border border-gray-800 bg-gray-900 p-4"
    >
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-bold">{log.name}</p>

          <p className="text-sm font-bold text-green-300">
            🔎 Confirmation: {log.confirmation_number}
          </p>

          <p className="text-sm text-gray-400">📧 {log.email}</p>
          <p className="text-sm text-gray-400">📞 {log.phone}</p>
          <p className="text-sm text-gray-400">📅 {log.booking_date}</p>
          <p className="text-sm text-gray-400">🧾 {log.package_type}</p>

          {log.message && (
            <p className="text-sm text-gray-400">💬 {log.message}</p>
          )}

          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs text-white ${statusClass(
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

      <div className="mt-4 flex flex-wrap gap-2">
        {statusOptions.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => updateStatus(log.id, status)}
            disabled={log.status === status}
            className="rounded bg-white/10 px-3 py-1 text-xs text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {statusLabel(status)}
          </button>
        ))}

        {log.status === 'cancelled' && (
          <button
            type="button"
            onClick={() => reinstateBooking(log.id)}
            className="rounded bg-yellow-600 px-3 py-1 text-xs text-white transition hover:bg-yellow-700"
          >
            Reinstate Booking
          </button>
        )}

        <button
          type="button"
          onClick={() => remove(log.id)}
          className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex flex-col gap-4 border-b border-gray-800 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin</h1>
          <p className="text-sm text-gray-400">
Timeless Studio Booking Management          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/customer-service/dashboard')}
            className="rounded bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
          >
            Customer Service
          </button>

          <button
            type="button"
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 p-6">
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="mb-4 text-sm font-semibold text-gray-300">📅 Filter Earnings by Date Range</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-xs text-gray-400">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-black px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>
            <div className="flex-1">
              <label className="mb-2 block text-xs text-gray-400">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-black px-4 py-2 text-white outline-none focus:border-white"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="rounded-xl bg-gray-700 px-6 py-2 text-white transition hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-sm text-gray-400">Total Bookings</p>
            <p className="text-3xl font-black">{bookingLogs.length}</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-3xl font-black">
              {bookingLogs.filter((log) => log.status === 'pending').length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-sm text-gray-400">Completed</p>
            <p className="text-3xl font-black">
              {bookingLogs.filter((log) => log.status === 'completed').length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-sm text-gray-400">Cancelled</p>
            <p className="text-3xl font-black">
              {bookingLogs.filter((log) => log.status === 'cancelled').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-green-800 bg-green-900/20 p-4">
            <p className="text-sm text-green-300">Total Earnings</p>
            <p className="text-3xl font-black text-green-400">₱{calculateEarnings(bookingLogs)}</p>
          </div>

          <div className="rounded-xl border border-blue-800 bg-blue-900/20 p-4">
            <p className="text-sm text-blue-300">Earnings (Selected Period)</p>
            <p className="text-3xl font-black text-blue-400">
              ₱{calculateEarnings(bookingLogs, startDate, endDate)}
            </p>
          </div>

          <div className="rounded-xl border border-purple-800 bg-purple-900/20 p-4">
            <p className="text-sm text-purple-300">Conversion Rate</p>
            <p className="text-3xl font-black text-purple-400">
              {bookingLogs.length === 0 ? '0%' : `${Math.round((bookingLogs.filter((log) => log.status === 'completed').length / bookingLogs.length) * 100)}%`}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h3 className="mb-6 text-lg font-bold">📊 Earnings Trend</h3>
          <EarningsTrendChart bookingLogs={bookingLogs} startDate={startDate} endDate={endDate} />
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search confirmation number, name, phone, or email..."
            className="h-12 w-full rounded-xl border border-gray-700 bg-black px-4 text-white outline-none focus:border-white"
          />
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-300">Filter by Status:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`rounded-lg px-4 py-2 font-semibold transition ${
                selectedStatus === 'all'
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              All Bookings
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('pending')}
              className={`rounded-lg px-4 py-2 font-semibold transition ${
                selectedStatus === 'pending'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('approved')}
              className={`rounded-lg px-4 py-2 font-semibold transition ${
                selectedStatus === 'approved'
                  ? 'bg-green-500 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Approved
            </button>
        
          
            <button
              type="button"
              onClick={() => setSelectedStatus('completed')}
              className={`rounded-lg px-4 py-2 font-semibold transition ${
                selectedStatus === 'completed'
                  ? 'bg-gray-400 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('cancelled')}
              className={`rounded-lg px-4 py-2 font-semibold transition ${
                selectedStatus === 'cancelled'
                  ? 'bg-red-500 text-black'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            Booking Requests {selectedStatus !== 'all' && `(${filteredBookingLogs.length})`}
          </h2>

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