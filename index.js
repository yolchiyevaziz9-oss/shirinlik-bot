const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.listen(process.env.PORT || 3000);

const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = parseInt(process.env.ADMIN_ID);

const MINIAPP_URL = 'https://shirinlik-bot.onrender.com';

let orders = [];
let orderCounter = 1;
let users = {};

function progressBar(current, total) {
  let bar = '';
  for (let i = 1; i <= total; i++) bar += i <= current ? '🟩' : '⬛';
  return bar;
}

function sendStep(ctx, stepNum, stepKey, lang, buttons) {
  const s = STEPS[stepKey][lang];
  const header = `🎂 TORT USTASI — ${stepNum}/8\n${progressBar(stepNum, 8)}\n\n${s.emoji} ${s.title}\n\n${s.hint}`;
  if (buttons) return ctx.reply(header, Markup.keyboard(chunkArray(buttons, 2).concat([[LANG[lang].back]])).resize());
  return ctx.reply(header, Markup.removeKeyboard());
}

const LANG = {
  uz: {
    welcome: `🍰 Xush kelibsiz!\n\nBiz eng mazali shirinliklarni tayyorlaymiz! 🎂\n\nQuyidan bo'limni tanlang:`,
    catalog: '🗂 Katalog', customTort: '🎨 Maxsus Tort Zakaz', contact: '📞 Aloqa',
    back: '⬅️ Orqaga', review: '⭐ Izoh qoldirish', myOrders: '📦 Buyurtmalarim',
    sections: { tort: '🎂 Tortlar', pirojniy: '🥐 Pirojniylar', desert: '🍮 Desertlar' },
    box: '📦 Korobka qo\'shilsinmi?', boxYes: '✅ Ha', boxNo: '❌ Yo\'q',
    askName: '👤 Ismingizni yozing:', askPhone: '📞 Telefon raqamingiz:',
    askLocation: '📍 Manzilingizni yuboring:', askPayment: '💳 To\'lov usulini tanlang:',
    payNaqd: '💵 Naqd', payClick: '📱 Click', payPayme: '💳 Payme',
    orderSent: '✅ Buyurtmangiz qabul qilindi!\nTez orada operator bog\'lanadi. Rahmat! 🙏',
    contactText: '📞 Aloqa:\n\n👤 Admin: @admin_username\n📱 Tel: +998901234567\n\n⏰ Ish vaqti: 08:00 - 20:00',
    sendLocation: '📍 Lokatsiya yuborish', or: 'yoki manzilni yozing',
    miniapp: '📱 Mini App orqali buyurtma bering:',
    openMenu: '🛍 Menyuni ochish',
  },
  ru: {
    welcome: `🍰 Добро пожаловать!\n\nМы готовим самые вкусные сладости! 🎂\n\nВыберите раздел:`,
    catalog: '🗂 Каталог', customTort: '🎨 Торт на заказ', contact: '📞 Контакт',
    back: '⬅️ Назад', review: '⭐ Оставить отзыв', myOrders: '📦 Мои заказы',
    sections: { tort: '🎂 Торты', pirojniy: '🥐 Пирожные', desert: '🍮 Десерты' },
    box: '📦 Добавить коробку?', boxYes: '✅ Да', boxNo: '❌ Нет',
    askName: '👤 Ваше имя:', askPhone: '📞 Номер телефона:',
    askLocation: '📍 Отправьте адрес:', askPayment: '💳 Способ оплаты:',
    payNaqd: '💵 Наличные', payClick: '📱 Click', payPayme: '💳 Payme',
    orderSent: '✅ Ваш заказ принят!\nОператор свяжется с вами. Спасибо! 🙏',
    contactText: '📞 Контакт:\n\n👤 Admin: @admin_username\n📱 Тел: +998901234567\n\n⏰ Время работы: 08:00 - 20:00',
    sendLocation: '📍 Отправить геолокацию', or: 'или напишите адрес',
    miniapp: '📱 Сделайте заказ через Mini App:',
    openMenu: '🛍 Открыть меню',
  },
  en: {
    welcome: `🍰 Welcome!\n\nWe make the most delicious sweets! 🎂\n\nChoose a section:`,
    catalog: '🗂 Catalog', customTort: '🎨 Custom Cake', contact: '📞 Contact',
    back: '⬅️ Back', review: '⭐ Leave a review', myOrders: '📦 My Orders',
    sections: { tort: '🎂 Cakes', pirojniy: '🥐 Pastries', desert: '🍮 Desserts' },
    box: '📦 Add gift box?', boxYes: '✅ Yes', boxNo: '❌ No',
    askName: '👤 Your name:', askPhone: '📞 Your phone:',
    askLocation: '📍 Send address:', askPayment: '💳 Payment method:',
    payNaqd: '💵 Cash', payClick: '📱 Click', payPayme: '💳 Payme',
    orderSent: '✅ Order accepted!\nOperator will contact you soon. Thank you! 🙏',
    contactText: '📞 Contact:\n\n👤 Admin: @admin_username\n📱 Phone: +998901234567\n\n⏰ Hours: 08:00 - 20:00',
    sendLocation: '📍 Send location', or: 'or type address',
    miniapp: '📱 Order via Mini App:',
    openMenu: '🛍 Open Menu',
  }
};

