---
name: accessibilite-a11y
description: Réalise un audit d'accessibilité complet WCAG 2.1 / RGAA sur un écran, composant ou parcours. Utiliser quand l'utilisateur demande un audit a11y, une revue accessibilité, ou avant livraison d'une interface critique.
---

# Audit Accessibilité (a11y)

## Quand utiliser

- Audit complet d'un écran, composant ou parcours utilisateur
- Avant livraison d'une interface critique (formulaire, checkout, admin)
- Après signalement d'un problème d'accessibilité

## Checklist d'audit

Copie et suis cette checklist :

```
Audit a11y — [composant/écran]
- [ ] Sémantique HTML (landmarks, headings hiérarchiques)
- [ ] Contraste texte/fond (AA min 4.5:1, AAA 7:1 si visé)
- [ ] Navigation clavier complète (Tab, Shift+Tab, Entrée, Espace, Échap)
- [ ] Focus visible sur tous les interactifs
- [ ] Labels formulaires (htmlFor, aria-label si nécessaire)
- [ ] Messages d'erreur liés (aria-describedby, aria-invalid)
- [ ] Images (alt pertinent ou alt="" décoratif)
- [ ] États non portés uniquement par la couleur
- [ ] Zones tactiles ≥ 44×44 px
- [ ] Animations respectent prefers-reduced-motion
- [ ] Modales : focus trap, retour focus à la fermeture
- [ ] Lecteur d'écran : rôles, états, annonces live (aria-live)
```

## Processus

1. **Inventaire** — Liste tous les éléments interactifs et leur rôle.
2. **Test clavier** — Parcours complet sans souris.
3. **Test contraste** — Vérifie chaque combinaison texte/fond.
4. **Test sémantique** — Structure headings, landmarks, listes.
5. **Rapport** — Classe les problèmes par sévérité.

## Format du rapport

```markdown
# Audit accessibilité — [nom]

## Score : X/10

## Critiques (bloquants)
- [WCAG X.X.X] Description → Correction proposée

## Majeurs
- ...

## Mineurs / suggestions
- ...

## Tests effectués
- Navigation clavier : ✅/❌
- Contraste : ✅/❌
- Structure sémantique : ✅/❌
```

## Outils recommandés

- axe DevTools (extension navigateur)
- Lighthouse Accessibility
- Simulateur daltonisme (Chromatic Vision)
- Lecteur d'écran : VoiceOver (macOS), NVDA (Windows)

## Après l'audit

- Corrige les critiques en priorité.
- Mets à jour `documentation/accessibility/audit-reports.html`.
- Ajoute des tests axe si le composant est critique.
