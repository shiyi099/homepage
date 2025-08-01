// 世界地图交互功能
document.addEventListener('DOMContentLoaded', function() {
    const worldMap = document.querySelector('.datamap');
    if (!worldMap) return;

    // 创建工具提示元素
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

    // 获取所有国家路径
    const countries = document.querySelectorAll('.datamaps-subunit');
    
    // 为每个国家添加事件监听器
    countries.forEach(country => {
        // 鼠标悬停事件
        country.addEventListener('mouseenter', function(e) {
            const countryCode = this.className.match(/datamaps-subunit\s+(\w+)/)?.[1];
            const countryName = getCountryName(countryCode);
            
            tooltip.textContent = countryName;
            tooltip.style.display = 'block';
            
            // 设置工具提示位置
            const rect = this.getBoundingClientRect();
            tooltip.style.left = (e.clientX + 10) + 'px';
            tooltip.style.top = (e.clientY - 30) + 'px';
        });

        // 鼠标离开事件
        country.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
            this.classList.remove('active');
        });

        // 点击事件
        country.addEventListener('click', function() {
            // 移除其他国家的激活状态
            countries.forEach(c => c.classList.remove('active'));
            // 激活当前国家
            this.classList.add('active');
            
            const countryCode = this.className.match(/datamaps-subunit\s+(\w+)/)?.[1];
            const countryName = getCountryName(countryCode);
            
            // 显示国家信息
            showCountryInfo(countryCode, countryName);
        });

        // 鼠标移动事件（更新工具提示位置）
        country.addEventListener('mousemove', function(e) {
            tooltip.style.left = (e.clientX + 10) + 'px';
            tooltip.style.top = (e.clientY - 30) + 'px';
        });
    });

    // 国家代码到名称的映射
    function getCountryName(code) {
        const countryNames = {
            'CHN': '中国',
            'USA': '美国',
            'JPN': '日本',
            'DEU': '德国',
            'GBR': '英国',
            'FRA': '法国',
            'CAN': '加拿大',
            'AUS': '澳大利亚',
            'BRA': '巴西',
            'IND': '印度',
            'RUS': '俄罗斯',
            'ITA': '意大利',
            'ESP': '西班牙',
            'KOR': '韩国',
            'MEX': '墨西哥',
            'IDN': '印度尼西亚',
            'NLD': '荷兰',
            'TUR': '土耳其',
            'SAU': '沙特阿拉伯',
            'CHE': '瑞士',
            'SWE': '瑞典',
            'ARG': '阿根廷',
            'POL': '波兰',
            'BEL': '比利时',
            'THA': '泰国',
            'AUT': '奥地利',
            'NOR': '挪威',
            'ARE': '阿联酋',
            'ISR': '以色列',
            'SGP': '新加坡',
            'MYS': '马来西亚',
            'PHL': '菲律宾',
            'VNM': '越南',
            'BGD': '孟加拉国',
            'EGY': '埃及',
            'PAK': '巴基斯坦',
            'IRN': '伊朗',
            'COL': '哥伦比亚',
            'CHL': '智利',
            'ROU': '罗马尼亚',
            'CZE': '捷克',
            'PER': '秘鲁',
            'IRQ': '伊拉克',
            'NZL': '新西兰',
            'QAT': '卡塔尔',
            'GRC': '希腊',
            'PRT': '葡萄牙',
            'HUN': '匈牙利',
            'SVK': '斯洛伐克',
            'BGR': '保加利亚',
            'LUX': '卢森堡',
            'HRV': '克罗地亚',
            'LTU': '立陶宛',
            'SVN': '斯洛文尼亚',
            'LVA': '拉脱维亚',
            'EST': '爱沙尼亚',
            'CYP': '塞浦路斯',
            'MLT': '马耳他',
            'ISL': '冰岛',
            'AFG': '阿富汗',
            'ALB': '阿尔巴尼亚',
            'DZA': '阿尔及利亚',
            'AGO': '安哥拉',
            'ARM': '亚美尼亚',
            'AZE': '阿塞拜疆',
            'BHS': '巴哈马',
            'BHR': '巴林',
            'BDI': '布隆迪',
            'BEN': '贝宁',
            'BFA': '布基纳法索',
            'BIH': '波斯尼亚和黑塞哥维那',
            'BLR': '白俄罗斯',
            'BLZ': '伯利兹',
            'BOL': '玻利维亚',
            'BRN': '文莱',
            'BTN': '不丹',
            'BWA': '博茨瓦纳',
            'CAF': '中非共和国',
            'CIV': '科特迪瓦',
            'CMR': '喀麦隆',
            'COD': '刚果民主共和国',
            'COG': '刚果共和国',
            'CRI': '哥斯达黎加',
            'CUB': '古巴',
            'DJI': '吉布提',
            'DNK': '丹麦',
            'DOM': '多米尼加共和国',
            'DZA': '阿尔及利亚',
            'ECU': '厄瓜多尔',
            'ERI': '厄立特里亚',
            'ETH': '埃塞俄比亚',
            'FIN': '芬兰',
            'FJI': '斐济',
            'FLK': '福克兰群岛',
            'GAB': '加蓬',
            'GEO': '格鲁吉亚',
            'GHA': '加纳',
            'GIN': '几内亚',
            'GMB': '冈比亚',
            'GNB': '几内亚比绍',
            'GNQ': '赤道几内亚',
            'GTM': '危地马拉',
            'GUY': '圭亚那',
            'HND': '洪都拉斯',
            'HTI': '海地',
            'HUN': '匈牙利',
            'IDN': '印度尼西亚',
            'IRN': '伊朗',
            'IRQ': '伊拉克',
            'ISL': '冰岛',
            'ISR': '以色列',
            'JOR': '约旦',
            'KAZ': '哈萨克斯坦',
            'KEN': '肯尼亚',
            'KGZ': '吉尔吉斯斯坦',
            'KHM': '柬埔寨',
            'LAO': '老挝',
            'LBN': '黎巴嫩',
            'LBR': '利比里亚',
            'LBY': '利比亚',
            'LKA': '斯里兰卡',
            'MAR': '摩洛哥',
            'MDA': '摩尔多瓦',
            'MDG': '马达加斯加',
            'MLI': '马里',
            'MMR': '缅甸',
            'MNG': '蒙古',
            'MOZ': '莫桑比克',
            'MRT': '毛里塔尼亚',
            'MWI': '马拉维',
            'NAM': '纳米比亚',
            'NER': '尼日尔',
            'NGA': '尼日利亚',
            'NIC': '尼加拉瓜',
            'NPL': '尼泊尔',
            'OMN': '阿曼',
            'PAN': '巴拿马',
            'PNG': '巴布亚新几内亚',
            'PRY': '巴拉圭',
            'RWA': '卢旺达',
            'SDN': '苏丹',
            'SEN': '塞内加尔',
            'SLE': '塞拉利昂',
            'SLV': '萨尔瓦多',
            'SOM': '索马里',
            'SRB': '塞尔维亚',
            'SSD': '南苏丹',
            'STP': '圣多美和普林西比',
            'SUR': '苏里南',
            'SYR': '叙利亚',
            'TCD': '乍得',
            'TGO': '多哥',
            'TJK': '塔吉克斯坦',
            'TKM': '土库曼斯坦',
            'TUN': '突尼斯',
            'TZA': '坦桑尼亚',
            'UGA': '乌干达',
            'URY': '乌拉圭',
            'UZB': '乌兹别克斯坦',
            'VEN': '委内瑞拉',
            'YEM': '也门',
            'ZAF': '南非',
            'ZMB': '赞比亚',
            'ZWE': '津巴布韦'
        };
        
        return countryNames[code] || code;
    }

    // 显示国家信息
    function showCountryInfo(code, name) {
        // 创建或更新国家信息显示
        let infoContainer = document.querySelector('.country-info');
        if (!infoContainer) {
            infoContainer = document.createElement('div');
            infoContainer.className = 'country-info';
            infoContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 1001;
                max-width: 300px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(10px);
            `;
            document.body.appendChild(infoContainer);
        }

        infoContainer.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #4a90e2;">${name}</h3>
            <p style="margin: 0 0 15px 0; color: #cccccc;">国家代码: ${code}</p>
            <div style="margin: 15px 0;">
                <div style="color: #ff6b6b; font-weight: bold;">访问量: 加载中...</div>
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: #4a90e2;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 10px;
            ">关闭</button>
        `;

        // 模拟加载访问数据
        setTimeout(() => {
            const visits = Math.floor(Math.random() * 100) + 1;
            infoContainer.querySelector('div').innerHTML = `
                <div style="color: #ff6b6b; font-weight: bold;">访问量: ${visits}</div>
                <div style="color: #66bb6a; font-size: 12px; margin-top: 5px;">最近访问: ${new Date().toLocaleDateString()}</div>
            `;
        }, 500);
    }

    // 添加地图图例
    function addMapLegend() {
        const legendContainer = document.createElement('div');
        legendContainer.className = 'map-legend';
        legendContainer.innerHTML = `
            <div class="legend-item">
                <div class="legend-color default"></div>
                <span>无访问</span>
            </div>
            <div class="legend-item">
                <div class="legend-color visitor"></div>
                <span>有访客</span>
            </div>
            <div class="legend-item">
                <div class="legend-color high"></div>
                <span>高访问</span>
            </div>
            <div class="legend-item">
                <div class="legend-color medium"></div>
                <span>中访问</span>
            </div>
        `;

        // 将图例插入到地图容器中
        const mapSection = document.querySelector('.world-map-section');
        if (mapSection) {
            mapSection.appendChild(legendContainer);
        }
    }

    // 添加地图统计信息
    function addMapStats() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'map-stats';
        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">总访问国家</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">今日访问</div>
            </div>
            <div class="stat-item">
                <div class="stat-number">0</div>
                <div class="stat-label">本月访问</div>
            </div>
        `;

        // 将统计信息插入到地图容器中
        const mapSection = document.querySelector('.world-map-section');
        if (mapSection) {
            mapSection.appendChild(statsContainer);
        }
    }

    // 初始化地图功能
    function initMap() {
        addMapLegend();
        addMapStats();
        
        // 模拟一些访问数据
        setTimeout(() => {
            const visitorCountries = ['CHN', 'USA', 'JPN', 'DEU', 'GBR', 'FRA'];
            visitorCountries.forEach(code => {
                const country = document.querySelector(`.datamaps-subunit.${code}`);
                if (country) {
                    country.classList.add('visitor-country');
                }
            });

            // 更新统计信息
            const statNumbers = document.querySelectorAll('.stat-number');
            if (statNumbers.length >= 3) {
                statNumbers[0].textContent = visitorCountries.length;
                statNumbers[1].textContent = Math.floor(Math.random() * 50) + 10;
                statNumbers[2].textContent = Math.floor(Math.random() * 500) + 100;
            }
        }, 1000);
    }

    // 启动地图功能
    initMap();
}); 