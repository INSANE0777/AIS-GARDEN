## AIS Secret Garden

AIS Secret Garden is a collaborative, browser‑based drawing experience built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **Supabase**.

Users can:
- Draw simple flower illustrations on a canvas.
- **Plant** their drawings into a shared garden at specific positions.
- See other users’ flowers appear in real time via Supabase Realtime.
- Browse all planted flowers in a dedicated **Gallery** view.

The app was scaffolded from a v0 / shadcn‑style starter and customized for the “AIS SECRET GARDEN” concept.

---

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**:
  - React 19
  - Tailwind CSS
  - shadcn/ui‑style component set in `components/ui`
- **Backend / Data**:
  - Supabase (Postgres, Realtime, RLS)
  - SQL schema in `scripts/001_create_gardens.sql`

---

### Features

- **Personalized entry**
  - Name prompt stored in `localStorage` (`gardenUserName` and `gardenUserId`).
  - Each user gets a generated UUID in the `users` table.

- **Drawing & Planting**
  - Canvas drawing experience in `drawing-canvas.tsx`.
  - Choose from several predefined flower colors.
  - Click on the garden (`garden-canvas` / `garden-display`) to plant your flower at a specific coordinate.

- **Realtime Shared Garden**
  - Garden state is persisted in the `planted_flowers` table.
  - Realtime `INSERT` subscription on `planted_flowers` via Supabase Realtime.
  - New flowers appear for everyone without a manual refresh.

- **Gallery View**
  - `/gallery` route shows a grid of all planted flowers, with:
    - Thumbnail of the drawn flower.
    - Planter name.
    - Date planted.
    - Color indicator.

---

### Getting Started

#### 1. Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm**, **npm**, or **yarn**
- A **Supabase** project with:
  - Anonymous public key
  - Project URL

#### 2. Clone and install

```bash
git clone <your-repo-url> GARDEN
cd GARDEN

# using pnpm (recommended if you already use it)
pnpm install

# or with npm
npm install
```

#### 3. Configure environment variables

Create a `.env.local` file in the project root and add the Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"
```

These values are used in:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

#### 4. Set up the database schema

In your Supabase SQL editor (or psql connected to the Supabase database), run the contents of:

- `scripts/001_create_gardens.sql`

This will:
- Create the `users` table with `id`, `name`, and `created_at`.
- Create the `planted_flowers` table with:
  - `user_id` (FK to `users`)
  - `drawing_data` (base64 canvas image)
  - `x`, `y` coordinates
  - `color`
  - `created_at`
- Enable **Row Level Security (RLS)** and define simple, permissive policies that:
  - Allow anyone to `SELECT`.
  - Allow anyone to `INSERT` flowers and users.

#### 5. Enable Realtime for `planted_flowers`

In the Supabase dashboard:
- Go to **Database → Replication / Realtime**.
- Enable Realtime for the `public.planted_flowers` table.

This is required for new flowers to appear in the garden without a page refresh.

---

### Running the App

#### Development

```bash
# with pnpm
pnpm dev

# or with npm
npm run dev
```

Then open `http://localhost:3000` in your browser.

Key routes:
- `/` – Main garden experience (“AIS SECRET GARDEN”).
- `/gallery` – Read‑only gallery of all planted flowers.

#### Production build

```bash
pnpm build
pnpm start

# or with npm
npm run build
npm start
```

You can deploy this Next.js app to any provider that supports Next 16 (e.g. Vercel).

---

### Project Structure (high level)

- `app/`
  - `page.tsx` – Home / garden page.
  - `gallery/page.tsx` – Flower gallery.
  - `layout.tsx` – Root layout.
  - `globals.css` – App‑router specific global styles.
- `components/`
  - `drawing-canvas.tsx` – User drawing canvas component.
  - `garden-canvas.tsx`, `garden-display.tsx` – Garden visualization and click handling.
  - `name-prompt.tsx` – Initial name entry modal / prompt.
  - `theme-provider.tsx` – Dark/light theme handling (if enabled).
  - `ui/*` – Reusable UI primitives (buttons, dialogs, inputs, etc.).
- `hooks/`
  - `use-mobile.ts`, `use-toast.ts` – Shared hooks.
- `lib/`
  - `supabase/client.ts` – Browser Supabase client factory.
  - `supabase/server.ts` – Server Supabase client, wired to Next cookies.
  - `utils.ts` – Misc utilities.
- `scripts/`
  - `001_create_gardens.sql` – Database schema & RLS policies.
- `public/`
  - `images/*` – Garden, cursor, and brand imagery.

---

### Development Notes

- **State & persistence**
  - User identity is very lightweight: a single row in `users` and a UUID cached in `localStorage`.
  - Garden loading and live updates are handled in `app/page.tsx` via:
    - Initial `SELECT` from `planted_flowers`.
    - Realtime channel subscription on `INSERT`.

- **Drawing data**
  - Drawings are stored as **base64‑encoded image data URLs** (`TEXT`) in `planted_flowers.drawing_data`.
  - Client‑side rendering uses simple `<img src={imageData} />`.

---

### Contributing / Extending

- **Ideas for extensions**
  - Add per‑user filters or “my flowers” view.
  - Add ability to like or comment on flowers.
  - Add seasonal themes or time‑based animations in the garden.
  - Introduce moderation / deletion rules using stricter RLS policies.

Pull requests and forks can follow standard GitHub workflows:
- Branch from `main`.
- Make your changes.
- Run `pnpm lint` and `pnpm build` to ensure things pass.
- Open a PR with a short description of your changes.

---

### License

Specify the license you intend to use here (for example, MIT). If none is specified, you may want to add a `LICENSE` file to clarify how others can use this project.


