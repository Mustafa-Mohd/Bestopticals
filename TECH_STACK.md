# SpectsMart Clone Tech Stack

This project is built using a modern, scalable, and easy-to-manage tech stack.

## 🎨 Frontend (Client Side)
- **Framework**: React.js (v18+)
- **Build Tool**: Vite (for lightning-fast development)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React & FontAwesome 6
- **Styling**: CSS3 (Modular Vanilla CSS)

## ⚙️ Backend (Server Side)
- **Environment**: Node.js
- **Framework**: Express.js
- **Features**:
  - RESTful API design.
  - CRUD operations for dynamic product management.
  - **Middleware**: 
    - `cors` for cross-origin access.
    - `multer` for high-performance file/image uploads.
    - `express.static` for serving frontend and user-uploaded media.

## 💾 Database & Storage
- **Type**: Persistent File-based Database (JSON).
- **Storage**: `backend/data/products.json`.
- **Media Storage**: Local `backend/uploads` directory for product images.
- **Data Persistence**: Uses `fs` (File System) module to ensure all changes made via the Admin Panel are saved permanently.

## 🛠️ Admin CMS (Content Management System)
- **User-Friendly**: Designed for "non-IT" data entry users.
- **Drag & Drop**: Advanced drag-and-drop image upload zone.
- **Features**:
  - Dashboard with key statistics (Total Products, Stock status).
  - Detailed product forms (Price, Category, Brand, Stock, Gender, etc.).
  - Instant updates to the live frontend.

## 🚀 Deployment / Running
- **Server**: `npm start` or `npm run dev` (via Nodemon).
- **Access**: 
  - Storefront: `http://localhost:5000`
  - Admin Panel: `http://localhost:5000/admin.html`