const PRODUCTS = {
  tort: [
    { id: 't1', name: { uz: '🎂 Klassik Oq Tort', ru: '🎂 Классический белый торт', en: '🎂 Classic White Cake' }, price: 190000, desc: { uz: 'Oq biskivit, qaymoq krem. 1kg = 190 000 so\'m', ru: 'Белый бисквит, сливочный крем. 1кг = 190 000 сум', en: 'White sponge, whipped cream. 1kg = 190 000 sum' } },
    { id: 't2', name: { uz: '🍫 Qora Shokolad Tort', ru: '🍫 Тёмный шоколадный торт', en: '🍫 Dark Chocolate Cake' }, price: 190000, desc: { uz: 'Qora biskivit, shokolad krem. 1kg = 190 000 so\'m', ru: 'Тёмный бисквит, шоколадный крем. 1кг = 190 000 сум', en: 'Dark sponge, chocolate cream. 1kg = 190 000 sum' } },
    { id: 't3', name: { uz: '☕ Kofe Tort', ru: '☕ Кофейный торт', en: '☕ Coffee Cake' }, price: 190000, desc: { uz: 'Kofe biskivit, chiz krem. 1kg = 190 000 so\'m', ru: 'Кофейный бисквит, крем-чиз. 1кг = 190 000 сум', en: 'Coffee sponge, cream cheese. 1kg = 190 000 sum' } },
    { id: 't4', name: { uz: '🍒 Malinali Tort', ru: '🍒 Малиновый торт', en: '🍒 Raspberry Cake' }, price: 190000, desc: { uz: 'Malinali biskivit, qaymoq krem. 1kg = 190 000 so\'m', ru: 'Малиновый бисквит, сливочный крем. 1кг = 190 000 сум', en: 'Raspberry sponge, cream. 1kg = 190 000 sum' } },
    { id: 't5', name: { uz: '🍫 Trufelniy Tort', ru: '🍫 Трюфельный торт', en: '🍫 Truffle Cake' }, price: 190000, desc: { uz: 'Trufelniy biskivit, qora krem. 1kg = 190 000 so\'m', ru: 'Трюфельный бисквит, тёмный крем. 1кг = 190 000 сум', en: 'Truffle sponge, dark cream. 1kg = 190 000 sum' } },
  ],
  pirojniy: [
    { id: 'p1', name: { uz: '🥐 Ekler', ru: '🥐 Эклер', en: '🥐 Eclair' }, price: 14000, desc: { uz: 'Shokolad glazurli. 1 dona', ru: 'С шоколадной глазурью. 1 шт', en: 'Chocolate glazed. 1 pcs' } },
    { id: 'p2', name: { uz: '🌹 Napoleon', ru: '🌹 Наполеон', en: '🌹 Napoleon' }, price: 18000, desc: { uz: 'Qatlama, kremi mo\'l. 1 bo\'lak', ru: 'Слоёный, с кремом. 1 кусочек', en: 'Layered with cream. 1 slice' } },
    { id: 'p3', name: { uz: '🍮 Shu Krem', ru: '🍮 Шу крем', en: '🍮 Cream Puff' }, price: 12000, desc: { uz: 'Vanillik krem. 1 dona', ru: 'Ванильный крем. 1 шт', en: 'Vanilla cream. 1 pcs' } },
  ],
  desert: [
    { id: 'd1', name: { uz: '🍮 Panna Kotta', ru: '🍮 Панна Котта', en: '🍮 Panna Cotta' }, price: 25000, desc: { uz: 'Italyan dessert. 1 dona', ru: 'Итальянский десерт. 1 шт', en: 'Italian dessert. 1 pcs' } },
    { id: 'd2', name: { uz: '🍫 Brauni', ru: '🍫 Брауни', en: '🍫 Brownie' }, price: 20000, desc: { uz: 'Shokolad keki. 1 bo\'lak', ru: 'Шоколадный кекс. 1 кусок', en: 'Chocolate cake. 1 slice' } },
    { id: 'd3', name: { uz: '🧁 Kapkeyk', ru: '🧁 Капкейк', en: '🧁 Cupcake' }, price: 15000, desc: { uz: 'Turli kremlarda. 1 dona', ru: 'С кремом. 1 шт', en: 'With cream. 1 pcs' } },
  ]
};

