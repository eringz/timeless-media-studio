import { NextResponse } from 'next/server';
import { supabaseRequest } from '@/lib/supabase/server';
import type { BookingPayload, BookingRow, BookingStatus } from '@/lib/supabase/types';

const allowedStatuses: BookingStatus[] = [
  'pending',
  'approved',
  'in_process',
  'for_pick_up',
  'completed',
];

const generateConfirmationNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `BK-${year}-${random}`;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const confirmationNumber = searchParams.get('confirmationNumber');

    const query = confirmationNumber
      ? `/bookings?confirmation_number=ilike.${encodeURIComponent(
          confirmationNumber.trim()
        )}&select=*&limit=1`
      : '/bookings?select=*&order=created_at.desc';

    const data = await supabaseRequest<BookingRow[]>(query);

    if (confirmationNumber) {
      return NextResponse.json(data?.[0] || null);
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load bookings.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as BookingPayload;

    if (!body.name || !body.phone || !body.email || !body.date || !body.packageType) {
      return NextResponse.json(
        { error: 'Name, phone, email, date, and package are required.' },
        { status: 400 }
      );
    }

    const confirmationNumber = body.confirmationNumber || generateConfirmationNumber();

    const rows = await supabaseRequest<BookingRow[]>('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        name: body.name,
        phone: body.phone,
        email: body.email.toLowerCase().trim(),
        email_provider: body.emailProvider || null,
        booking_date: body.date,
        package_type: body.packageType,
        message: body.message || null,
        confirmation_number: confirmationNumber,
        status: body.status || 'pending',
      }),
    });

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid booking request.' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as { id?: string; status?: BookingStatus };

    if (!body.id || !body.status || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Valid booking id and status are required.' },
        { status: 400 }
      );
    }

    const rows = await supabaseRequest<BookingRow[]>(
      `/bookings?id=eq.${encodeURIComponent(body.id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: body.status,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid status update request.' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Booking id is required.' }, { status: 400 });
    }

    await supabaseRequest(`/bookings?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete booking.' },
      { status: 500 }
    );
  }
}
