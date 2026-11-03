(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Without GSAP the page falls back to its plain, unpinned layout.
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('js');
  }
  const hasGsap = root.classList.contains('js');
  if (hasGsap) gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

  /* ---------- Liquid glass ---------- */
  // The highlight on each pane of glass follows the pointer.
  if (matchMedia('(hover: hover)').matches) {
    $$('.glass').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  // The dock's drop of glass slides under the link for the section on screen.
  const dock = $('.dock');
  const pill = $('.dock__pill');
  const dockLinks = $$('.dock a:not(.dock__brand)');
  const movePill = (link) => {
    dock.classList.toggle('has-pill', !!link);
    if (!link) return;
    pill.style.setProperty('--x', link.offsetLeft + 'px');
    pill.style.setProperty('--w', link.offsetWidth + 'px');
  };
  if ('IntersectionObserver' in window) {
    const sections = ['#top', ...dockLinks.map((a) => a.getAttribute('href'))].map((id) => $(id));
    const dockIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        movePill(dockLinks.find((a) => a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach((s) => dockIO.observe(s));
  }

  if (!hasGsap) return;

  /* ---------- Motion ---------- */
  const mm = gsap.matchMedia();

  // Anchor links glide instead of jumping.
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2 || a.classList.contains('work__row')) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.to(window, { duration: reduce ? 0 : 1.1, ease: 'power3.inOut', scrollTo: { y: target, autoKill: true } });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // Work: the index holds still while each project's picture wipes in.
  const work = $('.work');
  const shots = $$('.work__shot');
  const workRows = $$('.work__row');
  let current = 0;
  const show = (i, animate) => {
    if (i === current) return;
    const prev = shots[current];
    const next = shots[i];
    current = i;
    workRows.forEach((r, k) => r.setAttribute('aria-current', k === i ? 'true' : 'false'));
    shots.forEach((s) => { s.style.zIndex = ''; s.classList.remove('is-leaving'); });
    prev.classList.remove('is-active');
    prev.classList.add('is-leaving');
    prev.style.zIndex = 1;
    next.classList.add('is-active');
    next.style.zIndex = 2;
    const done = () => prev.classList.remove('is-leaving');
    if (!animate) { gsap.set(next, { clipPath: 'inset(0% 0% 0% 0%)' }); done(); return; }
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: done });
    tl.fromTo(next, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 })
      .from($('.project__preview', next), { y: 24, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, '-=0.5');
  };
  const workST = ScrollTrigger.create({
    trigger: work,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const i = Math.min(shots.length - 1, Math.floor(self.progress * shots.length));
      show(i, !matchMedia('(prefers-reduced-motion: reduce)').matches);
    },
  });
  workRows.forEach((row, i) => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const y = workST.start + ((workST.end - workST.start) * (i + 0.5)) / shots.length;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.to(window, { duration: reduce ? 0 : 0.9, ease: 'power2.inOut', scrollTo: { y } });
    });
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hero intro: one timeline, positioned with labels.
    const split = SplitText.create('.hero__title span', { type: 'chars', mask: 'chars' });
    const intro = gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } });
    intro.addLabel('photo')
      .from('.hero__visual', { scale: 1.18, duration: 1.8, ease: 'power2.out' }, 'photo')
      .from('.hero__card', { y: 60, autoAlpha: 0 }, 'photo+=0.2')
      .addLabel('type', '-=0.45')
      .from(split.chars, { yPercent: 110, stagger: 0.04, duration: 0.8 }, 'type')
      .from('.hero__body > *', { y: 24, autoAlpha: 0, stagger: 0.08 }, 'type+=0.25')
      .from('.hero__foot > *', { y: 16, autoAlpha: 0, stagger: 0.07, duration: 0.6 }, '<0.15');

    // Hero on scroll: the card shrinks while the background settles.
    const card = $('.hero__card');
    const margin = () => parseFloat(getComputedStyle(root).getPropertyValue('--margin')) || 24;
    const heroOut = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
    });
    heroOut
      .to(card, {
        scale: 0.36,
        x: () => margin() - card.offsetLeft,
        y: () => window.innerHeight - margin() - (card.offsetTop + card.offsetHeight),
        ease: 'power1.inOut',
      }, 0)
      .to('.hero__visual', { scale: 1.08, yPercent: 6, ease: 'none' }, 0);

    // Entrances: heading, then text, then pictures, for each section.
    const enter = (trigger, targets, start = 'top 78%') => {
      gsap.from(targets, {
        y: 28, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger, start, once: true },
      });
    };
    enter('.work', ['.work__title', ...workRows, '.work__media']);
    enter('.about', ['.about__title', '.about__text']);
    enter('.contact', ['.contact__lead', '.contact__mail', ...$$('.contact__foot > *')], 'top 60%');
    enter('.footer', ['.footer__mark', ...$$('.footer__menu a'), '.footer__blocks']);

    return () => split.revert();
  });

  // Fonts change line lengths; measure again once they are in.
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
