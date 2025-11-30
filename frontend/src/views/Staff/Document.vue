<template>
    <v-container fluid class="py-10">
                <h1 class="text-h5 text-center font-weight-bold text-maroon">แนบเอกสารหรือคู่มือสำหรับการประเมิน</h1>
                <v-card class="pa-4">
                <v-form @submit.prevent="saveMember">
                        <hr class="mt-4">
                        <v-row class="mt-4">
                            <v-col cols="12" md="12">
                                <v-text-field v-model="name_doc"  label="ชื่อเอกสาร"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-file-input v-model="file" accept=".dox,.docx,.image/*" label="ไฟล์" />
                            </v-col>
                            <v-col cols="12" md="6" class="text-center"><v-btn type="submit" color="blue" class="w-full text-white">บันทึก</v-btn></v-col>
                            <v-col cols="12" md="6" class="text-center"><v-btn type="reset" color="error" class="w-full text-white">ยกเลิก</v-btn></v-col>
                        </v-row>
                    </v-form>

                    <br>

                    <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">ชื่อเอกสาร</th>
                                <th class="border text-center">วันที่เพิ่ม</th>
                                <th class="border text-center">ไฟล์</th>
                                <th class="border text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(items,index) in result" :key="items.id_doc">
                                <td class="text-center border">{{ index+1 }}</td>
                                <td class="text-center border">{{ items.name_doc }}</td>
                                <td class="text-center border">{{ items.day_doc }}</td>
                                <td class="text-center border">
                                    <v-btn color="warning" class="text-white" @click="view(items.file)">เปิดดู</v-btn>
                                </td>
                                <td class="text-center border">
                                    <v-btn class="text-white" size="small" color="error" @click="del(items.id_doc)">ลบ</v-btn>
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
const name_doc = ref('')
const file = ref<File | null>(null)
const formData = new FormData()

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/document`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}


const saveMember = async () =>{
    try{
       if(!name_doc.value || !file.value) return alert('กรุณากรอกชื่อเอกสารและแนบเอกสาร')
        formData.append('name_doc',name_doc.value)
        formData.append('file',file.value)
        await axios.post(`${api}/document`,formData)
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('ทำรายการไม่สำเร็จ',err)
    }
}

const del = async (id_doc:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่?')) return
        await axios.delete(`${api}/document/${id_doc}`,{headers: {Authorization : `Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error('ลบไม่สำเร็จ',err)
    }
}

const view = (filename:string) => {
    const url = new URL(`/uploads/document/${filename}`,api).href
    window.open(url,'_blank')
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