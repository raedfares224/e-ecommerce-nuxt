// types/site-settings.ts

export type Locale = {
  code: string;
  name: string;
  dir: "rtl" | "ltr";
  iso: string;
};

export type SiteSettings = {
  slider_show: boolean;
  siteTitle: string;
  currency: string;
  perPage: number;
  perRow: number;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  facebook: string;
  twitter: string;
  instagram: string;
  keywords: string;
  description: string;
  copy_right: string;
  website_color: string;
  hover_color: string;
  prices_color: string;
  prices_background_color: string;
  placingColorWhenPlacingMouseOnTheTopMenu: string;
  navbar_text_color: string;
  category_text_color: string;
  footer_text_color: string;
  footer_color: string;
  category_text_color_title: string;
  category_background_color_title: string;
  navbar_color: string;
  google_map_url: string;
  noImageUrl: string;
  logo: string;
  logo_sm: string;
  favicon: string;
  locale: string;
  locales: Locale[];
};

export type SiteSettingsResponse = {
  data: SiteSettings;
  status: "success" | "error";
  message: string;
};
