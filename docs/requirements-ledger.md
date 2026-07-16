ID	Requisito	Rota	Dispositivo	Pri.	Status	Evidência	Commit
RQ-001	Projeto deve possuir exatamente as rotas / e /instagram	Todas	Todos	P0	aprovado	Build estático + 16 testes rota/viewport	entrega final
RQ-002	Estrutura deve estar pronta para preview e deploy na Vercel	Todas	Todos	P0	aprovado	`npm run build`; `.vercelignore`; URLs por ambiente	entrega final
RQ-003	/ deve atender intenção de busca local no Google	/	Todos	P0	aprovado	HTML local, metadata, JSON-LD e Lighthouse SEO 100	entrega final
RQ-004	/instagram deve ser projetada primeiro em 390×844	/instagram	Mobile	P0	aprovado	`.qa/final/instagram-390x844.png`	entrega final
RQ-005	CTA principal deve abrir WhatsApp com mensagem contextual	Todas	Todos	P0	aprovado	Teste `metadata, dados locais e links são factuais`	entrega final
RQ-006	CTA secundário deve abrir a rota correta no Maps	Todas	Todos	P0	aprovado	Teste dos hrefs oficiais do Maps	entrega final
RQ-007	Nome, endereço, telefone e produtos devem seguir a fonte da verdade	Todas	Todos	P0	aprovado	`lib/business.ts` + teste factual	entrega final
RQ-008	Nenhum claim não confirmado pode ser publicado	Todas	Todos	P0	aprovado	Auditoria de copy + busca por marcas/claims	entrega final
RQ-009	Logo completa, símbolo e favicon devem manter proporção e contraste	Todas	Todos	P0	aprovado	Capturas finais + `/icon.png` 192×192	checkpoint hero + final
RQ-010	Paleta deve partir dos arquivos originais da marca	Todas	Todos	P0	aprovado	`docs/assets-manifest.md`, tokens e capturas	checkpoint hero
RQ-011	Identidade deve traduzir luz, foco, refração e florescimento	Todas	Todos	P0	aprovado	Capturas finais + gravações da lente e abertura	checkpoint hero
RQ-012	Hero não pode parecer template de ótica ou moda	/	Todos	P0	aguarda revisão humana	Prova visual final pronta; avaliação externa ainda necessária	—
RQ-013	Primeiro checkpoint deve conter apenas hero e motion principal	/	Todos	P0	aprovado	Commit `672c763` + `.qa/proof/`	checkpoint hero
RQ-014	Séries 1, 2, 3 e 4 devem permanecer separadas e ordenadas	Todas	Todos	P0	aprovado	Teste `as séries permanecem separadas e ordenadas`	entrega final
RQ-015	Imagens não podem ser misturadas aleatoriamente entre séries	Todas	Todos	P0	aprovado	Manifesto + DOM ordenado + capturas de cada série	entrega final
RQ-016	Vídeo de baixa qualidade nunca pode ocupar hero ou full-bleed	Todas	Todos	P0	aprovado	`.qa/final/motion-390x844.png` e desktop	entrega final
RQ-017	Vídeo ruim deve aparecer como mídia secundária pequena	Todas	Todos	P1	aprovado	Capturas da seção de movimento	entrega final
RQ-018	Somente um vídeo pode estar ativo por vez	Todas	Todos	P0	aprovado	Teste `um vídeo por vez...`	entrega final
RQ-019	Vídeos devem pausar fora da viewport e em aba oculta	Todas	Todos	P0	aprovado	Teste explícito de offscreen + visibilitychange	entrega final
RQ-020	Galerias devem aceitar swipe, drag e teclado	Todas	Todos	P1	aprovado	Testes de teclado, mouse-drag e touch real	entrega final
RQ-021	Autoplay deve pausar durante interação e retomar depois	Todas	Todos	P1	aprovado	Teste temporizado + `.qa/final/carousel-interaction-30s.webm`	entrega final
RQ-022	Reduced motion deve remover loops e oferecer estado estático	Todas	Todos	P0	aprovado	Teste em contexto `reducedMotion: reduce`	entrega final
RQ-023	/instagram deve mostrar WhatsApp na primeira dobra	/instagram	Mobile	P0	aprovado	Bounding box em cinco viewports mobile + capturas	entrega final
RQ-024	/instagram não pode ser uma home completa empilhada	/instagram	Mobile	P0	aprovado	DOM compacto próprio + full screenshot	entrega final
RQ-025	/ e /instagram não devem duplicar toda a mesma narrativa	Todas	Todos	P1	aprovado	Comparação de DOM e capturas das rotas	entrega final
RQ-026	Conteúdo essencial deve existir em HTML sem depender de animação	/	Todos	P0	aprovado	Teste com JavaScript desabilitado	entrega final
RQ-027	Deve existir um único H1 por rota	Todas	Todos	P0	aprovado	16 auditorias DOM rota/viewport	entrega final
RQ-028	Controles devem possuir foco visível e áreas de toque adequadas	Todas	Todos	P0	aprovado	Auditoria de targets ≥44 px + navegação por teclado	entrega final
RQ-029	Não pode existir overflow horizontal nos viewports obrigatórios	Todas	Mobile	P0	aprovado	`capture-report.json` sem inválidos + 16 testes	entrega final
RQ-030	Mídia deve reservar proporção e evitar mudança de layout	Todas	Todos	P0	aprovado	CLS 0 + testes de conexão lenta e falha de imagem	entrega final
RQ-031	3D não pode bloquear CTA, leitura ou carregamento inicial	Todas	Todos	P0	aprovado	WebGL/3D rejeitado; CTA disponível no HTML	entrega final
RQ-032	Deve existir fallback sem WebGL	Todas	Todos	P0	aprovado	Implementação integral em CSS/HTML + teste sem JS	entrega final
RQ-033	Marcas comerciais só entram após confirmação explícita	Todas	Todos	P0	aprovado	Zero referências comerciais em app/lib/public	entrega final
RQ-034	Referências não podem ter layout, copy ou identidade copiados	Todas	Todos	P0	aprovado	`reference-analysis.md` + comparação visual final	entrega final
RQ-035	Preview deve ser aprovado antes de qualquer deploy de produção	Todas	Todos	P0	pendente externo	Preview protegido criado em `https://lp-hikari-lezoufwsr-bandeirargabriel-6963s-projects.vercel.app`; aguarda aprovação humana	—
RQ-036	Screenshots, gravações e relatórios não podem entrar no build	Todas	Todos	P1	aprovado	`.vercelignore`; busca no `.next` retornou zero artefatos	entrega final
RQ-037	Vídeos devem ser muted, playsInline, loop e possuir poster	Todas	Todos	P0	aprovado	Asserções DOM/browser nos dois vídeos	entrega final
RQ-038	Vídeos devem respeitar saveData e usar poster sem autoplay	Todas	Mobile	P0	aprovado	Teste `saveData` sem requests MP4	entrega final
RQ-039	Somente mídia realmente crítica pode usar priority	Todas	Todos	P0	aprovado	Somente retrato LCP de cada rota usa preload/fetchPriority	entrega final
RQ-040	Imagens abaixo da dobra devem usar lazy loading e sizes coerente	Todas	Todos	P0	aprovado	Auditoria DOM/network + `sizes` em todas as imagens responsivas	entrega final
RQ-041	Safe areas, svh e dvh devem ser tratados na rota social	/instagram	Mobile	P0	aprovado	CSS com `env(safe-area-inset-*)`/`svh` + capturas	entrega final
RQ-042	Endereço e estacionamento devem existir em texto real	/	Todos	P0	aprovado	Teste sem JavaScript + DOM	entrega final
RQ-043	Metadata, Open Graph, favicon, canonical e JSON-LD devem ser factuais	/	Todos	P0	aprovado	Teste de metadata + Lighthouse SEO 100	entrega final
RQ-044	Nenhum domínio comercial pode ser inventado para metadata	Todas	Todos	P0	aprovado	`lib/site-url.ts` usa somente env Vercel/configurada	entrega final
RQ-045	Links de WhatsApp devem preservar contexto de origem com mensagem distinta	Todas	Todos	P1	aprovado	Teste de mensagem e UTM por rota	entrega final
RQ-046	Conteúdo importante não pode depender de hover	Todas	Touch	P0	aprovado	Teste touch real em 390×844	entrega final
RQ-047	Mídia ausente deve manter layout estável e alternativa legível	Todas	Todos	P1	aprovado	Teste abortando `/_next/image`	entrega final
RQ-048	A página deve permanecer compreensível com JavaScript desabilitado	Todas	Todos	P0	aprovado	Teste das duas rotas com JS desabilitado	entrega final
RQ-049	O JavaScript inicial deve permanecer restrito a ilhas interativas	Todas	Todos	P1	aprovado	Server Components + Lighthouse resource summary	entrega final
RQ-050	O vídeo ruim deve ser fisicamente reduzido, não apenas limitado por CSS	/	Todos	P1	aprovado	360×480, H.264, 0,916 MB confirmado por ffmpeg	entrega final
RQ-051	Logos comerciais não confirmadas não podem entrar no conteúdo nem no bundle público	Todas	Todos	P0	aprovado	Busca zero + brutos removidos após checkpoint	entrega final
RQ-052	Os viewports 768x1024, 1366x768 e 1440x900 também devem ser validados	Todas	Todos	P0	aprovado	6 testes rota/viewport + capturas correspondentes	entrega final

