// 从API获取文章数据
async function loadPosts() {
    try {
        const postsContainer = document.getElementById('postsContainer');
        if (!postsContainer) return;
        
        // 使用Worker端点获取文章数据
        const response = await fetch('https://blog.china-zzk.workers.dev/posts');
        
        if (!response.ok) {
            throw new Error('获取文章失败');
        }
        
        const posts = await response.json();
        postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">暂无文章，敬请期待。</p>';
            return;
        }
        
        // 只显示最新的3篇文章
        const recentPosts = posts.slice(0, 3);
        
        recentPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'post-card';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="post-image">
                <div class="post-content">
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${post.date}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <div class="post-tag">${post.category}</div>
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-footer">
                        <div class="post-author">
                            <img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">
                            <span>${post.author}</span>
                        </div>
                        <a href="article.html?id=${post.id}" class="read-more">阅读更多 <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('加载文章失败:', error);
        const postsContainer = document.getElementById('postsContainer');
        if (postsContainer) {
            postsContainer.innerHTML = '<p class="error-msg">无法加载文章，请稍后再试。</p>';
        }
    }
}

// 页面加载时获取数据
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});