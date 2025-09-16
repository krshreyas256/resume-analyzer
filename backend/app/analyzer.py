# app/analyzer.py
import re
import spacy

nlp = spacy.load("en_core_web_sm")

# A basic skills list (can be expanded)
SKILLS = ["Python", "Java", "C++", "JavaScript", "SQL", "HTML", "CSS", 
          "React", "Node.js", "Machine Learning", "Deep Learning", 
          "Django", "Flask", "AWS", "Git"]

def analyze_resume(text: str) -> dict:
    doc = nlp(text)

    # Extract emails
    emails = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)

    # Extract phone numbers (very simple regex)
    phones = re.findall(r"\+?\d[\d -]{8,12}\d", text)

    # Match skills
    found_skills = []
    for skill in SKILLS:
        if skill.lower() in text.lower():
            found_skills.append(skill)

    return {
        "emails": list(set(emails)),
        "phones": list(set(phones)),
        "skills": list(set(found_skills))
    }
