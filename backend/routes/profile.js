const express = require('express')
const db = require('../db')
const jwt = require('jsonwebtoken')
const {verifyToken} = require('../middleware/authMiddleware')

router.get('/',verifyToken,async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member where id_member=?`,
            [id_member]
        )
        res.json(rows[0])
    }catch(err){
        console.error('GET User Failed',err)
        res.status(500).json({message:'GET User Failed'})
    }
})

module.exports = router