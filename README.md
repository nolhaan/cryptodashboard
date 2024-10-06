# Crypto Dashboard

## Description
Ce dashboard est un projet personnel que j'ai développé seul pour apprendre et améliorer mes compétences en développement web et en programmation. Il s'agit d'un site web référençant les différents trades que j'ai pu prendre au cours d'une période donnée. À ceci, j'y ai rajouté d'autres fonctionnalités comme décrites ci-dessous par page :

## - Première page : Accueil

La page d'accueil est conçue pour fournir un aperçu rapide et intuitif des principales données du marché des cryptomonnaies en temps réel. Cette page affiche les informations essentielles telles que les prix actuels des cryptomonnaies principales, des indicateurs de tendance, et un graphique détaillé pour l'analyse technique.

##### Sections principales

1. **Solde total**
   - En haut à gauche, le solde total de votre portefeuille crypto est affiché, avec des chiffres précis et actualisés grâce à une base de données.

2. **Prix des cryptomonnaies**
   - Juste en dessous du solde, vous avez un tableau de bord affichant les prix actuels des cryptomonnaies populaires telles que BTC (Bitcoin), ETH (Ethereum), ainsi que la capitalisation boursière totale. Chaque vignette montre le prix actuel et un graphique de la performance sur les dernières heures. Ces graphiques ont été obtenus en intégrant dans le code l'API de TradingView.

3. **Indicateur de tendances**
   - Un cadran pour la paire BTC/USD indique la tendance actuelle du marché (par exemple, "Vendre" ou "Acheter"), avec un indicateur Fear&Greed, ce qui donne une vue d'ensemble rapide de la position à prendre.

4. **Indices de marchés**
   - À droite, un autre tableau affiche les indices de marché traditionnel comme le Dow Jones (DJI), le CAC 40 (FR40EUR), et le taux de change EUR/USD, ce qui vous permet de comparer la performance des cryptomonnaies avec les marchés financiers classiques.

5. **Crypto Chart**
   - La section principale de la page est occupée par un graphique interactif, qui permet une analyse technique détaillée du marché. Ce graphique affiche les paires cryptos avec différentes vues temporelles (1 minute, 1 heure, 1 jour, etc.). Il est conçu pour prendre des décisions éclairées en visualisant les tendances du marché.

## - Deuxième page : Trades

Cette deuxième page est dédiée à l'enregistrement et au suivi des positions de trading prises, offrant un aperçu détaillé des trades et de leurs performances.

##### Sections principales

1. **Formulaire d'ajout de transactions**

Le formulaire de saisie permet d'ajouter une nouvelle transaction dans le tableau de suivi. Il inclut les champs suivants :

- Date d'entrée : Date à laquelle la transaction a été effectuée.
- Type de transaction : Direction de la position Long/Short.
- Crypto : Nom de la cryptomonnaie tradée (ex. : $BTC, $ETH).
- Quantité : Nombre de tokens de cryptomonnaie achetée ou vendue.
- Prix d'achat et de vente : Prix d'achat et de vente.
- Commentaires : Permet d'avoir une trace écrite de la méthode utilisée et les impressions correspondantes.
- Screenshot : Fichier image pour illustrer la transaction, ici, des screenshots du graphique d'analyse technique.

2. **Prix des cryptomonnaies**

Une fois les transactions ajoutées, elles apparaissent dans un tableau avec les informations suivantes :

- Entry (Date d'entrée) : La date à laquelle la transaction a été effectuée.
- Long/Short : Type de position (long/Short) avec une distinction de couleur (rouge pour Short, vert pour long).
- Crypto : La cryptomonnaie tradée.
- Quantité : La quantité tradée.
- Prix d'achat : Le prix auquel la cryptomonnaie a été achetée.
- Prix de vente : Le prix auquel elle a été vendue.
- Profit : Calcul automatique du profit ou de la perte en fonction des prix d'achat et de vente.
- ROI : Le retour sur investissement exprimé en pourcentage.
- Commentaires : Section pour ajouter des notes sur la stratégie utilisée pour chaque trade.
- Screenshot : Affichage d'une vignette du trade sur le graphique d'analyse technique, cliquable pour ouvrir l'image en taille réelle.

## - Troisième page : Actualités

La troisième page du site est dédiée à la présentation des actualités du marché des cryptomonnaies. Elle propose un tableau de bord interactif qui regroupe les dernières informations liées aux différentes cryptomonnaies, ainsi qu'aux mouvements du marché global. Ces
actualités sont tirées de l'API de CryptoPanic.

##### Sections principales

1. **Dernières nouvelles**

Cette section affiche en temps réel les dernières actualités concernant le marché des cryptomonnaies. Vous y trouverez des articles provenant de sources fiables, comme NewsBTC et CoinTelegraph, avec des titres pertinents liés à l’évolution des marchés (BTC, ETH, etc.).

2. **Nouvelles sur le Bitcoin**

Une section dédiée aux informations concernant exclusivement le Bitcoin (BTC). Les traders et investisseurs peuvent ainsi suivre les nouvelles liées à l’évolution de la principale cryptomonnaie, incluant les tendances et les analyses de marché.

3. **Nouvelles sur l'Ethereum**

Similaire à la section Bitcoin, celle-ci est réservée aux actualités concernant l’Ethereum (ETH). Les articles couvrent les sujets essentiels pour comprendre les changements de prix, les mouvements d'investisseurs, et d'autres développements techniques autour de l’Ethereum.

4. **Actualités politiques et juridiques**

Les influences politiques et législatives sur le marché des cryptomonnaies sont couvertes dans cette section. Elle permet de comprendre l'impact des décisions politiques mondiales, comme les sanctions ou régulations, sur les prix et la volatilité des cryptos.

5. **Actualités en tendance**

Cette dernière section affiche les tendances les plus récentes et les sujets chauds du moment. Les utilisateurs peuvent y consulter les nouvelles liées aux technologies blockchain, aux partenariats majeurs, aux innovations NFT, ou encore aux décisions de régulation.

## - Quatrième page : Coins infos

Cette page est dédiée à la présentation des principales cryptomonnaies, avec une interface intuitive permettant d'accéder à des informations détaillées sur chaque crypto. Elle offre un tableau interactif pour surveiller les prix, les capitalisations, et les volumes de trading en temps réel.

##### Sections principales

1. **Tableau des cryptomonnaies**

En haut de la page, un tableau affiche les informations essentielles des cryptomonnaies comme Bitcoin (BTC), Ethereum (ETH), Tether (USDT), etc. Ce tableau comprend :

- Le prix actuel de chaque crypto.
- La variation sur 24 heures en pourcentage.
- La capitalisation boursière.
- Le volume de trading sur 24 heures.
- Un mini-graphique de tendance qui montre l'évolution récente du prix.

2. **Navigation vers les pages explicatives des cryptomonnaies**

En cliquant sur une cryptomonnaie dans le tableau, l'utilisateur est redirigé vers une page dédiée où il peut obtenir une explication complète sur la crypto sélectionnée. Cette page fournit une description détaillée, les fondamentaux du projet, ainsi que des graphiques interactifs pour une analyse approfondie des prix et tendances de cette cryptomonnaie.

## Auteur
Projet réalisé par **NolhanWe** pour apprendre et perfectionner mes compétences en développement de dashboard web et mes connaissances des cryptomonnaies.