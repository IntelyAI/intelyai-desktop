# IntelyAI Desktop

Aplicacion de escritorio para IntelyAI. Envuelve la app web de produccion en una ventana nativa usando Electron.

## Requisitos

- Node.js 18+
- npm

## Instalacion

```bash
npm install
```

## Desarrollo

```bash
npm start
```

## Build

```bash
# Windows (.exe)
npm run build:win

# macOS (.dmg)
npm run build:mac

# Linux (.AppImage)
npm run build:linux

# Todas las plataformas
npm run build:all
```

Los instaladores se generan en la carpeta `dist/`.

## Configuracion

Edita `config.js` para cambiar la URL de la app:

- **Produccion**: URL de deploy
- **Desarrollo**: `http://localhost:3000`
