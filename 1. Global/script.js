document.addEventListener('DOMContentLoaded', function() {
    const openSidebar = document.querySelector('#openSidebar');
    const closeSidebar = document.querySelector('.closeSidebar');
    const sidebar = document.querySelector('.main-sidebar');

    if (openSidebar) {
        openSidebar.addEventListener('click', () => {
            sidebar.style.left = '0%';
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.style.left = '-100%';
        });
    }

    // Configuration des widgets TradingView
    function createTradingViewWidget(containerId, widgetConfig) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
        script.async = true;
        script.innerHTML = JSON.stringify(widgetConfig);
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(script);
        }
    }

    createTradingViewWidget('btc-mini-chart', {
        "symbol": "BINANCE:BTCUSDT",
        "width": 220,
        "height": 180,
        "locale": "fr",
        "dateRange": "1D",
        "colorTheme": "dark",
        "isTransparent": true,
        "autosize": false,
        "largeChartUrl": ""
    });

    createTradingViewWidget('eth-mini-chart', {
        "symbol": "BINANCE:ETHUSDT",
        "width": 220,
        "height": 180,
        "locale": "fr",
        "dateRange": "1D",
        "colorTheme": "dark",
        "isTransparent": true,
        "autosize": false,
        "largeChartUrl": ""
    });

    createTradingViewWidget('mcap-mini-chart', {
        "symbol": "CRYPTOCAP:TOTAL",
        "width": 220,
        "height": 180,
        "locale": "fr",
        "dateRange": "1D",
        "colorTheme": "dark",
        "isTransparent": true,
        "autosize": false,
        "largeChartUrl": ""
    });

    // Ajout du widget d'analyse technique
    const taScript = document.createElement('script');
    taScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    taScript.async = true;
    taScript.innerHTML = JSON.stringify({
        "interval": "1D",
        "width": 307,
        "isTransparent": true,
        "height": 300,
        "symbol": "BINANCE:BTCUSD",
        "showIntervalTabs": false,
        "locale": "fr",
        "colorTheme": "dark",
        "hideSideToolbar": true,
        "details": false,
        "hideVolume": true,
        "hideLegend": true,
        "showSymbolLogo": false,
        "hideDateRanges": true,
        "hideLastPrice": true,
        "hideMarketStatus": true
    });
    const taWidgetContainer = document.getElementById('ta-widget');
    if (taWidgetContainer) {
        taWidgetContainer.appendChild(taScript);
    }

    // Widget pour les données de marché
    const marketDataScript = document.createElement('script');
    marketDataScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    marketDataScript.async = true;
    marketDataScript.innerHTML = JSON.stringify({
        "width": 300,
        "height": 300,
        "locale": "fr",
        "colorTheme": "dark",
        "showChart": false,
        "isTransparent": true,
        "largeChartUrl": "",
        "plotLineColorGrowing": "rgba(33, 150, 243, 1)",
        "plotLineColorFalling": "rgba(33, 150, 243, 1)",
        "gridLineColor": "rgba(240, 243, 250, 1)",
        "scaleFontColor": "rgba(255, 255, 255, 1)",
        "belowLineFillColorGrowing": "rgba(33, 150, 243, 0.12)",
        "belowLineFillColorFalling": "rgba(33, 150, 243, 0.12)",
        "symbolActiveColor": "rgba(33, 150, 243, 0.12)",
        "tabs": [
            {
                "title": "Indices",
                "symbols": [
                    {
                        "s": "à laisser pour que ça s'affiche correctement",
                        "d": "jsp pourquoi"
                    },
                    {
                        "s": "FOREXCOM:DJI",
                        "d": "Dow Jones"
                    },
                    {
                        "s": "OANDA:FR40EUR",
                        "d": "CAC 40"
                    },
                    {
                        "s": "OANDA:EURUSD",
                        "d": "EURO USD"
                    },
                ],
                "originalTitle": "Indices"
            }
        ]
    });
    const marketQuotesWidgetContainer = document.getElementById('market-quotes-widget');
    if (marketQuotesWidgetContainer) {
        marketQuotesWidgetContainer.appendChild(marketDataScript);
    }

    new TradingView.widget({
        "width": "100%",
        "height": 500,
        "symbol": "BTCUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "fr",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "container_id": "crypto-overview"
    });

    // Récupérer les données des trades à partir du fichier trades.json
    fetch('2. trades/trades.json') // Mets ici le chemin correct de ton fichier JSON
    .then(response => response.json())
    .then(data => {
        let trades = data.trades || data; // Si `data.trades` existe, sinon `data` lui-même

        if (!Array.isArray(trades)) {
            console.error('Les données reçues ne sont pas un tableau:', trades);
            return;
        }

        let totalBalance = 1000; // Balance initiale
        let balance = 0;

        // Calculer la balance en additionnant les profits de chaque trade
        trades.forEach(trade => {
            let profit = parseFloat(trade.profit);
            if (!isNaN(profit)) {
                balance += profit;
            } else {
                console.error('Valeur de profit invalide:', trade.profit);
            }
        });

        totalBalance += balance;

        const totalBalanceElement = document.getElementById('total-balance');
        if (totalBalanceElement) {
            totalBalanceElement.innerText = `$${totalBalance.toFixed(2)}`;
        } else {
            console.error('Élément avec l\'ID "total-balance" non trouvé');
        }

        // Affichage des changements Today, 7 Days, 30 Days (simulés ici pour l'exemple)
        let todayChange = 0;
        let weekChange = 0;
        let monthChange = 0;

        const todayChangePercent = (todayChange / totalBalance) * 100;
        const weekChangePercent = (weekChange / totalBalance) * 100;
        const monthChangePercent = (monthChange / totalBalance) * 100;

        const todayChangeElement = document.getElementById('today-change');
        const weekChangeElement = document.getElementById('week-change');
        const monthChangeElement = document.getElementById('month-change');

        if (todayChangeElement) {
            todayChangeElement.innerText = `${todayChangePercent.toFixed(2)}% ${todayChangePercent < 0 ? '🔻' : '🔺'}`;
        }

        if (weekChangeElement) {
            weekChangeElement.innerText = `${weekChangePercent.toFixed(2)}% ${weekChangePercent < 0 ? '🔻' : '🔺'}`;
        }

        if (monthChangeElement) {
            monthChangeElement.innerText = `${monthChangePercent.toFixed(2)}% ${monthChangePercent < 0 ? '🔻' : '🔺'}`;
        }

    })
    .catch(error => console.error('Erreur lors du chargement des trades:', error));

});