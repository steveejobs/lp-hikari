# Matriz de impacto

Criada antes da implementação, conforme a skill `web-experience-quality-control`. Deve ser atualizada quando a estrutura real divergir da previsão.

| Arquivo / domínio | Componentes | Rotas afetadas | Requisitos afetados | Testes obrigatórios |
|---|---|---|---|---|
| `app/layout.tsx`, `manifest.ts`, `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, ícone | RootLayout, JSON-LD e endpoints técnicos | `/`, `/instagram` | RQ-002–003, 007–010, 026–027, 036, 043–044 | HTML, headings, metadata, favicon, sitemap, sem JS |
| `app/page.tsx` | narrativa principal | `/` | RQ-003, 005–008, 011–017, 025–027, 042 | mobile/desktop, copy, links, DOM |
| `app/instagram/page.tsx` | microexperiência social | `/instagram` | RQ-004–008, 023–025, 027–029, 041, 045 | 390x844, primeira dobra, touch, safe area |
| `components/optical-hero.tsx` | OpticalHero | `/` | RQ-011–013, 022, 026, 031–032 | screenshot, gravação, reduced motion, sem JS |
| `components/series-carousel.tsx` | SeriesCarousel | `/` | RQ-014–015, 020–022, 028–030 | swipe, drag, teclado, autoplay 30 s, visibilidade |
| `components/controlled-video.tsx` | ControlledVideo, MediaCoordinator | `/` | RQ-016–019, 022, 037–038, 050 | viewport, aba oculta, saveData, reduced motion |
| `components/instagram-focus.tsx` | InstagramFocus | `/instagram` | RQ-004, 022–024, 028–030, 046 | touch, teclado, reduced motion, primeira dobra |
| `lib/business.ts`, `lib/galleries.ts` | dados estáticos | `/`, `/instagram` | RQ-005–008, 014–015, 033, 045, 051 | auditoria factual, hrefs, ordem |
| `app/globals.css`, `app/home.module.css`, `app/instagram/instagram.module.css` | tokens, composição e responsividade | `/`, `/instagram` | RQ-010–012, 022–023, 028–030, 041, 046, 052 | todos os viewports, foco, contraste, overflow |
| `public/brand`, `public/gallery`, `public/video` | mídia pública | `/`, `/instagram` | RQ-009–010, 014–019, 030, 036–040, 047, 050–051 | dimensões, network, 404, posters, bundle |
| `tests/` e configuração | smoke, a11y estrutural, responsividade | `/`, `/instagram` | todos os P0 observáveis | build, lint, typecheck, Playwright |

## Rodada de refinamento visual e interativo — 13/07/2026

Matriz registrada antes das alterações desta rodada. Os requisitos RQ-053–RQ-064 foram adicionados ao ledger com estado `em implementação`; nenhum requisito novo será promovido a `aprovado` sem evidência reproduzível.

| Arquivo / domínio | Componentes | Rotas afetadas | Requisitos afetados | Risco / preservação | Evidência obrigatória |
|---|---|---|---|---|---|
| `app/page.tsx`, `app/home.module.css` | narrativa, díptico, vídeo, série editorial, localização | `/` | RQ-003, 005–008, 011–017, 026–030, 042, 053, 056–059, 063–064 | preservar H1, proposta, copy principal, ordem e separação das séries; remover somente metadados de produção visíveis | capturas de todos os viewports, auditoria textual e DOM sem JS |
| `components/optical-hero.tsx`, `app/globals.css` | OpticalHero, entrada do hero, botões e header | `/` | RQ-009–013, 022, 026, 028–032, 039, 054–057, 060–064 | manter imagem LCP, recorte do rosto, CTA e identidade; trajetória deve ficar contida e não depender do cursor | gravação de ciclo completo, amostragem da trajetória, pausa offscreen/aba, reduced motion e capturas mobile/desktop |
| `components/motion-controller.tsx` (novo), tokens globais | coordenador único de entradas por viewport | `/`, `/instagram` | RQ-022, 026, 041, 046, 049, 055–057, 060–064 | conteúdo visível por padrão e sem JS; entradas executadas uma vez; sem biblioteca nova | teste sem JS, reduced motion, saveData, IntersectionObserver e inspeção de bundle |
| `components/series-carousel.*`, `components/focus-gallery.*`, `components/instagram-focus.*` | galerias horizontal, de foco e social | `/`, `/instagram` | RQ-014–015, 020–025, 028–030, 040, 046–047, 053, 056, 060–064 | preservar swipe, drag, teclado, autoplay e ordem interna; trocar números visuais por progresso/miniaturas sem remover informação acessível | testes de teclado/mouse/touch, autoplay e capturas de estados ativo/inativo |
| `components/controlled-video.*` | vídeos coordenados | `/` | RQ-016–019, 022, 037–038, 050, 053, 056, 060–064 | preservar escala secundária, poster, single-active, saveData e pausas | testes de viewport/aba/saveData/reduced motion e captura dos dois formatos |
| localização em `app/page.tsx` e `app/home.module.css` | mapa Google incorporado e CTAs | `/` | RQ-006–008, 026, 028–030, 042, 047, 058–064 | endereço, coordenadas e link oficial imutáveis; iframe lazy, legível e sem camada sobre os controles | screenshot com mapa carregado, pan/zoom, marcador, link de fallback e CTA de rota |
| `app/instagram/page.tsx`, `app/instagram/instagram.module.css` | rota social compacta | `/instagram` | RQ-004–008, 022–025, 027–030, 041, 045–046, 053, 056–057, 059–064 | não inserir iframe; preservar CTA de WhatsApp na primeira dobra, rota e comprimento compacto | cinco viewports mobile, touch, safe areas, primeira dobra e full page |
| `tests/smoke.spec.ts`, `.qa/refinement-2026-07-13/` | regressão e evidências da rodada | `/`, `/instagram` | RQ-001–064 observáveis | não alterar contratos internos de séries; artefatos continuam fora do build | lint, typecheck, testes, build, screenshots, gravações e relatórios JSON |

### Guardrails confirmados antes da implementação

- Nenhuma dependência nova: Next, React, CSS, `IntersectionObserver` e `requestAnimationFrame` restrito à lente cobrem o escopo.
- Compartilhado entre as rotas: `RootLayout`, tokens globais, identidade, ícones, dados de negócio, arrays de galeria e o coordenador de entradas planejado. A home preserva `SiteHeader`/`SiteFooter`; `/instagram` mantém composição própria e curta.
- A remoção de números será somente visual. `id`, `data-series`, `data-series-item`, ordem dos arrays, `aria-label` e anúncios para leitor de tela permanecem.
- O mapa interativo entra somente em `/`; `/instagram` conserva o link de rota para não adicionar custo de terceiro à experiência social.
- A captura publicada anterior à mudança está em `.qa/refinement-2026-07-13/before/`.

### Resultado verificado da rodada

- A arquitetura e a direção de arte foram preservadas. Não houve mudança de dependências, H1, proposta de valor, endereço, WhatsApp, ordem das séries, tipografia principal ou paleta central.
- `OpticalHero` passou a usar uma curva fechada Catmull–Rom, com 15,6 s no desktop e 17,4 s no mobile, refração dentro da máscara e influência mínima apenas para mouse preciso. A animação pausa fora da viewport e em aba oculta; `reduced motion` fixa a lente nos óculos e `saveData` reduz o tratamento óptico.
- `MotionController` coordena entradas únicas por `IntersectionObserver`, com conteúdo final visível sem JavaScript. Os tokens centrais alimentam `focus-reveal`, `line-reveal`, `horizontal-flow`, `optical-mask`, `diptych`, `editorial`, `soft-settle` e `map`.
- Metadados de produção e números decorativos saíram da interface; IDs, `data-series`, ordem dos arrays, alt texts, anúncios ao leitor de tela e controles por teclado foram mantidos.
- A home alterna pretos quentes, carvão, marfim, gradientes ópticos, curvas e recortes assimétricos. `/instagram` mantém três blocos compactos e não instancia iframe.
- A localização usa Google Maps Embed nas coordenadas `-7.1922897,-48.2094709`, com lazy loading, marcador, pan, zoom, título acessível e fallback oficial. A captura direta do frame foi usada porque o screenshot full-page headless não compõe visualmente OOPIF cross-origin.
- Durante o QA, três causas reais foram corrigidas: alvos reduzidos pela escala de entrada, 1 px de overflow gerado por mídia rotacionada e `clip-path` de entrada interferindo no hit-test do swipe. A cortina visual final usa `pointer-events: none`.

| Gate / evidência | Resultado |
|---|---|
| Lint | aprovado — `npm run lint` |
| TypeScript | aprovado — `npm run typecheck` |
| Build de produção | aprovado — rotas e endpoints técnicos pré-renderizados, sem dependência nova |
| Suíte funcional | 34/34 Playwright; touch repetido 5/5; ciclo da lente repetido 3/3 |
| Matriz visual | 18/18: duas rotas × 360×800, 375×812, 390×844, 412×915, 430×932, 768×1024, 1366×768, 1440×900 e 1920×900 |
| Lente | `.qa/refinement-2026-07-13/after/lens-cycle-1440x900.webm` e `lens-trajectory.json`; amplitude 33,797 × 24,418, retorno 0,761, um ciclo completo |
| Mapa | `.qa/refinement-2026-07-13/after/map-interactive-1440.png`; 45 imagens carregadas, marcador visível, zoom e pan aprovados |
| Resumo reproduzível | `.qa/refinement-2026-07-13/qa-summary.json`, testes em `tests/refinement.spec.ts` e `tests/visual-evidence.spec.ts` |

O preview foi criado em `https://lp-hikari-lezoufwsr-bandeirargabriel-6963s-projects.vercel.app`; `/` e `/instagram` respondem 200, mas a política do projeto exige login Vercel. A aprovação externa continua separada do deploy de produção, e nenhum deploy de produção foi executado nesta rodada.

