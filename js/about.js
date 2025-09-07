// 技能进度条动画
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
    });
}

// 时间轴动画
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    timelineItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(item);
    });
}

// 获取统计数据
async function fetchStats() {
    try {
        // 获取文章数量
        const postsResponse = await fetch('https://blog.china-zzk.workers.dev/posts');
        if (postsResponse.ok) {
            const posts = await postsResponse.json();
            document.getElementById('postsCount').textContent = posts.length;
        }
        
        // 获取订阅者数量
        const subscribersResponse = await fetch('https://blog.china-zzk.workers.dev/subscribers/count');
        if (subscribersResponse.ok) {
            const data = await subscribersResponse.json();
            document.getElementById('subscribersCount').textContent = data.count;
        }
        
        // 获取总访问量
        const counterResponse = await fetch('https://blog.china-zzk.workers.dev/counter');
        if (counterResponse.ok) {
            const data = await counterResponse.json();
            document.getElementById('totalViews').textContent = data.count;
        }
    } catch (error) {
        console.error('获取统计数据失败:', error);
    }
}

// 数字动画效果
function animateNumbers() {
    const counters = document.querySelectorAll('.achievement-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let count = 0;
        const duration = 2000; // 动画持续时间(ms)
        const increment = target / (duration / 16); // 每16ms增加的值
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                if (count > target) count = target;
                counter.textContent = Math.floor(count);
                requestAnimationFrame(updateCount);
            }
        };
        
        updateCount();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    animateSkillBars();
    animateTimeline();
    fetchStats();
    
    // 延迟执行数字动画，等待统计数据加载
    setTimeout(animateNumbers, 1000);
});