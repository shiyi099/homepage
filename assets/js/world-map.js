// 世界地图交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化世界地图
    initWorldMap();
    // 加载热力图数据
    loadHeatmapData();
});

// 全局变量存储热力图数据
let heatmapData = {};
let maxUsers = 0;

// 从API获取数据并绘制热力图
async function loadHeatmapData() {
    try {
        console.log('正在从API获取热力图数据...');
        
        // 从API获取数据
        const response = await fetch('https://billion-github-io.vercel.app/api/index');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API返回的原始数据:', data);
        
        // 处理数据，排除"(not set)"的国家
        const processedData = processHeatmapData(data);
        console.log('处理后的热力图数据:', processedData);
        
        // 应用热力图到地图
        applyHeatmapToMap(processedData);
        
    } catch (error) {
        console.error('获取热力图数据失败:', error);
        // 显示错误信息
        showErrorMessage('获取访客数据失败，请稍后重试');
    }
}

// 处理热力图数据
function processHeatmapData(data) {
    const countryData = {};
    maxUsers = 0;
    
    data.forEach(item => {
        // 排除"(not set)"的国家
        if (item.country && item.country !== "(not set)" && item.activeUsers) {
            const countryCode = getCountryCodeFromName(item.country);
            if (countryCode) {
                const users = parseInt(item.activeUsers);
                if (countryData[countryCode]) {
                    countryData[countryCode] += users;
                } else {
                    countryData[countryCode] = users;
                }
                
                // 更新最大用户数
                if (countryData[countryCode] > maxUsers) {
                    maxUsers = countryData[countryCode];
                }
            }
        }
    });
    
    return countryData;
}

