const express = require('express')
const db = require('../../db')
const router = express.Router()
const path = rerquire('path')
const fs = require('fs')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

const uploadDir = path.join(__dirname,'../../uploads/document')

// =============== Demo ====================
// API สำหรับ Get ข้อมูล
// router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try{
        // const [rows] = await db.query(``)
//         res.json(rows)
//     }catch(err){
//         console.error("Error Get",err)
//         res.status(500).json({message:'Error Get'})
//     }
// })
// =============== Demo ====================


module.exports = router