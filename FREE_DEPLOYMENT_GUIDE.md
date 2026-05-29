# Glutenia Free Deployment Guide

This guide moves Glutenia away from your changing PC IP.

Final free setup:

```text
Android APK -> Render free backend -> MongoDB Atlas free database
```

After this, the app uses this stable URL:

```text
https://glutenia.onrender.com/api
```

## What I Prepared

These files are now ready:

- `render.yaml` - Render free web service config.
- `glutenia-backend/.env.production.example` - production env template.
- `.gitignore` - keeps secrets, dependencies, logs, and APK/archive files out of git.
- This guide.

## Step 1: Create Free MongoDB Atlas Database

1. Go to MongoDB Atlas.
2. Create a free M0 cluster.
3. Create a database user and password.
4. In Network Access, allow Render to connect.

For the easiest free demo setup, add this IP allowlist entry:

```text
0.0.0.0/0
```

That allows any server to connect if it has the database username/password. It is convenient for free hosting because Render free services do not give you a stable outbound IP.

5. Copy the MongoDB connection string.

It should look like:

```text
mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/?retryWrites=true&w=majority&appName=glutenia
```

Replace `USERNAME`, `PASSWORD`, and the cluster host with your real values.

The backend uses `MONGO_DB_NAME=glutenia`, so it still writes to the `glutenia` database even if Atlas or MongoDB Compass gives you a URI with no `/glutenia` path.

## Step 2: Put Project On GitHub

Render works best by deploying from GitHub.

From:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia
```

Initialize git if needed:

```powershell
git init
git add .
git commit -m "Prepare Glutenia for free deployment"
```

Then create a GitHub repo and push:

```powershell
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

For this repo, the remote is already:

```text
https://github.com/Glutenia/glutenia.git
```

So the important command is:

```powershell
git push -u origin main
```

Do not commit real `.env` secrets. The `.gitignore` now protects them.

## Step 3: Deploy Backend On Render Free

1. Go to Render.
2. Create a new Blueprint or Web Service from your GitHub repo.
3. If Render detects `render.yaml`, use it.
4. Set the required environment variables:

```text
MONGO_URI=your MongoDB Atlas connection string
MONGO_DB_NAME=glutenia
JWT_SECRET=a long random secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=
```

Render may generate `JWT_SECRET` automatically because `render.yaml` asks it to.
Render supplies `PORT` automatically.

5. Deploy.

Your Render URL is:

```text
https://glutenia.onrender.com
```

Test this in a browser:

```text
https://glutenia.onrender.com/
```

Expected:

```json
{
  "success": true,
  "data": {
    "name": "Glutenia API",
    "status": "running"
  }
}
```

## Step 4: Seed The Free Database

You need the admin user and sample products in the production MongoDB database.

Option A, Render Shell:

```bash
npm run seed
```

Option B, run from your PC using the Atlas URI temporarily:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
$env:MONGO_URI="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/glutenia?retryWrites=true&w=majority"
npm run seed
Remove-Item Env:MONGO_URI
```

Admin login after seeding:

```text
admin@glutenia.tn
admin123
```

## Step 5: Point The APK At Render

Open:

```text
glutenia-mobile/app.json
```

The app is configured to use:

```json
"apiBaseUrl": "https://glutenia.onrender.com/api"
```

Then rebuild:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
npm run build:apk
```

Send this file:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```

Now the APK no longer depends on your PC IP.

## Free Tier Limits

Render free backend can sleep after inactivity. First login or product load may take a little while while it wakes up.

MongoDB Atlas free M0 is enough for demos, school projects, and light testing. It is not meant for heavy production traffic.

## Quick Checklist

- MongoDB Atlas free cluster created.
- Atlas `MONGO_URI` copied.
- Render `MONGO_DB_NAME=glutenia` set.
- Project pushed to GitHub.
- Render service deployed.
- Render health URL works.
- Production database seeded.
- `glutenia-mobile/app.json` uses Render `/api` URL.
- APK rebuilt and installed.

## The Important Rule

For installed APKs:

```text
Change API URL -> rebuild APK -> reinstall APK
```

For Expo development:

```text
Change -ApiUrl parameter -> restart Expo
```
