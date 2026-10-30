# Verificações — Eleven Store

Revisão executada em 29/10/2026 com Chrome automatizado. As verificações abaixo usam o catálogo real para navegação e cenários locais/simulados para dados inválidos e falhas. Nenhuma mensagem de WhatsApp foi enviada, nenhuma planilha foi modificada e nenhuma publicação foi realizada.

## Problemas corrigidos

| Problema | Correção e verificação |
| --- | --- |
| Categorias ultrapassavam a tela de 1024 px. | Espaçamento adaptado para exibir promoções por inteiro em 1024 px; nas larguras menores, a rolagem fica dentro da navegação, sem alargar a página. |
| Carrinhos de abas abertas ficavam desatualizados. | Sincronização por evento de armazenamento; adicionar, alterar quantidade e remover itens foram conferidos em duas abas do mesmo navegador. |
| Alterar/remover itens destruía o foco do teclado. | O foco retorna ao controle equivalente ou ao próximo item após renderizar o carrinho. |
| Seta para cima no autocomplete selecionava a penúltima sugestão. | A primeira seta para cima seleciona a última sugestão; seta para baixo começa na primeira. |
| Quantidade vazia no produto virava uma unidade silenciosamente. | Campo obrigatório; valores vazios e fracionados não adicionam itens; botões respeitam os limites de 1 a 99. |
| Nome preenchido apenas com espaços passava pela validação. | Campos são aparados e validados antes de montar a mensagem. |
| Datas impossíveis eram normalizadas e datas nativas da planilha não eram reconhecidas. | Validação de calendário, anos bissextos e horário; suporte a Date(ano,mês,dia) e arrays de horário do Google Visualization, mantendo UTC−03. |
| Aplicar filtros no celular escondia o botão que tinha foco. | Ao recolher o painel, o foco retorna ao botão Filtrar. |

## Fluxos conferidos

- Início, busca e produto em 320, 390, 768, 769, 1024, 1200 e 1440 px: sem transbordamento horizontal da página.
- Pesquisa por Enter, lupa e botão de todos os resultados nas três páginas; autocomplete por teclado; termos acentuados, plural de relógio, busca vazia e nenhum resultado.
- Categoria, tipo/gênero disponíveis no cadastro, preço, ofertas, ordenação, chips, limpeza e carregamento progressivo. A limpeza preserva o termo pesquisado.
- URL da busca mantém filtros e ordenação após recarregar; acesso a produto e retorno à busca preservam o endereço.
- Abertura local via file:// e HTTP em subpasta /loja/, sem reescrita de rotas.
- Carrinho entre páginas e entre abas; quantidade e observações do produto; navegação por teclado nos controles de quantidade e remoção.
- Checkout com recebimento a combinar e entrega; composição da mensagem interceptada antes de abrir WhatsApp; carrinho mantido.
- CEP com resposta simulada de sucesso e falha; preenchimento manual continua disponível.
- Galeria por miniaturas/setas; menu e busca mobile fecham com Escape e devolvem o foco.
- Falha de consulta com cache: aviso visível e finalização bloqueada.
- Sintaxe dos scripts e ausência de erros JavaScript nos fluxos exercitados.

## Repetir após mudanças

1. Abra index.html e busque relógio. Confirme a navegação para buscar.html?q=... e as sugestões individuais para produto.html?produto=....
2. Aplique filtros, recarregue, entre em um produto e volte. Confira endereço, termo, seleção e contagem.
3. Em 390 px, abra Filtrar, selecione uma opção e pressione Ver resultados. Confira que o painel fecha e o foco retorna ao botão Filtrar.
4. Abra duas abas da mesma origem e adicione/remova produtos. Confira que ambas mostram a mesma quantidade e subtotal.
5. Percorra o carrinho com Tab e Enter. O foco não deve desaparecer ao alterar um item.
6. Confira os intervalos 768/769 px e 1000–1200 px, além de 320 e 1440 px.
7. Para checkout, intercepte window.open ou pare antes do envio; nunca envie pedidos de teste à loja.

Esta é uma lista de regressão manual com registro de verificações, não uma suíte instalada. Emulação de viewport não substitui testes em celulares físicos. Publicação real no GitHub Pages e envio real pelo WhatsApp não foram verificados.

## Cartões de produto

Os cartões do catálogo, busca e relacionados abrem o produto ao clicar na foto, nome, preço, espaços internos ou Ver mais. O WhatsApp é um link independente. Adicionar ao carrinho permanece na página do produto. Ao testar carrinho entre abas, adicione os itens nessa página.

## Organização de pastas

Após mover os arquivos para assets/css, assets/js, assets/images e docs, foram conferidos: carregamento das três páginas via file:// e HTTP em /site_relogio/, navegação pela busca, filtro e recarga, produto, carrinho e subtotal entre páginas, menu mobile e imagem substituta após falha. Não houve erros JavaScript nem arquivos locais ausentes, exceto a imagem inexistente simulada para testar o fallback. Os endereços dos HTML permanecem na raiz.