const CUSTOM = {
  biskivit: {
    uz: ['⬜ Oq biskivit', '⬛ Qora biskivit', '🍫 Trufelniy biskivit', '☕ Kofe biskivit', '🍒 Malinali biskivit'],
    ru: ['⬜ Белый', '⬛ Тёмный', '🍫 Трюфельный', '☕ Кофейный', '🍒 Малиновый'],
    en: ['⬜ White', '⬛ Dark', '🍫 Truffle', '☕ Coffee', '🍒 Raspberry'],
  },
  nachinka: {
    uz: ['🍒 Olchali', '🍌 Bananli', '🍫 Shokolad', '🍬 Iriska', '🥜 Yer yong\'oq', '❌ Kerak emas'],
    ru: ['🍒 Вишнёвая', '🍌 Банановая', '🍫 Шоколадная', '🍬 Ириска', '🥜 Арахис', '❌ Без начинки'],
    en: ['🍒 Cherry', '🍌 Banana', '🍫 Chocolate', '🍬 Caramel', '🥜 Peanut', '❌ No filling'],
  },
  krem: {
    uz: ['🤍 Qaymoq krem', '🧀 Chiz krem', '🖤 Qora qaymoq krem'],
    ru: ['🤍 Сливочный', '🧀 Крем-чиз', '🖤 Тёмный сливочный'],
    en: ['🤍 Whipped cream', '🧀 Cream cheese', '🖤 Dark whipped'],
  },
  bezak: {
    uz: ['🌸 Gul bezaklar', '🎀 Lenta va yozuv', '🍓 Yangi mevalar', '🍫 Shokolad figuralar', '✨ Oddiy tekis'],
    ru: ['🌸 Цветочный декор', '🎀 Лента и надпись', '🍓 Свежие фрукты', '🍫 Шоколадные фигуры', '✨ Простое'],
    en: ['🌸 Flowers', '🎀 Ribbon & text', '🍓 Fresh fruits', '🍫 Chocolate figures', '✨ Simple smooth'],
  },
  qavat: {
    uz: ['1️⃣ 1 qavat', '2️⃣ 2 qavat', '3️⃣ 3 qavat'],
    ru: ['1️⃣ 1 ярус', '2️⃣ 2 яруса', '3️⃣ 3 яруса'],
    en: ['1️⃣ 1 tier', '2️⃣ 2 tiers', '3️⃣ 3 tiers'],
  }
};

const STEPS = {
  biskivit: { uz: { title: 'Qaysi biskivitni tanlaymiz?', emoji: '🍞', hint: 'Tortning asosi!' }, ru: { title: 'Какой бисквит?', emoji: '🍞', hint: 'Основа торта!' }, en: { title: 'Which sponge?', emoji: '🍞', hint: 'The base!' } },
  qavat: { uz: { title: 'Necha qavatli?', emoji: '🏗', hint: '💡 1 qavat=1.5-2kg | 2 qavat=3-4kg | 3 qavat=5-7kg' }, ru: { title: 'Сколько ярусов?', emoji: '🏗', hint: '💡 1=1.5-2кг | 2=3-4кг | 3=5-7кг' }, en: { title: 'How many tiers?', emoji: '🏗', hint: '💡 1=1.5-2kg | 2=3-4kg | 3=5-7kg' } },
  kg: { uz: { title: 'Taxminiy og\'irlik (kg)?', emoji: '⚖️', hint: '💰 1kg = 190 000 so\'m\nRaqam yozing, masalan: 2' }, ru: { title: 'Примерный вес (кг)?', emoji: '⚖️', hint: '💰 1кг = 190 000 сум\nНапример: 2' }, en: { title: 'Approximate weight (kg)?', emoji: '⚖️', hint: '💰 1kg = 190 000 sum\nE.g. 2' } },
  nachinka: { uz: { title: 'Ichiga qanday nachinka?', emoji: '🍒', hint: 'Tortning yuragi!' }, ru: { title: 'Какая начинка?', emoji: '🍒', hint: 'Сердце торта!' }, en: { title: 'What filling?', emoji: '🍒', hint: 'The heart!' } },
  krem: { uz: { title: 'Qaysi krem?', emoji: '🤍', hint: 'Yumshoqlikni siz tanlaysiz!' }, ru: { title: 'Какой крем?', emoji: '🤍', hint: 'Нежность в руках!' }, en: { title: 'Which cream?', emoji: '🤍', hint: 'Choose!' } },
  bezak: { uz: { title: 'Ustki bezak?', emoji: '🎀', hint: 'Tortingizni chiroyli qilamiz!' }, ru: { title: 'Украшение?', emoji: '🎀', hint: 'Красиво!' }, en: { title: 'Decoration?', emoji: '🎀', hint: 'Make it beautiful!' } },
  yozuv: { uz: { title: 'Tortga yozuv?', emoji: '✏️', hint: 'Masalan: "Dilnoza 25 yosh 🎉"\nyoki "Kerak emas" deb yozing' }, ru: { title: 'Надпись на торте?', emoji: '✏️', hint: 'Например: "С днём рождения!"\nили "Нет"' }, en: { title: 'Text on cake?', emoji: '✏️', hint: 'E.g. "Happy Birthday!"\nor "No"' } },
  sana: { uz: { title: 'Qachon kerak?', emoji: '📅', hint: 'Sana va vaqtni yozing\nMasalan: 15-may soat 14:00' }, ru: { title: 'Когда нужен?', emoji: '📅', hint: 'Дата и время\nНапример: 15 мая в 14:00' }, en: { title: 'When do you need it?', emoji: '📅', hint: 'Date and time\nE.g. May 15 at 14:00' } },
};

