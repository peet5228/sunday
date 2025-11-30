<template>
    <v-container fluid class="py-10">
                <h1 class="text-h5 text-center font-weight-bold text-maroon">จัดการกรรมการประเมิน</h1>
                <v-card class="pa-4">
                <v-form @submit.prevent="saveMember">
                        <hr class="mt-4">
                        <v-row class="mt-4">
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.first_name" :error-messages="error.first_name" label="ชื่อ"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.last_name" :error-messages="error.last_name" label="นามสกุล"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-text-field v-model="form.email" :error-messages="error.email" label="อีเมล"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.username" :error-messages="error.username" label="ชื่อผู้ใช้"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.password" type="password" :error-messages="error.password" label="รหัสผ่าน"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="form.role" :items="roles" item-title="text" item-value="value" :error-messages="error.role" label="เลือกประเภทสมาชิก"></v-select>
                            </v-col>
                            <v-col cols="12" md="6" class="text-center"><v-btn type="submit" color="blue" class="w-full text-white">{{ form.id_member ? 'อัปเดต' : 'บันทึก' }}</v-btn></v-col>
                            <v-col cols="12" md="6" class="text-center"><v-btn type="reset" color="error" class="w-full text-white">ยกเลิก</v-btn></v-col>
                        </v-row>
                    </v-form>

                    <br>

                    <v-table class="table">
                        <thead>
                            <tr class="bg-gray-400">
                                <th class="border text-center">ลำดับ</th>
                                <th class="border text-center">ชื่อ-นามสกุล</th>
                                <th class="border text-center">อีเมล</th>
                                <th class="border text-center">ชื่อผู้ใช้</th>
                                <th class="border text-center">รหัสผ่าน</th>
                                <th class="border text-center">ประเภทสมาชิก</th>
                                <th class="border text-center">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(items,index) in result" :key="items.id_member">
                                <td class="text-center border">{{ index+1 }}</td>
                                <td class="text-center border">{{ items.first_name }} {{ items.last_name }}</td>
                                <td class="text-center border">{{ items.email }}</td>
                                <td class="text-center border">{{ items.username }}</td>
                                <td class="text-center border">{{ items.password }}</td>
                                <td class="text-center border">{{ items.role }}</td>
                                <td class="text-center border">
                                    <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                    <v-btn class="text-white" size="small" color="error" @click="del(items.id_member)">ลบ</v-btn>
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
    id_member:null,
    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:'',
})

const reset = () => {
    form.value = {
        id_member:null,
        first_name:'',
        last_name:'',
        email:'',
        username:'',
        password:'',
        role:'',
    }
}

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/member/commit`,{headers: {Authorization : `Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error("Error Fetching",err)
    }
}

const roles = [
    // {text:'ฝ่ายบุคลากร',value:'ฝ่ายบุคลากร'},
    {text:'กรรมการประเมิน',value:'กรรมการประเมิน'},
    // {text:'ผู้รับการประเมินผล',value:'ผู้รับการประเมินผล'},
]

const error = ref<Record<string,string>>({})
const emailReget = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function vaildateForm(){
    error.value = {}
    const f = form.value
    if(!f.first_name.trim())error.value.first_name='กรุณากรอกชื่อ'
    if(!f.last_name.trim())error.value.last_name='กรุณากรอกชื่อ'
    if(!f.email.trim())error.value.email='กรุณากรอกชื่อ'
    else if(!emailReget.test(f.email.trim()))error.value.email='รูปแบบอีเมลไม่ถูกต้อง'
    if(!f.username.trim())error.value.username='กรุณากรอกชื่อ'
    else if(f.username.trim().length < 4)error.value.username='ต้องมีอย่างน้อย 4 ตัวอักษร'
    if(!f.password.trim())error.value.password='กรุณากรอกชื่อ'
    else if(f.password.trim().length < 6)error.value.password='ต้องมีอย่างน้อย 6 ตัวอักษร'
    if(!f.role.trim())error.value.role='กรุณาเลือกประเภทสมาชิก'
    return Object.keys(error.value).length === 0
}
const saveMember = async () =>{
    if(!vaildateForm())return
    try{
        const payload = {
            id_member:form.value.id_member,
            first_name:form.value.first_name,
            last_name:form.value.last_name,
            email:form.value.email,
            username:form.value.username,
            role:form.value.role,
            ...(form.value.password ? {password:form.value.password} : {})
        }
        if(form.value.id_member){
            await axios.put(`${api}/member/${form.value.id_member}`,payload,{headers: {Authorization : `Bearer ${token}`}})
        }else{
            await axios.post(`http://localhost:3001/api/auth/regis`,{...payload,password:form.value.password})
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

const del = async (id_member:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่?')) return
        await axios.delete(`${api}/member/${id_member}`,{headers: {Authorization : `Bearer ${token}`}})
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