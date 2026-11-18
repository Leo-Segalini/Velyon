---
name: testing-unit-load-perf
description: Stratégie tests unitaires, charge et performance J’accuse. Utiliser pour Jest/Vitest, k6/Artillery, budgets Web Vitals et CI.
---

# Tests unitaires, charge & performance

## Unitaires

1. Lire rule `210-tests-unitaires` et conventions du repo cible.
2. Couvrir validation upload, guards, codes suivi, géo helpers, DTO/Zod.
3. Invoquer `unit-test-engineer` ; TDD via skill `test-driven-development` si pertinent.
4. Faire passer `npm test` / coverage CI.

## Charge

1. Rule `220-tests-charge-performance`.
2. Scripts k6 ou Artillery : signalement, upload, carte, suivi, admin.
3. Définir seuils p95 / taux d’erreur ; monter en charge progressive.
4. Corréler avec Postgres (`EXPLAIN`, pool) et rate limiting.

## Performance front

1. Lighthouse / Web Vitals sur parcours clés (`audit:lighthouse` si présent).
2. Budgets assets et médias ; éviter régressions LCP/INP/CLS.

## Orchestration

- Plan QA global : `qa-expert`
- E2E parcours : `e2e-playwright-tester`
- Charge/perf : `load-performance-tester`
- Multi-repos : `jaccuse-coordinator`
