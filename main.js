(function(){
  var app=document.getElementById('app');

  // Liquid glass: only Chromium can bend the backdrop through an SVG filter.
  if(navigator.userAgentData&&navigator.userAgentData.brands.some(function(b){return b.brand==='Chromium'}))document.documentElement.classList.add('lg-refract');
  // The highlight on each pane of glass follows the pointer.
  if(matchMedia('(hover: hover)').matches){
    document.querySelectorAll('.glass').forEach(function(el){
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect();
        el.style.setProperty('--mx',((e.clientX-r.left)/r.width)*100+'%');
        el.style.setProperty('--my',((e.clientY-r.top)/r.height)*100+'%');
      });
    });
  }

  // Hero on scroll: while the hero is pinned, the inspection tag shrinks into the
  // bottom-right corner and the photo behind it settles closer.
  var band=document.querySelector('.hero-band'), pin=document.querySelector('.hero-pin'),
      tag=document.querySelector('.tag'), visual=document.querySelector('.hero-visual');
  var pinMQ=matchMedia('(min-width:821px) and (min-height:600px) and (prefers-reduced-motion:no-preference)');
  var ticking=false;
  function heroScroll(){
    ticking=false;
    if(!pinMQ.matches){tag.style.transform='';visual.style.transform='';return}
    // The band starts just above the page (it runs under the nav), so progress runs from scroll 0
    // to the moment the band's bottom reaches the bottom of the screen.
    var end=band.getBoundingClientRect().top+scrollY+band.offsetHeight-innerHeight;
    var p=Math.min(1,Math.max(0,scrollY/end));
    var e=p*p*(3-2*p);
    // The pin sits at the top of the screen while this runs, so the tag's offsets are screen positions.
    var margin=24, vw=document.documentElement.clientWidth;
    var dx=(vw-margin)-(tag.offsetLeft+tag.offsetWidth);
    var dy=(innerHeight-margin)-(tag.offsetTop+tag.offsetHeight);
    tag.style.transform='translate('+dx*e+'px,'+dy*e+'px) rotate('+1.2*(1-e)+'deg) scale('+(1-.4*e)+')';
    visual.style.transform='scale('+(1+.08*e)+')';
  }
  function requestHero(){if(!ticking){ticking=true;requestAnimationFrame(heroScroll)}}
  if(band&&pin&&tag&&visual){
    addEventListener('scroll',requestHero,{passive:true});
    addEventListener('resize',requestHero);
    heroScroll();
  }

  function setLang(l){
    app.dataset.lang=l;
    document.documentElement.lang=l;
    document.querySelectorAll('[data-set]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.set===l))});
    try{localStorage.setItem('ss-lang',l)}catch(e){}
  }
  try{var saved=localStorage.getItem('ss-lang');if(saved==='en'||saved==='sq')setLang(saved)}catch(e){}
  document.querySelectorAll('[data-set]').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.set)})});

  var chips=document.querySelectorAll('[data-filter]');
  chips.forEach(function(c){c.addEventListener('click',function(){
    var f=c.dataset.filter;
    chips.forEach(function(x){x.setAttribute('aria-pressed',String(x===c))});
    document.querySelectorAll('.rec').forEach(function(r){
      r.hidden=!(f==='all'||r.dataset.tags.split(' ').indexOf(f)>-1);
    });
  })});

  var btn=document.getElementById('copy'), em=document.getElementById('email');
  btn.addEventListener('click',function(){
    var done=function(){var t=btn.innerHTML;btn.textContent=app.dataset.lang==='sq'?'U kopjua':'Copied';setTimeout(function(){btn.innerHTML=t},1600)};
    var fallback=function(){var r=document.createRange();r.selectNodeContents(em);var s=getSelection();s.removeAllRanges();s.addRange(r)};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(em.textContent).then(done,fallback)}else{fallback()}
  });
})();
