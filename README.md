# Eleven Store

Loja de tecnologia em **HTML, CSS e JavaScript puros**, com catálogo do Google Sheets e pedidos pelo WhatsApp. Funciona localmente e em hospedagem estática, incluindo GitHub Pages. Não exige compilação nem instalação de dependências.

## Executar

Abra **ABRIR-SITE.cmd** ou **index.html**. É necessário acesso à internet para consultar a planilha, as fotos e o CEP. Também é possível servir a pasta com qualquer servidor HTTP estático.

Em `file://`, a consulta da planilha usa JSONP do Google Visualization; em HTTP/HTTPS, usa `fetch`. Preserve e verifique os dois modos ao alterar o carregamento.

## Estrutura

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Página inicial, catálogo, filtros e estrutura do carrinho/checkout. |
| `buscar.html` | Página de resultados de busca com filtros e ordenação. |
| `search.js` | Pesquisa aplicada, filtros, contagens e sincronização da URL. |
| `search.css` | Layout desktop/mobile da página de busca; carregado após mobile.css. |
| [referencia.md](referencia.md) | Observações da referência visual e decisões de adaptação. |
| `produto.html` | Página independente de produto, com navegação e carrinho compartilhados. |
| `config.js` | Planilha, aba e número de WhatsApp. |
| `app.js` | Dados, catálogo, autocomplete, categorias, carrinho, checkout e navegação. |
| `product.js` | Galeria, preço, quantidade, descrição e produtos relacionados. |
| `styles.css` | Identidade visual, estilos gerais e desktop. |
| `mobile.css` | Adaptação mobile; carregado após styles.css. |
| `mobile.js` | Menu lateral, busca recolhível, carrosséis e gestos da galeria. |
| `assets/` | Logo, ícones e imagem substituta para fotos indisponíveis. |
| `ABRIR-SITE.cmd` | Abre index.html no navegador padrão do Windows. |
| `.nojekyll` | Mantém a publicação estática sem processamento Jekyll. |
| [TESTES.md](TESTES.md) | Registro da revisão e roteiro de regressão. |
| [AGENTS.md](AGENTS.md) | Instruções de manutenção para agentes. |
| [claude.md](claude.md) | Ponto de entrada para essas instruções. |

Cabeçalhos, rodapés, menus e formulários compartilhados estão nos três arquivos HTML. Verifique todos ao alterar essas estruturas.

## Configuração e catálogo

`config.js` contém `window.STORE_CONFIG` com a planilha original, aba `gid: 0` e WhatsApp `5548999560110`. Não coloque senhas ou tokens no front-end.

A planilha precisa ser pública para leitura. Ela é consultada a cada abertura; produtos e categorias variam conforme o cadastro. Alterar a planilha não exige republicar o site, mas pode exigir recarregar a página; o serviço externo também pode manter cache.

| Coluna | Uso |
| --- | --- |
| `ID` | Opcional; use valores únicos e estáveis. Sem ID, o identificador é gerado pelo nome. |
| `Ativo` | `N` oculta o produto. |
| `Nome` | Nome exibido e usado na busca. |
| `Preco` | Preço normal. |
| `PrecoOferta` | Preço promocional positivo e menor que o preço normal. |
| `DataOferta` | Validade opcional em DD/MM/AAAA. |
| `HoraOferta` | Horário opcional em HH ou HH:MM; sem horário, vale até o fim do dia. |
| `Destaque` | Lido no cadastro; sozinho não cria desconto nem muda a ordenação padrão. |
| `Categoria` | Gera menus e filtros dinamicamente. |
| `Tipo`, `genero` | Filtros e informações do produto. |
| `Descricao` | Texto com quebras de linha preservadas. |
| `Img1`, `Img2`, … | URLs HTTP/HTTPS das fotos, na ordem da galeria. |

Títulos das colunas são normalizados sem distinção de maiúsculas ou acentos. Datas e horários nativos do Google Visualization também são aceitos; datas impossíveis não ativam descontos. Ofertas usam UTC−03 (Brasília) e são reavaliadas periodicamente durante a visita. Preencha IDs estáveis para preservar referências do carrinho e URLs ao renomear produtos.

Se a consulta falhar, o site pode mostrar a última consulta salva, com aviso e compra bloqueada até atualizar os dados. Preços ausentes ou não positivos aparecem como sob consulta.

## Navegação e pedidos

