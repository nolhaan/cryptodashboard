# Crypto Dashboard

## Description
Ce dashboard est un projet personnel que j'ai développé seul pour apprendre et améliorer mes compétences en développement web et en programmation. Il s'agit d'un site web référençant les différents trades que j'ai pu prendre au cours d'une période donnée. À ceci, j'y ai rajouté d'autres fonctionnalités comme décrites ci-dessous par page :

#### - Page d'accueil

La page d'accueil est conçue pour fournir un aperçu rapide et intuitif des principales données du marché des cryptomonnaies en temps réel. Cette page affiche les informations essentielles telles que les prix actuels des cryptomonnaies principales, des indicateurs de tendance, et un graphique détaillé pour l'analyse technique.

##### Sections principales

1. **Solde total**
   - En haut à gauche, le solde total de votre portefeuille crypto est affiché, avec des chiffres précis et actualisés grace à une base de données.

2. **Prix des cryptomonnaies**
   - Juste en dessous du solde, vous avez un tableau de bord affichant les prix actuels des cryptomonnaies populaires telles que BTC (Bitcoin), ETH (Ethereum), ainsi que la capitalisation boursière totale. Chaque vignette montre le prix actuel et un graphique de la performance sur les dernières heures. Ces graphiques ont été obtenu en intégrant dans le code l'API de TradingView.

3. **Indicateur de tendance**
   - Un cadran pour la paire BTC/USD indique la tendance actuelle du marché (par exemple, "Vendre" ou "Acheter"), avec un indicateur Fear&Greed, ce qui donne une vue d'ensemble rapide de la position à prendre.

4. **Indices de marché**
   - À droite, un autre tableau affiche les indices de marché traditionnels comme le Dow Jones (DJI), le CAC 40 (FR40EUR), et le taux de change EUR/USD, ce qui vous permet de comparer la performance des cryptomonnaies avec les marchés financiers classiques.

5. **Crypto Chart**
   - La section principale de la page est occupée par un graphique interactif, qui permet une analyse technique détaillée du marché. Ce graphique affiche la paire BTC/USDT avec différentes vues temporelles (1 minute, 1 heure, 1 jour, etc.). Il est conçu pour prendre des décisions éclairées en visualisant les tendances du marché.


## Technologies utilisées
- **Frontend** : React.js
- **Backend** : Node.js, Express.js
- **API** : CoinGecko

## Installation
1. Clonez le dépôt : 
    ```bash
    git clone https://github.com/NolhanWe/cryptodashboard.git
    ```
2. Installez les dépendances : 
    ```bash
    npm install
    ```
3. Démarrez le serveur : 
    ```bash
    npm run dev
    ```
4. Accédez à l'application sur [http://localhost:5000](http://localhost:5000)

## Auteur
Projet réalisé par **NolhanWe** pour apprendre et perfectionner mes compétences en développement web.

## Licence
Ce projet est sous licence MIT. Consultez le fichier [LICENSE](https://github.com/NolhanWe/cryptodashboard/blob/main/LICENSE) pour plus de détails.
