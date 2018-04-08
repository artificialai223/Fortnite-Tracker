const Discord = require('discord.js');
const fetch = require('node-fetch');
const auth = require('./auth.json');
const config = require('./config.json');

const bot = new Discord.Client();

bot.on('ready', () => {
    if (!bot.user.avatar) {
        bot.user.setAvatar('./avatar.png').catch('error' + console.error);
    }
    bot.user.setActivity('YouTube', { type: 'WATCHING' })
        .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
        .catch(console.error);
});

bot.on('message', async msg => {

    if (!msg.content.startsWith(config.prefix) || msg.author.bot === true) return;

    if (msg.content.startsWith("!fbr")) {
        const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);

        do {
            if (config.platforms.includes(args[1]) && args.length === 3) {

                try {
                    let platformSelected = args[1]
                    let userSelected = args[2].toLowerCase();
                    let user = await getUserByPlatform(userSelected, platformSelected);
                    let json = await user.json();
                    var found = json.lifeTimeStats.find((el) => el.key === 'Wins')
                    msg.reply(`${found.value} wins`);

                } catch (error) {
                    console.log(error);
                }
                break;
            }
        } while (0)
    }
});

const getUserByPlatform = (user, platform = config.platforms[0]) => {
        return fetch(`https://api.fortnitetracker.com/v1/profile/${platform}/${user}`, {
            method: 'GET',
            headers: {
                'TRN-Api-Key': auth.fortniteToken
            },
        })
        .then(res => res)
        .catch(error => reject(error))
}

bot.login(auth.discordToken);