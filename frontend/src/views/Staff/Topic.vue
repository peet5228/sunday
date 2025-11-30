<template>
    <v-container fluid class="py-10">
                <h1 class="text-h5 text-center font-weight-bold text-maroon">จัดการหัวข้อการประเมิน</h1>
                <v-card class="pa-4">
                <v-form @submit.prevent="saveMember">
                        <hr class="mt-4">
                        <v-row class="mt-4">
                            <v-col cols="12" md="12">
                                <v-text-field v-model="form.name_topic" :error-messages="error.name_topic" label="ชื่อหัวข้อกาประเมิน"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6" class="text-center"><v-btn type="submit" color="blue" class="w-full text-white">{{ form.id_topic ? 'อัปเดต' : 'บันทึก' }}</v-btn></v-col>
                            <v-col cols="12" md="6" class="text-center"><v-btn type="reset" color="error" class="w-full text-white">ยกเลิก</v-btn></v-col>
                        </v-row>
                    </v-form>

                    <br>

                    <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">หัวข้อการประเมิน</th>
                                <th class="border text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(items,index) in result" :key="items.id_topic">
                                <td class="text-center border">{{ index+1 }}</td>
                                <td class="text-center border">{{ items.name_topic }}</td>
                                <td class="text-center border">
                                    <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                    <v-btn class="text-white" size="small" color="error" @click="del(items.id_topic)">ลบ</v-btn>
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

const form = ref({
    id_topic:null,
    name_topic:'',
})

const reset = () => {
    form.value = {
        id_topic:null,
    name_topic:'',
    }
}

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/topic`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}


const error = ref<Record<string,string>>({})
function vaildateForm(){
    error.value = {}
    const f = form.value
    if(!f.name_topic)error.value.name_topic='กรุณากรอกชื่อหัวข้อการประเมิน'
    return Object.keys(error.value).length === 0
}
const saveMember = async () =>{
    if(!vaildateForm())return
    try{
        if(form.value.id_topic){
            await axios.put(`${api}/topic/${form.value.id_topic}`,form.value,{headers: {Authorization : `Bearer ${token}`}})
        }else{
            await axios.post(`${api}/topic`,form.value,{headers: {Authorization : `Bearer ${token}`}})
        }
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('ทำรายการไม่สำเร็จ',err)
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const del = async (id_topic:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่?')) return
        await axios.delete(`${api}/topic/${id_topic}`,{headers: {Authorization : `Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error('ลบไม่สำเร็จ',err)
    }
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