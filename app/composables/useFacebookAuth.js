// Composable: useFacebookAuth.js
// ملاحظة: دوال مساعدة لتسجيل الدخول عبر فيسبوك

import { apiFetch } from "~/api/useApiFetch";
import { useAuthStore } from "~/stores/auth";

export const useFacebookAuth = () => {
  // جلب رابط تسجيل الدخول من الباك اند
  const getFacebookLoginUrl = async () => {
    const { data, error } = await apiFetch("/auth/facebook/url", {
      method: "GET",
    });

    if (error) {
      console.error("Facebook login URL error:", error);
      throw new Error(error.message || "Facebook login URL not available");
    }

    const response = data;

    if (!response || !response.url) {
      throw new Error("Facebook login URL not available");
    }

    return response.url;
  };

  // معالجة كول باك فيسبوك واستبدال الكود بالتوكن
  const handleFacebookCallback = async (code) => {
    if (!code) {
      throw new Error("Invalid Facebook authorization code");
    }

    try {
      const formData = new FormData();
      formData.append("code", code);

      const { data: apiData, error: apiError } = await apiFetch("/auth/facebook", {
        method: "POST",
        body: formData,
      });

      if (apiError) {
        console.error("Facebook auth apiFetch error:", apiError);
        throw new Error(apiError.message || "Facebook authentication failed");
      }

      const response = apiData;

      if (!response) {
        console.error("[FacebookAuth] empty response from backend");
        throw new Error("Facebook authentication failed");
      }

      if (response?.status === "error") {
        console.error("Facebook auth backend error:", response?.message || response);
        throw new Error("فشل التحقق من حساب فيسبوك، يرجى المحاولة مرة أخرى لاحقًا");
      }

      const mainData =
        response?.data && typeof response.data === "object" && !Array.isArray(response.data)
          ? response.data
          : response;

      const token = mainData?.token || mainData?.access_token;

      const user =
        mainData?.user ||
        (typeof mainData === "object" ? mainData : undefined);

      if (!token || !user) {
        console.error("[FacebookAuth] missing token or user", { token, user, response, mainData });
        throw new Error("Facebook authentication failed");
      }

      const authStore = useAuthStore();
      authStore.setToken(token);
      authStore.setUser(user);

      return { token, user };
    } catch (error) {
      console.error("Facebook auth error:", error);
      throw new Error("Facebook authentication failed");
    }
  };

  return {
    getFacebookLoginUrl,
    handleFacebookCallback,
  };
};
