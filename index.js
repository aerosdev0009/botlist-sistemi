client.on("interactionCreate", async (interaction,client) => {
    if(!interaction.isButton()) return;

    if(interaction.customId === "boteklebuton") {
      if(db.get('eklibot.' + interaction.guild.id + interaction.user.id) == 1) { 
        return interaction.reply({ content: 'Zaten Şu Anda Sistemde Ekli Botunuz Bulunmaktadır.', ephemeral: true})
      }
      const modal = new ModalBuilder()
      .setCustomId('boteklemodal')
      .setTitle('Bot Ekle!')

      const botname = new TextInputBuilder()
      .setCustomId('botad')
      .setLabel('Botunuzun İsmi')
      .setStyle(Discord.TextInputStyle.Short)
      .setRequired(true);

      const botid = new TextInputBuilder()
      .setCustomId('botid')
      .setLabel('Botunuzun IDsi')
      .setStyle(Discord.TextInputStyle.Short)
      .setMinLength(18)
      .setMaxLength(18)
      .setRequired(true);

      const row1 = new ActionRowBuilder().addComponents(botname);
      const row2 = new ActionRowBuilder().addComponents(botid);

      modal.addComponents(row1, row2);

      interaction.showModal(modal)
    }

    if(interaction.customId === 'kabulbuton') {
      const embedbilgi = interaction.message;
      const bilgi = embedbilgi.embeds;

      const mentionedUsers = [];
      
      const description = bilgi[0]?.description;
      const descriptionMatches = description?.match(/<@(\d+)>/g);

      if (descriptionMatches) {
        descriptionMatches.forEach(match => {
          const userId = match.match(/<@(\d+)>/)[1];
          mentionedUsers.push(userId);
        });
      }

      if(db.get('eklibot.' + interaction.guild.id + mentionedUsers[0]) != 1) {
        interaction.reply({ content: 'Kabul Ya Da Reddedilmiş.', ephemeral: true })
      } else {

      const id = db.get('botid.' + interaction.guild.id + mentionedUsers[0]);
      const name = db.get('botad.' + interaction.guild.id + mentionedUsers[0]);

      const log = db.get('botlistlog.' + interaction.guild.id);
      const kanal = interaction.guild.channels.cache.get(log.id);
      const dm = interaction.guild.members.cache.get(mentionedUsers[0])
      
      await dm.send({ content: name + ' Adlı Botunuz Onaylanmıştır. İyi Günler.' })
      await kanal.send({ content: name + ' Adlı Botunuz ' + interaction.user.username + ' Tarafından Onaylanmıştır.' })

      interaction.reply({ content: 'Başarılı', ephemeral: true })

      db.set('botlistsira.' + interaction.guild.id, Math.floor(db.get('botlistsira' + interaction.guild.id) + 1))
      db.delete('eklibot.' + interaction.guild.id + interaction.user.id);
      db.delete('botad.' + interaction.guild.id + interaction.user.id);
      db.delete('botid.' + interaction.guild.id + interaction.user.id);
      }
    }

    if(interaction.customId === 'redbuton') {
      const modal = new ModalBuilder()
      .setCustomId('botr')
      .setTitle('Red Sebebi')

      const redsebep = new TextInputBuilder()
      .setCustomId('reds')
      .setLabel('Sebep')
      .setStyle(Discord.TextInputStyle.Paragraph)
      .setRequired(false);

      const botid = new TextInputBuilder()
      .setCustomId('redbotid')
      .setLabel('Bot ID')
      .setStyle(Discord.TextInputStyle.Short)
      .setMaxLength(18)
      .setMinLength(18)
      .setRequired(true);

      const row = new ActionRowBuilder().addComponents(redsebep)
      const row1 = new ActionRowBuilder().addComponents(botid)

      modal.addComponents(row, row1)

      interaction.showModal(modal)
    }
