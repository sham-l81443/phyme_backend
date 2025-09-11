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
        console.log('🌱 Starting comprehensive database seeding...');

        // Create admin
        console.log('👤 Creating admin user...');
        const admin = await createAdmin(prisma);
        console.log('✅ Admin created successfully');

        // Create syllabus
        console.log('📚 Creating syllabi...');
        const syllabus01 = await createSyllabus({ prisma, ...syllabusData[0] });
        const syllabus02 = await createSyllabus({ prisma, ...syllabusData[1] });
        const syllabus03 = await createSyllabus({ prisma, ...syllabusData[2] });
        console.log('✅ Syllabi created successfully');

        // Create classes
        console.log('🏫 Creating classes...');
        const class9 = await createClass({ prisma, syllabusId: syllabus01.id, name: 'Class 9', code: 'CLASS_9', description: 'Class 9 description' });
        const class10 = await createClass({ prisma, syllabusId: syllabus01.id, name: 'Class 10', code: 'CLASS_10', description: 'Class 10 description' });
        console.log('✅ Classes created successfully');

        // Create students
        console.log('👥 Creating students...');
        const student01 = await createStudent({ 
            prisma, 
            name: 'Ahmed Al-Rashid', 
            email: 'ahmed.rashid@student.com', 
            phone: '0501234567', 
            isTermsAccepted: true, 
            isVerified: true, 
            registrationType: 'DEFAULT', 
            createdAt: new Date(), 
            updatedAt: new Date(), 
            syllabusId: syllabus01.id, 
            classId: class9.id 
        });
        
        const student02 = await createStudent({ 
            prisma, 
            name: 'Fatima Hassan', 
            email: 'fatima.hassan@student.com', 
            phone: '0502345678', 
            isTermsAccepted: true, 
            isVerified: true, 
            registrationType: 'DEFAULT', 
            createdAt: new Date(), 
            updatedAt: new Date(), 
            syllabusId: syllabus01.id, 
            classId: class9.id 
        });
        console.log('✅ Students created successfully');

        // Create terms
        console.log('📅 Creating terms...');
        const term01 = await createTerm({ prisma, name: 'Term 1', code: 'TERM_1', description: 'First term of the academic year', classId: class9.id });
        const term02 = await createTerm({ prisma, name: 'Term 2', code: 'TERM_2', description: 'Second term of the academic year', classId: class9.id });
        console.log('✅ Terms created successfully');

        // Create subjects
        console.log('📖 Creating subjects...');
        const physics9 = await createSubject({ prisma, name: 'Physics', code: 'PHYSICS9', description: 'Physics for Class 9', classId: class9.id });
        const chemistry9 = await createSubject({ prisma, name: 'Chemistry', code: 'CHEMISTRY9', description: 'Chemistry for Class 9', classId: class9.id });
        const maths9 = await createSubject({ prisma, name: 'Mathematics', code: 'MATHS9', description: 'Mathematics for Class 9', classId: class9.id });
        console.log('✅ Subjects created successfully');

        // Create chapters
        console.log('📑 Creating chapters...');
        const physicsCh1 = await createChapter({ prisma, name: 'Motion and Forces', code: 'PHYS_CH1', description: 'Introduction to motion and forces', subjectId: physics9.id, termId: term01.id });
        const physicsCh2 = await createChapter({ prisma, name: 'Energy and Work', code: 'PHYS_CH2', description: 'Understanding energy and work', subjectId: physics9.id, termId: term01.id });
        const chemistryCh1 = await createChapter({ prisma, name: 'Atomic Structure', code: 'CHEM_CH1', description: 'Structure of atoms', subjectId: chemistry9.id, termId: term01.id });
        const mathsCh1 = await createChapter({ prisma, name: 'Algebra Basics', code: 'MATH_CH1', description: 'Fundamental algebra concepts', subjectId: maths9.id, termId: term01.id });
        console.log('✅ Chapters created successfully');

        // Create student subscriptions
        console.log('🎫 Creating student subscriptions...');
        await ceateStudentSubscription({ prisma, studentId: student01.id, termId: term01.id });
        await ceateStudentSubscription({ prisma, studentId: student01.id, termId: term02.id });
        await ceateStudentSubscription({ prisma, studentId: student02.id, termId: term01.id });
        await ceateStudentSubscription({ prisma, studentId: student02.id, termId: term02.id });
        console.log('✅ Student subscriptions created successfully');

        // Create lessons
        console.log('📝 Creating lessons...');
        const lesson01 = await createLesson({ prisma, lessonData: { name: 'Introduction to Motion', code: 'LESSON_1', chapterId: physicsCh1.id, description: 'Basic concepts of motion and velocity' } });
        const lesson02 = await createLesson({ prisma, lessonData: { name: 'Newton\'s Laws', code: 'LESSON_2', chapterId: physicsCh1.id, description: 'Understanding Newton\'s three laws of motion' } });
        const lesson03 = await createLesson({ prisma, lessonData: { name: 'Kinetic and Potential Energy', code: 'LESSON_3', chapterId: physicsCh2.id, description: 'Different forms of energy' } });
        const lesson04 = await createLesson({ prisma, lessonData: { name: 'Atomic Models', code: 'LESSON_4', chapterId: chemistryCh1.id, description: 'Historical development of atomic models' } });
        const lesson05 = await createLesson({ prisma, lessonData: { name: 'Linear Equations', code: 'LESSON_5', chapterId: mathsCh1.id, description: 'Solving linear equations with one variable' } });
        console.log('✅ Lessons created successfully');

        // Create videos
        console.log('🎥 Creating videos...');
        const videos = [
            {
                name: 'Introduction to Motion - Part 1',
                code: 'VIDEO_1',
                lessonId: lesson01.id,
                description: 'Basic concepts of motion and velocity explained with examples',
                embedLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '00:15:30',
                thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                isFree: true,
                isActive: true,
            },
            {
                name: 'Newton\'s First Law',
                code: 'VIDEO_2',
                lessonId: lesson02.id,
                description: 'Understanding inertia and Newton\'s first law of motion',
                embedLink: 'https://www.youtube.com/embed/mSDoMU67vqg',
                duration: '00:12:45',
                thumbnail: 'https://i.ytimg.com/vi/mSDoMU67vqg/maxresdefault.jpg',
                isFree: true,
                isActive: true,
            },
            {
                name: 'Energy Conservation',
                code: 'VIDEO_3',
                lessonId: lesson03.id,
                description: 'Law of conservation of energy with practical examples',
                embedLink: 'https://www.youtube.com/embed/YvJKdyNlq7Q',
                duration: '00:20:15',
                thumbnail: 'https://i.ytimg.com/vi/YvJKdyNlq7Q/maxresdefault.jpg',
                isFree: true,
                isActive: true,
            }
        ];

        for (const videoData of videos) {
            await prisma.video.create({
                data: {
                    ...videoData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
        }
        console.log('✅ Videos created successfully');

        // Create PDFs
        console.log('📄 Creating PDFs...');
        const pdfs = [
            {
                name: 'Motion and Forces Notes',
                fileName: 'motion_forces_notes.pdf',
                originalName: 'motion_forces_notes.pdf',
                filePath: '/pdfs/motion_forces_notes.pdf',
                fileSize: 2048576, // 2MB
                mimeType: 'application/pdf',
                lessonId: lesson01.id,
                isActive: true,
            },
            {
                name: 'Newton\'s Laws Worksheet',
                fileName: 'newtons_laws_worksheet.pdf',
                originalName: 'newtons_laws_worksheet.pdf',
                filePath: '/pdfs/newtons_laws_worksheet.pdf',
                fileSize: 1536000, // 1.5MB
                mimeType: 'application/pdf',
                lessonId: lesson02.id,
                isActive: true,
            }
        ];

        for (const pdfData of pdfs) {
            await prisma.pdf.create({
                data: {
                    ...pdfData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
        }
        console.log('✅ PDFs created successfully');

        // Create Notes
        console.log('📝 Creating notes...');
        const notes = [
            {
                title: 'Key Concepts of Motion',
                content: 'Motion is the change in position of an object with respect to time. Velocity is the rate of change of displacement.',
                lessonId: lesson01.id,
                isActive: true,
            },
            {
                title: 'Newton\'s Laws Summary',
                content: '1. An object at rest stays at rest. 2. F = ma. 3. For every action, there is an equal and opposite reaction.',
                lessonId: lesson02.id,
                isActive: true,
            }
        ];

        for (const noteData of notes) {
            await prisma.note.create({
                data: {
                    ...noteData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
        }
        console.log('✅ Notes created successfully');

        // Create Questions
        console.log('❓ Creating questions...');
        const questions = [
            // Physics Questions
            {
                content: 'What is the SI unit of velocity?',
                type: 'MULTIPLE_CHOICE' as const,
                difficulty: 'EASY' as const,
                points: 1,
                explanation: 'Velocity is measured in meters per second (m/s) in the SI system.',
                tags: ['physics', 'motion', 'units'],
                createdBy: admin.id,
                answers: [
                    { content: 'm/s', isCorrect: true, order: 0 },
                    { content: 'm/s²', isCorrect: false, order: 1 },
                    { content: 'N', isCorrect: false, order: 2 },
                    { content: 'J', isCorrect: false, order: 3 }
                ]
            },
            {
                content: 'According to Newton\'s first law, an object at rest will remain at rest unless acted upon by an external force.',
                type: 'TRUE_FALSE' as const,
                difficulty: 'EASY' as const,
                points: 1,
                explanation: 'This is the correct statement of Newton\'s first law of motion.',
                tags: ['physics', 'newtons-laws', 'motion'],
                createdBy: admin.id,
                answers: [
                    { content: 'True', isCorrect: true, order: 0 },
                    { content: 'False', isCorrect: false, order: 1 }
                ]
            },
            {
                content: 'Calculate the kinetic energy of a 2kg object moving at 5 m/s.',
                type: 'FILL_IN_BLANK' as const,
                difficulty: 'MEDIUM' as const,
                points: 2,
                explanation: 'KE = 1/2 mv² = 1/2 × 2 × 5² = 25 J',
                tags: ['physics', 'energy', 'calculation'],
                createdBy: admin.id,
                answers: [
                    { content: '25 J', isCorrect: true, order: 0 },
                    { content: '25 joules', isCorrect: true, order: 1 },
                    { content: '25J', isCorrect: true, order: 2 }
                ]
            },
            {
                content: 'Explain the difference between static and kinetic friction.',
                type: 'SHORT_ANSWER' as const,
                difficulty: 'MEDIUM' as const,
                points: 3,
                explanation: 'Static friction acts on objects at rest, while kinetic friction acts on moving objects. Static friction is generally greater than kinetic friction.',
                tags: ['physics', 'friction', 'forces'],
                createdBy: admin.id,
                answers: []
            },
            // Chemistry Questions
            {
                content: 'How many electrons can the first energy level hold?',
                type: 'MULTIPLE_CHOICE' as const,
                difficulty: 'EASY' as const,
                points: 1,
                explanation: 'The first energy level can hold a maximum of 2 electrons.',
                tags: ['chemistry', 'atomic-structure', 'electrons'],
                createdBy: admin.id,
                answers: [
                    { content: '2', isCorrect: true, order: 0 },
                    { content: '8', isCorrect: false, order: 1 },
                    { content: '18', isCorrect: false, order: 2 },
                    { content: '32', isCorrect: false, order: 3 }
                ]
            },
            // Mathematics Questions
            {
                content: 'Solve for x: 2x + 5 = 13',
                type: 'FILL_IN_BLANK' as const,
                difficulty: 'EASY' as const,
                points: 1,
                explanation: '2x + 5 = 13, so 2x = 8, therefore x = 4',
                tags: ['mathematics', 'algebra', 'linear-equations'],
                createdBy: admin.id,
                answers: [
                    { content: '4', isCorrect: true, order: 0 },
                    { content: 'x = 4', isCorrect: true, order: 1 }
                ]
            }
        ];

        for (const questionData of questions) {
            const { answers, ...questionInfo } = questionData;
            const question = await prisma.question.create({
                data: {
                    ...questionInfo,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    answers: {
                        create: answers.map(answer => ({
                            ...answer,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }))
                    }
                }
            });
        }
        console.log('✅ Questions created successfully');

        // Create Quizzes
        console.log('🧩 Creating quizzes...');
        const quizzes = [
            {
                title: 'Motion and Forces Quiz',
                description: 'Test your understanding of basic motion concepts and Newton\'s laws',
                lessonId: lesson01.id,
                createdBy: admin.id,
                isTimed: true,
                timeLimit: 30, // 30 minutes
                isActive: true,
                allowRetake: true,
                maxAttempts: 2,
                hasNegativeMarking: false,
                paceType: 'NORMAL' as const,
                difficulty: 'EASY' as const,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
            {
                title: 'Energy and Work Assessment',
                description: 'Comprehensive assessment on energy concepts and calculations',
                lessonId: lesson03.id,
                createdBy: admin.id,
                isTimed: true,
                timeLimit: 45, // 45 minutes
                isActive: true,
                allowRetake: true,
                maxAttempts: 2,
                hasNegativeMarking: true,
                negativeMarkRatio: 0.25,
                paceType: 'NORMAL' as const,
                difficulty: 'MEDIUM' as const,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            {
                title: 'Atomic Structure Quick Test',
                description: 'Quick test on atomic structure and electron configuration',
                lessonId: lesson04.id,
                createdBy: admin.id,
                isTimed: false,
                isActive: true,
                allowRetake: true,
                maxAttempts: 3,
                hasNegativeMarking: false,
                paceType: 'FAST' as const,
                difficulty: 'EASY' as const,
                startDate: new Date(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            }
        ];

        for (const quizData of quizzes) {
            await prisma.quiz.create({
                data: {
                    ...quizData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            });
        }
        console.log('✅ Quizzes created successfully');

        // Assign questions to quizzes
        console.log('🔗 Assigning questions to quizzes...');
        const createdQuestions = await prisma.question.findMany();
        const createdQuizzes = await prisma.quiz.findMany();

        // Assign physics questions to physics quiz
        const physicsQuiz = createdQuizzes.find(q => q.title.includes('Motion and Forces'));
        const physicsQuestions = createdQuestions.filter(q => q.tags.includes('physics'));
        
        if (physicsQuiz && physicsQuestions.length > 0) {
            for (let i = 0; i < Math.min(3, physicsQuestions.length); i++) {
                await prisma.quizQuestion.create({
                    data: {
                        quizId: physicsQuiz.id,
                        questionId: physicsQuestions[i].id,
                        order: i,
                        points: physicsQuestions[i].points,
                    }
                });
            }
        }

        // Assign energy questions to energy quiz
        const energyQuiz = createdQuizzes.find(q => q.title.includes('Energy and Work'));
        const energyQuestions = createdQuestions.filter(q => q.tags.includes('energy'));
        
        if (energyQuiz && energyQuestions.length > 0) {
            for (let i = 0; i < Math.min(2, energyQuestions.length); i++) {
                await prisma.quizQuestion.create({
                    data: {
                        quizId: energyQuiz.id,
                        questionId: energyQuestions[i].id,
                        order: i,
                        points: energyQuestions[i].points,
                    }
                });
            }
        }

        // Assign chemistry questions to chemistry quiz
        const chemistryQuiz = createdQuizzes.find(q => q.title.includes('Atomic Structure'));
        const chemistryQuestions = createdQuestions.filter(q => q.tags.includes('chemistry'));
        
        if (chemistryQuiz && chemistryQuestions.length > 0) {
            for (let i = 0; i < Math.min(2, chemistryQuestions.length); i++) {
                await prisma.quizQuestion.create({
                    data: {
                        quizId: chemistryQuiz.id,
                        questionId: chemistryQuestions[i].id,
                        order: i,
                        points: chemistryQuestions[i].points,
                    }
                });
            }
        }
        console.log('✅ Questions assigned to quizzes successfully');

        // Create some quiz attempts for demonstration
        console.log('📊 Creating sample quiz attempts...');
        if (physicsQuiz) {
            const physicsQuizAttempts = [
                {
                    quizId: physicsQuiz.id,
                    studentId: student01.id,
                    attemptNumber: 1,
                    status: 'COMPLETED' as const,
                    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000), // 25 minutes later
                    totalScore: 2.5,
                    maxScore: 3,
                    percentage: 83.33,
                    correctAnswers: 2,
                    wrongAnswers: 1,
                    skippedAnswers: 0,
                    timeSpent: 1500, // 25 minutes in seconds
                },
                {
                    quizId: physicsQuiz.id,
                    studentId: student02.id,
                    attemptNumber: 1,
                    status: 'COMPLETED' as const,
                    startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000), // 20 minutes later
                    totalScore: 3,
                    maxScore: 3,
                    percentage: 100,
                    correctAnswers: 3,
                    wrongAnswers: 0,
                    skippedAnswers: 0,
                    timeSpent: 1200, // 20 minutes in seconds
                }
            ];

            for (const attemptData of physicsQuizAttempts) {
                await prisma.quizAttempt.create({
                    data: {
                        ...attemptData,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                });
            }
        }
        console.log('✅ Sample quiz attempts created successfully');

        // Create quiz performance records
        console.log('📈 Creating quiz performance records...');
        if (physicsQuiz) {
            const performanceRecords = [
                {
                    quizId: physicsQuiz.id,
                    studentId: student01.id,
                    bestScore: 2.5,
                    bestPercentage: 83.33,
                    totalAttempts: 1,
                    averageScore: 2.5,
                    averageTime: 1500,
                    scoreImprovement: 0,
                    lastAttemptAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                },
                {
                    quizId: physicsQuiz.id,
                    studentId: student02.id,
                    bestScore: 3,
                    bestPercentage: 100,
                    totalAttempts: 1,
                    averageScore: 3,
                    averageTime: 1200,
                    scoreImprovement: 0,
                    lastAttemptAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                }
            ];

            for (const performanceData of performanceRecords) {
                await prisma.quizPerformance.create({
                    data: {
                        ...performanceData,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    }
                });
            }
        }
        console.log('✅ Quiz performance records created successfully');

        console.log('🎉 Comprehensive database seeding completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - 1 Admin user`);
        console.log(`   - 2 Students`);
        console.log(`   - 3 Syllabi`);
        console.log(`   - 2 Classes`);
        console.log(`   - 2 Terms`);
        console.log(`   - 3 Subjects`);
        console.log(`   - 4 Chapters`);
        console.log(`   - 5 Lessons`);
        console.log(`   - 3 Videos`);
        console.log(`   - 2 PDFs`);
        console.log(`   - 2 Notes`);
        console.log(`   - 6 Questions`);
        console.log(`   - 3 Quizzes`);
        console.log(`   - 2 Quiz Attempts`);
        console.log(`   - 2 Performance Records`);

    } catch (e) {
        console.error('❌ Error during seeding:', e);
        throw e;
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Database connection closed');
    });
