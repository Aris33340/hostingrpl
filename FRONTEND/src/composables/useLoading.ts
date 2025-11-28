import { reactive, toRefs } from "vue";

// Global reactive state (singleton)
const globalState = reactive({
    isLoading: false,
    message: "Memuat data..."
});

export function useLoading() {
    const show = (msg = "Sedang mencari toga...") => {
        globalState.message = msg;
        globalState.isLoading = true;
        console.log("active nih loadingnya")
    };

    const hide = () => {
        globalState.isLoading = false;
    };

    return {
        ...toRefs(globalState),
        show,
        hide
    };
}
