const cryptoIds = ['bitcoin', 'ethereum', 'tether', 'solana', 'xrp', 'binancecoin']; // CryptoIds
let charts = {}; // Stocker les instances des graphiques
let cryptoData = []; // Stocker les données pour le tri

// Fonction pour récupérer les données des cryptomonnaies
async function fetchCryptoData() {
    try {
        const response = await axios.get('https://api.coincap.io/v2/assets', {
            params: {
                ids: cryptoIds.join(',')
            }
        });

        cryptoData = response.data.data; // Stocker les données récupérées
        sortAndDisplayData(); // Trier et afficher les données selon la sélection
    } catch (error) {
        console.error('Erreur lors de la récupération des données crypto:', error);
    }
}

// Fonction pour trier et afficher les données en fonction de la sélection
function sortAndDisplayData() {
    const sortOption = document.querySelector('#sort').value; // Récupérer la valeur de tri

    let sortedData = [...cryptoData]; // Copier les données

    // Appliquer le tri en fonction de la sélection
    if (sortOption === 'top_gainers') {
        sortedData.sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr));
    } else if (sortOption === 'top_losers') {
        sortedData.sort((a, b) => parseFloat(a.changePercent24Hr) - parseFloat(b.changePercent24Hr));
    } else if (sortOption === 'top_market_cap') {
        sortedData.sort((a, b) => parseFloat(b.marketCapUsd) - parseFloat(a.marketCapUsd));
    } else if (sortOption === 'low_market_cap') {
        sortedData.sort((a, b) => parseFloat(a.marketCapUsd) - parseFloat(b.marketCapUsd));
    }

    // Afficher les données triées
    displayCryptoData(sortedData);
}

// Fonction pour afficher les données des cryptomonnaies
function displayCryptoData(data) {
    data.forEach(async (crypto, index) => {
        if (cryptoIds.includes(crypto.id)) {
            const cryptoElement = document.querySelectorAll('.sub-card')[index];

            if (cryptoElement) {
                // Créer et ajouter l'élément image
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

                // Ajouter l'acronyme
                const acronymSpan = document.createElement('span');
                acronymSpan.className = 'acronym';
                acronymSpan.textContent = crypto.symbol.toUpperCase();
                cryptoNameElement.appendChild(acronymSpan);

                // Mettre à jour les autres détails
                cryptoElement.querySelector('.price').textContent = `$${parseFloat(crypto.priceUsd).toFixed(2)}`;
                
                // Afficher le changement sur 24h avec la bonne couleur
                const change24hElement = cryptoElement.querySelector('.change-24h');
                const changePercent = parseFloat(crypto.changePercent24Hr).toFixed(2);
                change24hElement.textContent = `${changePercent}%`;

                // Appliquer la classe en fonction de la valeur positive ou négative
                if (changePercent >= 0) {
                    change24hElement.classList.add('green');
                    change24hElement.classList.remove('red');
                } else {
                    change24hElement.classList.add('red');
                    change24hElement.classList.remove('green');
                }

                cryptoElement.querySelector('.market-cap').textContent = `$${formatLargeNumbers(crypto.marketCapUsd)}`;
                cryptoElement.querySelector('.volume-24h').textContent = `$${formatLargeNumbers(crypto.volumeUsd24Hr)}`;

                // Mise à jour ou création des graphiques
                updateOrCreateChart(cryptoElement, crypto, index);

                // Ajouter un événement de clic pour rediriger vers la page de détails
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
                    } else if (crypto.id === 'binancecoin') {
                        window.location.href = 'binancecoin_infos.html';
                    }
                });
            }
        }
    });
}

// Fonction pour créer ou mettre à jour les graphiques
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

// Fonction pour formater les grands nombres
function formatLargeNumbers(num) {
    num = parseFloat(num);
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
}

// Fonction de recherche
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

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
    setInterval(fetchCryptoData, 60000);  // Mise à jour toutes les 60 secondes

    document.querySelector('#sort').addEventListener('change', sortAndDisplayData); // Écouter les changements de tri
    searchCrypto();
});