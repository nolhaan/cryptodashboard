document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://cryptopanic.com/api/v1/posts/?auth_token=2412dad07cc82ee6b005f95be11e121bfc34304c&public=true';
    const newsContainer = document.getElementById('news-container');
    const newsCountElement = document.getElementById('news-count');
    
    // Vérifiez si l'élément existe dans le DOM
    if (!newsContainer || !newsCountElement) {
        console.error('newsContainer ou newsCountElement est introuvable dans le DOM.');
        return;
    }

    let seenArticles = JSON.parse(localStorage.getItem('seenArticles')) || [];

    function fetchNews() {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const articles = data.results;
                newsContainer.innerHTML = '';

                let unseenCount = 0;
                articles.forEach((article, index) => {
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

                    if (!seenArticles.includes(article.url)) {
                        unseenCount++;
                    }
                });

                newsCountElement.textContent = unseenCount;
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsContainer.innerHTML = '<p>Failed to load news. Please try again later.</p>';
            });
    }

    function markArticleAsSeen(articleUrl) {
        if (!seenArticles.includes(articleUrl)) {
            seenArticles.push(articleUrl);
            localStorage.setItem('seenArticles', JSON.stringify(seenArticles));
            fetchNews();  // Met à jour le nombre de nouvelles après avoir marqué comme vu
        }
    }

    // Initial fetch of news
    fetchNews();

    // Fetch news every 60 seconds
    setInterval(fetchNews, 60000);

    // Mark articles as seen when clicked
    newsContainer.addEventListener('click', function(event) {
        const target = event.target.closest('.news-item');
        if (target && target.tagName === 'A') {
            markArticleAsSeen(target.href);
        }
    });
});
