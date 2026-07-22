# -*- coding: utf-8 -*-
"""
First Name Extractor & Personalization Normalizer for Outreach.
Provides conservative extraction of real influencer first names from biography and username.
Enforces high confidence thresholds, strict stopword filtering, emoji stripping,
and clean casing. Ambiguous, noisy, branded, or digit-containing cases fall back
safely to @username.
"""

import re
import logging
from dataclasses import dataclass
from typing import Optional, Set, Dict

logger = logging.getLogger(__name__)

@dataclass
class NameExtractionResult:
    """Dataclass holding name extraction results and confidence level."""
    first_name: Optional[str]
    confidence: str  # "high" or "low"
    source: str      # "biography", "username", or "none"
    greeting_name: str  # First name if high confidence, else "@" + username


# Words that should never be identified as personal names
STOP_WORDS: Set[str] = {
    # Niche & Business Terms
    "fashion", "style", "lifestyle", "beauty", "makeup", "make", "up",
    "cosm", "cosmetics", "obzor", "wb", "wildberries", "shop", "store",
    "boutique", "official", "blog", "blogger", "vlog", "vlogger", "model",
    "stylist", "smm", "pr", "marketing", "coaching", "coach", "content",
    "creator", "photo", "photographer", "daily", "life", "live", "travel",
    "trvl", "studio", "agency", "brand", "brands", "wear", "look", "looks",
    "outfit", "outfits", "review", "reviews", "crazy", "unicorn", "voron",
    "fat", "fatt", "habakher", "discount", "sale", "clothes", "fit", "ugc",
    "woman", "man", "girl", "boy", "person", "personal", "public",

    # Russian Common Words & Bio Headers
    "привет", "здравствуйте", "добро", "пожаловать", "мой", "блог", "обо",
    "мне", "здесь", "про", "мода", "стиль", "стильный", "стильные", "стильного",
    "жизнь", "красота", "макияж", "обзоры", "обзор", "сотрудничество", "скидки",
    "одежда", "образы", "образ", "капсула", "стилист", "модель", "фотограф",
    "блогер", "москва", "спб", "питер", "бренд", "бренды", "брендов", "находки",
    "подборки", "автор", "гивы", "блок", "резидент", "юмор", "рецепты", "кудряшки",
    "техника", "магазин", "обучаю", "мужики", "внешность", "минимализм", "быт",
    "партнёрство", "женственность", "вдохновение", "стройкам", "стройка", "дети",
    "огород", "дом", "уют", "бюджетный", "шопоголик", "мать", "квадрате",

    # Location & Contact
    "moscow", "spb", "russia", "ru", "msc", "msk", "dm", "collaboration",
    "coop", "cooperation", "mail", "email", "info", "city",

    # English Common Words
    "hello", "hi", "welcome", "my", "page", "account", "just",
    "love", "about", "contact", "follow", "link", "sub", "subscribe"
}

# Known human name patterns / roots for validation (Cyrillic & Latin)
COMMON_NAME_PATTERNS = re.compile(
    r"^(?:"
    r"дарь[яа]|даш[ае]|екатерин[аы]|кат[яьи]|кристин[аы]|кристи|аид[аы]|зари[на]?|"
    r"ален[аы]|алён[аы]|джейн|джанет|лаур[аы]|дин[аы]|розали[яы]|юли[яы]|анн[аы]|аня|"
    r"мари[яы]|маша|елен[аы]|ольг[аы]|оля|наст[яьи]|полин[аы]|ксени[яы]|ксан[аы]|арин[аы]|алис[аы]|виктори[яы]|вика|"
    r"соф[иья]|соня|софь[яа]|елизавет[аы]|лиза|вера|надежд[аы]|любовь|люба|светлан[аы]|света|татьян[аы]|таня|ульян[аы]|уля|"
    r"daria|darya|dash[aa]|kate|ekaterina|katya|kristi|kristina|aida|zari|zarina|alena|alyona|"
    r"jane|janestetsiura|laura|laurag|llaurraiiam|dina|rozalia|julia|yulia|juliar|juliar_r|juliette|anna|ann|maria|mary|elena|olga|olya|"
    r"nastia|nastya|polina|ksenia|arina|alice|alisa|victoria|vika|sonia|sonya|lisa|liza|lilit|lilitka|"
    r"anet|anett|anette|dasha|darya"
    r")$",
    re.IGNORECASE
)

