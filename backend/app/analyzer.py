# app/analyzer.py
import re
import spacy

nlp = spacy.load("en_core_web_sm")

# A basic skills list (can be expanded)
SKILLS = ["Python", "Java", "C++", "JavaScript", "SQL", "HTML", "CSS", 
          "React", "Node.js", "Machine Learning", "Deep Learning", 
          "Django", "Flask", "FastAPI", "AWS", "Azure", "GCP", "Git", 
          "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Redis",
          "TypeScript", "Angular", "Vue.js", "Spring Boot", "TensorFlow",
          "PyTorch", "Scikit-learn", "Pandas", "NumPy", "REST API",
          "GraphQL", "Microservices", "Agile", "Scrum", "CI/CD",
          "Jenkins", "Linux", "Bash", "PowerShell"]

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

    # Extract names using spaCy NER
    names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]
    
    # Extract organizations
    organizations = [ent.text for ent in doc.ents if ent.label_ == "ORG"]
    
    # Extract dates
    dates = [ent.text for ent in doc.ents if ent.label_ == "DATE"]
    
    # Calculate ATS score
    ats_score = calculate_ats_score(text, emails, phones, found_skills, names, organizations, dates)
    
    # Generate improvement suggestions
    suggestions = generate_suggestions(text, emails, phones, found_skills, names, organizations, dates, ats_score)

    return {
        "emails": list(set(emails)),
        "phones": list(set(phones)),
        "skills": list(set(found_skills)),
        "names": list(set(names)),
        "organizations": list(set(organizations)),
        "dates": list(set(dates)),
        "ats_score": ats_score,
        "suggestions": suggestions
    }


def calculate_ats_score(text, emails, phones, skills, names, organizations, dates):
    """Calculate ATS (Applicant Tracking System) score based on resume quality"""
    score = 0
    max_score = 100
    
    # Contact Information (20 points)
    if emails:
        score += 10
    if phones:
        score += 10
    
    # Skills Section (25 points)
    skill_count = len(skills)
    if skill_count >= 10:
        score += 25
    elif skill_count >= 5:
        score += 15
    elif skill_count >= 1:
        score += 5
    
    # Personal Information (10 points)
    if names:
        score += 10
    
    # Work Experience (20 points)
    if organizations:
        score += 10
    if dates:
        score += 10
    
    # Resume Length (10 points)
    word_count = len(text.split())
    if 300 <= word_count <= 800:
        score += 10
    elif 200 <= word_count < 300 or 800 < word_count <= 1000:
        score += 5
    
    # Format and Structure (15 points)
    # Check for common sections
    text_lower = text.lower()
    sections_found = 0
    common_sections = ["experience", "education", "skills", "summary", "objective", "projects"]
    for section in common_sections:
        if section in text_lower:
            sections_found += 1
    
    section_score = min(15, (sections_found / len(common_sections)) * 15)
    score += section_score
    
    return round(score)


def generate_suggestions(text, emails, phones, skills, names, organizations, dates, ats_score):
    """Generate improvement suggestions based on resume analysis"""
    suggestions = []
    
    # Contact Information
    if not emails:
        suggestions.append({
            "category": "Contact Information",
            "severity": "high",
            "message": "Add a professional email address to your resume."
        })
    
    if not phones:
        suggestions.append({
            "category": "Contact Information",
            "severity": "high",
            "message": "Include a phone number for recruiters to contact you."
        })
    
    # Skills
    skill_count = len(skills)
    if skill_count < 5:
        suggestions.append({
            "category": "Skills",
            "severity": "high",
            "message": f"Only {skill_count} skill(s) detected. Add more relevant technical skills to improve ATS matching."
        })
    elif skill_count < 10:
        suggestions.append({
            "category": "Skills",
            "severity": "medium",
            "message": f"You have {skill_count} skills listed. Consider adding more to reach 10+ for better ATS scores."
        })
    
    # Work Experience
    if not organizations:
        suggestions.append({
            "category": "Work Experience",
            "severity": "high",
            "message": "No company/organization names detected. Include your work history with company names."
        })
    
    if not dates:
        suggestions.append({
            "category": "Work Experience",
            "severity": "medium",
            "message": "No dates detected. Include dates for your work experience and education."
        })
    
    # Resume Length
    word_count = len(text.split())
    if word_count < 200:
        suggestions.append({
            "category": "Content Length",
            "severity": "high",
            "message": f"Resume is too short ({word_count} words). Aim for 300-800 words for optimal ATS performance."
        })
    elif word_count > 1000:
        suggestions.append({
            "category": "Content Length",
            "severity": "medium",
            "message": f"Resume is quite long ({word_count} words). Consider condensing to 300-800 words for better readability."
        })
    
    # Sections
    text_lower = text.lower()
    if "summary" not in text_lower and "objective" not in text_lower:
        suggestions.append({
            "category": "Structure",
            "severity": "medium",
            "message": "Add a professional summary or objective statement at the top of your resume."
        })
    
    if "education" not in text_lower:
        suggestions.append({
            "category": "Structure",
            "severity": "medium",
            "message": "Include an education section with your degrees and certifications."
        })
    
    if "experience" not in text_lower and "work" not in text_lower:
        suggestions.append({
            "category": "Structure",
            "severity": "high",
            "message": "Add a work experience section detailing your professional background."
        })
    
    # Overall score feedback
    if ats_score >= 80:
        suggestions.append({
            "category": "Overall",
            "severity": "success",
            "message": "Excellent! Your resume is well-optimized for ATS systems."
        })
    elif ats_score >= 60:
        suggestions.append({
            "category": "Overall",
            "severity": "medium",
            "message": "Good resume, but there's room for improvement to better pass ATS filters."
        })
    else:
        suggestions.append({
            "category": "Overall",
            "severity": "high",
            "message": "Your resume needs significant improvements to pass ATS screening effectively."
        })
    
    return suggestions
