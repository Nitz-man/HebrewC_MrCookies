# HebrewC Online Deployment

Recommended host: Render, as one Node web service that serves both the API and React website.

## Domain

Use:

- `hebrewc.io`
- `www.hebrewc.io`

Domain names are case-insensitive, so `www.HebrewC.io` will display/work as `www.hebrewc.io` in browsers and DNS tools.

## Deploy On Render

1. Push this repository to GitHub.
2. In Render, create a new Blueprint and select this repository.
3. Render will read `render.yaml`.
4. Deploy the `hebrewc` web service.
5. After deploy, open the generated `*.onrender.com` URL and test login.

The blueprint includes:

- Node web service
- Frontend build command
- Backend start command
- Generated `JWT_SECRET`
- Persistent disk mounted at `/var/data`
- `DATA_DIR=/var/data`, so `db.json` persists online

## Custom Domain Setup

In the Render service dashboard:

1. Add custom domain `www.hebrewc.io`.
2. Add custom domain `hebrewc.io`.
3. In the domain registrar DNS settings:
   - Point `www` to Render using the CNAME value Render shows.
   - Point the root/apex domain to Render using the DNS record Render shows.
4. Verify both domains in Render.

Render provides HTTPS certificates automatically after DNS verification.

## Local Commands

Build frontend:

```bash
cd frontend
npm run build
```

Start production server locally:

```bash
cd backend
npm start
```

Then open:

```text
http://localhost:5000
```
