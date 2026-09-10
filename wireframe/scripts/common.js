/* common.js — Wireframe 공용 스크립트
   역할 3가지
   1) 화면 meta(JSON)를 읽어 App Header / Bottom Navigation 같은 공통 컴포넌트를 주입
   2) State Variant 전환 (?state=xxx) — data-when / data-not 속성으로 표시 제어
   3) 검토용 Chrome 바 + Annotation 레일 렌더 (실제 앱 UI와 분리)
   실제 서버·API는 연결하지 않는다. 모든 값은 Mock Data. */

(function () {
  'use strict';

  var TABS = [
    { id: 'run',    label: '러닝', href: '03-run-start.html' },
    { id: 'rank',   label: '랭킹', href: '06-ranking.html' },
    { id: 'record', label: '기록', href: '07-record.html' }
  ];

  var metaEl = document.getElementById('screen-meta');
  if (!metaEl) return;
  var meta = JSON.parse(metaEl.textContent);

  var phone = document.querySelector('.phone');
  var params = new URLSearchParams(location.search);
  var embed = params.get('embed') === '1';   /* 갤러리 iframe 미리보기 — 검토용 Chrome 숨김 */
  if (embed) document.body.classList.add('embed');
  var state = params.get('state');
  var ids = meta.states.map(function (s) { return s.id; });
  if (ids.indexOf(state) === -1) state = ids[0];

  /* ── 공통 컴포넌트 주입 ───────────────────────────── */

  if (meta.header) {
    var header = document.createElement('header');
    header.className = 'app-header';
    var h = document.createElement('h1');
    h.className = 'app-header__title';
    h.textContent = meta.header;
    header.appendChild(h);
    phone.insertBefore(header, phone.firstChild);
  }

  if (meta.tab) {
    var nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    TABS.forEach(function (t) {
      var a = document.createElement('a');
      a.className = 'bottom-nav__item';
      a.href = t.href;
      a.dataset.icon = t.id;
      if (t.id === meta.tab) a.setAttribute('aria-current', 'page');
      var icon = document.createElement('span');
      icon.className = 'bottom-nav__icon';
      var label = document.createElement('span');
      label.className = 'bottom-nav__label';
      label.textContent = t.label;
      a.appendChild(icon);
      a.appendChild(label);
      nav.appendChild(a);
    });
    phone.appendChild(nav);
  }

  /* ── 검토용 Chrome 바 ─────────────────────────────── */

  var chrome = document.createElement('div');
  chrome.className = 'chrome';
  chrome.innerHTML =
    '<span class="chrome__tag">' + meta.id + '</span>' +
    '<span class="chrome__title">' + meta.name + '</span>' +
    '<span class="chrome__states"></span>' +
    '<button class="chrome__btn" data-annot-toggle>주석</button>' +
    '<a class="chrome__link" href="../index.html">← 갤러리</a>';
  if (!embed) document.body.insertBefore(chrome, document.body.firstChild);

  var stateWrap = chrome.querySelector('.chrome__states');
  meta.states.forEach(function (s) {
    var b = document.createElement('button');
    b.className = 'chrome__btn';
    b.textContent = s.label;
    b.dataset.state = s.id;
    b.addEventListener('click', function () { setState(s.id); });
    stateWrap.appendChild(b);
  });

  /* ── Annotation 레일 ──────────────────────────────── */

  var annot = document.createElement('aside');
  annot.className = 'annot';
  if (!embed) document.querySelector('.stage').appendChild(annot);

  function renderAnnot() {
    var t = meta.trace;
    var rows = [
      ['WORKFLOW', t.workflow],
      ['FEATURE', t.feature],
      ['REQUIREMENT', t.requirement],
      ['POLICY', t.policy || '해당 없음']
    ];
    var html =
      '<span class="annot__tag">' + meta.id + ' · 검토용 주석</span>' +
      '<div class="annot__title">' + meta.name + '</div>' +
      '<div class="annot__block"><span class="annot__key">목적</span><span>' + meta.purpose + '</span></div>';
    rows.forEach(function (r) {
      html += '<div class="annot__block"><span class="annot__key">' + r[0] + '</span><span>' + r[1] + '</span></div>';
    });
    html += '<div class="annot__block"><span class="annot__key">STATE</span><div class="annot__states">';
    meta.states.forEach(function (s) {
      html += '<div class="annot__state' + (s.id === state ? ' is-on' : '') + '">' +
              '<b>' + s.label + '</b><br>' + s.note + '</div>';
    });
    html += '</div></div>';
    if (meta.issue) {
      html += '<div class="annot__note"><b>[확인 필요]</b><br>' + meta.issue + '</div>';
    }
    annot.innerHTML = html;
  }

  var annotOn = true;
  try {
    if (localStorage.getItem('wf-annot') === 'off') annotOn = false;
  } catch (e) { /* private mode 등 — 기본값 유지 */ }

  function applyAnnot() {
    document.body.classList.toggle('annot-on', annotOn);
    var btn = chrome.querySelector('[data-annot-toggle]');
    btn.classList.toggle('is-on', annotOn);
  }

  chrome.querySelector('[data-annot-toggle]').addEventListener('click', function () {
    annotOn = !annotOn;
    try { localStorage.setItem('wf-annot', annotOn ? 'on' : 'off'); } catch (e) {}
    applyAnnot();
  });

  /* ── State 적용 ───────────────────────────────────── */

  function setState(next) {
    state = next;
    var url = new URL(location.href);
    url.searchParams.set('state', state);
    history.replaceState(null, '', url);
    apply();
  }

  function apply() {
    document.querySelectorAll('[data-when]').forEach(function (el) {
      el.hidden = el.dataset.when.split(' ').indexOf(state) === -1;
    });
    document.querySelectorAll('[data-not]').forEach(function (el) {
      el.hidden = el.dataset.not.split(' ').indexOf(state) !== -1;
    });
    stateWrap.querySelectorAll('.chrome__btn').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.state === state);
    });
    renderAnnot();
    if (typeof window.onStateChange === 'function') window.onStateChange(state);
  }

  applyAnnot();
  apply();
})();
