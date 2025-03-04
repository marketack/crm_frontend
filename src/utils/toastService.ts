import { toast } from "react-toastify";

/**
 * ✅ Success Toast Notification
 * @param message - Message to display
 */
export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000, // Closes after 3s
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

/**
 * ❌ Error Toast Notification
 * @param message - Message to display
 */
export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000, // Closes after 3s
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};
