# -*- coding: utf-8 -*-
import json
import re

with open("scratch/scraped_headers_all.json", "r", encoding="utf-8") as f:
    headers_data = json.load(f)

# Parse exact bio text for each candidate
parsed_bios = {
    'jd_cosm': '✨ОБЗОРЫ✨ ДОМ✨ САД✨\n🌿Комнатные растения 🌿\nWELCOME в ремонт😂😘\nСвязь директ',
    'dddinaaaaaa': 'Personal blog\nlife & style & beauty & fashion\n23 y.o, married, young mommy\ncooperation: 📩\n📍Moscow / Dushanbe',
    'llaurraiiam': 'Fashion Model\nLifestyle 🖇️👼\nMake up / dm 📩\nUGC для брендов.\nСанкт-Петербург',
    'bazhenova_alenaa': 'Personal blog\nВологда/ Москва ОБУЧАЮ МАКИЯЖУ 👇🏼\n@bazhenova.studio\nВ моих комментариях самые 🚩 мужики\nДвигаюсь за счет внешности, могу...',
    'mishandkatya': 'Blogger\nСамая непредсказуемая парочка! ❤️\nВК: Миша и Кейт. Люблю @ekaterina_vanlife',
    'v.m.beauty_blog': 'Blogger\n🛍️ знаю где и как купить выгодно\n🐾 хозяйка 14 спасенышей 🐶🐱\n🌎🏡 с любовью к путешествиям и загородной жизни',
    'kristi_naxodka': 'Personal blog\nАвтор самых стильных подборок 🫶🏻\nBeauty подборки\nНахожу стильное на WB и не только …\nСотрудничество @pr_kristi_naxodka',
    'daria_grogulenko': 'Стильные образы в REELS\nБольше находок в моем телеграмме👇🏼\n📍Moscow | Московский',
    'krrazalia': '• учу создавать контент и сотрудничать с брендами\n• ОСТОРОЖНО, мой блог может вызвать черную дыру в твоем кошельке',
    'janestetsiura': 'Blogger\nwoman 💋\n@jno_brand',
    'armlilitka': 'Здесь вкусно и уютно 🤎\nМоя большая семья, рецепты и кудряшки✨\nСотрудничество @armlilitka_pr 💌',
    'aida.mixx': 'Blogger\n◾️жуткий шопоголик\n◾️мать в квадрате\n◾️Сотруд-во в direct\nSAMARA/MOSCOW',
    'kotova.live': 'Blogger\nUGC Creator 🤍 Минимализм в реальной жизни\n🪴 дети, дом, обзоры, честный быт\n🧘‍♀️ всё по плану, но по-настоящему',
    'anetboss_': 'Blogger\n🪴Загородная жизнь без выгорания\n🏠Стройка/Дети/Огород/Дом\n🤑Бюджетный уют и находки',
    '_kate_bruni': 'Blogger\nГивы в блок!\nРезидент ЦНМ\nСотрудничество @pr_kate_bruni\nТНТ, Ю, Суббота, Пятница',
    'juliar_r': 'Blogger\nTᴏᴘ ʟɪFᴇSᴛʏʟᴇ Bʟᴏɢɢᴇʀ\nᴅɪʀᴇᴄᴛ 📩',
    'zari.ishikhovaa': 'Blogger\n• Делюсь стильными находками в reels 🏹\n• Мои обзоры = женственность,вдохновение\nСотрудничество: @pr.zariii'
}

# Update data/processed/seed_enriched.json
with open("data/processed/seed_enriched.json", "r", encoding="utf-8") as f:
    seed_enriched = json.load(f)

for item in seed_enriched:
    uname = item.get("username", "").lower()
    if uname in parsed_bios:
        item["biography"] = parsed_bios[uname]

with open("data/processed/seed_enriched.json", "w", encoding="utf-8") as f:
    json.dump(seed_enriched, f, ensure_ascii=False, indent=2)

print("Updated data/processed/seed_enriched.json with live bios!")
