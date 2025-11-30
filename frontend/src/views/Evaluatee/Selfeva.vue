<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form>
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,index1) in topics" :key="topic.id_topic" class="mt-2">
                        <v-col cols="12">
                            <h1 class="text-h6 font-weight-bold">{{ index1+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="p-2">
                                <v-row v-for="(indicate,index2) in topic.indicate" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        <p>
                                            {{ index1+1 }}.{{ index2+1 }} {{ indicate.name_indicate }} น้ำหนักคะแนน {{ indicate.point_indicate }} คะแนนเต็ม {{ indicate.point_indicate*4 }} รายละเอียดตัวชี้วัด {{ indicate.detail_indicate }}
                                        </p>
                                        <v-textarea label="คำอธิบายเพิ่มเติม(ถ้ามี)" rows="12" v-model="indicate.detail_eva"></v-textarea>
                                        <v-text-field label="แนบไฟล์" @change="onFileChange($event,topic.id_topic,indicate.id_indicate)" accept="image/*,.pdf"></v-text-field>
                                        <v-select v-if="indicate.check_indicate === 'y'" v-model="indicate.score" label="ใส่คะแนนประเมิน" :items="[1,2,3,4]" ></v-select>
                                        <v-text-field v-else v-model="indicate.score" label="ใส่คะแนนประเมิน" type="number" ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
const token = localStorage.getItem('token')
const user = ref({})
const topics = ref([])
const fetchUser = async () =>{
    try{
        const res = await axios.get(`http://localhost:3001/api/Eva/selfeva`,{
            headers:{Authorization:`Bearer ${token}`}
        })
        user.value = res.data
    }catch(err){
        console.error('โหลดข้อมูลไม่สำเร็จ',err)
    }
}
onMounted(fetchUser)
</script>

<style scoped>

</style>