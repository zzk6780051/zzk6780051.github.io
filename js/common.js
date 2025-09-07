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