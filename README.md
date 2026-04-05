# Nontonin

Platform nonton film domain publik gratis. Streaming langsung dari Internet Archive dengan metadata TMDB.

## Tech Stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS 4**
- **Internet Archive API** — film catalog & video streaming
- **TMDB API** — poster, sinopsis, rating, genre

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd nontonin
npm install
```

### 2. Environment variables

Buat file `.env.local` di root project:

```env
TMDB_API_KEY=your_tmdb_api_key_here
```

Dapatkan TMDB API key gratis di [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

### 3. Run development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

## Halaman

| Route           | Deskripsi                                     |
| --------------- | --------------------------------------------- |
| `/`             | Home — hero film, trending, baru masuk        |
| `/browse`       | Jelajahi — grid film dengan filter & sorting  |
| `/film/[id]`    | Detail film — video player, info, rekomendasi |
| `/search?q=...` | Hasil pencarian                               |

## API Routes

| Route               | Deskripsi                                          |
| ------------------- | -------------------------------------------------- |
| `/api/search?q=...` | Proxy search ke Internet Archive + TMDB enrichment |

## Catatan

- Semua film yang ditampilkan adalah film **domain publik** dari Internet Archive
- TMDB digunakan hanya untuk memperkaya metadata (poster, sinopsis, rating)
- Tanpa TMDB API key, app tetap berfungsi menggunakan metadata dari Internet Archive
