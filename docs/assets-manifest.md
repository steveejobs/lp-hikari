# Manifesto de assets

Auditoria concluída em 13/07/2026 antes de qualquer alteração de código. Foram encontrados 39 assets: 22 fotografias, 3 arquivos de identidade, 11 logos comerciais não confirmadas e 3 vídeos.

## Relação entre as séries

| Grupo | Ordem confirmada | Relação visual | Tratamento decidido |
|---|---|---|---|
| Série 1 | `1`, `1 (2)` … `1 (10)` | Mesma pessoa, roupa branca e ambiente; alterna retrato e detalhe de produto | Sequência editorial principal com scroll snap, autoplay controlado e navegação |
| Série 2 | `2 (1)`, `2 (2)` | Mesma pessoa, camisa preta e laço; dois gestos do mesmo momento | Díptico estático, sem simular variedade |
| Série 3 | `3`, `3 (2)` … `3 (4)` | Mesma pessoa, camiseta preta e quatro armações | Galeria de foco compacta, ordenada |
| Série 4 | `4 (1)` … `4 (6)` | Mesma pessoa, blazer vinho e seis armações | Composição editorial assimétrica, ordenada |

`1.jpg` e `3.jpg` são os primeiros itens de suas séries. Essa relação foi confirmada visualmente; não são arquivos independentes.

## Fotografias

Todas são JPEG RGB, sem transparência, em 1170 × 1560 px (3:4), 96 dpi. A compressão é adequada para web e os arquivos têm entre 98,0 e 205,3 KB. Não será feita recompressão destrutiva; o Next/Image gerará tamanhos responsivos.

| Arquivo original | Peso | Conteúdo / enquadramento | Uso |
|---|---:|---|---|
| `1.jpg` | 191,0 KB | Retrato fechado inclinado, solar aviador | Abertura da Série 1 |
| `1 (2).jpg` | 102,7 KB | Produto na mão, fundo da loja | Série 1 |
| `1 (3).jpg` | 179,7 KB | Retrato médio, gesto aberto | Série 1 |
| `1 (4).jpg` | 114,5 KB | Detalhe lateral da armação | Série 1 |
| `1 (5).jpg` | 183,7 KB | Retrato fechado, solar escuro | Hero principal |
| `1 (6).jpg` | 98,0 KB | Produto redondo na mão | Série 1 |
| `1 (7).jpg` | 205,3 KB | Retrato fechado, armação ampla | Série 1 |
| `1 (8).jpg` | 103,3 KB | Detalhe de armações empilhadas | Série 1 |
| `1 (9).jpg` | 201,5 KB | Retrato fechado, lente azul | Série 1 |
| `1 (10).jpg` | 108,6 KB | Duas armações na mão | Fechamento da Série 1 |
| `2 (1).jpg` | 125,0 KB | Retrato médio, camisa preta | Díptico Série 2 |
| `2 (2).jpg` | 104,2 KB | Retrato aberto, gesto com as mãos | Díptico Série 2 |
| `3.jpg` | 151,4 KB | Retrato médio, lente âmbar | Abertura da Série 3 |
| `3 (2).jpg` | 147,0 KB | Retrato fechado, solar oval | Série 3 |
| `3 (3).jpg` | 134,5 KB | Retrato frontal, solar preto | Série 3 |
| `3 (4).jpg` | 112,7 KB | Perfil, haste branca | Fechamento da Série 3 |
| `4 (1).jpg` | 121,8 KB | Retrato médio, blazer vinho | Abertura da Série 4 |
| `4 (2).jpg` | 141,5 KB | Retrato frontal, lente degradê | Série 4 |
| `4 (3).jpg` | 134,9 KB | Retrato inclinado, lente azul | Série 4 |
| `4 (4).jpg` | 132,4 KB | Retrato fechado, lente azul | Série 4 |
| `4 (5).jpg` | 171,5 KB | Retrato frontal, aviador escuro | Série 4 |
| `4 (6).jpg` | 139,8 KB | Retrato fechado, solar preto | Fechamento da Série 4 |

Qualidade visual: boa para web e redes sociais, com nitidez suficiente para os tamanhos previstos. A rotação de câmera da Série 1 é parte do ensaio; rostos e armações permanecem preservados com `object-position` específico.

## Identidade

