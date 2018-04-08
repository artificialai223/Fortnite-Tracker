module.exports = function onReady(bot) {
    if (!bot.user.avatar) {
        bot.user.setAvatar('./avatar.png').catch('error' + console.error);
    }
    bot.user.setStatus("online");
    bot.user.setAFK(false);
    bot.user.setUsername("Fortnite Tracker");
    bot.user.setActivity('Visual Studio Code', {
        url: null,
        type: 'PLAYING'
    });
}