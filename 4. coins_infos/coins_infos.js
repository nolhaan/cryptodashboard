const cryptoIds = ['bitcoin', 'ethereum', 'tether', 'solana', 'xrp', 'binance-coin'];
let cryptoData = [];
let charts = {};

async function fetchCryptoData() {
    try {
        const response = await axios.get('https://api.coincap.io/v2/assets', {
            params: {
                ids: cryptoIds.join(',')
            }
        });

        cryptoData = response.data.data;
        sortAndDisplayData();
    } catch (error) {
        console.error('Erreur lors de la récupération des données crypto:', error);
    }
}

function sortAndDisplayData() {
    const sortOption = document.querySelector('#sort').value;

    let sortedData = [...cryptoData];

    if (sortOption === 'top_gainers') {
        sortedData.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr));
    } else if (sortOption === 'top_losers') {
        sortedData.sort((a, b) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr));
    } else if (sortOption === 'top_market_cap') {
        sortedData.sort((a, b) => parseFloat(b.marketCapUsd) - parseFloat(a.marketCapUsd));
    } else if (sortOption === 'low_market_cap') {
        sortedData.sort((a, b) => parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd));
    }

    displayCryptoData(sortedData);
}

function displayCryptoData(data) {
    data.forEach(async (crypto, index) => {
        if (cryptoIds.includes(crypto.id)) {
            const cryptoElement = document.querySelectorAll('.sub-card')[index];

            if (cryptoElement) {
                const imgElement = document.createElement('img');
                imgElement.src = `https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`;
                imgElement.alt = `${crypto.name} logo`;
                imgElement.style.width = '20px';
                imgElement.style.height = '20px';
                imgElement.style.marginRight = '8px';
                imgElement.style.verticalAlign = 'middle';

                const cryptoNameElement = cryptoElement.querySelector('.crypto-name');
                cryptoNameElement.textContent = `${crypto.name} `;
                cryptoNameElement.prepend(imgElement);

                const acronymSpan = document.createElement('span');
                acronymSpan.className = 'acronym';
                acronymSpan.textContent = crypto.symbol.toUpperCase();
                cryptoNameElement.appendChild(acronymSpan);

                cryptoElement.querySelector('.price').textContent = `$${parseFloat(crypto.priceUsd).toFixed(2)}`;

                const change24hElement = cryptoElement.querySelector('.change-24h');
                const changePercent = parseFloat(crypto.changePercent24Hr).toFixed(2);
                change24hElement.textContent = `${changePercent}%`;

                if (changePercent >= 0) {
                    change24hElement.classList.add('green');
                    change24hElement.classList.remove('red');
                } else {
                    change24hElement.classList.add('red');
                    change24hElement.classList.remove('green');
                }

                cryptoElement.querySelector('.market-cap').textContent = `$${formatLargeNumbers(crypto.marketCapUsd)}`;
                cryptoElement.querySelector('.volume-24h').textContent = `$${formatLargeNumbers(crypto.volumeUsd24Hr)}`;

                updateOrCreateChart(cryptoElement, crypto, index);

                cryptoElement.addEventListener('click', () => {
                    if (crypto.id === 'bitcoin') {
                        window.location.href = 'bitcoin_infos.html';
                    } else if (crypto.id === 'ethereum') {
                        window.location.href = 'ethereum_infos.html';
                    } else if (crypto.id === 'tether') {
                        window.location.href = 'tether_infos.html';
                    } else if (crypto.id === 'solana') {
                        window.location.href = 'solana_infos.html';
                    } else if (crypto.id === 'xrp') {
                        window.location.href = 'ripple_infos.html';
                    } else if (crypto.id === 'binance-coin') {
                        window.location.href = 'bnb_infos.html';
                    }
                });
            }
        }
    });
}

function updateOrCreateChart(cryptoElement, crypto, index) {
    axios.get(`https://api.coincap.io/v2/assets/${crypto.id}/history`, {
        params: {
            interval: 'm15',
            start: Date.now() - 24 * 60 * 60 * 1000,
            end: Date.now()
        }
    }).then(historyResponse => {
        const historyData = historyResponse.data.data;
        const sparklineData = historyData.map(entry => parseFloat(entry.priceUsd));

        if (charts[crypto.id]) {
            charts[crypto.id].data.datasets[0].data = sparklineData;
            charts[crypto.id].update();
        } else {
            const chartCtx = cryptoElement.querySelector('canvas').getContext('2d');
            const gradient = chartCtx.createLinearGradient(0, 0, 0, chartCtx.canvas.height);
            gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

            charts[crypto.id] = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: sparklineData.map((_, index) => index),
                    datasets: [{
                        label: 'Price 24h',
                        data: sparklineData,
                        borderColor: '#FFFF00',
                        backgroundColor: gradient,
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: 'start',
                        tension: 0.4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { display: false },
                        y: { display: false, suggestedMin: Math.min(...sparklineData), suggestedMax: Math.max(...sparklineData) }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function (context) {
                                    return `Price 24h: ${context.parsed.y.toFixed(2)}`;
                                }
                            }
                        }
                    },
                    elements: {
                        line: { borderWidth: 2, borderColor: '#FFFF00', backgroundColor: gradient, fill: true, tension: 0.4 },
                        point: { radius: 0 }
                    }
                }
            });
        }
    }).catch(error => {
        console.error('Erreur lors de la récupération des données historiques:', error);
    });
}

function formatLargeNumbers(num) {
    num = parseFloat(num);
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
}

function searchCrypto() {
    const searchInput = document.querySelector('#search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredCryptoIds = cryptoIds.filter(id => id.toLowerCase().includes(query));

        document.querySelectorAll('.sub-card').forEach(card => {
            card.style.display = 'none';
        });

        filteredCryptoIds.forEach(id => {
            const index = cryptoIds.indexOf(id);
            if (index !== -1) {
                document.querySelectorAll('.sub-card')[index].style.display = 'block';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
    setInterval(fetchCryptoData, 60000);

    document.querySelector('#sort').addEventListener('change', sortAndDisplayData);
    searchCrypto();
});