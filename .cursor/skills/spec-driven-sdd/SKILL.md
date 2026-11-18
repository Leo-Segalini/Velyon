---
name: spec-driven-sdd
description: Flux Spec-Driven Development (Spec Kit). Utiliser avant toute feature : specify, plan, tasks, analyze.
---

# Spec-Driven SDD

1. Charger la rule `300-spec-driven-sdd` et l'agent `spec-sdd-orchestrator`.
2. Ordre : specify → clarify → plan → tasks → analyze → implement.
3. Déléguer la rédaction stack à l'agent `spec-*-writer` du profil (ex. `spec-laravel-writer`, `spec-hf-writer`).
4. Utiliser aussi les skills Cursor `/speckit-*` si présentes.
5. Pas d'implémentation sans critères d'acceptation testables.
