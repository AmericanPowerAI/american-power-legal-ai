const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Legal Analysis Engine
class LegalAI {
  analyzeCase(userInput) {
    const input = userInput.toLowerCase();
    
    // Criminal Law Analysis
    if (input.includes('post conviction') || input.includes('police') || input.includes('beat') || input.includes('excessive force')) {
      return this.analyzeCriminalCase(userInput);
    }
    
    // Employment Law Analysis
    if (input.includes('employer') || input.includes('fired') || input.includes('terminated') || input.includes('work')) {
      return this.analyzeEmploymentCase(userInput);
    }
    
    // Personal Injury Analysis
    if (input.includes('injured') || input.includes('accident') || input.includes('medical') || input.includes('hurt')) {
      return this.analyzePersonalInjuryCase(userInput);
    }
    
    // Default analysis
    return this.analyzeGeneralCase(userInput);
  }

  analyzeCriminalCase(input) {
    const claims = [];
    let damages = {
      medical: 0,
      pain: 0,
      punitive: 0,
      total: 0
    };

    // Post-conviction release analysis
    if (input.includes('post conviction') || input.includes('release')) {
      claims.push('Post-Conviction Relief Petition');
      claims.push('Habeas Corpus Petition');
      claims.push('Sentence Modification');
    }

    // Police brutality analysis
    if (input.includes('police') && (input.includes('beat') || input.includes('excessive force'))) {
      claims.push('Police Brutality - 42 USC § 1983');
      claims.push('Excessive Force');
      claims.push('Civil Rights Violation');
      
      damages = {
        medical: 25000,
        pain: 50000,
        punitive: 100000,
        total: 175000
      };
    }

    return {
      issue: input,
      type: 'Criminal/Civil Rights',
      claims: claims,
      damages: damages,
      successProbability: 65,
      documents: ['Post-Conviction Relief Petition', 'Civil Rights Complaint', 'Police Brutality Lawsuit'],
      actions: [
        'File post-conviction relief petition with sentencing court',
        'Submit civil rights complaint for police brutality',
        'Gather medical records and witness statements',
        'Contact civil rights organizations'
      ]
    };
  }

  analyzeEmploymentCase(input) {
    const claims = [];
    let damages = {
      backPay: 0,
      frontPay: 0,
      emotional: 0,
      punitive: 0,
      total: 0
    };

    if (input.includes('fired') || input.includes('terminated')) {
      claims.push('Wrongful Termination');
      damages.backPay = 15000;
      damages.frontPay = 25000;
    }

    if (input.includes('retaliation')) {
      claims.push('Retaliation');
      damages.punitive = 50000;
    }

    if (input.includes('discrimination')) {
      claims.push('Employment Discrimination');
      damages.emotional = 25000;
    }

    damages.total = damages.backPay + damages.frontPay + damages.emotional + damages.punitive;

    return {
      issue: input,
      type: 'Employment Law',
      claims: claims,
      damages: damages,
      successProbability: 75,
      documents: ['EEOC Charge', 'Wrongful Termination Complaint', 'Demand Letter'],
      actions: [
        'File EEOC charge within 180 days',
        'Send demand letter to employer',
        'Document all communications',
        'Preserve evidence and emails'
      ]
    };
  }

  analyzePersonalInjuryCase(input) {
    return {
      issue: input,
      type: 'Personal Injury',
      claims: ['Negligence', 'Personal Injury'],
      damages: {
        medical: 15000,
        lostWages: 12000,
        pain: 25000,
        total: 52000
      },
      successProbability: 80,
      documents: ['Personal Injury Complaint', 'Demand Letter', 'Settlement Agreement'],
      actions: [
        'Send demand letter to insurance company',
        'File personal injury lawsuit',
        'Gather medical records and bills',
        'Document injury and recovery process'
      ]
    };
  }

  analyzeGeneralCase(input) {
    return {
      issue: input,
      type: 'General Legal Matter',
      claims: ['Legal Consultation Recommended'],
      damages: {
        estimated: 25000,
        total: 25000
      },
      successProbability: 50,
      documents: ['Legal Consultation Form'],
      actions: [
        'Consult with specialized attorney',
        'Research specific laws in your state',
        'Gather all relevant documentation'
      ]
    };
  }

  generateDocument(docType, caseData) {
    const templates = {
      'Demand Letter': this.generateDemandLetter(caseData),
      'Legal Complaint': this.generateComplaint(caseData),
      'Post-Conviction Petition': this.generatePostConvictionPetition(caseData)
    };

    return templates[docType] || 'Document template not found';
  }

  generateDemandLetter(caseData) {
    return `
DEMAND LETTER

Date: ${new Date().toLocaleDateString()}

To Whom It May Concern:

RE: Legal Claim - ${caseData.type}

This letter serves as formal notice of our intent to pursue legal action regarding: ${caseData.issue}

Based on our analysis, we have identified the following claims:
${caseData.claims.map(claim => `• ${claim}`).join('\n')}

Total damages claimed: $${caseData.damages.total.toLocaleString()}

We demand settlement of this matter within 30 days to avoid formal litigation.

Sincerely,
APGC Legal AI
American Power Global Corporation
    `.trim();
  }

  generateComplaint(caseData) {
    return `
IN THE UNITED STATES DISTRICT COURT
COMPLAINT

Plaintiff: [Your Name]
vs.
Defendant: [Opposing Party]

1. This action arises from: ${caseData.issue}

2. Jurisdiction: This Court has jurisdiction under 28 U.S.C. § 1331

3. Claims:
${caseData.claims.map((claim, index) => `${index + 1}. ${claim}`).join('\n')}

4. Damages: $${caseData.damages.total.toLocaleString()}

WHEREFORE, Plaintiff requests judgment against Defendant.

Respectfully submitted,
[Your Name]
Pro Se
    `.trim();
  }

  generatePostConvictionPetition(caseData) {
    return `
IN THE [STATE] SUPERIOR COURT
POST-CONVICTION RELIEF PETITION

Petitioner: [Your Name]
Case No: [Your Case Number]

1. The Petitioner seeks post-conviction relief based on: ${caseData.issue}

2. Grounds for Relief:
   • Ineffective assistance of counsel
   • Newly discovered evidence
   • Constitutional violations

3. Requested Relief:
   • Vacate conviction
   • Reduce sentence
   • New trial

Respectfully submitted,
[Your Name]
Pro Se
    `.trim();
  }
}

// Initialize Legal AI
const legalAI = new LegalAI();

// API Routes
app.post('/api/analyze-case', (req, res) => {
  try {
    const { userInput } = req.body;
    
    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    const analysis = legalAI.analyzeCase(userInput);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed', details: error.message });
  }
});

app.post('/api/generate-document', (req, res) => {
  try {
    const { docType, caseData } = req.body;
    
    if (!docType || !caseData) {
      return res.status(400).json({ error: 'Document type and case data are required' });
    }

    const document = legalAI.generateDocument(docType, caseData);
    res.json({ document, docType });
  } catch (error) {
    res.status(500).json({ error: 'Document generation failed', details: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Legal AI Backend is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Legal AI Backend running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /api/analyze-case`);
  console.log(`   POST /api/generate-document`);
  console.log(`   GET  /api/health`);
});

module.exports = app;
