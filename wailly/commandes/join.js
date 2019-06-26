module.exports.run = async (Client, message, args) => {
    if (message.member.voiceChannel == undefined){
        message.channel.send(`Vous n'êtes pas dans un salon vocal`)
        return;
    } else {
        try {
            message.member.voiceChannel.join()
            message.channel.send("J'ai rejoins votre salon vocal")
        } catch(e){
            console.log(e)
            message.channel.send(e)
        }
    }

}
