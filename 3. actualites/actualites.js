document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'https://cryptopanic.com/api/v1/posts/?auth_token=2412dad07cc82ee6b005f95be11e121bfc34304c&public=true';
    const newsContainer = document.getElementById('news-container');
    const newsCountElement = document.getElementById('news-count');
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Chargement des nouvelles...';
    loadingMessage.classList.add('loading-message');
    newsContainer.appendChild(loadingMessage);

    if (!newsContainer || !newsCountElement) {
        console.error('newsContainer ou newsCountElement est introuvable dans le DOM.');
        return;
    }

    let seenArticles = JSON.parse(localStorage.getItem('seenArticles')) || [];

    async function fetchNews() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            displayArticles(data.results);
        } catch (error) {
            console.error('Erreur de récupération des nouvelles :', error);
            newsContainer.innerHTML = '<p>Échec du chargement des nouvelles. Veuillez réessayer plus tard.</p>';
        }
    }

    function displayArticles(articles) {
        newsContainer.innerHTML = '';
        let unseenCount = 0;

        articles.forEach((article) => {
            const isSeen = seenArticles.includes(article.url);

            const newsItem = document.createElement('a');
            newsItem.className = 'news-item';
            newsItem.href = article.url;
            newsItem.target = '_blank';

            const title = document.createElement('h2');
            title.textContent = article.title;
            newsItem.appendChild(title);

            const details = document.createElement('p');
            details.textContent = `${article.published_at} | ${article.source.name}`;
            newsItem.appendChild(details);

            newsContainer.appendChild(newsItem);

            if (!isSeen) unseenCount++;
        });

        newsCountElement.textContent = unseenCount;
    }

    function markArticleAsSeen(articleUrl) {
        if (!seenArticles.includes(articleUrl)) {
            seenArticles.push(articleUrl);
            if (seenArticles.length > 100) seenArticles.shift();
            localStorage.setItem('seenArticles', JSON.stringify(seenArticles));
            updateUnseenCount();
        }
    }

    function updateUnseenCount() {
        const articles = Array.from(newsContainer.querySelectorAll('.news-item'));
        let unseenCount = 0;

        articles.forEach((article) => {
            if (!seenArticles.includes(article.href)) unseenCount++;
        });

        newsCountElement.textContent = unseenCount;
    }

    fetchNews();
    setInterval(fetchNews, 60000);

    newsContainer.addEventListener('click', function (event) {
        const target = event.target.closest('.news-item');
        if (target && target.tagName === 'A') {
            markArticleAsSeen(target.href);
        }
    });
});