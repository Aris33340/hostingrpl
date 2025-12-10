<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { watch, ref } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
    labels: Array,
    values: Array,
    colors: { type: Array, default: () => ["#3b82f6", "#10b981", "#f59e0b"] }
})

const chartData = ref({
    labels: props.labels,
    datasets: [
        {
            label: "total",
            data: [...props.values], // copy array supaya reaktif
            backgroundColor: props.colors
        }
    ]
})

const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { 
            title: {
                display: true,        // aktifkan judul
                text: "Total Mahasiswa / Non-Mahasiswa", // teks judul
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
            labels: { color: '#ffffff', font: { size: 14 } } },
        tooltip: { bodyColor: '#ffffff', titleColor: '#ffffff', footerColor: '#ffffff' }
    }
}

// Watch props.values untuk update chartData
watch(
    () => props.values,
    (newVal) => {
        chartData.value.datasets[0].data = [...newVal] // update chart
    },
    { deep: true }
)
</script>
<template>
    <div class="w-full h-64">
        <Pie :data="chartData" :options="options" />
    </div>
</template>