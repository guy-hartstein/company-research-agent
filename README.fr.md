 [![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.md)
[![zh](https://img.shields.io/badge/lang-zh-green.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.zh.md)
[![fr](https://img.shields.io/badge/lang-fr-blue.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.fr.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.es.md)
[![jp](https://img.shields.io/badge/lang-jp-orange.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.jp.md)
[![kr](https://img.shields.io/badge/lang-ko-purple.svg)](https://github.com/guy-hartstein/company-research-agent/blob/main/README.kr.md)


# Agent de Recherche d'Entreprise 🔍

![web ui](<static/ui-1.png>)

Un outil multi-agents qui génère des rapports de recherche d'entreprise complets. La plateforme utilise un pipeline d'agents IA pour collecter, organiser et synthétiser des informations sur n'importe quelle entreprise.

✨Essayez-le en ligne ! https://companyresearcher.tavily.com ✨

https://github.com/user-attachments/assets/0e373146-26a7-4391-b973-224ded3182a9

## Fonctionnalités

- **Recherche Multi-Sources** : Récupère des données de diverses sources, y compris les sites web d'entreprise, articles de presse, rapports financiers et analyses sectorielles
- **Filtrage de contenu par IA** : Utilise le score de pertinence de Tavily pour la curation du contenu
- **Traitement Asynchrone** : Architecture efficace basée sur le polling pour suivre la progression de la recherche
- **Architecture à double modèle** :
  - Gemini 2.5 Flash pour la synthèse de recherche à large contexte
  - GPT-5.1 pour la mise en forme et l'édition précises du rapport
- **Frontend React moderne** : Interface réactive avec suivi de progression et options de téléchargement
- **Architecture modulaire** : Construite autour d'un pipeline de nœuds spécialisés de recherche et de traitement

## Cadre Agentique

### Pipeline de Recherche

La plateforme suit un cadre agentique avec des nœuds spécialisés qui traitent les données de manière séquentielle :

1. **Nœuds de Recherche** :
   - `CompanyAnalyzer` : Recherche les informations principales sur l'entreprise
   - `IndustryAnalyzer` : Analyse la position sur le marché et les tendances
   - `FinancialAnalyst` : Récupère les indicateurs financiers et les données de performance
   - `NewsScanner` : Collecte les actualités et développements récents

2. **Nœuds de Traitement** :
   - `Collector` : Agrège les données de recherche de tous les analyseurs
   - `Curator` : Met en œuvre le filtrage de contenu et le scoring de pertinence
   - `Briefing` : Génère des synthèses par catégorie à l'aide de Gemini 2.5 Flash
   - `Editor` : Compile et met en forme les synthèses dans un rapport final avec GPT-5.1

   ![web ui](<static/agent-flow.png>)

### Architecture de Génération de Contenu

La plateforme exploite des modèles distincts pour des performances optimales :

1. **Gemini 2.5 Flash** (`briefing.py`) :
   - Gère la synthèse de recherche à large contexte
   - Excelle dans le traitement et le résumé de grands volumes de données
   - Utilisé pour générer les synthèses initiales par catégorie
   - Efficace pour maintenir le contexte sur plusieurs documents

2. **GPT-5.1** (`editor.py`) :
   - Spécialisé dans la mise en forme et l'édition précises
   - Gère la structure markdown et la cohérence
   - Supérieur pour suivre des instructions de formatage exactes
   - Utilisé pour :
     - Compilation du rapport final
     - Déduplication du contenu
     - Mise en forme markdown
     - Streaming du rapport en temps réel

Cette approche combine la capacité de Gemini à gérer de larges fenêtres de contexte avec la précision de GPT-5.1 pour le respect des consignes de formatage.

### Système de Curation de Contenu

La plateforme utilise un système de filtrage de contenu dans `curator.py` :

1. **Scoring de Pertinence** :
   - Les documents sont scorés par la recherche IA de Tavily
   - Un seuil minimum (par défaut 0,4) est requis pour continuer
   - Les scores reflètent la pertinence par rapport à la requête de recherche
   - Un score élevé indique une meilleure correspondance avec l'intention de recherche

2. **Traitement des Documents** :
   - Le contenu est normalisé et nettoyé
   - Les URLs sont dédupliquées et standardisées
   - Les documents sont triés par score de pertinence
   - La recherche s'exécute de manière asynchrone en arrière-plan

### Architecture Backend

La plateforme implémente un système de communication simple basé sur le polling :

![web ui](<static/ui-2.png>)

1. **Implémentation Backend** :
   - Utilise FastAPI avec support asynchrone
   - Les tâches de recherche s'exécutent en arrière-plan
   - Les résultats sont stockés et accessibles via des endpoints REST
   - Suivi simple de l'état des tâches
   
2. **Intégration Frontend** :
   - Le frontend React soumet des demandes de recherche
   - Reçoit un job_id pour le suivi
   - Effectue un polling sur l'endpoint `/research/{job_id}/report`
   - Affiche le rapport final une fois terminé

3. **Endpoints de l'API** :
   - `POST /research` : Soumettre une nouvelle demande de recherche
   - `GET /research/{job_id}/report` : Polling pour le rapport terminé
   - `POST /generate-pdf` : Générer un PDF du contenu du rapport

## Configuration

### Configuration Rapide (Recommandée)

La façon la plus simple de commencer est d'utiliser le script de configuration, qui détecte automatiquement et utilise `uv` pour une installation plus rapide des paquets Python lorsqu'il est disponible :

1. Clonez le dépôt :
```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. Rendez le script de configuration exécutable et lancez-le :
```bash
chmod +x setup.sh
./setup.sh
```

Le script de configuration va :

- Détecter et utiliser `uv` pour une installation plus rapide des paquets Python (si disponible)
- Vérifier les versions requises de Python et Node.js
- Créer éventuellement un environnement virtuel Python (recommandé)
- Installer toutes les dépendances (Python et Node.js)
- Vous guider dans la configuration de vos variables d'environnement
- Démarrer éventuellement les serveurs backend et frontend

> **💡 Conseil Pro** : Installez [uv](https://github.com/astral-sh/uv) pour une installation significativement plus rapide des paquets Python :
>
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

Vous aurez besoin des clés API suivantes :

- Clé API Tavily
- Clé API Google Gemini
- Clé API OpenAI
- Clé API Google Maps
- URI MongoDB (optionnel)

### Configuration Manuelle

Si vous préférez configurer manuellement, suivez ces étapes :

1. Clonez le dépôt :

```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. Installez les dépendances backend :

```bash
# Optionnel : Créez et activez un environnement virtuel
# Avec uv (plus rapide - recommandé si disponible) :
uv venv .venv
source .venv/bin/activate

# Ou avec Python standard :
# python -m venv .venv
# source .venv/bin/activate

# Installez les dépendances Python
# Avec uv (plus rapide) :
uv pip install -r requirements.txt

# Ou avec pip :
# pip install -r requirements.txt
```

3. Installez les dépendances frontend :

```bash
cd ui
npm install
```

4. **Configuration des Variables d'Environnement** :

Ce projet nécessite deux fichiers `.env` séparés pour le backend et le frontend.

**Configuration Backend :**

Créez un fichier `.env` dans le répertoire racine du projet et ajoutez vos clés API backend :

```env
TAVILY_API_KEY=votre_clé_tavily
GEMINI_API_KEY=votre_clé_gemini
OPENAI_API_KEY=votre_clé_openai

# Optionnel : Activez la persistance MongoDB
# MONGODB_URI=votre_chaîne_de_connexion_mongodb
```

**Configuration Frontend :**

Créez un fichier `.env` dans le répertoire `ui`. Vous pouvez d'abord copier le fichier d'exemple :

```bash
cp ui/.env.development.example ui/.env
```

Puis, ouvrez `ui/.env` et ajoutez vos variables d'environnement frontend :

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=votre_clé_google_maps_ici
```

### Configuration Docker

L'application peut être exécutée à l'aide de Docker et Docker Compose :

1. Clonez le dépôt :

```bash
git clone https://github.com/guy-hartstein/tavily-company-research.git
cd tavily-company-research
```

2. **Configuration des Variables d'Environnement** :

La configuration Docker utilise deux fichiers `.env` séparés.

**Configuration Backend :**

Créez un fichier `.env` dans le répertoire racine du projet et ajoutez vos clés API backend :

```env
TAVILY_API_KEY=votre_clé_tavily
GEMINI_API_KEY=votre_clé_gemini
OPENAI_API_KEY=votre_clé_openai

# Optionnel : Activez la persistance MongoDB
# MONGODB_URI=votre_chaîne_de_connexion_mongodb
```

**Configuration Frontend :**

Créez un fichier `.env` dans le répertoire `ui`. Vous pouvez d'abord copier le fichier d'exemple :

```bash
cp ui/.env.development.example ui/.env
```

Puis, ouvrez `ui/.env` et ajoutez vos variables d'environnement frontend :

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=votre_clé_google_maps_ici
```

3. Construisez et démarrez les conteneurs :

```bash
docker compose up --build
```

Cela démarrera les services backend et frontend :

- L'API backend sera disponible sur `http://localhost:8000`
- Le frontend sera disponible sur `http://localhost:5174`

Pour arrêter les services :

```bash
docker compose down
```

Remarque : Lors de la mise à jour des variables d'environnement dans `.env`, vous devrez redémarrer les conteneurs :

```bash
docker compose down && docker compose up
```

### Exécution de l'Application

1. Démarrez le serveur backend (choisissez une option) :

```bash
# Option 1 : Module Python Direct
python -m application.py

# Option 2 : FastAPI avec Uvicorn
uvicorn application:app --reload --port 8000
```

2. Dans un nouveau terminal, démarrez le frontend :

```bash
cd ui
npm run dev
```

3. Accédez à l'application sur `http://localhost:5173`

## Utilisation

### Développement Local

1. Démarrez le serveur backend (choisissez une option) :

   **Option 1 : Module Python Direct**

   ```bash
   python -m application.py
   ```

   **Option 2 : FastAPI avec Uvicorn**

   ```bash
   # Installez uvicorn si ce n'est pas déjà fait
   # Avec uv (plus rapide) :
   uv pip install uvicorn
   # Ou avec pip :
   # pip install uvicorn

   # Exécutez l'application FastAPI avec rechargement à chaud
   uvicorn application:app --reload --port 8000
   ```

   Le backend sera disponible sur :
   - Point d'accès API : `http://localhost:8000`

2. Démarrez le serveur de développement frontend :

   ```bash
   cd ui
   npm run dev
   ```

3. Accédez à l'application sur `http://localhost:5173`

> **⚡ Note de Performance** : Si vous avez utilisé `uv` lors de l'installation, vous bénéficierez d'une installation de paquets et d'une résolution de dépendances significativement plus rapides. `uv` est un gestionnaire de paquets Python moderne écrit en Rust qui peut être 10 à 100 fois plus rapide que pip.

### Options de Déploiement

L'application peut être déployée sur diverses plateformes cloud. Voici quelques options courantes :

#### AWS Elastic Beanstalk

1. Installez l'EB CLI :

   ```bash
   pip install awsebcli
   ```

2. Initialisez l'application EB :

   ```bash
   eb init -p python-3.11 tavily-research
   ```

3. Créez et déployez :

   ```
   ```

## Star History

<a href="https://www.star-history.com/?repos=guy-hartstein%2Fcompany-research-agent&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=guy-hartstein/company-research-agent&type=date&theme=dark&legend=bottom-right" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=guy-hartstein/company-research-agent&type=date&legend=bottom-right" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=guy-hartstein/company-research-agent&type=date&legend=bottom-right" />
 </picture>
</a>
