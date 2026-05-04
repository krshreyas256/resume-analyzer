// Skills database
const SKILLS = [
  "Python", "Java", "C++", "JavaScript", "SQL", "HTML", "CSS",
  "React", "Node.js", "Machine Learning", "Deep Learning",
  "Django", "Flask", "FastAPI", "AWS", "Azure", "GCP", "Git",
  "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "Redis",
  "TypeScript", "Angular", "Vue.js", "Spring Boot", "TensorFlow",
  "PyTorch", "Scikit-learn", "Pandas", "NumPy", "REST API",
  "GraphQL", "Microservices", "Agile", "Scrum", "CI/CD",
  "Jenkins", "Linux", "Bash", "PowerShell", "Express.js",
  "Next.js", "Webpack", "Jest", "Mocha", "Chai"
];

export function analyzeResume(text) {
  // Extract emails
  const emails = extractEmails(text);

  // Extract phone numbers
  const phones = extractPhones(text);

  // Match skills
  const skills = extractSkills(text);

  // Extract names (basic approach)
  const names = extractNames(text);

  // Extract organizations (basic approach)
  const organizations = extractOrganizations(text);

  // Extract dates
  const dates = extractDates(text);

  // Calculate ATS score
  const ats_score = calculateAtsScore(text, emails, phones, skills, names, organizations, dates);

  // Generate improvement suggestions
  const suggestions = generateSuggestions(text, emails, phones, skills, names, organizations, dates, ats_score);

  return {
    emails: [...new Set(emails)],
    phones: [...new Set(phones)],
    skills: [...new Set(skills)],
    names: [...new Set(names)],
    organizations: [...new Set(organizations)],
    dates: [...new Set(dates)],
    ats_score,
    suggestions
  };
}

function extractEmails(text) {
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
  return text.match(emailRegex) || [];
}

function extractPhones(text) {
  const phoneRegex = /\+?\d[\d -]{8,12}\d/g;
  return text.match(phoneRegex) || [];
}

function extractSkills(text) {
  const foundSkills = [];
  const textLower = text.toLowerCase();

  for (const skill of SKILLS) {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

function extractNames(text) {
  // Simple heuristic: Look for capitalized words at the beginning of lines or after common phrases
  const lines = text.split('\n');
  const names = [];
  const commonPhrases = ['name', 'email', 'phone', 'by', 'from'];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && trimmed.length < 50) {
      const words = trimmed.split(/\s+/);
      if (words.length <= 4 && words.every(word => /^[A-Z][a-z]+/.test(word))) {
        // Check if it looks like a name pattern
        const lowerLine = trimmed.toLowerCase();
        let isName = false;

        for (const phrase of commonPhrases) {
          if (lowerLine.includes(phrase)) {
            isName = false;
            break;
          }
        }

        if (isName && trimmed.length > 3) {
          names.push(trimmed);
        }
      }
    }
  }

  return names;
}

function extractOrganizations(text) {
  // Look for patterns like "Company Name, Inc." or common organization indicators
  const orgPatterns = [
    /at\s+([A-Z][A-Za-z\s&,]+?(?:Inc|LLC|Ltd|Corp|Company|Corp\.|Inc\.|LLC\.|Ltd\.))/gi,
    /worked\s+at\s+([A-Z][A-Za-z\s&,]+)/gi,
    /(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|LLC|Ltd|Corp|Company|Group|Solutions|Systems|Tech|IT|Services)\b)/g
  ];

  const organizations = [];

  for (const pattern of orgPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      organizations.push(...matches);
    }
  }

  return organizations;
}

function extractDates(text) {
  // Look for year patterns and date formats
  const datePatterns = [
    /\b((?:19|20)\d{2})\b/g, // Years like 2020, 1999
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+(?:19|20)\d{2}/g,
    /\b(\d{1,2}\/\d{1,2}\/(?:19|20)\d{2})\b/g
  ];

  const dates = [];

  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  }

  return [...new Set(dates)];
}

function calculateAtsScore(text, emails, phones, skills, names, organizations, dates) {
  let score = 0;

  // Contact Information (20 points)
  if (emails.length > 0) score += 10;
  if (phones.length > 0) score += 10;

  // Skills Section (25 points)
  const skillCount = skills.length;
  if (skillCount >= 10) {
    score += 25;
  } else if (skillCount >= 5) {
    score += 15;
  } else if (skillCount >= 1) {
    score += 5;
  }

  // Personal Information (10 points)
  if (names.length > 0) score += 10;

  // Work Experience (20 points)
  if (organizations.length > 0) score += 10;
  if (dates.length > 0) score += 10;

  // Resume Length (10 points)
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) {
    score += 10;
  } else if ((wordCount >= 200 && wordCount < 300) || (wordCount > 800 && wordCount <= 1000)) {
    score += 5;
  }

  // Format and Structure (15 points)
  const textLower = text.toLowerCase();
  const commonSections = ['experience', 'education', 'skills', 'summary', 'objective', 'projects'];
  let sectionsFound = 0;

  for (const section of commonSections) {
    if (textLower.includes(section)) {
      sectionsFound++;
    }
  }

  const sectionScore = Math.min(15, (sectionsFound / commonSections.length) * 15);
  score += sectionScore;

  return Math.round(score);
}

function generateSuggestions(text, emails, phones, skills, names, organizations, dates, ats_score) {
  const suggestions = [];

  // Contact Information
  if (emails.length === 0) {
    suggestions.push({
      category: "Contact Information",
      severity: "high",
      message: "Add a professional email address to your resume."
    });
  }

  if (phones.length === 0) {
    suggestions.push({
      category: "Contact Information",
      severity: "high",
      message: "Include a phone number for recruiters to contact you."
    });
  }

  // Skills
  const skillCount = skills.length;
  if (skillCount < 5) {
    suggestions.push({
      category: "Skills",
      severity: "high",
      message: `Only ${skillCount} skill(s) detected. Add more relevant technical skills to improve ATS matching.`
    });
  } else if (skillCount < 10) {
    suggestions.push({
      category: "Skills",
      severity: "medium",
      message: `You have ${skillCount} skills listed. Consider adding more to reach 10+ for better ATS scores.`
    });
  }

  // Work Experience
  if (organizations.length === 0) {
    suggestions.push({
      category: "Work Experience",
      severity: "high",
      message: "No company/organization names detected. Include your work history with company names."
    });
  }

  if (dates.length === 0) {
    suggestions.push({
      category: "Work Experience",
      severity: "high",
      message: "No work dates/timeline found. Add dates for your work experience and education."
    });
  }

  // Personal Information
  if (names.length === 0) {
    suggestions.push({
      category: "Personal Information",
      severity: "high",
      message: "Your name should appear clearly at the top of your resume."
    });
  }

  // Resume Structure
  const textLower = text.toLowerCase();
  if (!textLower.includes('education')) {
    suggestions.push({
      category: "Resume Structure",
      severity: "medium",
      message: "Consider adding an Education section if you haven't already."
    });
  }

  if (!textLower.includes('experience') && !textLower.includes('work history')) {
    suggestions.push({
      category: "Resume Structure",
      severity: "medium",
      message: "Add a dedicated Experience or Work History section."
    });
  }

  // Length recommendations
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 200) {
    suggestions.push({
      category: "Resume Length",
      severity: "medium",
      message: "Your resume seems brief. Expand with more details about your experience and achievements."
    });
  } else if (wordCount > 1000) {
    suggestions.push({
      category: "Resume Length",
      severity: "medium",
      message: "Your resume might be too long. Try to condense it to highlight the most important information."
    });
  }

  return suggestions;
}