// 根据国家名称获取国家代码
function getCountryCodeFromName(countryName) {
    const countryMapping = {
        'China': 'CHN',
        'Hong Kong': 'HKG',
        'Japan': 'JPN',
        'Taiwan': 'TWN',
        'United States': 'USA',
        'United States of America': 'USA',
        'USA': 'USA',
        'Germany': 'DEU',
        'United Kingdom': 'GBR',
        'UK': 'GBR',
        'France': 'FRA',
        'Italy': 'ITA',
        'Canada': 'CAN',
        'Australia': 'AUS',
        'Brazil': 'BRA',
        'Russia': 'RUS',
        'India': 'IND',
        'South Korea': 'KOR',
        'Korea': 'KOR',
        'Spain': 'ESP',
        'Mexico': 'MEX',
        'Indonesia': 'IDN',
        'Netherlands': 'NLD',
        'Saudi Arabia': 'SAU',
        'Turkey': 'TUR',
        'Switzerland': 'CHE',
        'Sweden': 'SWE',
        'Poland': 'POL',
        'Belgium': 'BEL',
        'Thailand': 'THA',
        'Austria': 'AUT',
        'Norway': 'NOR',
        'United Arab Emirates': 'ARE',
        'UAE': 'ARE',
        'Iran': 'IRN',
        'Israel': 'ISR',
        'Singapore': 'SGP',
        'Malaysia': 'MYS',
        'Philippines': 'PHL',
        'Vietnam': 'VNM',
        'Bangladesh': 'BGD',
        'Pakistan': 'PAK',
        'Egypt': 'EGY',
        'South Africa': 'ZAF',
        'Nigeria': 'NGA',
        'Kenya': 'KEN',
        'Ethiopia': 'ETH',
        'Tanzania': 'TZA',
        'Uganda': 'UGA',
        'Ghana': 'GHA',
        'Mozambique': 'MOZ',
        'Angola': 'AGO',
        'Cameroon': 'CMR',
        'Ivory Coast': 'CIV',
        'Côte d\'Ivoire': 'CIV',
        'Madagascar': 'MDG',
        'Niger': 'NER',
        'Burkina Faso': 'BFA',
        'Mali': 'MLI',
        'Malawi': 'MWI',
        'Zambia': 'ZMB',
        'Senegal': 'SEN',
        'Chad': 'TCD',
        'Somalia': 'SOM',
        'Zimbabwe': 'ZWE',
        'Guinea': 'GIN',
        'Rwanda': 'RWA',
        'Benin': 'BEN',
        'Burundi': 'BDI',
        'Tunisia': 'TUN',
        'Bolivia': 'BOL',
        'Honduras': 'HND',
        'Guatemala': 'GTM',
        'Nicaragua': 'NIC',
        'El Salvador': 'SLV',
        'Costa Rica': 'CRI',
        'Panama': 'PAN',
        'Uruguay': 'URY',
        'Paraguay': 'PRY',
        'French Guiana': 'GUF',
        'Suriname': 'SUR',
        'Guyana': 'GUY',
        'Ecuador': 'ECU',
        'Peru': 'PER',
        'Colombia': 'COL',
        'Venezuela': 'VEN',
        'Chile': 'CHL',
        'Argentina': 'ARG',
        'Afghanistan': 'AFG',
        'Iraq': 'IRQ',
        'Syria': 'SYR',
        'Lebanon': 'LBN',
        'Jordan': 'JOR',
        'Yemen': 'YEM',
        'Oman': 'OMN',
        'Qatar': 'QAT',
        'Kuwait': 'KWT',
        'Bahrain': 'BHR',
        'Cyprus': 'CYP',
        'Greece': 'GRC',
        'Albania': 'ALB',
        'North Macedonia': 'MKD',
        'Macedonia': 'MKD',
        'Serbia': 'SRB',
        'Montenegro': 'MNE',
        'Bosnia and Herzegovina': 'BIH',
        'Croatia': 'HRV',
        'Slovenia': 'SVN',
        'Hungary': 'HUN',
        'Slovakia': 'SVK',
        'Czech Republic': 'CZE',
        'Czechia': 'CZE',
        'Romania': 'ROU',
        'Bulgaria': 'BGR',
        'Moldova': 'MDA',
        'Ukraine': 'UKR',
        'Belarus': 'BLR',
        'Lithuania': 'LTU',
        'Latvia': 'LVA',
        'Estonia': 'EST',
        'Finland': 'FIN',
        'Denmark': 'DNK',
        'Iceland': 'ISL',
        'Ireland': 'IRL',
        'Portugal': 'PRT',
        'Luxembourg': 'LUX',
        'Liechtenstein': 'LIE',
        'Monaco': 'MCO',
        'Andorra': 'AND',
        'San Marino': 'SMR',
        'Vatican': 'VAT',
        'Vatican City': 'VAT',
        'Malta': 'MLT',
        'Gibraltar': 'GIB',
        'Isle of Man': 'IMN',
        'Jersey': 'JEY',
        'Guernsey': 'GGY',
        'Faroe Islands': 'FRO',
        'Greenland': 'GRL',
        'Svalbard': 'SJM',
        'Bouvet Island': 'BVT',
        'French Southern Territories': 'ATF',
        'British Indian Ocean Territory': 'IOT',
        'Saint Helena': 'SHN',
        'Pitcairn': 'PCN',
        'Pitcairn Islands': 'PCN',
        'Bermuda': 'BMU',
        'Cayman Islands': 'CYM',
        'British Virgin Islands': 'VGB',
        'Anguilla': 'AIA',
        'Montserrat': 'MSR',
        'Turks and Caicos': 'TCA',
        'Turks and Caicos Islands': 'TCA',
        'Aruba': 'ABW',
        'Curacao': 'CUW',
        'Curaçao': 'CUW',
        'Sint Maarten': 'SXM',
        'Saint Martin': 'MAF',
        'Saint Barthelemy': 'BLM',
        'Saint Barthélemy': 'BLM',
        'Martinique': 'MTQ',
        'Guadeloupe': 'GLP',
        'Dominican Republic': 'DOM',
        'Haiti': 'HTI',
        'Jamaica': 'JAM',
        'Barbados': 'BRB',
        'Grenada': 'GRD',
        'Saint Lucia': 'LCA',
        'Saint Vincent and the Grenadines': 'VCT',
        'Antigua and Barbuda': 'ATG',
        'Dominica': 'DMA',
        'Saint Kitts and Nevis': 'KNA',
        'Trinidad and Tobago': 'TTO'
    };
    
    return countryMapping[countryName] || null;
}