| Arquivo original | Produção | Peso final | Transparência | Uso final |
|---|---:|---:|---|---|
| `logo completa.png` (500 × 500) | `public/brand/logo-hikari.png` (467 × 262) | 52,7 KB | Sim | Header, rodapés e JSON-LD |
| `icone logo.png` (1254 × 1254) | Símbolo `光` tipográfico + ícone derivado | — | Nativa | Composição óptica sem download decorativo |
| `favicon.png` (500 × 500) | `app/icon.png` (192 × 192) | 16,3 KB | Sim | Favicon e ícone do manifesto |

Paleta aferida nos pixels originais:

- dourado mediano do símbolo: `#FCC60E`;
- dourado médio ponderado do símbolo: `#F9C40D`;
- dourado mais fechado da logo completa: `#ECBB0F`;
- preto do favicon: `#000000`.

O token principal usa `#FCC60E`; `#ECBB0F` preserva o dourado profundo da identidade. Em superfícies claras, `#654B00` é usado como tinta dourada acessível: é um token funcional de contraste, não uma substituição da cor de marca.

## Vídeos

| Arquivo | Dimensões | Duração | Codec / fps | Bitrate | Peso | Áudio | Decisão |
|---|---:|---:|---|---:|---:|---|---|
| `SaveClip.App_AQOQ…mp4` | 720 × 960 (3:4) | 11,634 s | H.264, 30 fps | 2,895 Mbps | 4,15 MB | Nenhuma faixa identificada | Não usar; redundante e mais pesado |
| `snapinsta.com.br-6a50f2c4e960d.mp4` | 720 × 1280 (9:16) | 8,823 s | H.264, 30 fps | 2,103 Mbps vídeo | 2,31 MB | 46 kbps | Vídeo editorial principal, sempre `muted` |
| `video qualidade ruim.mp4` | 720 × 960 (3:4) | 13,867 s | H.264, 30 fps | 2,469 Mbps | 4,12 MB | Nenhuma faixa identificada | Fragmento pequeno; poster; nunca hero/full-bleed |

O último arquivo é uma montagem vertical com três tomadas rotacionadas, detalhe baixo e qualidade perceptual ruim apesar da resolução declarada. Foi reduzido fisicamente para 360 × 480, 13,87 s e 0,916 MB, sem sharpening. O vídeo principal teve o áudio removido e ficou em 720 × 1280, 8,80 s e 2,37 MB. Posters finais: 450 × 800 (27,9 KB) e 360 × 480 (26,0 KB).

## Logos comerciais

| Arquivo | Dimensões | Peso | Transparência | Estado |
|---|---:|---:|---|---|
| `carrera (1).png` | 800 × 157 | 19,7 KB | Sim | Bloqueado |
| `Emilio-Pucci-Logo.png` | 1280 × 720 | 17,6 KB | Sim | Bloqueado |
| `images__2_-removebg-preview.png` (Dolce & Gabbana) | 447 × 447 | 24,2 KB | Sim | Bloqueado |
| `Jimmy_Choo_Ltd-Logo.wine.png` | 3000 × 2000 | 38,4 KB | Sim | Bloqueado |
| `Max-Mara-logo.png` | 1280 × 720 | 23,8 KB | Sim | Bloqueado |
| `persol-logo-png-transparent.png` | 2400 × 2400 | 118,3 KB | Sim | Bloqueado |
| `ray-ban-logo.png` | 1280 × 1280 | 41,4 KB | Sim | Bloqueado |
| `Swarovski-Logo-2016.png` | 3840 × 2160 | 61,7 KB | Sim | Bloqueado |
| `Tom-Ford-logo.png` | 3840 × 2160 | 19,8 KB | Sim | Bloqueado |
| `versace-logo.png` | 1280 × 659 | 89,8 KB | Sim | Bloqueado |
| `VOGUE_revista_-_logo.png` | 1446 × 375 | 7,4 KB | Sim | Bloqueado |

A existência desses arquivos não confirma comercialização. Nenhuma marca foi publicada. Os 11 logos e o diretório bruto duplicado foram removidos da árvore final após o checkpoint `53b69a5`; continuam recuperáveis no histórico Git e não entram no bundle ou no upload da Vercel.

## Organização de produção

```text
public/
├── brand/
├── gallery/
│   ├── series-01/
│   ├── series-02/
│   ├── series-03/
│   └── series-04/
└── video/
```

Os nomes de produção foram normalizados (`01.jpg`, `02.jpg` etc.) sem alterar a ordem semântica registrada acima. A árvore final contém somente 27 arquivos públicos: 22 fotografias, uma logo e quatro arquivos de vídeo/poster.
