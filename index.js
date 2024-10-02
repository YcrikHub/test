const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const express = require('express');
const app = express();
const path = './coinflipData.json'; // File path for storing bet value and coinflip count

// Initialize the Discord self-bot client
const client = new Client();
const port = 8000; // Define the port for the Express server

// ANSI escape codes for text colors
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    magenta: "\x1b[34m",
    cyan: "\x1b[36m",
};

// Function to save bet value and coinflip count to a file
function saveCoinflipData(betValue, coinflipCount) {
    const data = { betValue, coinflipCount };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// Function to load bet value and coinflip count from the file
function loadCoinflipData(defaultBetValue, defaultCoinflipCount) {
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path);
        const parsed = JSON.parse(data);
        return {
            betValue: parsed.betValue || defaultBetValue,
            coinflipCount: parsed.coinflipCount || defaultCoinflipCount
        };
    }
    return { betValue: defaultBetValue, coinflipCount: defaultCoinflipCount };
}

// Load saved data (betValue and coinflipCount), or set defaults
const { betValue: initialBetValue, coinflipCount: defaultCoinflipCount } = loadCoinflipData(1, 100); // Default bet: 1, coinflipCount: 100

let currentBetValue = initialBetValue; // Initialize current bet value
let currentCoinflipCount = defaultCoinflipCount; // Initialize coinflip count

// Set up Express.js to serve static HTML
app.use(express.static('public')); // Serve static files from a public directory

app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>Coinflip Bot Status</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #282c34; color: white; }
                h1 { text-align: center; }
                .status { text-align: center; }
                .data { font-size: 20px; }
            </style>
        </head>
        <body>
            <h1>Coinflip Bot Status</h1>
            <div class="status">
                <div class="data">Current Bet Value: ${currentBetValue}</div>
                <div class="data">Coinflip Count: ${currentCoinflipCount}</div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Your app is listening at http://localhost:${port}`);
});

// Discord bot ready event
client.on('ready', () => {
    console.log(`${colors.magenta}>  User : ${client.user.tag}\n${colors.reset}`);

    const userId = '1275024063684935700'; // Replace with the actual user ID
    const user = client.users.cache.get(userId);

    if (user) {
        user.createDM()
            .then(dmChannel => {
                // Function to get balance
                const checkBalance = async () => {
                    try {
                        const balanceResponse = await dmChannel.sendSlash(userId, 'balance');
                        const balanceMessage = balanceResponse?.content;
                        return balanceMessage || null;
                    } catch (error) {
                        console.error(`${colors.red}⛔ | Error retrieving balance:${colors.reset}`, error);
                        return null;
                    }
                };

                // Perform coinflip routine
                const performCoinflipRoutine = async () => {
                    try {
                        const balanceMessage = await checkBalance(); // Check balance before starting coinflips
                        if (!balanceMessage) return;

                        console.log(`${colors.magenta}🟢 Starting: ${currentCoinflipCount} coinflips. Bet: ${currentBetValue}${colors.reset}`);

                        // Create an array of coinflip promises
                        const coinflipPromises = [];
                        for (let i = 0; i < currentCoinflipCount; i++) {
                            coinflipPromises.push(
                                dmChannel.sendSlash(userId, 'coinflip', currentBetValue.toString(), 'Heads')
                                    .catch(coinflipError => {
                                        console.log(`${colors.yellow}⚠️ | Error during coinflip ${i + 1}, but continuing...${colors.reset}`, coinflipError);
                                    })
                            );
                        }

                        // Send all coinflip commands concurrently and wait for all to finish
                        await Promise.all(coinflipPromises);

                        // Increase the bet and restart the routine
                        currentBetValue *= 10; // Increase the bet value after successful round
                        saveCoinflipData(currentBetValue, currentCoinflipCount); // Save the updated bet value and coinflip count
                        console.log(`${colors.green}✅ | Increasing bet value to ${currentBetValue}${colors.reset}`);
                        performCoinflipRoutine(); // Recursively call the function with the new bet value

                    } catch (error) {
                        console.error(`${colors.red}⛔ | Error during coinflips:${colors.reset}`, error);
                    }
                };

                performCoinflipRoutine();
            })
            .catch(err => console.error(`${colors.red}⛔ | Failed to create DM channel:${colors.reset}`, err));
    } else {
        console.log('User not found');
    }
});

client.login(process.env.token);
