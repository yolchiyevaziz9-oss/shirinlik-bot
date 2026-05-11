const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf('8665729423:AAGWZ6elXAEUIi_P1sTlbyTO_4EFzqasYBA');

const ADMIN_ID =5947540122; // O'z admin ID ni yoz

// =====================
// TILLAR
// =====================
const LANG = {
  uz: {
    welcome: `🍰 Xush kelibsiz!\n\nBiz eng mazali shirinliklarni tayyorlaymiz — tortdan tutib desert va pirojniylargacha! 🎂\n\nQuyidan bo'limni tanlang:`,
    catalog: '🗂 Katalog',
    customTort: '🎨 Maxsus Tort Zakaz',
    contact: '📞 Aloqa',
    back: '⬅️ Orqaga',
    sections: {
      tort: '🎂 Tortlar',
      pirojniy: '🥐 Pirojniylar',
      desert: '🍮 Desertlar',
    },
    customSteps: {
      biskivit: '🍞 Biskivit turini tanlang:',
      meva: '🍓 Ichidagi meva/to\'ldirma:',
      ust: '🍫 Ustki qatlam:',
      bezak: '🎀 Ustki bezak:',
    },
    box: '📦 Qadoq (Korobka) qo\'shilsinmi?',
    boxYes: '✅ Ha, qo\'shish',
    boxNo: '❌ Yo\'q kerak emas',
    askName: '👤 Ismingizni yozing:',
    askPhone: '📞 Telefon raqamingiz:',
    askLocation: '📍 Manzilingizni yuboring (lokatsiya yoki yozib):',
    askPayment: '💳 To\'lov usulini tanlang:',
    payNaqd: '💵 Naqd (yetkazganda)',
    payClick: '📱 Click',
    payPayme: '💳 Payme',
    orderSent: '✅ Buyurtmangiz qabul qilindi!\nTez orada operator bog\'lanadi. Rahmat! 🙏',
    contactText: '📞 Aloqa:\n\n👤 Admin: @AzizxojaYolchiyev\n📱 Tel: +998507214405\n\n⏰ Ish vaqti: 08:00 - 22:00',
    sendLocation: '📍 Lokatsiya yuborish',
    or: 'yoki manzilni yozing',
  },
  ru: {
    welcome: `🍰 Добро пожаловать!\n\nМы готовим самые вкусные сладости — от тортов до десертов и пирожных! 🎂\n\nВыберите раздел:`,
    catalog: '🗂 Каталог',
    customTort: '🎨 Торт на заказ',
    contact: '📞 Контакт',
    back: '⬅️ Назад',
    sections: {
      tort: '🎂 Торты',
      pirojniy: '🥐 Пирожные',
      desert: '🍮 Десерты',
    },
    customSteps: {
      biskivit: '🍞 Выберите вид бисквита:',
      meva: '🍓 Начинка/фрукты внутри:',
      ust: '🍫 Верхний крем:',
      bezak: '🎀 Украшение сверху:',
    },
    box: '📦 Добавить коробку?',
    boxYes: '✅ Да',
    boxNo: '❌ Нет',
    askName: '👤 Ваше имя:',
    askPhone: '📞 Номер телефона:',
    askLocation: '📍 Отправьте адрес (геолокацию или напишите):',
    askPayment: '💳 Способ оплаты:',
    payNaqd: '💵 Наличные',
    payClick: '📱 Click',
    payPayme: '💳 Payme',
    orderSent: '✅ Ваш заказ принят!\nОператор скоро свяжется. Спасибо! 🙏',
    contactText: '📞 Контакт:\n\n👤 Admin: @admin_username\n📱 Тел: +998901234567\n\n⏰ Время работы: 08:00 - 20:00',
    sendLocation: '📍 Отправить геолокацию',
    or: 'или напишите адрес',
  },
  en: {
    welcome: `🍰 Welcome!\n\nWe make the most delicious sweets — from cakes to desserts and pastries! 🎂\n\nChoose a section:`,
    catalog: '🗂 Catalog',
    customTort: '🎨 Custom Cake Order',
    contact: '📞 Contact',
    back: '⬅️ Back',
    sections: {
      tort: '🎂 Cakes',
      pirojniy: '🥐 Pastries',
      desert: '🍮 Desserts',
    },
    customSteps: {
      biskivit: '🍞 Choose biscuit type:',
      meva: '🍓 Filling/fruits inside:',
      ust: '🍫 Top cream layer:',
      bezak: '🎀 Top decoration:',
    },
    box: '📦 Add a gift box?',
    boxYes: '✅ Yes',
    boxNo: '❌ No',
    askName: '👤 Your name:',
    askPhone: '📞 Your phone number:',
    askLocation: '📍 Send your address (location or text):',
    askPayment: '💳 Payment method:',
    payNaqd: '💵 Cash on delivery',
    payClick: '📱 Click',
    payPayme: '💳 Payme',
    orderSent: '✅ Your order is accepted!\nAn operator will contact you soon. Thank you! 🙏',
    contactText: '📞 Contact:\n\n👤 Admin: @admin_username\n📱 Phone: +998901234567\n\n⏰ Working hours: 08:00 - 20:00',
    sendLocation: '📍 Send location',
    or: 'or type your address',
  }
};

