'use strict';
let searchQuery=new URLSearchParams(location.search).get('q')||'';
const searchFilterFields={categoria:'#category',tipo:'#type',genero:'#gender',min:'#min-price',max:'#max-price'};
const searchMobile=matchMedia('(max-width: 768px)');
function restoreSearchState(){
 const params=new URLSearchParams(location.search);
 searchQuery=params.get('q')||'';$('#search').value=searchQuery;
 const pool=products.filter(p=>matchesSearch(p,searchQuery));
 for(const [selector,key,label]of [['#category','category','Todas as categorias'],['#type','type','Todos os tipos'],['#gender','gender','Todos']]){
  const values=[...new Set(pool.map(p=>p[key]).filter(Boolean))];
  $(selector).innerHTML='<option value="">'+label+'</option>'+values.map(value=>'<option value="'+esc(value)+'">'+esc(key==='category'?categoryName(value):value.charAt(0).toUpperCase()+value.slice(1))+' ('+pool.filter(p=>p[key]===value).length+')</option>').join('');
 }

 for(const [key,selector]of Object.entries(searchFilterFields)){
  const value=params.get(key)||'';
  $(selector).value=['min','max'].includes(key)?(value!==''&&Number.isFinite(Number(value))&&Number(value)>=0?value:''):value;
 }
 $('#sort').value=['price-up','price-down','name'].includes(params.get('ordem'))?params.get('ordem'):'default';
 $('#only-offers').checked=params.get('ofertas')==='1';
 document.title=(searchQuery?'Busca: '+searchQuery:'Todos os produtos')+' | Eleven Store';
}
function updateSearchURL(){
 const url=new URL(location.href);url.search='';url.searchParams.set('q',searchQuery);
 for(const [key,selector]of Object.entries(searchFilterFields))if($(selector).value!=='')url.searchParams.set(key,$(selector).value);
 if($('#sort').value!=='default')url.searchParams.set('ordem',$('#sort').value);
 if($('#only-offers').checked)url.searchParams.set('ofertas','1');
 history.replaceState(null,'',url);
}
function resetSearchFilters(){
 for(const selector of Object.values(searchFilterFields))$(selector).value='';
 $('#only-offers').checked=false;$('#sort').value='default';limit=12;
 renderSearchResults();
}
function renderSearchResults(){
 const cat=$('#category').value,type=$('#type').value,gender=$('#gender').value;
 const min=$('#min-price').value,max=$('#max-price').value;
 const invalid=(min!==''&&Number(min)<0)||(max!==''&&Number(max)<0)||(min!==''&&max!==''&&Number(min)>Number(max));
 $('#price-filter-error').hidden=!invalid;
 $('#price-filter-error').textContent=invalid?'Informe preços positivos, com o mínimo menor ou igual ao máximo.':'';
 let list=invalid?[]:products.filter(p=>matchesSearch(p,searchQuery)&&(!cat||p.category===cat)&&(!type||p.type===type)&&(!gender||p.gender===gender)&&(min===''||price(p)>=Number(min))&&(max===''||price(p)<=Number(max))&&(!$('#only-offers').checked||onOffer(p)));
 const sort=$('#sort').value;
 if(sort==='price-up')list.sort((a,b)=>price(a)-price(b));
 if(sort==='price-down')list.sort((a,b)=>price(b)-price(a));
 if(sort==='name')list.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
 $('#catalog-title').textContent=searchQuery?'Resultados para “'+searchQuery+'”':'Todos os produtos';
 $('#result-count').textContent=invalid?'Ajuste a faixa de preço para continuar.':list.length+' produto'+(list.length===1?' encontrado':'s encontrados');
 $('#shown-count').textContent=list.length?'Exibindo '+Math.min(limit,list.length)+' de '+list.length:'';
 $('#products').innerHTML=list.length?list.slice(0,limit).map(productCard).join(''):'<div class="empty"><h2>'+(invalid?'Confira os filtros de preço':'Nenhum produto encontrado')+'</h2><p>'+(invalid?'O preço mínimo não pode ser maior que o máximo.':'Tente outro termo ou remova os filtros para ampliar sua busca.')+'</p><button class="button" data-reset>Limpar filtros</button><a class="search-reset-link" href="buscar.html?q=">Explorar todos os produtos →</a></div>';
 $('#products').setAttribute('aria-busy','false');$('#load-more').hidden=list.length<=limit;
 const labels={categoria:cat?categoryName(cat):'',tipo:type,genero:gender,min:min!==''?'A partir de '+money(Number(min)):'',max:max!==''?'Até '+money(Number(max)):''};
 const chips=Object.entries(labels).filter(([,value])=>value);
 if($('#only-offers').checked)chips.push(['ofertas','Somente ofertas']);
 $('#search-active-filters').innerHTML=chips.map(([key,label])=>'<button class="search-filter-chip" data-remove-filter="'+key+'" aria-label="Remover filtro: '+esc(label)+'">'+esc(label)+' <span aria-hidden="true">×</span></button>').join('');
 updateSearchURL();
}
function setSearchFiltersOpen(open){$('#filters').hidden=!open;$('#filter-toggle').setAttribute('aria-expanded',String(open));}
setSearchFiltersOpen(!searchMobile.matches);
$('#filter-toggle').onclick=()=>setSearchFiltersOpen($('#filters').hidden);
searchMobile.addEventListener('change',()=>setSearchFiltersOpen(!searchMobile.matches));
$('#only-offers').addEventListener('change',()=>{limit=12;renderSearchResults();});
$('#apply-search-filters').onclick=()=>{renderSearchResults();if(!$('#price-filter-error').hidden){$('#min-price').focus();return;}if(searchMobile.matches)setSearchFiltersOpen(false);$('.search-results-toolbar').scrollIntoView({block:'start',behavior:'smooth'});};
$('#search-active-filters').addEventListener('click',e=>{const button=e.target.closest('[data-remove-filter]');if(!button)return;const key=button.dataset.removeFilter;if(key==='ofertas')$('#only-offers').checked=false;else $(searchFilterFields[key]).value='';limit=12;renderSearchResults();});
