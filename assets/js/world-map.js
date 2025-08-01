// 世界地图交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化世界地图
    initWorldMap();
    // 加载热力图数据
    loadHeatmapData();
    // 初始化响应式调整
    initResponsiveAdjustment();
});

// 全局变量存储热力图数据
let heatmapData = {};
let maxUsers = 0;
let resizeTimeout = null;

// 初始化响应式调整
function initResponsiveAdjustment() {
    // 监听窗口大小变化
    window.addEventListener('resize', handleWindowResize);
    
    // 监听设备方向变化
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // 初始调整
    adjustMapForScreenSize();
}

// 处理窗口大小变化
function handleWindowResize() {
    // 防抖处理
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(() => {
        adjustMapForScreenSize();
        updateTooltipPosition();
    }, 250);
}

// 处理设备方向变化
function handleOrientationChange() {
    setTimeout(() => {
        adjustMapForScreenSize();
        updateTooltipPosition();
    }, 500);
}

// 根据屏幕大小调整地图
function adjustMapForScreenSize() {
    const mapContainer = document.querySelector('.world-map-container');
    const svg = document.querySelector('.datamap');
    
    if (!mapContainer || !svg) return;
    
    const containerWidth = mapContainer.clientWidth;
    const containerHeight = mapContainer.clientHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 计算最佳缩放比例
    let scale = 1;
    let maxWidth = containerWidth;
    let maxHeight = containerHeight;
    
    // 根据屏幕宽度调整
    if (windowWidth < 480) {
        // 小屏手机
        scale = 0.85;
        maxWidth = windowWidth - 20;
        maxHeight = 200;
    } else if (windowWidth < 768) {
        // 手机
        scale = 0.9;
        maxWidth = windowWidth - 30;
        maxHeight = 250;
    } else if (windowWidth < 1200) {
        // 平板
        scale = 1;
        maxWidth = Math.min(600, windowWidth - 40);
        maxHeight = 300;
    } else {
        // 桌面
        scale = 1;
        maxWidth = Math.min(800, windowWidth - 60);
        maxHeight = 400;
    }
    
    // 横屏模式特殊处理
    if (windowWidth > windowHeight && windowHeight < 600) {
        scale = 0.8;
        maxHeight = 180;
    }
    
    // 应用调整
    svg.style.maxWidth = maxWidth + 'px';
    svg.style.maxHeight = maxHeight + 'px';
    svg.style.transform = `scale(${scale})`;
    
    // 调整容器高度
    mapContainer.style.minHeight = maxHeight + 'px';
    
    // 更新SVG视口
    updateSVGViewport();
}