// 应用热力图到地图
function applyHeatmapToMap(data) {
    const countries = document.querySelectorAll('.datamaps-subunit');
    
    countries.forEach(country => {
        const countryCode = country.classList[1]; // 获取国家代码
        const userCount = data[countryCode] || 0;
        
        if (userCount > 0) {
            // 计算颜色强度 (0-1)
            const intensity = maxUsers > 0 ? userCount / maxUsers : 0;
            
            // 生成热力图颜色 (从浅蓝到深红)
            const color = getHeatmapColor(intensity);
            
            // 应用颜色到国家
            country.style.fill = color;
            
            // 添加数据信息
            country.setAttribute('data-info', JSON.stringify({
                users: userCount,
                intensity: intensity
            }));
            
            // 添加脉冲动画效果
            country.classList.add('heatmap-active');
        }
    });
    
    // 更新工具提示显示用户数量
    updateTooltipContent();
    
    // 显示热力图图例
    showHeatmapLegend();
}

// 生成热力图颜色
function getHeatmapColor(intensity) {
    // 使用从浅蓝到深红的渐变
    const colors = [
        [240, 249, 255], // 最浅的蓝色
        [189, 215, 231],
        [107, 174, 214],
        [49, 130, 189],
        [8, 81, 156],
        [8, 48, 107],
        [255, 255, 204], // 黄色
        [255, 237, 160],
        [254, 217, 118],
        [254, 178, 76],
        [253, 141, 60],
        [252, 78, 42],
        [227, 26, 28],
        [189, 0, 38],
        [128, 0, 38]  // 最深的红色
    ];
    
    const colorIndex = Math.floor(intensity * (colors.length - 1));
    const color = colors[colorIndex];
    
    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

// 更新工具提示内容
function updateTooltipContent() {
    // 修改现有的工具提示显示函数
    const originalShowTooltip = window.showTooltip;
    
    window.showTooltip = function(e, tooltip, countryName, countryInfo) {
        const countryCode = e.target.classList[1];
        const dataInfo = e.target.getAttribute('data-info');
        let userCount = 0;
        
        if (dataInfo) {
            try {
                const data = JSON.parse(dataInfo);
                userCount = data.users || 0;
            } catch (e) {
                console.error('解析数据信息失败:', e);
            }
        }
        
        let tooltipContent = `<div style="font-weight: bold; margin-bottom: 4px;">${countryName}</div>`;
        
        if (userCount > 0) {
            tooltipContent += `<div style="color: #4a90e2; font-weight: bold; margin-bottom: 4px;">活跃用户: ${userCount}</div>`;
        }
        
        if (countryInfo) {
            tooltipContent += `<div style="font-size: 11px; color: #cccccc;">${countryInfo}</div>`;
        }
        
        tooltip.innerHTML = tooltipContent;
        
        // 定位工具提示
        const rect = e.target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
        tooltip.style.top = (rect.top + scrollTop - 40) + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        // 显示工具提示
        tooltip.style.opacity = '1';
        tooltip.classList.add('show');
    };
}

// 显示热力图图例
function showHeatmapLegend() {
    const mapSection = document.querySelector('.world-map-section');
    if (!mapSection) return;
    
    // 检查是否已经存在图例
    const existingLegend = mapSection.querySelector('.heatmap-legend');
    if (existingLegend) {
        existingLegend.remove();
    }
    
    const legend = document.createElement('div');
    legend.className = 'heatmap-legend';
    legend.style.cssText = `
        margin-top: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
    `;
    
    const legendTitle = document.createElement('div');
    legendTitle.style.cssText = `
        color: white;
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 14px;
    `;
    legendTitle.textContent = '访客活跃度热力图';
    
    const legendBar = document.createElement('div');
    legendBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
        height: 20px;
        background: linear-gradient(to right, rgb(240, 249, 255), rgb(189, 215, 231), rgb(107, 174, 214), rgb(49, 130, 189), rgb(8, 81, 156), rgb(255, 255, 204), rgb(255, 237, 160), rgb(254, 217, 118), rgb(254, 178, 76), rgb(253, 141, 60), rgb(252, 78, 42), rgb(227, 26, 28), rgb(189, 0, 38), rgb(128, 0, 38));
        border-radius: 4px;
        position: relative;
    `;
    
    const legendLabels = document.createElement('div');
    legendLabels.style.cssText = `
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #cccccc;
        margin-top: 5px;
    `;
    legendLabels.innerHTML = `
        <span>低</span>
        <span>高</span>
    `;
    
    const legendStats = document.createElement('div');
    legendStats.style.cssText = `
        font-size: 12px;
        color: #cccccc;
        margin-top: 8px;
    `;
    legendStats.textContent = `最高活跃用户: ${maxUsers} 人`;
    
    legend.appendChild(legendTitle);
    legend.appendChild(legendBar);
    legend.appendChild(legendLabels);
    legend.appendChild(legendStats);
    
    mapSection.appendChild(legend);
}

// 显示错误信息
function showErrorMessage(message) {
    const mapSection = document.querySelector('.world-map-section');
    if (!mapSection) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        margin-top: 15px;
        padding: 10px;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 6px;
        color: #ff6b6b;
        text-align: center;
        font-size: 12px;
    `;
    errorDiv.textContent = message;
    
    mapSection.appendChild(errorDiv);
    
    // 5秒后自动移除错误信息
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
}

function initWorldMap() {
    const mapContainer = document.querySelector('.world-map-container');
    if (!mapContainer) return;

    const svg = mapContainer.querySelector('.datamap');
    if (!svg) return;

    // 创建工具提示元素
    const tooltip = createTooltip();
    document.body.appendChild(tooltip);

    // 获取所有国家路径
    const countries = svg.querySelectorAll('.datamaps-subunit');
    
    // 为每个国家添加事件监听器
    countries.forEach(country => {
        // 鼠标悬停事件
        country.addEventListener('mouseenter', function(e) {
            handleCountryHover(e, this, tooltip);
        });

        // 鼠标离开事件
        country.addEventListener('mouseleave', function(e) {
            handleCountryLeave(e, this, tooltip);
        });

        // 点击事件
        country.addEventListener('click', function(e) {
            handleCountryClick(e, this);
        });
    });

    // 添加地图控制功能
    addMapControls();
}

// 创建工具提示
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none;
        z-index: 1000;
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: opacity 0.3s ease;
        max-width: 200px;
        word-wrap: break-word;
    `;
    return tooltip;
}

// 处理国家悬停
function handleCountryHover(e, country, tooltip) {
    // 添加悬停样式
    country.classList.add('hover');
    
    // 获取国家信息
    const countryCode = country.classList[1]; // 获取国家代码 (如 CHN, USA)
    const countryName = getCountryName(countryCode);
    const countryInfo = getCountryInfo(countryCode);
    
    // 显示工具提示
    showTooltip(e, tooltip, countryName, countryInfo);
}

// 处理国家离开
function handleCountryLeave(e, country, tooltip) {
    // 移除悬停样式
    country.classList.remove('hover');
    
    // 隐藏工具提示
    hideTooltip(tooltip);
}

// 处理国家点击
function handleCountryClick(e, country) {
    // 移除其他国家的激活状态
    const allCountries = document.querySelectorAll('.datamaps-subunit');
    allCountries.forEach(c => c.classList.remove('active'));
    
    // 添加当前国家的激活状态
    country.classList.add('active');
    
    // 获取国家信息
    const countryCode = country.classList[1];
    const countryName = getCountryName(countryCode);
    
    // 显示国家详情
    showCountryDetails(countryName, countryCode);
}

// 显示工具提示
function showTooltip(e, tooltip, countryName, countryInfo) {
    tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">${countryName}</div>
        ${countryInfo ? `<div style="font-size: 11px; color: #cccccc;">${countryInfo}</div>` : ''}
    `;
    
    // 定位工具提示
    const rect = e.target.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top + scrollTop - 40) + 'px';
    tooltip.style.transform = 'translateX(-50%)';
    
    // 显示工具提示
    tooltip.style.opacity = '1';
    tooltip.classList.add('show');
}

