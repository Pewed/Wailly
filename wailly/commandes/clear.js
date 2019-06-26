const { Discord } = require('discord.js')
const config = require('../config.json')
module.exports.run = async (Client, message, args) => {
    if(message.channel.type == 'dm') return;
    if(message.member.roles.has(config.staff_role) == false) return;
    if(args[1] == undefined) {
        message.channel.send("Commande invalide, /clear <nombre>")
        return;
    } else {
        try {
            message.delete()
            message.channel.fetchMessages({limit: parseInt(args[1])}).then(messages => message.channel.bulkDelete(messages)).then()
            message.channel.send(args[1] + ' message(s) supprimé(s)')
        } catch(err){
            console.log(err)
        }
    }


}