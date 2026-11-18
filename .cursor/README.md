# Kit Cursor — Velyon

Kit Spec-Driven (agents + rules + skills) pour le SaaS de génération de chartes graphiques PDF.

## Emplacements

| Rôle | Chemin |
|------|--------|
| Source de vérité | `/Volumes/DDE_Leo/Rules/velyon-cursor-kit/` |
| Projet | `/Users/segalini-briant/Documents/GitHub/Velyon/.cursor/` |

Ancrage : `cahierdescharges.md`.

## Structure

```
.cursor/
├── agents/     # Personas domaine + transverses
├── rules/      # Rules .mdc
├── skills/     # Speckit, stacks, domaine, process
└── README.md
```

## Agents domaine

- `velyon-coordinator`
- `spec-velyon-writer`
- `pdf-brand-book-specialist`
- `logo-assets-specialist`
- `color-contrast-specialist`
- `font-typography-specialist`
- `design-tokens-specialist`
- `stripe-billing-specialist`

## Skills clés

- `velyon-domain`
- `stack-pdf-playwright`
- `stack-nextjs` / `stack-postgresql`
- Speckit (`specify` → `implement`)
- `documentation-html`, `testing-unit-load-perf`, `accessibilite-a11y`

## Sync

```bash
rsync -a /Volumes/DDE_Leo/Rules/velyon-cursor-kit/ \
  /Users/segalini-briant/Documents/GitHub/Velyon/.cursor/ \
  --exclude README.md
# Garder README kit dans Rules ; copier aussi si besoin :
cp /Volumes/DDE_Leo/Rules/velyon-cursor-kit/README.md \
  /Users/segalini-briant/Documents/GitHub/Velyon/.cursor/README.md
```

## Démarrage

1. `/speckit-specify` ou `spec-velyon-writer`
2. `velyon-coordinator` pour orchestrer
3. Ordre CDC : PDF templates → import → wizard → Stripe