## Correção controlada de H1 e rota social — 13/07/2026

Matriz registrada antes das alterações. RQ-065–RQ-070 permanecem em `em implementação` até existirem testes e evidências reproduzíveis.

| Arquivo / domínio | Componentes | Rotas | Requisitos | Limite da mudança | Evidência obrigatória |
|---|---|---|---|---|---|
| `app/page.tsx`, `app/globals.css` | `AnimatedTitleLine`, H1 do hero | `/` | RQ-026–027, 055–056, 065–066, 070 | corrigir a separação estrutural entre palavras sem trocar texto, tipografia, composição, lente ou sequência do hero | DOM e accessible name, JS desativado, reduced motion, zoom 200%, fontes e oito viewports |
| `components/instagram-focus.tsx`, `components/instagram-focus.module.css` | galeria social | `/instagram` | RQ-014–015, 020–024, 028–030, 040, 046, 060–063, 067, 070 | manter a série e sua ordem; adicionar somente movimento automático, preview adjacente, interação e progresso sem números | autoplay, swipe, drag, pausa/retomada, offscreen, aba oculta, reduced motion, lazy loading e loop |
| `app/instagram/page.tsx`, `app/instagram/instagram.module.css` | escolhas de produto, vídeo editorial e ritmo da rota | `/instagram` | RQ-004–008, 016–019, 023–025, 037–041, 045, 059–060, 068–070 | preservar WhatsApp e rota na primeira dobra, endereço, identidade e experiência compacta; não inserir claims nem mapa | cinco mobiles, tablet e desktops; CTAs contextuais; poster/vídeo; comprimento e overflow |
| `components/controlled-video.tsx`, `components/controlled-video.module.css` | lifecycle do vídeo compartilhado | `/`, `/instagram` | RQ-018–019, 022, 037–038, 049–050, 060, 069–070 | acrescentar configuração de preload e estado de reprodução sem regredir os dois vídeos da home | single-active, metadata, poster, viewport, aba oculta, reduced motion, saveData e fallback |
| `lib/business.ts` | gerador de URL do WhatsApp | `/instagram` | RQ-005, 007–008, 045, 068 | aceitar mensagem contextual explícita preservando todas as URLs existentes | decodificação dos dois hrefs e teste factual |
| `public/video/selection.mp4`, `public/video/selection-poster.jpg` | mídia existente, sem novo download | `/instagram` | RQ-016, 030, 037–040, 069 | reutilizar o vídeo editorial 720×1280; não ampliar o fragmento 360×480 nem adicionar outra mídia | dimensões/codec, requests de rede e captura do poster/em reprodução |
| `tests/`, `.qa/correction-2026-07-13/` | regressão e evidências | Todas | RQ-001–070 observáveis | nenhuma aprovação sem prova; artefatos continuam fora do build | lint, tipos, testes, build, screenshots, gravações e relatório JSON |

