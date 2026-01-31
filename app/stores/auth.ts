import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { LoginPayload, AuthResponse, UpdateProfilePayload, User } from "~/types/auth";
import { apiFetch } from "~/api/useApiFetch";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // Store token in cookie with long expiration (1 year based on JWT exp)
  const token = useCookie<string | null>("token", {
    default: () => null,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const setToken = (newToken: string | null) => {
    token.value = newToken;
  };

  const setUser = (userData: User | null) => {
    user.value = userData;
  };

  const login = async (payload: LoginPayload) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await apiFetch<AuthResponse>("/login", {
        method: "POST",
        body: payload,
      });

      if (response.data) {
        const userData = response.data.data;
        
        // Store token and user data
        setToken(userData.token);
        setUser(userData);
        
        return { success: true, data: userData };
      }
      
      throw new Error("Invalid response from server");
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please try again.";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    
    try {
      // Optional: Call logout endpoint if available
      // await api("/logout", { method: "POST" });

      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      // Clear auth state
      setToken(null);
      setUser(null);

      // Redirect to login
      await navigateTo("/auth/login");

      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Logout error:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchProfile = async () => {
    if (!token.value) {
      return;
    }

    loading.value = true;
    
    try {
      const response = await apiFetch<AuthResponse>("/profile", {
        method: "GET",
      });

      if (response.data) {
        setUser(response.data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch profile:", err);
      // If token is invalid, clear auth state
      if (err.message?.includes("401") || err.message?.includes("Unauthorized")) {
        setToken(null);
        setUser(null);
      }
    } finally {
      loading.value = false;
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    if (!token.value) {
      throw new Error("Not authenticated");
    }

    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("mobile", payload.mobile);
      formData.append("username", payload.username);
      formData.append("photo", payload.photo);

      const response = await apiFetch<AuthResponse>("/profile", {
        method: "POST",
        body: formData,
      });

      if (response.data) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        return { success: true, data: updatedUser };
      }

      throw new Error("Invalid response from server");
    } catch (err: any) {
      const errorMessage = err.message || "Profile update failed. Please try again.";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const updateProfilePhoto = async (file: File) => {
    if (!token.value) {
      throw new Error("Not authenticated");
    }

    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      // formData.append("photo", file);

      const response = await apiFetch<AuthResponse>("/profile", {
        method: "POST",
        body: formData,
      });

      if (response.data) {
        const updatedUser = response.data.data;
        setUser(updatedUser);
        return { success: true, data: updatedUser };
      }

      throw new Error("Invalid response from server");
    } catch (err: any) {
      const errorMessage = err.message || "Profile photo update failed. Please try again.";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // Initialize user from token on store creation
  const initialize = async () => {
    if (token.value && !user.value) {
      await fetchProfile();
    }
  };

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    fetchProfile,
    updateProfile,
    updateProfilePhoto,
    initialize,
    setToken,
    setUser,
  };
});
