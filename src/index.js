const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { Client } = require('discord.js-selfbot-v13'); // Import Client from the correct package
const dataFolderPath = path.join(__dirname, 'data');
const filePath = path.join(__dirname, 'data\\about.txt');
const { exec } = require('child_process'); // Use path.join for path manipulation
const { time } = require('console');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const welcomeScreen = `
      _                           _
     | |                         | |
   __| | ___ _______ ___  _ __ __| |
  / _\` |/ _ \\_  / __/ _ \\| '__/ _\` |
 | (_| |  __// / (_| (_) | | | (_| |
  \\__,_|\\___/___\\___\\___/|_|  \\__,_|
                                    
                        by 4komornik

`;

//console.log(chalk.redBright(welcomeScreen));

async function tokenSave() {
  console.clear()
  console.log('[ @ ] type $exit to return to menu')
  rl.question('[ ? ] User token : ', async (discordToken) => {
    if (discordToken === '$exit') Menu();

    const userId = discordToken.split('.')[0];
    const decodedUserId = Buffer.from(userId, 'base64').toString('utf-8');

    const url = `https://discord.com/api/v10/users/${decodedUserId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `${discordToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        const username = userData.username;

        const dataToSave = {
          token: discordToken,
          username: username,
        };

        const userTokenFilePath = path.join(dataFolderPath, 'userToken.json');
        let userTokens = {};

        if (fs.existsSync(userTokenFilePath)) {
          const existingData = fs.readFileSync(userTokenFilePath, { encoding: 'utf-8' });
          userTokens = JSON.parse(existingData);
        }

        userTokens[username] = dataToSave;
        fs.writeFileSync(userTokenFilePath, JSON.stringify(userTokens, null, 2), { encoding: 'utf-8' });

        console.log('[ + ] User data saved to ./data/userToken.json.');
      } else {
        console.error('[ ! ] Bad token or problem with Discord API. Try again later.');
        tokenSave();
      }
    } catch (error) {
      console.error('[ ! ] Error with tokenSave:', error);
      tokenSave();
    }
  });
}



function userList() {
  const userTokensFilePath = path.join(dataFolderPath, 'userToken.json');

  try {
    const existingData = fs.readFileSync(userTokensFilePath, { encoding: 'utf-8' });
    const userTokens = JSON.parse(existingData);

    const usernames = Object.keys(userTokens);

    return usernames;
  } catch (error) {
    console.error('[ ! ] Error reading userToken.json:', error);
    return [];
  }
}







