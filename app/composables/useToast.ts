
import { toast } from "vue-sonner";

export const useToast = () => {
const variants = {
  default: "bg-primary text-primary-foreground !border-none",
  success: "!bg-chart-2 !text-white !border-none",
  error: "!bg-destructive !text-white !border-none",
  warning: "!bg-yellow-500 !text-black !border-none",
  info: "!bg-chart-1 !text-white !border-none",
};

  const success = (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 3000,
      class: variants.success,
    });
  };

  const error = (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 4000,
      class: variants.error,
    });
  };

  const info = (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 3000,
      class: variants.info,
    });
  };

  const warning = (title: string, description?: string) => {
    toast.warning(title, {
      description,
      duration: 3000,
      class: variants.warning,
    });
  };

  const loading = (title: string) => {
    return toast.loading(title,{
      class: variants.default,
    });
  };

  const dismiss = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
  };
};
