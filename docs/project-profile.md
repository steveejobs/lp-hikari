project_name: "Ótica Hikari"

project_type:
  primary: landing
  secondary: bio

primary_goal:
  "/": contact
  "/instagram": contact

routes:
  primary: "/"
  secondary:
    - "/instagram"

route_profiles:
  "/":
    purpose: "Aquisição por Google, busca local e acesso direto"
    primary_device: balanced
    traffic_origin:
      - google
      - direct
    primary_action: whatsapp
    secondary_action: route
    content_depth: complete
    seo_priority: strict

  "/instagram":
    purpose: "Conversão imediata de tráfego vindo do Instagram"
    primary_device: mobile
    design_viewport: "390x844"
    traffic_origin:
      - instagram
    primary_action: whatsapp
    secondary_action: route
    tertiary_action: full-site
    content_depth: compact
    seo_priority: baseline

motion_level: expressive

motion_principle:
  - "refração"
  - "mudança de foco"
  - "profundidade óptica"
  - "florescimento da luz"
  - "feedback de interação"

carousel_policy:
  mode: autoplay
  interaction:
    - swipe
    - drag
    - keyboard
  grouping: series
  pause_offscreen: true
  pause_hidden_tab: true
  resume_after_interaction: true

video_policy:
  mode: single-active
  low_quality_video: secondary-small
  reduced_motion: poster
  save_data: poster

content_source: static

conversion_action:
  primary: whatsapp
  secondary: route

performance_priority:
  "/": balanced
  "/instagram": strict

accessibility_level: wcag-aa
deployment_policy: preview-first

execution_environment:
  agent: codex-max
  target: vercel
  architecture: nextjs-app-router

creative_thesis: "A experiência será organizada como um laboratório editorial de luz, traduzindo o florescer de um novo olhar através de refração, foco, profundidade e transformação óptica."

implementation_decisions:
  framework: "Next.js 16 App Router"
  language: typescript
  rendering:
    default: server-components
    client_islands:
      - optical-hero
      - series-carousel
      - focus-gallery
      - controlled-video
      - instagram-focus-stack
  styling: "CSS moderno com tokens globais e CSS Modules/escopo por componente quando necessário"
  typography: "Newsreader localizada pelo Next para títulos + pilha sans de sistema para reduzir o caminho crítico"
  motion: "CSS transforms, masks e um pequeno coordenador de mídia/visibilidade"
  webgl: rejected
  webgl_reason: "A tese óptica pode ser expressa com máscaras e refração 2D por custo muito menor, com melhor fallback e mobile."
  dependencies_policy: "sem biblioteca de motion, carrossel, ícones ou UI"

visual_tokens:
  gold_primary: "#FCC60E"
  gold_deep: "#ECBB0F"
  gold_ink_accessible: "#654B00"
  black_source: "#000000"
  black_ui: "#080806"
  ivory: "#F3EFE5"
  oxblood_photo: "#542822"

carousel_detail:
  carousel_mode: autoplay
  interaction: mixed
  autoplay_interval_ms: 5200
  pause_policy:
    interaction: true
    offscreen: true
    hidden_tab: true
  resume_after_interaction: true
  reduced_motion: manual-only

video_detail:
  preload: none
  poster: required
  coordinator: single-active
  pause_offscreen: true
  pause_hidden_tab: true
  save_data: poster-only
  reduced_motion: poster-only

route_distinction:
  "/": "Narrativa local completa, quatro ensaios separados, experiência da loja, localização e FAQ factual."
  "/instagram": "Microexperiência curta de ação, desenhada em 390x844, com CTA na primeira dobra e uma única seleção visual compacta."

first_visual_proof:
  date: "2026-07-13"
  viewports:
    - "390x844"
    - "1440x900"
  evidence:
    - ".qa/proof/hero-390x844.png"
    - ".qa/proof/hero-390x844-motion.webm"
    - ".qa/proof/hero-1440x900.png"
    - ".qa/proof/hero-1440x900-motion.webm"
  console_errors: 0
  decision: approved_for_expansion
  human_review: pending

final_qa:
  build: passed
  lint: passed
  typecheck: passed
  playwright:
    result: "28/28 passed"
    required_viewports: 8
    route_viewport_pairs: 16
    coverage:
      - keyboard
      - mouse-drag
      - touch
      - reduced-motion
      - save-data
      - hidden-tab
      - offscreen-video
      - slow-images
      - missing-images
      - javascript-disabled
      - resize
  lighthouse_mobile:
    home:
      performance: 67
      lcp: "2.9 s"
      tbt: "1.35 s"
      cls: 0
      accessibility: 100
      best_practices: 100
      seo: 100
    instagram:
      performance: 71
      lcp: "2.6 s"
      tbt: "1.46 s"
      cls: 0
      accessibility: 100
      best_practices: 100
      seo: 100
  inp: "requires field data after preview; interaction paths validated with Playwright"
  evidence_root: ".qa/final"
  preview_url: pending
