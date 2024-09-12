const cryptoIds = ['bitcoin', 'ethereum', 'tether', 'solana', 'xrp'];  // CryptoIds

async function fetchCryptoData() {
    try {
        const response = await axios.get('https://api.coincap.io/v2/assets', {
            params: {
                ids: cryptoIds.join(',')
            }
        });

        const data = response.data.data;

        data.forEach(async (crypto, index) => {
            if (cryptoIds.includes(crypto.id)) {
                const cryptoElement = document.querySelectorAll('.sub-card')[index];

                if (cryptoElement) {
                    // Create and append the image element
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

                    // Append the acronym
                    const acronymSpan = document.createElement('span');
                    acronymSpan.className = 'acronym';
                    acronymSpan.textContent = crypto.symbol.toUpperCase();
                    cryptoNameElement.appendChild(acronymSpan);

                    // Update other details
                    cryptoElement.querySelector('.price').textContent = `$${parseFloat(crypto.priceUsd).toFixed(2)}`;
                    cryptoElement.querySelector('.change-24h').textContent = `${parseFloat(crypto.changePercent24Hr).toFixed(2)}%`;
                    cryptoElement.querySelector('.market-cap').textContent = `$${formatLargeNumbers(crypto.marketCapUsd)}`;
                    cryptoElement.querySelector('.volume-24h').textContent = `$${formatLargeNumbers(crypto.volumeUsd24Hr)}`;

                    const chartCtx = cryptoElement.querySelector('canvas').getContext('2d');
                    const gradient = chartCtx.createLinearGradient(0, 0, 0, chartCtx.canvas.height);
                    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.5)');
                    gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');

                    // Fetch 24-hour historical data with minute intervals
                    const historyResponse = await axios.get(`https://api.coincap.io/v2/assets/${crypto.id}/history`, {
                        params: {
                            interval: 'm15',
                            start: Date.now() - 24 * 60 * 60 * 1000,
                            end: Date.now()
                        }
                    });

                    const historyData = historyResponse.data.data;
                    const sparklineData = historyData.map(entry => parseFloat(entry.priceUsd));

                    new Chart(chartCtx, {
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
                                x: {
                                    display: false,
                                },
                                y: {
                                    display: false,
                                    suggestedMin: Math.min(...sparklineData),
                                    suggestedMax: Math.max(...sparklineData)
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                tooltip: {
                                    enabled: true,
                                    callbacks: {
                                        label: function(context) {
                                            return `Price 24h: ${context.parsed.y.toFixed(2)}`;
                                        }
                                    }
                                }
                            },
                            elements: {
                                line: {
                                    borderWidth: 2,
                                    borderColor: '#FFFF00',
                                    backgroundColor: gradient,
                                    fill: true,
                                    tension: 0.4,
                                },
                                point: {
                                    radius: 0,
                                }
                            }
                        }
                    });

                    // Add click event to redirect to the detail page
                    cryptoElement.addEventListener('click', () => {
                        if (crypto.id === 'bitcoin') {
                            window.location.href = 'bitcoin_infos.html';
                        } else if (crypto.id === 'ethereum') {
                            window.location.href = 'ethereum_infos.html';
                        } else if (crypto.id === 'tether') {  // Condition pour Tether
                            window.location.href = 'tether_infos.html';
                        } else if (crypto.id === 'solana') {  // Condition pour Solana
                            window.location.href = 'solana_infos.html';
                        } else if (crypto.id === 'xrp') {  // Condition pour XRP
                            window.location.href = 'ripple_infos.html';
                        }
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    }
}

function formatLargeNumbers(num) {
    num = parseFloat(num);
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else {
        return num.toLocaleString();
    }
}

// Search function
function searchCrypto() {
    const searchInput = document.querySelector('#search');
    if (!searchInput) {
        console.error('Search input element not found.');
        return;
    }
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredCryptoIds = cryptoIds.filter(id => id.toLowerCase().includes(query));

        // Hide all elements first
        document.querySelectorAll('.sub-card').forEach(card => {
            card.style.display = 'none';
        });

        // Show only the filtered elements
        filteredCryptoIds.forEach(id => {
            const index = cryptoIds.indexOf(id);
            if (index !== -1) {
                document.querySelectorAll('.sub-card')[index].style.display = 'block';
            }
        });
    });
}

// Ensure DOM is fully loaded before initializing the script
document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
    setInterval(fetchCryptoData, 1000);  // Set interval to 1000 milliseconds (1 second)

    // Initialize search functionality
    searchCrypto();
});