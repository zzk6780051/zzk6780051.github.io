document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                // 显示加载状态
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
                submitBtn.disabled = true;
                
                // 使用Worker端点处理联系表单
                const response = await fetch('https://blog.china-zzk.workers.dev/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showToast('消息发送成功！我会尽快回复您。');
                    contactForm.reset();
                } else {
                    showToast(result.error || '发送失败，请稍后再试。', false);
                }
            } catch (error) {
                console.error('发送消息失败:', error);
                showToast('发送失败，请稍后再试。', false);
            } finally {
                // 恢复按钮状态
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});