'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CONTACT_KEY = 'contactSubmissions';
const BOOKING_KEY = 'adminBookingLogs';

type LogStatus =
  | 'pending'
  | 'approved'
  | 'in_progress'
  | 'for_pick_up'
  | 'completed';

type ContactLog = {
  id: string;
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
  email: string;
  timestamp: string;
  confirmationNumber?: string;
  status?: LogStatus;
};

type BookingLog = ContactLog;

export default function AdminPanel() {
  const router = useRouter();

  const [contactLogs, setContactLogs] = useState<ContactLog[]>([]);
  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const contacts = JSON.parse(localStorage.getItem(CONTACT_KEY) || '[]');
    const bookings = JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]');

    const normalize = (arr: any[]) =>
      Array.isArray(arr)
        ? [...arr].reverse().map((x) => ({
            ...x,
            status: x.status || 'pending',
          }))
        : [];

    setContactLogs(normalize(contacts));
    setBookingLogs(normalize(bookings));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const auth = localStorage.getItem('adminAuthenticated');

    if (auth !== 'true') {
      router.push('/admin/login');
      return;
    }

    loadData();
    setLoading(false);

    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, [router]);

  const updateStorage = (key: string, data: ContactLog[]) => {
    localStorage.setItem(key, JSON.stringify(data));
    loadData();
  };

  const updateStatus = (
    id: string,
    type: 'contact' | 'booking',
    status: LogStatus
  ) => {
    const key = type === 'contact' ? CONTACT_KEY : BOOKING_KEY;
    const rawData = JSON.parse(localStorage.getItem(key) || '[]') as ContactLog[];

    const updated = rawData.map((item) =>
      item.id === id ? { ...item, status } : item
    );

    updateStorage(key, updated);
  };

  const remove = (id: string, type: 'contact' | 'booking') => {
    const key = type === 'contact' ? CONTACT_KEY : BOOKING_KEY;
    const rawData = JSON.parse(localStorage.getItem(key) || '[]') as ContactLog[];

    const updated = rawData.filter((item) => item.id !== id);

    updateStorage(key, updated);
  };

  const filterLogs = (logs: ContactLog[]) => {
    const q = search.toLowerCase().trim();

    if (!q) return logs;

    return logs.filter((log) =>
      log.confirmationNumber?.toLowerCase().includes(q) ||
      log.name?.toLowerCase().includes(q) ||
      log.phone?.toLowerCase().includes(q)
    );
  };

  const filteredContactLogs = filterLogs(contactLogs);
  const filteredBookingLogs = filterLogs(bookingLogs);

  const formatDate = (d: string) => {
    if (!d) return 'No date';
    return new Date(d).toLocaleString();
  };

  const statusLabel = (status?: LogStatus) => {
    if (status === 'approved') return 'Approved';
    if (status === 'in_progress') return 'In Progress';
    if (status === 'for_pick_up') return 'For Pick Up';
    if (status === 'completed') return 'Completed';
    return 'Pending';
  };

  const statusClass = (status?: LogStatus) => {
    if (status === 'approved') return 'bg-green-600';
    if (status === 'in_progress') return 'bg-blue-600';
    if (status === 'for_pick_up') return 'bg-purple-600';
    if (status === 'completed') return 'bg-gray-600';
    return 'bg-yellow-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading admin panel...
      </div>
    );
  }

  const renderLogCard = (
    log: ContactLog,
    type: 'contact' | 'booking'
  ) => (
    <div
      key={log.id}
      className="bg-gray-900 border border-gray-800 p-4 rounded-xl"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <p className="font-bold text-lg">{log.name}</p>

          {log.confirmationNumber && (
            <p className="text-sm text-green-300 font-bold">
              🔎 Confirmation: {log.confirmationNumber}
            </p>
          )}

          <p className="text-gray-400 text-sm">📧 {log.email}</p>
          <p className="text-gray-400 text-sm">📞 {log.phone}</p>
          <p className="text-gray-400 text-sm">📅 {log.date}</p>

          {log.packageType && (
            <p className="text-gray-400 text-sm">🧾 {log.packageType}</p>
          )}

          <p className="text-gray-400 text-sm">💬 {log.message}</p>

          <span
            className={`inline-block mt-3 text-xs px-3 py-1 rounded-full text-white ${statusClass(
              log.status
            )}`}
          >
            {statusLabel(log.status)}
          </span>
        </div>

        <div className="text-xs text-gray-500">
          {formatDate(log.timestamp)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => updateStatus(log.id, type, 'approved')}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded"
        >
          Approve
        </button>

        <button
          onClick={() => updateStatus(log.id, type, 'in_progress')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
        >
          In Progress
        </button>

        <button
          onClick={() => updateStatus(log.id, type, 'for_pick_up')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs rounded"
        >
          For Pick Up
        </button>

        <button
          onClick={() => updateStatus(log.id, type, 'completed')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 text-xs rounded"
        >
          Done / Completed
        </button>

        <button
          onClick={() => remove(log.id, type)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 p-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 text-sm">
            Bookings & Contact Management
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('adminAuthenticated');
            router.push('/admin/login');
          }}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search confirmation number, name, or phone number..."
            className="w-full h-12 rounded-xl bg-black border border-gray-700 px-4 text-white outline-none focus:border-white"
          />
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Contact Submissions
          </h2>

          <div className="space-y-4">
            {filteredContactLogs.length === 0 ? (
              <p className="text-gray-500">No matching contact submissions.</p>
            ) : (
              filteredContactLogs.map((log) => renderLogCard(log, 'contact'))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            Booking Requests
          </h2>

          <div className="space-y-4">
            {filteredBookingLogs.length === 0 ? (
              <p className="text-gray-500">No matching booking requests.</p>
            ) : (
              filteredBookingLogs.map((log) => renderLogCard(log, 'booking'))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}