RQ-053	Metadados de produção, rótulos técnicos e numeração decorativa devem sair da interface pública sem alterar IDs e ordem interna	Todas	Todos	P0	aprovado	Teste textual/DOM + 18 capturas em `.qa/refinement-2026-07-13/after/`	refinamento 13/07/2026
RQ-054	O hero deve manter o retrato integral e usar motion de traços de luz somente ao redor da imagem, sem lente, refração ou sobreposição no rosto	/	Todos	P0	aprovado	Capturas antes/depois; teste de imagem única, `object-fit: contain` e trajetórias externas	correção 16/07/2026
RQ-055	A home deve ter entrada curta, não bloqueante e clicável, concluída em até 1,8 s	/	Todos	P0	aprovado	Teste de timing ≤1.800 ms e CTA ≥44 px; gravação inicia na navegação	refinamento 13/07/2026
RQ-056	As entradas devem usar famílias coerentes e variadas, controladas por tokens centrais e viewport	Todas	Todos	P1	aprovado	Oito famílias auditadas + tokens centrais + 18 capturas	refinamento 13/07/2026
RQ-057	O refinamento deve reduzir rigidez e preto uniforme sem trocar paleta, tipografia ou direção editorial	Todas	Todos	P0	aprovado	Comparação `before/` × `after/` em mobile, desktop e ultrawide	refinamento 13/07/2026
RQ-058	A localização da home deve usar mapa real, interativo, lazy, acessível e centralizado nas coordenadas confirmadas	/	Todos	P0	aprovado	`map-interactive-1440.png`; frame com 45 imagens; zoom/pan e coordenadas testados	refinamento 13/07/2026
RQ-059	A rota /instagram deve continuar compacta e não carregar automaticamente o iframe do mapa	/instagram	Mobile	P0	aprovado	Teste com zero iframe + cinco capturas mobile e CTA de rota visível	refinamento 13/07/2026
RQ-060	Os traços de luz e as entradas devem simplificar em reduced motion; vídeos e galerias mantêm proteções de viewport, aba oculta, saveData e touch	Todas	Todos	P0	aprovado	Teste de reduced motion nos traços e testes de lifecycle dos componentes interativos	correção 16/07/2026
RQ-061	Mapa e microinterações devem preservar teclado, foco visível, touch, hover e áreas mínimas de toque	Todas	Todos	P0	aprovado	34/34 testes; swipe 5/5; targets ≥44 px; mapa zoom/pan	refinamento 13/07/2026
RQ-062	A rodada não pode adicionar dependências nem ampliar JavaScript inicial além de ilhas pequenas e justificadas	Todas	Todos	P1	aprovado	Diff zero em package/lock; build estático; MotionController e lente como ilhas locais	refinamento 13/07/2026
RQ-063	Todos os oito viewports obrigatórios e um ultrawide devem permanecer sem overflow horizontal ou recortes incorretos	Todas	Todos	P0	aprovado	18/18 testes/capturas, duas rotas × nove viewports, sem overflow	refinamento 13/07/2026
RQ-064	A rodada deve preservar todos os requisitos anteriormente aprovados e não fazer deploy de produção antes do preview	Todas	Todos	P0	aprovado	34/34 funcionais, lint/tipos/build, preview Vercel criado e nenhum deploy de produção	refinamento 13/07/2026

