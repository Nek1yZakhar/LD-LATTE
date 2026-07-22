# -*- coding: utf-8 -*-
"""
Outreach Generator & QA Module for LD Latte.
Reads shortlist_final.json (and candidate profiles / ideal_portrait),
generates personalized barter outreach offers using DeepSeek-V4 via OpenRouter
(with fallback to Groq / OpenRouter models), enforces strict grounding and anti-robotic QA checks,
and writes output/barter_offers.json containing valid OutreachDraft records.
"""

import os
import json
import logging
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

from src.shared.models import (
    FinalShortlistEntry,
    CandidateProfile,
    IdealBloggerProfile,
    OutreachDraft
)
from src.shared.llm_client import LLMClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

PRIMARY_OPENROUTER_MODEL = "deepseek/deepseek-chat"
FALLBACK_GROQ_MODEL = "llama-3.3-70b-versatile"
PROMPT_TEMPLATE_PATH = "prompts/outreach_offer.md"
SHORTLIST_FINAL_PATH = "data/processed/shortlist_final.json"
CANDIDATES_DISCOVERED_PATH = "data/processed/candidates_discovered.json"
IDEAL_PORTRAIT_PATH = "data/processed/ideal_portrait.json"
OUTPUT_OFFERS_PATH = "output/barter_offers.json"

BANNED_ROBOTIC_PHRASES = [
    "дружелюбный и аутентичный тон",
    "лайфстайл ниша",
    "не соответствует нашим стандартам",
    "не соответствует стандартам",
    "vlm-анализ",
    "согласно статистике",
    "мы от бренда",
    "мы от ld latte"
]


def load_prompt_template(path: str = PROMPT_TEMPLATE_PATH) -> str:
    """Load system prompt template from file system."""
    p = Path(path)
    if not p.exists():
        logger.warning(f"Prompt template file not found at {path}. Using built-in default prompt.")
        return (
            "You are PR Manager for fashion brand LD Latte. Generate a respectful, personalized "
            "barter outreach offer for the given candidate strictly based on provided facts."
        )
    with open(p, "r", encoding="utf-8") as f:
        return f.read()


def load_candidate_lookup(candidates_path: str = CANDIDATES_DISCOVERED_PATH) -> Dict[str, Dict[str, Any]]:
    """Load candidate details indexed by username."""
    p = Path(candidates_path)
    if not p.exists():
        logger.warning(f"Candidates file not found at {candidates_path}.")
        return {}
    
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    lookup = {}
    for item in data:
        uname = item.get("username")
        if uname:
            lookup[uname] = item
    return lookup


def clean_json_response(raw_text: str) -> str:
    """Clean markdown backticks and whitespace from LLM JSON response."""
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


