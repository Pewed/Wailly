const { RichEmbed } = require('discord.js/typings')
module.exports.run = async (client, message, args) =>  {
    if(message.content.slice(6) == undefined) return;
    if(message.author.id !== '173542833364533249') return;
    if (message.deletable) message.delete().catch(err => console.log(err))
    try {
        console.log(eval(message.content.slice(6)))
    } catch (e) {
        message.author.send(`Erreur lors de l'évaluation du code: ${e}`)
    }

}