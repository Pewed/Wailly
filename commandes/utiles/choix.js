module.exports.run = async (client, message, args) => {
    if (args[1] == undefined){
        message.channel.send(`Commande incorrecte, /choix <texte> ou <texte>`)
        return;
    }
    const choix = message.content.toLowerCase().split('ou')
    choix[0] = choix[0].toLowerCase().replace('/choix ', '')
    message.channel.send(`Je choisis: ` + choix[Math.floor(Math.random() * choix.length)])
}

module.exports.description = "Demander au bot de faire un choix pour vous"