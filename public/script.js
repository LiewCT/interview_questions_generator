async function readFile(path) {
  const res = await fetch(path);

  if (!res.ok) {
    throw new Error("Cannot load: " + path);
  }

  const text = await res.text();

  return text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);
}

function stripNumber(text) {
  return text.replace(/^\s*\d+\s*[\.\)\-]\s*/, "").trim();
}

function randomIndex(max) {
  return Math.floor(Math.random() * max);
}

async function getQA(role, type) {
  const qPath = `/interview_questions/${role}/${type}.txt`;
  const aPath = `/interview_answer/${role}/${type}.txt`;

  const [questions, answers] = await Promise.all([
    readFile(qPath),
    readFile(aPath)
  ]);

  const n = Math.min(questions.length, answers.length);

  if (n === 0) {
    return {
      question: "No data found",
      answer: "No data found"
    };
  }

  const index = randomIndex(n);

  return {
    question: stripNumber(questions[index]),
    answer: stripNumber(answers[index])
  };
}

async function loadQA(role) {
  return {
    introduction: await getQA(role, "introduction"),
    behavioral: await getQA(role, "behavioral"),
    skills: await getQA(role, "skills"),
    situational: await getQA(role, "situational"),
    closing: await getQA(role, "closing")
  };
}

/* Example UI function */
async function generate(role) {
  const output = document.getElementById("output");

  try {
    const data = await loadQA(role);
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}
