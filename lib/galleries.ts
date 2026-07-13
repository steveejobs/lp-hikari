export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
};

const galleryPath = (series: string, image: string) => `/gallery/series-${series}/${image}.jpg`;

export const seriesOne: GalleryItem[] = [
  { id: "01", src: galleryPath("01", "01"), alt: "Mulher usando óculos solares aviador em retrato aproximado." },
  { id: "02", src: galleryPath("01", "02"), alt: "Mão apresentando óculos solares aviador." },
  { id: "03", src: galleryPath("01", "03"), alt: "Mulher de roupa branca usando óculos solares escuros." },
  { id: "04", src: galleryPath("01", "04"), alt: "Detalhe lateral de uma armação solar preta." },
  { id: "05", src: galleryPath("01", "05"), alt: "Retrato aproximado com óculos solares escuros." },
  { id: "06", src: galleryPath("01", "06"), alt: "Mão apresentando óculos solares redondos." },
  { id: "07", src: galleryPath("01", "07"), alt: "Mulher usando armação solar ampla em tom escuro." },
  { id: "08", src: galleryPath("01", "08"), alt: "Detalhe de armações solares vistas de lado." },
  { id: "09", src: galleryPath("01", "09"), alt: "Mulher usando óculos solares de lente azul." },
  { id: "10", src: galleryPath("01", "10"), alt: "Duas armações solares apresentadas lado a lado." },
];

export const seriesTwo: GalleryItem[] = [
  { id: "01", src: galleryPath("02", "01"), alt: "Mulher de camisa preta usando óculos solares escuros." },
  { id: "02", src: galleryPath("02", "02"), alt: "Retrato com óculos solares e gesto das mãos." },
];

export const seriesThree: GalleryItem[] = [
  { id: "01", src: galleryPath("03", "01"), alt: "Mulher usando óculos solares com lente âmbar." },
  { id: "02", src: galleryPath("03", "02"), alt: "Retrato aproximado com óculos solares ovais." },
  { id: "03", src: galleryPath("03", "03"), alt: "Retrato frontal com óculos solares pretos." },
  { id: "04", src: galleryPath("03", "04"), alt: "Perfil com óculos solares de haste clara." },
];

export const seriesFour: GalleryItem[] = [
  { id: "01", src: galleryPath("04", "01"), alt: "Mulher de blazer vinho usando óculos solares aviador." },
  { id: "02", src: galleryPath("04", "02"), alt: "Retrato frontal com óculos solares de lente degradê." },
  { id: "03", src: galleryPath("04", "03"), alt: "Retrato inclinado com óculos solares de lente azul." },
  { id: "04", src: galleryPath("04", "04"), alt: "Retrato aproximado com óculos solares azuis." },
  { id: "05", src: galleryPath("04", "05"), alt: "Retrato frontal com óculos solares aviador escuros." },
  { id: "06", src: galleryPath("04", "06"), alt: "Retrato aproximado com óculos solares pretos." },
];
