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

## Resultado final do impacto da entrega anterior

- A arquitetura prevista foi mantida; WebGL e bibliotecas de animação/carrossel não entraram.
- Os maiores ajustes após medição foram: paths públicos no lugar de blur data serializado, token dourado de alto contraste para fundos claros, favicon 192 × 192, sans de sistema no caminho crítico e bloqueio do drag nativo das fotografias.
- A mídia bruta duplicada e as marcas não confirmadas foram removidas depois do checkpoint, sem perda dos arquivos de produção.
- Evidência: build estático, 28 testes Playwright, relatórios Lighthouse e 33 capturas/gravação em `.qa/`, tudo excluído da Vercel.
