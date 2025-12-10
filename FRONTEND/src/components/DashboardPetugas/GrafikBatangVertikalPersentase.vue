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
            label: '%',
            data: props.values,
            backgroundColor: props.colors,
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
                text: "Persentase Kehadiran Mahasiswa / Non-Mahasiswa", // teks judul
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
                        strokeStyle: chart.data.datasets[0].backgroundColor[i],
                        hidden: false,
                        fontColor:"#fff",
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
        y: {
            ticks: { color: "#fff", callback: (v) => v + "%" },
            max: 100
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