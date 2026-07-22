# -*- coding: utf-8 -*-
import os
import shutil
import csv
import json
import re
import logging
from playwright.sync_api import sync_playwright

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def clean_profile(raw_input: str):
    """
    Очистка и нормализация имени пользователя и URL Instagram.
    Возвращает кортеж: (username, normalized_url, is_valid_syntax, notes)
    """
    raw_input = raw_input.strip()
    if not raw_input:
        return "", "", False, "empty_value"
        
    # 1. Текстовые метаданные со скобками, например: "МИША И КЕЙТ (@mishandkatya) • Instagram photos and videos"
    if "@" in raw_input and "instagram.com" not in raw_input:
        match = re.search(r"@([a-zA-Z0-9._]{1,30})", raw_input)
        if match:
            username = match.group(1).rstrip('.')
            return username, f"https://www.instagram.com/{username}/", True, "extracted_from_text_metadata"

    # 2. Форматы URL с instagram.com
    if "instagram.com" in raw_input:
        parts = raw_input.split("instagram.com/", 1)
        path_query = parts[1]
        path_only = path_query.split("?", 1)[0]
        segments = [s for s in path_only.split("/") if s]
        
        if segments:
            username = segments[0].rstrip('.')
            if not re.match(r"^[a-zA-Z0-9._]{1,30}$", username):
                return username, "", False, "invalid_username_characters"
            return username, f"https://www.instagram.com/{username}/", True, "valid_url_structure"

    # 3. Прямой юзернейм
    clean_val = raw_input.lstrip("@").rstrip('.')
    if re.match(r"^[a-zA-Z0-9._]{1,30}$", clean_val):
        return clean_val, f"https://www.instagram.com/{clean_val}/", True, "raw_username"
        
    return "", "", False, "unsupported_format"


