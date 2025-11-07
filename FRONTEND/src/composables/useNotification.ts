import { reactive } from "vue";

export const notification = reactive({
  show: false,
  type: "success",
  message: "",
});

export function showNotification(type:string, message:string) {
  notification.show = true;
  notification.type = type;
  notification.message = message;

  setTimeout(() => {
    notification.show = false;
  }, 4000);
}