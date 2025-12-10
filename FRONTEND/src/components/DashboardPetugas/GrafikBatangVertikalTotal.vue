<script setup>
import { Bar } from "vue-chartjs"
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
    labels: Array,
    values: Array,
    colors: {
        type: Array,
        default: () => ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    }
})

const data = {
    labels: props.labels,
    datasets: [
        {
            label:"",
            data: props.values,
            backgroundColor: props.colors.map(c => c + "80"), // transparan, optional
            borderColor: "#fff",      // garis tepi putih
            borderWidth: 2,
            borderRadius: 6
        }
    ]
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    plugins: {
        legend: {
            title: {
                display: true,        // aktifkan judul
                text: "Grafik Total Mahasiswa per Peminatan", // teks judul
                color: "#fff",        // warna teks
                font: {
                    size: 18,
                    weight: "bold"
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            labels:{
                display:false
            }
            // labels: {
            //     color: "#fff",
            //     generateLabels: (chart) => {
            //         return chart.data.labels.map((label, i) => ({
            //             text: label,
            //             fillStyle: chart.data.datasets[0].backgroundColor[i],
            //             strokeStyle: chart.data.datasets[0].backgroundColor[i],
            //             hidden: false,
            //             fontColor: "#fff",
            //             index: i
            //         }))
            //     }
            // }
        },
        tooltip: {
            callbacks: {
                label: (ctx) => `Jumlah: ${ctx.raw}` // tampilkan total
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                color: "#fff",
                stepSize: 1,
            },
            suggestedMax: Math.max(...props.values) + 2 // agar ada sedikit ruang di atas
        },
        x: { ticks: { color: "#fff" } }
    }
}
</script>

<template>
    <div class="w-full h-72">
        <Bar :data="data" :options="options" />
    </div>
</template>