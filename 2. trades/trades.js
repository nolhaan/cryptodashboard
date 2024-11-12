const TRADES_PER_PAGE = 10;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadTradesFromJson();

    document.getElementById('trade-form').addEventListener('submit', function (e) {
        e.preventDefault();

        const entryDate = document.getElementById('entry-date').value;
        const longShort = document.getElementById('long-short').value;
        const crypto = document.getElementById('crypto').value;
        const quantity = parseFloat(document.getElementById('quantity').value);
        const buy = parseFloat(document.getElementById('buy').value);
        const sell = parseFloat(document.getElementById('sell').value);
        const comments = document.getElementById('comments').value;
        const screenshot = document.getElementById('screenshot').value;

        const profit = (sell - buy) * quantity;
        const roi = ((sell - buy) / buy) * 100;

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
            screenshot
        };

        addTradeToTable(trade);
        document.getElementById('trade-form').reset();
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        fetch('2. trades/trades.json')
            .then(response => response.json())
            .then(data => changePage(currentPage - 1, data.trades));
    });

    document.getElementById('next-page').addEventListener('click', () => {
        fetch('2. trades/trades.json')
            .then(response => response.json())
            .then(data => changePage(currentPage + 1, data.trades));
    });
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
        <td>
            ${trade.screenshot ? `<a href="${trade.screenshot}" target="_blank">
                                  <img src="${trade.screenshot}" alt="screenshot" style="width: 50px; height: auto; cursor: pointer;"></a>` : ''}
        </td>
        <td>
            <button class="edit-trade" onclick="editTrade(this)">✏️</button>
            <button class="delete-trade" onclick="deleteTrade(this)">✖</button>
        </td>
    `;

    tradesArchive.appendChild(newRow);
}

function loadTradesFromJson() {
    fetch('2. trades/trades.json')
        .then(response => response.json())
        .then(data => {
            const jsonTrades = data.trades;

            if (!Array.isArray(jsonTrades)) {
                throw new Error('Le fichier JSON ne contient pas un tableau dans la clé "trades".');
            }

            displayTradesByPage(jsonTrades);
            updatePagination(jsonTrades.length);
        })
        .catch(error => console.error('Erreur lors du chargement des trades depuis JSON:', error));
}

function displayTradesByPage(trades) {
    const start = (currentPage - 1) * TRADES_PER_PAGE;
    const end = start + TRADES_PER_PAGE;
    const tradesToDisplay = trades.slice(start, end);

    const tradesArchive = document.getElementById('trades-archive');
    tradesArchive.innerHTML = '';

    tradesToDisplay.forEach(trade => addTradeToTable(trade));
}

function updateTotalBalance(trades) {
    let totalBalance = trades.reduce((acc, trade) => acc + parseFloat(trade.profit), 0);
    document.getElementById('total-balance').textContent = totalBalance.toFixed(8);
}

function updatePagination(totalTrades) {
    const totalPages = Math.ceil(totalTrades / TRADES_PER_PAGE);

    document.getElementById('pagination').innerHTML = `Page ${currentPage} sur ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

function changePage(page, trades) {
    const totalPages = Math.ceil(trades.length / TRADES_PER_PAGE);

    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayTradesByPage(trades);
        updatePagination(trades.length);
    }
}

function deleteTrade(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

function editTrade(button) {
    const row = button.parentElement.parentElement;
    const tradeData = {
        entryDate: row.cells[0].innerText,
        longShort: row.cells[1].innerText,
        crypto: row.cells[2].innerText,
        quantity: parseFloat(row.cells[3].innerText),
        buy: parseFloat(row.cells[4].innerText),
        sell: parseFloat(row.cells[5].innerText),
        profit: parseFloat(row.cells[6].innerText.replace('$', '')),
        roi: parseFloat(row.cells[7].innerText.replace('%', '')),
        comments: row.cells[8].innerText,
        screenshot: row.cells[9].querySelector('img')?.src || ''
    };

    document.getElementById('entry-date').value = tradeData.entryDate;
    document.getElementById('long-short').value = tradeData.longShort;
    document.getElementById('crypto').value = tradeData.crypto;
    document.getElementById('quantity').value = tradeData.quantity;
    document.getElementById('buy').value = tradeData.buy;
    document.getElementById('sell').value = tradeData.sell;
    document.getElementById('comments').value = tradeData.comments;
}