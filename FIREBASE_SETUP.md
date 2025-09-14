# 🔥 Firebase Setup Guide for EcoTrack AI

## 📋 **Quick Setup Steps**

### 1. **Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it **"EcoTrack AI"** 
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### 2. **Enable Authentication**
1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable:
   - ✅ **Email/Password**
   - ✅ **Google** (click Enable → choose support email)

### 3. **Create Firestore Database**
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for now)
4. Select your region (closest to your users)

### 4. **Get Configuration**
1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"**
3. Click **"Web app"** (</> icon)
4. Name it **"EcoTrack AI Web"**
5. **Copy the config object**

### 5. **Update Firebase Config**
Replace the config in `/src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

### 6. **Set Firestore Security Rules**
Go to **Firestore Database → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own activities
    match /activities/{activityId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 7. **Deploy and Test**
1. Update your config
2. Build and deploy: `npm run build && git push`
3. Test authentication on your live site

## 🎯 **What This Gives You**

### ✅ **User Authentication**
- Google Sign-in (one-click)
- Email/Password registration
- Secure session management
- Profile management

### ✅ **Data Persistence** 
- Activities saved to cloud database
- Data survives page refreshes
- Accessible from any device
- Real-time synchronization

### ✅ **User Profiles**
- Personal settings (daily carbon budget)
- Statistics tracking (streak, level)
- Activity history
- Progress analytics

### ✅ **Security**
- Each user only sees their data
- Secure authentication
- Protected API endpoints
- GDPR compliant

## 🆓 **Cost**

Firebase is **FREE** for most apps:
- **Authentication**: 50,000 users/month free
- **Firestore**: 50,000 reads/day free  
- **Hosting**: 10GB storage free

Perfect for your MVP and early growth! 🚀

## 🔧 **Alternative: Supabase (Also Free)**

If you prefer SQL databases, Supabase is another excellent option:
- PostgreSQL database
- Built-in authentication  
- Real-time subscriptions
- Also free tier available

## 📞 **Need Help?**

1. Check [Firebase Documentation](https://firebase.google.com/docs)
2. Use [Firebase Console](https://console.firebase.google.com) 
3. Test auth flow in your browser dev tools

Your EcoTrack AI will be production-ready with user accounts! 🌱✨