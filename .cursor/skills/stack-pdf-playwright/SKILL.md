---
name: stack-pdf-playwright
description: Pipeline PDF Velyon via Playwright HTML/CSS. Utiliser pour templates brand book, aperçu fidèle, file BullMQ, embed polices.
---

# Stack PDF Playwright — Velyon

1. Appliquer rule `074-pdf-brand-book`.
2. Templates HTML/CSS paginés A4 ; injection tokens CSS de marque.
3. Même pipeline pour aperçu et export PDF.
4. Embarquer WOFF2 / polices client dans le contexte Chromium.
5. Worker BullMQ : timeouts, concurrence limitée, retries, filigrane freemium.
6. Sections activables selon Guideline ; pas de hardcode couleur/police marque.
7. Tests : rendu avec police custom ; snapshots HTML critiques si utile.
8. Invoquer `pdf-brand-book-specialist` pour les changements structurants.
