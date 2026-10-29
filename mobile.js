'use strict';
const mobileQuery=window.matchMedia('(max-width: 768px)');
const mobileMenu=document.querySelector('#mobile-menu');
const mobileMenuToggle=document.querySelector('#mobile-menu-toggle');
const mobileSearchToggle=document.querySelector('#mobile-search-toggle');
function closeMobileSearch(){document.querySelector('header').classList.remove('search-open');mobileSearchToggle.setAttribute('aria-expanded','false');mobileSearchToggle.setAttribute('aria-label','Abrir pesquisa');closeSuggestions();}
mobileMenuToggle.addEventListener('click',()=>{closeMobileSearch();mobileMenu.showModal();mobileMenuToggle.setAttribute('aria-expanded','true');});
mobileMenu.addEventListener('close',()=>mobileMenuToggle.setAttribute('aria-expanded','false'));
mobileSearchToggle.addEventListener('click',()=>{const opening=!document.querySelector('header').classList.contains('search-open');if(!opening){closeMobileSearch();return;}document.querySelector('header').classList.add('search-open');mobileSearchToggle.setAttribute('aria-expanded','true');mobileSearchToggle.setAttribute('aria-label','Fechar pesquisa');document.querySelector('#search').focus();});
document.querySelector('#search').addEventListener('keydown',e=>{if(e.key==='Escape'&&mobileQuery.matches){closeMobileSearch();mobileSearchToggle.focus();}});
document.querySelector('.search').addEventListener('submit',()=>{if(mobileQuery.matches)closeMobileSearch();});
mobileQuery.addEventListener('change',()=>{if(mobileMenu.open)mobileMenu.close();closeMobileSearch();});
for(const button of document.querySelectorAll('[data-carousel]'))button.addEventListener('click',()=>{
 const track=button.dataset.carousel==='benefits'?document.querySelector('.benefits'):document.querySelector('#category-cards');
 if(!track)return;const direction=Number(button.dataset.direction),max=track.scrollWidth-track.clientWidth;
 const next=direction>0&&track.scrollLeft>=max-3?0:direction<0&&track.scrollLeft<=3?max:track.scrollLeft+direction*track.clientWidth;
 track.scrollTo({left:next,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
function setupMobileGallery(){
 const stage=document.querySelector('.product-image-stage');if(!stage)return;
 const thumbs=[...document.querySelectorAll('[data-thumb]')];if(!thumbs.length)return;
 const controls=document.createElement('div');controls.className='mobile-gallery-controls';
 controls.innerHTML='<button type="button" data-gallery-step="-1" aria-label="Foto anterior">‹</button><span id="gallery-position" aria-live="polite">'+(thumbs.findIndex(b=>b.classList.contains('selected'))+1)+' / '+thumbs.length+'</span><button type="button" data-gallery-step="1" aria-label="Próxima foto">›</button>';
 if(thumbs.length>1)stage.appendChild(controls);
 const change=step=>{const current=thumbs.findIndex(b=>b.classList.contains('selected'));const next=thumbs[(current+step+thumbs.length)%thumbs.length];next.click();next.scrollIntoView({block:'nearest',inline:'nearest'});};
 controls.querySelectorAll('button').forEach(b=>b.onclick=()=>change(Number(b.dataset.galleryStep)));
 let start=null;
 stage.addEventListener('touchstart',e=>{if(e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};else start=null;},{passive:true});
 stage.addEventListener('touchend',e=>{if(!start||!mobileQuery.matches)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)change(dx<0?1:-1);},{passive:true});
 stage.addEventListener('touchcancel',()=>start=null,{passive:true});
 thumbs.forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected'))));
}
document.addEventListener('product-rendered',setupMobileGallery);
