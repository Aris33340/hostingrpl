<template>
    <div class="w-full h-full">
        <div class="w-full h-full flex flex-col lg:flex-row">
            <div class="w-full lg:w-1/2 h-full p-6 flex flex-col gap-2 text-white">
                <div class="w-full h-16 flex flex-col text-start">
                    <label for="email">Email Pengiriman</label>
                    <input name="email"
                        class="h-10 bg-white/50 border outline-none border-white rounded-lg p-2 transition-all duration-100 focus:border-blue-400 focus:border-4"
                        type="email">
                </div>
                <div class="w-full h-16 flex flex-col text-start">
                    <label for="hashKey">Hash Key</label>
                    <input name="hashkey"
                        class="h-10 bg-white/50 border outline-none border-white rounded-lg p-2 transition-all duration-100 focus:border-blue-400 focus:border-4"
                        type="text">
                </div>
                <div class="flex-1"></div>
                <div>
                    <button
                        class="bg-blue-600 w-full h-12 rounded-lg text-white active:bg-blue-400 transition-colors duration-100">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
            <div class="w-full lg:w-1/2 h-full p-6 flex flex-col gap-2 text-black bg-white">
                <div>
                    <h2 class="font-bold text-3xl">
                        User Account
                    </h2>
                </div>
                <div class="flex flex-col h-full">
                    <table class="w-full">
                        <thead>
                            <tr class="border-collapse border-b h-12 border-black">
                                <th>USERNAME</th>
                                <th>EMAIL</th>
                                <th>PASSWORD</th>
                                <th>ROLE</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-collapse border-b h-12 border-black">
                                <td>arisadewa</td>
                                <td>ari12@gmail.com</td>
                                <td>password</td>
                                <td>SEKRETARIAT</td>
                                <td>
                                    <div class="flex flex-col gap-2 w-full justify-center">

                                        <button class="bg-yellow-400 text-white px-2 rounded-sm">
                                            edit
                                        </button>
                                        <button class="bg-red-600 text-white px-2 rounded-sm">
                                            delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex-1"></div>
                    <input type="file">
                    <button class="bg-blue-600 w-full h-12 text-white font-bold">Upload Data</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
</script>