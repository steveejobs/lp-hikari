Ótica Moderna — página principal

Funciona bem como arquitetura local: H1 direto, cidade, produtos, CTAs de Instagram e rota, seleção guiada, galerias, marcas, conteúdo e localização.

Aproveitar: clareza de intenção, contexto local, rotas de conversão e organização por necessidades.

Evitar: copiar a sequência inteira, repetir prova social e transformar a página numa sucessão previsível de seções. O conteúdo de avaliações aparece duplicado diversas vezes no documento.

Ótica Moderna — /instagram

A primeira dobra concentra identidade, descrição curta, mídia e quatro caminhos principais. Isso serve como referência funcional para uma rota social.

Aproveitar: hierarquia rápida e presença de rota/site completo.

Evitar: campanhas e depoimentos demais. A Hikari precisa ser mais curta, mais tátil e mais orientada a WhatsApp.

SOS Ótica — página principal

Tem uma arquitetura de conversão forte: promessa explícita, prova rápida, escolha guiada, coleções, processo, loja, produtos, avaliações, localização e perguntas frequentes.

Aproveitar: clareza operacional, galerias por coleção e CTAs contextuais.

Evitar: volume excessivo. A página acumula muitas frentes e repete avaliações extensivamente, o que dilui a hierarquia.

SOS Ótica — /instagram

A rota entrega rapidamente WhatsApp, rota, coleções, site completo e prova social.

Aproveitar: conversão imediata e mini vitrine.

Evitar: o bloco de depoimentos domina quase todo o documento e torna a página de bio longa demais.

Referência visual enviada

Elementos fortes:

Retrato como protagonista.
Composição assimétrica.
Interfaces móveis sobrepostas à fotografia.
Profundidade por escala, recorte e sombra.
Tipografia editorial.
Fundo claro com estrutura gráfica quase invisível.
Luz cromática aplicada ao sujeito, não como decoração solta.

Adaptação Hikari:

Vermelho substituído por dourado extraído da logo.
Preto profundo e marfim como base.
Interfaces flutuantes substituídas por “lentes” ou planos ópticos.
O brilho nasce do símbolo 光.
Transições simulam foco, refração e abertura de lente.
Fotografias mantêm protagonismo; a interface não vira painel futurista genérico.

Proibido:

Copiar a composição.
Microtextos ilegíveis usados apenas como textura.
Glow dourado exagerado.
Estética japonesa estereotipada.
Three.js pesado para criar uma esfera ou óculos aleatórios.
Cards flutuantes sem função.

As referências devem definir acabamento e comportamento, não fornecer layout para cópia.

Direção visual proposta
Sistema cromático
Preto: profundidade, contraste e estrutura.
Dourado da marca: luz, foco e assinatura.
Marfim/off-white: respiro editorial.
Tons de pele e imagens: parte ativa da paleta.

Os valores hexadecimais serão extraídos dos arquivos originais da logo. Não serão estimados pela miniatura.

Motion proprietário
Bloom de luz: o símbolo inicia concentrado e revela a composição.
Foco pela lente: áreas da imagem mudam de nitidez ao atravessar uma superfície óptica.
Refração controlada: deslocamento mínimo de cor e conteúdo nas bordas da lente.
Profundidade responsiva: movimento suave por pointer no desktop e por scroll no mobile.
Transição entre séries: cada coleção floresce como um novo campo visual, sem misturar os ensaios.
Fallback: imagem estática plenamente compreensível em reduced motion ou aparelhos fracos.

3D será aprovado apenas depois de uma prova do hero em mobile e desktop. A própria skill determina que WebGL só entra quando sustenta a tese, funciona no mobile e justifica seu custo

## Verificação visual e funcional — 13/07/2026

As quatro URLs responderam com HTTP 200 e foram capturadas em viewport apropriado. Evidência temporária local: `%TEMP%/hikari-audit/ref-*.png`.

### Ótica Moderna

- A home usa hero bipartido, tipografia sans pesada, duas imagens em molduras sobrepostas e CTAs para Instagram/rota. É clara, mas a composição mobile corta conteúdo horizontal e a promessa depende de fatos que não pertencem à Hikari.
- A rota `/instagram` concentra logo, handle, chips factuais, trilho visual e uma pilha de links. A conversão é rápida, porém a estrutura se aproxima de uma bio page convencional e o WhatsApp não domina a primeira dobra capturada.
- Decisão Hikari: manter a leitura rápida, mas trocar a lógica de molduras/cards por uma lente editorial contínua, dar prioridade real ao WhatsApp e não usar chips de claims.

### SOS Ótica

- A home usa um óculos recortado como objeto central e texto desfocado atravessando as lentes. A ligação formal com visão é forte, mas a peça ocupa quase toda a dobra e o mobile mostra recortes agressivos.
- A rota `/instagram` coloca WhatsApp e rota cedo, com boa área de toque. O conjunto, porém, se alonga em muitos botões e claims específicos.
- Decisão Hikari: aproveitar a fricção baixa dos CTAs sem usar objeto 3D/recorte de óculos, prova social ou uma lista extensa de ações.

### Diferenciação implementável

- O hero Hikari nasce do símbolo `光` e de uma máscara de lente sobre fotografia real da loja.
- A refração será um deslocamento discreto da própria imagem, não blur de texto, esfera 3D ou glow decorativo.
- A home terá ritmo editorial por ensaios; `/instagram` será uma ação compacta com pilha focal própria.
- WebGL foi descartado após a auditoria: máscara CSS, `clip-path` e transforms entregam a tese com menor custo e fallback nativo.