function MainSelfBot(token) {
  const { Client, PermissionsBitField  } = require('discord.js-selfbot-v13')

    


  client = new Client({
      checkUpdate: false,
  })
  
  
  client.on('ready', () => {
      console.log(chalk.green(`[ + ] Logged`))
      console.log(chalk.white(`[ ? ] account : ${client.user.username}`))
      console.log(chalk.white(`[ ? ] Id : ${client.user.id}`))
  })
  
  function ChangeUsernameFunction(username) {
    client.user.setUsername(username);
  }
  function ChangeStatusFunction(status) {
    
    client.user.setStatus(status);
  }
  client.on('messageCreate', async (message) => {
    const content = message.content
    if (content.startsWith('&bot-avatar')) {
      console.log(chalk.cyan(`[ > ] '${message.content}' command used by ${message.author.username}\n`))
      const args = content.split(' ');
      
      if (args.length !== 2) {
        message.channel.send('Usage: `&bot-avatar {url / path}`');
        return;
      } else {
        const img = args[1];
        console.log(img);
    
        try {
          console.log('[ : ] trying to change avatar');
          await client.user.setAvatar(img);
          console.log('[ + ] avatar changed successfully');
        } catch (error) {
          console.log(chalk.red(`[ ! ] error with command '&bot-avatar': ${error}`));
        }
      }
    }
    
   
  })
  client.on('messageCreate', async (message) => {
      const prefix = '&';
      const content = message.content
      const author = message.author
      if (message.content === '&help') {
          console.log(chalk.cyan(`[ > ] '${message.content}' command used by ${message.author.username}\n`))
          const help_content = ` 
  # :calling: Basic
  - **::wrench: Prefix: \`&\`. If you want to change the prefix, contact the developer (me).**
  - **::satellite: \`&help\`**
      Display the list of available commands.
  - **::bulb: \`&server\`**: 
      Show server statistics.
  - **:mag: \`&user {userId | optional}\`**: 
      Show user statistics.
  - **:mag: \`&av {userId | optional}\`**: 
      Show user avatar.
  
  # :gun: Troll commands
  - **:broom: \`&server-clear\`**:
      Delete all channels in the server.
  - **:broom: \`&channel-clear {channelId | optional}\`**:
      Delete all messages in a specified channel.
  - **:broom: \`&message-clear {amount}\`**:
      Delete a specified number of messages using bulk delete.
  - **:bomb: \`&nuke\`**:
      Create numerous channels and send messages to them.
  - **:moyai: \`&message-clear-self\`**
      Delete all messages send by client (self bot account)`;
          message.channel.send(help_content)
      
      }
  
  
      if (message.content === '&server') {
          console.log(chalk.cyan(`[ > ] '${message.content}' command used by ${message.author.username}\n`))
          const guild = message.guild;
          /*
          const onlineMembers = message.guild.members.cache.filter(member => member.presence?.status === "online").size;
          const offlineMembers = message.guild.members.cache.filter(member => !member.presence || member.presence.status === "offline").size;
          const awayMembers = message.guild.members.cache.filter(member => member.presence?.status === "idle").size;
          const dndMembers = message.guild.members.cache.filter(member => member.presence?.status === "dnd").size;
          */
          guild.fetchOwner()
              .then(owner => {
                  const server_data = `
  # :page_with_curl: Server Data  
  **:notebook_with_decorative_cover: Basic Info**:
  - **Name:** ${guild.name}
  - **ID:** ${guild.id}
  - **Owner:** ${owner.user.tag}
  - **Region:** ${guild.region}
  - **Creation Date:** ${guild.createdAt.toUTCString()}
  
  **:busts_in_silhouette: Members**:
  - **Total Members:** ${guild.memberCount}
  
  **:man_police_officer: Roles and Channels**:
  - **Roles Count:** ${guild.roles.cache.size}
  - **Text Channels:** ${guild.channels.cache.filter(channel => channel.type === 'text').size}
  - **Voice Channels:** ${guild.channels.cache.filter(channel => channel.type === 'voice').size}
  
  **:earth_africa: Verification and Boosts**:
  - **Verification Level:** ${guild.verificationLevel}
  - **Emoji Count:** ${guild.emojis.cache.size}
  - **Boost Tier:** ${guild.premiumTier}
  - **Boost Count:** ${guild.premiumSubscriptionCount}
  
  **:satellite: Server Features**:
  - ${guild.features.join(', ')}
  
  **:gear: Explicit Content Filter:** ${guild.explicitContentFilter}
  `;
      
                  message.channel.send(server_data);
              })
              .catch(error => {
                  console.error('Error fetching owner:', error);
              });
      }
      
      if (content.startsWith('&user')) {
          console.log(chalk.cyan(`[ > ] '${message.content}' command used by ${message.author.username}\n`))
          const args = content.split(' ');
          if (args.length !== 2) {
              message.channel.send('Usage: `&userInfo {userId}`');
              return;
          }
          
          const userId = args[1];
          const user = await client.users.fetch(userId);
          if (!user) {
              message.channel.send('User not found.');
              return;
          }
          const avatarUrl = author.displayAvatarURL({ dynamic: true });
          const avatarUrlWithoutHttps = avatarUrl.replace('https://', '');
          const userInfo = `
  # 🧑 **User Info** 🧑
   - 👤 **User Tag:** ${user.tag}
   - 🆔 **User ID:** ${user.id}
   - 🗓️ **Created At:** ${user.createdAt.toDateString()}
   - 🖼️ **Avatar URL:** ${avatarUrlWithoutHttps}
   - 🤖 **Bot:** ${user.bot ? 'Yes' : 'No'}
   - 👤 **Account Type:** ${user.bot ? 'Bot' : 'User'}
  `;
          message.channel.send(userInfo);
      } 
  
      if (message.content.startsWith('&av')) {
          console.log(chalk.cyan(`[ > ] '${message.content}' command used by ${message.author.username}\n`))
          console.log(chalk.cyan(`[ > ] '${message.content}' command used by ${message.author.username}\n`))
          const args = message.content.split(' ');
          let userId = message.author.id;
  
          if (args.length > 1) {
              userId = args[1];
          }
  
          try {
              const user = await client.users.fetch(userId);
  
              const avatarUrlWithoutHttps = user.displayAvatarURL({ format: 'png', dynamic: true }).replace(/^https?:\/\//, '');
  
              message.channel.send(`🖼️ Avatar of ${user.username}: ${avatarUrlWithoutHttps}`);
          } catch (error) {
              message.channel.send(`❌ Couldn't fetch user's avatar.`);
          }
      }
      
    
      if (message.content.startsWith(prefix)) {
          
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
    
        if (command === 'nuke') {
          console.log(chalk.yellowBright(`[ Admin ] '${message.content}' command used by ${message.author.username}\n`))
          
          // Check if the bot has the necessary permissions
          const botPermissions = message.guild.members.me.permissionsIn(message.channel);
          if (!botPermissions.has(['MANAGE_CHANNELS', 'MANAGE_MESSAGES'])) {
            return message.reply("I don't have the necessary permissions to execute this command.");
          }
    
          // Check for the number of channels to create (default to 10 if not provided)
          const channelCount = parseInt(args[0]) || 10;
    
          const messageContent = 'This channel has been nuked!';
    
          for (let i = 0; i < channelCount; i++) {
            await message.guild.channels.create(`nuked-channel-${i}`, { type: 'text' })
              .then(channel => {
                channel.send(messageContent);
              })
              .catch(error => {
                console.error(`Error creating channel: ${error}`);
              });
          }
        }
      }
      if (content === '&server-clear') {
          console.log(chalk.yellowBright(`[ Admin ] '${message.content}' command used by ${message.author.username}\n`))
              // Check if the author of the message is an admin
          if (!message.member.permissions.has('ADMINISTRATOR')) {
              return message.reply("You don't have permission to use this command.");
          }
  
          // Check if the bot has the necessary permissions
          const botPermissions = message.guild.members.me.permissionsIn(message.channel);
          if (!botPermissions.has('MANAGE_CHANNELS')) {
              return message.reply("I don't have the necessary permissions to execute this command.");
          }
  
          const channels = message.guild.channels.cache.values();
  
          for (const channel of channels) {
              await channel.delete()
              .catch(error => {
                  console.error(`Error deleting channel: ${error}`);
              });
          }
      }
      if (content === '&channel-clear') {
        console.log(chalk.yellowBright(`[ Admin ] '${message.content}' command used by ${message.author.username}\n`))
          
          // Check if the author of the message is an admin
          if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply("You don't have permission to use this command.");
          }
      
          // Check if the bot has the necessary permissions
          const botPermissions = message.guild.members.cache.get(client.user.id).permissionsIn(message.channel);
          if (!botPermissions.has('MANAGE_MESSAGES')) {
            return message.reply("I don't have the necessary permissions to execute this command.");
          }
      
          const channel = message.mentions.channels.first() || message.channel;
      
          const fetchedMessages = await channel.messages.fetch();
          
          fetchedMessages.forEach(async msg => {
            if (!msg.pinned) {
              await msg.delete().catch(error => {
                console.error(`Error deleting message: ${error}`);
              });
            }
          })
      }
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
    
      if (command === 'message-clear') {
        console.log(chalk.yellowBright(`[ Admin ] '${message.content}' command used by ${message.author.username}\n`))
        
        // Check if the bot has the necessary permissions
        const botPermissions = message.guild.members.cache.get(client.user.id).permissionsIn(message.channel);
        if (!botPermissions.has(['MANAGE_CHANNELS', 'MANAGE_MESSAGES'])) {
          return message.reply("I don't have the necessary permissions to execute this command.");
        }
    
        // Check for the number of messages to delete (default to 10 if not provided)
        const messageCount = parseInt(args[0]) || 10;
    
        // Fetch messages to delete
        const fetchedMessages = await message.channel.messages.fetch({ limit: messageCount + 1 });
    
        fetchedMessages.forEach(async msg => {
          await msg.delete().catch(error => {
            console.error(`Error deleting message: ${error}`);
          });
        });
    
        return message.reply(`Deleted ${messageCount} messages.`);
      }
      if (command === 'message-clear-self') {
        console.log(chalk.yellowBright(`[ Admin ] '${message.content}' command used by ${message.author.username}\n`));
        
        // Check if the bot has the necessary permissions
        const botPermissions = message.guild.members.cache.get(client.user.id).permissionsIn(message.channel);
        if (!botPermissions.has(['MANAGE_MESSAGES'])) {
          return message.reply("I don't have the necessary permissions to execute this command.");
        }
      
        // Check for the number of messages to delete (default to 10 if not provided)
        const messageCount = parseInt(args[0]) || 10;
      
        // Fetch messages to delete
        const fetchedMessages = await message.channel.messages.fetch({ limit: messageCount + 1 });
      
        // Filter and delete messages sent by the client (self)
        const selfMessages = fetchedMessages.filter(msg => msg.author.id === client.user.id);
        selfMessages.forEach(async msg => {
          await msg.delete().catch(error => {
            console.error(`Error deleting message: ${error}`);
          });
        });
      
        return message.reply(`Deleted ${selfMessages.size} of your messages.`);
      }
    

  })
  console.log(chalk.yellow('[ > ] login attempt'))
  client.login(token)
}



