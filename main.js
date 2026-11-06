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
