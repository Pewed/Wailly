const config = require('./config.json')

module.exports.antipub = async (message) => {
    if (message.member.roles.has(config.staff_role)) return;
    message.content.split(' ').forEach(function (arg) {
        if (arg.includes('https://discord.gg')) {
            const invitecode = arg.replace('https://discord.gg/', '').substring(0, 6).replace(/</g, '').replace(/>/g, '')
            message.guild.fetchInvites().then(invites => {
                if (!invites.has(invitecode)) {
                    if(message.deletable) message.delete().catch(e => message.channel.send(`<@&415559211838341121> <@&415558441361211405> <@${message.author.id}> à envoyé un lien vers un discord que je n'ai pas pu supprimer`))
                    message.member.addRole(config.mute_role)
                }
            })
        }
    })
}
module.exports.antispam = async (message, lastmessage) => {
    //console.log(lastmessage.get(message.author.id))
    try {
        if (message.content == lastmessage.get(message.author.id)) {
            if(message.deletable) message.delete().catch(err => console.log(err))
            message.reply(' Spam pas !');
        } else {
            lastmessage.set(message.author.id, message.content)
        }
    } catch (e) {
        console.log('e : ' + e)
    }
}

module.exports.antispammentions = async (message, lastmessage) => {
    if (message.mentions.everyone && !message.member.roles.has(config.staff_role)) return message.delete().catch(err => console.log(`Erreur lors de la suppression d'un message tagggant everyone: ${err}`)).then(message.channel.send(message.author + " a tenté de tag everyone ou here"))
    /*message.member.roles.forEach(function (role) {
        if (lastmessage.get(message.author.id).includes(`<@&${role.id}>`) && message.content.includes(`<@&${role.id}>`)) {
            if(message.deletable) message.delete().catch(err => console.log(err))
            message.reply(' Doucement sur les mentions !');
        }
    })*/
        console.log(lastmessage.get(message.author.id))
        if (lastmessage.get(message.author.id).includes('<@&') && message.content.includes('<@&')) {
            if(message.deletable) message.delete().catch(err => console.log(err))
            message.reply(' Doucement sur les mentions !')
    }
}



