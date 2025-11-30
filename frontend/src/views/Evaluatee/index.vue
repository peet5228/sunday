<template>
    <v-container fluid class="py-10">
        <v-card class="pa-4">
            <h1 class="text-h5 text-center font-weight-bold text-maroon">Dashboard - Evaluatee</h1>
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
        </v-card>
    </v-container>
</template>
<script setup lang="ts">
import axios from 'axios';
import { ref,onMounted } from 'vue';


const token = localStorage.getItem('token')

const api = import.meta.env?.VITE_BASE_API || 'http://localhost:3001/api'

const box = ref([])
const box2 = ref([])
const result = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${api}/dashboard/eva`,{headers: {Authorization : `Bearer ${token}`}})
        box.value = res.data.box
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