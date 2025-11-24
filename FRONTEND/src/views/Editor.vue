<template>
    <div class="fixed left-0 flex h-[100%] w-[100%]">
        <div
            class="flex flex-col relative items-center h-full w-[10%] transition-all duration-300 ease-in-out hover:w-[20%]">
            <div class=" w-full h-full items-center flex-col flex gap-10 pt-6 hover:overflow-y-scroll">
                <div v-for="page in pages" @click="active = !active" :class="[
                    active ? 'bg-slate-100' : 'bg-blue-200',
                    'w-[90%] rounded-lg h-[300px] shrink-0 transition duration-300 ease-in-out hover:scale-105 cursor-pointer'
                ]">
                    <iframe :src="page + '#view=Fit'" class="w-full h-full rounded-lg border border-blue-500/20"></iframe>
                </div>
            </div>
            <div class="absolute bottom-0 w-full bg-black ">
                <button>
                    Set As Template
                </button>
            </div>
        </div>

        <div class="w-full h-full">

        </div>
        <div>

        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { mainApi } from '@/api'
import router from '../router';
import { useRoute } from 'vue-router';
import { PDFDocument } from 'pdf-lib';

const active = ref(true);
const editedFile = ref();
const route = useRoute();
const isLoading = ref(true);
const previewUrl = ref(null)
const previewType = ref(null)
const pageCount = ref(0)
const pdfFile = ref(null);
const pages = ref([])

const loadPdf = async () => {
    const id = route.query.fileId;
    const res = await mainApi.get(`files/${id}`, { responseType: 'arraybuffer' });
    const pdfDoc = await PDFDocument.load(res.data);
    pageCount.value = pdfDoc.getPageCount();
    pdfFile.value = pdfDoc;
}
const getSinglePagePDF = async (pageNumber = 2) => {
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdfFile.value, [pageNumber - 1]);
    newPdf.addPage(page);
    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
};



onMounted(async () => {
    console.log(isLoading.value)
    await loadPdf()
    console.log(isLoading.value)
    for (let i = 1; i <= pageCount.value; i++) {
        const pageUrl = await getSinglePagePDF(i);
        pages.value.push(pageUrl);
    }
})


</script>