const ORDER_STATUS = {
  new:       { uz: '🆕 Yangi', ru: '🆕 Новый', en: '🆕 New' },
  confirmed: { uz: '✅ Tasdiqlandi', ru: '✅ Подтверждён', en: '✅ Confirmed' },
  preparing: { uz: '👨‍🍳 Tayyorlanmoqda', ru: '👨‍🍳 Готовится', en: '👨‍🍳 Preparing' },
  ready:     { uz: '📦 Yetkazilmoqda', ru: '📦 Доставляется', en: '📦 Delivering' },
  delivered: { uz: '🎉 Yetkazildi!', ru: '🎉 Доставлен!', en: '🎉 Delivered!' },
  cancelled: { uz: '❌ Bekor qilindi', ru: '❌ Отменён', en: '❌ Cancelled' },
};

function getUser(id) {
  if (!users[id]) users[id] = { lang: null, step: null, order: {}, custom: {} };
  return users[id];
}
function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}
function mainMenu(ctx) {
  const id = ctx.from.id;
  const lang = getUser(id).lang || 'uz';
  const L = LANG[lang];
  ctx.reply(L.welcome, Markup.keyboard([
    [L.catalog, L.customTort],
    [L.myOrders, L.review],
    [L.contact]
  ]).resize());
  ctx.reply(L.miniapp, Markup.inlineKeyboard([
    [Markup.button.webApp(L.openMenu, MINIAPP_URL)]
  ]));
}
function getUserOrders(userId) {
  return orders.filter(o => o.userId === userId);
}

// TIL TANLASH
bot.start((ctx) => {
  users[ctx.from.id] = { lang: null, step: 'lang', order: {}, custom: {} };
  ctx.reply('🌐 Tilni tanlang / Выберите язык / Choose language:',
    Markup.keyboard([["🇺🇿 O'zbek", '🇷🇺 Русский', '🇬🇧 English']]).resize()
  );
});

bot.hears("🇺🇿 O'zbek", (ctx) => { const u = getUser(ctx.from.id); u.lang = 'uz'; u.step = null; mainMenu(ctx); });
bot.hears('🇷🇺 Русский', (ctx) => { const u = getUser(ctx.from.id); u.lang = 'ru'; u.step = null; mainMenu(ctx); });
bot.hears('🇬🇧 English', (ctx) => { const u = getUser(ctx.from.id); u.lang = 'en'; u.step = null; mainMenu(ctx); });

// KATALOG
['🗂 Katalog', '🗂 Каталог', '🗂 Catalog'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const L = LANG[lang];
    ctx.reply('📂 Bo\'limni tanlang:', Markup.keyboard([
      [L.sections.tort, L.sections.pirojniy],
      [L.sections.desert, L.back]
    ]).resize());
  });
});

function showSection(ctx, section) {
  const id = ctx.from.id;
  const lang = getUser(id).lang || 'uz';
  PRODUCTS[section].forEach(item => {
    const text = `${item.name[lang]}\n\n📝 ${item.desc[lang]}\n💰 ${item.price.toLocaleString()} so'm`;
    ctx.reply(text, Markup.inlineKeyboard([[Markup.button.callback(
      lang === 'uz' ? '🛒 Buyurtma' : lang === 'ru' ? '🛒 Заказать' : '🛒 Order',
      `order_${section}_${item.id}`
    )]]));
  });
}

['🎂 Tortlar', '🎂 Торты', '🎂 Cakes'].forEach(t => bot.hears(t, ctx => showSection(ctx, 'tort')));
['🥐 Pirojniylar', '🥐 Пирожные', '🥐 Pastries'].forEach(t => bot.hears(t, ctx => showSection(ctx, 'pirojniy')));
['🍮 Desertlar', '🍮 Десерты', '🍮 Desserts'].forEach(t => bot.hears(t, ctx => showSection(ctx, 'desert')));

