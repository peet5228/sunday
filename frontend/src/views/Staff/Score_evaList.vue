<template>
    <v-container fluid class="py-10">
                <h1 class="text-h5 text-center font-weight-bold text-maroon">รายงานผลการประเมินของผู้รับการประเมิน</h1>
                <v-card class="pa-4">

                    <br>
                    รายชื่อผู้รับการประเมิน
                    <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">ผู้รับการประเมิน</th>
                                <th class="border text-center">รอบการประเมิน</th>
                                <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                <th class="border text-center">สถานะการประเมิน</th>
                                <th class="border text-center">รายละเอียด</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(items,index) in result" :key="items.id_eva">
                                <td class="text-center border">{{ index+1 }}</td>
                                <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                <td class="text-center border">รอบที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                <td class="text-center border">{{ items.day_eva }}</td>
                                <td class="text-center border">
                                    <v-btn class="text-white" size="small" :color="bg(items.status_eva)">{{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_eva === 2 ? 'กรรมการประเมิน' : 'ประเมินเเสร็จสิ้น' }}</v-btn>
                                </td>
                                <td class="text-center border">
                                    <v-btn class="text-white" size="small" color="success" @click="add(items.id_eva)">รายละเอียด</v-btn>
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
import { useRouter } from 'vue-router';

const token = localStorage.getItem('token')

const router = useRouter()
const api = import.meta.env?.VITE_BASE_API || 'http://localhost:3001/api/Staff'

const result = ref([])


const fetch = async () => {
    try{
        const res = await axios.get(`${api}/List`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = res.data

    }catch(err){
        console.error("Error Fetching",err)
    }
}

const bg = (status_eva:number) => {
    if(status_eva === 1) return 'blue'
    if(status_eva === 3) return 'warning'
    if(status_eva === 3) return 'success'
}

const add = (id_eva:number) => {
    router.push({path:`ScoreEva/${id_eva}`})
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