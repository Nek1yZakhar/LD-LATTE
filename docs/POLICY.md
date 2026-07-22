# 🛡️ LD LATTE Pipeline Policy: Strict Data Integrity & No-Mock Enforcement

## 1. Zero-Mock Policy (Строгий запрет на фейковые данные)
- **Запрет синтетических данных**: В боевом пайплайне (`enrich.py`, `discover.py`, `embed.py`, `score.py`, `rerank.py`, `vlm_sanity.py`) категорически запрещено использовать автоматическую генерацию фейковых полей, заглушек или синтетических ER/био при скрапинге.
- **Обработка невалидных аккаунтов**: Если аккаунт удален, переименован или недоступен в Instagram (`HTTP 404 / 400`), он **пропускается и фиксируется в логах**, но НЕ заполняется выдуманными значениями.

## 2. Источник данных и Аудит (Блогеры - Лист1.csv)
- **Единственный авторитетный исходник**: [`Блогеры - Лист1.csv`](file:///c:/Users/Admin/Desktop/LD%20LATTE/%D0%91%D0%BB%D0%BE%D0%B3%D0%B5%D1%80%D1%8B%20-%20%D0%9B%D0%B8%D1%81%D1%821.csv).
- **Результаты выгрузки 100% реального Instagram**:
  - **19 Активных профилей** (успешно спарсены real bio, followers count, post count):
    1. `krrazalia` (7,184)
    2. `shalafaeva.al` (3,737)
    3. `kristi_naxodka` (147,196)
    4. `daria_grogulenko` (5,364)
    5. `llaurraiiam` (11,461)
    6. `mishandkatya` (69,723)
    7. `v.m.Beauty_blog` (205,906)
    8. `juliar_r` (256,897)
    9. `_kate_bruni` (319,546)
    10. `jd_cosm` (138,331)
    11. `dddinaaaaaa` (7,995)
    12. `janestetsiura` (29,778)
    13. `armlilitka` (87,777)
    14. `aida.mixx` (44,259)
    15. `bazhenova_alenaa` (17,736)
    16. `anetboss_` (148,643)
    17. `19.voron`
    18. `kotova.live` (48,630)
    19. `zari.ishikhovaa` (20,571)

  - **15 Недоступных профилей** (возвращают HTTP 404/400 на серверах Instagram):
    - ID 1: `merklary_l`
    - ID 2: `curly.bloger`
    - ID 4: `nev_pollyy`
    - ID 5: `_crazy__unicorn__`
    - ID 6: `demoiselle._.rie`
    - ID 10: `yunglolaa`
    - ID 11: `sha_obzor.wb`
    - ID 14: `lv_yana_lv`
    - ID 17: `miysta_fatt_`
    - ID 21: `habakher`
    - ID 24: `ri_vls`
    - ID 25: `__aparina`
    - ID 28: `rtini.a13`
    - ID 35: `ninooochka2.0`
    - ID 36: `irinatitovaaa_`
