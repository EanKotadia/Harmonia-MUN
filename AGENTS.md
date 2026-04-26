# Harmonia MUN 2026

## Development Notes
- **Supabase**: The site uses a unified Supabase client that prioritizes `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. If these are missing, it falls back to `localStorage` (set via `/admin` setup screen).
- **Admin Panel**: Accessible at `/admin`. Password is `harmonia2026`.
- **Animations**: Framer Motion has been removed to match the high-performance, snappy feel of the reference site. Use standard Tailwind transitions instead.
- **Data Schema**:
  - `committees`: Name, description, image, bg guide.
  - `members`: Name, role, image, category (Secretariat, EB, OC), committee_id.
  - `schedule`: Title, description, times, day_label (Day 1/2), location.
  - `rankings`: Name, award, school, committee_id.
  - `settings`: Site-wide configuration.

## Admin Setup
When deploying to a new environment, navigate to the site root. If Supabase keys are missing, you will be prompted to enter them. Once entered, they persist in the browser.
