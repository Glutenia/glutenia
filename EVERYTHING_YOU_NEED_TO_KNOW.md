# Glutenia: Everything You Need To Know

This is the handover guide for the Glutenia project. Glutenia is a mobile-only gluten-free e-commerce app with:

- A Node.js + Express REST API backend.
- A MongoDB database managed with Mongoose.
- An Expo / React Native Android mobile app.
- A generated APK that can be installed on an Android phone.

The project lives here:

```powershell
C:\Users\yassi\OneDrive\Desktop\glutenia
```

## Project Folders

```text
glutenia/
+-- glutenia-backend/     # Express + MongoDB API
+-- glutenia-mobile/      # Expo React Native mobile app
+-- EVERYTHING_YOU_NEED_TO_KNOW.md
```

There is no web storefront. The intended client is the Android mobile app.

## How The Mobile App Connects To The Backend

The mobile app talks to the backend through HTTP API calls.

Current configured API URL:

```text
https://glutenia.onrender.com/api
```

That value is stored in:

```text
glutenia-mobile/app.json
```

Specifically:

```json
"extra": {
  "apiBaseUrl": "https://glutenia.onrender.com/api"
}
```

The app reads it from:

```text
glutenia-mobile/src/api/client.js
```

The mobile app uses this order:

1. `EXPO_PUBLIC_API_URL`, if set during development.
2. `extra.apiBaseUrl` from `app.json`, used by the APK.
3. The Expo development host IP, if running through Expo.
4. Android emulator fallback: `http://10.0.2.2:5000/api`.
5. Localhost fallback.

Important: an installed APK cannot use `localhost` to reach your laptop. On a real phone, `localhost` means the phone itself. The APK must use your laptop's LAN IP address, such as `192.168.0.144`.

## Quick Start For Phone Testing

Use this when you want the installed APK on your phone to talk to the backend on your laptop.

1. Make sure MongoDB is running on the laptop.

2. Start the backend:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1 -Seed -Start
```

If PowerShell blocks scripts, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 -Seed -Start
```

3. Make sure your phone and laptop are on the same Wi-Fi network.

4. On your phone browser, test this:

```text
http://192.168.0.144:5000/
```

Expected response:

```json
{
  "success": true,
  "data": {
    "name": "Glutenia API",
    "status": "running"
  }
}
```

5. Install the APK:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```

6. Open Glutenia on the phone.

Admin login:

```text
Email: admin@glutenia.tn
Password: admin123
```

Customer users can register inside the app.

## When The Laptop IP Changes

Your laptop IP can change when you switch Wi-Fi networks or restart the router.

For a free setup that does not depend on your laptop IP, use:

```text
FREE_DEPLOYMENT_GUIDE.md
```

That guide explains the Render free backend plus MongoDB Atlas free database setup.

Find the current laptop IP:

```powershell
ipconfig
```

Look for the active Wi-Fi adapter and copy the IPv4 address.

Example:

```text
IPv4 Address . . . . . . . . . . . : 192.168.0.144
```

Then update:

```text
glutenia-mobile/app.json
```

Change:

```json
"apiBaseUrl": "http://192.168.0.144:5000/api"
```

To:

```json
"apiBaseUrl": "http://NEW-IP-HERE:5000/api"
```

Then rebuild the APK:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
npm run build:apk
```

The rebuilt APK will be copied to:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```

Install the new APK on the phone.

## Development Mode Without Rebuilding APK

For faster development, use Expo instead of building an APK every time.

Start backend first:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1 -Start
```

Start mobile app with a custom API URL:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
.\run.ps1 -Start -ApiUrl http://192.168.0.144:5000/api
```

Then scan the Expo QR code with Expo Go on the phone.

In Expo development mode, the `-ApiUrl` value can be changed without rebuilding an APK.

In installed APK mode, the API URL is baked into the app and requires rebuilding.

## Backend

Backend folder:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
```

Tech stack:

- Node.js 20+
- Express 4
- MongoDB
- Mongoose 8
- JWT auth with `jsonwebtoken`
- Password hashing with `bcryptjs`
- CORS with `cors`
- Environment variables with `dotenv`
- Request validation with `express-validator`
- Tests with Node's built-in test runner and `supertest`

### Backend Environment

The backend uses:

```text
glutenia-backend/.env
```

Template:

```text
glutenia-backend/.env.example
```

Expected values:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/glutenia
TEST_MONGO_URI=mongodb://127.0.0.1:27017/glutenia_test
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=
```

Never publish real secrets from `.env`.

### Backend Commands

Check dependencies, syntax, audit, tests, and smoke test:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1
```

Seed the database:

```powershell
.\run.ps1 -Seed
```

Start the backend:

```powershell
.\run.ps1 -Start
```

Seed and start:

```powershell
.\run.ps1 -Seed -Start
```

Manual npm commands:

```powershell
npm install
npm run check
npm test
npm run seed
npm run dev
```

### Seed Data

The seed script:

```text
glutenia-backend/src/seed/seed.js
```

It clears users and products, then creates:

Admin:

```text
admin@glutenia.tn / admin123
```

Products:

- Pain sans gluten
- Pates de riz
- Biscuits au quinoa
- Farine de mais
- Gateau au chocolat GF
- Crackers de sarrasin

### Backend Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

### Main API Routes

Health check:

```http
GET /
```

Auth:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

Products:

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Orders:

