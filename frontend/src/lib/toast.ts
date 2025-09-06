import Swal from "sweetalert2";

// Configure default settings
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export const toast = {
  success: (message: string) => {
    return Toast.fire({
      icon: "success",
      title: message,
      background: "#f0fdf4",
      color: "#166534",
      iconColor: "#22c55e",
    });
  },

  error: (message: string) => {
    return Toast.fire({
      icon: "error",
      title: message,
      background: "#fef2f2",
      color: "#dc2626",
      iconColor: "#ef4444",
    });
  },

  warning: (message: string) => {
    return Toast.fire({
      icon: "warning",
      title: message,
      background: "#fffbeb",
      color: "#d97706",
      iconColor: "#f59e0b",
    });
  },

  info: (message: string) => {
    return Toast.fire({
      icon: "info",
      title: message,
      background: "#eff6ff",
      color: "#2563eb",
      iconColor: "#3b82f6",
    });
  },

  loading: (message: string = "Loading...") => {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close: () => {
    Swal.close();
  },
};
