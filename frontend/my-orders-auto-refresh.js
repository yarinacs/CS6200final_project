// Auto-refresh functionality for My Orders page
let refreshInterval = null;
let refreshCount = 0;
const MAX_REFRESHES = 3;
const REFRESH_DELAY = 5000; // 5 seconds

function startAutoRefresh(userName) {
    if (!userName) return;
    
    // 清除之前的interval
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshCount = 0;
    
    console.log('🔄 Auto-refresh started: Will refresh 3 times every 5 seconds');
    
    refreshInterval = setInterval(() => {
        refreshCount++;
        console.log(`🔄 Auto-refreshing... (${refreshCount}/${MAX_REFRESHES})`);
        
        // 重新加载订单
        loadMyOrders(userName);
        
        // 达到最大刷新次数后停止
        if (refreshCount >= MAX_REFRESHES) {
            clearInterval(refreshInterval);
            refreshInterval = null;
            console.log('✅ Auto-refresh completed');
            
            // 显示提示
            showNotification('✅ Orders updated! Page will no longer auto-refresh.');
        }
    }, REFRESH_DELAY);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        refreshCount = 0;
        console.log('⏹️ Auto-refresh stopped manually');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #00d100;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 9999;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加样式动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
