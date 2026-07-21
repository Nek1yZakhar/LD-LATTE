# -*- coding: utf-8 -*-
import os
import shutil
import csv
import json
import re

def clean_profile(raw_input: str):
    """
    Очистка и нормализация имени пользователя и URL Instagram.
    Возвращает кортеж: (username, normalized_url, status, notes)
    """
    raw_input = raw_input.strip()
    if not raw_input:
        return "", "", "invalid", "empty_value"
        
    # 1. Кейс: текстовые метаданные, например, "МИША И КЕЙТ (@mishandkatya) • Instagram photos and videos"
    if "@" in raw_input and "instagram.com" not in raw_input:
        match = re.search(r"@([a-zA-Z0-9._]{1,30})", raw_input)
        if match:
            username = match.group(1)
            if username.endswith('.'):
                return username, f"https://www.instagram.com/{username}/", "invalid", "username_ends_with_dot"
            return username, f"https://www.instagram.com/{username}/", "manual_review", "username_extracted_from_text_metadata"

    # 2. Кейс: форматы URL с instagram.com
    if "instagram.com" in raw_input:
        # Приведение к нижнему регистру для поиска разделителя
        parts = raw_input.split("instagram.com/", 1)
        path_query = parts[1]
        
        # Отсекаем query-параметры (?igsh=..., ?igshid=...)
        path_only = path_query.split("?", 1)[0]
        
        # Разбиваем путь на сегменты
        segments = [s for s in path_only.split("/") if s]
        
        if segments:
            username = segments[0]
            # Проверяем валидность имени
            if username.endswith('.'):
                return username, f"https://www.instagram.com/{username}/", "invalid", "username_ends_with_dot"
            if not re.match(r"^[a-zA-Z0-9._]{1,30}$", username):
                return username, "", "invalid", "invalid_username_characters"
                
            notes = []
            if "profilecard" in segments:
                notes.append("removed_profilecard_subpath")
                
            notes_str = "; ".join(notes) if notes else ""
            return username, f"https://www.instagram.com/{username}/", "valid", notes_str

    # 3. Кейс: просто юзернейм (например, "armlilitka" или "@armlilitka")
    clean_val = raw_input.lstrip("@")
    if re.match(r"^[a-zA-Z0-9._]{1,30}$", clean_val) and not clean_val.endswith('.'):
        return clean_val, f"https://www.instagram.com/{clean_val}/", "valid", "extracted_from_raw_username"
        
    return "", "", "invalid", "unsupported_format"

def write_report(report_path, total_rows, empty_rows, valid_cnt, invalid_cnt, review_cnt, dup_cnt, processed):
    """
    Генерирует Markdown-отчет с подробной статистикой и описанием проблем.
    """
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# Отчет об очистке и нормализации seed-данных (Seed Data Cleanup Report)\n\n")
        
        f.write("## 1. Сводная статистика\n\n")
        f.write(f"- **Всего строк в исходном файле:** {total_rows}\n")
        f.write(f"- **Фильтровано пустых строк (empty rows filtered):** {empty_rows}\n")
        f.write(f"- **Валидных записей (valid profiles):** {valid_cnt}\n")
        f.write(f"- **Невалидных записей (invalid rows):** {invalid_cnt}\n")
        f.write(f"- **Записей для ручного анализа (manual review rows):** {review_cnt}\n")
        f.write(f"- **Удалено дубликатов (duplicates removed):** {dup_cnt}\n\n")
        
        f.write("## 2. Обнаруженные проблемы и правила нормализации\n\n")
        f.write("В ходе диагностического анализа исходного файла были выявлены и устранены следующие проблемы:\n")
        f.write("1. **Пустые строки:** Строки без полезной нагрузки или содержащие только разделители (запятые) были полностью отфильтрованы.\n")
        f.write("2. **Параметры отслеживания (Tracking params):** Query-параметры (например, `?igsh=...`, `?igshid=...`) были удалены из всех URL.\n")
        f.write("3. **Вспомогательные подпути:** Вырезаны технические подпути (такие как `/profilecard/`).\n")
        f.write("4. **Текстовые метаданные:** Для профилей, записанных в виде текста со скобками (например, `МИША И КЕЙТ (@mishandkatya)`), успешно извлечены юзернеймы.\n")
        f.write("5. **Дубликаты:** Исключены повторные вхождения блогеров на основе регистронезависимого сравнения юзернеймов.\n\n")
        
        f.write("## 3. Записи, требующие ручной проверки (Manual Review)\n\n")
        review_rows = [r for r in processed if r["status"] == "manual_review"]
        if review_rows:
            f.write("| Строка | Raw ID | Raw Input | Извлеченный Username | Статус | Примечание |\n")
            f.write("|---|---|---|---|---|---|\n")
            for r in review_rows:
                f.write(f"| {r['source_row']} | {r['raw_id']} | `{r['raw_input']}` | {r['username']} | {r['status']} | {r['notes']} |\n")
        else:
            f.write("Записей для ручной проверки не обнаружено.\n")
        f.write("\n")
            
        f.write("## 4. Невалидные записи (Invalid Rows)\n\n")
        invalid_rows = [r for r in processed if r["status"] == "invalid"]
        if invalid_rows:
            f.write("| Строка | Raw ID | Raw Input | Извлеченный Username | Статус | Примечание |\n")
            f.write("|---|---|---|---|---|---|\n")
            for r in invalid_rows:
                f.write(f"| {r['source_row']} | {r['raw_id']} | `{r['raw_input']}` | {r['username']} | {r['status']} | {r['notes']} |\n")
        else:
            f.write("Невалидных записей не обнаружено.\n")
        f.write("\n")

        f.write("## 5. Обнаруженные дубликаты (Duplicates)\n\n")
        dup_rows = [r for r in processed if r["status"] == "duplicate"]
        if dup_rows:
            f.write("| Строка | Raw ID | Raw Input | Извлеченный Username | Статус | Примечание |\n")
            f.write("|---|---|---|---|---|---|\n")
            for r in dup_rows:
                f.write(f"| {r['source_row']} | {r['raw_id']} | `{r['raw_input']}` | {r['username']} | {r['status']} | {r['notes']} |\n")
        else:
            f.write("Дубликатов не обнаружено.\n")

