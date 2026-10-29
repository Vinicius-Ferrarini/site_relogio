# Referências de interface — Eleven Store

Documento de referência para alterações futuras. As observações abaixo foram conferidas no navegador em 29/10/2026; o site externo pode mudar.

## Sites

- [Loja de referência](https://www.carlinbilhares.com.br/)
- [Busca por mesa](https://www.carlinbilhares.com.br/buscar?q=mesa)

## Padrões já adotados

Cabeçalho em faixas, categorias com ícones e destaque de promoções; catálogo em cartões; produto em página própria com galeria, preço, ações e descrição. Mobile com cabeçalho compacto, menu lateral, pesquisa recolhida, duas colunas e título do produto antes da imagem. Manter as cores e a identidade Eleven descritas em AGENTS.md.

## Busca — comportamento observado

- A pesquisa abre um endereço específico, `/buscar?q=mesa`, sem depender da vitrine inicial.
- Breadcrumb identifica a página de resultados; o termo pesquisado aparece na área principal.
- Desktop: filtros à esquerda (departamento, marca e preço), ordenação e grade de produtos à direita. A referência apresenta paginação.
- Mobile: duas colunas de produtos, ordenação e botão “Filtrar”; filtros não ocupam permanentemente a lateral.
- Cartões permitem entrar no produto e chamar pelo WhatsApp.

## Adaptação para Eleven

- Usar `buscar.html?q=...`, com caminhos relativos e sem reescrita de servidor, para compatibilidade com arquivos locais e GitHub Pages.
- Enter, botão de pesquisa e “Ver todos os resultados” levam à página de busca. Escolher uma sugestão específica continua abrindo o produto.
- Pesquisar nomes, categorias e tipos sem distinguir acentos/maiúsculas; incluir o nome amigável da categoria para aceitar “relógio” e “smartwatch”.
- Usar apenas filtros disponíveis no cadastro: categoria, tipo, gênero, preço mínimo/máximo e ofertas. Não inventar marcas ou estoque.
- Desktop: painel lateral; mobile: painel recolhível acionado por “Filtrar”. Exibir quantidade encontrada e filtros ativos.
- Preservar o termo ao limpar filtros. Nova pesquisa começa sem filtros antigos. Termo, filtros e ordenação ficam no endereço para recarga e compartilhamento.
- Manter “Ver mais produtos” como carregamento progressivo da lista, em vez de copiar a paginação da referência.
- Prever busca vazia, nenhum resultado, faixa de preço inválida e falha de consulta. Preservar carrinho, preços e regras de compra existentes.

Não copiar condições comerciais, avaliações, preços ou fotos do site de referência para produtos da Eleven.
