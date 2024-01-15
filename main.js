const Discord = require("discord.js-selfbot-v13");
const { Client } = require('discord.js-selfbot-v13');
const client = new Discord.Client({
    checkUpdate: false
});
const express = require('express')
const app = express();
const port = 8000;

const largeImages = [
    'https://media.discordapp.net/attachments/1155965892853760030/1155966123930558464/R.gif?ex=6580ad58&is=656e3858&hm=157c30a12a1d12f8ecbd0928be3f74b86d80ca39bad1693175ccfa4e3d9bb801&=',
    'https://media.discordapp.net/attachments/1155965892853760030/1155966048340803675/81a6b64add5ddd7ae31a508eadc91be6.gif?ex=6580ad46&is=656e3846&hm=c03c97a58038a0e67b3711002f4e9b4b27df96c5cbd7704b009b0011e9c5baa9&=',
    'https://media.discordapp.net/attachments/1155965892853760030/1156600069752115221/e01a354a45f835fba2448f65a5c7a7f5.gif?ex=6582fbc1&is=657086c1&hm=3b4e9ea2780e3909d8bf67fe5dadd56b2eff69b3cf2371d622cdf328a1c82b8d&=',
    // Add more large image URLs as needed
];

let currentLargeImageIndex = 0;

app.get('/', (req, res) => res.send('ทำงานเรียบร้อยแล้ว'))
app.listen(port, () =>
    console.log(`Your app is listening at http://localhost:${port}`)
);

client.on("ready", async () => {
    var startedAt = Date.now();
    console.log(`${client.user.username} เม็ดม่วงทำงานเรียบร้อยแล้ว !`);

    setInterval(() => {
        const currentTime = getCurrentTime();
        const currentDate = getCurrentDate();

        const r = new Discord.RichPresence()
            .setApplicationId('1121867777867788309')
            .setType('STREAMING')
            .setState('เอาเม็ดม่วงฟรีๆ เขามาดิส')
            .setName('เม็ดม่วง By FL CLUB')
            .setDetails(` 〈⏰${currentTime}〉 «» 〈${client.user.username}〉 `)
            .setStartTimestamp(startedAt)
            .setAssetsLargeText(`〈${currentDate}〉|〈🛸 0 m/s〉`)
            .setAssetsLargeImage(largeImages[currentLargeImageIndex])
            .setAssetsSmallImage('https://media.discordapp.net/attachments/1155965892853760030/1155966123439837184/moon.gif?ex=6580ad58&is=656e3858&hm=a5a5c9a5e8c9e50bc1919ffc6a59aa1abc569be71ae60a1d44bb736d26c0b732&=')
            .setAssetsSmallText('เม็ดม่วง By Fl Club')
            .addButton('เข้าดิส', 'https://discord.gg/fakelinkclub')

        client.user.setActivity(r);

        // Move to the next large image in the array
        currentLargeImageIndex = (currentLargeImageIndex + 1) % largeImages.length;
    }, 1000); // Change large image every 5 seconds
});

function getCurrentDate() {
    const a = new Date(Date.now());
    const c = { timeZone: "Asia/Bangkok", day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = a.toLocaleDateString("en-US", c);
    const [month, day, year] = formattedDate.split('/');
    return `${day}/${month}/${year}`;
}

function getCurrentTime() {
    const a = new Date(Date.now());
    const c = { timeZone: "Asia/Bangkok", hour: "numeric", minute: "numeric", hour12: false };
    return a.toLocaleTimeString("th-TH", c);
}

client.login(process.env.token);