### Guardrails antes da implementação

- Nenhuma biblioteca nova é necessária: React, CSS, `IntersectionObserver`, scroll snap e os componentes existentes cobrem o escopo.
- O utilitário tipográfico afetado existe apenas no H1 da home; os demais títulos usam revelações por linha/bloco e serão verificados por regressão, não reconstruídos.
- `InstagramFocus` é exclusivo de `/instagram`; `ControlledVideo` e `getWhatsAppUrl` são compartilhados e exigem defaults retrocompatíveis.
- `selection.mp4` foi escolhido preliminarmente por ser o arquivo editorial vertical confirmado de maior resolução (720×1280, 8,8 s, sem áudio), com poster correspondente. `fragment.mp4` permanece secundário na home.
- Não serão alterados mapa, endereço, estacionamento, FAQ, footer, SEO principal, lente, séries, paleta ou arquitetura geral da home.

### Resultado verificado

- A causa do H1 era whitespace final dentro de `.hero-word`: por estar no fim do `inline-block`, ele colapsava sem largura. O separador passou para fora do wrapper e a linha usa `flex` com gap somente entre palavras; os 24 caracteres continuam animados dentro de seis palavras indivisíveis.
- A segunda linha recebeu escala responsiva própria em telas estreitas para manter `de um novo olhar.` integralmente na mesma linha. `aria-label`, texto real, pontuação, no-JS e reduced motion foram validados.
- `InstagramFocus` agora usa as seis imagens da série 04 na ordem original, próxima imagem aparente, scroll snap, autoplay de 5,6 s, pausa de 6,5 s após interação, lifecycle de viewport/aba, reduced motion/saveData e um único clone da primeira imagem. O retorno medido do loop ficou em 4 px, sem troca visual perceptível.
- Receituário e solar aparecem como duas faixas editoriais equivalentes, sem fotografia rotulada como grau e sem claims novos. Cada CTA gera uma mensagem factual própria no WhatsApp.
- `selection.mp4` (720×1280, 8,8 s, sem áudio) entrou depois das escolhas e antes da localização, com poster, `muted`, `playsInline`, `loop`, preload metadata após hidratação, autoplay somente visível, pausa fora da tela/aba e poster em reduced motion/saveData.
- `ControlledVideo` manteve defaults retrocompatíveis para os dois vídeos da home. Nenhuma dependência ou arquivo de mídia foi adicionado; mapa, endereço, estacionamento, FAQ, footer, SEO, lente, séries, paleta e estrutura da home ficaram preservados.

