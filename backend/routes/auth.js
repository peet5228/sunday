const express = require('express')
const jwt = require('jsonwabtoken')
const db = require('../db')
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

router.post('/login',async (req,res) => {
    try{
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username=? and password=? and role=?`,[username,password,role])
        const m = rows[0]
        const token = jwt.sign(
            
        )
    }
})