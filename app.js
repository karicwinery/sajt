/* ============================================================
   Vinarija Karić — behavior ported from "Vinarija Karic.dc.html"
   (DCLogic component -> vanilla JS). No build step required.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- product data (verbatim from the design source) ---------- */
  var products = {
    belo: {
      id: 'belo', name: 'Adria belo', crumb: 'ADRIA BELO', accent: '#24408e',
      sub: 'Miris mediterana u boci vina',
      img: 'assets/belo.png', imgPh: 'Adria belo — velika fotografija boce (assets/belo.png)',
      desc: 'ADRIA belo je autentično belo vino sa niskim sadržajem sulfita, napravljeno od autohtonih balkanskih sorti grožđa: srpske tamjanike, istarske malvazije i grašca. Odlikuje se zlatnom bojom sa zelenkastim odsjajem, bistro je i ima guste vinske suze. Na prvi miris osvojiće vas aroma zove i veoma intenzivni mirisi tropskog voća. Ukus savršeno prati intenzitet arome, što pokazuje da je vino u potpunom balansu. Veoma je hrskavo, sa sočnim aromama dinje, karamele i meda, dok se u dugoj završnici osećaju citrusi poput limuna i limete, i na samom kraju, osvežavajuća mineralnost.',
      alk: '13%', sec: '2.1 g/l', kis: '5.6 g/l', ph: '3.55',
      vinif: 'Berba ručno u zoru. Maceracija 6 sati pri niskoj temperaturi. Hladna fermentacija u inox tankovima 15°C, nakon čega vino odležava 9 meseci na finom talogu a zatim još 3 meseca u boci.',
      geo: 'Vinogradi na jugoistočnim padinama planine Cer, 200m nadmorske visine, tlo je glinasta ilovača.',
      sastav: 'Grašac 50%, Malvazija 35%, Tamjanika 15%.',
      note: 'Belo cveće, dinja, bela breskva, med, mineralni ton, dugi osvežavajući finale.'
    },
    crveno: {
      id: 'crveno', name: 'Adria crveno', crumb: 'ADRIA CRVENO', accent: '#a41623',
      sub: 'Dubina balkanske zemlje u čaši',
      img: 'assets/crveno.png', imgPh: 'Adria crveno — velika fotografija boce (assets/crveno.png)',
      desc: 'ADRIA crveno je kupaža autohtonih sorti grožđa Frankovke i Prokupca sa dodirom Marselana, odležala 18 meseci u buradima od slavonskog hrasta zapremine 500 litara i 3 meseca u boci. Odlikuje se intenzivnom rubin bojom sa purpurnim odsjajem, a stilski je veoma voćno. Na nepcu se izdvaja crno voće, poput kupine i suve šljive, uz note sladića i fine, glatke tanine.',
      alk: '14,5%', sec: '0,92 g/l', kis: '5.32 g/l', ph: '3,53',
      vinif: 'Berba ručno u punoj zrelosti. Klasična maceracija sa fermentacijom 15 dana uz svakodnevno mešanje u fermentatorima od inoxa. Malolaktička fermentacija se odvija u bačvama od slavonskog hrasta gde vino zatim 18 meseci odležava.',
      geo: 'Vinogradi na južnim padinama planine Cer, 200m nadmorske visine, tlo je glinasta ilovača.',
      sastav: 'Frankovka 70%, Prokupac 15%, Marselan 15%.',
      note: 'Zrele tamne bobice, začini, suva šljiva, sladić, baršunasti tanini, duga završnica.'
    }
  };

  var GOLD = '#c9a05a', IDLE = '#cfc7b8';
  var SECTION_IDS = ['adria-sekcija', 'vinarija-sekcija', 'vinar-sekcija', 'kontakt-sekcija'];

  var state = { page: 'home', activeSection: 'top', formSent: false };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var homeView = $('#home-view');
  var detailView = $('#detail-view');

  /* ---------- initial page from ?start= (home | belo | crveno) ---------- */
  var params = new URLSearchParams(window.location.search);
  var start = params.get('start');
  if (start === 'belo' || start === 'crveno') state.page = start;

  /* =====================================================================
     Navigation
     ===================================================================== */
  function go(page) {
    state.page = page;
    applyPage();
    window.scrollTo(0, 0);
    scheduleReveals();
    heroIntro();
  }

  function goSection(id) {
    var run = function () {
      var el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    };
    if (state.page !== 'home') { go('home'); setTimeout(run, 60); }
    else run();
  }

  function applyPage() {
    var isDetail = state.page === 'belo' || state.page === 'crveno';
    homeView.classList.toggle('hidden', isDetail);
    detailView.classList.toggle('hidden', !isDetail);
    if (isDetail) fillDetail(products[state.page]);
    updateNav();
  }

  function fillDetail(p) {
    $('#d-crumb').textContent = p.crumb;
    $('#d-crumb').style.color = p.accent;
    $('#d-kicker').style.color = p.accent;
    $('#d-name').textContent = p.name;
    $('#d-sub').textContent = p.sub;
    $('#d-sastav').textContent = p.sastav;
    $('#d-alk').textContent = p.alk;
    $('#d-sec').textContent = p.sec;
    $('#d-kis').textContent = p.kis;
    $('#d-ph').textContent = p.ph;
    $('#d-desc').textContent = p.desc;
    $('#d-note').textContent = p.note;
    $('#d-vinif').textContent = p.vinif;
    $('#d-geo').textContent = p.geo;

    var slot = $('#d-bottle');
    var img = $('#d-bottle-img');
    slot.classList.remove('no-img');
    $('#d-bottle-ph').innerHTML = p.imgPh;
    img.alt = p.name;
    img.src = p.img;      // triggers onerror -> placeholder if missing
  }

  function updateNav() {
    var page = state.page, sec = state.activeSection, home = page === 'home';
    var isDetail = page === 'belo' || page === 'crveno';
    var colors = {
      home:     home && sec === 'top' ? GOLD : IDLE,
      adria:    isDetail || (home && sec === 'adria-sekcija') ? GOLD : IDLE,
      vinarija: home && sec === 'vinarija-sekcija' ? GOLD : IDLE,
      vinar:    home && sec === 'vinar-sekcija' ? GOLD : IDLE,
      kontakt:  home && sec === 'kontakt-sekcija' ? GOLD : IDLE
    };
    $$('.nav [data-nav]').forEach(function (el) {
      var key = el.getAttribute('data-nav');
      el.classList.toggle('active', colors[key] === GOLD);
    });
  }

  /* mobile hamburger menu */
  var header = $('.header');
  var navToggle = $('#nav-toggle');
  function closeMenu() {
    header.classList.remove('menu-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* delegated click handling for every nav / cta with data-go or data-section */
  document.addEventListener('click', function (e) {
    var goEl = e.target.closest('[data-go]');
    if (goEl) { closeMenu(); go(goEl.getAttribute('data-go')); return; }
    var secEl = e.target.closest('[data-section]');
    if (secEl) { closeMenu(); goSection(secEl.getAttribute('data-section')); return; }
    // tap outside an open menu closes it
    if (header.classList.contains('menu-open') && !e.target.closest('.header')) closeMenu();
  });

  /* =====================================================================
     Scroll: hero parallax + section scroll-spy
     ===================================================================== */
  var raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var el = document.getElementById('hero-parallax');
      if (el && el.parentElement) {
        var off = 0.14 * el.parentElement.offsetHeight;
        el.style.transform = 'translateY(' + (off - Math.min(window.scrollY * 0.28, 2 * off)) + 'px)';
      }
      if (state.page === 'home') {
        var mark = window.innerHeight * 0.45;
        var active = 'top';
        SECTION_IDS.forEach(function (id) {
          var s = document.getElementById(id);
          if (s && s.getBoundingClientRect().top <= mark) active = id;
        });
        if (active !== state.activeSection) { state.activeSection = active; updateNav(); }
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* =====================================================================
     Hero intro animation
     ===================================================================== */
  function heroIntro() {
    var box = document.getElementById('hero-content');
    var img = document.querySelector('#hero-parallax .imgslot');
    if (!box || box.dataset.in || state.page !== 'home') return;
    box.dataset.in = '1';
    box.style.opacity = '0';
    box.style.transform = 'translateY(28px)';
    if (img) { img.style.transform = 'scale(1.07)'; img.style.transformOrigin = '50% 30%'; }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        box.style.transition = 'opacity 1.1s ease 0.25s, transform 1.1s ease 0.25s';
        box.style.opacity = '1';
        box.style.transform = 'none';
        if (img) {
          img.style.transition = 'transform 2.2s cubic-bezier(0.22,0.61,0.36,1)';
          img.style.transform = 'scale(1)';
        }
      });
    });
  }

  /* =====================================================================
     Reveal-on-scroll (IntersectionObserver)
     ===================================================================== */
  var io = null;
  function initReveals() {
    io = io || new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    var els = $$('#adria-sekcija .grid-2 > *, #vinarija-sekcija > .prose, #vinar-sekcija > *, #kontakt-sekcija .wrap > *');
    var i = 0;
    els.forEach(function (el) {
      if (el.dataset.rv) return;
      el.dataset.rv = '1';
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return; // already in view — don't blink
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      var d = (i % 2) * 0.12;
      el.style.transition = 'opacity 0.9s ease ' + d + 's, transform 0.9s ease ' + d + 's';
      i++;
      io.observe(el);
    });
  }
  var rvT = null;
  function scheduleReveals() { clearTimeout(rvT); rvT = setTimeout(initReveals, 80); }

  /* Safety net: never leave content stuck invisible if the observer
     doesn't fire (deep-link to an anchor, IO edge cases, etc.). */
  function revealAllSafety() {
    $$('[data-rv]').forEach(function (el) {
      if (el.style.opacity === '0') { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
  }
  window.addEventListener('load', function () { setTimeout(revealAllSafety, 1600); });

  /* =====================================================================
     Contact form (validation ported 1:1)
     ===================================================================== */
  var form = $('#contact-form');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setErr(name, msg) { $('[data-err="' + name + '"]').textContent = msg || ''; }

  form.addEventListener('input', function (e) {
    if (e.target.name) setErr(e.target.name, '');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ime = $('#f-ime').value.trim();
    var email = $('#f-email').value.trim();
    var poruka = $('#f-poruka').value.trim();
    var eIme = ime ? '' : 'Unesite vaše ime.';
    var eEmail = emailRe.test(email) ? '' : 'Unesite ispravnu email adresu.';
    var ePoruka = poruka ? '' : 'Unesite poruku.';
    if (eIme || eEmail || ePoruka) {
      setErr('ime', eIme); setErr('email', eEmail); setErr('poruka', ePoruka);
      return;
    }
    // success — matches the design's formSent state
    form.classList.add('hidden');
    $('#form-ok').classList.remove('hidden');
  });

  /* =====================================================================
     Boot
     ===================================================================== */
  applyPage();
  onScroll();
  initReveals();
  heroIntro();
})();