// =====================
// MAHSULOTLAR
// =====================
const PRODUCTS = {
  tort: [
    { id: 't1', name: { uz: '🎂 Shokolad Tort', ru: '🎂 Шоколадный торт', en: '🎂 Chocolate Cake' }, price: 150000, desc: { uz: 'Shokolad biskivit, krem va shokola glazur. Og\'irligi: 1.5kg', ru: 'Шоколадный бисквит, крем и глазурь. Вес: 1.5кг', en: 'Chocolate sponge, cream and glaze. Weight: 1.5kg' }, img: 'https://i.imgur.com/placeholder1.jpg' },
    { id: 't2', name: { uz: '🍓 Qulupnay Tort', ru: '🍓 Клубничный торт', en: '🍓 Strawberry Cake' }, price: 170000, desc: { uz: 'Vanillik biskivit, qulupnay murabbo, oq krem. Og\'irligi: 1.5kg', ru: 'Ванильный бисквит, клубничный джем, белый крем. Вес: 1.5кг', en: 'Vanilla sponge, strawberry jam, white cream. Weight: 1.5kg' }, img: 'https://i.imgur.com/placeholder2.jpg' },
    { id: 't3', name: { uz: '🍋 Limon Tort', ru: '🍋 Лимонный торт', en: '🍋 Lemon Cake' }, price: 160000, desc: { uz: 'Limonli krem, engil va yangilovchi ta\'m. Og\'irligi: 1kg', ru: 'Лимонный крем, лёгкий освежающий вкус. Вес: 1кг', en: 'Lemon cream, light and refreshing taste. Weight: 1kg' }, img: 'https://i.imgur.com/placeholder3.jpg' },
  ],
  pirojniy: [
    { id: 'p1', name: { uz: '🥐 Shu Krem', ru: '🥐 Шу крем', en: '🥐 Cream Puff' }, price: 12000, desc: { uz: 'Ichida vanillik krem, yumshoq xamir. 1 dona', ru: 'Внутри ванильный крем, мягкое тесто. 1 шт', en: 'Vanilla cream inside, soft pastry. 1 pcs' }, img: '' },
    { id: 'p2', name: { uz: '🍫 Ekler', ru: '🍫 Эклер', en: '🍫 Eclair' }, price: 14000, desc: { uz: 'Shokolad glazurli, krem to\'ldirilgan ekler. 1 dona', ru: 'С шоколадной глазурью, кремовый эклер. 1 шт', en: 'Chocolate glazed cream eclair. 1 pcs' }, img: '' },
    { id: 'p3', name: { uz: '🌹 Napoleon', ru: '🌹 Наполеон', en: '🌹 Napoleon' }, price: 18000, desc: { uz: 'Qatlama-qatlama, kremi mo\'l napoleon. 1 bo\'lak', ru: 'Слоёный наполеон с кремом. 1 кусочек', en: 'Layered Napoleon with cream. 1 slice' }, img: '' },
  ],
  desert: [
    { id: 'd1', name: { uz: '🍮 Panna Kotta', ru: '🍮 Панна Котта', en: '🍮 Panna Cotta' }, price: 25000, desc: { uz: 'Italyan dessert, qulupnay sous bilan. 1 dona', ru: 'Итальянский десерт с клубничным соусом. 1 шт', en: 'Italian dessert with strawberry sauce. 1 pcs' }, img: '' },
    { id: 'd2', name: { uz: '🍫 Brauni', ru: '🍫 Брауни', en: '🍫 Brownie' }, price: 20000, desc: { uz: 'Zich shokolad keki, issiq yeb bo\'ladi. 1 bo\'lak', ru: 'Плотный шоколадный кекс, вкусен тёплым. 1 кусок', en: 'Dense chocolate cake, best served warm. 1 slice' }, img: '' },
    { id: 'd3', name: { uz: '🧁 Kapkeyk', ru: '🧁 Капкейк', en: '🧁 Cupcake' }, price: 15000, desc: { uz: 'Turli xil kremlarda kapkeyk. 1 dona', ru: 'Капкейк с различными кремами. 1 шт', en: 'Cupcake with various cream toppings. 1 pcs' }, img: '' },
  ]
};