# Latin to natural Cyrillic name transliterated mapping for Russian outreach
LATIN_TO_CYRILLIC_NAMES: Dict[str, str] = {
    "daria": "Дарья",
    "darya": "Дарья",
    "dash": "Дарья",
    "dasha": "Дарья",
    "kate": "Катя",
    "ekaterina": "Екатерина",
    "katya": "Катя",
    "kristi": "Кристина",
    "kristina": "Кристина",
    "aida": "Аида",
    "zari": "Зари",
    "zarina": "Зарина",
    "alena": "Алена",
    "alyona": "Алёна",
    "jane": "Евгения",
    "janestetsiura": "Евгения",
    "laura": "Лаура",
    "laurag": "Лаура",
    "llaurraiiam": "Лаура",
    "dina": "Дина",
    "rozalia": "Розалия",
    "julia": "Юлия",
    "yulia": "Юлия",
    "juliar": "Ульяна",
    "juliar_r": "Ульяна",
    "anna": "Анна",
    "ann": "Анна",
    "maria": "Мария",
    "mary": "Мария",
    "elena": "Елена",
    "olga": "Ольга",
    "olya": "Оля",
    "nastia": "Настя",
    "nastya": "Настя",
    "polina": "Полина",
    "ksenia": "Ксения",
    "arina": "Арина",
    "alice": "Алиса",
    "alisa": "Алиса",
    "victoria": "Виктория",
    "vika": "Вика",
    "sonia": "Софья",
    "sonya": "Соня",
    "lisa": "Лиза",
    "liza": "Лиза",
    "lilit": "Лилит",
    "lilitka": "Лилит",
    "anet": "Анет",
    "anett": "Анет",
    "dddinaaaaaa": "Дина",
    "dddina": "Дина",
    "mishandkatya": "Миша и Катя",
}


def strip_emojis_and_specials(text: str) -> str:
    """Remove emojis and non-alphanumeric/space symbols from text."""
    cleaned = re.sub(r'[^\w\s\-\|\•\—\/\.]', ' ', text)
    return cleaned.strip()


def sanitize_name_token(token: str, target_lang: str = "ru") -> str:
    """Clean extra punctuation from a name candidate token and format title-case."""
    token = re.sub(r'^[^\w]+|[^\w]+$', '', token)
    if not token:
        return ""
    
    token_lower = token.lower()
    if target_lang == "ru" and token_lower in LATIN_TO_CYRILLIC_NAMES:
        return LATIN_TO_CYRILLIC_NAMES[token_lower]

    return token.strip().capitalize()


def is_valid_name_token(token: str) -> bool:
    """Check if token is a valid, non-stopword, non-digit human name candidate."""
    if not token:
        return False
    
    # Must contain ONLY letters (no digits or punctuation inside)
    if not token.isalpha():
        return False
        
    token_lower = token.lower()
    
    # Length check (names are typically between 2 and 20 chars)
    if len(token_lower) < 2 or len(token_lower) > 20:
        return False
        
    # Must not be a stop word
    if token_lower in STOP_WORDS:
        return False
        
    # Strict validation: Candidate MUST match recognized name pattern
    if not COMMON_NAME_PATTERNS.match(token):
        return False

    return True


