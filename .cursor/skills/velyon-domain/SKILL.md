---
name: velyon-domain
description: Domaine métier Velyon (brand book PDF). Utiliser pour wizard 6 étapes, logos, couleurs, polices, tokens, Stripe, Playwright PDF.
---

# Domaine Velyon

1. Lire `cahierdescharges.md` avant toute feature métier.
2. Ordre CDC : templates PDF → import/analyse → wizard 6 étapes → auth/Stripe.
3. Aperçu = même moteur Playwright que le PDF ; variables CSS uniquement.
4. SVG sanitizé ; polices isolées par user ; MIME réel ; rate limit PDF/uploads.
5. Contrastes WCAG AA/AAA + tests unitaires sur calculs.
6. Freemium : filigrane serveur ; entitlements Stripe serveur.
7. Doc HTML racine (`documentation/`) à chaque livraison — routes, PDF pipeline, changelog.
8. Agents : `velyon-coordinator`, `spec-velyon-writer`, spécialistes pdf/logo/color/font/tokens/stripe.