def build_deterministic_fallback_draft(
    shortlist_entry: FinalShortlistEntry,
    candidate_info: Dict[str, Any]
) -> OutreachDraft:
    """
    Construct a natural deterministic OutreachDraft strictly using verifiable real facts
    when LLM generation is unavailable or fails QA. No fake or invented data is used.
    """
    username = shortlist_entry.username
    lang = candidate_info.get("language", "ru")
    bio = candidate_info.get("biography", "").strip()
    niche = candidate_info.get("niche", "fashion")
    
    real_facts = []
    if bio:
        real_facts.append(f"Био профиля: '{bio}'")
    if niche:
        real_facts.append(f"Направление контента: {niche}")
    for gf in shortlist_entry.grounding_facts:
        if gf and gf not in real_facts:
            real_facts.append(gf)
            
    if not real_facts:
        real_facts.append(f"Профиль @{username} выбран для сотрудничества с LD Latte.")

    dedup_facts = list(dict.fromkeys(real_facts))

    personalized_elements = [
        f"Эстетика и стиль контента: {niche}"
    ]
    if bio:
        personalized_elements.append(f"Описание профиля: {bio[:60]}")

    if lang == "en":
        subject = f"Collaboration offer from LD Latte x @{username} 🤍"
        body = (
            f"Hello @{username}!\n\n"
            f"We at LD Latte love your visual style and aesthetic approach to content creation. "
            f"Our brand focuses on creating timeless, elegant minimalist apparel designed for everyday capsule wardrobe styling.\n\n"
            f"We would love to offer you a barter collaboration — gifting you a complete outfit of your choice from our latest collection. "
            f"In return, we would be thrilled if you featured the items in your own style, whether as a styling reel, outfit breakdown, or unboxing.\n\n"
            f"Would you be open to taking a look at our catalogue and picking something out?\n\n"
            f"Warm regards,\nLD Latte PR Team"
        )
    else:
        subject = f"Стильный подарок от LD Latte для @{username} 🤍"
        body = (
            f"Здравствуйте, @{username}!\n\n"
            f"Команда бренда LD Latte внимательно следит за вашим профилем — нам очень откликается ваша эстетика и то, как стильно вы преподносите свои образы.\n\n"
            f"Мы в LD Latte создаем лаконичную и элегантную женскую одежду, в которой легко собирать безупречные повседневные капсулы. "
            f"Хотели бы предложить вам бартерное сотрудничество и подарить любой понравившийся образ из нашей новой коллекции.\n\n"
            f"Будем рады, если вещи придутся вам по душе и вы покажете их в своем привычном формате — в виде эстетичного Reels, распаковки или образа дня.\n\n"
            f"Подскажите, было бы вам интересно посмотреть наш каталог и подобрать вещи для примерки?\n\n"
            f"С теплом,\nPR-команда LD Latte"
        )

    return OutreachDraft(
        username=username,
        subject=subject,
        body=body,
        language=lang,
        personalized_elements=personalized_elements,
        grounding_facts=dedup_facts
    )


def validate_qa_draft(draft: OutreachDraft, target_lang: str) -> bool:
    """
    Perform QA sanity validation on generated OutreachDraft.
    Checks structure, language consistency, and flags robotic/banned phrases.
    """
    if not draft.subject or len(draft.subject.strip()) < 5:
        logger.warning(f"QA Failed: Subject too short or empty for {draft.username}")
        return False
        
    if not draft.body or len(draft.body.strip()) < 30:
        logger.warning(f"QA Failed: Body too short or empty for {draft.username}")
        return False
        
    if not draft.personalized_elements:
        logger.warning(f"QA Failed: Empty personalized_elements for {draft.username}")
        return False
        
    if not draft.grounding_facts:
        logger.warning(f"QA Failed: Empty grounding_facts for {draft.username}")
        return False

    # Check for banned robotic phrases
    body_lower = draft.body.lower()
    subject_lower = draft.subject.lower()
    for phrase in BANNED_ROBOTIC_PHRASES:
        if phrase in body_lower or phrase in subject_lower:
            logger.warning(f"QA Failed: Robotic phrase '{phrase}' detected for @{draft.username}")
            return False

    # Language drift check
    if target_lang == "ru":
        cyrillic_count = len(re.findall(r'[а-яА-ЯёЁ]', draft.body))
        if cyrillic_count < 15:
            logger.warning(f"QA Failed: Language drift detected for @{draft.username} (expected ru)")
            return False
            
    return True


