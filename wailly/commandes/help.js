let str = ""
const { RichEmbed } = require('discord.js')
const fs = require('fs')
const config = require('../config.json')
module.exports.run = async (Client, message, args)  => {
    let commandes = require('../main.js')
    let embed = new RichEmbed().setAuthor("Commande d'aide").setDescription(`Préfix: ${config.prefix}`)
    commandes.forEach(function(cmd) {
        let commande = require(`../commandes/${cmd}`)
        if (commande.description == undefined) commande.description = 'Aucune description défini'
        embed.addField(cmd.replace('.js', ''), commande.description)
    })
    embed.setFooter(`Executé par ${message.author.username}#${message.author.discriminator}`)
    message.channel.send(embed)
}