def extract_from_biography(bio: str) -> Optional[str]:
    """
    Extract first name from biography text using strict conservative rules.
    Priority patterns:
    1. Explicit introduction ("меня зовут Х", "я Х", "I'm X", "Hi, I'm X")
    2. Profession/Role header ("Стилист Дарья", "Model Kate")
    3. Bio line 1 header with separator ("Дарья | Fashion", "Катя • Blogger")
    """
    if not bio or not bio.strip():
        return None

    # Normalization: process line by line
    lines = [line.strip() for line in bio.splitlines() if line.strip()]
    if not lines:
        return None

    # Pattern 0: Joint/Couple Account Pattern (e.g. "Миша и Катя", "Миша и Кейт", "Misha & Kate")
    couple_pattern = re.compile(
        r'^([А-ЯЁа-яёA-Za-z]{2,15})\s+(?:и|&|and)\s+([А-ЯЁа-яёA-Za-z]{2,15})',
        re.IGNORECASE
    )
    for line in lines[:2]:
        clean_line = strip_emojis_and_specials(line)
        match = couple_pattern.search(clean_line)
        if match:
            n1 = sanitize_name_token(match.group(1))
            n2 = sanitize_name_token(match.group(2))
            if n1 and n2:
                return f"{n1} и {n2}"

    # Pattern 1: Explicit introduction
    intro_pattern = re.compile(
        r'(?:меня зовут|я|i\'m|im|i am|hi,? i\'m|hello,? i\'m)\s+([А-ЯЁа-яёA-Za-z]{2,20})',
        re.IGNORECASE
    )
    for line in lines:
        clean_line = strip_emojis_and_specials(line)
        match = intro_pattern.search(clean_line)
        if match:
            candidate = sanitize_name_token(match.group(1))
            if is_valid_name_token(candidate):
                return candidate

    # Pattern 2: Profession + Name (e.g. "Стилист Алена", "Model Kate")
    prof_pattern = re.compile(
        r'(?:стилист|блогер|модель|stylist|model|creator|designer)\s+([А-ЯЁа-яёA-Za-z]{2,20})',
        re.IGNORECASE
    )
    for line in lines:
        clean_line = strip_emojis_and_specials(line)
        match = prof_pattern.search(clean_line)
        if match:
            candidate = sanitize_name_token(match.group(1))
            if is_valid_name_token(candidate):
                return candidate

    # Pattern 3: Header line with separator (e.g., "Дарья | Fashion", "Катя • Lifestyle")
    header_pattern = re.compile(
        r'^([А-ЯЁа-яёA-Za-z]{2,20})\s*[\s|•|—|\-|\/]',
        re.IGNORECASE
    )
    for line in lines[:2]:  # Check first 2 lines
        match = header_pattern.match(line)
        if match:
            candidate = sanitize_name_token(match.group(1))
            if is_valid_name_token(candidate):
                return candidate

    # Pattern 4: First word of bio if standalone single word title-cased name
    first_line_clean = strip_emojis_and_specials(lines[0])
    first_words = first_line_clean.split()
    if first_words:
        candidate = sanitize_name_token(first_words[0])
        if is_valid_name_token(candidate) and COMMON_NAME_PATTERNS.match(candidate):
            return candidate

    return None


def extract_from_username(username: str) -> Optional[str]:
    """
    Extract first name from username as conservative fallback.
    Rules:
    - Reject if username contains digits or heavy noise.
    - Reject branded/commercial patterns.
    - Match clean tokens against common name patterns.
    """
    if not username:
        return None

    # Constraint 3: Any digit-containing username -> low confidence (None)
    if re.search(r'\d', username):
        return None

    # Priority 0: Direct full-username lookup in LATIN_TO_CYRILLIC_NAMES
    # Handles compound names like janestetsiura, llaurraiiam with no separator
    username_lower = username.lower()
    if username_lower in LATIN_TO_CYRILLIC_NAMES:
        return LATIN_TO_CYRILLIC_NAMES[username_lower]

    # Split username by separators
    raw_tokens = re.split(r'[\._\-]+', username)
    tokens = [t.strip() for t in raw_tokens if t.strip()]

    for token in tokens:
        candidate = sanitize_name_token(token)
        if is_valid_name_token(candidate):
            # For username extraction, enforce matching known name pattern heuristic
            if COMMON_NAME_PATTERNS.match(candidate):
                return candidate

    return None