RQ-065	O H1 da home deve preservar espaços naturais, duas linhas editoriais, palavras indivisíveis e uma única frase acessível	/	Todos	P0	aprovado	Teste estrutural/sem JS/reduced em `correction-round.spec.ts`; oito capturas home	correção controlada 13/07/2026
RQ-066	A animação tipográfica deve operar dentro de palavras, sem animar espaços nem alterar o espaçamento final	/	Todos	P0	aprovado	24 caracteres dentro de 6 palavras; gaps naturais e baselines medidos em mobile/desktop	correção controlada 13/07/2026
RQ-067	A galeria de /instagram deve ter movimento automático visível, swipe, drag, pausa, retomada e loop sem salto visual	/instagram	Todos	P0	aprovado	Testes de autoplay/lifecycle/touch; `gallery-autoplay-390x844.webm`; retorno do loop com 4 px	correção controlada 13/07/2026
RQ-068	/instagram deve apresentar óculos receituários e solares com igual clareza e WhatsApp contextual factual	/instagram	Todos	P0	aprovado	Teste dos dois textos/hrefs e oito capturas em `.qa/correction-2026-07-13/after/`	correção controlada 13/07/2026
RQ-069	/instagram deve incluir um único vídeo editorial com poster, lifecycle por viewport/aba e proteção para reduced motion e saveData	/instagram	Todos	P0	aprovado	Testes de DOM/network/viewport; `video-playing-390x844.png`; poster estático em modos leves	correção controlada 13/07/2026
RQ-070	A correção deve preservar a home, manter /instagram compacta, não adicionar dependências e passar lint, tipos, testes e build	Todas	Todos	P0	aprovado	79/79 Playwright, lint, TypeScript, builds local/remoto e preview protegido criado	correção controlada 13/07/2026

