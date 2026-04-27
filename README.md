# ElectIQ Free — 100% Free, No API Keys, No Backend

A fully static React app that helps citizens understand the election process.
Deploy once to Vercel/Netlify and it's free forever for everyone.

## ✅ What's free (everything)

| Feature | Solution | Cost |
|---|---|---|
| AI chat responses | Smart rule-based engine (built-in) | Free forever |
| Election data | Hardcoded JSON (5 countries) | Free forever |
| Translation | MyMemory API (no key needed) | Free forever |
| Quiz scores | Browser localStorage | Free forever |
| Hosting | Vercel / Netlify | Free forever |
| Auth | None needed | Free forever |

**Zero API keys. Zero backend. Zero cost.**

## Quick Start (local)

```bash
cd electiq-free
npm install
npm run dev        # http://localhost:5173
```

## Deploy to Vercel (free, 2 minutes)

```bash
npm install -g vercel
npm run build
vercel --prod
```

Or connect your GitHub repo at vercel.com — auto-deploys on every push.

## Deploy to Netlify (free, 2 minutes)

```bash
npm run build
# Drag the dist/ folder to app.netlify.com/drop
```

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Deploy to GitHub Pages (free)

1. Push to GitHub
2. Go to Settings → Pages → Source: GitHub Actions
3. Create `.github/workflows/deploy.yml` (see below)

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Adding More Countries

Edit `src/data/electionData.ts` — add a new entry following the existing pattern.
Then add it to `src/components/layout/MainLayout.tsx` COUNTRIES array.

## Adding More AI Responses

Edit `src/utils/smartEngine.ts`:
1. Add keywords to the `PATTERNS` array
2. Add responses to the `RESPONSES` object
3. Country-specific responses use the `ResponseMap` type

## Running Tests

```bash
npm test
```