def main():
    source_path = "Блогеры - Лист1.csv"
    raw_dir = os.path.join("data", "raw")
    dest_path = os.path.join(raw_dir, "Блогеры - Лист1.csv")
    
    if os.path.exists(source_path) and not os.path.exists(dest_path):
        os.makedirs(raw_dir, exist_ok=True)
        shutil.copy(source_path, dest_path)
        
    if not os.path.exists(dest_path):
        logging.error(f"Исходный файл не найден по пути {dest_path}")
        return

    # Загружаем session cookies при наличии
    cookies = []
    if os.path.exists("data/instagram_session.json"):
        try:
            with open("data/instagram_session.json", "r", encoding="utf-8") as f:
                cookies = json.load(f)
        except Exception:
            pass

    processed_rows = []
    seen_usernames = set()
    
    with open(dest_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

    # Извлекаем все профили
    candidate_list = []
    for i, line in enumerate(lines, 1):
        line_str = line.strip()
        if not line_str or re.match(r"^,+$", line_str):
            continue
            
        reader = csv.reader([line_str])
        try:
            row = next(reader)
        except Exception:
            row = line_str.split(",", 1)
            
        raw_id = row[0].strip() if len(row) > 0 else ""
        raw_input = row[1].strip() if len(row) > 1 else raw_id
        
        username, normalized_url, syntax_valid, notes = clean_profile(raw_input)
        if username:
            candidate_list.append((i, raw_id, raw_input, username, normalized_url, syntax_valid, notes))

    logging.info(f"Пропаршено {len(candidate_list)} профилей из таблицы {dest_path}. Выполняем проверку доступности без фейков...")

    # Проверка живой доступности в Instagram
    availability_results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            proxy={"server": "socks5://127.0.0.1:2080"},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        if cookies:
            context.add_cookies(cookies)
        page = context.new_page()

        for item in candidate_list:
            _, _, _, uname, _, syntax_valid, _ = item
            if not syntax_valid or not uname:
                availability_results[uname] = (False, 400, "invalid_syntax")
                continue

            api_url = f"https://www.instagram.com/api/v1/users/web_profile_info/?username={uname}"
            page.set_extra_http_headers({"x-ig-app-id": "936619743392459"})
            res = page.goto(api_url, timeout=12000)
            
            if res and res.status == 200:
                try:
                    data = res.json()
                    user = data.get("data", {}).get("user", {})
                    if user and user.get("username"):
                        availability_results[uname] = (True, 200, None)
                    else:
                        availability_results[uname] = (False, 404, "empty_user_payload")
                except Exception:
                    availability_results[uname] = (False, 404, "json_parse_error")
            else:
                status_code = res.status if res else 404
                availability_results[uname] = (False, status_code, f"HTTP {status_code} - profile deleted/renamed/private")

        browser.close()

    # Сборка финального реестра
    valid_count = 0
    invalid_count = 0
    dup_count = 0

    json_profiles = []

    for item in candidate_list:
        source_row, raw_id, raw_input, username, normalized_url, syntax_valid, notes = item
        uname_lower = username.lower()
        
        if uname_lower in seen_usernames:
            dup_count += 1
            status = "duplicate"
            is_valid = False
            error_msg = f"duplicate_of_another_row"
        else:
            seen_usernames.add(uname_lower)
            is_avail, http_code, err_desc = availability_results.get(username, (False, 404, "not_tested"))
            
            if is_avail:
                valid_count += 1
                status = "valid"
                is_valid = True
                error_msg = None
            else:
                invalid_count += 1
                status = "unavailable"
                is_valid = False
                error_msg = f"HTTP {http_code} ({err_desc})"

        record = {
            "source_row": source_row,
            "raw_id": raw_id,
            "raw_input": raw_input,
            "normalized_url": normalized_url,
            "username": username,
            "platform": "instagram",
            "status": status,
            "is_valid": is_valid,
            "error_message": error_msg,
            "notes": notes
        }
        processed_rows.append(record)

        try:
            profile_id = int(raw_id) if raw_id else source_row
        except ValueError:
            profile_id = source_row

        json_profiles.append({
            "id": profile_id,
            "raw_url": raw_input,
            "username": username,
            "is_valid": is_valid,
            "error_message": error_msg
        })

    # Сохранение файлов
    processed_dir = os.path.join("data", "processed")
    os.makedirs(processed_dir, exist_ok=True)
    
    # 1. normalized_seed_profiles.csv (полный список)
    fields = ["source_row", "raw_id", "raw_input", "normalized_url", "username", "platform", "status", "is_valid", "error_message", "notes"]
    with open(os.path.join(processed_dir, "normalized_seed_profiles.csv"), "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in processed_rows:
            writer.writerow(r)

    # 2. normalized_seed_profiles_valid.csv (только 100% живые валидные профили)
    with open(os.path.join(processed_dir, "normalized_seed_profiles_valid.csv"), "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in processed_rows:
            if r["is_valid"]:
                writer.writerow(r)

    # 3. seed_normalized.json
    with open(os.path.join(processed_dir, "seed_normalized.json"), "w", encoding="utf-8") as f:
        json.dump(json_profiles, f, ensure_ascii=False, indent=2)

    # 4. output/seed_cleanup_report.md
    report_md = f"""# 📋 Отчет об очистке и нормализации seed-данных (TICKET-01 Seed Data Cleanup)

**Единственный авторитетный источник**: `Блогеры - Лист1.csv`
**Политика фейковых данных**: Strict Zero-Mock Policy (никаких заглушек и выдуманных полей, доступность проверена в живой сети Instagram).

## 1. Сводная статистика
- **Всего обработано профилей из таблицы:** {len(candidate_list)}
- **Валидных и доступных в Instagram (is_valid=True):** {valid_count}
- **Недоступных / Удаленных в Instagram (is_valid=False):** {invalid_count}
- **Удалено дубликатов:** {dup_count}

## 2. Полный реестр профилей

| ID | Username | Ссылка | Доступность в Instagram | Статус | Сообщение об ошибке |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""
    for r in processed_rows:
        avail_str = "✅ Доступен (HTTP 200)" if r["is_valid"] else f"❌ Недоступен ({r['error_message']})"
        report_md += f"| {r['raw_id']} | `{r['username']}` | `{r['normalized_url']}` | {avail_str} | `{r['status']}` | {r['error_message'] or '-'} |\n"

    with open("output/seed_cleanup_report.md", "w", encoding="utf-8") as f:
        f.write(report_md)

    logging.info(f"TICKET-01 успешно выполнен! Валидных профилей: {valid_count}, недоступных (помечены с ошибкой): {invalid_count}.")

if __name__ == "__main__":
    main()
