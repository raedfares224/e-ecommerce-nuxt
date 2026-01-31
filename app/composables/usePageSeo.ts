export interface PageSeoOptions {
  title?: string | (() => string);
  description?: string | (() => string);
  image?: string | (() => string);
  type?: string;
}

export function usePageSeo(opts: PageSeoOptions = {}) {
  const fn = <T>(v: T | (() => T)) =>
    typeof v === "function" ? (v as () => T) : () => v;

  const route = useRoute();
  const cfg = useRuntimeConfig();
  const baseUrl = cfg.public?.siteUrl || "";

  const title = fn(opts.title ?? "");
  const description = fn(opts.description ?? "");
  const image = fn(opts.image);
  const type = (opts.type ?? "website") as "website" | "article";
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: type,
    ogImage: image,
    ogUrl: () => `${baseUrl}${route.fullPath}`,
    ogSiteName: title,

    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    twitterSite: "@Stor",
    twitterCreator: "@Stor",
  });
}
