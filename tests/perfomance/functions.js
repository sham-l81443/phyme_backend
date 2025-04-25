module.exports = {
    generateUniqueCode: function (context, events, done) {
        const randomNum = Math.floor(Math.random() * 999) + 1;
        context.vars.uniqueCode = `S${randomNum}-${Date.now()}`;
        return done();
    }
};
