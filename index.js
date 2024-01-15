const Discord = require("discord.js-selfbot-v13");
const { Client } = require('discord.js-selfbot-v13');
const client = new Discord.Client({
    checkUpdate: false
});
const express = require('express')
const app = express();
const port = 8000;

const largeImages = [
    'https://media.discordapp.net/attachments/1194049228209659986/1196449329221738589/ay.gif?ex=65b7ab45&is=65a53645&hm=29e4f27f73cfeaf147d36b1dd8080365e62b23c22ee79515f6df0c0901105635&=',
    'https://media.discordapp.net/attachments/1194049228209659986/1196449329834119298/what.gif?ex=65b7ab45&is=65a53645&hm=34633838e4a6264cc8d52034c8ab6d42c02809f10d49723543cd6769e16869dd&=',
    'https://media.discordapp.net/attachments/1194049228209659986/1196449330459058259/wat.gif?ex=65b7ab45&is=65a53645&hm=12ae87b9b9c8192a4d54ca73a313760ada793d350bcf3465954ed721b0720635&=',
    // Add more large image URLs as needed
];

const stateTexts = [
    '「 เเจกซอสเม็ดม่วงเข้ามาที่ดิส! 」',
    '「 Made By QuartaoDev! 」',
    '「 รับรันเม็ดม่วง 24ชม. 30 บาท! 」',
    // Add more state texts as needed
];

let currentStateIndex = 0; // Index to track the current state text

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
            .setState(stateTexts[currentStateIndex])
            .setName('👾 รับรันเม็ดม่วง 24ชม. 30 บาท')
            .setDetails(` ﹝ ⌚${currentTime} | 👻${client.user.username} ﹞ `)
            .setStartTimestamp(startedAt)
            .setAssetsLargeText(`﹝ 📅 ${currentDate}  |  🛸 0 m/s ﹞`)
            .setAssetsLargeImage(largeImages[currentLargeImageIndex])
            .setAssetsSmallImage('https://media.discordapp.net/attachments/1194049228209659986/1196449770860978206/asdasd.gif?ex=65b7abae&is=65a536ae&hm=400412b18c2128492b8cf1ef2ee2a1368d0dd52fb80d5909ff7acbd1886592c4&=')
            .setAssetsSmallText('เม็ดม่วง By Fl Club')
            .addButton('เข้าดิส', 'https://discord.gg/fakelinkclub')

        client.user.setActivity(r);

      currentLargeImageIndex = (currentLargeImageIndex + 1) % largeImages.length;
      currentStateIndex = (currentStateIndex + 1) % stateTexts.length;
    }, 1000); // Change large image and state text every 1 second
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
