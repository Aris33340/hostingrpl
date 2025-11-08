import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const type = ref<'alert' | 'question' | 'success'>('alert')
let resolvePromise: ((value: boolean) => void) | null = null

type Options = {
  title?: string
  message?: string
  type?: 'alert' | 'question' | 'success'
}

export function useModal() {
  function open(options?: Options): Promise<boolean> {
    title.value = options?.title || 'Info'
    message.value = options?.message || ''
    type.value = options?.type || 'alert'
    isOpen.value = true

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve
    })
  }

  function close(result = false) {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(result) 
      resolvePromise = null
    }
  }

  return {
    isOpen,
    title,
    message,
    type,
    open,
    close
  }
}