bot.action(/^order_(.+)_(.+)$/, (ctx) => {
  const id = ctx.from.id;
  const lang = getUser(id).lang || 'uz';
  const L = LANG[lang];
  const item = PRODUCTS[ctx.match[1]]?.find(p => p.id === ctx.match[2]);
  if (!item) return;
  const u = getUser(id);
  u.order = { type: 'catalog', itemName: item.name[lang], price: item.price };
  u.step = 'box';
  ctx.answerCbQuery();
  ctx.reply(L.box, Markup.keyboard([[L.boxYes, L.boxNo]]).resize());
});

// MAXSUS TORT
['🎨 Maxsus Tort Zakaz', '🎨 Торт на заказ', '🎨 Custom Cake'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const u = getUser(id);
    u.step = 'custom_biskivit';
    u.custom = {};
    u.order = { type: 'custom' };
    const intro = {
      uz: `🎮 O'YINGA XUSH KELIBSIZ!\n\n✨ Hozir siz O'Z TORTINGIZNI yaratAsiz!\n💰 Narx: 1kg = 190 000 so'm\n\nTayyor bo'ling... 3... 2... 1... 🚀`,
      ru: `🎮 ДОБРО ПОЖАЛОВАТЬ!\n\n✨ Создайте СВОЙ ТОРТ!\n💰 Цена: 1кг = 190 000 сум\n\nГотовы? 3... 2... 1... 🚀`,
      en: `🎮 WELCOME!\n\n✨ CREATE YOUR OWN CAKE!\n💰 Price: 1kg = 190 000 sum\n\nReady? 3... 2... 1... 🚀`,
    };
    ctx.reply(intro[lang], Markup.removeKeyboard());
    setTimeout(() => sendStep(ctx, 1, 'biskivit', lang, CUSTOM.biskivit[lang]), 1500);
  });
});

// BUYURTMALARIM
['📦 Buyurtmalarim', '📦 Мои заказы', '📦 My Orders'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const myOrders = getUserOrders(id);
    if (myOrders.length === 0) {
      const msg = { uz: '📭 Sizda hali buyurtma yo\'q.', ru: '📭 У вас пока нет заказов.', en: '📭 You have no orders yet.' };
      return ctx.reply(msg[lang]);
    }
    const title = { uz: '📦 SIZNING BUYURTMALARINGIZ:', ru: '📦 ВАШИ ЗАКАЗЫ:', en: '📦 YOUR ORDERS:' };
    let text = `${title[lang]}\n\n`;
    myOrders.slice(-5).forEach(o => {
      const status = ORDER_STATUS[o.status]?.[lang] || o.status;
      text += `🔖 #${o.id} — ${o.productName}\n📊 ${status}\n📅 ${o.date}\n\n`;
    });
    ctx.reply(text);
  });
});

// IZOH
['⭐ Izoh qoldirish', '⭐ Оставить отзыв', '⭐ Leave a review'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const u = getUser(id);
    u.step = 'review_rating';
    const msg = { uz: '⭐ Reytingni tanlang:', ru: '⭐ Выберите оценку:', en: '⭐ Choose rating:' };
    ctx.reply(msg[lang], Markup.keyboard([
      ['⭐ 1', '⭐⭐ 2', '⭐⭐⭐ 3'],
      ['⭐⭐⭐⭐ 4', '⭐⭐⭐⭐⭐ 5'],
      [LANG[lang].back]
    ]).resize());
  });
});

// ALOQA
['📞 Aloqa', '📞 Контакт', '📞 Contact'].forEach(txt => {
  bot.hears(txt, (ctx) => ctx.reply(LANG[getUser(ctx.from.id).lang || 'uz'].contactText));
});
['⬅️ Orqaga', '⬅️ Назад', '⬅️ Back'].forEach(txt => bot.hears(txt, ctx => mainMenu(ctx)));

// ADMIN PANEL
bot.command('admin', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return ctx.reply('❌ Ruxsat yo\'q!');
  const today = new Date().toLocaleDateString('uz-UZ');
  const todayOrders = orders.filter(o => o.date === today);
  const totalRevenue = todayOrders.reduce((sum, o) => sum + (o.price || 0), 0);
  const statusCount = {};
  Object.keys(ORDER_STATUS).forEach(s => { statusCount[s] = orders.filter(o => o.status === s).length; });
  const text = `📊 ADMIN PANEL\n━━━━━━━━━━━━━━━━\n📅 Bugun: ${today}\n📦 Bugungi buyurtmalar: ${todayOrders.length} ta\n💰 Taxminiy tushum: ${totalRevenue.toLocaleString()} so'm\n━━━━━━━━━━━━━━━━\n🆕 Yangi: ${statusCount.new||0}\n✅ Tasdiqlangan: ${statusCount.confirmed||0}\n👨‍🍳 Tayyorlanmoqda: ${statusCount.preparing||0}\n📦 Yetkazilmoqda: ${statusCount.ready||0}\n🎉 Yetkazildi: ${statusCount.delivered||0}\n❌ Bekor: ${statusCount.cancelled||0}\n━━━━━━━━━━━━━━━━\n📋 Jami: ${orders.length} ta`;
  ctx.reply(text, Markup.inlineKeyboard([
    [Markup.button.callback('📋 Oxirgi 5 buyurtma', 'admin_last5')],
    [Markup.button.callback('🆕 Yangi buyurtmalar', 'admin_new')],
  ]));
});

