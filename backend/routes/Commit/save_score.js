const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken} = require('../../middleware/authMiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')

router.get('/:id_eva',verifyToken,async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error('GET User Failed',err)
        res.status(500).json({message:'GET User Failed'})
    }
})

router.get('/indicate/:id_eva',verifyToken,async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and status_eva=? and id_eva=?`,
            [1,id_eva]
        )
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    }catch(err){
        console.error('GET User Failed',err)
        res.status(500).json({message:'GET User Failed'})
    }
})

router.post('/:id_eva',verifyToken,async (req,res) =>{
    try{
        const id_member = req.user.id_member
        const scores = JSON.parse(req.body.scores)
        const detail_commit = req.body.detail_commit
        const id_eva = req.params.id_eva
        const [[CommitRow]] = await db.query(`select * from tb_commit where id_member=? and id_eva=?`,
            [id_member,id_eva]
        )
        var statusCommit = 0
        if(CommitRow.level_commit === 'ประธาน'){
            statusCommit=2
        }else if(CommitRow.level_commit === 'กรรมการ'){
            statusCommit=3
        }else if(CommitRow.level_commit === 'เลขา'){
            statusCommit=4
        }
        for(const item of scores){
            await db.query(
                `insert into tb_evadetail (id_eva,id_indicate,status_eva,score_commit) values(?,?,?,?)`,
                [id_eva,item.id_indicate,statusCommit,item.score]
            )
        }
        const [[sumRow]] = await db.query(
            `select coalesce(sum(score_member*(select i.point_indicate from tb_indicate i where i.id_indicate=d.id_indicate)),0) as total
            from tb_evadetail d where id_eva=?`,[id_eva]
        )
        await db.query(
            `update tb_eva set total_eva=?,status_eva=? where id_eva=?`,
            [sumRow.total,2,id_eva]
        )
        res.json({message:'บันทึกสำเร็จ'})
    }catch(err){
        console.error('POST Score Failed',err)
        res.status(500).json({message:'POST Score Failed'})
    }
})

module.exports = router