const db = require("quick.db");
const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    slash: new SlashCommandBuilder()
    .setName('botlist-kur')
    .setDescription('Botlist Sistemi Kurar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    
    .addChannelOption(log => log
        .setName('botlist-log')
        .setDescription('Kabul Red Kanalı')
        .setRequired(true))

        .addChannelOption(kanal => kanal
            .setName('botlist-kanal')
            .setDescription('Bot Kabul/Red Edilince Mesaj Gönderilecek Kanal')
            .setRequired(true)),

execute: async (client, interaction) => {
    const log = interaction.options.getChannel('botlist-log');
    const kanal = interaction.options.getChannel('botlist-kanal');

    await db.set('botlistlog.' + interaction.guild.id, log)
    await db.set('botlistkanal.' + interaction.guild.id, kanal);
    await db.set('botlistsira.' + interaction.guild.id, '0')
    
    const embed = new EmbedBuilder()
    .setTitle('Botunu Ekle!')
    .setDescription('Botunu Eklemek İçin Butona Tıkla. ID ve Bot İsmi Gereklidir.')
    .setFooter({ text: 'CodeNex | Botlist Sistemi' })
    .setThumbnail(interaction.guild.iconURL());

    const buton = new ButtonBuilder()
    .setCustomId('boteklebuton')
    .setLabel('Bot Ekle!')
    .setStyle(Discord.ButtonStyle.Secondary)

    const row = new ActionRowBuilder()
    .addComponents(buton)

    kanal.send({ embeds: [embed], components: [row] })

    interaction.reply({ content: 'Botlist Sistemi Başarıyla Kuruldu.', ephemeral: true })
}
}
