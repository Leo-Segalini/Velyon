# Velyon — dossiers d’avant-vente

## Mission

À partir d’une description libre d’un projet, produire trois documents :

1. le cahier des charges ;
2. la proposition technique ;
3. la proposition financière.

## Sources

Le dossier `demo/` contient les pièces déjà remises (propositions, devis, cahiers des charges). Elles servent de référence pour les prix, les piles techniques, la méthode et la structure des documents. Ce n’est pas un entraînement de modèle : les montants sont calculés par l’application, puis fournis au modèle comme contexte.

## Règles de chiffrage

- Reprendre un forfait de référence quand le besoin correspond (visio et traduction, application mobile).
- Sinon, taux journalier unique de 450 € HT, et le document le dit.
- TVA 8,5 %. Hébergement refacturé au réel. Avenant hors périmètre au même taux journalier, après accord écrit.
- Le modèle ne peut pas modifier les lignes ni les totaux.

## Rédaction

Fournisseurs acceptés, clés uniquement côté serveur : Gemini, Mistral, Claude. Sans clé, les trois documents restent disponibles, rédigés à partir de la grille et du texte saisi.

## Interface

Une seule page : une discussion, sur le modèle d’un chat. Pas de page de grille tarifaire. Les montants sont cités dans la conversation, uniquement lorsqu’ils sont utiles.
