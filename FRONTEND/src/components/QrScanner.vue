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
            lastResult = decodedText;
            myqr.classList.remove('hidden');
            myqr.innerHTML = `<strong>Hasil Scan Terakhir:</strong> ${decodedText}`;
            emit('scanned', decodedText);

            setTimeout(() => {
                lastResult = null;
            }, 2000);
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

async function killAllCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();

  for (const device of devices) {
    if (device.kind === "videoinput") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId }
        });
        stream.getTracks().forEach(t => t.stop());
      } catch (err) {
        console.warn("Failed killing device", err);
      }
    }
  }
}


defineExpose({
    pauseScanner() {
        html5QrcodeScanner?.pause()
    },
    resumeScanner() {
        html5QrcodeScanner?.resume()
    },
    async stopScanner() {
        try {
            // 1. Hentikan scanner internal
            if (html5QrcodeScanner?._html5Qrcode) {
                await html5QrcodeScanner._html5Qrcode.stop();
            }

            // 2. Bersihkan UI
            await html5QrcodeScanner?.clear();

            // 3. Matikan semua kamera yg masih aktif (force kill)
            navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
                console.log("Tracks:", s.getTracks());
            });
            await killAllCameras    ();

        } catch (e) {
            console.error("Error stop camera:", e);
        }
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

#reader__scan_region>video {
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
