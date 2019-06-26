const ytdl = require('ytdl-core')
let connection  = require('./join.js').co
module.exports.run = async (Client, message, args) => {
    if (args[1] == undefined) return;
    const voiceChannel = message.guild.voiceConnection.channel.;
    voiceChannel.join()
        .then(connection => {
            const stream = ytdl(message.content.slice(5), { filter: 'audioonly' });
            const dispatcher = connection.playStream(stream);
            dispatcher.on('end', () => {
                voiceChannel.leave();
            });
        });
    /*if(connection == undefined) {
        message.channel.send('je ne suis pas dans un salon vocal')
        return;
    }
    try {
        const stream = ytdl(args[1], {
            filter: 'audioonly'
        });
        console.log(stream)
        const dispatcher = connection.playStream(stream)

    }
    catch(e){
        console.log(e)
    }*/
}