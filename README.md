# Velyon

Velyon prépare trois documents d’avant-vente à partir d’une description de projet : le cahier des charges, la proposition technique et la proposition financière.

Les montants et les choix techniques viennent des dossiers de référence placés dans `demo/`. Un modèle (Gemini, Mistral ou Claude) rédige le texte. Il ne choisit pas les prix. Sans clé API, le dossier est quand même produit à partir de la grille.

## Prérequis

- Node.js 20 ou plus

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

L’application démarre sur [http://localhost:3000](http://localhost:3000).

Renseignez au choix `GEMINI_API_KEY`, `MISTRAL_API_KEY` ou `ANTHROPIC_API_KEY`. `AI_PROVIDER` force le fournisseur (`gemini`, `mistral` ou `anthropic`). Ces clés restent côté serveur.

## Parcours

L’accueil est une discussion. On décrit le projet, Velyon répond, puis rédige le cahier des charges, la proposition technique et la proposition financière quand on le lui demande.

`POST /api/chat` reçoit l’historique des messages.

## Scripts

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

## Documentation

Ouvrir `documentation/index.html` dans un navigateur.
