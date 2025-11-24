import { reactive } from "vue";

export const notification = reactive({
  show: false,
  type: "success" as "success" | "error",
  message: "",
});

type notifType = "success" | "error";

let timeoutId: number | null = null;

export function showNotification(type: notifType, message: string) {
  if (notification.show) {
    notification.show = false;
    setTimeout(() => {
      notification.show = true;
      notification.type = type;
      notification.message = message;
    }, 200); 
  } else {
    notification.show = true;
    notification.type = type;
    notification.message = message;
  }

  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = window.setTimeout(() => (notification.show = false), 4000);
}