- Produtos abrem em página própria: `produto.html?produto=ID`.
- URLs antigas em `index.html?produto=ID` redirecionam para a página de produto.
- O catálogo inicial aceita `?categoria=...` e `?ofertas=1`. Links antigos com `?busca=...` redirecionam à nova busca.
- Enter, lupa e “Ver todos os resultados” abrem `buscar.html?q=relógio`. Uma sugestão específica abre o produto.
- A busca ignora acentos/maiúsculas e combina palavras no nome, categoria e tipo; relógio/smartwatch também encontram Wearzone. Campo vazio lista todo o catálogo.
- Na busca, refine por categoria, tipo, gênero, preço e ofertas, e ordene por preço ou nome. Opções mostram contagens dentro do termo pesquisado, antes dos demais filtros.
- “Limpar” remove os filtros e mantém a pesquisa; os chips removem um filtro por vez. “Ver mais produtos” amplia a lista de 12 em 12.
- A URL mantém `q`, `categoria`, `tipo`, `genero`, `min`, `max`, `ofertas=1` e `ordem` (`price-up`, `price-down` ou `name`). A ordenação padrão preserva a ordem da planilha.
- Autocomplete com até seis sugestões, foto e preço; aceita clique, setas, Enter e Escape.
- Cada cartão tem **Adicionar carrinho** e **Chamar no WhatsApp**.
- Carrinho compartilhado entre as páginas e sincronizado entre abas da mesma origem, com quantidade e observação por item.
- Checkout com recebimento a combinar ou entrega no endereço; ViaCEP ajuda no preenchimento, que também pode ser manual.
- A finalização abre o WhatsApp com uma mensagem preparada. O visitante precisa enviá-la; o site não confirma envio, pagamento ou reserva de estoque e não apaga automaticamente o carrinho.

Frete, prazo, disponibilidade e pagamento são confirmados pela loja. Não existe cobrança on-line.

## Identidade visual e mobile

- Cabeçalho central e botões de carrinho: **#1642c2**; campo de busca branco.
- WhatsApp: **#1eab49**; logo original com fundo preto.
- Topo e categorias no mesmo fundo escuro; promoções em destaque amarelo com ícone de desconto.
- A faixa de categorias fica **fora do cabeçalho fixo**: sai da tela ao rolar e volta ao retornar ao topo. Logo, busca e carrinho permanecem fixos.
- Até **768px**: cabeçalho compacto, menu lateral, busca pela lupa, carrosséis de categorias/benefícios, catálogo com duas colunas e carrinho em tela inteira.
- No produto mobile: título antes da foto, miniaturas, setas e gesto horizontal na galeria.
- Na busca mobile, o botão **Filtrar** expande um painel acima da lista; no desktop, os filtros ficam na lateral.
- A partir de **769px**, reaparece a navegação desktop.

Manrope e DM Sans são carregadas via Google Fonts, com fontes locais alternativas. Fotos dos produtos vêm da planilha.

## Dados no navegador

O `localStorage` guarda `eleven-cart-v2` (IDs, quantidades e observações dos itens) e `eleven-catalog-v2` (última consulta). Nome, endereço e campos gerais do checkout não são persistidos. Ao finalizar, os dados preenchidos entram na mensagem para WhatsApp.

## GitHub Pages

1. Envie os três HTML, todos os JS/CSS listados acima, `assets/` e `.nojekyll` para a raiz do repositório.
2. Em **Settings → Pages**, configure publicação pela branch desejada e pasta **/ (root)**.
3. Confira a página inicial, o acesso direto a um produto e a uma busca filtrada, incluindo a recarga desses endereços após publicar.

Os caminhos são relativos, adequados também a projetos servidos em subpastas. Não é necessária reescrita de rotas para `produto.html?produto=...` ou `buscar.html?q=...`. A configuração e o deploy devem ser verificados no momento da publicação; esta documentação não comprova que o site foi publicado.

Se existir `CNAME` no repositório de destino, preserve-o salvo pedido explícito de alteração do domínio.

## Manutenção

Leia [AGENTS.md](AGENTS.md) antes de editar. Verifique as três páginas, o console e os fluxos afetados. Para responsividade, confira pelo menos 320, 390, 768, 769 e 1440px. Emulação de toque ajuda, mas não substitui todos os dispositivos reais.

Consulte [TESTES.md](TESTES.md) para os cenários conferidos e o roteiro de regressão. Não há suíte automatizada instalada ou comando de build configurado. **Não gere ZIPs por padrão**; trabalhe diretamente nos arquivos do projeto.

## Referências e recursos

- [Projeto original e origem da logo](https://github.com/Vinicius-Ferrarini/Vendas_Relogio)
- [Site original Eleven Store](https://elevenstore11.com.br/)
- [Referência visual Carlin Bilhares](https://www.carlinbilhares.com.br/)

A organização desktop/mobile foi adaptada à Eleven. O ícone `assets/promocoes-icone.png` veio da referência a pedido do proprietário; o vetor de WhatsApp veio do projeto Simple Icons. As fotos dos produtos permanecem vinculadas ao cadastro da Eleven.