// 更新SVG视口
function updateSVGViewport() {
    const svg = document.querySelector('.datamap');
    if (!svg) return;
    
    const container = document.querySelector('.world-map-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // 设置SVG视口
    svg.setAttribute('viewBox', '0 0 345 278');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    
    // 确保SVG在容器中居中
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
}

// 更新工具提示位置
function updateTooltipPosition() {
    const tooltip = document.querySelector('.map-tooltip');
    if (tooltip && tooltip.classList.contains('show')) {
        // 重新计算工具提示位置
        const activeElement = document.querySelector('.datamaps-subunit:hover');
        if (activeElement) {
            const rect = activeElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            tooltip.style.left = (rect.left + scrollLeft + rect.width / 2) + 'px';
            tooltip.style.top = (rect.top + scrollTop - 40) + 'px';
        }
    }
}

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
    showHeatmapLegend(data);
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
function showHeatmapLegend(countryData) {
    const mapContainer = document.querySelector('.world-map-container');
    if (!mapContainer) return;
    
    // 检查是否已经存在图例
    const existingLegend = mapContainer.querySelector('.heatmap-legend');
    if (existingLegend) {
        existingLegend.remove();
    }
    
    const legend = document.createElement('div');
    legend.className = 'heatmap-legend';
    legend.style.cssText = `
        margin-bottom: 15px;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
    `;
    
    const legendBar = document.createElement('div');
    legendBar.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px 0;
        width: 20px;
        height: 100px;
        background: linear-gradient(to bottom, rgb(240, 249, 255), rgb(189, 215, 231), rgb(107, 174, 214), rgb(49, 130, 189), rgb(8, 81, 156), rgb(255, 255, 204), rgb(255, 237, 160), rgb(254, 217, 118), rgb(254, 178, 76), rgb(253, 141, 60), rgb(252, 78, 42), rgb(227, 26, 28), rgb(189, 0, 38), rgb(128, 0, 38));
        border-radius: 4px;
        position: relative;
    `;
    
    const legendLabels = document.createElement('div');
    legendLabels.style.cssText = `
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 11px;
        color: #cccccc;
        margin-left: 8px;
        height: 100px;
    `;
    legendLabels.innerHTML = `
        <span>high</span>
        <span>low</span>
    `;
    
    const legendContainer = document.createElement('div');
    legendContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    legendContainer.appendChild(legendBar);
    legendContainer.appendChild(legendLabels);
    
    legend.appendChild(legendContainer);
    
    // 插入到容器的顶部
    mapContainer.insertBefore(legend, mapContainer.firstChild);
    
    // 显示排名前5的国家/地区表格
    showTopCountriesTable(countryData);
}

// 显示排名前5的国家/地区表格
function showTopCountriesTable(countryData) {
    const mapContainer = document.querySelector('.world-map-container');
    if (!mapContainer) return;
    
    // 检查是否已经存在表格
    const existingTable = mapContainer.querySelector('.top-countries-table');
    if (existingTable) {
        existingTable.remove();
    }
    
    // 将数据转换为数组并排序
    const sortedCountries = Object.entries(countryData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, Math.min(5, Object.keys(countryData).length));
    
    if (sortedCountries.length === 0) return;
    
    const tableContainer = document.createElement('div');
    tableContainer.className = 'top-countries-table';
    tableContainer.style.cssText = `
        position: absolute;
        top: 0;
        right: 0;
        width: 250px;
        height: 100%;
        padding: 15px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-sizing: border-box;
        overflow-y: auto;
    `;
    
    const tableTitle = document.createElement('h5');
    tableTitle.style.cssText = `
        color: white;
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 16px;
        text-align: center;
    `;
    tableTitle.textContent = '';
    
    const table = document.createElement('table');
    table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        color: white;
        font-size: 14px;
    `;
    
    // 创建表头
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th style="
                padding: 10px;
                text-align: left;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                font-weight: bold;
                color: #4a90e2;
            ">Country/Region</th>
            <th style="
                padding: 10px;
                text-align: right;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                font-weight: bold;
                color: #4a90e2;
            ">Active Users</th>
        </tr>
    `;
    
    // 创建表体
    const tbody = document.createElement('tbody');
    sortedCountries.forEach(([countryCode, users], index) => {
        const countryName = getCountryName(countryCode);
        const row = document.createElement('tr');
        row.style.cssText = `
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;
        
        // 为前三名添加特殊样式
        if (index < 3) {
            row.style.background = 'rgba(74, 144, 226, 0.1)';
        }
        
        row.innerHTML = `
            <td style="
                padding: 10px;
                text-align: left;
                font-weight: ${index < 3 ? 'bold' : 'normal'};
            ">
                ${index + 1}. ${countryName}
            </td>
            <td style="
                padding: 10px;
                text-align: right;
                font-weight: ${index < 3 ? 'bold' : 'normal'};
                color: ${index < 3 ? '#4a90e2' : '#cccccc'};
            ">
                ${users.toLocaleString()}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(tableTitle);
    tableContainer.appendChild(table);
    
    // 插入到容器内部
    mapContainer.appendChild(tableContainer);
}

// 显示错误信息
function showErrorMessage(message) {
    const mapContainer = document.querySelector('.world-map-container');
    if (!mapContainer) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: 6px;
        color: #ff6b6b;
        text-align: center;
        font-size: 12px;
    `;
    errorDiv.textContent = message;
    
    // 插入到容器的顶部
    mapContainer.insertBefore(errorDiv, mapContainer.firstChild);
    
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
        
        // 触摸设备支持
        country.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleCountryTouch(e, this, tooltip);
        });
    });

}

