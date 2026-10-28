# GM AGENCE — site de management football

Site responsive en français, conçu pour mobile Android et ordinateur. Comprend pages publiques, profils joueurs alimentés par base de données, formulaire de contact et panneau d'administration protégé par connexion Supabase.

## Ce qui est réellement fonctionnel
- Affichage des profils enregistrés dans Supabase.
- Connexion administrateur par e-mail/mot de passe Supabase (aucun mot de passe codé en dur).
- Ajout, modification et suppression de profils joueurs depuis le panneau d'administration mobile.
- Formulaire de contact enregistré en base et lecture des demandes par l'administrateur.
- Design responsive et hébergement statique compatible Netlify.

## 1. Créer la base de données (gratuit pour commencer)
1. Ouvre https://supabase.com sur ton téléphone et crée un projet.
2. Garde précieusement le mot de passe de la base de données.
3. Dans le projet, ouvre **SQL Editor** puis **New query**.
4. Copie tout le contenu du fichier `supabase.sql`, colle-le et clique sur **Run**.
5. Ouvre **Project Settings > API** (ou Connect) et copie l'URL du projet ainsi que la clé publique **anon/publishable**. Ne copie jamais la clé `service_role` dans le site.

## 2. Créer ton compte administrateur
1. Dans Supabase, ouvre **Authentication > Users**.
2. Clique sur **Add user**, ajoute ton adresse e-mail et définis un mot de passe fort.
3. Désactive les inscriptions publiques si elles sont activées. N'ajoute que tes propres comptes administrateurs de confiance.
4. Tu te connecteras ensuite dans le site via le bouton **Administration**.

**Important sécurité :** cette première version donne les permissions d'administration à tout compte Supabase authentifié. Tant que le site est en phase de configuration, ne crée aucun compte utilisateur public. Pour une agence avec plusieurs administrateurs, il faut ensuite ajouter un contrôle de rôle dédié.

## 3. Connecter le site à Supabase
1. À la racine du projet, crée un fichier nommé `.env` en copiant `.env.example`.
2. Remplace les valeurs par l'URL du projet et la clé publique :
   ```
   VITE_SUPABASE_URL=https://ton-projet.supabase.co
   VITE_SUPABASE_ANON_KEY=ta-cle-publique-anon
   ```
3. Enregistre le fichier. Ne publie jamais un secret `service_role` ou une clé privée.

## 4. Tester et publier avec Netlify
La méthode la plus simple depuis Android :
1. Sur un ordinateur, ou depuis un environnement cloud de développement qui accepte les commandes npm, installe les dépendances avec `npm install`, puis lance `npm run build`.
2. Pour Netlify, importe le projet dans un dépôt Git (GitHub/GitLab) puis choisis **Add new site > Import an existing project**.
3. Dans les paramètres de déploiement Netlify, définis **Build command** : `npm run build` et **Publish directory** : `dist`.
4. Dans **Site configuration > Environment variables**, ajoute `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` avec les mêmes valeurs.
5. Redéploie le site. Vérifie le site public, puis connecte-toi à `/` > **Administration**.

Le code source est prêt à être construit et hébergé, mais le site ne peut pas être mis en ligne sur tes comptes à ta place sans accès explicite à tes services. La base de données et les variables d'environnement sont indispensables au vrai fonctionnement de l'administration.

## 5. Personnaliser avant ouverture au public
- Remplace les coordonnées de contact par les coordonnées officielles de GM AGENCE.
- Ajoute les profils réels avec autorisation des joueurs ou représentants.
- Vérifie les droits d'utilisation des photos et vidéos.
- Ajoute une politique de confidentialité et une adresse de contact.
- Si tu représentes officiellement des joueurs, vérifie les exigences applicables aux agents de football et aux règles FIFA / fédération nationale.

## Commandes locales
- `npm install`
- `npm run dev`
- `npm run build`

## Stack
React + Vite + Supabase (Auth, Postgres, Row Level Security) + Netlify.
