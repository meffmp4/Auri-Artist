const header=document.querySelector('.header');
document.querySelector('.burger')?.addEventListener('click',()=>header.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>header.classList.remove('open')));

const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const gallery=document.querySelector('.gallery');
let down=false,startX=0,startScroll=0;
gallery?.addEventListener('mousedown',e=>{if(e.target.closest('button'))return;down=true;startX=e.pageX;startScroll=gallery.scrollLeft});
window.addEventListener('mouseup',()=>down=false);
gallery?.addEventListener('mousemove',e=>{if(!down)return;e.preventDefault();gallery.scrollLeft=startScroll-(e.pageX-startX)*1.35});

document.querySelectorAll('.art img').forEach(img=>{
  const mark=()=>{const ratio=img.naturalWidth/img.naturalHeight;const card=img.closest('.art');card?.classList.add(ratio>1.15?'landscape':ratio<.85?'portrait':'square')};
  if(img.complete)mark(); else img.addEventListener('load',mark);
});

const box=document.getElementById('lightbox'),big=document.getElementById('big'),count=document.getElementById('count');
const works=[...document.querySelectorAll('.art img')];
let current=0;
function showWork(i){current=(i+works.length)%works.length;const img=works[current];big.src=img.src;big.alt=img.alt;count.textContent=`ART ${String(current+1).padStart(2,'0')} / ${works.length}`;box.classList.add('show');box.setAttribute('aria-hidden','false')}
function closeBox(){box.classList.remove('show');box.setAttribute('aria-hidden','true');big.src=''}
works.forEach((img,i)=>img.parentElement.addEventListener('click',()=>showWork(i)));
document.getElementById('close').addEventListener('click',closeBox);
document.getElementById('prev').addEventListener('click',()=>showWork(current-1));
document.getElementById('next').addEventListener('click',()=>showWork(current+1));
box.addEventListener('click',e=>{if(e.target===box)closeBox()});
document.addEventListener('keydown',e=>{if(!box.classList.contains('show'))return;if(e.key==='Escape')closeBox();if(e.key==='ArrowLeft')showWork(current-1);if(e.key==='ArrowRight')showWork(current+1)});
let touchStartX=0;
box.addEventListener('touchstart',e=>{touchStartX=e.changedTouches[0].screenX},{passive:true});
box.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchStartX;if(Math.abs(dx)>50)showWork(current+(dx<0?1:-1))},{passive:true});
