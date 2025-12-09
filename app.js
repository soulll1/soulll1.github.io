// 生命年轮 - Three.js 实现
class LifeAnnualRings {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.rings = [];
        this.ringGroup = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.labelContainer = null;
        this.yearLabels = [];
        this.yearPlacements = [];
        
        // 年轮参数
        this.params = {
            ringCount: 26,
            trunkRadius: 0.5,
            ringThickness: 0.05,
            growthSpeed: 1,
            weatherFactor: 'normal',
            showAgeColors: true,
            showWireframe: false,
            autoRotate: false
        };
        
        // 生长模拟状态
        this.growthState = {
            isPlaying: false,
            currentRing: 0,
            startTime: 0,
            animationId: null
        };
        
        // 年轮数据
        this.ringData = [];
        
        // 里程碑数据（年份、标题与详细描述）
        this.milestones = {
            2001: {
                title: '肇基启航',
                detailTitle: '2001年6月8日 · 深圳研究生院挂牌',
                detailText: '清华大学深圳研究生院正式挂牌，开启了清华大学异地办学的创新探索篇章，成为SIGS发展的起点。',
                image: 'img/2001.png'
            },
            2004: {
                title: '生根发芽',
                detailTitle: '2004年3月 · 首批研究生报到与学部成立',
                detailText: '首批400名全日制研究生在深圳报到上课，生命科学学部同期成立，标志着教学与科研体系在深圳落地生根。',
                image: 'img/2004.png'
            },
            2007: {
                title: '定位发展',
                detailTitle: '2007年 · 明确“根系清华、立足深圳”定位',
                detailText: '在“十一五”规划中明确“根系清华、立足深圳”的办学定位，强调与本部差异化发展，聚焦物流、海洋等特色学科。',
                image: 'img/2007.png'
            },
            2010: {
                title: '整合跨越',
                detailTitle: '2010年 · 学科整合为六个学部',
                detailText: '为促进学科交叉，将原有学部整合为生命与健康、能源与环境等六个学部，系统性构建创新科研架构。',
                image: 'img/2010.png'
            },
            2011: {
                title: '深耕特色',
                detailTitle: '2011年7月 · 海洋学部成立',
                detailText: '海洋科学与技术学部正式成立，集中力量深耕海洋领域，成为SIGS的重要特色学科方向。',
                image: 'img/2011.png'
            },
            2014: {
                title: '国际携手',
                detailTitle: '2014年9月7日 · 签署共建TBSI协议',
                detailText: '清华大学、伯克利加州大学与深圳市政府签署协议，共建清华-伯克利深圳学院（TBSI），开创国际化合作新范式。',
                image: 'img/2014.png'
            },
            2015: {
                title: '实体运行',
                detailTitle: '2015年10月20日 · TBSI揭牌成立',
                detailText: 'TBSI在南山智园正式揭牌，标志着这一国际合作学院进入实体化运行阶段。',
                image: 'img/2015.png'
            },
            2016: {
                title: '战略升级',
                detailTitle: '2016年11月4日 · 签署共建国际研究生院协议',
                detailText: '清华大学与深圳市人民政府签署协议，在深圳研究生院和TBSI基础上，共建清华大学深圳国际研究生院，实现战略升级。',
                image: 'img/2016.png'
            },
            2018: {
                title: '官方认证',
                detailTitle: '2018年11月1日 · 教育部批复成立',
                detailText: '教育部正式批复同意成立清华大学深圳国际研究生院，为学院发展赋予国家层面的制度保障和新起点。',
                image: 'img/2018.png'
            },
            2019: {
                title: '新程揭牌',
                detailTitle: '2019年3月 · 国际研究生院揭牌',
                detailText: 'SIGS举行揭牌仪式并明确“高层次国际合作、高水平人才培养、高质量的创新实践”的“三高”定位，全面启航。',
                image: 'img/2019.png'
            },
            2023: {
                title: '重点突破',
                detailTitle: '2023年 · 五学科入选高水平大学建设计划',
                detailText: '材料科学、环境科学、健康工程、海洋技术、数据科学等五个学科入选高水平大学建设计划重点学科，彰显SIGS的核心竞争力。',
                image: 'img/2023.png'
            },
            2024: {
                title: '深化合作',
                detailTitle: '2023年11月5日 · 签署全面深化合作协议',
                detailText: '清华大学与深圳市进一步签署全面深化合作协议，在原有合作基础上推动教育、科研与产业协同发展迈上新台阶。',
                image: 'img/2024.png'
            },
            2026: {
                title: '未来已来',
                detailTitle: '2026及未来 · 迈向智能与可持续未来',
                detailText: '站在新的历史起点，SIGS将持续深化教育改革，聚焦人工智能、可持续发展等前沿领域，培养引领未来的科技领袖。',
                image: 'img/2026.png'
            }
        };
        
