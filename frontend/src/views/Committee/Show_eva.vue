<template>
    <v-container fluid class="py-10">
                <h1 class="text-h5 text-center font-weight-bold text-maroon">รายชื่อผู้รับประเมินผล</h1>
                <v-card class="pa-4">
                    <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">ชื่อ</th>
                                <th class="border text-center">นามสกุล</th>
                                <th class="border text-center">รอบการประเมิน</th>
                                <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                <th class="border text-center">คะแนนประเมิน</th>
                                <th class="border text-center">สถานะการประเมิน</th>
                                <th class="border text-center">ประเมิน</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(items,index) in result" :key="items.id_eva">
                                <td class="text-center border">{{ index+1 }}</td>
                                <td class="text-center border">{{ items.first_name }}</td>
                                <td class="text-center border">{{ items.last_name }}</td>
                                <td class="text-center border">รอบที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                <td class="text-center border">{{ items.day_eva }}</td>
                                <td class="text-center border">{{ items.total_eva }} คะแนน</td>
                                <td class="text-center border">{{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_eva === 2 ? 'รอกรรมการประเมิน' : 'ประเมินเเสร็จสิ้น' }}</td>
                                <td class="text-center border">
                                    <v-btn v-if="items.status_commit === 'n'" class="text-white" size="small" color="blue" @click="add(items.id_eva)">ประเมิน</v-btn>
                                    <v-btn v-else class="text-white" size="small" color="green">ประเมินแล้ว</v-btn>
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
const api = import.meta.env?.VITE_BASE_API || 'http://localhost:3001/api/Commit'

const result = ref([])
const fetch = async () => {
    try{
        const res = await axios.get(`${api}/show_eva`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}
const add = (id_eva:number) => {
    router.push({path:`/Save_score/${id_eva}`})
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