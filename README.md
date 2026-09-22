# Jonathan Wu — Portfolio

**Live: [look-at-jonathans-portfolio.vercel.app](https://look-at-jonathans-portfolio.vercel.app/)**

My personal portfolio site: a single-page profile with experience, projects, and
skills, plus a few things that keep it alive — a Living Dashboard pulling in
GitHub activity and Spotify plays, a Discogs record collection, a Pokémon card
showcase, and a guestbook/song board visitors can post to.

Built with Next.js (App Router), Tailwind CSS, and Drizzle ORM on Neon Postgres,
deployed on Vercel.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see it.

Copy `.env.example` to `.env.local` and fill in the values (Neon connection
string, Spotify/GitHub/Discogs API credentials) to run the live data sections
locally. `scripts/setup-discogs.sh` walks through the Discogs credential setup.

## Deploying

Deploys automatically to Vercel on push to `main`.
