<template>
    <v-container fluid class="py-10">
                <h1 class="text-h5 text-center font-weight-bold text-maroon">สถานะการประเมินของกรรมการประเมิน</h1>
                <v-card class="pa-4">

                    <br>
                    รายชื่อกรรมการประเมิน
                    <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">กรรมการประเมิน</th>
                                <th class="border text-center">สถานะการประเมิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(items,index) in result" :key="items.id_eva">
                                <td class="text-center border">{{ index+1 }}</td>
                                <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                <td class="text-center border">
                                    <v-btn class="text-white" size="small" :color="bg(items.status_commit)">{{ items.status_commit === 'y' ? 'ประเมินเเสร็จสิ้น' : 'ยังไม่ได้ประเมิน' }}</v-btn>
                                </td>
                            </tr>
                            <tr v-if="result.length === 0">
                                <td class="text-center border text-gray-400" colspan="8">ไม่พบข้อมูล</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref,onMounted } from 'vue';
import { useRoute } from 'vue-router';

const token = localStorage.getItem('token')

const id_eva = useRoute().params.id_eva
const api = import.meta.env?.VITE_BASE_API || 'http://localhost:3001/api/Staff'

const result = ref([])


const fetch = async () => {
    try{
        const res = await axios.get(`${api}/status/${id_eva}`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = res.data

    }catch(err){
        console.error("Error Fetching",err)
    }
}

const bg = (status_commit:string) => {
    if(status_commit === 'y') return 'success'
    return 'error'
}

onMounted(fetch)
</script>

<style scoped>
.btn-maroon{
    background-color: #7d0c14;
}
.text-maroon{
    color: #7d0c14;
}
</style>