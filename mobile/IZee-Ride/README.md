# Leftover App – Full Stack Starter

This is a complete starter kit for the Leftover app, a mobile application for donating leftover money to causes. It includes:

- **Frontend:** React Native (TypeScript) with NativeWind/Tailwind CSS, React Navigation, QR code scanning, and camera integration.
- **Backend:** ASP.NET Core Web API (.NET 8) with EF Core (code-first), SQL Server, JWT authentication, and Swagger.

## Prerequisites

1. **Node.js 18+** and **JDK 17** (for React Native)
2. **.NET 8 SDK**
3. **SQL Server** (localdb or full instance)
4. **Android Studio** (for Android emulator)
5. **Visual Studio Code** (recommended)

## Step 1: Backend Setup

### 1.1 Install .NET Dependencies

Navigate to the backend directory:

```bash
cd backend/Leftover.Api
```

Restore packages:

```bash
dotnet restore
```

### 1.2 Set Up Database

Update the connection string in `appsettings.json` if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=LeftoverDb;Trusted_Connection=True"
}
```

Create and apply migrations:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 1.3 Run the Backend

```bash
dotnet run
```

The API will be available at `https://localhost:7199` (or check the console output). Swagger UI at `https://localhost:7199/swagger`.

## Step 2: Frontend Setup

### 2.1 Install Dependencies

Navigate to the frontend directory:

```bash
cd frontend
```

Install Node.js packages:

```bash
npm install
```

### 2.2 Configure Android Environment

Ensure Android SDK is installed and environment variables are set:

- `ANDROID_HOME`: Path to Android SDK
- Add to PATH: `%ANDROID_HOME%\platform-tools` and `%ANDROID_HOME%\emulator`

### 2.3 Start Metro Bundler

```bash
npm start
```

### 2.4 Run on Android Emulator

In a new terminal:

```bash
npm run android
```

This will build and install the app on your connected Android device or emulator.

## Step 3: Testing the App

1. **Onboarding:** Swipe through the 3 onboarding screens.
2. **Authentication:** Choose BVN login (Nigeria) or BankID (Sweden), or sign up with phone.
3. **Home Screen:** View wallet balance, browse causes, send/receive leftovers.
4. **QR Code:** Generate QR for receiving, scan for sending.
5. **Wallet:** Load money via bank transfer, withdraw funds.
6. **Causes:** View and create new causes.

## Project Structure

```
/
├── frontend/
│   ├── src/
│   │   ├── api/          # API client and endpoints
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Utilities (dimensions, etc.)
│   │   ├── navigation/   # App navigation
│   │   └── screens/      # Screen components
│   ├── App.tsx           # Main app component
│   └── package.json
└── backend/
    └── Leftover.Api/
        ├── Controllers/  # API controllers
        ├── Models/       # Entity models
        ├── Services/     # Business logic
        ├── AppDbContext.cs
        └── Program.cs
```

## Key Features Implemented

- **Authentication:** BVN, BankID, and phone signup/login
- **Wallet Management:** Load, withdraw, balance tracking
- **Cause Management:** Create and view donation causes
- **Leftover Transactions:** Send/receive via QR codes
- **QR Code Integration:** Generate and scan QR codes
- **Responsive UI:** Tailwind CSS with NativeWind

## Next Steps

1. **Customize UI:** Replace placeholder images and adjust colors/fonts.
2. **Add Real Integrations:** Implement actual BVN/BankID verification.
3. **Testing:** Add unit and integration tests.
4. **Deployment:** Set up CI/CD for backend and app stores for frontend.

## Troubleshooting

- **Metro bundler issues:** Clear cache with `npx react-native start --reset-cache`
- **Android build fails:** Ensure JDK 17 and Android SDK are correctly installed
- **Database connection:** Verify SQL Server is running and connection string is correct
- **Permissions:** Grant camera permissions for QR scanning

Enjoy building your Leftover app! 🚀
