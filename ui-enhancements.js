// UI增强功能模块
class UIEnhancements {
    constructor(lifeRingsApp) {
        this.app = lifeRingsApp;
        this.init();
    }
    
    init() {
        this.setupFPSCounter();
        this.setupHelpSystem();
        this.setupKeyboardShortcuts();
        this.setupProgressBar();
        this.setupInteractionEnhancements();
        this.updateRingCounter();
    }
    
    // FPS计数器
    setupFPSCounter() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 60;
        
        const updateFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                frameCount = 0;
                lastTime = currentTime;
                
                const fpsCounter = document.getElementById('fps-counter');
                if (fpsCounter) {
                    fpsCounter.textContent = fps;
                    
                    // 根据FPS调整颜色
                    if (fps >= 50) {
                        fpsCounter.style.color = '#34d399';
                    } else if (fps >= 30) {
                        fpsCounter.style.color = '#fbbf24';
                    } else {
                        fpsCounter.style.color = '#f87171';
                    }
                }
            }
            
            requestAnimationFrame(updateFPS);
        };
        
        updateFPS();
    }
    
    // 帮助系统
    setupHelpSystem() {
        const helpOverlay = document.getElementById('help-overlay');
        const closeHelp = document.getElementById('close-help');
        
        if (closeHelp) {
            closeHelp.addEventListener('click', () => {
                this.hideHelp();
            });
        }
        
        // 点击覆盖层外部关闭
        if (helpOverlay) {
            helpOverlay.addEventListener('click', (e) => {
                if (e.target === helpOverlay) {
                    this.hideHelp();
                }
            });
        }
        
        // 首次加载时显示帮助
        setTimeout(() => {
            this.showHelp();
            setTimeout(() => this.hideHelp(), 4000);
        }, 2000);
    }
    
    showHelp() {
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay) {
            helpOverlay.classList.add('show');
        }
    }
    
    hideHelp() {
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay) {
            helpOverlay.classList.remove('show');
        }
    }
    
    // 键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // 防止在输入框中触发
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                return;
            }
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (this.app.growthState.isPlaying) {
                        this.app.pauseGrowth();
                    } else {
                        this.app.playGrowth();
                    }
                    this.showToast('🎬 ' + (this.app.growthState.isPlaying ? '播放' : '暂停') + '生长动画');
                    break;
                    
                case 'KeyR':
                    e.preventDefault();
                    this.resetCameraPosition();
                    this.showToast('📷 相机位置已重置');
                    break;
                    
                case 'KeyH':
                    e.preventDefault();
                    this.toggleHelp();
                    break;
                    
                case 'KeyF':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                    
                case 'KeyC':
                    e.preventDefault();
                    this.toggleControlPanel();
                    break;
            }
        });
    }
    
    // 重置相机位置
    resetCameraPosition() {
        if (this.app.camera && this.app.controls) {
            this.app.camera.position.set(5, 3, 5);
            this.app.controls.reset();
        }
    }
    
    // 切换帮助显示
    toggleHelp() {
        const helpOverlay = document.getElementById('help-overlay');
        if (helpOverlay) {
            helpOverlay.classList.toggle('show');
        }
    }
    
    // 切换全屏
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('无法进入全屏模式:', err);
                this.showToast('❌ 无法进入全屏模式');
            });
            this.showToast('🖥️ 已进入全屏模式');
        } else {
            document.exitFullscreen();
            this.showToast('🪟 已退出全屏模式');
        }
    }
    
    // 切换控制面板
    toggleControlPanel() {
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
            controlPanel.style.display = controlPanel.style.display === 'none' ? 'block' : 'none';
            this.showToast('⚙️ 控制面板已' + (controlPanel.style.display === 'none' ? '隐藏' : '显示'));
        }
    }
    
    // 进度条设置
    setupProgressBar() {
        const loading = document.getElementById('loading');
        if (loading) {
            const progressFill = loading.querySelector('.progress-fill');
            const progressText = loading.querySelector('.progress-text');
            
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        loading.classList.add('hidden');
                    }, 500);
                }
                
                if (progressFill) progressFill.style.width = progress + '%';
                if (progressText) progressText.textContent = Math.round(progress) + '%';
            }, 100);
        }
    }
    
    // 更新年轮计数器
    updateRingCounter() {
        const ringCounter = document.getElementById('ring-counter');
        if (ringCounter) {
            ringCounter.textContent = this.app.params.ringCount;
        }
    }
    
    // 交互增强
    setupInteractionEnhancements() {
        // 控制面板悬停效果
        const controlPanel = document.getElementById('control-panel');
        if (controlPanel) {
            controlPanel.addEventListener('mouseenter', () => {
                controlPanel.style.transform = 'translateX(-5px)';
            });
            
            controlPanel.addEventListener('mouseleave', () => {
                controlPanel.style.transform = 'translateX(0)';
            });
        }
        
        // 状态栏动画
        this.animateStatusBar();
        
        // 快捷键提示动画
        this.animateShortcuts();
        
        // 导航栏点击事件
        const navIcon = document.querySelector('.nav-icon');
        if (navIcon) {
            navIcon.addEventListener('click', () => {
                this.showAbout();
            });
        }
    }
    
    // 状态栏动画
    animateStatusBar() {
        const statusItems = document.querySelectorAll('.status-item');
        statusItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 1000 + index * 200);
        });
    }
    
    // 快捷键动画
    animateShortcuts() {
        const shortcutItems = document.querySelectorAll('.shortcut-item');
        shortcutItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.4s ease';
                item.style.opacity = '0.7';
                item.style.transform = 'translateX(0)';
            }, 1500 + index * 100);
        });
    }
    
    // 显示关于信息
    showAbout() {
        this.showModal({
            title: '🌳 关于生命年轮',
            content: `
                <p>这是一个交互式的3D树木年轮可视化应用，通过Three.js技术展现树木生长的奥秘。</p>
                <br>
                <p><strong>功能特点：</strong></p>
                <ul style="margin-left: 1rem; margin-top: 0.5rem;">
                    <li>• 3D年轮可视化</li>
                    <li>• 生长动画模拟</li>
                    <li>• 气候因子影响</li>
                    <li>• 实时交互控制</li>
                </ul>
                <br>
                <p><small>按 H 键可随时查看操作帮助</small></p>
            `
        });
    }
    
    // 通用模态框
    showModal({title, content}) {
        const modal = document.createElement('div');
        modal.className = 'help-overlay show';
        modal.innerHTML = `
            <div class="help-content">
                <h3>${title}</h3>
                <div style="text-align: left; line-height: 1.6;">
                    ${content}
                </div>
                <button class="close-help" style="margin-top: 1.5rem;">关闭</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-help').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // 显示Toast消息
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--bg-glass);
            backdrop-filter: blur(20px);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-accent);
            z-index: 9999;
            font-size: 0.875rem;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // 显示动画
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // 自动消失
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }
    
    // 增强年轮信息显示
    enhanceRingInfo(ringData) {
        const infoDiv = document.getElementById('ring-info');
        
        const html = `
            <div class="ring-detail">
                <div class="ring-year">🌳 ${ringData.year}年</div>
                <div class="ring-data">📅 树龄: ${ringData.age} 年</div>
                <div class="ring-data">📏 厚度: ${(ringData.thickness * 100).toFixed(1)} cm</div>
                <div class="ring-data">🌤️ 气候: ${this.getWeatherText(ringData.weather)}</div>
                <div class="ring-data">📐 半径: ${ringData.radius.toFixed(2)} m</div>
            </div>
            <div class="ring-events">
                <strong>📋 相关事件:</strong>
                ${ringData.events.map(event => `<div class="ring-data">• ${event}</div>`).join('')}
            </div>
            <div class="ring-stats">
                <small style="color: var(--text-muted); margin-top: 0.75rem; display: block;">
                    💡 提示: 不同颜色代表不同的生长年份
                </small>
            </div>
        `;
        
        infoDiv.innerHTML = html;
        
        // 添加淡入动画
        infoDiv.style.opacity = '0';
        infoDiv.style.transform = 'translateY(10px)';
        
        requestAnimationFrame(() => {
            infoDiv.style.transition = 'all 0.3s ease';
            infoDiv.style.opacity = '1';
            infoDiv.style.transform = 'translateY(0)';
        });
    }
    
    getWeatherText(weather) {
        const weatherMap = {
            'normal': '正常',
            'good': '丰年',
            'poor': '歉年',
            'drought': '干旱'
        };
        return weatherMap[weather] || weather;
    }
}

// 启动时初始化UI增强
document.addEventListener('DOMContentLoaded', () => {
    // 添加启动动画
    const app = document.getElementById('app');
    if (app) {
        app.style.opacity = '0';
        app.style.transform = 'scale(0.95)';
        
        requestAnimationFrame(() => {
            app.style.transition = 'all 0.5s ease';
            app.style.opacity = '1';
            app.style.transform = 'scale(1)';
        });
    }
    
    // 等待主应用初始化完成后再添加UI增强
    setTimeout(() => {
        const lifeRingsApp = window.lifeRingsInstance;
        if (lifeRingsApp) {
            window.uiEnhancements = new UIEnhancements(lifeRingsApp);
        }
    }, 1000);
});
