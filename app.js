'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const cfg = window.STORE_CONFIG;
const isProductPage = document.body.dataset.page === 'product';
const isSearchPage = document.body.dataset.page === 'search';
const searchURL = query => 'buscar.html?q='+encodeURIComponent(query.trim());
const productURL = id => 'produto.html?produto='+encodeURIComponent(id);
const money = n => new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = s => norm(s).replace(/\s+/g,'-').replace(/[^\w-]/g,'').replace(/-+/g,'-');
const safeImage = s => {try { const u = new URL(String(s)); return ['https:','http:'].includes(u.protocol) ? u.href : 'assets/placeholder.svg'; } catch {return 'assets/placeholder.svg';}};
const icons={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',bag:'<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',message:'<path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z"/><path d="M8 9c1 4 3 6 7 7l1-2-3-1-1 1-2-2 1-1-1-3-2 1Z"/>',watch:'<rect x="5" y="5" width="14" height="14" rx="4"/><path d="m8 5 1-4h6l1 4M8 19l1 4h6l1-4M12 8v4l3 2"/>',truck:'<path d="M1 4h13v13H1V4ZM14 9h5l4 5v3h-9"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/>',grid:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',sliders:'<path d="M3 6h18M3 12h18M3 18h18"/><circle cx="8" cy="6" r="2" fill="white"/><circle cx="16" cy="12" r="2" fill="white"/><circle cx="8" cy="18" r="2" fill="white"/>',headphones:'<path d="M4 14v-3a8 8 0 0 1 16 0v3"/><rect x="2" y="12" width="5" height="9" rx="2"/><rect x="17" y="12" width="5" height="9" rx="2"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>'};
const icon = name => name === 'message' ? "<svg class=\"whatsapp-icon\" fill=\"currentColor\" stroke=\"none\" aria-hidden=\"true\" role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z\"/></svg>" : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[name]||icons.bag)+'</svg>';
$$('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
$$('.whatsapp-link').forEach(el=>{el.href='https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent('Olá! Vim pelo site da Eleven Store e gostaria de saber mais sobre os produtos.');el.target='_blank';el.rel='noopener noreferrer';});
$('#year').textContent=new Date().getFullYear();
let products=[], live=false, offersOnly=false, limit=12, currentDetail=null, toastTimer;
const storage={get(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}};
function normalizeCart(value){return (Array.isArray(value)?value:[]).filter(x=>x&&typeof x.id==='string'&&Number.isInteger(x.qty)&&x.qty>0).map(x=>({id:x.id,qty:Math.min(x.qty,99),note:String(x.note||'').slice(0,500)}));}
let cart=normalizeCart(storage.get('eleven-cart-v2',[]));
// Mantém abas abertas na mesma loja coerentes após adicionar ou remover itens.
window.addEventListener('storage',e=>{if(e.key==='eleven-cart-v2'||e.key===null){cart=normalizeCart(storage.get('eleven-cart-v2',[]));renderCart();}});
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2800);}
function amount(v){if(typeof v==='number')return v;let s=String(v??'').replace(/[^\d.,-]/g,'');if(s.includes(','))s=s.replace(/\./g,'').replace(',','.');return Number(s)||0;}
function expiry(date,time){
 const value=String(date??'').trim();if(!value)return null;
 // Google Visualization retorna datas como Date(ano, mês zero-based, dia).
 const typed=value.match(/^Date\((\d{4}),(\d{1,2}),(\d{1,2})(?:,\d{1,2}){0,3}\)$/);
 const text=value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
 if(!typed&&!text)return 0;
 let year=Number(typed?typed[1]:text[3]);if(year<100)year+=2000;
 const month=Number(typed?typed[2]:text[2])+(typed?1:0),day=Number(typed?typed[3]:text[1]);
 const calendar=new Date(Date.UTC(year,month-1,day));
 if(year<1000||calendar.getUTCFullYear()!==year||calendar.getUTCMonth()!==month-1||calendar.getUTCDate()!==day)return 0;
 let hour=23,minute=59;
 if(Array.isArray(time)){hour=Number(time[0]);minute=Number(time[1]??0);}
 else if(String(time??'').trim()!==''){
  const clock=String(time).trim().match(/^(\d{1,2})(?::(\d{2}))?$/);if(!clock)return 0;
  hour=Number(clock[1]);minute=Number(clock[2]||0);
 }
 if(!Number.isInteger(hour)||!Number.isInteger(minute)||hour<0||hour>23||minute<0||minute>59)return 0;
 return Date.UTC(year,month-1,day,hour+3,minute,59);
}
function parseSheet(data){if(!data.table?.cols||!Array.isArray(data.table.rows))throw Error('Planilha indisponível');const headers=data.table.cols.map(c=>norm(c.label).replace(/[\s_-]/g,''));const seen=new Set();return data.table.rows.map(row=>{const values={};headers.forEach((h,i)=>{if(h)values[h]=row.c[i]?.v??'';});const name=String(values.nome||values.name||values.produto||'').trim();if(!name||['n','nao','false','0'].includes(norm(values.ativo)))return null;const original=amount(values.preco||values.price||values.valor);const offer=amount(values.precooferta);const end=expiry(values.dataoferta,values.horaoferta);const imageList=headers.map((h,i)=>/^img\d*$|^imagem\d*$|^foto\d*$/.test(h)?row.c[i]?.v:null).filter(Boolean).map(safeImage);let id=String(values.id||slug(name));if(seen.has(id))id+='-'+seen.size;seen.add(id);return {id,name,original,offer,end,category:norm(values.categoria||'outros'),type:norm(values.tipo),gender:norm(values.genero),description:String(values.descricao||''),featured:!!values.destaque&&!['n','nao','false','0'].includes(norm(values.destaque)),images:imageList.length?imageList:['assets/placeholder.svg']};}).filter(Boolean);}
const price=p=>p.offer>0&&p.offer<p.original&&(p.end===null||p.end>Date.now())?p.offer:p.original;
const onOffer=p=>price(p)<p.original;
const categoryName=c=>({'relogio':'Smartwatches','wearzone':'Wearzone','fone de ouvido':'Fones de ouvido','pulseiras':'Pulseiras','acessorios':'Acessórios'}[c]||c.charAt(0).toUpperCase()+c.slice(1));
const categoryMenuLabel = c => '<span class="category-menu-label"><span class="category-emoji" aria-hidden="true">'+({'relogio':'⌚','wearzone':'🏃','fone de ouvido':'🎧','pulseiras':'🔗','acessorios':'🔌'}[c]||'📦')+'</span><span>'+esc(categoryName(c))+'</span></span>';
function setupCategories(){const cats=[...new Set(products.map(p=>p.category))];$('#nav-categories').innerHTML=cats.map(c=>'<button data-category="'+esc(c)+'">'+categoryMenuLabel(c)+'</button>').join('');$('#mobile-categories').innerHTML=cats.map(c=>'<button data-category="'+esc(c)+'">'+categoryMenuLabel(c)+'<span aria-hidden="true">→</span></button>').join('');if(isProductPage)return;if($('#category-cards'))$('#category-cards').innerHTML=cats.map(c=>{const items=products.filter(p=>p.category===c);return '<button class="category-card" data-category="'+esc(c)+'"><img src="'+esc(items[0].images[0])+'" alt="" loading="lazy"><span><strong>'+esc(categoryName(c))+'</strong><small>'+items.length+' produtos</small></span><b>↗</b></button>';}).join('');for(const [selector,key,label]of [['#category','category','Todas as categorias'],['#type','type','Todos os tipos'],['#gender','gender','Todos']]){const selected=$(selector).value;$(selector).innerHTML='<option value="">'+label+'</option>'+[...new Set(products.map(p=>p[key]).filter(Boolean))].map(v=>'<option value="'+esc(v)+'">'+esc(key==='category'?categoryName(v):v.charAt(0).toUpperCase()+v.slice(1))+'</option>').join('');$(selector).value=selected;}const hero=products.find(p=>p.category==='relogio')||products[0];if(hero&&$('#hero-img')){$('#hero-img').src=hero.images[0];$('#hero-img').alt=hero.name;$('#hero-product').dataset.product=hero.id;$('#hero-product').href=productURL(hero.id);}}
function productCard(p){const cost=price(p);return '<article class="product-card">'+(onOffer(p)?'<span class="badge">−'+Math.round((1-cost/p.original)*100)+'%</span>':'')+'<a class="product-image" href="produto.html?produto='+encodeURIComponent(p.id)+'" data-product="'+esc(p.id)+'"><img loading="lazy" src="'+esc(p.images[0])+'" alt="'+esc(p.name)+'" width="240" height="215"></a><span class="product-category">'+esc(categoryName(p.category))+'</span><h3><a href="produto.html?produto='+encodeURIComponent(p.id)+'" data-product="'+esc(p.id)+'">'+esc(p.name.replace(/\|/g,' · '))+'</a></h3><div class="price-block"><span class="old-price">'+(onOffer(p)?'<del>'+money(p.original)+'</del>':'')+'</span><strong class="price">'+(cost>0?money(cost):'Sob consulta')+'</strong><span class="price-caption">'+(live?'Pagamento a combinar com a loja':'Consulte o preço atual com a loja')+'</span></div><div class="card-actions"><button class="add-cart" data-add="'+esc(p.id)+'" '+(!live||cost<=0?'disabled':'')+'>'+icon('bag')+' Adicionar carrinho</button><a class="product-whatsapp" target="_blank" rel="noopener noreferrer" href="https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent('Olá! Gostaria de saber mais sobre '+p.name)+'" aria-label="Chamar no WhatsApp sobre '+esc(p.name)+'">'+icon('message')+' Chamar no WhatsApp</a></div></article>';}
function render(){if(isProductPage)return;if(isSearchPage){renderSearchResults();return;}const cat=$('#category').value,type=$('#type').value,gender=$('#gender').value,min=$('#min-price').value,max=$('#max-price').value;let list=products.filter(p=>(!cat||p.category===cat)&&(!type||p.type===type)&&(!gender||p.gender===gender)&&(min===''||price(p)>=Number(min))&&(max===''||price(p)<=Number(max))&&(!offersOnly||onOffer(p)));const sort=$('#sort').value;if(sort==='price-up')list.sort((a,b)=>price(a)-price(b));if(sort==='price-down')list.sort((a,b)=>price(b)-price(a));if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));$('#catalog-title').textContent=offersOnly?'Ofertas disponíveis':cat?categoryName(cat):'Nossa seleção para você';$('#result-count').textContent=list.length+' produto'+(list.length===1?'':'s');$('#active-filter').textContent=cat?categoryName(cat):offersOnly?'Em oferta':'Todos os produtos';$('#products').innerHTML=list.length?list.slice(0,limit).map(productCard).join(''):'<div class="empty"><h3>'+(offersOnly?'Nenhuma oferta ativa no momento':'Nenhum produto encontrado')+'</h3><p>Explore outras categorias ou ajuste os filtros.</p><button class="button" data-reset>Ver todos os produtos</button></div>';$('#products').setAttribute('aria-busy','false');$('#load-more').hidden=list.length<=limit;}
function reset(){if(isSearchPage){resetSearchFilters();return;}if(isProductPage){location.href='index.html#catalogo';return;}closeSuggestions();for(const s of ['#search','#category','#type','#gender','#min-price','#max-price'])$(s).value='';$('#sort').value='default';offersOnly=false;limit=12;render();}
function selectCategory(c){if(isProductPage||isSearchPage){location.href='index.html?categoria='+encodeURIComponent(c)+'#catalogo';return;}reset();$('#category').value=c;render();$('#catalogo').scrollIntoView({behavior:'smooth'});}
async function fetchCatalog(){
const base='https://docs.google.com/spreadsheets/d/'+encodeURIComponent(cfg.sheetId)+'/gviz/tq?gid='+encodeURIComponent(cfg.gid);
// A API Google Visualization oferece JSONP para arquivos abertos via file://.
if(location.protocol==='file:')return new Promise((resolve,reject)=>{
 const callback='elevenSheet'+Date.now();const script=document.createElement('script');
 const cleanup=()=>{clearTimeout(timer);script.remove();delete window[callback];};
 const timer=setTimeout(()=>{cleanup();reject(Error('Tempo de consulta excedido'));},15000);
 window[callback]=data=>{cleanup();resolve(data);};
 script.onerror=()=>{cleanup();reject(Error('Não foi possível consultar a planilha'));};
 script.src=base+'&tqx=out:json;responseHandler:'+callback;document.head.appendChild(script);
});
const response=await fetch(base+'&tqx=out:json',{signal:AbortSignal.timeout(15000),cache:'no-store'});
if(!response.ok)throw Error('Falha na consulta');const text=await response.text();return JSON.parse(text.slice(text.indexOf('(')+1,text.lastIndexOf(')')));
}
async function load(){live=false;$('#catalog-status').textContent='Atualizando o catálogo…';try{const data=await fetchCatalog();products=parseSheet(data);live=true;storage.set('eleven-catalog-v2',{data,savedAt:Date.now()});$('#catalog-status').textContent='';}catch(e){const cached=storage.get('eleven-catalog-v2',null);if(cached?.data){try{products=parseSheet(cached.data);}catch{products=[];}}$('#catalog-status').innerHTML='Não foi possível atualizar os produtos. '+(products.length?'Exibindo uma consulta anterior; confirme preços e disponibilidade com a loja. ':'Verifique sua conexão. ')+'<button id="retry-load" class="text-button">Tentar novamente</button>';$('#retry-load').onclick=load;}
setupCategories();const params=new URLSearchParams(location.search);if(isSearchPage){restoreSearchState();}else if(!isProductPage){if(params.has('categoria'))$('#category').value=params.get('categoria');if(params.has('busca')){location.replace(searchURL(params.get('busca')));return;}offersOnly=params.get('ofertas')==='1';}render();if(document.activeElement===$('#search'))showSuggestions();reconcileCart();renderCart();const requested=params.get('produto');if(isProductPage)renderProductPage(requested);else if(requested)location.replace(productURL(requested));}
function reconcileCart(){if(!live)return;const valid=new Set(products.filter(p=>price(p)>0).map(p=>p.id));const before=cart.length;cart=cart.filter(x=>valid.has(x.id));if(cart.length<before)toast('Itens indisponíveis foram removidos do carrinho.');saveCart();}
function saveCart(){storage.set('eleven-cart-v2',cart);$('#cart-count').textContent=cart.reduce((sum,x)=>sum+x.qty,0);}
function addCart(id,note='',quantity=1){if(!live)return toast('Atualize o catálogo para continuar.');const p=products.find(p=>p.id===id);if(!p||price(p)<=0)return;quantity=Math.max(1,Math.min(99,Math.trunc(Number(quantity)||1)));const item=cart.find(x=>x.id===id&&x.note===note);if(item){if(item.qty+quantity>99)return toast('Limite de 99 unidades por item.');item.qty+=quantity;}else cart.push({id,qty:quantity,note});saveCart();renderCart();toast('Produto adicionado ao carrinho');}
function cartTotal(){return cart.reduce((sum,x)=>{const p=products.find(p=>p.id===x.id);return sum+(p?price(p)*x.qty:0);},0);}
function renderCart(){const focused=document.activeElement;const restoreFocus=focused?.closest('#cart-items')?{qty:focused.dataset.qty,delta:focused.dataset.delta,remove:focused.dataset.remove}:null;saveCart();$('#cart-items').innerHTML=cart.length?cart.map((x,i)=>{const p=products.find(p=>p.id===x.id);return '<div class="cart-row"><img src="'+esc(p?.images[0]||'assets/placeholder.svg')+'" alt=""><div><h3>'+esc(p?.name||'Produto aguardando atualização')+'</h3>'+(x.note?'<p class="cart-note">'+esc(x.note)+'</p>':'')+'<span class="cart-price">'+(p?money(price(p)):'Preço indisponível')+'</span><div class="quantity"><button data-qty="'+i+'" data-delta="-1" aria-label="Diminuir quantidade" '+(x.qty===1?'disabled':'')+'>−</button><span>'+x.qty+'</span><button data-qty="'+i+'" data-delta="1" aria-label="Aumentar quantidade" '+(x.qty>=99?'disabled':'')+'>+</button><button class="remove" data-remove="'+i+'">Remover</button></div></div></div>';}).join(''):'<div class="empty"><h3>Seu carrinho está vazio</h3><p>Encontre algo que combina com você.</p><button class="button" data-close>Explorar produtos</button></div>';$('#cart-total').textContent=money(cartTotal());$('#checkout-total').textContent=money(cartTotal());$('#checkout-next').disabled=!cart.length||!live;if(!cart.length){$('#cart-step').hidden=false;$('#checkout-form').hidden=true;}
 if(restoreFocus){let target;if(restoreFocus.qty!==undefined){target=$('[data-qty="'+restoreFocus.qty+'"][data-delta="'+restoreFocus.delta+'"]:not(:disabled)')||$('[data-qty="'+restoreFocus.qty+'"]:not(:disabled)');}else if(restoreFocus.remove!==undefined){target=$('[data-remove="'+Math.min(Number(restoreFocus.remove),cart.length-1)+'"]');}(target||$('#cart-items .button')||$('#checkout-next')).focus({preventScroll:true});}
}
function openCart(){renderCart();$('#cart-step').hidden=false;$('#checkout-form').hidden=true;$('#cart-title').textContent='Meu carrinho';if(!$('#cart-dialog').open)$('#cart-dialog').showModal();}
function openProduct(id){closeSuggestions();location.href=productURL(id);}
document.addEventListener('click',e=>{const button=e.target.closest('button,a');if(!button)return;if(button.closest('#mobile-menu')&&(button.hasAttribute('data-category')||button.hasAttribute('data-offers')))$('#mobile-menu').close();if(button.hasAttribute('data-category')){e.preventDefault();selectCategory(button.dataset.category);}if(button.hasAttribute('data-offers')){if(isProductPage||isSearchPage){location.href='index.html?ofertas=1#catalogo';return;}reset();offersOnly=true;render();$('#catalogo').scrollIntoView({behavior:'smooth'});}if(button.hasAttribute('data-add'))addCart(button.dataset.add);if(button.hasAttribute('data-reset'))reset();if(button.hasAttribute('data-close'))button.closest('dialog')?.close();if(button.hasAttribute('data-thumb')){const p=products.find(p=>p.id===currentDetail);$('#detail-image').src=p.images[Number(button.dataset.thumb)];$$('.thumbs button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});if($('#gallery-position'))$('#gallery-position').textContent=(Number(button.dataset.thumb)+1)+' / '+p.images.length;}if(button.hasAttribute('data-qty')){const x=cart[Number(button.dataset.qty)];if(x)x.qty=Math.max(1,Math.min(99,x.qty+Number(button.dataset.delta)));renderCart();}if(button.hasAttribute('data-remove')){cart.splice(Number(button.dataset.remove),1);renderCart();}});
document.addEventListener('error',e=>{if(e.target.tagName==='IMG'&&!e.target.src.endsWith('/assets/placeholder.svg'))e.target.src='assets/placeholder.svg';},true);
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('#open-cart').onclick=openCart;
if($('#filter-toggle'))$('#filter-toggle').onclick=()=>{const open=$('#filters').hidden;$('#filters').hidden=!open;$('#filter-toggle').setAttribute('aria-expanded',String(open));};
if($('#clear-filters'))$('#clear-filters').onclick=reset;
if($('#accessory-cta'))$('#accessory-cta').onclick=()=>selectCategory(products.some(p=>p.category==='acessorios')?'acessorios':'');
for(const selector of ['#category','#type','#gender','#min-price','#max-price','#sort'])$(selector)?.addEventListener(selector.includes('price')?'input':'change',()=>{limit=12;render();});
$('.search').onsubmit=e=>{e.preventDefault();closeSuggestions();location.href=searchURL($('#search').value);};
if($('#load-more'))$('#load-more').onclick=()=>{limit+=12;render();};
$('#checkout-next').onclick=()=>{if(!live||!cart.length)return;$('#cart-step').hidden=true;$('#checkout-form').hidden=false;$('#cart-title').textContent='Finalizar pedido';$('#checkout-form input').focus();};
$('#checkout-back').onclick=()=>{$('#cart-step').hidden=false;$('#checkout-form').hidden=true;$('#cart-title').textContent='Meu carrinho';};
$('#delivery').onchange=()=>{const shipping=$('#delivery').value==='shipping';$('#address-fields').hidden=!shipping;$('#address-fields').disabled=!shipping;};
const form=$('#checkout-form');
form.elements.cep.oninput=()=>{const digits=form.elements.cep.value.replace(/\D/g,'').slice(0,8);form.elements.cep.value=digits.length>5?digits.slice(0,5)+'-'+digits.slice(5):digits;};
$('#lookup-cep').onclick=async()=>{const cep=form.elements.cep.value.replace(/\D/g,'');if(cep.length!==8){$('#cep-status').textContent='Digite um CEP com 8 números.';return;}const button=$('#lookup-cep');button.disabled=true;$('#cep-status').textContent='Consultando CEP…';try{const response=await fetch('https://viacep.com.br/ws/'+cep+'/json/',{signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error();const address=await response.json();if(address.erro){$('#cep-status').textContent='CEP não encontrado. Verifique o número ou preencha o endereço.';return;}if(form.elements.cep.value.replace(/\D/g,'')!==cep)return;for(const [key,val]of Object.entries({street:address.logradouro,district:address.bairro,city:address.localidade,state:address.uf}))form.elements[key].value=val||'';$('#cep-status').textContent='Confira o endereço e informe o número.';form.elements.number.focus();}catch{$('#cep-status').textContent='Não foi possível consultar o CEP. Preencha o endereço manualmente.';}finally{button.disabled=false;}};
form.onsubmit=e=>{e.preventDefault();for(const field of form.querySelectorAll('input:not(:disabled),textarea:not(:disabled)'))field.value=field.value.trim();if(!form.reportValidity())return;if(!live||!cart.length)return toast('Atualize o catálogo antes de finalizar.');reconcileCart();renderCart();if(!cart.length)return;const fields=Object.fromEntries(new FormData(form));const items=cart.map(x=>{const p=products.find(p=>p.id===x.id);return x.qty+'× '+p.name+' — '+money(price(p))+' cada — '+money(price(p)*x.qty)+(x.note?'\nObservação: '+x.note:'');});let message='Olá, Eleven Store! Gostaria de confirmar este pedido:\n\n'+items.join('\n\n')+'\n\nSubtotal dos produtos: '+money(cartTotal())+'\nNome: '+fields.name.trim()+'\nPagamento: '+fields.payment;if(fields.delivery==='shipping')message+='\n\nEntrega: '+fields.street+', '+fields.number+(fields.complement?' — '+fields.complement:'')+'\n'+fields.district+' — '+fields.city+'/'+fields.state.toUpperCase()+'\nCEP: '+fields.cep;else message+='\nRecebimento: combinar com a loja.';if(fields.notes?.trim())message+='\n\nObservações: '+fields.notes.trim();message+='\n\nAguardo a confirmação de disponibilidade, frete e valor final.';window.open('https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');toast('Confirme o envio no WhatsApp. Seu carrinho foi mantido.');};
if($('#products'))$('#products').innerHTML=Array.from({length:8},()=>'<div class="skeleton" aria-hidden="true"></div>').join('');
saveCart();load();
// Recalcula ofertas vencidas sem exigir recarregamento da página.
setInterval(()=>{if(live&&products.some(p=>p.end&&p.end<=Date.now()&&p.offer)){products.forEach(p=>{if(p.end&&p.end<=Date.now())p.offer=0;});render();renderCart();if(currentDetail&&isProductPage)renderProductPage(currentDetail);}},30000);

// Sugestões visuais: busca em todo o catálogo, com navegação por teclado.
let suggestionIndex=-1;
function closeSuggestions(){
 $('#search-suggestions').hidden=true;
 $('#search').setAttribute('aria-expanded','false');
 $('#search').removeAttribute('aria-activedescendant');
 suggestionIndex=-1;
}
function matchesSearch(p,query){const aliases=['relogio','wearzone'].includes(p.category)?'relogio relogios smartwatch smartwatches':'';const text=norm(p.name+' '+p.category+' '+categoryName(p.category)+' '+p.type+' '+aliases);return norm(query).split(/\s+/).filter(Boolean).every(word=>text.includes(word));}
function showSuggestions(){
 const term=norm($('#search').value);
 if(!term){closeSuggestions();return;}
 const matches=products.filter(p=>matchesSearch(p,term));
 suggestionIndex=-1;
 $('#search').removeAttribute('aria-activedescendant');
 $('#search-options').innerHTML=matches.slice(0,6).map((p,i)=>'<a id="suggestion-'+i+'" class="search-option" role="option" aria-selected="false" tabindex="-1" href="produto.html?produto='+encodeURIComponent(p.id)+'" data-product="'+esc(p.id)+'"><img src="'+esc(p.images[0])+'" alt="" width="48" height="48"><span><strong>'+esc(p.name.replace(/\|/g,' · '))+'</strong><small>'+esc(categoryName(p.category))+'</small></span><b>'+(price(p)>0?money(price(p)):'Sob consulta')+'</b></a>').join('');
 $('#search-feedback').textContent=matches.length?(live?'':'Catálogo anterior — confirme os preços com a loja.'):products.length?'Nenhum produto encontrado. Tente outro nome.':live?'Nenhum produto disponível.':'O catálogo ainda não está disponível. Aguarde ou tente atualizar.';
 $('#search-all').hidden=!matches.length;
 $('#search-all').textContent='Ver todos os resultados ('+matches.length+') →';
 $('#search-suggestions').hidden=false;
 $('#search').setAttribute('aria-expanded','true');
}
$('#search').addEventListener('input',showSuggestions);
$('#search').addEventListener('focus',showSuggestions);
$('#search').addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeSuggestions();return;}
 if(['ArrowDown','ArrowUp'].includes(e.key)){
  e.preventDefault();if($('#search-suggestions').hidden)showSuggestions();
  const options=$$('.search-option');if(!options.length)return;
  suggestionIndex=suggestionIndex<0?(e.key==='ArrowDown'?0:options.length-1):(suggestionIndex+(e.key==='ArrowDown'?1:-1)+options.length)%options.length;
  options.forEach((el,i)=>el.setAttribute('aria-selected',String(i===suggestionIndex)));
  $('#search').setAttribute('aria-activedescendant',options[suggestionIndex].id);
  options[suggestionIndex].scrollIntoView({block:'nearest'});
 }
 if(e.key==='Enter'&&!$('#search-suggestions').hidden&&suggestionIndex>=0){
  e.preventDefault();const selected=$$('.search-option')[suggestionIndex];if(selected)openProduct(selected.dataset.product);
 }
});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.search'))closeSuggestions();});
$('.search').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closeSuggestions();});