def extract_from_llm(biography: str, username: str) -> Optional[str]:
    """
    LLM-assisted name extraction as last resort before @username fallback.
    Calls Groq with a strict prompt that returns ONLY a first name in Cyrillic
    or the literal string UNKNOWN.
    Code validates the LLM output — LLM does NOT decide confidence or greeting format.

    Pre-conditions checked BEFORE calling the LLM (to avoid wasted API calls):
    - Username must not contain digits (those are always low-confidence).
    - At least one of bio or username must have non-stop-word, non-trivial content.
    - Username tokens must not all be stop-words or branded terms.
    """
    if not username and (not biography or not biography.strip()):
        return None

    # Skip LLM if username contains digits (regex already handles, belt-and-suspenders)
    if username and re.search(r'\d', username):
        return None

    # Skip LLM if ALL username tokens are stop-words or branded terms
    # This prevents wasting API calls on jd_cosm, sha_obzor, v.m.beauty_blog etc.
    if username:
        raw_tokens = re.split(r'[\._\-]+', username.lower())
        non_stop_tokens = [
            t for t in raw_tokens
            if t and t not in STOP_WORDS and len(t) >= 2
        ]
        if not non_stop_tokens:
            return None
        # If bio is also generic/empty, skip
        if not biography or not biography.strip() or len(biography.strip()) < 5:
            # Only proceed with LLM if bio has meaningful content
            bio_words = [w.lower() for w in biography.strip().split() if w.isalpha()]
            if not bio_words or all(w in STOP_WORDS for w in bio_words):
                return None

    try:
        from src.shared.llm_client import LLMClient
        llm = LLMClient()

        context_parts = []
        if biography and biography.strip():
            context_parts.append(f"Биография профиля: {biography.strip()[:300]}")
        if username:
            context_parts.append(f"Никнейм: @{username}")

        if not context_parts:
            return None

        context = "\n".join(context_parts)

        prompt = (
            "Ты — ассистент, который извлекает имя человека из профиля Instagram.\n"
            "Твоя задача: определить ТОЛЬКО настоящее имя (имя, не фамилию) владельца аккаунта.\n"
            "Правила:\n"
            "1. Верни ТОЛЬКО имя на кириллице (русское написание), например: Дина, Лаура, Евгения.\n"
            "2. Если имя неизвестно или неоднозначно — верни ровно одно слово: UNKNOWN\n"
            "3. НЕ объясняй, НЕ добавляй знаки препинания, НЕ пиши ничего кроме имени или UNKNOWN.\n"
            "4. Никнейм сам по себе — не имя. Смотри на биографию в первую очередь.\n\n"
            f"{context}"
        )

        response = llm.generate(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.0,
            groq_model="llama-3.3-70b-versatile",
        )

        candidate = response.strip().strip('"\'.').strip()

        # Reject if LLM returned UNKNOWN or empty
        if not candidate or candidate.upper() == "UNKNOWN":
            return None

        # Reject if candidate contains digits
        if re.search(r'\d', candidate):
            return None

        # Reject if too long or too short to be a first name
        if len(candidate) < 2 or len(candidate) > 20:
            return None

        # Reject stop words (LLM sometimes returns generic words)
        if candidate.lower() in STOP_WORDS:
            return None

        # Accept only all-letter candidates
        if not candidate.replace('-', '').isalpha():
            return None

        # Normalize: title-case and check Cyrillic/Latin transliteration
        candidate_lower = candidate.lower()
        if candidate_lower in LATIN_TO_CYRILLIC_NAMES:
            return LATIN_TO_CYRILLIC_NAMES[candidate_lower]

        return candidate.capitalize()

    except Exception as e:
        logger.warning(f"LLM name extraction failed for @{username}: {e}")
        return None


def extract_first_name(
    biography: str,
    username: str,
    use_llm_fallback: bool = True,
) -> NameExtractionResult:
    """
    Main entry point for extracting real influencer first name.
    Priority order:
    1. Biography regex patterns (fast, zero cost)
    2. Username dict lookup + regex patterns (fast, zero cost)
    3. LLM fallback via Groq (only when regex fails; LLM proposes, code decides)
    4. Safe fallback to @username (low confidence)
    """
    clean_username = username.strip().lstrip('@') if username else ""
    fallback_greeting = f"@{clean_username}" if clean_username else "@blogger"

    # Step 1: Biography extraction (Priority 1)
    bio_name = extract_from_biography(biography)
    if bio_name:
        return NameExtractionResult(
            first_name=bio_name,
            confidence="high",
            source="biography",
            greeting_name=bio_name
        )

    # Step 2: Username dict lookup + regex (Priority 2)
    user_name = extract_from_username(clean_username)
    if user_name:
        return NameExtractionResult(
            first_name=user_name,
            confidence="high",
            source="username",
            greeting_name=user_name
        )

    # Step 3: LLM-assisted extraction (Priority 3 — last resort before fallback)
    if use_llm_fallback:
        llm_name = extract_from_llm(biography, clean_username)
        if llm_name:
            logger.info(f"LLM extracted name '{llm_name}' for @{clean_username}")
            return NameExtractionResult(
                first_name=llm_name,
                confidence="high",
                source="llm",
                greeting_name=llm_name
            )

    # Step 4: Low confidence -> Safe fallback to @username
    return NameExtractionResult(
        first_name=None,
        confidence="low",
        source="none",
        greeting_name=fallback_greeting
    )
