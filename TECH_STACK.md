# Updated Project Tech Stack

This document outlines the modernized technology stack for the SpectsMart / Best Vision Opticals platform.

## 🎨 Frontend (Premium Experience)
- **Framework**: React.js (v18+)
- **Build System**: Vite
- **Styling**: Modular Vanilla CSS (Modern CSS Transitions, Glassmorphism, Responsive Grid/Flexbox)
- **AR Library**: MediaPipe Face Mesh (Real-time virtual try-on)
- **Interactivity**: Snapchat-style filter processing for realistic eyewear overlays.

## ⚙️ Backend (Cloud-Native)
- **Platform**: **Supabase**
- **Infrastructure**: Edge Functions (for server-side logic like WhatsApp API triggers)
- **Security**: Supabase Auth (Integrated JWT-based authentication)

## 💾 Database & Storage
- **Primary Database**: **PostgreSQL** (Managed by Supabase)
- **Architecture**: Relational schema for Products, Orders, Users, and Audit Logs.
- **Media Storage**: Supabase Storage Buckets (Global CDN enabled for high-speed image loading).

## 🏢 Administrative CMS
- **Product Management**: Multi-category CMS (Anyone authorized can add/edit products).
- **User Insights**: Admin view for user login information and account management.
- **WhatsApp Integration**: Integrated communication system using WhatsApp Business API / Web Links.
- **Audit Logs**: Comprehensive system to track every change made in the admin panel.

## 🛡️ Security & Performance
- **Data Integrity**: Enforced via PostgreSQL foreign keys and constraints.
- **Authentication**: Secure Login/Signup with persistent sessions. 
- **Optimized Assets**: Lazy loading and optimized image formats (WebP) for premium performance.
