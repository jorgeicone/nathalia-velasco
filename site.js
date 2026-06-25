// Nathalia Velasco · Simoné — interacciones compartidas
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- menú móvil ----
  var burger=document.querySelector('.burger');
  var menu=document.querySelector('.menu');
  if(burger){
    burger.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      burger.classList.toggle('x');
      burger.setAttribute('aria-expanded', open?'true':'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){menu.classList.remove('open');burger.classList.remove('x');document.body.style.overflow='';});
    });
  }

  // ---- barra de progreso + sombra nav + back-to-top ----
  var nav=document.querySelector('header.nav');
  var bar=document.createElement('div'); bar.className='scroll-progress'; document.body.appendChild(bar);
  var top=document.createElement('button');
  top.className='to-top'; top.setAttribute('aria-label','Volver arriba');
  top.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(top);
  top.addEventListener('click',function(){ window.scrollTo({top:0,behavior: reduce?'auto':'smooth'}); });

  function onScroll(){
    var st=window.scrollY||document.documentElement.scrollTop;
    var h=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    bar.style.width=(h>0?(st/h*100):0)+'%';
    if(nav) nav.classList.toggle('scrolled', st>10);
    top.classList.toggle('show', st>600);
  }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // ---- botón flotante WhatsApp ----
  var wa=document.createElement('a');
  wa.className='wa-float';
  wa.href='https://wa.me/573208857608?text='+encodeURIComponent('Hola Nathalia, vi tu página y quiero saber más sobre tus servicios ✦');
  wa.target='_blank'; wa.rel='noopener'; wa.setAttribute('aria-label','Escríbeme por WhatsApp');
  wa.innerHTML='<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-1.8c1.9 1 4 1.6 6 1.6 7 0 12.5-5.5 12.5-12.5S23 3 16 3zm0 22.8c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.2 1.1 1.1-4-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C5.5 9.7 10.2 5 16 5s10.5 4.7 10.5 10.5S21.8 25.8 16 25.8zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-1.9-.9-3.1-1.7-4.4-3.8-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-1.2 1.2-1.2 2.9-1.2 3.1 0 .2 0 2.5 2.3 4.9 2.9 3 5.2 3.9 6.4 4.2.6.2 1.5.1 2-.1.6-.2 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg><span class="wa-tip">Escríbeme</span>';
  document.body.appendChild(wa);

  // ---- reveal al entrar en viewport ----
  var els=document.querySelectorAll('.reveal');
  if(reduce){ els.forEach(function(el){el.classList.add('in');}); }
  else if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){
        var d=e.target.getAttribute('data-delay'); if(d) e.target.style.transitionDelay=d+'ms';
        e.target.classList.add('in'); io.unobserve(e.target);
      }});
    },{threshold:.12, rootMargin:'0px 0px -40px 0px'});
    els.forEach(function(el){io.observe(el);});
  } else { els.forEach(function(el){el.classList.add('in');}); }

  // ---- contadores animados ----
  function animateCount(el){
    var target=parseFloat(el.getAttribute('data-count'));
    var suffix=el.getAttribute('data-suffix')||'';
    var prefix=el.getAttribute('data-prefix')||'';
    if(reduce){ el.textContent=prefix+target+suffix; return; }
    var dur=1400, start=null;
    function step(ts){
      if(!start)start=ts; var p=Math.min((ts-start)/dur,1);
      var eased=1-Math.pow(1-p,3);
      var val=target%1===0 ? Math.round(target*eased) : (target*eased).toFixed(1);
      el.textContent=prefix+val+suffix;
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters=document.querySelectorAll('[data-count]');
  if(counters.length){
    if('IntersectionObserver' in window){
      var co=new IntersectionObserver(function(entries){
        entries.forEach(function(e){ if(e.isIntersecting){ animateCount(e.target); co.unobserve(e.target);} });
      },{threshold:.5});
      counters.forEach(function(c){co.observe(c);});
    } else counters.forEach(animateCount);
  }

  // ---- segmentador personas / empresas ----
  var seg=document.querySelector('.seg');
  if(seg){
    seg.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click',function(){
        seg.querySelectorAll('button').forEach(function(b){b.classList.remove('on');b.setAttribute('aria-selected','false');});
        btn.classList.add('on'); btn.setAttribute('aria-selected','true');
        var t=btn.dataset.target;
        document.querySelectorAll('[data-seg]').forEach(function(s){ s.style.display=(s.dataset.seg===t)?'':'none'; });
      });
    });
  }

  // ---- FAQ acordeón ----
  document.querySelectorAll('.faq-item .faq-q').forEach(function(q){
    q.addEventListener('click',function(){
      var item=q.closest('.faq-item');
      var open=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(i){ if(i!==item){i.classList.remove('open');i.querySelector('.faq-q').setAttribute('aria-expanded','false');} });
      item.classList.toggle('open',!open);
      q.setAttribute('aria-expanded', !open?'true':'false');
    });
  });

  window.__siteLoaded = true;

  // ---- formulario contacto (demo + mailto fallback) ----
  var form=document.querySelector('#contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var n=(form.nombre&&form.nombre.value)||'';
      var em=(form.email&&form.email.value)||'';
      var tel=(form.telefono&&form.telefono.value)||'';
      var it=(form.interes&&form.interes.value)||'';
      var msg=(form.mensaje&&form.mensaje.value)||'';
      var body='Nombre: '+n+'%0D%0ACorreo: '+em+'%0D%0ATelefono: '+tel+'%0D%0AInteres: '+it+'%0D%0A%0D%0A'+msg;
      var ok=document.querySelector('#form-ok');
      if(ok){ok.style.display='block'; ok.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});}
      window.location.href='mailto:experienciasimone@gmail.com?subject='+encodeURIComponent('Nueva consulta web — '+(n||'sitio'))+'&body='+body;
    });
  }
})();
