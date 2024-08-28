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

    // Variables de balance
    let balance = -3.8818;
    let initialBalance = 1000;
    let totalBalance = balance + initialBalance;

    // Fonction de mise à jour de la balance
    function updateBalance(newTradeAmount) {
        balance += newTradeAmount;
        totalBalance = initialBalance + balance;
        const totalBalanceElement = document.getElementById('total-balance');
        if (totalBalanceElement) {
            totalBalanceElement.innerText = `$${Number(totalBalance).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
        } else {
            console.error('Element with ID "total-balance" not found');
        }
    }

    // Simuler l'ajout d'un trade
    document.addEventListener('tradeAdded', function(event) {
        const newTradeAmount = event.detail.amount;
        updateBalance(newTradeAmount);
    });

    // Exemples d'utilisation de l'événement "tradeAdded"
    // Pour ajouter un trade, vous pouvez déclencher l'événement comme ceci :
    // const event = new CustomEvent('tradeAdded', { detail: { amount: 100 } });
    // document.dispatchEvent(event);

    // Calculate changes for "Today", "7 Days", "30 Days"
    const todayDate = new Date(); // Current date
    const past7DaysDate = new Date(todayDate);
    past7DaysDate.setDate(todayDate.getDate() - 7);
    const past30DaysDate = new Date(todayDate);
    past30DaysDate.setDate(todayDate.getDate() - 30);

    let todayChange = 0;
    let weekChange = 0;
    let monthChange = 0;

    const todayChangePercent = (todayChange / initialBalance) * 100;
    const weekChangePercent = (weekChange / initialBalance) * 100;
    const monthChangePercent = (monthChange / initialBalance) * 100;

    console.log(`Today Change: ${todayChangePercent}%`);
    console.log(`Week Change: ${weekChangePercent}%`);
    console.log(`Month Change: ${monthChangePercent}%`);

    const todayChangeElement = document.getElementById('today-change');
    const weekChangeElement = document.getElementById('week-change');
    const monthChangeElement = document.getElementById('month-change');

    if (todayChangeElement) {
        todayChangeElement.innerText = `${todayChangePercent.toFixed(2)}% ${todayChangePercent < 0 ? '🔻' : '🔺'}`;
    } else {
        console.error('Element with ID "today-change" not found');
    }

    if (weekChangeElement) {
        weekChangeElement.innerText = `${weekChangePercent.toFixed(2)}% ${weekChangePercent < 0 ? '🔻' : '🔺'}`;
    } else {
        console.error('Element with ID "week-change" not found');
    }

    if (monthChangeElement) {
        monthChangeElement.innerText = `${monthChangePercent.toFixed(2)}% ${monthChangePercent < 0 ? '🔻' : '🔺'}`;
    } else {
        console.error('Element with ID "month-change" not found');
    }
});