```http
POST /api/orders
GET  /api/orders/my
GET  /api/orders
GET  /api/orders/:id
```

Users:

```http
GET /api/users
GET /api/users/:id/orders
```

Protected routes require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Admin-only routes require a user with:

```json
{
  "role": "admin"
}
```

## Mobile App

Mobile folder:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
```

Tech stack:

- Expo SDK 53
- React Native 0.79
- React 19
- React Navigation
- AsyncStorage
- Expo vector icons
- Expo asset/font handling

This project uses Expo SDK 53 because the current local Node version is compatible with it. Newer Expo versions require a newer Node patch version.

### Mobile Commands

Check dependencies and backend reachability:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
.\run.ps1 -ApiUrl http://192.168.0.144:5000/api
```

Start Expo:

```powershell
.\run.ps1 -Start -ApiUrl http://192.168.0.144:5000/api
```

Build APK:

```powershell
npm run build:apk
```

Run Expo dependency check:

```powershell
npm run check
```

Run Expo Doctor:

```powershell
npm run doctor
```

### APK

Current APK output:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```

Android package name:

```text
com.glutenia.mobile
```

Current app version:

```text
1.0.1
```

Current Android version code:

```text
2
```

The APK uses the Glutenia logo assets from:

```text
glutenia-mobile/assets/
```

The asset generation script is:

```text
glutenia-mobile/scripts/generate-brand-assets.js
```

### Mobile App Screens

Customer flow:

- Login
- Register
- Home product catalog
- Product detail
- Cart
- Checkout
- Order success
- My orders
- Account

Admin flow:

- Admin dashboard
- Product list
- Create product
- Edit product
- Delete product
- Admin orders
- Account

### Authentication Flow

1. User logs in or registers.
2. Backend returns a JWT and user object.
3. Mobile app stores the token with AsyncStorage.
4. Protected API requests send:

```http
Authorization: Bearer TOKEN
```

5. Backend verifies the token in `verifyToken.js`.
6. Admin routes also pass through `isAdmin.js`.

## How Orders Work

1. Customer adds products to the local mobile cart.
2. Customer enters checkout address.
3. Mobile sends items and address to:

```http
POST /api/orders
```

4. Backend loads the real products from MongoDB.
5. Backend calculates the total server-side.
6. Backend creates the order with status `confirmed`.
7. Backend clears the user's saved cart record.

The backend does not trust client-side totals.

## Troubleshooting

### App opens but products do not load

Most likely the phone cannot reach the backend.

Check:

1. Backend is running.
2. Phone and laptop are on the same Wi-Fi.
3. Phone browser can open:

```text
http://192.168.0.144:5000/
```

4. Windows Firewall is not blocking Node.js.
5. `glutenia-mobile/app.json` has the correct laptop IP.
6. APK was rebuilt after changing the IP.

### App crashes immediately

Use the newest APK:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```

The release crash fix added `expo-font` and conservative Android runtime settings.

If it still crashes, collect the phone crash summary or use Android logcat with:

```powershell
C:\Android\Sdk\platform-tools\adb.exe logcat
```

### Backend does not start

Check MongoDB first.

Default MongoDB URL:

```text
mongodb://127.0.0.1:27017/glutenia
```

Then run:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1
```

The runner checks Node.js, npm, `.env`, MongoDB reachability, dependencies, syntax, audit, tests, and server health.

### APK still uses old API URL

Installed APKs do not read your changed `app.json` at runtime. Rebuild:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
npm run build:apk
```

Then reinstall:

```text
Glutenia.apk
```

### Login fails

Check that the database has been seeded:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1 -Seed
```

Then use:

```text
admin@glutenia.tn
admin123
```

## Production Notes

For real production use, do these before release:

1. Deploy the backend to a real server with HTTPS.
2. Use MongoDB Atlas or a managed MongoDB database.
3. Replace the APK API URL with the production HTTPS URL.
4. Set a strong `JWT_SECRET`.
5. Restrict CORS in production using `CORS_ORIGIN`.
6. Sign the APK with a real release keystore, not a debug key.
7. Add payment integration if this will become a real store.
8. Add stock decrement logic after orders.
9. Add image upload storage for product images.
10. Add password reset and email verification if needed.

## What Is Not Included Yet

The app currently focuses on the working e-commerce flow. These are not implemented yet:

- Online payment.
- Push notifications.
- Real shipping provider integration.
- Password reset emails.
- Product image upload to cloud storage.
- Admin analytics dashboard.
- Public web storefront.
- App Store or Play Store deployment pipeline.

## Mental Model

Think of the project like this:

```text
Android phone
  |
  | HTTP requests to http://LAPTOP-IP:5000/api
  v
Express backend
  |
  | Mongoose models
  v
MongoDB database
```

The phone never connects directly to MongoDB. It only talks to the Express API.

The Express API is the gatekeeper for:

- Login/register
- Product data
- Order creation
- Admin permissions
- Database reads and writes

The mobile app is the user interface.

## Best Daily Workflow

For normal testing:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1 -Seed -Start
```

Then install/open:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```

For active development:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-backend
.\run.ps1 -Start
```

In another PowerShell window:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
.\run.ps1 -Start -ApiUrl http://192.168.0.144:5000/api
```

For shipping a new Android build:

```powershell
cd C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile
npm run build:apk
```

Then share:

```text
C:\Users\yassi\OneDrive\Desktop\glutenia\glutenia-mobile\Glutenia.apk
```