// Maxsus tort tanlash variantlari
const CUSTOM_OPTIONS = {
  biskivit: {
    uz: ['🍫 Shokolad biskivit', '🍦 Vanil biskivit', '🍋 Limon biskivit', '🔴 Qizil Barxat'],
    ru: ['🍫 Шоколадный', '🍦 Ванильный', '🍋 Лимонный', '🔴 Красный Бархат'],
    en: ['🍫 Chocolate', '🍦 Vanilla', '🍋 Lemon', '🔴 Red Velvet'],
  },
  meva: {
    uz: ['🍓 Qulupnay', '🍑 Shaftoli', '🥭 Mango', '🍒 Gilos', '🍌 Banan', '❌ Meva kerak emas'],
    ru: ['🍓 Клубника', '🍑 Персик', '🥭 Манго', '🍒 Вишня', '🍌 Банан', '❌ Без фруктов'],
    en: ['🍓 Strawberry', '🍑 Peach', '🥭 Mango', '🍒 Cherry', '🍌 Banana', '❌ No fruit'],
  },
  ust: {
    uz: ['🍫 Shokolad krem', '🍦 Oq krem', '🍓 Meva krem', '🧈 Sariyog\' krem'],
    ru: ['🍫 Шоколадный крем', '🍦 Белый крем', '🍓 Фруктовый крем', '🧈 Масляный крем'],
    en: ['🍫 Chocolate cream', '🍦 White cream', '🍓 Fruit cream', '🧈 Butter cream'],
  },
  bezak: {
    uz: ['🌸 Gul bezaklar', '🎀 Lenta va yozuv', '🍓 Yangi mevalar', '🍫 Shokolad figuralar', '✨ Oddiy tekis'],
    ru: ['🌸 Цветочный декор', '🎀 Лента и надпись', '🍓 Свежие фрукты', '🍫 Шоколадные фигуры', '✨ Простое гладкое'],
    en: ['🌸 Flower decorations', '🎀 Ribbon & writing', '🍓 Fresh fruits', '🍫 Chocolate figures', '✨ Simple smooth'],
  }
};

// =====================
// USER STATE
// =====================
let users = {};

function getUser(id) {
  if (!users[id]) users[id] = { lang: null, step: null, order: {}, customTort: {} };
  return users[id];
}

function t(id, key) {
  const u = getUser(id);
  const lang = u.lang || 'uz';
  return LANG[lang][key];
}

// =====================
// MAIN MENU
// =====================
function mainMenu(ctx) {
  const id = ctx.from.id;
  const lang = getUser(id).lang || 'uz';
  const L = LANG[lang];
  return ctx.reply(L.welcome, Markup.keyboard([
    [L.catalog, L.customTort],
    [L.contact]
  ]).resize());
}

// =====================
// TIL TANLASH
// =====================
bot.start((ctx) => {
  const id = ctx.from.id;
  users[id] = { lang: null, step: 'lang', order: {}, customTort: {} };
  ctx.reply('🌐 Tilni tanlang / Выберите язык / Choose language:',
    Markup.keyboard([
      ["🇺🇿 O'zbek", '🇷🇺 Русский', '🇬🇧 English']
    ]).resize()
  );
});

bot.hears("🇺🇿 O'zbek", (ctx) => {
  const u = getUser(ctx.from.id);
  u.lang = 'uz'; u.step = null;
  mainMenu(ctx);
});
bot.hears('🇷🇺 Русский', (ctx) => {
  const u = getUser(ctx.from.id);
  u.lang = 'ru'; u.step = null;
  mainMenu(ctx);
});
bot.hears('🇬🇧 English', (ctx) => {
  const u = getUser(ctx.from.id);
  u.lang = 'en'; u.step = null;
  mainMenu(ctx);
});

