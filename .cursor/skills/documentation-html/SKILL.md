---
name: documentation-html
description: Initialise ou étend la documentation HTML Velyon à la racine (suivi, API, PDF pipeline, changelog). Obligatoire à chaque livraison.
---

# Documentation HTML — Velyon

## Emplacement

`documentation/` à la racine du repo Velyon.

## Structure

```
documentation/
├── index.html
├── changelog.html
├── assets/styles.css
├── api/overview.html
├── api/routes.html
├── features/
├── architecture/overview.html
├── architecture/pdf-pipeline.html
├── database/schema.html
├── accessibility/
├── security/
└── performance/
```

## Workflow

1. Initialiser si absent (index + CSS + nav)
2. Mettre à jour pages touchées + nav + changelog daté
3. Si API : synchroniser `api/routes.html`
4. Si PDF/templates : `architecture/pdf-pipeline.html`
5. Si Prisma : `database/schema.html`
6. Doc accessible (`lang="fr"`, skip link, contraste, clavier)

Agent : `documentation-engineer`.