def generate_single_offer(
    shortlist_entry: FinalShortlistEntry,
    candidate_info: Dict[str, Any],
    system_prompt: str,
    llm_client: Optional[LLMClient] = None
) -> OutreachDraft:
    """
    Generate OutreachDraft for a single candidate using DeepSeek-V4 via OpenRouter
    with fallback to Groq / deterministic draft generator.
    """
    username = shortlist_entry.username
    lang = candidate_info.get("language", "ru")
    bio = candidate_info.get("biography", "")
    niche = candidate_info.get("niche", "fashion")
    recent_posts = candidate_info.get("recent_posts", [])
    
    # Format natural, human narrative input context (avoiding raw metric keys)
    input_context = {
        "username": username,
        "language": lang,
        "biography_text": bio,
        "content_niche_focus": niche,
        "verified_profile_facts": shortlist_entry.grounding_facts,
        "recent_post_snippets": [p.get("caption", "") for p in recent_posts if isinstance(p, dict) and p.get("caption")]
    }

    user_prompt = (
        f"Write a natural, high-converting barter PR offer for influencer @{username}.\n"
        f"Strict Observable Context (DO NOT INVENT ANY FAKE FACTS):\n"
        f"{json.dumps(input_context, ensure_ascii=False, indent=2)}\n\n"
        f"Return strictly a valid JSON object matching the schema without robotic jargon."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    if llm_client is not None:
        try:
            logger.info(f"Generating offer via DeepSeek-V4 (OpenRouter: {PRIMARY_OPENROUTER_MODEL}, Fallback: {FALLBACK_GROQ_MODEL}) for @{username}...")
            
            # Call OpenRouter first with DeepSeek-Chat / DeepSeek-V4, with Groq as secondary fallback
            raw_response = llm_client.generate(
                messages=messages,
                temperature=0.3,
                response_format={"type": "json_object"},
                groq_model=FALLBACK_GROQ_MODEL,
                openrouter_models=[PRIMARY_OPENROUTER_MODEL, "openai/gpt-4o"]
            )
            
            cleaned_text = clean_json_response(raw_response)
            parsed_json = json.loads(cleaned_text)
            
            parsed_json["username"] = username
            if "language" not in parsed_json or not parsed_json["language"]:
                parsed_json["language"] = lang
                
            draft = OutreachDraft.model_validate(parsed_json)
            
            if validate_qa_draft(draft, lang):
                logger.info(f"Successfully generated valid natural PR offer for @{username}")
                return draft
            else:
                logger.warning(f"LLM offer draft for @{username} failed QA anti-robotic check. Using fallback draft.")
        except Exception as e:
            logger.warning(f"LLM generation failed for @{username}: {e}. Using fallback draft.")
            
    logger.info(f"Using deterministic fallback draft for @{username}")
    return build_deterministic_fallback_draft(shortlist_entry, candidate_info)


def run_outreach_generation(
    shortlist_path: str = SHORTLIST_FINAL_PATH,
    candidates_path: str = CANDIDATES_DISCOVERED_PATH,
    output_path: str = OUTPUT_OFFERS_PATH,
    prompt_path: str = PROMPT_TEMPLATE_PATH,
    use_llm: bool = True
) -> List[OutreachDraft]:
    """
    Main execution pipeline for Outreach Generator.
    Reads shortlist, generates offers, validates QA, and writes output.
    """
    logger.info("Initializing Outreach Generator pipeline (DeepSeek-V4 Optimized)...")
    
    shortlist_file = Path(shortlist_path)
    if not shortlist_file.exists():
        raise FileNotFoundError(f"Shortlist file not found: {shortlist_path}")
        
    with open(shortlist_file, "r", encoding="utf-8") as f:
        raw_shortlist = json.load(f)
        
    shortlist_entries = [FinalShortlistEntry.model_validate(item) for item in raw_shortlist]
    logger.info(f"Loaded {len(shortlist_entries)} shortlisted candidates from {shortlist_path}")

    candidate_lookup = load_candidate_lookup(candidates_path)
    system_prompt = load_prompt_template(prompt_path)
    
    llm_client = None
    if use_llm:
        try:
            llm_client = LLMClient()
        except Exception as e:
            logger.warning(f"LLMClient initialization failed ({e}). Proceeding in fallback mode.")

    outreach_drafts: List[OutreachDraft] = []
    for entry in shortlist_entries:
        cand_info = candidate_lookup.get(entry.username, {"username": entry.username, "language": "ru"})
        draft = generate_single_offer(
            shortlist_entry=entry,
            candidate_info=cand_info,
            system_prompt=system_prompt,
            llm_client=llm_client
        )
        outreach_drafts.append(draft)

    out_file = Path(output_path)
    out_file.parent.mkdir(parents=True, exist_ok=True)
    
    serialized_drafts = [draft.model_dump() for draft in outreach_drafts]
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(serialized_drafts, f, ensure_ascii=False, indent=2)
        
    logger.info(f"Successfully generated {len(outreach_drafts)} barter offers in {output_path}")
    return outreach_drafts


if __name__ == "__main__":
    run_outreach_generation()
