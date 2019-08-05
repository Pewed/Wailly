const config = require('../config.json')
const { RichEmbed } = require('discord.js')
module.exports.run = async (Client, message, args) => {
    if(message.member.roles.has(config.staff_role) == false) return;
    if(args[1] == undefined){
        message.channel.send("Commande invalide")
        return
    }
    if(message.mentions.members.first() == undefined){
        message.channel.send("utilisateur introuvable")
        return
    }
    else if(args[1] !== undefined || message.mentions !== undefined) {
        if(message.author.id == message.mentions.members.first().id) return;
        const embed = new RichEmbed().setAuthor(``)
        if(args[2] === undefined) {
            message.member.addRole(config.mute_role)
            Client.channels.get('579270101724037140').send()
        } else {

        }
    }
}