// 隐藏工具提示
function hideTooltip(tooltip) {
    tooltip.style.opacity = '0';
    tooltip.classList.remove('show');
}

// 获取国家名称
function getCountryName(countryCode) {
    const countryNames = {
        'CHN': '中国',
        'USA': '美国',
        'JPN': '日本',
        'DEU': '德国',
        'GBR': '英国',
        'FRA': '法国',
        'ITA': '意大利',
        'CAN': '加拿大',
        'AUS': '澳大利亚',
        'BRA': '巴西',
        'RUS': '俄罗斯',
        'IND': '印度',
        'KOR': '韩国',
        'ESP': '西班牙',
        'MEX': '墨西哥',
        'IDN': '印度尼西亚',
        'NLD': '荷兰',
        'SAU': '沙特阿拉伯',
        'TUR': '土耳其',
        'CHE': '瑞士',
        'SWE': '瑞典',
        'POL': '波兰',
        'BEL': '比利时',
        'THA': '泰国',
        'AUT': '奥地利',
        'NOR': '挪威',
        'ARE': '阿联酋',
        'IRN': '伊朗',
        'ISR': '以色列',
        'SGP': '新加坡',
        'HKG': '香港',
        'TWN': '台湾',
        'MYS': '马来西亚',
        'PHL': '菲律宾',
        'VNM': '越南',
        'BGD': '孟加拉国',
        'PAK': '巴基斯坦',
        'EGY': '埃及',
        'ZAF': '南非',
        'NGA': '尼日利亚',
        'KEN': '肯尼亚',
        'ETH': '埃塞俄比亚',
        'TZA': '坦桑尼亚',
        'UGA': '乌干达',
        'GHA': '加纳',
        'MOZ': '莫桑比克',
        'AGO': '安哥拉',
        'CMR': '喀麦隆',
        'CIV': '科特迪瓦',
        'MDG': '马达加斯加',
        'NER': '尼日尔',
        'BFA': '布基纳法索',
        'MLI': '马里',
        'MWI': '马拉维',
        'ZMB': '赞比亚',
        'SEN': '塞内加尔',
        'TCD': '乍得',
        'SOM': '索马里',
        'ZWE': '津巴布韦',
        'GIN': '几内亚',
        'RWA': '卢旺达',
        'BEN': '贝宁',
        'BDI': '布隆迪',
        'TUN': '突尼斯',
        'BOL': '玻利维亚',
        'HND': '洪都拉斯',
        'GTM': '危地马拉',
        'NIC': '尼加拉瓜',
        'SLV': '萨尔瓦多',
        'CRI': '哥斯达黎加',
        'PAN': '巴拿马',
        'URY': '乌拉圭',
        'PRY': '巴拉圭',
        'GUF': '法属圭亚那',
        'SUR': '苏里南',
        'GUY': '圭亚那',
        'ECU': '厄瓜多尔',
        'PER': '秘鲁',
        'COL': '哥伦比亚',
        'VEN': '委内瑞拉',
        'CHL': '智利',
        'ARG': '阿根廷',
        'AFG': '阿富汗',
        'IRQ': '伊拉克',
        'SYR': '叙利亚',
        'LBN': '黎巴嫩',
        'JOR': '约旦',
        'YEM': '也门',
        'OMN': '阿曼',
        'QAT': '卡塔尔',
        'KWT': '科威特',
        'BHR': '巴林',
        'CYP': '塞浦路斯',
        'GRC': '希腊',
        'ALB': '阿尔巴尼亚',
        'MKD': '北马其顿',
        'SRB': '塞尔维亚',
        'MNE': '黑山',
        'BIH': '波斯尼亚和黑塞哥维那',
        'HRV': '克罗地亚',
        'SVN': '斯洛文尼亚',
        'HUN': '匈牙利',
        'SVK': '斯洛伐克',
        'CZE': '捷克',
        'ROU': '罗马尼亚',
        'BGR': '保加利亚',
        'MDA': '摩尔多瓦',
        'UKR': '乌克兰',
        'BLR': '白俄罗斯',
        'LTU': '立陶宛',
        'LVA': '拉脱维亚',
        'EST': '爱沙尼亚',
        'FIN': '芬兰',
        'DNK': '丹麦',
        'ISL': '冰岛',
        'IRL': '爱尔兰',
        'PRT': '葡萄牙',
        'LUX': '卢森堡',
        'LIE': '列支敦士登',
        'MCO': '摩纳哥',
        'AND': '安道尔',
        'SMR': '圣马力诺',
        'VAT': '梵蒂冈',
        'MLT': '马耳他',
        'GIB': '直布罗陀',
        'IMN': '马恩岛',
        'JEY': '泽西岛',
        'GGY': '根西岛',
        'FRO': '法罗群岛',
        'GRL': '格陵兰',
        'SJM': '斯瓦尔巴群岛',
        'BVT': '布韦岛',
        'ATF': '法属南部领地',
        'IOT': '英属印度洋领地',
        'SHN': '圣赫勒拿',
        'PCN': '皮特凯恩群岛',
        'BMU': '百慕大',
        'CYM': '开曼群岛',
        'VGB': '英属维尔京群岛',
        'AIA': '安圭拉',
        'MSR': '蒙特塞拉特',
        'TCA': '特克斯和凯科斯群岛',
        'ABW': '阿鲁巴',
        'CUW': '库拉索',
        'SXM': '圣马丁',
        'MAF': '法属圣马丁',
        'BLM': '圣巴泰勒米',
        'MTQ': '马提尼克',
        'GLP': '瓜德罗普',
        'DOM': '多米尼加',
        'HTI': '海地',
        'JAM': '牙买加',
        'BRB': '巴巴多斯',
        'GRD': '格林纳达',
        'LCA': '圣卢西亚',
        'VCT': '圣文森特和格林纳丁斯',
        'ATG': '安提瓜和巴布达',
        'DMA': '多米尼克',
        'KNA': '圣基茨和尼维斯',
        'TTO': '特立尼达和多巴哥',
        'SUR': '苏里南',
        'GUY': '圭亚那',
        'GUF': '法属圭亚那',
        'BRA': '巴西',
        'ARG': '阿根廷',
        'CHL': '智利',
        'PER': '秘鲁',
        'BOL': '玻利维亚',
        'PRY': '巴拉圭',
        'URY': '乌拉圭',
        'ECU': '厄瓜多尔',
        'COL': '哥伦比亚',
        'VEN': '委内瑞拉',
        'GUY': '圭亚那',
        'SUR': '苏里南',
        'GUF': '法属圭亚那',
        'BRA': '巴西',
        'ARG': '阿根廷',
        'CHL': '智利',
        'PER': '秘鲁',
        'BOL': '玻利维亚',
        'PRY': '巴拉圭',
        'URY': '乌拉圭',
        'ECU': '厄瓜多尔',
        'COL': '哥伦比亚',
        'VEN': '委内瑞拉',
        'GUY': '圭亚那',
        'SUR': '苏里南',
        'GUF': '法属圭亚那'
    };
    
    return countryNames[countryCode] || countryCode;
}