// 处理触摸事件
function handleCountryTouch(e, country, tooltip) {
    const touch = e.touches[0];
    const touchEvent = {
        target: country,
        clientX: touch.clientX,
        clientY: touch.clientY
    };
    
    handleCountryHover(touchEvent, country, tooltip);
    
    // 3秒后自动隐藏工具提示
    setTimeout(() => {
        handleCountryLeave(touchEvent, country, tooltip);
    }, 3000);
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
    
    // 显示工具提示
    showTooltip(e, tooltip, countryName);
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
function showTooltip(e, tooltip, countryName) {
    tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">${countryName}</div>
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
        'CHN': '🇨🇳 China',
        'USA': '🇺🇸 United States of America',
        'JPN': '🇯🇵 Japan',
        'DEU': '🇩🇪 Germany',
        'GBR': '🇬🇧 United Kingdom',
        'FRA': '🇫🇷 France',
        'ITA': '🇮🇹 Italy',
        'CAN': '🇨🇦 Canada',
        'AUS': '🇦🇺 Australia',
        'BRA': '🇧🇷 Brazil',
        'RUS': '🇷🇺 Russia',
        'IND': '🇮🇳 India',
        'KOR': '🇰🇷 South Korea',
        'ESP': '🇪🇸 Spain',
        'MEX': '🇲🇽 Mexico',
        'IDN': '🇮🇩 Indonesia',
        'NLD': '🇳🇱 Netherlands',
        'SAU': '🇸🇦 Saudi Arabia',
        'TUR': '🇹🇷 Turkey',
        'CHE': '🇨🇭 Switzerland',
        'SWE': '🇸🇪 Sweden',
        'POL': '🇵🇱 Poland',
        'BEL': '🇧🇪 Belgium',
        'THA': '🇹🇭 Thailand',
        'AUT': '🇦🇹 Austria',
        'NOR': '🇳🇴 Norway',
        'ARE': '🇦🇪 United Arab Emirates',
        'IRN': '🇮🇷 Iran',
        'ISR': '🇮🇱 Israel',
        'SGP': '🇸🇬 Singapore',
        'HKG': '🇭🇰 Hong Kong',
        'TWN': '🇨🇳 Taiwan',
        'MYS': '🇲🇾 Malaysia',
        'PHL': '🇵🇭 Philippines',
        'VNM': '🇻🇳 Vietnam',
        'BGD': '🇧🇩 Bangladesh',
        'PAK': '🇵🇰 Pakistan',
        'EGY': '🇪🇬 Egypt',
        'ZAF': '🇿🇦 South Africa',
        'NGA': '🇳🇬 Nigeria',
        'KEN': '🇰🇪 Kenya',
        'ETH': '🇪🇹 Ethiopia',
        'TZA': '🇹🇿 Tanzania',
        'UGA': '🇺🇬 Uganda',
        'GHA': '🇬🇭 Ghana',
        'MOZ': '🇲🇿 Mozambique',
        'AGO': '🇦🇴 Angola',
        'CMR': '🇨🇲 Cameroon',
        'CIV': '🇨🇮 Ivory Coast',
        'MDG': '🇲🇬 Madagascar',
        'NER': '🇳🇪 Niger',
        'BFA': '🇧🇫 Burkina Faso',
        'MLI': '🇲🇱 Mali',
        'MWI': '🇲🇼 Malawi',
        'ZMB': '🇿🇲 Zambia',
        'SEN': '🇸🇳 Senegal',
        'TCD': '🇹🇩 Chad',
        'SOM': '🇸🇴 Somalia',
        'ZWE': '🇿🇼 Zimbabwe',
        'GIN': '🇬🇳 Guinea',
        'RWA': '🇷🇼 Rwanda',
        'BEN': '🇧🇯 Benin',
        'BDI': '🇧🇮 Burundi',
        'TUN': '🇹🇳 Tunisia',
        'BOL': '🇧🇴 Bolivia',
        'HND': '🇭🇳 Honduras',
        'GTM': '🇬🇹 Guatemala',
        'NIC': '🇳🇮 Nicaragua',
        'SLV': '🇸🇻 El Salvador',
        'CRI': '🇨🇷 Costa Rica',
        'PAN': '🇵🇦 Panama',
        'URY': '🇺🇾 Uruguay',
        'PRY': '🇵🇾 Paraguay',
        'GUF': '🇬🇫 French Guiana',
        'SUR': '🇸🇷 Suriname',
        'GUY': '🇬🇾 Guyana',
        'ECU': '🇪🇨 Ecuador',
        'PER': '🇵🇪 Peru',
        'COL': '🇨🇴 Colombia',
        'VEN': '🇻🇪 Venezuela',
        'CHL': '🇨🇱 Chile',
        'ARG': '🇦🇷 Argentina',
        'AFG': '🇦🇫 Afghanistan',
        'IRQ': '🇮🇶 Iraq',
        'SYR': '🇸🇾 Syria',
        'LBN': '🇱🇧 Lebanon',
        'JOR': '🇯🇴 Jordan',
        'YEM': '🇾🇪 Yemen',
        'OMN': '🇴🇲 Oman',
        'QAT': '🇶🇦 Qatar',
        'KWT': '🇰🇼 Kuwait',
        'BHR': '🇧🇭 Bahrain',
        'CYP': '🇨🇾 Cyprus',
        'GRC': '🇬🇷 Greece',
        'ALB': '🇦🇱 Albania',
        'MKD': '🇲🇰 North Macedonia',
        'SRB': '🇷🇸 Serbia',
        'MNE': '🇲🇪 Montenegro',
        'BIH': '🇧🇦 Bosnia and Herzegovina',
        'HRV': '🇭🇷 Croatia',
        'SVN': '🇸🇮 Slovenia',
        'HUN': '🇭🇺 Hungary',
        'SVK': '🇸🇰 Slovakia',
        'CZE': '🇨🇿 Czech Republic',
        'ROU': '🇷🇴 Romania',
        'BGR': '🇧🇬 Bulgaria',
        'MDA': '🇲🇩 Moldova',
        'UKR': '🇺🇦 Ukraine',
        'BLR': '🇧🇾 Belarus',
        'LTU': '🇱🇹 Lithuania',
        'LVA': '🇱🇻 Latvia',
        'EST': '🇪🇪 Estonia',
        'FIN': '🇫🇮 Finland',
        'DNK': '🇩🇰 Denmark',
        'ISL': '🇮🇸 Iceland',
        'IRL': '🇮🇪 Ireland',
        'PRT': '🇵🇹 Portugal',
        'LUX': '🇱🇺 Luxembourg',
        'LIE': '🇱🇮 Liechtenstein',
        'MCO': '🇲🇨 Monaco',
        'AND': '🇦🇩 Andorra',
        'SMR': '🇸🇲 San Marino',
        'VAT': '🇻🇦 Vatican City',
        'MLT': '🇲🇹 Malta',
        'GIB': '🇬🇮 Gibraltar',
        'IMN': '🇮🇲 Isle of Man',
        'JEY': '🇯🇪 Jersey',
        'GGY': '🇬🇬 Guernsey',
        'FRO': '🇫🇴 Faroe Islands',
        'GRL': '🇬🇱 Greenland',
        'SJM': '🇸🇯 Svalbard',
        'BVT': '🇧🇻 Bouvet Island',
        'ATF': '🇹🇫 French Southern Territories',
        'IOT': '🇮🇴 British Indian Ocean Territory',
        'SHN': '🇸🇭 Saint Helena',
        'PCN': '🇵🇳 Pitcairn Islands',
        'BMU': '🇧🇲 Bermuda',
        'CYM': '🇰🇾 Cayman Islands',
        'VGB': '🇻🇬 British Virgin Islands',
        'AIA': '🇦🇮 Anguilla',
        'MSR': '🇲🇸 Montserrat',
        'TCA': '🇹🇨 Turks and Caicos Islands',
        'ABW': '🇦🇼 Aruba',
        'CUW': '🇨🇼 Curaçao',
        'SXM': '🇸🇽 Sint Maarten',
        'MAF': '🇲🇫 Saint Martin',
        'BLM': '🇧🇱 Saint Barthélemy',
        'MTQ': '🇲🇶 Martinique',
        'GLP': '🇬🇵 Guadeloupe',
        'DOM': '🇩🇴 Dominican Republic',
        'HTI': '🇭🇹 Haiti',
        'JAM': '🇯🇲 Jamaica',
        'BRB': '🇧🇧 Barbados',
        'GRD': '🇬🇩 Grenada',
        'LCA': '🇱🇨 Saint Lucia',
        'VCT': '🇻🇨 Saint Vincent and the Grenadines',
        'ATG': '🇦🇬 Antigua and Barbuda',
        'DMA': '🇩🇲 Dominica',
        'KNA': '🇰🇳 Saint Kitts and Nevis',
        'TTO': '🇹🇹 Trinidad and Tobago'
    };
    
    return countryNames[countryCode] || countryCode;
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




// 添加键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // ESC键关闭所有弹窗
        const popups = document.querySelectorAll('.country-details-popup, .map-tooltip');
        popups.forEach(popup => popup.remove());
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