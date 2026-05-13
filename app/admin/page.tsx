'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CONTACT_KEY = 'contactSubmissions';
const BOOKING_KEY = 'adminBookingLogs';

type LogStatus = 'pending' | 'approved';

type ContactLog = {
  id: string;
  name: string;
  phone: string;
  date: string;
  packageType: string;
  message: string;
  email: string;
  timestamp: string;
  status?: LogStatus;
};

type BookingLog = ContactLog;

export default function AdminPanel() {
  const router = useRouter();

  const [contactLogs, setContactLogs] = useState<ContactLog[]>([]);
  const [bookingLogs, setBookingLogs] = useState<BookingLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    const contacts = JSON.parse(localStorage.getItem(CONTACT_KEY) || '[]');
    const bookings = JSON.parse(localStorage.getItem(BOOKING_KEY) || '[]');

    const normalize = (arr: any[]) =>
      Array.isArray(arr)
        ? arr.reverse().map((x) => ({
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

  const updateStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
    loadData();
  };

  const approve = (id: string, type: 'contact' | 'booking') => {
    const key = type === 'contact' ? CONTACT_KEY : BOOKING_KEY;

    const data =
      type === 'contact' ? contactLogs : bookingLogs;

    const updated = data.map((d) =>
      d.id === id ? { ...d, status: 'approved' } : d
    );

    updateStorage(key, updated);
  };

  const remove = (id: string, type: 'contact' | 'booking') => {
    const key = type === 'contact' ? CONTACT_KEY : BOOKING_KEY;

    const data =
      type === 'contact' ? contactLogs : bookingLogs;

    const updated = data.filter((d) => d.id !== id);

    updateStorage(key, updated);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleString();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading admin panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
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

      {/* GRID */}
      <div className="max-w-6xl mx-auto p-6 space-y-10">

        {/* CONTACTS */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Contact Submissions
          </h2>

          <div className="space-y-4">
            {contactLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-900 border border-gray-800 p-4 rounded-xl"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{log.name}</p>

                    <p className="text-gray-400 text-sm">
                      📧 {log.email}
                    </p>
                    <p className="text-gray-400 text-sm">
                      📞 {log.phone}
                    </p>
                    <p className="text-gray-400 text-sm">
                      📅 {log.date}
                    </p>
                    <p className="text-gray-400 text-sm">
                      💬 {log.message}
                    </p>

                    <span
                      className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                        log.status === 'approved'
                          ? 'bg-green-600'
                          : 'bg-yellow-600'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>

                  <div className="text-right text-xs text-gray-400">
                    {formatDate(log.timestamp)}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => approve(log.id, 'contact')}
                    className="bg-green-600 px-2 py-1 text-xs rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => remove(log.id, 'contact')}
                    className="bg-red-600 px-2 py-1 text-xs rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BOOKINGS */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Booking Requests
          </h2>

          <div className="space-y-4">
            {bookingLogs.map((log) => (
              <div
                key={log.id}
                className="bg-gray-900 border border-gray-800 p-4 rounded-xl"
              >
                <p className="font-bold">{log.name}</p>

                <p className="text-gray-400 text-sm">
                  📧 {log.email}
                </p>
                <p className="text-gray-400 text-sm">
                  📞 {log.phone}
                </p>
                <p className="text-gray-400 text-sm">
                  📅 {log.date}
                </p>
                <p className="text-gray-400 text-sm">
                  🧾 {log.packageType}
                </p>
                <p className="text-gray-400 text-sm">
                  💬 {log.message}
                </p>

                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                    log.status === 'approved'
                      ? 'bg-green-600'
                      : 'bg-yellow-600'
                  }`}
                >
                  {log.status}
                </span>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => approve(log.id, 'booking')}
                    className="bg-green-600 px-2 py-1 text-xs rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => remove(log.id, 'booking')}
                    className="bg-red-600 px-2 py-1 text-xs rounded"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {formatDate(log.timestamp)}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}