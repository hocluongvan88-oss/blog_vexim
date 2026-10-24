(() => {
  const useVercel = document.currentScript?.dataset.vercelAnalytics === 'true';
  if (useVercel && !window.va) window.va = (...args) => (window.vaq = window.vaq || []).push(args);
  const emit = (event, params = {}) => {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', event, params);
      else if (typeof window.va === 'function') window.va('event', {name:event, data:params});
      else (window.dataLayer = window.dataLayer || []).push({event, ...params});
    } catch (_) { /* Measurement must never block navigation. */ }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.hasAttribute('data-register')) emit('cta_register_click', {position:link.dataset.position});
    else if (link.hasAttribute('data-learn')) emit('cta_learn_click');
    else if (link.dataset.category) emit('category_click', {category:link.dataset.category});
    if (link.closest('#mobile-menu') && link.hash) document.getElementById('mobile-menu').open = false;
  });
  const menu = document.getElementById('mobile-menu');
  const summary = menu.querySelector('summary');
  const syncMenu = () => {
    summary.setAttribute('aria-expanded', String(menu.open));
    summary.setAttribute('aria-label', menu.open ? 'Đóng menu điều hướng' : 'Mở menu điều hướng');
  };
  menu.addEventListener('toggle', syncMenu);
  menu.addEventListener('keydown', event => { if(event.key === 'Escape') {menu.open=false; summary.focus();} });
  syncMenu();
  const seen = new Set();
  let queued = false;
  const measure = () => {
    queued = false;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? window.scrollY / scrollable * 100 : 100;
    [50,90].forEach(threshold => {
      if(percent >= threshold && !seen.has(threshold)) {
        seen.add(threshold); emit('scroll_depth', {percent:threshold});
      }
    });
  };
  window.addEventListener('scroll', () => {if(!queued){queued=true;requestAnimationFrame(measure);}}, {passive:true});
  requestAnimationFrame(() => requestAnimationFrame(() => {
    measure();
    // Reuse the project's existing Vercel Analytics, only on its production deploy.
    if (useVercel && !document.querySelector('script[src="/_vercel/insights/script.js"]')) {
      const script = document.createElement('script');
      script.src = '/_vercel/insights/script.js'; script.defer = true;
      script.dataset.sdkn = '@vercel/analytics'; script.dataset.sdkv = '1.3.1';
      document.head.appendChild(script);
    }
  }));
})();
