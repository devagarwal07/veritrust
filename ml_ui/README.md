# VeriTrust+ Minimal UI

A tiny static page to exercise the ML backend endpoints.

## Run locally (PowerShell)

```powershell
cd d:\veritrust\ml_ui
python -m http.server 5500
```

Open http://127.0.0.1:5500 in your browser.

- Set Backend URL to http://127.0.0.1:8000 (default)
- Paste Cloudinary URLs and send requests
- Optional JWT can be provided (when backend auth is enabled)