bot.action('admin_last5', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.answerCbQuery();
  if (orders.length === 0) return ctx.reply('📭 Hozircha buyurtma yo\'q.');
  let text = '📋 OXIRGI 5 BUYURTMA:\n\n';
  orders.slice(-5).reverse().forEach(o => {
    text += `🔖 #${o.id} — ${o.productName}\n👤 ${o.customerName} | 📞 ${o.phone}\n📊 ${ORDER_STATUS[o.status]?.uz}\n📅 ${o.date}\n\n`;
  });
  ctx.reply(text);
});

bot.action('admin_new', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.answerCbQuery();
  const newOrders = orders.filter(o => o.status === 'new');
  if (newOrders.length === 0) return ctx.reply('✅ Yangi buyurtmalar yo\'q.');
  let text = '🆕 YANGI BUYURTMALAR:\n\n';
  newOrders.forEach(o => { text += `🔖 #${o.id} — ${o.productName}\n👤 ${o.customerName} | 📞 ${o.phone}\n/status_${o.id}\n\n`; });
  ctx.reply(text);
});

bot.hears(/^\/status_(\d+)$/, (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  const orderId = parseInt(ctx.match[1]);
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.reply('❌ Buyurtma topilmadi.');
  ctx.reply(`🔖 #${orderId} — ${order.customerName}\nHozirgi: ${ORDER_STATUS[order.status]?.uz}`,
    Markup.inlineKeyboard([
      [Markup.button.callback('✅ Tasdiqlandi', `setstatus_${orderId}_confirmed`)],
      [Markup.button.callback('👨‍🍳 Tayyorlanmoqda', `setstatus_${orderId}_preparing`)],
      [Markup.button.callback('📦 Yetkazilmoqda', `setstatus_${orderId}_ready`)],
      [Markup.button.callback('🎉 Yetkazildi', `setstatus_${orderId}_delivered`)],
      [Markup.button.callback('❌ Bekor', `setstatus_${orderId}_cancelled`)],
    ])
  );
});

bot.action(/^setstatus_(\d+)_(.+)$/, (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  ctx.answerCbQuery();
  const orderId = parseInt(ctx.match[1]);
  const newStatus = ctx.match[2];
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = newStatus;
  ctx.reply(`✅ #${orderId} — ${ORDER_STATUS[newStatus]?.uz}`);
  const userLang = order.userLang || 'uz';
  const msg = { uz: `🔔 Buyurtma #${orderId} yangilandi!\n📊 ${ORDER_STATUS[newStatus]?.uz}${newStatus==='delivered'?'\n\n🎉 Yoqimli ishtaha!':''}`, ru: `🔔 Заказ #${orderId} обновлён!\n📊 ${ORDER_STATUS[newStatus]?.ru}`, en: `🔔 Order #${orderId} updated!\n📊 ${ORDER_STATUS[newStatus]?.en}` };
  bot.telegram.sendMessage(order.userId, msg[userLang]).catch(() => {});
});

