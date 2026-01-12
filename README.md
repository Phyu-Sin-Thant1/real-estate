# 🏠 Korean Real Estate Portal

A premium Korean real estate portal built with modern web technologies, featuring sophisticated design aesthetics and professional user experience.

## ✨ Features

### 🗺️ **Interactive Map Interface**
- **Premium Leaflet Integration** with CARTO Positron tiles for professional appearance
- **Custom Korean Portal Markers** with color-coded pricing (월세, 전세, 매매)
- **Unified Search & Filter Control Center** with floating design
- **Professional Zoom Controls** with refined styling and smooth interactions

### 🏠 **Property Listings**
- **Immersive Photography** with navigation overlays and indicators
- **Premium Card Design** with layered shadows and sophisticated styling
- **Price-First Hierarchy** with prominent Soft Teal pricing display
- **2-Column Detail Grid** for efficient information scanning

### 🎨 **Design System**
- **Korean Portal Aesthetic** matching DaBang, Zigbang standards
- **Premium Color Palette**: Deep Royal Blue (#1A237E), Soft Teal (#00BCD4)
- **Sophisticated Hover Effects** with scale transforms and smooth transitions
- **Responsive Split-Screen Layout** (65% map, 35% listings)

## 🛠️ Technology Stack

- **React 18** - Modern React with functional components and hooks
- **Vite** - Fast build tool with hot module replacement
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **Leaflet** - Interactive map library with react-leaflet integration
- **React Router** - Client-side routing for SPA navigation

## 🚀 Getting Started

### Prerequisites
- Node.js v22.13.1 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone http://202.131.248.107:8899/mytmon123/real-estate.git
   cd real-estate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Admin Access

The admin dashboard (`/admin`) is protected by a lightweight client-side auth layer tailored for demos and local development.

1. **Create a `.env.local` file** at the project root (next to `package.json`) and set your preferred admin credentials:
   ```bash
   VITE_ADMIN_EMAIL=admin@tofu.com
   VITE_ADMIN_PASSWORD=Admin123!
   VITE_ADMIN_NAME=TOFU Admin
   ```
   If these variables are not provided, the values shown above are used as the defaults.
2. **Start the dev server** with `npm run dev`.
3. **Log in at `/login`** with the email and password you configured. You will be redirected to the dashboard once authenticated.
4. Your session persists in the browser's `localStorage`. Use the `로그아웃` button in the dashboard header or the site header to end the session.

> ⚠️ This demo auth layer is not meant for production. Integrate a proper backend identity provider before deploying.

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx       # Navigation header
│   ├── Footer.jsx       # Site footer
│   ├── InteractiveMap.jsx   # Enhanced Leaflet map
│   ├── MapErrorBoundary.jsx # Error handling
│   └── ...
├── pages/              # Route components
│   ├── HomePage.jsx    # Landing page
│   ├── MapPage.jsx     # Main map interface
│   └── ...
├── App.jsx            # Main app component
├── main.jsx          # Application entry point
└── index.css         # Global styles
```

## 🎯 Key Components

### InteractiveMap.jsx
- Custom Korean portal markers with smart color coding
- CARTO Positron tiles for professional map appearance
- Enhanced property popups with rich information display

### MapPage.jsx
- Unified search and filter control center
- Premium property listing cards with immersive photography
- Professional split-screen layout with independent scrolling

## 🎨 Design Specifications

### Color Palette
- **Primary**: Deep Royal Blue (#1A237E)
- **Secondary**: Soft Teal (#00BCD4)
- **Accent**: Vibrant Orange (#FF6F00)
- **Neutral**: Gray scale variants

### Typography
- **Font Family**: 'Pretendard', system-ui, sans-serif
- **Korean Text**: Proper font weight and character spacing
- **Hierarchy**: Bold pricing, semi-bold titles, regular details

### Interaction Design
- **Hover Effects**: Scale transforms with 200ms transitions
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions throughout interface

## 📚 Documentation

Detailed documentation is available in the project:
- `KOREAN_PORTAL_MAP_ENHANCEMENT.md` - Map styling and localization
- `PROPERTY_CARDS_REDESIGN.md` - Premium listing card design
- `UNIFIED_SEARCH_CONTROL_CENTER.md` - Search interface design
- `FIXED_MAP_CONTROLS_DESIGN.md` - Map utility controls

## 🌟 Features Showcase

- **Real Seoul Properties**: 6 sample properties across key locations
- **Interactive Markers**: Click for detailed property information
- **Smart Filtering**: Deal type, room type, and location filters
- **Responsive Design**: Works seamlessly across devices
- **Korean Localization**: Proper Korean text rendering and UX patterns

## 🔧 Development

### Key Dependencies
- `react-leaflet` - React components for Leaflet maps
- `leaflet` - Interactive map library
- `react-router-dom` - Client-side routing

### Build Configuration
- **Vite Config**: Optimized for fast development and builds
- **TailwindCSS**: Custom configuration with Korean portal theme
- **PostCSS**: Processing for modern CSS features

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for the Korean real estate market**
