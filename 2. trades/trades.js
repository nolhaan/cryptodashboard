const TRADES_PER_PAGE = 10;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    compressExistingImages(); // Compresser les images existantes lors du chargement
    loadTrades();

    document.getElementById('trade-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const entryDate = document.getElementById('entry-date').value;
        const longShort = document.getElementById('long-short').value;
        const crypto = document.getElementById('crypto').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const buy = parseFloat(document.getElementById('buy').value);
        const sell = parseFloat(document.getElementById('sell').value);
        const comments = document.getElementById('comments').value;
        const screenshot = document.getElementById('screenshot').files[0];

        const profit = (sell - buy) * quantity;
        const roi = ((sell - buy) / buy) * 100;

        if (screenshot) {
            const reader = new FileReader();
            reader.onloadend = function () {
                const img = new Image();
                img.src = reader.result;
                
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    const screenshotBase64 = canvas.toDataURL('image/jpeg', 0.7);

                    const trade = {
                        entryDate,
                        longShort,
                        crypto,
                        quantity: parseFloat(quantity.toFixed(8)),
                        buy: parseFloat(buy.toFixed(8)),
                        sell: parseFloat(sell.toFixed(8)),
                        profit: parseFloat(profit.toFixed(8)),
                        roi: parseFloat(roi.toFixed(2)),
                        comments,
                        screenshot: screenshotBase64
                    };

                    if (e.target.dataset.index !== undefined) {
                        const index = parseInt(e.target.dataset.index, 10);
                        updateTrade(trade, index);
                        delete e.target.dataset.index;
                    } else {
                        saveTrade(trade);
                    }

                    updateTotalBalance();
                    document.getElementById('trade-form').reset();
                    loadTrades(); // Recharger les transactions pour mettre à jour le tableau
                };
            };
            reader.readAsDataURL(screenshot);
        } else {
            const trade = {
                entryDate,
                longShort,
                crypto,
                quantity: parseFloat(quantity.toFixed(8)),
                buy: parseFloat(buy.toFixed(8)),
                sell: parseFloat(sell.toFixed(8)),
                profit: parseFloat(profit.toFixed(8)),
                roi: parseFloat(roi.toFixed(2)),
                comments,
                screenshot: ''
            };

            if (e.target.dataset.index !== undefined) {
                const index = parseInt(e.target.dataset.index, 10);
                updateTrade(trade, index);
                delete e.target.dataset.index;
            } else {
                saveTrade(trade);
            }

            updateTotalBalance();
            document.getElementById('trade-form').reset();
            loadTrades(); // Reload trades to update the table
        }
    });

    document.getElementById('prev-page').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('next-page').addEventListener('click', () => changePage(currentPage + 1));
});

function formatNumber(num, decimals) {
    if (typeof num !== 'number') {
        num = parseFloat(num);
    }
    return num.toFixed(decimals).replace(/\.?0+$/, '');
}

function addTradeToTable(trade) {
    const tradesArchive = document.getElementById('trades-archive');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${trade.entryDate}</td>
        <td class="${trade.longShort}">${trade.longShort}</td>
        <td>${trade.crypto}</td>
        <td>${formatNumber(trade.quantity, 8)}</td>
        <td>${formatNumber(trade.buy, 8)}</td>
        <td>${formatNumber(trade.sell, 8)}</td>
        <td class="profit-${trade.profit >= 0 ? 'positive' : 'negative'}">${formatNumber(trade.profit, 2)}$</td>
        <td class="roi-${trade.roi >= 0 ? 'positive' : 'negative'}">${formatNumber(trade.roi, 2)}%</td>
        <td>${trade.comments}</td>
        <td>${trade.screenshot ? `<img src="${trade.screenshot}" alt="screenshot" width="50">` : ''}</td>
        <td>
            <button class="edit-trade" onclick="editTrade(this)">✏️</button>
            <button class="delete-trade" onclick="deleteTrade(this)">✖</button>
        </td>
    `;

    tradesArchive.appendChild(newRow);
}

function saveTrade(trade) {
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.push(trade);
    localStorage.setItem('trades', JSON.stringify(trades));
}

function loadTrades() {
    const tradesArchive = document.getElementById('trades-archive');
    tradesArchive.innerHTML = ''; // Clear the table
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    const start = (currentPage - 1) * TRADES_PER_PAGE;
    const end = start + TRADES_PER_PAGE;
    const tradesToDisplay = trades.slice(start, end);
    tradesToDisplay.forEach(trade => addTradeToTable(trade));
    updateTotalBalance();
    updatePagination(trades.length);
}

function updateTotalBalance() {
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    let totalBalance = trades.reduce((acc, trade) => acc + parseFloat(trade.profit), 0);
    localStorage.setItem('totalBalance', totalBalance.toFixed(8));
}

function updatePagination(totalTrades) {
    const totalPages = Math.ceil(totalTrades / TRADES_PER_PAGE);
    document.getElementById('pagination').innerHTML = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

function changePage(page) {
    const totalTrades = JSON.parse(localStorage.getItem('trades')).length;
    const totalPages = Math.ceil(totalTrades / TRADES_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        loadTrades();
    }
}

function deleteTrade(button) {
    const row = button.parentElement.parentElement;
    const index = Array.from(row.parentElement.children).indexOf(row);
    const pageIndex = (currentPage - 1) * TRADES_PER_PAGE + index;
    row.remove();
    removeTradeFromStorage(pageIndex);
    updateTotalBalance();
    loadTrades(); // Reload trades to update the table
}

function removeTradeFromStorage(index) {
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.splice(index, 1);
    localStorage.setItem('trades', JSON.stringify(trades));
}

function editTrade(button) {
    const row = button.parentElement.parentElement;
    const index = Array.from(row.parentElement.children).indexOf(row);
    const pageIndex = (currentPage - 1) * TRADES_PER_PAGE + index;
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    const trade = trades[pageIndex];

    document.getElementById('entry-date').value = trade.entryDate;
    document.getElementById('long-short').value = trade.longShort;
    document.getElementById('crypto').value = trade.crypto;
    document.getElementById('quantity').value = trade.quantity;
    document.getElementById('buy').value = trade.buy;
    document.getElementById('sell').value = trade.sell;
    document.getElementById('comments').value = trade.comments;

    document.getElementById('trade-form').dataset.index = pageIndex;

    row.remove();
    removeTradeFromStorage(pageIndex);
    updateTotalBalance();
}

function updateTrade(trade, index) {
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.splice(index, 0, trade);
    localStorage.setItem('trades', JSON.stringify(trades));
    loadTrades(); // Reload trades to update the table
}

function compressImage(imageData, callback) {
    const img = new Image();
    img.src = imageData;

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedImageData = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedImageData);
    };
}

function compressExistingImages() {
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    let updated = false;

    trades.forEach((trade, index) => {
        if (trade.screenshot && trade.screenshot.startsWith('data:image/')) {
            compressImage(trade.screenshot, (compressedImageData) => {
                trades[index].screenshot = compressedImageData;
                updated = true;
                
                localStorage.setItem('trades', JSON.stringify(trades));
                loadTrades();
            });
        }
    });

    if (updated) {
        alert("All existing images have been compressed!");
    }
}