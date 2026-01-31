// Composable: useGoogleAuth.js
// ملاحظة: دوال مساعدة لتسجيل الدخول بجوجل

import { apiFetch } from "~/api/useApiFetch";
import { useAuthStore } from "~/stores/auth";

export const useGoogleAuth = () => {
  // جلب رابط تسجيل الدخول من الباك اند
  const getGoogleLoginUrl = async () => {
    // حسب المتطلبات: GET /auth/google/url باستخدام apiFetch
    const { data, error } = await apiFetch("/auth/google/url", {
      method: "GET",
    });

    if (error) {
      console.error("Google login URL error:", error);
      throw new Error(error.message || "Google login URL not available");
    }

    const response = data;

    // نتوقع أن يكون الرد على شكل { url: string }
    if (!response || !response.url) {
      throw new Error("Google login URL not available");
    }
    return response.url;
  };

  // معالجة كول باك جوجل واستبدال الكود بالتوكن
  const handleGoogleCallback = async (code) => {
    if (!code) {
      throw new Error("Invalid Google authorization code");
    }

    try {
      // حسب المتطلبات: POST /api/auth/google مع code كـ FormData
      const formData = new FormData();
      formData.append("code", code);

      // نستخدم apiFetch المبني على $fetch لتفادي مشاكل useFetch/SSR
      const { data: apiData, error: apiError } = await apiFetch("/auth/google", {
        method: "POST",
        body: formData,
      });

      if (apiError) {
        console.error("Google auth apiFetch error:", apiError);
        throw new Error(apiError.message || "Google authentication failed");
      }

      const response = apiData;

      // لسهولة التتبع أثناء التطوير

      if (!response) {
        console.error("[GoogleAuth] empty response from backend");
        throw new Error("Google authentication failed");
      }

      // إذا أعاد الباك إند حالة خطأ صريحة
      if (response?.status === "error") {
        console.error("Google auth backend error:", response?.message || response);
        throw new Error("فشل التحقق من حساب جوجل، يرجى المحاولة مرة أخرى لاحقًا");
      }

      // توحيد شكل البيانات القادمة من الباك إند
      // - في بعض الـ APIs تكون { status, data: { ...user, token } }
      // - أو { token, user }
      const mainData =
        response?.data && typeof response.data === "object" && !Array.isArray(response.data)
          ? response.data
          : response;

      // استخراج التوكن من الشكل الموحّد
      const token =
        mainData?.token ||
        mainData?.access_token;

      // تحديد المستخدم من الشكل الموحّد
      const user =
        // الشكل الكلاسيكي: { user, token }
        mainData?.user ||
        // في حالتنا الحالية mainData نفس كائن المستخدم (مع حقل token داخله)
        (typeof mainData === "object" ? mainData : undefined);

      if (!token || !user) {
        console.error("[GoogleAuth] missing token or user", { token, user, response, mainData });
        throw new Error("Google authentication failed");
      }

      // استخدام auth store لحفظ التوكن واليوزر
      const authStore = useAuthStore();
      authStore.setToken(token);
      authStore.setUser(user);

      // نعيد البيانات، وصفحة الكول باك هي المسؤولة عن التوجيه
      return { token, user };
    } catch (error) {
      // لا نظهر رسائل SQL الطويلة للمستخدم، فقط نطبعها للمطور
      console.error("Google auth error:", error);
      throw new Error("Google authentication failed");
    }
  };

  return {
    getGoogleLoginUrl,
    handleGoogleCallback,
  };
};
