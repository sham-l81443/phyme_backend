import { PrismaClient } from '@prisma/client'
import { createAdmin, createStudent } from './seeds/user';
import { createClass } from './seeds/class';
import { createSyllabus } from './seeds/syllabus';
import { createTerm } from './seeds/term';
import { createChapter } from './seeds/chapter';
import { createSubject } from './seeds/subject';
import { ceateStudentSubscription } from './seeds/studentSubscription';
import { createLesson } from './seeds/lesson';
const prisma = new PrismaClient()


const syllabusData = [
    { code: 'CBSE123', name: 'CBSE Curriculum', description: 'Syllabus for CBSE schools' },
    { code: 'ICSE456', name: 'ICSE Curriculum', description: 'Syllabus for ICSE schools' },
    { code: 'MOE789', name: 'MOE Curriculum', description: 'Syllabus for UAE MOE schools' },
    { code: 'IB101', name: 'IB Curriculum', description: 'Syllabus for IB schools' },
    { code: 'ALEVEL202', name: 'A-Level Curriculum', description: 'Syllabus for A-Level schools' },
];

async function main() {

    try {


        // create admin 
        await createAdmin(prisma)

    //     // create syllabus
    //     const syllabus01 = await createSyllabus({ prisma, ...syllabusData[0] })
    //     const syllabus02 = await createSyllabus({ prisma, ...syllabusData[1] })
    //     const syllabus03 = await createSyllabus({ prisma, ...syllabusData[2] })
    //     const syllabus04 = await createSyllabus({ prisma, ...syllabusData[3] })
    //     const syllabus05 = await createSyllabus({ prisma, ...syllabusData[4] })

   

    //     // create class syllabus 1
    //     const class9 = await createClass({ prisma, syllabusId: syllabus01.id, name: 'Class 9', code: 'CLASS_9', description: 'Class 1 description' })
        
    //     // create Student
    //     const student01 = await createStudent({ prisma, name: 'Student', email: 'shameel81443@gmail.com', phone: '6238830867', isTermsAccepted: true, isVerified: true, registrationType: 'DEFAULT', createdAt: new Date(), updatedAt: new Date(), syllabusId: syllabus01.id, classId: class9.id })
        
    //     // create term 
    //     const term01 = await createTerm({ prisma, name: 'Term 1', code: 'TERM_1', description: 'Term 1 description', classId: class9.id })
    //     const term02 = await createTerm({ prisma, name: 'Term 2', code: 'TERM_2', description: 'Term 2 description', classId: class9.id })

    //     // create subject
    //     const subject01 = await createSubject({ prisma, name: 'Physics', code: 'PHYSICS9', description: 'Subject 1 description', classId: class9.id })
    //     const subject02 = await createSubject({ prisma, name: 'Chemistry', code: 'CHEMISTRY9', description: 'Subject 2 description', classId: class9.id })
    //     const subject03 = await createSubject({ prisma, name: 'Mathematics', code: 'MATHS9', description: 'Subject 3 description', classId: class9.id })
    //     const subject04 = await createSubject({ prisma, name: 'Biology', code: 'BIOLOGY9', description: 'Subject 4 description', classId: class9.id })
    //     const subject05 = await createSubject({ prisma, name: 'English', code: 'ENGLISH9', description: 'Subject 5 description', classId: class9.id })



    //     // chapter

    //     const chapter01 = await createChapter({ prisma, name: 'Chapter 1', code: 'CHAPTER_1', description: 'Chapter 1 description', subjectId: subject01.id, termId: term01.id })
    //     const chapter02 = await createChapter({ prisma, name: 'Chapter 2', code: 'CHAPTER_2', description: 'Chapter 2 description', subjectId: subject01.id, termId: term01.id })
    //     const chapter03 = await createChapter({ prisma, name: 'Chapter 3', code: 'CHAPTER_3', description: 'Chapter 3 description', subjectId: subject01.id, termId: term01.id })
    //     const chapter04 = await createChapter({ prisma, name: 'Chapter 4', code: 'CHAPTER_4', description: 'Chapter 4 description', subjectId: subject01.id, termId: term01.id })
    //     const chapter05 = await createChapter({ prisma, name: 'Chapter 5', code: 'CHAPTER_5', description: 'Chapter 5 description', subjectId: subject01.id, termId: term02.id })



    //     // student subscription
    //     await ceateStudentSubscription({ prisma, studentId: student01.id, termId: term01.id })
    //     await ceateStudentSubscription({ prisma, studentId: student01.id, termId: term02.id })

    //     // lesson
        
    //    const lesson01 = await createLesson({ prisma, lessonData: { name: 'Lesson 1', code: 'LESSON_1', chapterId: chapter01.id, description: 'Lesson 1 description' } })
    //    const lesson02 = await createLesson({ prisma, lessonData: { name: 'Lesson 2', code: 'LESSON_2', chapterId: chapter01.id, description: 'Lesson 2 description' } })
    //    const lesson03 = await createLesson({ prisma, lessonData: { name: 'Lesson 3', code: 'LESSON_3', chapterId: chapter01.id, description: 'Lesson 3 description' } })
    //    const lesson04 = await createLesson({ prisma, lessonData: { name: 'Lesson 4', code: 'LESSON_4', chapterId: chapter04.id, description: 'Lesson 4 description' } })
    //    const lesson05 = await createLesson({ prisma, lessonData: { name: 'Lesson 5', code: 'LESSON_5', chapterId: chapter04.id, description: 'Lesson 5 description' } })



    //    const video01 = await prisma.video.create({
    //         data: {
    //             name: 'Video 1',
    //             code: 'VIDEO_1',
    //             lessonId: lesson01.id,
    //             description: 'Video 1 description',
    //             embedLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    //             duration: '00:10:00',
    //             thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    //             isFree: true,
    //             isActive: true,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         }
    //     })

    //     const video02 = await prisma.video.create({
    //         data: {
    //             name: 'Video 2',
    //             code: 'VIDEO_2',
    //             lessonId: lesson01.id,
    //             description: 'Video 2 description',
    //             embedLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    //             duration: '00:10:00',
    //             thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    //             isFree: true,
    //             isActive: true,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         }
    //     })

    //     const video03 = await prisma.video.create({
    //         data: {
    //             name: 'Video 3',
    //             code: 'VIDEO_3',
    //             lessonId: lesson01.id,
    //             description: 'Video 3 description',
    //             embedLink: 'https://youtu.be/mSDoMU67vqg',
    //             duration: '00:10:00',
    //             thumbnail: 'https://i.ytimg.com/vi/mSDoMU67vqg/maxresdefault.jpg',
    //             isFree: true,
    //             isActive: true,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         }
    //     })

    //     const video04 = await prisma.video.create({
    //         data: {
    //             name: 'Video 4',
    //             code: 'VIDEO_4',
    //             lessonId: lesson04.id,
    //             description: 'Video 4 description',
    //             embedLink: 'https://youtu.be/J7AYMDz70QA',
    //             duration: '00:10:00',
    //             thumbnail: 'https://i.ytimg.com/vi/J7AYMDz70QA/maxresdefault.jpg',
    //             isFree: true,
    //             isActive: true,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         }
    //     })

    //     const video05 = await prisma.video.create({
    //         data: {
    //             name: 'Video 5',
    //             code: 'VIDEO_5',
    //             lessonId: lesson04.id,
    //             description: 'Video 5 description',
    //             embedLink: 'https://youtu.be/YvJKdyNlq7Q',
    //             duration: '00:10:00',
    //             thumbnail: 'https://i.ytimg.com/vi/YvJKdyNlq7Q/maxresdefault.jpg',
    //             isFree: true,
    //             isActive: true,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //         }
    //     })

    } catch (e) {

        console.log(e)

    }



    console.log('Seed data for students added successfully!')
}

main()
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
