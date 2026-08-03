// Cascade Technologies — shared interactivity
(function(){
  // Theme toggle with persistence
  const root = document.documentElement;
  const saved = localStorage.getItem('cascade-theme');
  if (saved) root.setAttribute('data-theme', saved);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) root.setAttribute('data-theme','dark');

  function syncIcon(){
    const btn = document.querySelector('[data-theme-toggle]');
    if(!btn) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    btn.innerHTML = isDark
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>';
  }
  syncIcon();

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-theme-toggle]');
    if(btn){
      const isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
      localStorage.setItem('cascade-theme', isDark ? 'light' : 'dark');
      syncIcon();
    }
    const mtoggle = e.target.closest('[data-menu-toggle]');
    if(mtoggle){
      document.querySelector('.mobile-menu')?.classList.toggle('open');
    }
    const mlink = e.target.closest('.mobile-menu a');
    if(mlink){
      document.querySelector('.mobile-menu')?.classList.remove('open');
    }
  });

  // Highlight active nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a=>{
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Filter chips (Tech Hub / Learning / Projects pages)
  document.addEventListener('click', (e)=>{
    const chip = e.target.closest('.chip');
    if(!chip) return;
    const group = chip.closest('.filter-row');
    if(!group) return;
    group.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
  });

  // Newsletter form — front-end only demo state
  document.addEventListener('submit', (e)=>{
    if (e.target.matches('[data-newsletter-form]')){
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const original = btn.textContent;
      btn.textContent = 'Subscribed ✓';
      btn.disabled = true;
      setTimeout(()=>{ btn.textContent = original; btn.disabled = false; e.target.reset(); }, 2500);
    }
    if (e.target.matches('[data-contact-form]')){
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message sent ✓';
      setTimeout(()=>{ btn.textContent = original; e.target.reset(); }, 2500);
    }
  });

  // Simple reveal-on-scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.style.opacity=1; en.target.style.transform='translateY(0)'; io.unobserve(en.target); }
    });
  }, {threshold:.12});
  document.querySelectorAll('[data-reveal]').forEach(el=>{
    el.style.opacity=0; el.style.transform='translateY(16px)'; el.style.transition='opacity .5s ease, transform .5s ease';
    io.observe(el);
  });

  // Event countdown
  document.querySelectorAll('[data-countdown]').forEach(el=>{
    const target = new Date(el.getAttribute('data-countdown')).getTime();
    function tick(){
      const diff = target - Date.now();
      if(diff <= 0){ el.textContent = 'Live now'; return; }
      const d = Math.floor(diff/86400000);
      const h = Math.floor((diff%86400000)/3600000);
      const m = Math.floor((diff%3600000)/60000);
      el.textContent = `${d}d ${h}h ${m}m`;
    }
    tick();
    setInterval(tick, 60000);
  });
})();