// =====================
// KATALOG
// =====================
['🗂 Katalog', '🗂 Каталог', '🗂 Catalog'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const L = LANG[lang];
    ctx.reply('📂', Markup.keyboard([
      [L.sections.tort, L.sections.pirojniy],
      [L.sections.desert, L.back]
    ]).resize());
  });
});

// Bo'lim tanlash
function showSection(ctx, section) {
  const id = ctx.from.id;
  const lang = getUser(id).lang || 'uz';
  const items = PRODUCTS[section];
  items.forEach(item => {
    const text = `${item.name[lang]}\n\n📝 ${item.desc[lang]}\n💰 Narx: ${item.price.toLocaleString()} so'm`;
    ctx.reply(text, Markup.inlineKeyboard([
      [Markup.button.callback(
        lang === 'uz' ? '🛒 Buyurtma berish' : lang === 'ru' ? '🛒 Заказать' : '🛒 Order',
        `order_${section}_${item.id}`
      )]
    ]));
  });
}

['🎂 Tortlar', '🎂 Торты', '🎂 Cakes'].forEach(t => bot.hears(t, ctx => showSection(ctx, 'tort')));
['🥐 Pirojniylar', '🥐 Пирожные', '🥐 Pastries'].forEach(t => bot.hears(t, ctx => showSection(ctx, 'pirojniy')));
['🍮 Desertlar', '🍮 Десерты', '🍮 Desserts'].forEach(t => bot.hears(t, ctx => showSection(ctx, 'desert')));

// Mahsulot buyurtma (inline button)
bot.action(/^order_(.+)_(.+)$/, (ctx) => {
  const id = ctx.from.id;
  const lang = getUser(id).lang || 'uz';
  const L = LANG[lang];
  const section = ctx.match[1];
  const itemId = ctx.match[2];
  const item = PRODUCTS[section].find(p => p.id === itemId);
  if (!item) return;

  const u = getUser(id);
  u.order = { type: 'catalog', section, itemId, itemName: item.name[lang], price: item.price };
  u.step = 'box';

  ctx.answerCbQuery();
  ctx.reply(L.box, Markup.keyboard([
    [L.boxYes, L.boxNo]
  ]).resize());
});

// =====================
// MAXSUS TORT
// =====================
['🎨 Maxsus Tort Zakaz', '🎨 Торт на заказ', '🎨 Custom Cake Order'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    const lang = getUser(id).lang || 'uz';
    const u = getUser(id);
    u.step = 'custom_biskivit';
    u.customTort = {};
    u.order = { type: 'custom' };

    const opts = CUSTOM_OPTIONS.biskivit[lang];
    ctx.reply(LANG[lang].customSteps.biskivit,
      Markup.keyboard(chunkArray(opts, 2).concat([[LANG[lang].back]])).resize()
    );
  });
});

// =====================
// ALOQA
// =====================
['📞 Aloqa', '📞 Контакт', '📞 Contact'].forEach(txt => {
  bot.hears(txt, (ctx) => {
    const id = ctx.from.id;
    ctx.reply(t(id, 'contactText'));
  });
});

// =====================
// ORQAGA
// =====================
['⬅️ Orqaga', '⬅️ Назад', '⬅️ Back'].forEach(txt => {
  bot.hears(txt, (ctx) => mainMenu(ctx));
});