// 获取国家信息
function getCountryInfo(countryCode) {
    // 这里可以添加更多国家信息
    const countryInfo = {
        'CHN': '世界第二大经济体，人口最多的国家',
        'USA': '世界第一大经济体，超级大国',
        'JPN': '世界第三大经济体，科技强国',
        'DEU': '欧洲最大经济体，工业强国',
        'GBR': '联合国安理会常任理事国',
        'FRA': '欧洲重要国家，文化大国',
        'ITA': '欧洲文艺复兴发源地',
        'CAN': '世界第二大国家，资源丰富',
        'AUS': '大洋洲最大国家',
        'BRA': '南美洲最大国家',
        'RUS': '世界最大国家，资源丰富',
        'IND': '世界第二大人口国家',
        'KOR': '亚洲四小龙之一',
        'ESP': '伊比利亚半岛国家',
        'MEX': '北美洲重要国家',
        'IDN': '东南亚最大国家',
        'NLD': '低地国家，贸易强国',
        'SAU': '中东石油大国',
        'TUR': '横跨欧亚大陆',
        'CHE': '中立国，金融中心',
        'SWE': '北欧福利国家',
        'POL': '中欧重要国家',
        'BEL': '欧盟总部所在地',
        'THA': '东南亚旅游胜地',
        'AUT': '中欧内陆国家',
        'NOR': '北欧石油国家',
        'ARE': '中东金融中心',
        'IRN': '波斯文明古国',
        'ISR': '中东科技强国',
        'SGP': '亚洲金融中心',
        'HKG': '亚洲国际都会',
        'TWN': '亚洲四小龙之一',
        'MYS': '东南亚新兴国家',
        'PHL': '东南亚群岛国家',
        'VNM': '东南亚新兴市场',
        'BGD': '南亚人口大国',
        'PAK': '南亚重要国家',
        'EGY': '北非文明古国',
        'ZAF': '非洲最发达国家',
        'NGA': '非洲人口大国',
        'KEN': '东非经济中心',
        'ETH': '非洲文明古国',
        'TZA': '东非重要国家',
        'UGA': '东非内陆国家',
        'GHA': '西非新兴国家',
        'MOZ': '东南非国家',
        'AGO': '西南非石油国家',
        'CMR': '中非重要国家',
        'CIV': '西非可可大国',
        'MDG': '印度洋岛国',
        'NER': '西非内陆国家',
        'BFA': '西非内陆国家',
        'MLI': '西非内陆国家',
        'MWI': '东南非内陆国家',
        'ZMB': '东南非内陆国家',
        'SEN': '西非沿海国家',
        'TCD': '中非内陆国家',
        'SOM': '东非沿海国家',
        'ZWE': '东南非内陆国家',
        'GIN': '西非沿海国家',
        'RWA': '东非内陆国家',
        'BEN': '西非沿海国家',
        'BDI': '东非内陆国家',
        'TUN': '北非沿海国家',
        'BOL': '南美内陆国家',
        'HND': '中美洲国家',
        'GTM': '中美洲国家',
        'NIC': '中美洲国家',
        'SLV': '中美洲国家',
        'CRI': '中美洲国家',
        'PAN': '中美洲国家',
        'URY': '南美沿海国家',
        'PRY': '南美内陆国家',
        'GUF': '南美法属领地',
        'SUR': '南美沿海国家',
        'GUY': '南美沿海国家',
        'ECU': '南美沿海国家',
        'PER': '南美文明古国',
        'COL': '南美沿海国家',
        'VEN': '南美石油国家',
        'CHL': '南美狭长国家',
        'ARG': '南美大国',
        'AFG': '中亚内陆国家',
        'IRQ': '中东石油国家',
        'SYR': '中东文明古国',
        'LBN': '中东沿海国家',
        'JOR': '中东内陆国家',
        'YEM': '阿拉伯半岛国家',
        'OMN': '阿拉伯半岛国家',
        'QAT': '中东天然气大国',
        'KWT': '中东石油国家',
        'BHR': '中东岛国',
        'CYP': '地中海岛国',
        'GRC': '欧洲文明古国',
        'ALB': '巴尔干国家',
        'MKD': '巴尔干国家',
        'SRB': '巴尔干国家',
        'MNE': '巴尔干国家',
        'BIH': '巴尔干国家',
        'HRV': '巴尔干国家',
        'SVN': '巴尔干国家',
        'HUN': '中欧国家',
        'SVK': '中欧国家',
        'CZE': '中欧国家',
        'ROU': '东欧国家',
        'BGR': '巴尔干国家',
        'MDA': '东欧国家',
        'UKR': '东欧大国',
        'BLR': '东欧国家',
        'LTU': '波罗的海国家',
        'LVA': '波罗的海国家',
        'EST': '波罗的海国家',
        'FIN': '北欧国家',
        'DNK': '北欧国家',
        'ISL': '北欧岛国',
        'IRL': '西欧岛国',
        'PRT': '伊比利亚国家',
        'LUX': '西欧小国',
        'LIE': '中欧小国',
        'MCO': '欧洲小国',
        'AND': '欧洲小国',
        'SMR': '欧洲小国',
        'VAT': '欧洲小国',
        'MLT': '地中海岛国',
        'GIB': '英国海外领地',
        'IMN': '英国皇家属地',
        'JEY': '英国皇家属地',
        'GGY': '英国皇家属地',
        'FRO': '丹麦自治领地',
        'GRL': '丹麦自治领地',
        'SJM': '挪威属地',
        'BVT': '挪威属地',
        'ATF': '法国海外领地',
        'IOT': '英国海外领地',
        'SHN': '英国海外领地',
        'PCN': '英国海外领地',
        'BMU': '英国海外领地',
        'CYM': '英国海外领地',
        'VGB': '英国海外领地',
        'AIA': '英国海外领地',
        'MSR': '英国海外领地',
        'TCA': '英国海外领地',
        'ABW': '荷兰自治领地',
        'CUW': '荷兰自治领地',
        'SXM': '荷兰自治领地',
        'MAF': '法国海外领地',
        'BLM': '法国海外领地',
        'MTQ': '法国海外领地',
        'GLP': '法国海外领地',
        'DOM': '加勒比国家',
        'HTI': '加勒比国家',
        'JAM': '加勒比国家',
        'BRB': '加勒比国家',
        'GRD': '加勒比国家',
        'LCA': '加勒比国家',
        'VCT': '加勒比国家',
        'ATG': '加勒比国家',
        'DMA': '加勒比国家',
        'KNA': '加勒比国家',
        'TTO': '加勒比国家'
    };
    
    return countryInfo[countryCode] || '';
}

