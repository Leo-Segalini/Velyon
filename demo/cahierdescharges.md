# MISSION

Crée une application web SaaS qui **génère automatiquement une charte graphique professionnelle en PDF**. N'importe quel client y importe son **logo**, ses **polices** et ses **couleurs**, et la plateforme produit un dossier de charte graphique complet (brand book) prêt à télécharger, ainsi que ses design tokens.

Le résultat doit être comparable à un brand book livré par une agence : identité, logotype et ses déclinaisons, palette, accessibilité, typographie, composants UI, tokens. Tout est calculé et mis en page automatiquement à partir des éléments importés.

# STACK TECHNIQUE

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Stockage fichiers : S3 compatible (ou Supabase Storage)
- Traitement d'images : sharp (raster), svgo + parseur SVG (vectoriel)
- Analyse de polices : fontkit ou opentype.js (lecture des noms, graisses, glyphes, axes variables)
- Extraction de couleurs du logo : node-vibrant ou colorthief
- **Génération PDF : Playwright (Chromium headless) à partir de templates HTML/CSS**, pour un rendu fidèle avec polices personnalisées, dégradés et mise en page paginée
- Icônes de l'interface : Lucide React

# PARCOURS UTILISATEUR (assistant en 6 étapes, sauvegarde automatique)

## Étape 1 : La marque
Nom de la marque, baseline (optionnelle), secteur d'activité, description courte, 3 à 5 valeurs/mots-clés, langue du document (français ou anglais).

## Étape 2 : Le logo
- Import par glisser-déposer : SVG (recommandé), PNG, JPG, WebP, 10 Mo max. Possibilité d'importer plusieurs variantes : principal, horizontal, vertical, monogramme/symbole seul, version négative (fond sombre), version monochrome.
- Vérifications automatiques : résolution minimale, présence de transparence, dimensions, ratio. Alertes claires si le fichier est de mauvaise qualité.
- **Génération automatique des variantes manquantes** : monochrome noir, monochrome blanc, version sans baseline, version sur fond sombre et sur fond clair. Pour le SVG : recoloration des tracés. Pour le raster : masque alpha/luminance (suppression du fond blanc si besoin).
- Possibilité de recadrer pour extraire le monogramme (symbole seul).
- Suggestion automatique de palette à partir des couleurs dominantes du logo.
- Sécurité : nettoyer tout SVG importé (DOMPurify/svgo, suppression des scripts et références externes).

## Étape 3 : Les couleurs
- Ajout de couleurs par sélecteur, saisie HEX, ou extraction depuis le logo.
- **Attribution d'un rôle à chaque couleur** : primaire, secondaire, accent, fond principal, surface, texte principal, texte secondaire, bordures, succès, erreur, avertissement (rôles personnalisables et nommables).
- Calcul automatique pour chaque couleur : HEX, RGB, HSL, CMJN (valeur indicative), nuances de 100 à 900.
- **Contrôle d'accessibilité en direct** : ratio de contraste WCAG 2.x pour chaque association texte/fond, niveaux AA et AAA, avertissements si une paire est non conforme, et suggestion d'une couleur de texte plus contrastée.
- Génération automatique de 2 dégradés signatures à partir de la palette (modifiables).
- Aperçu temps réel sur une interface d'exemple (boutons, cartes, champs).

## Étape 4 : Les polices
- Import de fichiers TTF, OTF, WOFF, WOFF2 (10 Mo max chacun), ou choix dans Google Fonts.
- Détection automatique : nom de la famille, graisses disponibles, styles, polices variables (axes), couverture des caractères (accents français, symboles €, guillemets « »).
- **Attribution de rôles** : titres, corps de texte, chiffres/code (mono ou tabulaire), police de repli (fallback).
- Échelle typographique générée automatiquement (H1, H2, H3, corps, label, légende) avec tailles, graisses, interlignes et lettrage modifiables, et 3 presets (Compacte, Équilibrée, Aérée).
- Conversion des polices en WOFF2 pour le web et **embarquement dans le PDF**.
- Rappel de la licence : case à cocher « Je confirme disposer des droits d'utilisation de ces polices ». Les polices importées ne sont jamais rendues accessibles à d'autres utilisateurs.

