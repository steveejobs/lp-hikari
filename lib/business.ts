export const business = {
  name: "Ótica Hikari",
  instagramHandle: "@oticahikari.aux",
  phoneDisplay: "(63) 98456-5924",
  phoneE164: "5563984565924",
  address: {
    street: "Rua 19 de Novembro, nº 68",
    district: "Centro",
    city: "Araguaína",
    region: "TO",
    postalCountry: "BR",
  },
  coordinates: {
    latitude: -7.1922897,
    longitude: -48.2094709,
  },
  mapsUrl:
    "https://www.google.com/maps/place/%C3%93tica+Hikari+-+Aragua%C3%ADna/@-7.1922844,-48.2120458,17z/data=!3m1!4b1!4m6!3m5!1s0x92d90d25743de4f9:0xf77a63794d7b3ceb!8m2!3d-7.1922897!4d-48.2094709!16s%2Fg%2F11yb5ksvdr?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D",
  instagramUrl: "https://www.instagram.com/oticahikari.aux/",
  parking: "Estacionamento gratuito",
  products: ["Óculos solares", "Óculos receituários"],
} as const;

type ContactSource = "site" | "instagram";

const messages: Record<ContactSource, string> = {
  site: "Olá! Vim pelo site da Ótica Hikari e quero atendimento para escolher meus óculos.",
  instagram:
    "Olá! Vim pelo Instagram da Ótica Hikari e quero atendimento para escolher meus óculos.",
};

export function getWhatsAppUrl(source: ContactSource) {
  const params = new URLSearchParams({
    phone: business.phoneE164,
    text: messages[source],
    utm_source: source === "instagram" ? "instagram" : "website",
    utm_medium: source === "instagram" ? "social" : "organic",
    utm_campaign: "hikari_atendimento",
  });

  return `https://api.whatsapp.com/send?${params.toString()}`;
}

export const fullAddress = `${business.address.street}, ${business.address.district} — ${business.address.city}, ${business.address.region}`;
