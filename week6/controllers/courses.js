const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const logger = require('../utils/logger')('CoursesController')
const { isValidString } = require('../utils/validUtils')

const coursesController = {
  async getCourses (req, res, next)  {
    const findCoach = await dataSource.getRepository('User').findOne({
        where: {
            role: 'COACH'
        }
    })

        // 從教練id找到課程資料
        const findCourses = await dataSource.getRepository('Course').find({
            where: {
                user_id: findCoach.id
            }
        })
        // 從技能id找到技能資料
        const findSkill = await dataSource.getRepository('Skill').find({
            where: {
                id: findCourses.skill_id
            }
        })
        //     "data": [{
        //             "id": "1c8da31a-5fd2-44f3-897e-4a259e7ec62b",
        //             "coach_name" : "瑜珈教練",
        //             "skill_name" : "瑜伽",
        //             "name" : "瑜伽課程",
        //             "description" : "瑜伽課程介紹",
        //             "start_at" : "2025-01-01 16:00:00",
        //             "end_at" : "2025-01-01 18:00:00",
        //             "max_participants" : 10
        //         },...
        //     ]
        const result = findCourses.map(course => {
            return {
                id: course.id,
                coach_name: findCoach.name,
                skill_name: findSkill.name,
                name: course.name,
                description: course.description,
                start_at: course.start_at,
                end_at: course.end_at,
                max_participants: course.max_participants
            }
        })

    res.status(200).json({
        status: "success",
        data: result
    })
  }
}

module.exports = coursesController