## Étape 5 : Le contenu et le style du document
- Choix des sections à inclure (cases à cocher, voir liste ci-dessous).
- Format : A4 paysage (recommandé) ou A4 portrait.
- 3 modèles de mise en page : **Classique** (cartes et filets), **Éditorial** (grands titres, beaucoup d'air), **Minimal** (sobre, noir et blanc + une couleur).
- Textes d'introduction modifiables pour chaque section, avec un bouton « Rédiger avec l'IA » (API Anthropic Claude, clé côté serveur) qui propose un texte à partir du nom, du secteur et des valeurs.

## Étape 6 : Aperçu et export
- Aperçu page par page dans l'interface, **rendu avec le même moteur HTML que le PDF** (aperçu fidèle).
- Export : **PDF de la charte**, plus un pack de téléchargement : `tokens.css` (variables CSS), `tailwind.config.js`, `brand.json` (design tokens), et un ZIP des logos générés (toutes variantes) et des polices converties.
- Lien de partage privé (optionnel, avec expiration), historique des versions, duplication d'une charte.

# SECTIONS DU PDF GÉNÉRÉ

Chaque section est un template qui consomme les données de la marque ; **aucune couleur ni police n'est codée en dur**, tout est injecté via variables CSS.

1. **Couverture** : logo, nom, « Charte graphique & Design System », version, date.
2. **Sommaire** avec numéros de pages.
3. **Identité de marque** : territoire, valeurs, baseline, principes directeurs.
4. **Logotype** : composition (annotée), versions officielles, monogramme.
5. **Zone de protection et tailles minimales** : marge calculée à partir de la hauteur d'une lettre ou d'un élément du logo (paramétrable), schéma généré automatiquement sur le logo du client, tailles minimales avec et sans baseline.
6. **Usages interdits du logo** : 8 cas générés automatiquement avec **le vrai logo du client** (étirer, pivoter, changer les teintes, ajouter des effets, fond sans contraste, fond chargé, taille trop petite, changer la typographie).
7. **Palette chromatique** : cartes par couleur avec nom, rôle, HEX, RGB, CMJN indicatif, usage.
8. **Équilibre des teintes et dégradés**.
9. **Accessibilité** : tableau des contrastes calculés, conforme/non conforme, avec recommandations.
10. **Combinaisons texte/fond** : matrice automatique des associations avec ratios.
11. **Typographie** : cartes des familles avec spécimens rendus dans les polices importées, graisses, usages.
12. **Échelle typographique** : spécimens réels aux tailles définies.
13. **Grille, espacements et surfaces** : conteneur, colonnes, gouttières, rayons, ombres (paramétrables).
14. **Iconographie** : style, épaisseur de trait, couleurs (aperçu avec des icônes Lucide aux couleurs de la marque).
15. **Composants UI** : boutons (repos, survol, secondaire), cartes (défaut, sélectionnée), champs, badges, infobulles, tous rendus avec les couleurs et polices du client.
16. **Documents types** (optionnel) : aperçu d'une page de garde et d'un tableau aux couleurs de la marque.
17. **Design tokens** : bloc CSS prêt à copier, import des polices.
18. **Check-list de conformité** avant publication.

L'interface adapte automatiquement le rendu : texte blanc ou foncé choisi selon le fond, pas de blocs illisibles quelle que soit la palette importée. Si une couleur ou une police est manquante, appliquer des valeurs de repli cohérentes et le signaler.

# BACK-OFFICE ET COMPTES

- Authentification par e-mail (magic link) ou Google. Tableau de bord : liste des chartes, statut (brouillon, généré), dates, actions (dupliquer, supprimer, télécharger).
- Modèle économique : offre gratuite (1 charte, filigrane discret sur le PDF) et offre payante (chartes illimitées, sans filigrane, pack de tokens, lien de partage). Intégration Stripe.
- Admin : gestion des modèles de mise en page, des textes types, des utilisateurs, statistiques de génération.

# MODÈLE DE DONNÉES (Prisma)

User, Brand (nom, baseline, secteur, valeurs, langue), LogoAsset (type de variante, URL, dimensions, origine : importé ou généré), ColorToken (nom, rôle, HEX, ordre), FontAsset (famille, rôle, graisses, URL woff2, droits confirmés), TypeScale, Guideline (modèle, format, sections activées, contenu des textes, version, pdfUrl), Subscription.

# EXIGENCES QUALITÉ ET SÉCURITÉ

- Validation de tous les fichiers (type MIME réel, taille, extension), analyse antivirus si possible, jamais d'exécution du contenu importé.
- Limitation de débit sur les imports et les générations PDF, file d'attente (BullMQ ou équivalent) pour les rendus lourds.
- Suppression des fichiers du client sur demande et conformité RGPD.
- Interface soignée, responsive, accessible (WCAG AA), états de chargement et d'erreur explicites, messages en français.
- Interface de la plateforme : sobre et neutre, thème clair, afin de ne pas entrer en conflit avec les identités visuelles des clients.
- Tests : calcul des contrastes, génération des variantes de logo, rendu PDF avec une police personnalisée.

# LIVRABLE ATTENDU

Code complet et exécutable avec README (installation, variables d'environnement, Playwright), données de démonstration (une marque d'exemple avec logo, polices et palette), et un exemple de PDF généré. Commence par le moteur de templates PDF alimenté par des variables de marque, puis l'import et l'analyse (logo, couleurs, polices), puis l'assistant en 6 étapes, puis les comptes et la facturation.