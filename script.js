/* script.js — sparkle cursor, hearts, carousel, typewriter, audio players, fireworks */

///// utility: play click sound
const CLICK = new Audio('assets/click.mp3');
function playClick(){ try{ CLICK.currentTime=0; CLICK.play(); }catch(e){} }

///// sparkle cursor (mouse & touch)
document.addEventListener('mousemove', (e)=>{
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = e.pageX + 'px';
  s.style.top  = e.pageY + 'px';
  document.body.appendChild(s);
  setTimeout(()=> s.remove(), 500);
});
document.addEventListener('touchmove', (e)=>{
  const t = e.touches[0];
  if(!t) return;
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.left = t.pageX + 'px';
  s.style.top  = t.pageY + 'px';
  document.body.appendChild(s);
  setTimeout(()=> s.remove(), 500);
});

///// floating hearts - gentle background decoration
setInterval(()=> {
  const h = document.createElement('div');
  h.className = 'heart';
  h.innerText = ['💗','💕','🌸','✨'][Math.floor(Math.random()*4)];
  h.style.left = (Math.random()*85 + 5) + 'vw';
  h.style.fontSize = (18 + Math.random()*28) + 'px';
  h.style.animationDuration = (4 + Math.random()*4) + 's';
  document.body.appendChild(h);
  setTimeout(()=> h.remove(), 7000);
}, 900);

///// SMALL NAV EFFECT: fade on link click (used for entrance)
document.addEventListener('click', e=>{
  const a = e.target.closest('a, button');
  if(!a) return;
  if(a.getAttribute('href') && a.getAttribute('href').startsWith('http')) return; // external links allowed
  // play click sound
  try{ playClick(); }catch(e){}
});

///// MEMORIES CAROUSEL (memories.html)
(function(){
  if(!document.querySelector('.carousel')) return;
  const track = document.querySelector('.slide-track');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const prev = document.querySelector('#prevSlide');
  const next = document.querySelector('#nextSlide');
  let idx = 0;
  function update(){
    track.style.transform = `translateX(-${idx * 100}%)`;
    const cap = slides[idx].getAttribute('data-caption') || '';
    document.querySelector('.caption').textContent = cap;
  }
  prev.addEventListener('click', ()=>{ idx = (idx-1+slides.length)%slides.length; update(); });
  next.addEventListener('click', ()=>{ idx = (idx+1)%slides.length; update(); });
  // swipe support
  (function addSwipe(){
    let startX=null;
    const viewport = document.querySelector('.carousel-viewport');
    if(!viewport) return;
    viewport.addEventListener('touchstart', e=> startX = e.touches[0].clientX);
    viewport.addEventListener('touchend', e=>{
      if(startX===null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if(dx > 40) idx = (idx-1+slides.length)%slides.length;
      else if(dx < -40) idx = (idx+1)%slides.length;
      update(); startX=null;
    });
  })();
  update();
})();

///// WISH TYPEWRITER (wishes.html)
(function(){
  const area = document.getElementById('typed-area');
  if(!area) return;
  const display = document.getElementById('typed-text');
  let caret = document.getElementById('lemonCaret');
  if(!caret){
    caret = document.createElement('div');
    caret.id = 'lemonCaret';
    caret.textContent = '🍋';
    area.appendChild(caret);
  }
  const raw = area.dataset.wish || display.textContent || "My dearest Kavimitha, happy birthday!\\nYou are wonderful.";
  const text = raw;
  display.textContent = '';
  let i=0; const speed=30;
  function placeCaret(){
    try{
      const range = document.createRange();
      range.selectNodeContents(display);
      range.collapse(false);
      const rects = range.getClientRects();
      const parentRect = area.getBoundingClientRect();
      let left = 12, top = 12;
      if(rects.length){
        const r = rects[rects.length-1];
        left = r.right - parentRect.left + 2;
        top = r.bottom - parentRect.top - 6;
      } else {
        const dr = display.getBoundingClientRect();
        left = dr.left - parentRect.left + 8;
        top = dr.bottom - parentRect.top - 6;
      }
      caret.style.left = Math.max(8,left) + 'px';
      caret.style.top  = Math.max(8,top) + 'px';
    }catch(e){}
  }
  function step(){
    if(i < text.length){
      display.textContent += text.charAt(i);
      i++; placeCaret();
      const ch = text.charAt(i-1);
      const delay = (ch==='.'||ch===','||ch==='?')? speed*6 : speed;
      setTimeout(step, delay);
    } else {
      setTimeout(()=>{ caret.style.transition='transform .8s, opacity .6s'; caret.style.transform='translateY(-140px) rotate(20deg) scale(1.2)'; caret.style.opacity='0'; }, 600);
    }
  }
  placeCaret(); setTimeout(step, 420);
  window.addEventListener('resize', placeCaret);
})();

///// RECORDINGS: bubble players + animated bars
(function(){
  const list = document.querySelectorAll('.recording-item');
  if(!list.length) return;
  list.forEach(item=>{
    const btn = item.querySelector('.play-bubble');
    const audio = item.querySelector('audio');
    const bars = item.querySelectorAll('.wave > i');
    btn.addEventListener('click', ()=>{
      if(audio.paused){ audio.play(); btn.textContent='❚❚'; }
      else { audio.pause(); btn.textContent='▶'; }
    });
    // update wave heights on timeupdate to fake waveform
    audio.addEventListener('timeupdate', ()=>{
      const pct = (audio.currentTime / (audio.duration || 1));
      bars.forEach((b, i) => {
        // some pseudo-random heights but reactive to pct
        const h = 6 + Math.round( (Math.sin((pct*20 + i)*1.7) + 1) * (6 + i%3*3) );
        b.style.height = h + 'px';
      });
    });
    audio.addEventListener('ended', ()=>{ btn.textContent='▶'; });
  });
})();
