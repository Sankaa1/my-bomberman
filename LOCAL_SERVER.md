# 🚀 Guide de lancement local

## Avec Python 3.x

```bash
cd d:\Bomber
python -m http.server 8000
```

Puis ouvrir: `http://localhost:8000`

## Avec Node.js (http-server)

```bash
npm install -g http-server
cd d:\Bomber
http-server
```

## Avec Live Server (VS Code)

1. Installer l'extension "Live Server"
2. Clic droit sur `index.html` → "Open with Live Server"

## Avec VS Code devcontainer

```bash
code d:\Bomber
```

Puis ouvrir terminal PowerShell et lancer:
```powershell
python -m http.server 8000
```
