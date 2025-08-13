// 所有数据
var RDDZ_DATA = [];
// 所有数据长度，以此判断是否全部动态加载已经完毕，好加载导航dom
var RDDZ_DATA_LENGTH = 0;

//初始化
function indexInit() {
    const menuList = [
        {
            name: '常用', type: 1, linecons: 'linecons-star', subMenuList: []
        },
        {
            name: 'MyPages', type: 1, linecons: 'linecons-star', subMenuList: []
        },
        {
            name: '总分类', type: 2, linecons: 'linecons-search',
            subMenuList: [
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
    // 获取文件名列表
    const fileNames = getFileNames(menuList);
    RDDZ_DATA_LENGTH = fileNames.length;

    // 给html页面动态引入js文件，回调函数会将数据加入到 RDDZ_DATA
    fileNames.forEach(fileName => loadJavaScript(fileName));

    // 创建菜单dom
    createMenuDom(menuList);
}

// 获取文件名列表
function getFileNames(menuList) {
    const jsonFiles = [];
    menuList.forEach(menu => {
        if (menu.type === 2) {
            menu.subMenuList.forEach(subMenu => jsonFiles.push(subMenu));
        } else{
            jsonFiles.push(menu.name);
        }
    });
    return jsonFiles;
}

function loadJavaScript(fileName) {
    const filePath = `./assets/js/rddz/${fileName}.js`;
    // 检查脚本是否已经存在，避免重复加载
    const existingJavaScript = document.querySelector(`script[src="${filePath}"]`);
    if (existingJavaScript) {
        return;
    }

    // 创建script标签
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = filePath;

    // 添加加载成功回调
    script.onload = function() {
        loadSuccess(fileName);
    };

    // 添加加载失败回调
    script.onerror = function() {
        loadError(filePath);
    };

    // 将script标签添加到页面中
    document.head.appendChild(script);
}

function loadSuccess(fileName) {
    const objName = 'RDDZ_DATA_' + fileName;
    // 收集数据
    RDDZ_DATA.push(eval(objName));
    // 如果数据已经收集完毕，则创建导航dom
    if (RDDZ_DATA.length === RDDZ_DATA_LENGTH) {
        createNavDom();
    }
}

function loadError(filePath) {
    alert('动态加载js失败，文件路径：' + filePath);
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
function createNavDom() {
    // 收集每一个json里导航的dom字符串
    const jsonDomStrList = [];
    RDDZ_DATA.forEach(data => {
        jsonDomStrList.push(buildDomStrByJson(data));
    });

    // 组装整个json dom字符串，各自json dom字符串之间用<br />分隔
    let jsonDomStr = jsonDomStrList.join('<br />');

    // 最后再拼接一个页脚footer
    jsonDomStr += buildFooterDomStr();

    // 将json dom字符串添加到导航dom中
    const navDom = document.getElementById('main-navigation');
    navDom.innerHTML = jsonDomStr;
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