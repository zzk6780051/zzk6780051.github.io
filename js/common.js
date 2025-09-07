// 暗色模式切换
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle && icon) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// 检查本地存储中的主题偏好
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// 移动端菜单
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// 显示消息提示
function showToast(message, isSuccess = true) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.style.background = isSuccess ? 'var(--primary)' : '#e53e3e';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 导航栏滚动效果
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.9)';
        if (document.body.classList.contains('dark-mode')) {
            header.style.background = 'rgba(30, 41, 59, 0.9)';
        }
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'var(--glass)';
        header.style.boxShadow = '0 4px 12px var(--shadow)';
    }
});

// 表单提交处理
const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value.trim();
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        
        // 简单邮箱验证
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast('请输入有效的邮箱地址', false);
            return;
        }
        
        try {
            // 显示加载状态
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 订阅中...';
            submitBtn.disabled = true;
            
            // 使用Worker端点处理订阅
            const response = await fetch('https://blog.china-zzk.workers.dev/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showToast('订阅成功！感谢您的订阅。');
                emailInput.value = '';
            } else {
                showToast(result.error || '订阅失败，请稍后再试。', false);
            }
        } catch (error) {
            console.error('订阅请求失败:', error);
            showToast('订阅失败，请稍后再试。', false);
        } finally {
            // 恢复按钮状态
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// 获取访问计数
async function updateVisitCount() {
    try {
        const visitCountElement = document.getElementById('visit-count');
        if (!visitCountElement) return;
        
        // 使用Worker端点获取访问计数
        const response = await fetch('https://blog.china-zzk.workers.dev/counter');
        
        if (!response.ok) {
            throw new Error('获取访问计数失败');
        }
        
        const data = await response.json();
        visitCountElement.textContent = data.count.toLocaleString();
    } catch (error) {
        console.error('无法获取访问计数:', error);
        const visitCountElement = document.getElementById('visit-count');
        if (visitCountElement) {
            visitCountElement.textContent = '无法获取';
        }
    }
}

// 页面加载时获取访问计数
document.addEventListener('DOMContentLoaded', () => {
    updateVisitCount();
});

// 搜索功能
function initSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-input" placeholder="搜索文章..." id="searchInput">
        <button class="search-button" id="searchButton">
            <i class="fas fa-search"></i>
        </button>
        <div class="search-results" id="searchResults"></div>
    `;
    
    // 将搜索框添加到导航栏
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.parentNode.insertBefore(searchContainer, navActions);
    }
    
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let searchTimeout;
    
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            searchResults.classList.remove('active');
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', () => {
        const query = searchInput.value.trim();
        if (query.length >= 2 && searchResults.innerHTML !== '') {
            searchResults.classList.add('active');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });
}

// 执行搜索
async function performSearch(query) {
    try {
        const response = await fetch(`https://blog.china-zzk.workers.dev/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error('搜索失败');
        }
        
        const results = await response.json();
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">没有找到相关文章</div>';
        } else {
            searchResults.innerHTML = results.map(post => `
                <div class="search-result-item" data-id="${post.id}">
                    <div class="search-result-title">${post.title}</div>
                    <div class="search-result-excerpt">${post.excerpt}</div>
                </div>
            `).join('');
            
            // 添加点击事件
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const postId = item.getAttribute('data-id');
                    window.location.href = `article.html?id=${postId}`;
                });
            });
        }
        
        searchResults.classList.add('active');
    } catch (error) {
        console.error('搜索失败:', error);
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '<div class="search-result-item">搜索失败，请稍后再试</div>';
        searchResults.classList.add('active');
    }
}

// 在DOM加载完成后初始化搜索
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});