| Gate / evidência | Resultado |
|---|---|
| Lint | aprovado — `npm run lint` |
| TypeScript | aprovado — `npm run typecheck` |
| Build | aprovado — `npm run build`, nove páginas/endpoints estáticos |
| Testes | aprovado — 79/79 Playwright em 7,6 min |
| Matriz visual | 16 capturas novas: duas rotas × oito viewports em `.qa/correction-2026-07-13/after/`; matriz legada incluiu ultrawide |
| Galeria | `gallery-autoplay-390x844.webm`; autoplay, interação, retomada, offscreen, aba e reduced motion testados |
| Vídeo | `video-playing-390x844.png`; metadata, poster, reprodução, offscreen, reduced motion e saveData testados |

Preview criado em `https://lp-hikari-pjq1npt2r-bandeirargabriel-6963s-projects.vercel.app`. O build remoto também passou; `/` e `/instagram` estão atrás do login Vercel definido pelo projeto. Nenhuma promoção para produção foi executada.

## Resultado final do impacto da entrega anterior

- A arquitetura prevista foi mantida; WebGL e bibliotecas de animação/carrossel não entraram.
- Os maiores ajustes após medição foram: paths públicos no lugar de blur data serializado, token dourado de alto contraste para fundos claros, favicon 192 × 192, sans de sistema no caminho crítico e bloqueio do drag nativo das fotografias.
- A mídia bruta duplicada e as marcas não confirmadas foram removidas depois do checkpoint, sem perda dos arquivos de produção.
- Evidência: build estático, 28 testes Playwright, relatórios Lighthouse e 33 capturas/gravação em `.qa/`, tudo excluído da Vercel.
