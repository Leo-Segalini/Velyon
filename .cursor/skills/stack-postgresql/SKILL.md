---
name: stack-postgresql
description: PostgreSQL / PostGIS BDD de référence J’accuse. Utiliser pour schéma, migrations, requêtes spatiales, perf et sécurisation Postgres.
---

# Stack PostgreSQL — J’accuse

1. Confirmer ORM/driver dans `api-jaccuse` (Prisma, TypeORM, etc.).
2. Appliquer rules `180-postgresql` et `073-postgresql-jaccuse`.
3. Modéliser avec `uuid`, `timestamptz`, enums de statut, métadonnées médias (pas de blob).
4. Carte : PostGIS `geography(Point,4326)` + index GIST, ou lat/lng indexés avec plan PostGIS.
5. Migrations versionnées ; seeds démo ≠ prod ; pooling ; credentials en env.
6. `EXPLAIN` sur listes carte / modération ; éviter N+1.
7. Invoquer `postgres-pro` ou `database-administrator` pour les changements structurants.
8. Documenter le modèle dans la doc projet / OpenAPI liée.