// TEXT HANDLER
bot.on('text', (ctx) => {
  const id = ctx.from.id;
  const u = getUser(id);
  const lang = u.lang || 'uz';
  const L = LANG[lang];
  const text = ctx.message.text;
  const step = u.step;

  if (step === 'review_rating') {
    u.order.reviewRating = text; u.step = 'review_text';
    const msg = { uz: `${text} — ajoyib!\n\nIzohingizni yozing:`, ru: `${text} — отлично!\n\nНапишите отзыв:`, en: `${text} — great!\n\nWrite your review:` };
    return ctx.reply(msg[lang], Markup.removeKeyboard());
  }
  if (step === 'review_text') {
    bot.telegram.sendMessage(ADMIN_ID, `⭐ YANGI IZOH!\n${u.order.reviewRating}\n💬 "${text}"\n👤 ${ctx.from.first_name} (ID: ${id})`).catch(() => {});
    const thanks = { uz: '🙏 Izohingiz uchun rahmat! ⭐', ru: '🙏 Спасибо за отзыв! ⭐', en: '🙏 Thank you for your review! ⭐' };
    ctx.reply(thanks[lang]);
    u.step = null;
    return setTimeout(() => mainMenu(ctx), 1000);
  }

  if (step === 'custom_biskivit') { u.custom.biskivit = text; u.step = 'custom_qavat'; return sendStep(ctx, 2, 'qavat', lang, CUSTOM.qavat[lang]); }
  if (step === 'custom_qavat') { u.custom.qavat = text; u.step = 'custom_kg'; return sendStep(ctx, 3, 'kg', lang, null); }
  if (step === 'custom_kg') {
    const kg = parseFloat(text);
    u.custom.kg = text;
    u.custom.taxminiyNarx = isNaN(kg) ? '—' : (kg * 190000).toLocaleString();
    u.step = 'custom_nachinka';
    const msg = { uz: `💰 Taxminiy narx: ${u.custom.taxminiyNarx} so'm 🔥`, ru: `💰 Примерная цена: ${u.custom.taxminiyNarx} сум 🔥`, en: `💰 Est. price: ${u.custom.taxminiyNarx} sum 🔥` };
    ctx.reply(msg[lang]);
    return setTimeout(() => sendStep(ctx, 4, 'nachinka', lang, CUSTOM.nachinka[lang]), 800);
  }
  if (step === 'custom_nachinka') { u.custom.nachinka = text; u.step = 'custom_krem'; return sendStep(ctx, 5, 'krem', lang, CUSTOM.krem[lang]); }
  if (step === 'custom_krem') { u.custom.krem = text; u.step = 'custom_bezak'; return sendStep(ctx, 6, 'bezak', lang, CUSTOM.bezak[lang]); }
  if (step === 'custom_bezak') { u.custom.bezak = text; u.step = 'custom_yozuv'; return sendStep(ctx, 7, 'yozuv', lang, null); }
  if (step === 'custom_yozuv') { u.custom.yozuv = text; u.step = 'custom_sana'; return sendStep(ctx, 8, 'sana', lang, null); }
  if (step === 'custom_sana') {
    u.custom.sana = text; u.step = 'custom_confirm';
    const c = u.custom;
    const summary = { uz: `🎉 TORTINGIZ TAYYOR!\n${progressBar(8,8)} ✅\n\n🍞 ${c.biskivit}\n🏗 ${c.qavat}\n⚖️ ${c.kg} kg\n💰 ~${c.taxminiyNarx} so'm\n🍒 ${c.nachinka}\n🤍 ${c.krem}\n🎀 ${c.bezak}\n✏️ ${c.yozuv}\n📅 ${c.sana}\n\n🚀 Tasdiqlaysizmi?`, ru: `🎉 ВАШ ТОРТ ГОТОВ!\n${progressBar(8,8)} ✅\n\n🍞 ${c.biskivit}\n🏗 ${c.qavat}\n⚖️ ${c.kg} кг\n💰 ~${c.taxminiyNarx} сум\n🍒 ${c.nachinka}\n🤍 ${c.krem}\n🎀 ${c.bezak}\n✏️ ${c.yozuv}\n📅 ${c.sana}\n\n🚀 Подтверждаете?`, en: `🎉 YOUR CAKE IS READY!\n${progressBar(8,8)} ✅\n\n🍞 ${c.biskivit}\n🏗 ${c.qavat}\n⚖️ ${c.kg} kg\n💰 ~${c.taxminiyNarx} sum\n🍒 ${c.nachinka}\n🤍 ${c.krem}\n🎀 ${c.bezak}\n✏️ ${c.yozuv}\n📅 ${c.sana}\n\n🚀 Confirm?` };
    const btn = { uz: ['✅ Tasdiqlash', '🔄 Qayta boshlash'], ru: ['✅ Подтвердить', '🔄 Начать заново'], en: ['✅ Confirm', '🔄 Start over'] };
    return ctx.reply(summary[lang], Markup.keyboard([btn[lang], [L.back]]).resize());
  }
  if (step === 'custom_confirm') {
    const yes = { uz: '✅ Tasdiqlash', ru: '✅ Подтвердить', en: '✅ Confirm' };
    const no = { uz: '🔄 Qayta boshlash', ru: '🔄 Начать заново', en: '🔄 Start over' };
    if (text === no[lang]) { u.step = null; u.custom = {}; u.order = {}; return mainMenu(ctx); }
    if (text === yes[lang]) { u.step = 'box'; return ctx.reply(L.box, Markup.keyboard([[L.boxYes, L.boxNo]]).resize()); }
  }
  if (step === 'box') { u.order.box = (text === L.boxYes); u.step = 'ask_name'; return ctx.reply(L.askName, Markup.removeKeyboard()); }
  if (step === 'ask_name') { u.order.name = text; u.step = 'ask_phone'; return ctx.reply(L.askPhone); }
  if (step === 'ask_phone') { u.order.phone = text; u.step = 'ask_location'; return ctx.reply(`${L.askLocation}\n\n${L.or}`, Markup.keyboard([[Markup.button.locationRequest(L.sendLocation)]]).resize()); }
  if (step === 'ask_location') { u.order.location = text; u.step = 'ask_payment'; return ctx.reply(L.askPayment, Markup.keyboard([[L.payNaqd], [L.payClick, L.payPayme]]).resize()); }
  if (step === 'ask_payment') { u.order.payment = text; return finishOrder(ctx, id); }
});

