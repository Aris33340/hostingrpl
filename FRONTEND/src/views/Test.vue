<template>

    <div>
        haloo its test page
    </div>
</template>

<script setup>
// Tambahkan logika komponen di sini jika diperlukan
import { watch } from 'vue';
import { authApi } from '../api';

const test = async () =>{
    const res = await authApi.post('/refresh',{},{withCredentials:true});
    return res
}
try {
    const res = await test();
    console.log(res)
} catch (error) {
    console.log(error);
}
</script>