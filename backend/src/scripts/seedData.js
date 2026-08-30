const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Document = require('../models/Document');
const DocumentChunk = require('../models/DocumentChunk');
const { processDocumentPipeline } = require('../controllers/documentController');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college-chatbot';
    await mongoose.connect(mongoUri);
    console.log('[Seed]: Connected to MongoDB');

    // 1. Clear existing seed data if requested
    await User.deleteMany({ email: { $in: ['admin@college.edu', 'student@college.edu'] } });

    // 2. Create Admin and Student users
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@college.edu',
      password: 'adminpassword123',
      role: 'admin',
    });

    const studentUser = await User.create({
      name: 'John Student',
      email: 'student@college.edu',
      password: 'studentpassword123',
      role: 'student',
    });

    console.log(`[Seed]: Created Admin User (${adminUser.email}) and Student User (${studentUser.email})`);

    // 3. Create Sample College Documents
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const sampleDocs = [
      {
        title: 'College Hostel & Fee Structure 2026',
        fileName: 'hostel_fee_structure_2026.txt',
        category: 'Fees',
        content: `ROYAL COLLEGE OF ENGINEERING AND TECHNOLOGY
OFFICIAL HOSTEL & ACADEMIC FEE STRUCTURE 2026-2027

1. ACADEMIC TUITION FEES:
- B.Tech Computer Science & Engineering: ₹1,20,000 per annum
- B.Tech Electronics & Communication: ₹1,10,000 per annum
- B.Tech Mechanical Engineering: ₹1,00,000 per annum
- M.Tech / MBA Programs: ₹1,40,000 per annum

2. HOSTEL & MESS FEES:
- Double Occupancy Air-Conditioned Room: ₹85,000 per year (including 4-meal daily mess service)
- Triple Occupancy Non-AC Room: ₹60,000 per year (including mess service)
- Refundable Hostel Caution Security Deposit: ₹10,000 (one-time upon admission)

3. PAYMENT DEADLINES & POLICIES:
- Autumn Semester Fees due: July 15, 2026.
- Spring Semester Fees due: January 10, 2027.
- Late payment penalty of ₹100 per day applies after due date.
- Installment options available for students holding active government merit scholarships.`,
      },
      {
        title: 'Admissions & Eligibility Policy 2026',
        fileName: 'admissions_eligibility_2026.txt',
        category: 'Admissions',
        content: `ROYAL COLLEGE OF ENGINEERING AND TECHNOLOGY
ADMISSIONS & ELIGIBILITY GUIDELINES 2026-2027

1. UNDERGRADUATE (B.TECH) ELIGIBILITY:
- Candidates must pass 10+2 or equivalent examination with minimum 60% aggregate marks in Physics, Chemistry, and Mathematics (55% for reserved category).
- Valid score in JEE Main or College Entrance Test (RCET-SAT) is mandatory.

2. ADMISSION PROCEDURE:
- Online application submission at www.royalcollege.edu/apply.
- Application fee: ₹1,200 (non-refundable).
- Required documents: Class 10 & 12 Marksheets, Transfer Certificate, Migration Certificate, JEE Scorecard, ID Proof.

3. SCHOLARSHIP MERIT CRITERIA:
- 100% Tuition Fee Waiver for JEE Main AIR < 10,000 or 10+2 Marks > 95%.
- 50% Tuition Fee Waiver for 10+2 Marks > 90%.
- Special Girl Child Scholarship: ₹25,000 annual fee concession for female candidates in Engineering.`,
      },
      {
        title: 'Academic Calendar & Examination Rules',
        fileName: 'academic_calendar_exam_rules.txt',
        category: 'Exams',
        content: `ROYAL COLLEGE OF ENGINEERING AND TECHNOLOGY
ACADEMIC CALENDAR & EXAMINATION RULES 2026

1. ACADEMIC TIMELINE:
- Autumn Semester Starts: August 1, 2026
- Mid-Semester Examinations: October 12 - October 18, 2026
- End-Semester Practical Examinations: November 25 - November 30, 2026
- End-Semester Theory Examinations: December 5 - December 22, 2026
- Winter Vacation: December 23, 2026 - January 7, 2027

2. ATTENDANCE REQUIREMENTS:
- Minimum 75% attendance in all theory and practical courses is mandatory to qualify for End-Semester Exams.
- Medical leave allowance up to 10% permitted with official civil surgeon medical certificate.

3. GRADING & SGPA / CGPA CRITERIA:
- 10-point Letter Grading System (O: 10, A+: 9, A: 8, B+: 7, B: 6, C: 5, P: 4, F: 0).
- Passing grade in any subject is 'P' (minimum 40% marks in combined internal and external evaluation).`,
      },
    ];

    for (const docInfo of sampleDocs) {
      const filePath = path.join(uploadsDir, docInfo.fileName);
      fs.writeFileSync(filePath, docInfo.content, 'utf-8');

      // Remove existing doc if present
      await Document.deleteMany({ fileName: docInfo.fileName });

      const doc = await Document.create({
        title: docInfo.title,
        fileName: docInfo.fileName,
        fileType: 'txt',
        category: docInfo.category,
        uploadedBy: adminUser._id,
        filePath,
        status: 'PROCESSING',
      });

      await processDocumentPipeline(doc);
    }

    console.log('[Seed]: Successfully created and indexed sample college documents into Vector Store.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();