bot.on('location', (ctx) => {
  const id = ctx.from.id;
  const u = getUser(id);
  const lang = u.lang || 'uz';
  const L = LANG[lang];
  if (u.step === 'ask_location') {
    const loc = ctx.message.location;
    u.order.location = `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
    u.step = 'ask_payment';
    ctx.reply(L.askPayment, Markup.keyboard([[L.payNaqd], [L.payClick, L.payPayme]]).resize());
  }
});

// Mini App dan kelgan buyurtma
bot.on('web_app_data', (ctx) => {
  try {
    const data = JSON.parse(ctx.webAppData.data);
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const orderId = orderCounter++;
    let productName = data.type === 'custom_tort' ? `Maxsus Tort (${data.biskivit})` : data.items?.map(i => i.name).join(', ') || 'Mahsulot';
    const price = data.total || data.price || 0;
    orders.push({ id: orderId, userId: id, userLang: lang, type: data.type, productName, customerName: ctx.from.first_name, phone: '—', location: '—', payment: '—', price, status: 'new', date: new Date().toLocaleDateString('uz-UZ') });
    const adminText = `📬 MINI APP BUYURTMA #${orderId}!\n👤 ${ctx.from.first_name} (@${ctx.from.username||'—'}) ID: ${id}\n🛍 ${productName}\n💰 ${price.toLocaleString()} so'm\n/status_${orderId}`;
    bot.telegram.sendMessage(ADMIN_ID, adminText).catch(() => {});
    ctx.reply(`✅ Buyurtma #${orderId} qabul qilindi!\nTez orada bog'lanamiz. 🙏`);
  } catch(e) {}
});

function finishOrder(ctx, id) {
  const u = getUser(id);
  const lang = u.lang || 'uz';
  const L = LANG[lang];
  const o = u.order;
  const c = u.custom;
  const today = new Date().toLocaleDateString('uz-UZ');
  const orderId = orderCounter++;
  let productName = o.type === 'custom' ? `Maxsus Tort (${c.biskivit}, ${c.kg}kg)` : o.itemName;
  orders.push({ id: orderId, userId: id, userLang: lang, type: o.type, productName, customerName: o.name, phone: o.phone, location: o.location, payment: o.payment, box: o.box, price: o.type==='custom' ? (parseFloat(c.kg)*190000||0) : (o.price||0), status: 'new', date: today, custom: o.type==='custom'?{...c}:null });
  let orderText = o.type === 'custom'
    ? `🎨 MAXSUS TORT\n━━━━━━━━━━━━━━━━\n🍞 ${c.biskivit}\n🏗 ${c.qavat}\n⚖️ ${c.kg} kg\n💰 ~${c.taxminiyNarx} so'm\n🍒 ${c.nachinka}\n🤍 ${c.krem}\n🎀 ${c.bezak}\n✏️ ${c.yozuv}\n📅 ${c.sana}\n📦 Korobka: ${o.box?'✅':'❌'}\n━━━━━━━━━━━━━━━━`
    : `🛒 KATALOG\n━━━━━━━━━━━━━━━━\n🍰 ${o.itemName}\n💰 ${o.price?.toLocaleString()} so'm\n📦 Korobka: ${o.box?'✅':'❌'}\n━━━━━━━━━━━━━━━━`;
  const fullText = `📬 YANGI BUYURTMA #${orderId}!\n${orderText}\n👤 ${o.name}\n📞 ${o.phone}\n📍 ${o.location}\n💳 ${o.payment}\n👤 @${ctx.from.username||'—'} (ID: ${id})\n\n/status_${orderId}`;
  bot.telegram.sendMessage(ADMIN_ID, fullText).catch(() => {});
  if (o.payment?.includes('Click')) ctx.reply('💳 Click:\nhttps://my.click.uz/services/YOUR_SERVICE_ID');
  else if (o.payment?.includes('Payme')) ctx.reply('💳 Payme:\nhttps://payme.uz/YOUR_MERCHANT_ID');
  ctx.reply(L.orderSent);
  users[id] = { lang, step: null, order: {}, custom: {} };
  setTimeout(() => mainMenu(ctx), 1500);
}

bot.launch();
console.log('✅ Bot ishga tushdi!');
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));