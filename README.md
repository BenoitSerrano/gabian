# Gabian

Application pour réviser régulièrement du vocabulaire (allemand → français), sur le principe d'Anki.
Le serveur est [multi-usage-api](../multi-usage-api) (client `gabian`, routes `/api/gabian/*`).

## Fonctionnement

Chaque jour, l'utilisateur reçoit :

- **5 nouveaux mots** jamais vus : présentés d'abord avec leur traduction, puis interrogés en fin de session ;
- **tous les mots à réviser** ce jour-là (date de révision ≤ aujourd'hui).

Il tape la traduction française (casse, accents et article ignorés) :

- **bonne réponse** → prochaine révision dans 1 jour, puis 3 jours, puis l'intervalle est multiplié par 2,5 (8, 20, 50…) ;
- **mauvaise réponse** → l'intervalle est remis à zéro et le mot revient plus tard dans la même session.

Le vocabulaire est dans la table Supabase `gabian_words` (modifiable depuis Supabase, pris en
compte par l'API en moins d'une minute) :

- `language_origin` / `language_target` : langue de l'utilisateur (`fr`) et langue apprise (`de`) ;
- `term` : le mot dans la langue apprise, **sans article** pour les noms ;
- `nature` : `noun`, `verb`, `adjective`, `adverb` ou `expression` (expression idiomatique) ;
- `gender` : `masculine`, `feminine` ou `neuter` pour les noms (null sinon) ;
- `translations` : `[{ "term": "chien", "gender": "masculine" }, ...]`.
- `tags` : catégories de vocabulaire (`{nature et environnement}`) ;
- `level` : niveau de difficulté, de 1 (débutant) à 3 (avancé).

Le vocabulaire (30 catégories × 3 niveaux) est écrit à la main dans
`multi-usage-api/scripts/gabian-vocabulary/themes/*.txt`, puis converti en SQL par
`build_themes_sql.py`.

Pour un nom, l'article (der/die/das, le/la/l') est déduit du genre et **obligatoire** dans la
réponse, dans les deux sens. Ne pas changer l'`id` d'un mot existant : la progression des
utilisateurs y est rattachée.

## Mise en place

1. Créer le projet Supabase `gabian-users` et exécuter dans le SQL Editor `schema.sql`,
   `words.sql` puis `seed_words_themes.sql` (dans `multi-usage-api/src/clients/gabian/lib/supabase/`).
2. Dans le `.env` de multi-usage-api, renseigner `GABIAN_SUPABASE_URL` et
   `GABIAN_SUPABASE_SERVICE_ROLE_KEY` (clé `service_role`, jamais exposée au front).
3. Ici : `cp .env.example .env.local` et ajuster `VITE_API_BASE_URL` au port de l'API.

## Run

- Dev : `npm install && npm run dev` (http://localhost:5173)
- Prod : `npm run build` → `dist/`. Sans `VITE_API_BASE_URL`, l'API de prod
  `https://multi-usage-api.onrender.com/api` est utilisée.

Penser à ajouter l'URL de prod du front dans les origines CORS de `multi-usage-api/src/app/app.ts`.
