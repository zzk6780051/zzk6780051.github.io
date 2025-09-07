async function loadCategoryPosts(category) {
    try {
        const categoryPostsContainer = document.getElementById('categoryPosts');
        if (!categoryPostsContainer) return;
        
        // 使用Worker端点获取文章数据
        const response = await fetch('https://blog.china-zzk.workers.dev/posts');
        
        if (!response.ok) {
            throw new Error('获取文章失败');
        }
        
        const allPosts = await response.json();
        
        // 过滤指定分类的文章
        const filteredPosts = allPosts.filter(post => 
            post.category.toLowerCase() === category
        );
        
        // 更新URL哈希
        window.location.hash = category;
        
        // 显示分类文章区域
        categoryPostsContainer.classList.add('active');
        
        // 渲染分类文章
        categoryPostsContainer.innerHTML = `
            <div class="container">
                <a href="#" class="back-to-categories" id="backToCategories">
                    <i class="fas fa-arrow-left"></i> 返回分类
                </a>
                <div class="category-posts-header">
                    <h2>${category.charAt(0).toUpperCase() + category.slice(1)} 分类</h2>
                    <p>共 ${filteredPosts.length} 篇文章</p>
                </div>
                <div class="category-posts-grid" id="categoryPostsGrid">
                    ${filteredPosts.length > 0 ? 
                        filteredPosts.map(post => `
                            <article class="post-card">
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
                            </article>
                        `).join('') : 
                        '<p class="no-posts">该分类下暂无文章。</p>'
                    }
                </div>
            </div>
        `;
        
        // 添加返回按钮事件
        document.getElementById('backToCategories').addEventListener('click', (e) => {
            e.preventDefault();
            categoryPostsContainer.classList.remove('active');
            window.location.hash = '';
        });
        
        // 滚动到分类文章区域
        categoryPostsContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('加载分类文章失败:', error);
        const categoryPostsContainer = document.getElementById('categoryPosts');
        if (categoryPostsContainer) {
            categoryPostsContainer.innerHTML = '<p class="error-msg">无法加载文章，请稍后再试。</p>';
        }
    }
}

// 添加分类卡片点击事件
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.getAttribute('href').substring(1); // 移除#号
            loadCategoryPosts(category);
        });
    });
    
    // 检查URL哈希
    if (window.location.hash) {
        const category = window.location.hash.substring(1); // 移除#号
        loadCategoryPosts(category);
    }
});