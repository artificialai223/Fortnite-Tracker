const Discord = require('discord.js');
const fetch = require('node-fetch');
const auth = require('./auth.json');
const config = require('./config.json');
const onReady = require('./events/ready');


const fortniteTracker = new Discord.Client();

fortniteTracker.on('ready', () => {
    onReady(fortniteTracker);
});

fortniteTracker.on('message', async msg => {

    if (!msg.content.startsWith(config.prefix) || msg.author.fortniteTracker === true) return;

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
                    console.log(json);


                    if (json.error) {
                        throw new Error('Player not Found');
                    }

                    const responseObject = {
                        "ayy": "Ayy, lmao!",
                        "wat": "Say what?",
                        "lol": "roflmaotntpmp"
                    };
                    let found = json.lifeTimeStats.find((el) => el.key === 'Wins')
                    // msg.reply(responseObject);
                    setStats(msg);
                    msg.channel.stopTyping();

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

function setStats(msg) {
    const embed = new Discord.RichEmbed()
        .setTitle("This is your title, it can hold 256 characters")
        .setAuthor("Author Name", "https://i.imgur.com/lm8s41J.png")
        /*
         * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
         */
        .setColor(0x00AE86)
        .setDescription("This is the main body of text, it can hold 2048 characters.")
        .setFooter("This is the footer text, it can hold 2048 characters", "http://i.imgur.com/w1vhFSR.png")
        .setImage("http://i.imgur.com/yVpymuV.png")
        .setThumbnail("http://i.imgur.com/p2qNFag.png")
        /*
         * Takes a Date object, defaults to current date.
         */
        .setTimestamp()
        .setURL("https://discord.js.org/#/docs/main/indev/class/RichEmbed")
        .addField("This is a field title, it can hold 256 characters",
            "This is a field value, it can hold 2048 characters.")
        /*
         * Inline fields may not display as inline if the thumbnail and/or image is too big.
         */
        .addField("Inline Field", "They can also be inline.", true)
        /*
         * Blank field, useful to create some space.
         */
        .addBlankField(true)
        .addField("Inline Field 3", "You can have a maximum of 25 fields.", true);

    msg.channel.send({ embed });
}


fortniteTracker.login(auth.discordToken);