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
    labels: Array,       // ["Kelas 1", "Kelas 2", ...]
    values: Array,       // [85, 90, 70]
    colors: {
        type: Array,
        default: () => [
            "rgba(59, 130, 246, 0.8)",  // biru transparan
            "rgba(16, 185, 129, 0.8)",  // hijau transparan
            "rgba(245, 158, 11, 0.8)",  // kuning transparan
            "rgba(239, 68, 68, 0.8)",   // merah transparan
            "rgba(139, 92, 246, 0.8)"   // ungu transparan
        ]
    }
})

const data = {
    labels: props.labels,
    datasets: [
        {
            label: "Persentase Kehadiran (%)",
            data: props.values,
            backgroundColor: props.colors,
            borderRadius: 6,
            borderColor: "#fff",    // garis tepi putih
            borderWidth: 2,         // tebal garis tepi
            borderRadius: 6
        }
    ]
}

const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // horizontal
    plugins: {
        legend: {
            title: {
                display: true,        // aktifkan judul
                text: "Persentase Kehadiran Mahasiswa per Peminatan", // teks judul
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
            labels: {
                color: "#fff",
                generateLabels: (chart) => {
                    return chart.data.labels.map((label, i) => ({
                        text: label,
                        fillStyle: chart.data.datasets[0].backgroundColor[i],
                        strokeStyle: "#fff",
                        hidden: false,
                        fontColor: "#fff",
                        index: i
                    }))
                }
            }
        },
        tooltip: {
            callbacks: {
                label: (ctx) => `${ctx.raw}% hadir`
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: "#fff",
                callback: (value) => value + "%"
            },
            max: 100 // persentase selalu maksimal 100%
        },
        y: { ticks: { color: "#fff" } }
    }
}
</script>

<template>
    <div class="w-full h-72">
        <Bar :data="data" :options="options" />
    </div>
</template>