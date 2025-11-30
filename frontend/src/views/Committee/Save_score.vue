<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form @submit.prevent="saveScore">
                    <h1 class="text-h5 font-weight-bold">แบบประเมินตนเอง</h1>
                    <v-card class="pa-2 mt-2">
                        <p>ชื่อ : {{ user.first_name }} {{ user.last_name }}</p>
                        <p>รอบประเมินที่ : {{ user.round_sys }} ปี {{ user.year_sys }}</p>
                    </v-card>
                    <v-row v-for="(topic,index1) in topics" :key="topic.id_topic" class="mt-2">
                        <v-col cols="12">
                            <h1 class="text-h6 font-weight-bold">{{ index1+1 }}.{{ topic.name_topic }}</h1>
                            <v-card class="pa-2">
                                <v-row v-for="(indicate,index2) in topic.indicates" :key="indicate.id_indicate">
                                    <v-col cols="12">
                                        <p>
                                            {{ index1+1 }}.{{ index2+1 }} {{ indicate.name_indicate }} น้ำหนักคะแนน {{ indicate.point_indicate }} คะแนนเต็ม {{ indicate.point_indicate*4 }} รายละเอียดตัวชี้วัด {{ indicate.detail_indicate }}
                                        </p>
                                        <p v-if="indicate.detail_eva" class="mt-2">คำอธิบายเพิ่มเติม : {{ indicate.detail_eva }}</p> 
                                        <p v-else class="mt-2">คำอธิบายเพิ่มเติม : <strong class="text-red">ไม่มี</strong></p>
                                        <p v-if="indicate.file_eva" class="mt-2">ไฟล์ที่แนบ : <v-btn @click="openFile(indicate.file_eva)" size="small">ดูไฟล์ที่แนบ</v-btn></p>
                                        <p v-else class="mt-2">ไฟล์ที่แนบ : <strong class="text-red">ไม่มีไฟล์</strong></p>
                                        <v-select class="mt-2" v-model="indicate.score" label="ใส่คะแนนประเมิน" :items="[1,2,3,4]" ></v-select> 
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <div class="mt-2">
                        <label class="font-weight-bold">ข้อเสนอแนะเพิ่มเติม(ถ้ามี)</label>
                        <v-textarea  rows="2" v-model="detail_commit"></v-textarea>
                    </div>
                    <div class="text-center mt-3">
                        <v-btn color="blue" type="submit">บันทึกคะแนน</v-btn>
                    </div>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter,useRoute } from 'vue-router';
const router = useRouter()
const id_eva = useRoute().params.id_eva
const detail_commit = ref('')
const token = localStorage.getItem('token')
const user = ref({})
const topics = ref([])
const fetchUser = async () =>{
    try{
        const res = await axios.get(`http://localhost:3001/api/Commit/save_score/${id_eva}`,{
            headers:{Authorization:`Bearer ${token}`}
        })
        user.value = res.data
    }catch(err){
        console.error('โหลดข้อมูลไม่สำเร็จ',err)
    }
}
const fetchTopic = async () =>{
    try{
        const res = await axios.get(`http://localhost:3001/api/Commit/save_score/indicate/${id_eva}`,{
            headers:{Authorization:`Bearer ${token}`}
        })
        topics.value = res.data
    }catch(err){
        console.error('โหลดข้อมูลไม่สำเร็จ',err)
    }
}
onMounted(async () =>{
    await Promise.all([fetchTopic(),fetchUser()])
})
const saveScore = async () =>{
    const formData = new FormData()
    const allScore = topics.value.flatMap(topic =>
        topic.indicates.map((i:any) =>{
            return{
                id_topic:topic.id_topic,
                id_indicate:i.id_indicate,
                score:i.score,
            }
        })
    )
    if(allScore.some((s) => !s.score)){
        alert('กรุณากรอกคะแนนให้ครบ')
        return
    }
    formData.append('scores',JSON.stringify(allScore))
    formData.append('detail_commit',detail_commit.value)
    try{
        await axios.post(`http://localhost:3001/api/Commit/save_score/${id_eva}`,formData,{
            headers:{Authorization:`Bearer ${token}`}
        })
        alert('บันทึกคะแนนสำเร็จ')
        router.push({path:'/Show_eva'})
        await Promise.all([fetchTopic(),fetchUser()])
    }catch(err){
        console.error('บันทึกไม่สำเร็จ',err)
    }
}
</script>

<style scoped>

</style>