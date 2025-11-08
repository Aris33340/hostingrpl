<template>
    <div class="flex flex-col m-10 backdrop-blur-lg rounded-2xl border-white border text-white">
        <div class="mt-3">
            <h1 class="text-2xl font-bold mb-4">Pemindaian Kode QR</h1>
            <p class="text-sm text-white mb-6">
                Arahkan kamera ke QR code untuk memindai
            </p>
        </div>
        <div id="reader"
            class="backdrop-blur-sm  flex-col items-center justify-center shadow-lg rounded-2xl p-4  max-w-screen">
        </div>
        <div id="result"></div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'

const emit = defineEmits(['scanned'])
let html5QrcodeScanner = null

onMounted(() => {
    let lastResult = null
    let processing = false

    const myqr = document.getElementById('result')

    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            lastResult = decodedText
            processing = true
        }

        if (processing) {
            processing = false
            html5QrcodeScanner.pause()

            myqr.classList.remove('hidden')
            myqr.innerHTML = `<strong>Hasil Scan Terakhir:</strong> ${decodedText}`

            emit('scanned', decodedText)
        }
    }

    function onScanError(errorMessage) {
    }

    html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        { fps: 30, qrbox: { width: 300, height: 300 } },
        false
    )

    html5QrcodeScanner.render(onScanSuccess, onScanError)
})

defineExpose({
  pauseScanner() {
    html5QrcodeScanner?.pause()
  },
  resumeScanner() {
    html5QrcodeScanner?.resume()
  }
})
</script>
<style>
#reader__scan_region {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: none;
}
#reader__scan_region > video{
    border-radius: 20px;
}

#html5-qrcode-button-camera-start:hover,
#html5-qrcode-button-camera-stop:hover {
    background-color: #c3c3c3;
}

#html5-qrcode-select-camera {
    background-color: none;
}

#html5-qrcode-select-camera:hover {
    cursor: pointer;
    background-color: #c3c3c3;
}
</style>