function about() {
  exec(`start ${filePath}`, (error) => {
    if (error) {
      console.error(`[ ! ] Error: ${error}`);
    } else {
      console.clear()
      const welcomeScreen = `
      _
     | |
   __| | ___ _______ ___  _ __ __| |
  / _\` |/ _ \\_  / __/ _ \\| '__/ _\` |
 | (_| |  __// / (_| (_) | | | (_| |
  \\__,_|\\___/___\\___\\___/|_|  \\__,_|
                                    
                        by 4komornik

`;

      console.log(chalk.magentaBright(welcomeScreen));
      Menu()
    }
  });
}
function selectUserToken() {
  rl.question('\n[ > ] Enter the username to select the account: \n', (username) => {
    const userTokenFilePath = path.join(dataFolderPath, 'userToken.json');

    try {
      const userTokens = require(userTokenFilePath);
      const selectedUser = userTokens[username];

      if (selectedUser) {
        const selectedToken = selectedUser.token;
        MainSelfBot(selectedToken);
      } else {
        console.log('[ ! ] Token not found for the given username.');
        SelfBot();
      }
    } catch (error) {
      console.log('[ ! ] User not found.');
      SelfBot();
    }
  });
}


function SelfBot() {
  console.clear();
  console.log(chalk.blueBright(welcomeScreen));

  console.log(chalk.cyanBright('[ ? ] Pick account'));
  const usernames = userList();

  // Display the list of available usernames
  usernames.forEach((username, index) => {
    console.log(`[ ${index + 1} ] ${username}`);
  });

  rl.question('\n[ > ] Enter the number of the username to select the account: \n', (selectedNumber) => {
    const selectedUsername = usernames[selectedNumber - 1];

    const userTokenFilePath = path.join(dataFolderPath, 'userToken.json');
    const userTokensData = fs.readFileSync(userTokenFilePath, { encoding: 'utf-8' });
    const userTokens = JSON.parse(userTokensData);

    const selectedUser = userTokens[selectedUsername];
    if (selectedUser) {
      const selectedToken = selectedUser.token;
      console.clear()
      console.log(chalk.yellowBright(welcomeScreen))
      MainSelfBot(selectedToken);
    } else {
      console.log('[ ! ] Token not found for the selected username.');
      SelfBot();
    }
  });
}



















function Menu() {
  const menu_content = chalk.magentaBright.bold(welcomeScreen) + `\n
  [ $ ] Menu
  [ 1 ] Start Self-Bot
  [ 2 ] Save User Token
  [ 3 ] About

  [ > ] Pick an option by number (1-4): 
   `;
  
  //console.log(chalk.blueBright(menu_content));

  rl.question(menu_content, (option) => {
    switch (option) {
      case '1':
        SelfBot()   
        break;
      case '2':      
      console.log(chalk.magentaBright(welcomeScreen));
        tokenSave()
        break;
      case '3':
        about()
        break;
      case '$exit':
        break;
      default:
        console.clear()
        Menu();
        
        break;
    }

    // Call the Menu function again to return to the menu
    
  });
}

// Start the program by calling the Menu function
Menu();
