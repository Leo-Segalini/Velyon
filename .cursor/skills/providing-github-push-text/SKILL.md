---
name: providing-github-push-text
description: >
  Use when any code, docs, specs, config, or tests were modified in the session —
  after a feature, bugfix, refactor, skill/rule edit, or before claiming work done —
  and when the user may push, commit, or open a PR on GitHub.
---

# Providing GitHub Push Text

## Overview

Après **toute** modification livrable, fournir un bloc **prêt à coller** pour GitHub.
Ne remplace pas le protocole « commit uniquement sur demande ».

## When to Use

- Fin d’implémentation, fin de tâche, correction, doc, skill, règle
- Avant options finishing / après « work complete »
- Dès que le working tree a changé de façon significative

**When NOT:** question pure, exploration sans écriture, refus sans changement de fichiers

## REQUIRED — Bloc de fin de réponse

Toute réponse qui clôt une modification **doit** terminer par :

```markdown
### Texte pour GitHub

**Commit message**
```
<type>(<scope>): <pourquoi en 1 ligne>

<corps optionnel 1-2 phrases si besoin>
```

**Fichiers concernés**
- `path/a` — …
- `path/b` — …

**Commandes (si tu veux pousser)**
```bash
git add <fichiers>
git commit -m "$(cat <<'EOF'
<même message>
EOF
)"
git push -u origin HEAD
```
```

Si une PR est pertinente, ajouter :

```markdown
**PR title:** …
**PR body:**
## Summary
- …
## Test plan
- [ ] …
```

## Règles

| Règle | Détail |
|-------|--------|
| Toujours le texte | Même si l’utilisateur n’a pas demandé de commit |
| Pas d’exécution | Ne pas `commit` / `push` / `gh pr create` sauf demande explicite |
| Style | `feat:` `fix:` `refactor:` `docs:` `test:` `chore:` — focus **pourquoi** |
| Scope | Un message = un intent cohérent ; si plusieurs features mélangées, **plusieurs blocs** |
| Secrets | Exclure `.env`, credentials ; les signaler si présents dans le diff |
| FR | Messages en français (cohérent avec le repo) sauf convention locale contraire |

## Red Flags — STOP

- Clôturer une feature sans bloc « Texte pour GitHub »
- « Je commit pour toi » sans demande
- Un seul message fourre-tout pour SMS + dashboard + biométrie
- Oublier la liste de fichiers ou les commandes `git add` ciblées

## Cross-refs

- Commits réels : rule `900-git-commits` + demande utilisateur
- Fin de branche : `finishing-a-development-branch` (options **après** ce bloc)
