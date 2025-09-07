module.exports = {
    generateUniqueCode: function (context, events, done) {
        const randomNum = Math.floor(Math.random() * 999) + 1;
        context.vars.uniqueCode = `S${randomNum}-${Date.now()}`;
        return done();
    },
    
    generateUniqueEmail: function (context, events, done) {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 9999) + 1;
        context.vars.uniqueEmail = `testuser${randomNum}-${timestamp}@example.com`;
        return done();
    },
    
    generateUniqueName: function (context, events, done) {
        const adjectives = ['Test', 'Sample', 'Demo', 'Trial', 'Example', 'Mock', 'Fake', 'Dummy'];
        const nouns = ['Syllabus', 'Class', 'Subject', 'Chapter', 'Lesson', 'Course', 'Module', 'Unit'];
        const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const timestamp = Date.now();
        context.vars.uniqueName = `${randomAdj} ${randomNoun} ${timestamp}`;
        return done();
    }
};