        this.init();
        this.setupEventListeners();
        this.generateRingData();
        this.createRings();
        this.hideLoading();
    }
    
    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2E0854);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(5, 3, 5);
        
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);
        
        // 创建轨道控制器（绑定在画布容器上，避免被标签层遮挡交互）
        const canvasContainer = document.getElementById('canvas-container');
        this.controls = new THREE.OrbitControls(this.camera, canvasContainer);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 20;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // 设置光照
        this.setupLighting();
        
        // 创建年轮组
        this.ringGroup = new THREE.Group();
        this.scene.add(this.ringGroup);
        
        // 启动渲染循环
        this.animate();
        
        // 添加窗口大小调整监听
        window.addEventListener('resize', () => this.onWindowResize());
        
        // 添加鼠标点击监听
        this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
    }
    
    setupLighting() {
        // 环境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // 主光源
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        this.scene.add(directionalLight);
        
        // 补充光源
        const fillLight = new THREE.DirectionalLight(0x88ccaa, 0.3);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);
        
        // 点光源增加氛围
        const pointLight = new THREE.PointLight(0x66bb6a, 0.5, 30);
        pointLight.position.set(0, 8, 0);
        this.scene.add(pointLight);
    }
    
    generateRingData() {
        this.ringData = [];
        const startYear = 2001;
        const endYear = 2026;
        const years = [];
        for (let year = startYear; year <= endYear; year++) {
            years.push(year);
        }
        const targetCount = Math.min(this.params.ringCount, years.length);
        const selectedYears = years.slice(0, targetCount);
        this.params.ringCount = selectedYears.length;
        
        for (let i = 0; i < selectedYears.length; i++) {
            const year = selectedYears[i];
            const age = i + 1;
            
            // 生成随机的年轮特征
            const weatherTypes = ['normal', 'good', 'poor', 'drought'];
            const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
            
            let thickness = this.params.ringThickness;
            let color = this.getColorByAge(age);
            
            // 根据天气因子调整厚度
            switch (weather) {
                case 'good':
                    thickness *= 1.5;
                    break;
                case 'poor':
                    thickness *= 0.7;
                    break;
                case 'drought':
                    thickness *= 0.5;
                    color = new THREE.Color(0.6, 0.3, 0.2); // 褐色
                    break;
                default:
                    thickness *= (0.8 + Math.random() * 0.4); // 正常变化
            }
            
            this.ringData.push({
                year,
                age,
                thickness,
                weather,
                color,
                radius: this.params.trunkRadius + i * this.params.ringThickness * 2,
                events: this.generateYearEvents(year, weather),
                title: this.milestones[year]?.title || null
            });
        }
    }
    
    generateYearEvents(year, weather) {
        const events = [];
        
        // 根据天气生成事件
        switch (weather) {
            case 'good':
                events.push('丰年，生长旺盛');
                break;
            case 'poor':
                events.push('歉年，生长缓慢');
                break;
            case 'drought':
                events.push('干旱年，生长受限');
                break;
            default:
                events.push('正常生长年份');
        }
        
        // 随机添加一些特殊事件
        if (Math.random() < 0.3) {
            const specialEvents = [
                '虫害影响',
                '火灾痕迹',
                '移植适应',
                '修剪影响',
                '施肥促进',
                '病害抵抗'
            ];
            events.push(specialEvents[Math.floor(Math.random() * specialEvents.length)]);
        }
        
        return events;
    }
    
    getColorByAge(age) {
        if (!this.params.showAgeColors) {
            return new THREE.Color(0.4, 0.3, 0.2); // 默认木色
        }
        
        // 根据年龄生成颜色渐变
        const hue = 0.1 - (age / this.params.ringCount) * 0.05; // 从黄色到棕色
        const saturation = 0.6 + (age / this.params.ringCount) * 0.3;
        const lightness = 0.3 + (age / this.params.ringCount) * 0.2;
        
        return new THREE.Color().setHSL(hue, saturation, lightness);
    }
    
    createRings() {
        // 清除现有年轮
        this.rings.forEach(ring => {
            this.ringGroup.remove(ring);
        });
        this.rings = [];
        this.clearYearLabels();
        this.yearPlacements = [];
        
        // 创建新年轮
        for (let i = 0; i < this.ringData.length; i++) {
            const ringData = this.ringData[i];
            const ring = this.createSingleRing(ringData, i);
            this.rings.push(ring);
            this.ringGroup.add(ring);
        }
        
        // 初始时隐藏所有年轮（用于生长动画）
        if (this.growthState.isPlaying) {
            this.rings.forEach((ring, index) => {
                if (index >= this.growthState.currentRing) {
                    ring.visible = false;
                }
            });
        }
        
        this.createYearLabels();
        this.updateRingCountDisplay();
    }
    
    createSingleRing(ringData, index) {
        const innerRadius = ringData.radius;
        const outerRadius = innerRadius + ringData.thickness;
        
        // 创建年轮几何体
        const geometry = new THREE.RingGeometry(
            innerRadius,
            outerRadius,
            32,
            1
        );
        
        // 创建材质
        const material = new THREE.MeshLambertMaterial({
            color: ringData.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            wireframe: this.params.showWireframe
        });
        
        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = -Math.PI / 2; // 水平放置
        ring.position.y = index * 0.1; // 轻微的高度分层
        
        // 存储年轮数据
        ring.userData = {
            ringData,
            index,
            originalColor: ringData.color.clone()
        };
        
        return ring;
    }
    
    clearYearLabels() {
        if (this.yearLabels && this.yearLabels.length > 0) {
            this.yearLabels.forEach(labelInfo => {
                if (labelInfo.element && labelInfo.element.parentNode) {
                    labelInfo.element.parentNode.removeChild(labelInfo.element);
                }
            });
        }
        this.yearLabels = [];
    }
    
    ensureLabelContainer() {
        if (!this.labelContainer) {
            const container = document.getElementById('canvas-container');
            this.labelContainer = document.createElement('div');
            this.labelContainer.className = 'ring-labels';
            container.appendChild(this.labelContainer);
        }
    }
    
    createYearLabels() {
        this.ensureLabelContainer();
        this.clearYearLabels();
        this.computeYearPlacements();
        
        // 只为里程碑年份创建标签，并可点击查看详情
        this.yearLabels = this.rings
            .filter(ring => {
                const year = ring.userData.ringData.year;
                return this.milestones.hasOwnProperty(year);
            })
            .map((ring) => {
                const ringData = ring.userData.ringData;
                const label = document.createElement('div');
                label.className = 'ring-label';
                
                // 创建年份和标题
                const yearSpan = document.createElement('span');
                yearSpan.className = 'label-year';
                yearSpan.textContent = ringData.year;
                
                const titleSpan = document.createElement('span');
                titleSpan.className = 'label-title';
                titleSpan.textContent = ringData.title || '';
                
                label.appendChild(yearSpan);
                if (ringData.title) {
                    label.appendChild(titleSpan);
                }
                
                label.dataset.year = ringData.year;
                
                // 点击年份标签时显示对应里程碑详情
                label.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.highlightRing(ring);
                    this.displayMilestoneDetail(ringData);
                });
                
                this.labelContainer.appendChild(label);
                return { element: label, ring, placement: this.yearPlacements[ringData.year] };
            });
        
        this.updateLabelPositions();
    }
    
    computeYearPlacements() {
        // 只计算里程碑年份的位置
        const milestoneRings = this.rings.filter(ring => {
            const year = ring.userData.ringData.year;
            return this.milestones.hasOwnProperty(year);
        });
        
        const count = milestoneRings.length;
        if (!count) {
            this.yearPlacements = [];
            return;
        }
        
        const fullCircle = Math.PI * 2;
        const baseSpacing = fullCircle / count;
        const startAngle = -Math.PI / 2;
        
        // 创建年份到位置的映射
        this.yearPlacements = {};
        milestoneRings.forEach((ring, index) => {
            const year = ring.userData.ringData.year;
            const angle = startAngle + index * baseSpacing;
            const radialOffset = (index % 2 === 0 ? 0.04 : -0.03);
            const height = 0.01 + Math.sin(angle * 1.8) * 0.01;
            this.yearPlacements[year] = { angle, radialOffset, height };
        });
    }
    
    updateLabelPositions() {
        if (!this.yearLabels || this.yearLabels.length === 0) return;
        
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const projectionVector = new THREE.Vector3();
        const worldPosition = new THREE.Vector3();
        const localPoint = new THREE.Vector3();
        
        this.yearLabels.forEach(({ element, ring, placement }) => {
            if (!ring.visible || !placement) {
                element.style.display = 'none';
                return;
            }
            
            const ringData = ring.userData.ringData;
            const radius = ringData.radius + ringData.thickness * 0.5 + (placement.radialOffset || 0);
            const angle = placement.angle || 0;
            const heightOffset = placement.height ?? 0.01;
            localPoint.set(
                radius * Math.cos(angle),
                -radius * Math.sin(angle),
                heightOffset
            );
            ring.localToWorld(worldPosition.copy(localPoint));
            projectionVector.copy(worldPosition).project(this.camera);
            
            if (projectionVector.z < -1 || projectionVector.z > 1) {
                element.style.display = 'none';
                return;
            }
            
            const x = (projectionVector.x * 0.5 + 0.5) * width;
            const y = (-projectionVector.y * 0.5 + 0.5) * height;
            
            element.style.display = 'block';
            element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        });
    }
    
    updateRingCountDisplay() {
        const ringCounter = document.getElementById('ring-counter');
        const ringCountValue = document.getElementById('ring-count-value');
        if (ringCounter) {
            ringCounter.textContent = this.rings.length;
        }
        if (ringCountValue) {
            ringCountValue.textContent = this.params.ringCount;
        }
    }
    
    setActiveLabel(targetRing) {
        if (!this.yearLabels) return;
        this.yearLabels.forEach(({ element, ring }) => {
            element.classList.toggle('active', ring === targetRing);
        });
    }
    
    // 生长动画控制
    playGrowth() {
        if (this.growthState.isPlaying) return;
        
        this.growthState.isPlaying = true;
        this.growthState.currentRing = 0;
        this.growthState.startTime = Date.now();
        
        // 隐藏所有年轮
        this.rings.forEach(ring => {
            ring.visible = false;
        });
        
        this.animateGrowth();
    }
    
    pauseGrowth() {
        this.growthState.isPlaying = false;
        if (this.growthState.animationId) {
            cancelAnimationFrame(this.growthState.animationId);
        }
    }
    
    resetGrowth() {
        this.pauseGrowth();
        this.growthState.currentRing = 0;
        
        // 显示所有年轮
        this.rings.forEach(ring => {
            ring.visible = true;
        });
    }
    
    animateGrowth() {
        if (!this.growthState.isPlaying) return;
        
        const currentTime = Date.now();
        const elapsed = (currentTime - this.growthState.startTime) * this.params.growthSpeed;
        const ringInterval = 500; // 每个年轮显示间隔（毫秒）
        
        const targetRing = Math.floor(elapsed / ringInterval);
        
        if (targetRing > this.growthState.currentRing && this.growthState.currentRing < this.rings.length) {
            // 显示新的年轮
            if (this.rings[this.growthState.currentRing]) {
                this.rings[this.growthState.currentRing].visible = true;
                
                // 添加生长动画效果
                const ring = this.rings[this.growthState.currentRing];
                ring.scale.set(0.1, 0.1, 0.1);
                
                const startScale = 0.1;
                const endScale = 1.0;
                const duration = 300;
                const startTime = Date.now();
                
                const scaleAnimation = () => {
                    const progress = Math.min((Date.now() - startTime) / duration, 1);
                    const scale = startScale + (endScale - startScale) * this.easeOutBounce(progress);
                    ring.scale.set(scale, scale, scale);
                    
                    if (progress < 1) {
                        requestAnimationFrame(scaleAnimation);
                    }
                };
                scaleAnimation();
            }
            
            this.growthState.currentRing++;
        }
        
        if (this.growthState.currentRing >= this.rings.length) {
            this.growthState.isPlaying = false;
            return;
        }
        
        this.growthState.animationId = requestAnimationFrame(() => this.animateGrowth());
    }
    
    easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    }
    
    // 鼠标点击检测
    onMouseClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.rings);
        
        if (intersects.length > 0) {
            const clickedRing = intersects[0].object;
            const ringData = clickedRing.userData.ringData;
            this.displayRingInfo(ringData);
            this.highlightRing(clickedRing);
            this.displayMilestoneDetail(ringData);
        }
    }
    
    displayRingInfo(ringData) {
        const infoDiv = document.getElementById('ring-info');
        
        const html = `
            <div class="ring-detail">
                <div class="ring-year">年份: ${ringData.year}</div>
                <div class="ring-data">年龄: ${ringData.age} 年</div>
                <div class="ring-data">厚度: ${(ringData.thickness * 100).toFixed(1)} cm</div>
                <div class="ring-data">天气: ${this.getWeatherText(ringData.weather)}</div>
                <div class="ring-data">半径: ${ringData.radius.toFixed(2)} m</div>
            </div>
            <div class="ring-events">
                <strong>相关事件:</strong>
                ${ringData.events.map(event => `<div class="ring-data">• ${event}</div>`).join('')}
            </div>
        `;
        
        infoDiv.innerHTML = html;
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
    
    highlightRing(ring) {
        // 重置所有年轮颜色
        this.rings.forEach(r => {
            r.material.color.copy(r.userData.originalColor);
            r.material.emissive.setHex(0x000000);
        });
        
        // 高亮选中的年轮
        ring.material.emissive.setHex(0x222222);
        ring.material.color.multiplyScalar(1.5);
        this.setActiveLabel(ring);
    }
    
    displayMilestoneDetail(ringData) {
        const milestone = this.milestones[ringData.year];
        const panel = document.getElementById('milestone-detail');
        if (!panel || !milestone) {
            if (panel) {
                panel.classList.remove('visible');
                panel.innerHTML = '';
            }
            return;
        }
        
        const detailTitle = milestone.detailTitle || `${ringData.year} · ${milestone.title || ''}`;
        const detailText = milestone.detailText || '';
        const imageSrc = milestone.image || '';
        
        const imageBlock = imageSrc
            ? `<div class="milestone-image-wrapper">
                    <img class="milestone-image" src="${imageSrc}" alt="${detailTitle}">
               </div>`
            : '';
        
        panel.innerHTML = `
            <div class="milestone-card">
                <div class="milestone-year">${ringData.year}</div>
                <div class="milestone-headline">${detailTitle}</div>
                ${imageBlock}
                <div class="milestone-body">${detailText.replace(/\\n/g, '<br>')}</div>
            </div>
        `;
        panel.classList.add('visible');
    }
    
    // 更新参数
    updateParams(newParams) {
        Object.assign(this.params, newParams);
        
        // 重新生成年轮数据和模型
        this.generateRingData();
        this.createRings();
        this.updateLabelPositions();
    }
    
    // 动画循环
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 自动旋转
        if (this.params.autoRotate) {
            this.ringGroup.rotation.y += 0.005;
        }
        
        this.controls.update();
        this.updateLabelPositions();
        this.renderer.render(this.scene, this.camera);
    }
    
    // 窗口大小调整
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.updateLabelPositions();
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 基础参数控制
        const controls = {
            'ring-count': (value) => {
                this.params.ringCount = parseInt(value);
                this.updateParams({});
            },
            'trunk-radius': (value) => {
                this.params.trunkRadius = parseFloat(value);
                document.getElementById('trunk-radius-value').textContent = value;
                this.updateParams({});
            },
            'ring-thickness': (value) => {
                this.params.ringThickness = parseFloat(value);
                document.getElementById('ring-thickness-value').textContent = value;
                this.updateParams({});
            },
            'growth-speed': (value) => {
                this.params.growthSpeed = parseFloat(value);
                document.getElementById('growth-speed-value').textContent = value + 'x';
            }
        };
        
        // 绑定滑块事件
        Object.keys(controls).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => controls[id](e.target.value));
            }
        });
        
        // 天气因子选择
        document.getElementById('weather-factor').addEventListener('change', (e) => {
            this.params.weatherFactor = e.target.value;
            this.updateParams({});
        });
        
        // 复选框控制
        const checkboxes = {
            'show-age-colors': () => {
                this.params.showAgeColors = document.getElementById('show-age-colors').checked;
                this.updateParams({});
            },
            'show-wireframe': () => {
                this.params.showWireframe = document.getElementById('show-wireframe').checked;
                this.rings.forEach(ring => {
                    ring.material.wireframe = this.params.showWireframe;
                });
            },
            'auto-rotate': () => {
                this.params.autoRotate = document.getElementById('auto-rotate').checked;
            }
        };
        
        Object.keys(checkboxes).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', checkboxes[id]);
            }
        });
        
        // 生长控制按钮
        document.getElementById('play-growth').addEventListener('click', () => this.playGrowth());
        document.getElementById('pause-growth').addEventListener('click', () => this.pauseGrowth());
        document.getElementById('reset-growth').addEventListener('click', () => this.resetGrowth());
    }
    
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new LifeAnnualRings();
    // 将应用实例暴露给UI增强模块
    window.lifeRingsInstance = app;
});
