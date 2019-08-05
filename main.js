const Discord = require('discord.js');
const { RichEmbed } = require('discord.js')
const fs = require('fs');
const config = require('./config.json')
const Client = new Discord.Client();
let Commandes = new Array();
const WaillProtect = require('./Protection.js')
const lastmessage = new Map();
console.log("Chargement des commandes")
let i = 0;
const sql = require('sqlite3')
const db = new sql.Database('./utiles.db');



function loadcommandes(path) {
    fs.readdir(path, (erreur, fichiers) => {
        if (erreur) console.log(erreur)
        fichiers.forEach(function (fichier) {
            console.log(`${path}/${fichier}`)
            if (fs.statSync(`${path}/${fichier}`).isDirectory()) return loadcommandes(`${path}/${fichier}`)
            if (fichier.split(".").pop() == "js") {
                //Commandes.push(fichier)
                Commandes.push(`${path}/${fichier}`)
                console.log(fichier)
                i++
            }
        })
        console.log(`${i} commandes chargés`)
        console.log(Commandes.toString())
    })
}
loadcommandes('./commandes')
try {
    Client.login(config.token);
} catch (e) {
    console.log(`Erreur lors de la connexion à Discord: ${e}`)
}

Client.on('ready', function(){
    console.log("Chargement du bot terminé");
    Client.user.setActivity(`${config.prefix}help`)
    if(lastmessage == undefined) {console.log('mon cul')} else {console.log('nique toi')}
    Client.channels.get('579270101724037140').fetchMessage(config.acces_message).then(msg => msg.react('✅'))
    Client.channels.get('579270101724037140').fetchMessage(config.help_noctif_role_message).then(msg => msg.react('🔔'))

})

Client.on('message', message => {
    if(message.author.bot) return;
    if(lastmessage.get(message.author.id) == undefined) {
        lastmessage.set(message.author.id, "aucun anciens messages");
    }
    WaillProtect.antipub(message);
    WaillProtect.antispammentions(message, lastmessage);
    WaillProtect.antispam(message, lastmessage);
    if(message.channel.type == 'dm') Client.channels.get('584845598931550221').send(`de: ${message.author.username} \n \n Message: ${message.content}`)
    if(message.content.toLowerCase().slice(0,1) !== config.prefix) return;
    let args = message.content.toLowerCase().split(' ');
    Commandes.forEach(function (commande) {
        if (commande.includes(args[0].replace(config.prefix, '') + '.js')) {
            //message.channel.send('Commande existante');
            try {
                let Commande = require(commande)
                Commande.run(Client, message, args)
            } catch (err) {
                console.log(err)
            }
        }
    })





})

Client.on('guildMemberAdd', membre => {
    membre.guild.channels.get(config.join_channel).send(`Bienvenue <@${membre.id}>, je t'invite à aller lire les <#445271324999417856> du serveur et de te présenter afin d'obtenir l'accès au reste du serveur. \n \n - Prénom \n \n - Age \n \n - Pourquoi tu viens sur le discord \n \n - La personne qui t'a donné l'invitation \n \n - J'ai lu les règles et je m'engage à les respecter \n \n Ta présentation sera vérifié par un membre de l'équipe, manuellement. Merci d'attendre une réponse de leurs part et de les noctifiers que si cela fait plusieurs quarts que tu attends.`)

})

Client.on('guildMemberRemove', membre => {
    /*membre.roles.forEach(function (role) {
        db.get("SELECT roles_id FROM rolesbackup WHERE id = ?", [membre.id], (erreur, result) => {
            if (erreur) console.log(`Erreur lors de la requête SQl: ${erreur}`)
            console.log(result)
        })
    })*/
})
Client.on('messageUpdate', (oldmsg, newmsg) => {
    if(oldmsg.author.bot) return;
    WaillProtect.antipub(newmsg);
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

Client.on('messageReactionAdd', (reaction, user) => {
    //reaction.message.channel.send(reaction.emoji.name)
    if (reaction.message.id == config.acces_message && reaction.emoji.name == '✅') {
        if (!reaction.message.member.roles.has(config.membre_role)) {
            reaction.message.member.addRole(config.membre_role);
        }
    }
    if (reaction.message.id == config.help_noctif_role_message && reaction.emoji.name == '🔔') {
        if (!reaction.message.member.roles.has(config.help_noctif_role)) {
            reaction.message.member.addRole(config.help_noctif_role);
        }
    }
})
Client.on('messageReactionRemove', (reaction, user) => {
    //reaction.message.channel.send(reaction.emoji.name)
    if (reaction.message.id == config.acces_message && reaction.emoji.name == '✅') {
        if (reaction.message.member.roles.has(config.membre_role)) {
            reaction.message.member.removeRole(config.membre_role);
        }
    }
    if (reaction.message.id == config.help_noctif_role_message && reaction.emoji.name == '🔔') {
        if (reaction.message.member.roles.has(config.help_noctif_role)) {
            reaction.message.member.removeRole(config.help_noctif_role);
        }
    }
})



module.exports = Commandes;
//module.exports.lastmessage = lastmessage;

/*Client.on('typingStart', (channel, user) => {
    map.set(user.id, Date.now());
    channel.send(`${user.username} a commencer à écrire`);
})*/



/*Client.on('message', message => {
    if(map.get(message.author.id) == undefined) return;
    let res1 = Date.now() - map.get(message.author.id);
    console.log(`débug 1: ${res1} \n \n debug 2 : ${res1 / 1000} \n \n debug 3: ${message.content.length}`);
    message.channel.send("Message écrit en " + res1 / 1000 + " secondes");
    map.delete(message.author.id);
})*/


