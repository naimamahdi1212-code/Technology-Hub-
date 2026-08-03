# Connecting auth to Supabase

The site's `login.html` is fully wired to Supabase Auth (email + password) —
it just needs your project's credentials.

## 1. Create a Supabase project
Go to [supabase.com](https://supabase.com) → New project. Free tier is fine to start.

## 2. Run the schema
Project → **SQL Editor** → New query → paste the contents of `schema.sql` → Run.
This creates:
- a `profiles` table (auto-populated for every new user via a trigger)
- a public `avatars` storage bucket with upload policies

## 3. Add your keys
Project → **Settings → API**. Copy the **Project URL** and **anon/public key**
(not the `service_role` key — that one must never go in frontend code).

Open `js/auth.js` and replace:

```js
const SUPABASE_URL = 'https://YOUR-PROJECT-REF.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-PUBLIC-ANON-KEY';
```

## 4. Confirmation emails
Supabase sends a confirmation link automatically on sign-up and blocks login
until it's clicked — `auth.js` already shows the right message for that case.
For production, go to **Authentication → Email Templates** to customize the
confirmation email, and **Authentication → URL Configuration** to set your
real site URL (so the confirmation link redirects correctly).

## How it works
- **Sign up** — `supabaseClient.auth.signUp({ email, password, options: { data: { display_name } } })`.
  The `handle_new_user` trigger in `schema.sql` creates the matching `profiles` row.
  If an avatar was chosen and a session exists immediately (email confirmation
  disabled in your project settings), it's uploaded to the `avatars` bucket.
- **Log in** — `supabaseClient.auth.signInWithPassword({ email, password })`.
- **Session state** — every page loads `auth.js`, which checks the session on
  load and listens for changes, swapping the nav's Log in / Join free buttons
  for a "Hi, {name}" menu with a Log out action.

## Testing without a project yet
Until you add real keys, the login page still validates fields and shows a
clear "auth isn't connected yet" message instead of failing silently.