// =====================
// TEXT HANDLER (step logic)
// =====================
bot.on('text', (ctx) => {
  const id = ctx.from.id;
  const u = getUser(id);
  const lang = u.lang || 'uz';
  const L = LANG[lang];
  const text = ctx.message.text;
  const step = u.step;

  // --- MAXSUS TORT QADAMLARI ---
  if (step === 'custom_biskivit') {
    u.customTort.biskivit = text;
    u.step = 'custom_meva';
    const opts = CUSTOM_OPTIONS.meva[lang];
    return ctx.reply(L.customSteps.meva,
      Markup.keyboard(chunkArray(opts, 2).concat([[L.back]])).resize()
    );
  }

  if (step === 'custom_meva') {
    u.customTort.meva = text;
    u.step = 'custom_ust';
    const opts = CUSTOM_OPTIONS.ust[lang];
    return ctx.reply(L.customSteps.ust,
      Markup.keyboard(chunkArray(opts, 2).concat([[L.back]])).resize()
    );
  }

  if (step === 'custom_ust') {
    u.customTort.ust = text;
    u.step = 'custom_bezak';
    const opts = CUSTOM_OPTIONS.bezak[lang];
    return ctx.reply(L.customSteps.bezak,
      Markup.keyboard(chunkArray(opts, 2).concat([[L.back]])).resize()
    );
  }

  if (step === 'custom_bezak') {
    u.customTort.bezak = text;
    u.step = 'box';
    return ctx.reply(L.box, Markup.keyboard([
      [L.boxYes, L.boxNo]
    ]).resize());
  }

  // --- KOROBKA ---
  if (step === 'box') {
    u.order.box = (text === L.boxYes);
    u.step = 'ask_name';
    return ctx.reply(L.askName, Markup.removeKeyboard());
  }

  // --- ISIM ---
  if (step === 'ask_name') {
    u.order.name = text;
    u.step = 'ask_phone';
    return ctx.reply(L.askPhone);
  }

  // --- TELEFON ---
  if (step === 'ask_phone') {
    u.order.phone = text;
    u.step = 'ask_location';
    return ctx.reply(
      `${L.askLocation}\n\n${L.or}`,
      Markup.keyboard([[Markup.button.locationRequest(L.sendLocation)]]).resize()
    );
  }

  // --- MANZIL MATN ---
  if (step === 'ask_location') {
    u.order.location = text;
    u.step = 'ask_payment';
    return ctx.reply(L.askPayment, Markup.keyboard([
      [L.payNaqd],
      [L.payClick, L.payPayme]
    ]).resize());
  }

  // --- TO'LOV ---
  if (step === 'ask_payment') {
    u.order.payment = text;
    return finishOrder(ctx, id);
  }
});

// Lokatsiya yuborsa
bot.on('location', (ctx) => {
  const id = ctx.from.id;
  const u = getUser(id);
  const lang = u.lang || 'uz';
  const L = LANG[lang];
  if (u.step === 'ask_location') {
    const loc = ctx.message.location;
    u.order.location = `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
    u.step = 'ask_payment';
    ctx.reply(L.askPayment, Markup.keyboard([
      [L.payNaqd],
      [L.payClick, L.payPayme]
    ]).resize());
  }
});

// =====================
// BUYURTMANI YAKUNLASH
// =====================
function finishOrder(ctx, id) {
  const u = getUser(id);
  const lang = u.lang || 'uz';
  const L = LANG[lang];
  const o = u.order;
  const c = u.customTort;

  let orderText = '';

  if (o.type === 'custom') {
    orderText = `
🎨 MAXSUS TORT ZAKAZ
━━━━━━━━━━━━━━━━
🍞 Biskivit: ${c.biskivit}
🍓 Ichidagi: ${c.meva}
🍫 Ustki qatlam: ${c.ust}
🎀 Bezak: ${c.bezak}
📦 Korobka: ${o.box ? '✅ Ha' : '❌ Yo\'q'}
━━━━━━━━━━━━━━━━`;
  } else {
    orderText = `
🛒 BUYURTMA
━━━━━━━━━━━━━━━━
🍰 Mahsulot: ${o.itemName}
💰 Narx: ${o.price?.toLocaleString()} so'm
📦 Korobka: ${o.box ? '✅ Ha' : '❌ Yo\'q'}
━━━━━━━━━━━━━━━━`;
  }

  const fullText = `${orderText}
👤 Ism: ${o.name}
📞 Tel: ${o.phone}
📍 Manzil: ${o.location}
💳 To'lov: ${o.payment}
🌐 Til: ${lang.toUpperCase()}
👤 Telegram: @${ctx.from.username || 'yo\'q'} (ID: ${id})
`;

  // Adminga yuborish
  bot.telegram.sendMessage(ADMIN_ID, `📬 YANGI BUYURTMA!\n${fullText}`);

  // Click / Payme bo'lsa link yuborish
  if (o.payment?.includes('Click')) {
    ctx.reply('💳 Click orqali to\'lash:\nhttps://my.click.uz/services/YOUR_SERVICE_ID');
  } else if (o.payment?.includes('Payme')) {
    ctx.reply('💳 Payme orqali to\'lash:\nhttps://payme.uz/YOUR_MERCHANT_ID');
  }

  ctx.reply(L.orderSent);
  users[id] = { lang, step: null, order: {}, customTort: {} };
  setTimeout(() => mainMenu(ctx), 1500);
}

// =====================
// HELPER
// =====================
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

bot.launch();
console.log('✅ Bot ishga tushdi!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));