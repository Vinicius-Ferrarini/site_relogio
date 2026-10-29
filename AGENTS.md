# Instruções para Claude

## Antes de editar

Estas instruções valem para esta pasta e suas subpastas. Leia [README.md](README.md), examine os arquivos envolvidos e confira o estado do Git. Preserve alterações preexistentes do usuário; não faça reset, limpeza destrutiva ou sobrescrita indiscriminada.

Trabalhe na pasta atual do repositório sem depender de caminhos absolutos da máquina. Instruções atuais do usuário têm precedência sobre preferências documentadas aqui.

## Preferências do proprietário

- **Não gerar ZIPs** ou outros pacotes, salvo novo pedido explícito. Altere os arquivos diretamente.
- Não publicar, enviar commits ao remoto ou mudar domínio/GitHub Pages sem isso fazer parte da solicitação.
- Não enviar mensagens reais de WhatsApp em testes. Inspecione a URL/mensagem ou intercepte a abertura no navegador de teste.
- Comunicar em português, de forma breve, descrevendo resultado e verificações.
- Manter HTML, CSS e JavaScript puros. Não adicionar frameworks, backend, dependências de execução ou build para alterações que cabem na arquitetura atual.

## Arquitetura

- `config.js` define `window.STORE_CONFIG` e vem antes de `app.js`.
- `app.js` concentra catálogo, busca, carrinho e checkout e atende às três páginas.
- `produto.html` usa `data-page="product"` no body e carrega `product.js` após `app.js`.
- `buscar.html` usa `data-page="search"`, `search.js` após `app.js` e `search.css` após `mobile.css`. A busca usa `q` e filtros na URL; preserve compatibilidade com recarga direta. Consulte [referencia.md](referencia.md) para decisões visuais.
- `mobile.js` vem após esses scripts; o evento `product-rendered` inicializa os controles da galeria após renderizar o produto.
- `mobile.css` vem após `styles.css`. Alinhe o breakpoint de 768px ao JavaScript e verifique a transição 768/769px.
- Cabeçalho, rodapé, menus e formulários compartilhados estão duplicados nos três HTML. Mantenha-os coerentes e preserve IDs usados pelos scripts.
- Produtos abrem em `produto.html?produto=ID`, **não em modal**. Carrinho e menu lateral podem usar dialog nativo.
- Use caminhos relativos para abrir localmente e em subpastas do GitHub Pages. Não introduza rotas que dependam de servidor/regras de reescrita.

## Identidade e comportamentos aprovados

- Cabeçalho central e botões de adicionar: **#1642c2**, com alteração discreta no hover.
- Campo de busca branco; WhatsApp **#1eab49**.
- Logo original de `assets/logo.png` com fundo preto no cabeçalho.
- Topo e categorias no mesmo fundo escuro; “Promoções Imperdíveis” em amarelo com ícone de desconto.
- Categorias da planilha com ícones, distribuídas pela largura disponível no desktop.
- `.category-band` fica fora do header fixo para sair da tela ao rolar. Não a torne sticky por acidente.
- Mobile: menu lateral, busca pela lupa, categorias deslizantes, catálogo em duas colunas e áreas de toque confortáveis.
- Produto mobile: título antes da galeria; miniaturas, setas e gesto horizontal sem bloquear a rolagem vertical.
- Ao enviar a pesquisa, navegue para `buscar.html?q=...`. Digitar apenas atualiza o autocomplete; selecionar sugestão abre o produto. Na página de busca, limpar filtros deve preservar o termo; busca vazia mostra todos.
- Preserve autocomplete com foto/preço, navegação por teclado, foco visível, rótulos acessíveis e Escape.

## Dados, preços e segurança

- Reutilize planilha e contato de `config.js`; não troque origem ou número sem solicitação.
- Não altere a planilha remota para fazer ajustes visuais. Não fixe quantidade de produtos nem catálogo de demonstração no código.
- Preserve fetch em HTTP/HTTPS e JSONP em file://. Não use eval para interpretar respostas.
- Trate planilha, parâmetros da URL e armazenamento do navegador como dados não confiáveis. Use escape de HTML/textContent e valide URLs. Não injete descrições como HTML executável.
- Preserve IDs e normalização de categorias. Ao mudar identificadores/armazenamento, considere URLs e carrinhos existentes.
- Preserve a sincronização do carrinho entre abas e o foco ao atualizar/remover itens. Não envie WhatsApp em testes; intercepte a abertura e confira a mensagem.
- Mantenha `eleven-cart-v2` e `eleven-catalog-v2`, ou implemente migração se necessário.
- Ofertas precisam de preço positivo, menor que o normal e validade aplicável em UTC−03. Não invente descontos, avaliações, estoque, frete grátis ou condições comerciais.
- Na falha de consulta, sinalize cache antigo e bloqueie compra com dados não atualizados.
- Checkout é uma solicitação, não confirmação de venda/pagamento. Não apague o carrinho apenas porque o WhatsApp abriu.
- Não persista nome/endereço do checkout nem acrescente rastreamento ou credenciais sem escopo explícito.

## Alterações e verificação

1. Leia o código atual e [TESTES.md](TESTES.md) antes de editar. Prefira mudanças pontuais e legíveis. Evite acumular regras CSS contraditórias ou duplicar eventos.
2. Preserve o comportamento das outras páginas. Não misture reformatação ampla com correção pequena sem necessidade.
3. Para mudanças funcionais, confira sintaxe, console e o fluxo afetado em navegador real. Não instale dependências na raiz só para validar uma mudança simples.
4. Para layout, confira catálogo, busca e produto em 320, 390, 768, 769 e 1440px: transbordamento horizontal, legibilidade e cliques/toques.
5. Conforme o escopo, valide menu/Escape, busca/autocomplete por clique e teclado, filtros, links de produto e recarga direta, galeria, quantidades, observações, carrinho entre páginas, subtotal, CEP e composição do WhatsApp.
6. Ao alterar consulta de dados, verifique falha de rede, cache e abertura direta de index.html. Ao alterar caminhos, teste HTTP em subpasta.
7. Não afirme ter verificado dispositivos, publicação ou fluxos que não testou. Informe limitações reais.
8. Atualize o README ao mudar estrutura, configuração, execução ou publicação. Termine com o resultado e verificações relevantes, sem gerar ZIP.

Não há comando padrão de build/teste. Escolha validações proporcionais: alterações apenas de documentação normalmente exigem revisão de fatos, caminhos e links, não testes da interface.
