const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

const Q_BASE = path.join(__dirname, "interview_questions");
const A_BASE = path.join(__dirname, "interview_answer");

/* ===== Utilities ===== */
function readLines(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
}

function stripNumber(text) {
  return text.replace(/^\s*\d+\s*[\.\)\-]\s*/, "").trim();
}

function getQA(role, type) {
  const qFile = path.join(Q_BASE, role, `${type}.txt`);
  const aFile = path.join(A_BASE, role, `${type}.txt`);

  const questions = readLines(qFile);
  const answers = readLines(aFile);

  const n = Math.min(questions.length, answers.length);
  if (n === 0) {
    throw new Error(`Empty Q/A file for ${role}/${type}`);
  }

  const index = Math.floor(Math.random() * n);

  return {
    number: index + 1,
    question: stripNumber(questions[index]),
    answer: stripNumber(answers[index])
  };
}

/* ===== API ===== */
app.get("/qa/:role", (req, res) => {
  const role = req.params.role;

  try {
    res.json({
      introduction: getQA(role, "introduction"),
      behavioral: getQA(role, "behavioral"),
      skills: getQA(role, "skills"),
      situational: getQA(role, "situational"),
      closing: getQA(role, "closing")
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/* ===== Start Server ===== */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
