document.addEventListener('DOMContentLoaded', function () {

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

    function adjustWidgetSize() {
        const screenWidth = window.innerWidth;
        let widgetWidth, widgetHeight;

        if (screenWidth < 768) {
            widgetWidth = '100%';
            widgetHeight = 150;
        } else if (screenWidth < 1024) {
            widgetWidth = '100%';
            widgetHeight = 200;
        } else if (screenWidth < 1750) {
            widgetWidth = '100%';
            widgetHeight = 250;
        } else {
            widgetWidth = 220;
            widgetHeight = 180;
        }

        document.getElementById('btc-mini-chart').innerHTML = '';
        document.getElementById('eth-mini-chart').innerHTML = '';
        document.getElementById('mcap-mini-chart').innerHTML = '';
        document.getElementById('market-quotes-widget').innerHTML = '';

        createTradingViewWidget('btc-mini-chart', {
            "symbol": "BINANCE:BTCUSDT",
            "width": widgetWidth,
            "height": widgetHeight,
            "locale": "fr",
            "dateRange": "1D",
            "colorTheme": "dark",
            "isTransparent": true,
            "autosize": false,
            "largeChartUrl": ""
        });

        createTradingViewWidget('eth-mini-chart', {
            "symbol": "BINANCE:ETHUSDT",
            "width": widgetWidth,
            "height": widgetHeight,
            "locale": "fr",
            "dateRange": "1D",
            "colorTheme": "dark",
            "isTransparent": true,
            "autosize": false,
            "largeChartUrl": ""
        });

        createTradingViewWidget('mcap-mini-chart', {
            "symbol": "CRYPTOCAP:TOTAL",
            "width": widgetWidth,
            "height": widgetHeight,
            "locale": "fr",
            "dateRange": "1D",
            "colorTheme": "dark",
            "isTransparent": true,
            "autosize": false,
            "largeChartUrl": ""
        });

        const marketDataScript = document.createElement('script');
        marketDataScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        marketDataScript.async = true;
        marketDataScript.innerHTML = JSON.stringify({
            "width": screenWidth < 1750 ? '100%' : 300,
            "height": 300,
            "locale": "fr",
            "colorTheme": "dark",
            "showChart": false,
            "isTransparent": true,
            "tabs": [
                {
                    "title": "Indices",
                    "symbols": [
                        { "s": "FOREXCOM:DJI", "d": "Dow Jones" },
                        { "s": "FOREXCOM:DJI", "d": "Dow Jones" },
                        { "s": "OANDA:FR40EUR", "d": "CAC 40" },
                        { "s": "OANDA:EURUSD", "d": "EURO USD" }
                    ],
                    "originalTitle": "Indices"
                }
            ]
        });
        const marketQuotesWidgetContainer = document.getElementById('market-quotes-widget');
        if (marketQuotesWidgetContainer) {
            marketQuotesWidgetContainer.appendChild(marketDataScript);
        }
    }

    adjustWidgetSize();

    window.addEventListener('resize', adjustWidgetSize);

    const taScript = document.createElement('script');
    taScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    taScript.async = true;
    taScript.innerHTML = JSON.stringify({
        "interval": "1D",
        "width": "100%",
        "isTransparent": true,
        "height": 400,
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

    fetch('2. trades/trades.json')
        .then(response => response.json())
        .then(data => {
            let trades = data.trades || data;

            if (!Array.isArray(trades)) {
                console.error('Les données reçues ne sont pas un tableau:', trades);
                return;
            }

            let totalBalance = 1000;
            let balance = 0;

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