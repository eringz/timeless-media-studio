# Supabase Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor.
3. Run the SQL inside `supabase-bookings.sql`.
4. Copy your Supabase Project URL, anon key, and service role key.
5. Put them in `.env.local`.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_optional_but_recommended
```

The app now saves bookings in the `bookings` table instead of browser localStorage.

Updated parts:

- `app/contact/page.tsx` creates bookings through `/api/bookings`
- `app/admin/page.tsx` loads, updates, and deletes bookings through `/api/bookings`
- `app/api/page.tsx` tracks bookings through Supabase
- `app/api/bookings/route.ts` handles GET, POST, PATCH, and DELETE
- `lib/supabase/server.ts` connects to Supabase REST API
