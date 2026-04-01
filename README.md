# Intely Desktop

Aplicacion de escritorio para Intely. Envuelve la app web de produccion en una ventana nativa usando Electron.

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

## CI / Release en GitHub

Cada **push a `main`** dispara GitHub Actions: se buildea en paralelo Windows, macOS y Linux y se publica un **Release** con los tres instaladores. No hace falta subir binarios al repo ni crear tags a mano.

- El tag del release se genera solo: `v{version}-{run_number}` (la `version` sale de `package.json`).
- Para que el nombre refleje un cambio de version semver, actualiza el campo `version` en `package.json` antes del merge/push.
- Las descargas desde la landing usan `releases/latest/download/...` y apuntan al ultimo release publicado.

## Configuracion

Edita `config.js` para cambiar la URL de la app:

- **Produccion**: URL de deploy
- **Desarrollo**: `http://localhost:3000`
