const Discord = require('discord.js');
const fetch = require('node-fetch');
const auth = require('./auth.json');
const config = require('./config.json');
const bot = new Discord.Client();
const onReady = require('./events/ready')

bot.on('ready', () => {
    onReady(bot);
});

bot.on('message', async msg => {

    if (!msg.content.startsWith(config.prefix) || msg.author.bot === true) return;

    if (msg.content.startsWith("!fbr")) {
        const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);

        do {
            if (config.platforms.includes(args[1]) && args.length === 3) {
                msg.channel.startTyping();

                try {
                    let platformSelected = args[1]
                    let userSelected = args[2].toLowerCase();
                    let user = await getUserByPlatform(userSelected, platformSelected);
                    let json = await user.json();

                    if (json.error) {
                        throw new Error('Player not Found');
                    }
                    let found = json.lifeTimeStats.find((el) => el.key === 'Wins')
                    msg.reply(`${found.value} wins`);

                } catch (error) {
                    msg.reply(`:x: ${error}`);
                    msg.channel.stopTyping();
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
        .catch(error => false)
}


bot.login(auth.discordToken);