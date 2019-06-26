const Discord = require('discord.js');
const { RichEmbed } = require('discord.js')
const fs = require('fs');
const config = require('./config.json')
const Client = new Discord.Client();
let Commandes = new Array();

console.log("Chargement des commandes")
let i = 0;
fs.readdir('./commandes/', (erreur, fichiers) => {
    if(erreur) console.log(erreur)
    fichiers.forEach(function(fichier) {
        if(fichier.split(".").pop() == "js"){
            Commandes.push(fichier)
            console.log(fichier)
            i++
        }
    })
    console.log(`${i} commandes chargés`)

})


Client.login(config.token);

Client.on('ready', function(){
    console.log("Chargement du bot terminé");
    Client.user.setActivity(`${config.prefix}help`)
})

Client.on('message', message => {
    if(message.channel.type == 'dm') Client.channels.get('584845598931550221').send(`de: ${message.author.username} \n \n Message: ${message.content}`)
    if(message.author.bot) return;
    if(message.content.toLowerCase().slice(0,1) !== config.prefix) return;
    let args = message.content.toLowerCase().split(' ');
    if(Commandes.includes(args[0].replace(config.prefix, '') + '.js')){
        //message.channel.send('Commande existante');
        try {
            let Commande = require(`./commandes/${args[0]}.js`)
            Commande.run(Client, message, args)
        } catch(err){
            console.log(err)
        }

    } else {
        message.channel.send('Commande inconnu');
    }

})

Client.on('guildMemberAdd', membre => {
    membre.guild.channels.get(config.join_channel).send(`Bienvenue <@${membre.id}>, je t'invite à aller lire les <#445271324999417856> du serveur et de te présenter afin d'obtenir l'accès au reste du serveur. \n \n - Prénom \n \n - Age \n \n - Pourquoi tu viens sur le discord \n \n - La personne qui t'a donné l'invitation \n \n - J'ai lu les règles et je m'engage à les respecter \n \n Ta présentation sera vérifié par un membre de l'équipe, manuellement. Merci d'attendre une réponse de leurs part et de les noctifiers que si cela fait plusieurs quarts que tu attends.`)
})
Client.on('messageUpdate', (oldmsg, newmsg) => {
    if(oldmsg.author.bot) return;
    let embed = new RichEmbed().setAuthor(`Message de ${oldmsg.author.username}#${oldmsg.author.discriminator} édité`)
        .addField("Dans le salon", "<#" + oldmsg.channel.id + ">")
        .addField("Avant", oldmsg.content)
        .addField("Après", newmsg.content)
    Client.channels.get(config.log_channel).send(embed)
    return;
})

Client.on('messageDelete', msg => {
    if(msg.author.bot) return;
    let embed = new RichEmbed().setAuthor(`Message de ${msg.author.username}#${msg.author.discriminator} supprimé`)
        .addField("Dans le salon", "<#" + msg.channel.id + ">")
        .addField("Message", msg.content)
    Client.channels.get(config.log_channel).send(embed)
})
const url = 'https://www.youtube.com/watch?v=Hi7Rx3En7-k';
const ytdl = require('ytdl-core')
Client.on('message', message => {
    if (message.content.startsWith('++play')) {
        console.log('Got a song request!');
        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
            return message.reply('Please be in a voice channel first!');
        }
        voiceChannel.join()
            .then(connection => {
                const stream = ytdl(url, { filter: 'audioonly' });
                const dispatcher = connection.playStream(stream);
                dispatcher.on('end', () => {
                    voiceChannel.leave();
                });
            });
    }
});
module.exports = Commandes



