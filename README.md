# Eleven Store

Loja em HTML, CSS e JavaScript puros. Sem instalação, compilação ou dependências de execução.

## Abrir

Dê dois cliques em ABRIR-SITE.cmd ou index.html. É necessário acesso à internet para consultar a planilha, imagens e CEP. Também pode usar qualquer servidor estático (por exemplo, Live Server).

## Publicar no GitHub Pages

1. Envie index.html, styles.css, app.js, config.js, assets/ e .nojekyll à raiz do repositório.
2. Em Settings → Pages, selecione Deploy from a branch, a branch desejada e / (root).
3. Salve e aguarde a publicação. Todos os caminhos são relativos e funcionam também em URLs de projeto.

O domínio atual não foi alterado. Se substituir os arquivos no repositório original, preserve o CNAME que já existe nele. Este pacote não inclui CNAME para evitar associar um novo repositório ao domínio atual.

## Catálogo

config.js contém a mesma planilha e número de WhatsApp do projeto original. O catálogo é consultado a cada abertura. Categorias são criadas pela planilha. Não é necessário republicar para alterar produtos.

Colunas reconhecidas: Ativo, Nome, Preco, PrecoOferta, Destaque, DataOferta, HoraOferta, Categoria, genero, Tipo, Descricao e Img1…ImgN. ID é opcional; sem ele é gerado pelo nome. Para preservar referências e carrinhos ao renomear produtos, preencha IDs únicos e estáveis. Ativo=N oculta o produto. Datas de oferta devem ser DD/MM/AAAA, e horas HH ou HH:MM; o fuso usado é Brasília (UTC−03). Oferta só aparece com preço positivo menor que o preço normal e dentro da validade, quando informada.

A planilha deve continuar pública para leitura. Dados entram como texto, nunca como HTML executável. URLs de imagens aceitam apenas HTTP/HTTPS.

## Recursos

- Layout responsivo com categorias, busca, filtro por tipo/gênero/preço e ordenação.
- Galeria de detalhes com links compartilháveis ?produto=ID.
- Carrinho local com quantidades, observações por item e subtotal.
- Formulário de entrega, consulta ViaCEP e composição do pedido para WhatsApp.
- Estoque, frete, pagamento e disponibilidade são confirmados pela loja, sem cobrança no site.
- Carrinho permanece salvo após abrir o WhatsApp; o site não pode verificar se a mensagem foi enviada.
- Cache da última consulta como apoio em falhas de rede. O site avisa e desativa compra quando não consegue obter catálogo atual.
- Nenhum endereço ou dado de checkout é persistido. Produtos do carrinho e a última consulta são salvos neste navegador.

## Personalização

Cores e estilos em styles.css; conteúdo e seções em index.html; planilha e contato em config.js; lógica em app.js. Fonte remota opcional: Manrope e DM Sans, com fallback para Arial. Fotos vêm diretamente da planilha original.

## Origem

Catálogo e contato: https://github.com/Vinicius-Ferrarini/Vendas_Relogio
Referência de organização comercial: https://www.carlinbilhares.com.br/
Interface nova, sem copiar imagens ou identidade visual da referência.

## Verificação realizada

Catálogo real com 37 produtos carregado via HTTP e abertura direta do index.html. Layout verificado em 320, 375, 390, 430, 768, 1024, 1440 e 1920 pixels. Testados busca, filtros, galeria, quantidades, persistência, subtotal, consulta de CEP, texto do WhatsApp, produtos inativos, ofertas e falha de rede. Nenhuma mensagem de teste foi enviada.

## Atualização de interface

Logo original do repositório em assets/logo.png. Cada produto possui Adicionar carrinho e Chamar no WhatsApp, com o nome do item na mensagem. A busca oferece até seis sugestões com imagem e preço, seleção com setas e Enter, fechamento com Escape e acesso a todos os resultados.