RQ-071	O H1 da home deve reservar a largura final integral das duas linhas sem recorte por overflow, máscara ou animação	/	Todos	P0	aprovado	Teste de geometria/fonte/animação em quatro viewports; oito capturas da home	refinamento cirúrgico 13/07/2026
RQ-072	A segunda seção deve ganhar composição óptica proprietária com produto real e entrada distinta sem perder o respiro off-white	/	Todos	P1	aprovado	Teste de reveal/imagem; matriz visual em `.qa/surgical-2026-07-13/after/`	refinamento cirúrgico 13/07/2026
RQ-073	A galeria social deve ser full bleed no mobile e manter fluxo contínuo com pausa, retomada e loop sem salto	/instagram	Mobile	P0	aprovado	Cinco larguras full bleed; avanço medido; lifecycle e `gallery-continuous-390x844.webm`	refinamento cirúrgico 13/07/2026
RQ-074	/instagram deve explicitar óculos solares e de grau em bloco compacto com WhatsApp factual distinto	/instagram	Todos	P0	aprovado	Teste de headings, copy e mensagens decodificadas; oito capturas sociais	refinamento cirúrgico 13/07/2026
RQ-075	A rodada deve preservar requisitos aprovados, não adicionar dependências e passar lint, tipos, testes, build e preview antes de produção	Todas	Todos	P0	aprovado	52/52 funcionais; lint, TypeScript, builds local/remoto e preview protegido	refinamento cirúrgico 13/07/2026

Resultado preservado e ampliado: RQ-053–RQ-075 possuem evidência reproduzível e foram aprovados. RQ-012 continua em revisão visual humana; RQ-035 aguarda a aprovação do preview protegido. Nenhum deploy de produção foi executado.
