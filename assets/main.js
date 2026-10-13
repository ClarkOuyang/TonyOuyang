(function () {
  var G = window.GALLERY;
  var CATS = [
    { key: 'ziyuan', period: '2011 – 2025', zh: '紫苑 · 中西融合菜 / 粤菜', en: 'Ziyuan · Fusion / Cantonese',
      noteZh: '深圳紫苑文化发展有限公司 · 中西融合菜、粤菜、花胶鸡火锅', noteEn: 'Shenzhen Ziyuan Cultural Development · Fusion, Cantonese, fish-maw chicken hot pot' },
    { key: 'yanjiao', period: '2025 – 2026', zh: '宝岛美食街 · 台湾菜', en: 'Treasure Island Food Street · Taiwanese',
      noteZh: '深圳市焰椒餐饮管理有限公司 · 台湾美食顾问', noteEn: 'Shenzhen Yanjiao Catering · Taiwan Cuisine Consultant' },
    { key: 'beijing', period: '2009 – 2011', zh: '北京泰笛黛丝 · 轻食 / 西餐', en: 'Taste-tasty, Beijing · Light Food / Western',
      noteZh: '北京泰笛黛丝食品公司 · 行政总厨（轻食/西餐）', noteEn: 'Taste-tasty Western Restaurant, Beijing · Executive Chef (light food / Western)' },
    { key: 'sheraton', period: '2003 – 2006', zh: '台北喜来登 · 无国界料理 / 西餐', en: 'Sheraton Taipei · Global Fusion / Western',
      noteZh: '台北喜来登酒店 · 咖啡厅、无国界料理', noteEn: 'Sheraton Hotel Taipei · Coffee shop & global fusion cuisine' },
    { key: 'others', period: '2002', zh: '其它 · 餐饮教学', en: 'Others · Culinary Teaching',
      noteZh: '2002 年兼任台北育达高级中学餐饮顾问教师', noteEn: '2002 · Culinary advisor-teacher, Yu Da High School, Taipei' }
  ];

  // ---- language ----
  var root = document.documentElement;
  var btn = document.getElementById('langBtn');
  function getLang() { try { return localStorage.getItem('lang'); } catch (e) { return null; } }
  function setLang(l) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l === 'zh' ? 'zh-CN' : 'en');
    btn.textContent = l === 'zh' ? 'EN' : '中文';
    try { localStorage.setItem('lang', l); } catch (e) {}
    renderTabs();
  }
  btn.addEventListener('click', function () { setLang(root.getAttribute('data-lang') === 'zh' ? 'en' : 'zh'); });

  // ---- gallery ----
  var tabsEl = document.getElementById('tabs');
  var gridEl = document.getElementById('grid');
  var noteEl = document.getElementById('tabNote');
  var current = 'ziyuan';

  function lang() { return root.getAttribute('data-lang'); }

  function tile(item, list, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile';
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = item.cap || 'Tony Ouyang';
    img.onload = function () { img.classList.add('loaded'); };
    img.src = 'assets/img/' + item.src.replace('.jpg', '-t.jpg');
    b.appendChild(img);
    b.addEventListener('click', function () { openLb(list, i); });
    return b;
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    CATS.forEach(function (c) {
      var t = document.createElement('button');
      t.type = 'button';
      t.className = 'tab';
      t.setAttribute('role', 'tab');
      t.setAttribute('aria-selected', c.key === current ? 'true' : 'false');
      t.innerHTML = '<small></small>';
      t.firstChild.textContent = c.period + ' · ' + G[c.key].length + (lang() === 'zh' ? ' 张' : ' photos');
      t.insertBefore(document.createTextNode(lang() === 'zh' ? c.zh : c.en), t.firstChild);
      t.addEventListener('click', function () { current = c.key; renderTabs(); renderGrid(); });
      tabsEl.appendChild(t);
    });
    var cat = CATS.filter(function (c) { return c.key === current; })[0];
    noteEl.textContent = lang() === 'zh' ? cat.noteZh : cat.noteEn;
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    var list = G[current];
    list.forEach(function (item, i) { gridEl.appendChild(tile(item, list, i)); });
  }

  var recipeEl = document.getElementById('recipeGrid');
  G.recipe.forEach(function (item, i) { recipeEl.appendChild(tile(item, G.recipe, i)); });

  // ---- lightbox ----
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var lbList = [], lbIdx = 0;

  function show() {
    var it = lbList[lbIdx];
    lbImg.src = 'assets/img/' + it.src;
    lbImg.alt = it.cap || 'Tony Ouyang';
    lbCap.textContent = (it.cap ? it.cap + '  ·  ' : '') + (lbIdx + 1) + ' / ' + lbList.length;
    var nxt = lbList[(lbIdx + 1) % lbList.length];
    new Image().src = 'assets/img/' + nxt.src;
  }
  function openLb(list, i) {
    lbList = list; lbIdx = i; show();
    lb.hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; lbImg.removeAttribute('src'); }
  function step(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; show(); }

  lb.querySelector('.lb-close').addEventListener('click', closeLb);
  lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });

  // ---- misc ----
  document.querySelectorAll('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () {
        var spans = b.querySelectorAll('span');
        spans[0].textContent = '已复制'; spans[1].textContent = 'Copied';
        setTimeout(function () { spans[0].textContent = '复制'; spans[1].textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  setLang(getLang() || (/^zh/i.test(navigator.language || 'zh') ? 'zh' : 'en'));
  renderGrid();
})();