def main():
    source_path = "Блогеры - Лист1.csv"
    raw_dir = os.path.join("data", "raw")
    dest_path = os.path.join(raw_dir, "Блогеры - Лист1.csv")
    
    # Копируем файл в data/raw, если он существует в корне
    if os.path.exists(source_path) and not os.path.exists(dest_path):
        os.makedirs(raw_dir, exist_ok=True)
        shutil.copy(source_path, dest_path)
        print(f"Скопирован {source_path} в {dest_path}")
        
    if not os.path.exists(dest_path):
        print(f"Ошибка: Исходный файл не найден по пути {dest_path}")
        return

    processed_rows = []
    seen_usernames = {} # username_lower -> source_row
    
    total_raw_rows = 0
    empty_rows_count = 0
    valid_count = 0
    invalid_count = 0
    manual_review_count = 0
    duplicate_count = 0
    
    # Чтение строк файла
    with open(dest_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines, 1):
        total_raw_rows += 1
        line_str = line.strip()
        
        # Фильтрация пустых строк
        if not line_str or re.match(r"^,+$", line_str):
            empty_rows_count += 1
            continue
            
        # Разбор CSV строки с помощью модуля csv
        reader = csv.reader([line_str])
        try:
            row = next(reader)
        except Exception:
            row = line_str.split(",", 1)
            
        raw_id = ""
        raw_input = ""
        
        if len(row) > 0:
            raw_id = row[0].strip()
        if len(row) > 1:
            raw_input = row[1].strip()
        else:
            # Если колонка одна и похожа на ссылку/юзернейм
            if "instagram" in raw_id or "@" in raw_id:
                raw_input = raw_id
                raw_id = ""
                
        # Нормализация
        username, normalized_url, status, notes = clean_profile(raw_input)
        
        # Дедупликация и обновление статусов
        if status in ("valid", "manual_review") and username:
            username_lower = username.lower()
            if username_lower in seen_usernames:
                duplicate_count += 1
                first_row = seen_usernames[username_lower]
                status = "duplicate"
                notes = f"duplicate_of_row_{first_row}"
            else:
                seen_usernames[username_lower] = i
                if status == "valid":
                    valid_count += 1
                else:
                    manual_review_count += 1
        else:
            if status == "invalid":
                invalid_count += 1
                
        processed_rows.append({
            "source_row": i,
            "raw_id": raw_id,
            "raw_input": raw_input,
            "normalized_url": normalized_url,
            "username": username,
            "platform": "instagram",
            "status": status,
            "notes": notes
        })

    # Сохранение CSV-файлов
    processed_dir = os.path.join("data", "processed")
    os.makedirs(processed_dir, exist_ok=True)
    
    # 1. normalized_seed_profiles.csv (все непустые строки)
    all_csv_path = os.path.join(processed_dir, "normalized_seed_profiles.csv")
    fields = ["source_row", "raw_id", "raw_input", "normalized_url", "username", "platform", "status", "notes"]
    with open(all_csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in processed_rows:
            writer.writerow(r)
            
    # 2. normalized_seed_profiles_valid.csv (только valid записи)
    valid_csv_path = os.path.join(processed_dir, "normalized_seed_profiles_valid.csv")
    with open(valid_csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for r in processed_rows:
            if r["status"] == "valid":
                writer.writerow(r)
                
    # 3. seed_normalized.json (список SeedProfile для валидных и manual_review)
    json_profiles = []
    for r in processed_rows:
        is_valid_bool = r["status"] in ("valid", "manual_review")
        error_msg = r["notes"] if not is_valid_bool else None
        
        try:
            profile_id = int(r["raw_id"]) if r["raw_id"] else r["source_row"]
        except ValueError:
            profile_id = r["source_row"]
            
        json_profiles.append({
            "id": profile_id,
            "raw_url": r["raw_input"],
            "username": r["username"],
            "is_valid": is_valid_bool,
            "error_message": error_msg
        })
        
    json_path = os.path.join(processed_dir, "seed_normalized.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_profiles, f, ensure_ascii=False, indent=2)
        
    # Генерация отчета
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    report_path = os.path.join(output_dir, "seed_cleanup_report.md")
    
    write_report(
        report_path,
        total_raw_rows,
        empty_rows_count,
        valid_count,
        invalid_count,
        manual_review_count,
        duplicate_count,
        processed_rows
    )
    
    print("Очистка успешно завершена.")
    print(f"Всего строк в исходном файле: {total_raw_rows}")
    print(f"Пустых строк отфильтровано: {empty_rows_count}")
    print(f"Валидных профилей: {valid_count}")
    print(f"Невалидных строк: {invalid_count}")
    print(f"Строк для ручной проверки: {manual_review_count}")
    print(f"Дубликатов удалено: {duplicate_count}")

if __name__ == "__main__":
    main()
