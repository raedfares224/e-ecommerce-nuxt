// import { useErrorStore } from "~/stores/error";
import { hash } from "ohash";
import type { FetchError } from "ofetch";
import { toast } from "vue-sonner";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface UseApiOptions {
  method?: HttpMethod;
  params?: Record<string, any>;
  body?: any;
  lang?: "en" | "ar";
  requireAuth?: boolean;
  trackError?: boolean;
  errorContext?: string;
  disableCache?: boolean;
  keySuffix?: string;
}

export async function api<T>(
  endpoint: string,
  options: UseApiOptions = {},
  namePropertyError?: string
): Promise<{ data: T | null; error: Error | null; key: string }> {
  const config = useRuntimeConfig();
  
  // Get current language from cookie if not explicitly provided
  const localeCookie = useCookie<"en" | "ar">("locale");
  const lang = options.lang ?? localeCookie.value ?? "en";
  
  const disableCache = true; // ثابت الآن، لكن يمكنك ربطه بـ options.disableCache
  const isFormData = options.body instanceof FormData;

  // ✅ بناء مفتاح فريد للكاش
  const fingerprint = hash({
    params: options.params ?? {},
    body: isFormData ? "[FormData]" : (options.body ?? {}),
    lang,
    keySuffix: options.keySuffix ?? "",
    token: useCookie("token").value,
  });
  const cacheKey = `useApi:${endpoint}:${fingerprint}`;

  // ✅ جلب أو إنشاء حالة الكاش
  const cache = disableCache ? null : useState<T | null>(cacheKey, () => null);

  // ✅ إذا عندنا بيانات بالكاش نرجعها مباشرة
  if (cache && cache.value !== null) {
    return { data: cache.value, error: null, key: cacheKey };
  }

  // ✅ إعداد الهيدرز
  const headers: HeadersInit = {
    Accept: "application/json",
    "Accept-Language": lang,
  };

  // Add Content-Type for non-GET requests
  if (options.method && options.method !== "GET" && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const token = useCookie("token").value;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ✅ إعداد الإلغاء (Abort)
  const controller = new AbortController();
  let abortedByUnmount = false;

  // استخدام getCurrentInstance للتحقق من وجود سياق Vue
  // if (getCurrentInstance()) {
  //   onUnmounted(() => {
  //     abortedByUnmount = true;
  //     controller.abort();
  //   });
  // }

  try {


    // ✅ تنفيذ الجلب مرة واحدة فقط (بدون تكرار)
    const { data: fetched, error: fetchError } = await useFetch<T>(
      `${config.public.apiBaseUrl}${endpoint}`,
      {
        key: cacheKey,
        method: (options.method ?? "GET") as HttpMethod,
        headers,
        params: options.method === "GET" ? options.params : undefined,
        body:
          options.method !== "GET"
            ? options.body
            : undefined,
        signal: controller.signal,
        
        // 🚀 أهم التعديل: منع الجلب المكرر
        lazy: false,     // تنفيذ الطلب فوراً
        server: true,    // تفعيل SSR
        dedupe: 'defer', // منع الطلبات المكررة
        timeout: 10000,  // 10 second timeout to prevent long hangs
      }
    );

    // ✅ معالجة الأخطاء القادمة من useFetch
    if (fetchError.value) {
      if (namePropertyError === "register") {
        throw (
          fetchError.value.data.errors.email ||
          fetchError.value.data.errors.mobile
        );
      }
      throw fetchError.value;
    }

    // ✅ تخزين النتيجة في الكاش (لو مفعل)
    const result = fetched.value as T;
    if (cache) cache.value = result;

    return { data: result, error: null, key: cacheKey };
  } catch (err: unknown) {
    // ✅ تجاهل الخطأ في حالة الإلغاء عند unmount
    if (err instanceof Error && err.name === "AbortError" && abortedByUnmount) {
      return { data: null, error: null, key: cacheKey };
    }

    // ✅ استبدال خطأ الإلغاء برسالة مفهومة
    if (err instanceof Error && err.name === "AbortError") {
      err = new Error("Request timed out");
    }

    // ✅ عرض الأخطاء برسالة toast جميلة
    if (!abortedByUnmount) {
      handleApiError(err, options.trackError, options.errorContext);
    }

    return { data: null, error: toError(err), key: cacheKey };
  }
}

// ------------------ Helpers ------------------

function handleApiError(raw: unknown, track = false, context?: string) {
  if (process.dev) {
    console.error("[useApi] error:", raw);
  }
  if (!track) return;

  let message = "an_unknown_error_occurred";

  if (raw instanceof Error) {
    const anyErr = raw as FetchError & { data?: any };
    const d = anyErr.data;
    if (d?.message) message = d.message;
    else if (d?.error) message = d.error;
    else if (raw.message.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(raw.message);
        message = parsed?.message || parsed?.error || raw.message;
      } catch {
        message = raw.message;
      }
    } else {
      message = raw.message;
    }
  } else {
    message = String(raw);
  }

  toast.error(message, {
    style: {
      backgroundColor: "var(--danger-color)",
    },
  });
}

function toError(raw: unknown): Error {
  return raw instanceof Error ? raw : new Error(String(raw));
}
