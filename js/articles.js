let currentPage = 1;
const postsPerPage = 6;

async function loadArticles() {
    try {
        const articlesContainer = document.getElementById('articlesContainer');
        if (!articlesContainer) return;
        
        // 使用Worker端点获取文章数据
        const response = await fetch('https://blog.china-zzk.workers.dev/posts');
        
        if (!response.ok) {
            throw new Error('获取文章失败');
        }
        
        const allPosts = await response.json();
        articlesContainer.innerHTML = '';
        
        if (allPosts.length === 0) {
            articlesContainer.innerHTML = '<p class="no-posts">暂无文章，敬请期待。</p>';
            return;
        }
        
        // 应用过滤和排序
        const categoryFilter = document.getElementById('category-filter').value;
        const sortFilter = document.getElementById('sort-filter').value;
        
        let filteredPosts = allPosts;
        
        // 分类过滤
        if (categoryFilter !== 'all') {
            filteredPosts = allPosts.filter(post => 
                post.category.toLowerCase() === categoryFilter
            );
        }
        
        // 排序
        if (sortFilter === 'newest') {
            filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortFilter === 'oldest') {
            filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortFilter === 'popular') {
            // 假设有阅读量字段，这里用id模拟
            filteredPosts.sort((a, b) => b.id - a.id);
        }
        
        // 分页
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        const startIndex = (currentPage - 1) * postsPerPage;
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
        
        // 渲染文章
        paginatedPosts.forEach(post => {
            const articleElement = document.createElement('article');
            articleElement.className = 'article-card';
            articleElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}" class="article-image">
                <div class="article-content">
                    <div class="article-meta">
                        <span><i class="far fa-calendar"></i> ${post.date}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                    </div>
                    <div class="article-tag">${post.category}</div>
                    <h3 class="article-title">${post.title}</h3>
                    <p class="article-excerpt">${post.excerpt}</p>
                    <div class="article-footer">
                        <div class="article-author">
                            <img src="${post.authorAvatar}" alt="${post.author}" class="author-avatar">
                            <span>${post.author}</span>
                        </div>
                        <a href="article.html?id=${post.id}" class="read-more">阅读更多 <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
            articlesContainer.appendChild(articleElement);
        });
        
        // 渲染分页控件
        renderPagination(totalPages);
    } catch (error) {
        console.error('加载文章失败:', error);
        const articlesContainer = document.getElementById('articlesContainer');
        if (articlesContainer) {
            articlesContainer.innerHTML = '<p class="error-msg">无法加载文章，请稍后再试。</p>';
        }
    }
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer || totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // 上一页按钮
    if (currentPage > 1) {
        paginationHTML += `<button class="pagination-button" onclick="changePage(${currentPage - 1})">上一页</button>`;
    }
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="pagination-button ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    // 下一页按钮
    if (currentPage < totalPages) {
        paginationHTML += `<button class="pagination-button" onclick="changePage(${currentPage + 1})">下一页</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    loadArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    
    // 分类过滤事件
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            currentPage = 1;
            loadArticles();
        });
    }
    
    // 排序过滤事件
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', () => {
            currentPage = 1;
            loadArticles();
        });
    }
});