// 显示国家详情
function showCountryDetails(countryName, countryCode) {
    // 创建详情弹窗
    const detailsPopup = document.createElement('div');
    detailsPopup.className = 'country-details-popup';
    detailsPopup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        color: white;
        padding: 30px;
        border-radius: 12px;
        border: 1px solid #404040;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        text-align: center;
    `;
    
    content.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #4a90e2;">${countryName}</h2>
        <p style="margin-bottom: 15px; color: #cccccc;">国家代码: ${countryCode}</p>
        <p style="margin-bottom: 20px; color: #cccccc;">${getCountryInfo(countryCode) || '暂无详细信息'}</p>
        <button class="close-btn" style="
            background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
        ">关闭</button>
    `;
    
    detailsPopup.appendChild(content);
    document.body.appendChild(detailsPopup);
    
    // 关闭事件
    const closeBtn = content.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(detailsPopup);
    });
    
    detailsPopup.addEventListener('click', (e) => {
        if (e.target === detailsPopup) {
            document.body.removeChild(detailsPopup);
        }
    });
}

// 添加地图控制功能
function addMapControls() {
    const mapSection = document.querySelector('.world-map-section');
    if (!mapSection) return;
    
    // 创建控制按钮容器
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'map-controls';
    controlsContainer.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 15px;
    `;
    
    // 重置按钮
    const resetBtn = createControlButton('重置地图', 'icon-refresh', () => {
        const countries = document.querySelectorAll('.datamaps-subunit');
        countries.forEach(country => {
            country.classList.remove('active', 'highlight');
        });
    });
    
    // 高亮按钮
    const highlightBtn = createControlButton('高亮显示', 'icon-star', () => {
        const countries = document.querySelectorAll('.datamaps-subunit');
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        countries.forEach(country => country.classList.remove('highlight'));
        randomCountry.classList.add('highlight');
    });
    
    // 缩放按钮
    const zoomBtn = createControlButton('放大', 'icon-zoom-in', () => {
        const svg = document.querySelector('.datamap');
        if (svg) {
            svg.style.transform = 'scale(1.2)';
        }
    });
    
    controlsContainer.appendChild(resetBtn);
    controlsContainer.appendChild(highlightBtn);
    controlsContainer.appendChild(zoomBtn);
    
    mapSection.appendChild(controlsContainer);
}

// 创建控制按钮
function createControlButton(text, iconClass, onClick) {
    const button = document.createElement('button');
    button.className = 'map-btn';
    button.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: linear-gradient(135deg, #333333 0%, #555555 100%);
        color: white;
        border: 1px solid #666666;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    
    button.innerHTML = `<i class="${iconClass}"></i>${text}`;
    button.addEventListener('click', onClick);
    
    // 悬停效果
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
        this.style.background = 'linear-gradient(135deg, #444444 0%, #666666 100%)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
        this.style.background = 'linear-gradient(135deg, #333333 0%, #555555 100%)';
    });
    
    return button;
}

// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // ESC键关闭所有弹窗
        const popups = document.querySelectorAll('.country-details-popup, .map-tooltip');
        popups.forEach(popup => popup.remove());
        
        // 移除所有激活状态
        const countries = document.querySelectorAll('.datamaps-subunit');
        countries.forEach(country => {
            country.classList.remove('active', 'highlight');
        });
    }
});

// 添加触摸设备支持
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        const tooltip = document.querySelector('.map-tooltip');
        if (tooltip) {
            hideTooltip(tooltip);
        }
    });
} 