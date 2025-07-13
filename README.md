# DevTools - Developer Tools Collection

A comprehensive collection of developer tools built with Vue 3, TypeScript, and Tailwind CSS. This project provides a clean, modern interface for various development utilities while maintaining high performance and accessibility standards.

## ✨ Features

- **🌙 Dark Mode**: Built-in dark mode support with system preference detection
- **🌍 Multi-language**: Support for English and Chinese languages
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **🔒 Privacy First**: All processing happens locally - no data leaves your browser
- **⚡ High Performance**: Optimized build with code splitting and lazy loading
- **🎨 Modern UI**: Clean and intuitive interface with smooth animations
- **♿ Accessibility**: Built with accessibility best practices

## 🛠️ Available Tools

### Development Tools
- **JSON Formatter**: Format, validate, and beautify JSON data with syntax highlighting
- **Base64 Tool**: Encode and decode Base64 strings with file support
- **MD5 Tool**: Generate MD5 hashes for text and files
- **URL Tool**: Encode and decode URLs and components
- **JWT Tool**: Decode and validate JSON Web Tokens
- **UUID Generator**: Generate version 4 UUIDs

### Time Tools
- **Timestamp Converter**: Convert between Unix timestamps and human-readable dates

### Color Tools
- **Color Picker**: Pick colors and get values in different formats
- **Color Converter**: Convert colors between HEX, RGB, HSL, and HSV formats

### Image Tools
- **SVG Tool**: Optimize, minify, and preview SVG files
- **QR Code Generator**: Generate QR codes with customization options
- **Barcode Generator**: Generate various types of barcodes

### Location Tools
- **GeoHash Tool**: Encode and decode geographic coordinates

### Content Tools
- **Markdown Preview**: Preview Markdown with syntax highlighting
- **Mermaid Diagram**: Create and preview Mermaid diagrams

## 🚀 Tech Stack

- **Vue 3**: Progressive JavaScript framework with Composition API
- **TypeScript**: Type-safe JavaScript with excellent IDE support
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Pinia**: State management library for Vue
- **Vue Router**: Official router for Vue.js
- **Vue I18n**: Internationalization plugin for Vue.js
- **Vite**: Next-generation frontend tooling
- **Heroicons**: Beautiful hand-crafted SVG icons

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dev-tools
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Project Structure

```
src/
├── components/          # Vue components
│   ├── common/         # Shared components
│   └── layout/         # Layout components
├── views/              # Page components
│   └── tools/          # Tool-specific views
├── stores/             # Pinia stores
├── router/             # Vue Router configuration
├── locales/            # Internationalization files
├── styles/             # CSS and styling
└── utils/              # Utility functions
```

### Adding New Tools

1. Create a new Vue component in `src/views/tools/`
2. Add the route to `src/router/index.ts`
3. Add navigation entry to `src/components/layout/Sidebar.vue`
4. Add translations to `src/locales/en.json` and `src/locales/zh.json`

## 🏗️ Build & Deployment

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory. The build is optimized with:
- Code splitting for better loading performance
- Tree shaking to eliminate unused code
- Minification and compression
- Source maps removed for security

### Security Features

- **No Source Maps**: Source maps are removed in production to prevent reverse engineering
- **Local Processing**: All tools work offline and process data locally
- **Content Security Policy**: Optimized for security best practices
- **Console Removal**: Console logs are stripped in production builds

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for developers