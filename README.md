# 🎬 Anime Daily — Recomendador Diario de Anime

Un recomendador de anime que muestra un anime diferente cada día, seleccionado determinísticamente desde el Top 100 de MyAnimeList.

![Preview](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## ✨ Características

- 📅 **Selección Diaria Determinista**: Mismo anime para todos los usuarios el mismo día
- 🎯 **Top 100**: Datos de los mejores anime de MyAnimeList vía Jikan API
- ⚡ **Cache Local**: Almacenamiento en localStorage para evitar peticiones repetidas
- 🎨 **Diseño Cinematic Dark**: Tema oscuro con acentos en cyan
- ⏱️ **Countdown en Tiempo Real**: Muestra cuándo cambia la recomendación
- 📱 **Responsive**: Funciona en móvil y escritorio
- 🌟 **Animaciones Suaves**: Efectos de entrada y partículas

## 🚀 Uso

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/anime-daily.git
cd anime-daily

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── AnimeCard.tsx       # Tarjeta principal del anime
│   ├── Countdown.tsx       # Reloj hasta medianoche
│   ├── SkeletonLoader.tsx   # Loader animado
│   └── GenreBadge.tsx       # Badges de géneros
├── hooks/
│   └── useDailyAnime.ts    # Hook principal de datos
├── utils/
│   ├── dateUtils.ts         # Utilidades de fecha
│   └── cache.ts            # Cache con localStorage
├── App.tsx
├── main.tsx
└── index.css
```

## 🔧 API

Usa [Jikan API v4](https://jikan.moe/) — API pública y gratuita de MyAnimeList.

## 📝 Algoritmo de Selección

```typescript
// La fecha determina el índice de forma determinista
const date = "2026-03-21";
const digits = date.replace(/-/g, "").split("").map(Number);
// [2, 0, 2, 6, 0, 3, 2, 1]
const sum = digits.reduce((acc, d) => acc + d, 0); // 16
const index = sum % 100; // 16
```

## 📄 Licencia

MIT © 2026
