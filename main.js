(function () {
  var COPY = window.DF_COPY;
  var current = 'en';

  function lookup(dict, path) {
    return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, dict);
  }

  function setLang(lang) {
    if (!COPY[lang]) lang = 'en';
    current = lang;
    var dict = COPY[lang];
    document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
    document.title = dict.meta_title;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = lookup(dict, el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        var v = lookup(dict, p[1]);
        if (typeof v === 'string') el.setAttribute(p[0], v);
      });
    });
    document.querySelectorAll('.lang').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    var f = document.getElementById('f-lang');
    if (f) f.value = lang;
    try { localStorage.setItem('df_lang', lang); } catch (e) {}
  }

  // Initial language: ?lang=pt in the URL, then a saved choice, then the browser language.
  var initial = 'en';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    var saved = localStorage.getItem('df_lang');
    if (q === 'pt' || q === 'en') initial = q;
    else if (saved === 'pt' || saved === 'en') initial = saved;
    else if ((navigator.language || '').toLowerCase().indexOf('pt') === 0) initial = 'pt';
  } catch (e) {}
  setLang(initial);

  document.querySelectorAll('.lang').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  // Remember which plan's button was clicked, so the lead shows plan interest.
  document.querySelectorAll('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () {
      var p = document.getElementById('f-plan');
      if (p) p.value = a.getAttribute('data-plan');
    });
  });

  // Lead form: AJAX submit to Netlify Forms (URL-encoded), then show the thank-you state.
  var form = document.getElementById('lead');
  var thanks = document.getElementById('thanks');
  var err = document.getElementById('err');
  var again = document.getElementById('again');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    err.hidden = true;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = COPY[current].f_sending;
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      form.hidden = true;
      thanks.hidden = false;
      form.reset();
      document.getElementById('f-lang').value = current;
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { form: 'consult-request' });
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
      if (window.dataLayer) window.dataLayer.push({ event: 'lead_submitted', form: 'consult-request', language: current });
    }).catch(function () {
      err.hidden = false;
    }).then(function () {
      btn.disabled = false;
      btn.textContent = COPY[current].f_submit;
    });
  });

  again.addEventListener('click', function () {
    thanks.hidden = true;
    form.hidden = false;
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
