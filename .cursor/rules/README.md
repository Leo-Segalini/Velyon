# Rules Cursor — Velyon

Rules dérivées de `cahierdescharges.md` pour créer le SaaS de génération de chartes graphiques PDF.

Voir aussi `.cursor/agents/` et `.cursor/skills/` (kit complet).

## Always apply

| Fichier | Rôle |
|---------|------|
| `000-persona-workflow-velyon` | Persona, ordre CDC, DoD |
| `010-accessibilite-wcag` | A11y UI + contrastes palette |
| `020-clean-code-discipline` | Qualité code |
| `030-documentation-html` | Doc HTML racine obligatoire |
| `040` / `041` | Sécurité + uploads SVG/fonts/PDF/RGPD |
| `070-velyon-domain` | Domaine métier / Prisma / Stripe |
| `180-postgresql-prisma` | Schéma BDD |
| `300-spec-driven-sdd` | Specs avant code |

## Par zone (globs)

| Fichier | Zone |
|---------|------|
| `071-logo-assets` | Import / variantes logo |
| `072-couleurs-contrastes` | Palette & WCAG |
| `073-polices-typo` | Fonts & échelle |
| `074-pdf-brand-book` | Templates Playwright PDF |
| `075-stripe-billing` | Freemium / Stripe |
| `120-nextjs-react-tailwind` | Front Next |
| `200-tests-qualite` | Tests CDC |
| `210-tests-charge-performance` | Charge PDF / uploads |
| `900-git-commits` | Git sur demande |

## Démarrage recommandé

1. Moteur templates PDF (variables CSS)
2. Import logo / couleurs / polices
3. Assistant 6 étapes
4. Auth + Stripe
5. Doc `documentation/` + démo brand
