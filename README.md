# 🗨️ Projet Forum Next.js

## 📖 Contexte

L’objectif du projet est de concevoir et développer un **forum web moderne** permettant aux utilisateurs d’échanger publiquement ou en privé autour de différentes thématiques.  
La plateforme se veut **ouverte à tous pour la lecture** des conversations publiques, tout en réservant la **participation et les fonctionnalités avancées** (création de discussions, réponses, conversations privées, gestion de profil) aux utilisateurs authentifiés.

Le forum doit proposer une **expérience fluide et réactive**, une **authentification sécurisée**, un **système de catégorisation par tags**, et une **interface claire** pour naviguer entre les discussions.

---

## ⚙️ Stack technique

| Élément                       | Outil / Technologie                            | Description                                              |
| ----------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| **Framework Front + Back**    | [Next.js](https://nextjs.org/)                 | Application fullstack (SSR + API Routes REST)            |
| **Base de données**           | [PostgreSQL (Supabase)](https://supabase.com/) | Stockage des utilisateurs, conversations, messages, tags |
| **ORM**                       | [Prisma](https://www.prisma.io/)               | Gestion du schéma et des requêtes vers la base           |
| **Authentification**          | [Auth.js (NextAuth)](https://authjs.dev/)      | Authentification sécurisée (email/password ou providers) |
| **Hébergement du Front/Back** | [Vercel](https://vercel.com/)                  | Déploiement de l’application Next.js                     |
| **Hébergement BDD + Storage** | [Supabase](https://supabase.com/)              | Stockage des données et des images de profil             |
| **Stockage fichiers**         | Supabase Storage                               | Gestion des avatars et images liées aux conversations    |
| **Langage**                   | TypeScript                                     | Sécurité et robustesse du code                           |
| **Styles**                    | Tailwind CSS                                   | Mise en page et design responsive                        |
| **API**                       | REST (via `/api/*`)                            | Communication entre front et back                        |

---

## 🧩 Description fonctionnelle

### 1. Accueil (Page publique)

- Liste **toutes les conversations publiques** du forum.
- Chaque conversation affiche :
  - Le **titre**
  - Le **nombre de réponses**
  - Les **tags** associés
  - Le **dernier message** (aperçu)
- Un **filtrage** par tags permet de naviguer facilement entre les catégories.

---

### 2. Authentification & Profil utilisateur

- Un utilisateur peut :
  - **Créer un compte** via Auth.js
  - **Se connecter / se déconnecter**
  - **Accéder à ses paramètres** pour :
    - Modifier ses informations personnelles (pseudo, bio, avatar)
    - Consulter ses conversations et réponses
- L’accès à certaines actions (répondre, créer une conversation, envoyer un message privé) nécessite d’être **connecté**.

---

### 3. Conversations publiques

- Les conversations publiques sont **visibles par tous**.
- Seuls les utilisateurs **authentifiés** peuvent :
  - **Répondre** à une conversation
  - **Créer** une nouvelle conversation
  - **Ajouter des tags** à leur publication
- Les réponses sont affichées de manière chronologique.

---

### 4. Conversations privées

- Un utilisateur peut créer une **conversation privée** avec un autre utilisateur.
- Ces discussions ne sont visibles **que par les deux participants**.
- Notifications visuelles pour les nouveaux messages.

---

### 5. Tags & Filtrage

- Chaque conversation publique peut être associée à un ou plusieurs **tags**.
- Un système de **filtrage dynamique** permet d’afficher les conversations selon un ou plusieurs tags sélectionnés.
- Exemple de tags : `#général`, `#entraide`, `#tech`, `#offtopic`.

---

### 6. Espace utilisateur

- **Tableau de bord** personnel affichant :
  - Les **conversations créées**
  - Les **réponses postées**
  - Les **messages privés récents**
- Possibilité de **supprimer / modifier** ses propres conversations ou messages.

---

## Modèle de données

### Conversation

- `id` - Identifiant unique (CUID)
- `title` - Titre de la conversation (optionnel)
- `messages` - Relation avec les messages
- `createdAt`, `updatedAt`, `deletedAt`, `archivedAt` - Timestamps

### Message

- `id` - Identifiant unique (CUID)
- `content` - Contenu du message
- `conversationId` - Référence à la conversation
- `createdAt`, `updatedAt`, `deletedAt`, `archivedAt` - Timestamps

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Docker](https://www.docker.com/) et Docker Compose
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd nextjs-forum
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/forum?schema=public"
```

### 4. Démarrer la base de données

Lancer PostgreSQL et Adminer via Docker :

```bash
docker compose up -d
```

Services disponibles :

- **PostgreSQL** : `localhost:5432`
- **Adminer** (interface d'administration) : `http://localhost:8080`

### 5. Initialiser la base de données

Créer les tables à partir du schéma Prisma :

```bash
npx prisma db push
```

Ou créer une migration :

```bash
npx prisma migrate dev --name init
```

### 6. Générer le client Prisma

```bash
npx prisma generate
```

### 7. Peupler la base de données (optionnel)

Générer des données de test (10 conversations avec 5 messages chacune) :

```bash
npm run seed
```

### 8. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Commandes utiles

### Développement

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Compiler le projet pour la production
npm run start        # Démarrer le serveur de production
npm run lint         # Linter le code
```

### Prisma

```bash
npx prisma studio              # Ouvrir l'interface graphique Prisma
npx prisma db push             # Synchroniser le schéma sans migration
npx prisma migrate dev         # Créer et appliquer une migration
npx prisma migrate reset       # Réinitialiser la base de données
npx prisma generate            # Générer le client Prisma
npm run seed                   # Peupler la base de données
```

### Docker

```bash
docker compose up -d           # Démarrer les services
docker compose down            # Arrêter les services
docker compose logs -f         # Voir les logs en temps réel
```

## Accès à Adminer

Adminer est un outil d'administration de base de données accessible via le navigateur :

- URL : `http://localhost:8080`
- Système : `PostgreSQL`
- Serveur : `postgres`
- Utilisateur : `postgres`
- Mot de passe : `postgres`
- Base de données : `forum`

## Architecture

Ce projet utilise :

- **App Router** de Next.js 15 avec routes groupées `(private)` pour les pages protégées
- **Server Components** par défaut pour de meilleures performances
- **Prisma Client** personnalisé généré dans `src/generated/prisma`
- **Tailwind CSS v4** pour le styling
- **ESLint** pour la qualité du code

## Réinitialiser les données

Pour réinitialiser complètement la base de données :

```bash
npx prisma migrate reset --force
```

Cette commande va :

1. Supprimer la base de données
2. Recréer la base de données
3. Appliquer toutes les migrations
4. Exécuter le script de seed automatiquement

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

🗨️ Projet Forum Next.js
📖 Contexte

L’objectif du projet est de concevoir et développer un forum web moderne permettant aux utilisateurs d’échanger publiquement ou en privé autour de différentes thématiques.
La plateforme se veut ouverte à tous pour la lecture des conversations publiques, tout en réservant la participation et les fonctionnalités avancées (création de discussions, réponses, conversations privées, gestion de profil) aux utilisateurs authentifiés.

Le forum doit proposer une expérience fluide et réactive, une authentification sécurisée, un système de catégorisation par tags, et une interface claire pour naviguer entre les discussions.

⚙️ Stack technique
Élément Outil / Technologie Description
Framework Front + Back Next.js
Application fullstack (SSR + API Routes REST)
Base de données PostgreSQL (Supabase)
Stockage des utilisateurs, conversations, messages, tags
ORM Prisma
Gestion du schéma et des requêtes vers la base
Authentification Auth.js (NextAuth)
Authentification sécurisée (email/password ou providers)
Hébergement du Front/Back Vercel
Déploiement de l’application Next.js
Hébergement BDD + Storage Supabase
Stockage des données et des images de profil
Stockage fichiers Supabase Storage Gestion des avatars et images liées aux conversations
Langage TypeScript Sécurité et robustesse du code
Styles Tailwind CSS Mise en page et design responsive
API REST (via /api/\*) Communication entre front et back
🧩 Description fonctionnelle

1. Accueil (Page publique)

Liste toutes les conversations publiques du forum.

Chaque conversation affiche :

Le titre

Le nombre de réponses

Les tags associés

Le dernier message (aperçu)

Un filtrage par tags permet de naviguer facilement entre les catégories.

2. Authentification & Profil utilisateur

Un utilisateur peut :

Créer un compte via Auth.js

Se connecter / se déconnecter

Accéder à ses paramètres pour :

Modifier ses informations personnelles (pseudo, bio, avatar)

Consulter ses conversations et réponses

L’accès à certaines actions (répondre, créer une conversation, envoyer un message privé) nécessite d’être connecté.

3. Conversations publiques

Les conversations publiques sont visibles par tous.

Seuls les utilisateurs authentifiés peuvent :

Répondre à une conversation

Créer une nouvelle conversation

Ajouter des tags à leur publication

Les réponses sont affichées de manière chronologique.

4. Conversations privées

Un utilisateur peut créer une conversation privée avec un autre utilisateur.

Ces discussions ne sont visibles que par les deux participants.

Notifications visuelles pour les nouveaux messages.

5. Tags & Filtrage

Chaque conversation publique peut être associée à un ou plusieurs tags.

Un système de filtrage dynamique permet d’afficher les conversations selon un ou plusieurs tags sélectionnés.

Exemple de tags : #général, #entraide, #tech, #offtopic.

6. Espace utilisateur

Tableau de bord personnel affichant :

Les conversations créées

Les réponses postées

Les messages privés récents

Possibilité de supprimer / modifier ses propres conversations ou messages.

📌 Objectifs du projet

Créer une plateforme de discussion fluide et accessible.

Offrir une expérience utilisateur moderne et réactive grâce à Next.js.

Assurer la sécurité des données et des utilisateurs via Auth.js et PostgreSQL.

Proposer une architecture claire et extensible, facilement maintenable.

Souhaites-tu que je te rédige aussi la structure de la base de données Prisma (schema.prisma avec les modèles User, Conversation, Message, Tag, etc.) ?
Ce serait la suite logique pour poser les bases du développement.


TO DO 
-create route post messages (add new message into conversation)
-create service to call post message request
-create componant messageForm

step 2
-refetch messageList after new message is added
