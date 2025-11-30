<template>
    <v-container fluid class="py-10">
        <v-card class="pa-4">
            <h1 class="text-h5 text-center font-weight-bold text-maroon">Dashboard - Staff</h1>
            <br>
            <v-row>
                <v-col cols="12" md="4" v-for="b in box" :key="b">
                    <v-card elevation="5" class="pa-4">
                        <div class="">{{ b.label }}</div>
                        <div class="text-h3 font-weight-bold">{{ b.value }}</div>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" v-for="b in box2" :key="b">
                    <v-card elevation="5" class="pa-4">
                        <div class="">{{ b.label }}</div>
                        <div class="text-h3 font-weight-bold">{{ b.value }}</div>
                    </v-card>
                </v-col>
            </v-row>

            <br>
            <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">ผู้รับการประเมิน</th>
                                <th class="border text-center">รอบการประเมิน</th>
                                <th class="border text-center">วันที่ออกแบบประเมิน</th>
                                <th class="border text-center">สถานะการประเมิน</th>
                              
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
const api = import.meta.env?.VITE_BASE_API || 'http://localhost:3001/api'

const box = ref([])
const box2 = ref([])
const result = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/dashboard/staff`,{headers: {Authorization : `Bearer ${token}`}})
        box.value = res.data.box
        const r = await axios.get(`${api}/dashboard/staff`,{headers: {Authorization : `Bearer ${token}`}})
        box2.value = r.data.box2
        const s = await axios.get(`${api}/Staff/List`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = s.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const bg = (status_eva:number) => {
    if(status_eva === 1) return 'blue'
    if(status_eva === 3) return 'warning'
    if(status_eva === 3) return 'success'
}

onMounted(fetch)
</script>

<style scoped>

</style>