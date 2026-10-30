'use strict';
// Página estática de produto; o identificador na URL consulta a mesma planilha.
function renderProductPage(id){
 const container=$('#product-detail');
 const p=products.find(item=>item.id===id);
 container.setAttribute('aria-busy','false');
 if(!p){
  document.title='Produto indisponível | Eleven Store';
  container.innerHTML='<section class="product-not-found"><span class="eyebrow dark">ELEVEN STORE</span><h1>'+(!live?'Não foi possível carregar o produto':'Produto não encontrado')+'</h1><p>'+(!live?'Tente atualizar o catálogo para consultar este produto.':'Este link pode ter mudado ou o produto não está mais disponível.')+'</p><a class="button" href="index.html#catalogo">Voltar para a loja →</a></section>';
  $('#related-section').hidden=true;return;
 }
 const oldNote=$('#item-note')?.value||'';
 const oldQuantity=$('#product-quantity')?.value||'1';
 const oldImage=$('#detail-image')?.getAttribute('src');
 currentDetail=p.id;
 document.title=p.name+' | Eleven Store';
 document.querySelector('meta[name="description"]').content=p.name+'. Confira fotos, detalhes e preço na Eleven Store. Fale com a loja pelo WhatsApp.';
 const cost=price(p);
 const selectedImage=Math.max(0,p.images.indexOf(oldImage));
 const message='Olá! Vim pelo site da Eleven Store e gostaria de saber mais sobre '+p.name+'.';
 container.innerHTML=
 '<div class="product-overview">'+
 '<section class="product-gallery" aria-label="Fotos do produto"><div class="product-image-stage">'+
 (onOffer(p)?'<span class="badge">'+Math.round((1-cost/p.original)*100)+'% de desconto</span>':'')+
 '<img id="detail-image" class="detail-main-image" src="'+esc(p.images[selectedImage])+'" alt="'+esc(p.name)+'" width="600" height="600" fetchpriority="high"></div>'+
 '<div class="thumbs" aria-label="Escolher imagem">'+p.images.map((src,i)=>'<button type="button" data-thumb="'+i+'" class="'+(i===selectedImage?'selected':'')+'" aria-label="Ver imagem '+(i+1)+'"><img src="'+esc(src)+'" alt="" width="64" height="64"></button>').join('')+'</div></section>'+
 '<section class="product-purchase" aria-labelledby="detail-title">'+
 '<nav class="breadcrumb" aria-label="Caminho de navegação"><a href="index.html">Início</a><span aria-hidden="true">/</span><a href="index.html?categoria='+encodeURIComponent(p.category)+'#catalogo">'+esc(categoryName(p.category))+'</a><span aria-hidden="true">/</span><span aria-current="page">Produto</span></nav>'+
 '<h1 id="detail-title">'+esc(p.name.replace(/\|/g,' · '))+'</h1>'+
 '<div class="product-meta"><span>'+esc(categoryName(p.category))+'</span>'+(p.type?'<span>Modelo: '+esc(p.type)+'</span>':'')+'</div>'+
 '<div class="product-price-area">'+(onOffer(p)?'<del class="old-price">De '+money(p.original)+'</del>':'')+'<strong class="price">'+(cost>0?money(cost):'Preço sob consulta')+'</strong><p>Forma de pagamento a combinar com a loja.</p></div>'+
 '<div class="product-service-note">'+icon('message')+'<div><strong>Atendimento direto com a Eleven</strong><span>Tire suas dúvidas e confirme a disponibilidade pelo WhatsApp.</span></div></div>'+
 '<p class="product-instructions">Adicione ao carrinho para montar seu pedido ou converse com a gente sobre este produto.</p>'+
 '<div class="product-options"><label for="product-quantity">Quantidade<span class="product-quantity"><button type="button" data-detail-quantity="-1" aria-label="Diminuir quantidade">−</button><input id="product-quantity" type="number" required min="1" max="99" step="1" inputmode="numeric" value="'+esc(oldQuantity)+'"><button type="button" data-detail-quantity="1" aria-label="Aumentar quantidade">+</button></span></label><label for="item-note">Preferência ou observação<input id="item-note" maxlength="500" placeholder="Ex.: cor, tamanho ou modelo" value="'+esc(oldNote)+'"></label></div>'+
 '<div class="product-purchase-actions"><button class="button" id="detail-add" '+(!live||cost<=0?'disabled':'')+'>'+icon('bag')+' Adicionar ao carrinho</button><a class="button product-whatsapp" target="_blank" rel="noopener noreferrer" href="https://wa.me/'+cfg.whatsapp+'?text='+encodeURIComponent(message)+'">'+icon('message')+' Chamar no WhatsApp</a></div>'+
 '<div class="product-delivery">'+icon('truck')+'<p><strong>Entrega a combinar</strong><span>Consulte o frete e o prazo para sua região.</span></p></div>'+
 '<a class="product-description-link" href="#descricao">Ver descrição completa ↓</a></section></div>'+
 '<section class="product-information" id="descricao" aria-labelledby="description-title"><div class="product-information-heading"><h2 id="description-title">Descrição do produto</h2><span>Conheça todos os detalhes</span></div><div class="product-information-grid"><div class="product-description-text">'+esc(p.description||'Entre em contato com a Eleven Store para conhecer os detalhes deste produto.')+'</div><aside class="product-specifications"><h3>Informações do produto</h3><dl><dt>Categoria</dt><dd>'+esc(categoryName(p.category))+'</dd>'+(p.type?'<dt>Tipo</dt><dd>'+esc(p.type)+'</dd>':'')+(p.gender?'<dt>Gênero</dt><dd>'+esc(p.gender)+'</dd>':'')+'</dl><p>Confirme cores, medidas e disponibilidade com a loja antes de finalizar seu pedido.</p></aside></div></section>';
 $('#detail-add').onclick=()=>{
  const input=$('#product-quantity');
  if(!input.checkValidity()){input.reportValidity();return;}
  addCart(p.id,$('#item-note').value.trim(),Number(input.value));
 };
 const updateQuantityButtons=()=>{const value=Number($('#product-quantity').value);$('[data-detail-quantity="-1"]').disabled=value<=1;$('[data-detail-quantity="1"]').disabled=value>=99;};
 $('#product-quantity').addEventListener('input',updateQuantityButtons);
 $$('[data-detail-quantity]').forEach(button=>button.onclick=()=>{const input=$('#product-quantity');input.value=Math.max(1,Math.min(99,Math.trunc(Number(input.value)||1)+Number(button.dataset.detailQuantity)));updateQuantityButtons();});
 updateQuantityButtons();
 const related=products.filter(item=>item.id!==p.id&&item.category===p.category).slice(0,4);
 $('#related-section').hidden=!related.length;
 $('#related-products').innerHTML=related.map(productCard).join('');
 document.dispatchEvent(new Event('product-rendered'));
}
