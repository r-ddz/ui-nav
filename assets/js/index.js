// 当DOM内容加载完成后执行指定的函数
window.addEventListener('DOMContentLoaded', async () => {

});

function indexInit() {
    try {
        const menuList = [
            {
                name: '常用', type: 1, linecons: 'linecons-star', subMenuList: []
            },
            {
                name: '总分类', type: 2, linecons: 'linecons-search',
                subMenuList: [
                    'GitHub Pages',
                    '开源项目',
                    '收藏',
                    '程序员',
                    '资源'
                ]
            },
            {
                name: '路由器', type: 1, linecons: 'linecons-star', subMenuList: []
            },
            {
                name: '色色', type: 3, linecons: 'linecons-heart', subMenuList: []
            }
        ];

        // 创建菜单dom
        createMenuDom(menuList);

        // 创建导航dom
        createNavDom(menuList);

    } catch (error) {
        // 捕获数据加载过程中出现的错误
        console.error('数据加载失败:', error);
        // 向用户显示数据加载失败的提示信息
        alert('页面数据加载失败，请稍后刷新重试');
    }
}

// 创建菜单dom
function createMenuDom(menuList) {
    // 菜单dom节点
    const menuDom = document.getElementById('main-menu');
    menuList.forEach(menu => {
        if (menu.type === 1){
            menuDom.appendChild(createMenuDom1(menu));
        }else if (menu.type === 2){
            menuDom.appendChild(createMenuDom2(menu));
        }else if (menu.type === 3){
            menuDom.appendChild(createMenuDom3(menu));
        }
    })
}

// 创建菜单dom类型1的菜单，无子菜单
function createMenuDom1(menu) {
    const liDom = document.createElement('li');
    liDom.innerHTML = `
        <a href="#${menu.name}" class="smooth">
            <i class="${menu.linecons}"></i>
            <span class="title">${menu.name}</span>
        </a>
    `;
    return liDom;
}

// 创建菜单dom类型2的菜单，有子菜单
function createMenuDom2(menu) {
    const subMenuStrList = [];
    menu.subMenuList.forEach(subMenu => {
        subMenuStrList.push(`
            <li>
                <a href="#${subMenu}" class="smooth">
                    <i class="linecons-star"></i>
                    <span class="title">${subMenu}</span>
                </a>
            </li>
        `);
    });
    const liDom = document.createElement('li');
    liDom.innerHTML = `
                    <a>
                        <i class="${menu.linecons}"></i>
                        <span class="title">${menu.name}</span>
                    </a>
                    <ul>${subMenuStrList.join( '')}</ul>
                `;
    return liDom;
}

// 创建菜单dom类型3的菜单，无子菜单，默认隐藏
function createMenuDom3(menu) {
    const liDom = document.createElement('li');
    liDom.className = 'hidden-category';
    liDom.innerHTML = `
        <a href="#${menu.name}" class="smooth">
            <i class="${menu.linecons}"></i>
            <span class="title">${menu.name}</span>
        </a>
    `;
    return liDom;
}

// 创建导航dom
async function createNavDom(menuList) {
    try {
        // 获取json文件列表
        const jsonFiles = getJsonFiles(menuList);
        // 使用Promise.all并行获取所有json的数据
        const categories = await Promise.all(jsonFiles.map(file => fetch(file).then(res => res.json())));

        // 收集每一个json里导航的dom字符串
        const jsonDomStrList = [];
        categories.forEach(data => {
            jsonDomStrList.push(buildDomStrByJson(data));
        });

        // 组装整个json dom字符串，各自json dom字符串之间用<br />分隔
        let jsonDomStr = jsonDomStrList.join('<br />');

        // 最后再拼接一个页脚footer
        jsonDomStr += buildFooterDomStr();

        // 将json dom字符串添加到导航dom中
        const navDom = document.getElementById('main-navigation');
        navDom.innerHTML = jsonDomStr;
    } catch (error) {
        // 捕获数据加载过程中出现的错误
        console.error('数据加载失败:', error);
        // 向用户显示数据加载失败的提示信息
        alert('页面数据加载失败，请稍后刷新重试');
    }
}

function buildDomStrByJson(data) {
    // 创建每一个具体导航的dom字符串
    const itemDomStrList = [];
    data.items.forEach(item => itemDomStrList.push(`
        <div class="col-sm-3">
            <div class="xe-widget xe-conversations box2 label-info" data-toggle="tooltip" data-placement="bottom" 
                onclick="window.open('${item.url}', '_blank')" 
                title="${item.title ? item.title : item.url}" 
                data-original-title="${item.title ? item.title : item.url}">
                <div class="xe-comment-entry">
                    <a class="xe-user-img">
<!--                        <img data-src="./assets/images/logos/ziticangku.png" class="lozad img-circle" width="40">-->
                        <img src="${getFavicon(item)}" class="lozad img-circle" width="40">
                    </a>
                    <div class="xe-comment">
                        <a href="#" class="xe-user-name overflowClip_1">
                            <strong>${item.name}</strong>
                        </a>
                        <p class="overflowClip_2">${item.desc}</p>
                    </div>
                </div>
            </div>
        </div>
    `));

    // 组装整个json的dom字符串，开头是h4标签，然后每4个导航分为一行
    let domStr = `
        <h4 class="text-gray${data.secret ? ' hidden-category' : ''}">
            <i class="linecons-tag" style="margin-right: 7px;" id="${data.className}"></i>
            ${data.className}
        </h4>
    `;
    for (let i = 0; i < itemDomStrList.length; i += 4) {
        domStr += `
            <div class="row${data.secret ? ' hidden-category' : ''}">
                ${itemDomStrList.slice(i, i + 4).join('')}
            </div>
        `;
    }
    return domStr;
}

function buildFooterDomStr(){
    return `
        <br />
        <footer class="main-footer sticky footer-type-1">
            <div class="footer-inner">
                <!-- Add your copyright text here -->
                <div class="footer-text" ondblclick="showSecretCategory()">
                    &copy; 2025-2025
                    <a href="index.html"><strong>刷新首页</strong></a>
                    <!--  - Purchase for only <strong>23$</strong> -->
                </div>
                <!-- Go to Top Link, just add rel="go-top" to any link to add this functionality -->
                <div class="go-up">
                    <a href="#" rel="go-top">
                        <i class="fa-angle-up"></i>
                    </a>
                </div>
            </div>
        </footer>
    `;
}

// 获取json文件列表
function getJsonFiles(menuList) {
    const jsonFiles = [];
    menuList.forEach(menu => {
        if (menu.type === 2) {
            menu.subMenuList.forEach(subMenu => jsonFiles.push(getJsonFilePath(subMenu)));
        } else{
            jsonFiles.push(getJsonFilePath(menu.name));
        }
    });
    return jsonFiles;
}

// 获取json文件路径
function getJsonFilePath(str) {
    return `assets/json/${str}.json`;
}

// 获取网站favicon
function getFavicon(item) {
    if (item.icon) {
        return item.icon;
    }
    try {
        const domain = new URL(item.url).origin;
        return `${domain}/favicon.ico`;
    } catch {
        return 'data:image/png;base64,...'; // 默认图标
    }
}

// 展示隐藏私密导航
function showSecretCategory() {
    document.querySelectorAll('.hidden-category').forEach(
        el => el.style.display === 'none' ? el.style.display = 'block' : el.style.display = 'none'
    );
}
