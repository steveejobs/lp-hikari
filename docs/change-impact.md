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

## Resultado final do impacto

- A arquitetura prevista foi mantida; WebGL e bibliotecas de animação/carrossel não entraram.
- Os maiores ajustes após medição foram: paths públicos no lugar de blur data serializado, token dourado de alto contraste para fundos claros, favicon 192 × 192, sans de sistema no caminho crítico e bloqueio do drag nativo das fotografias.
- A mídia bruta duplicada e as marcas não confirmadas foram removidas depois do checkpoint, sem perda dos arquivos de produção.
- Evidência: build estático, 28 testes Playwright, relatórios Lighthouse e 33 capturas/gravação em `.qa/`, tudo excluído da Vercel.
