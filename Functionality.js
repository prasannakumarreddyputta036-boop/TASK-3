const API_URL = "https://opentdb.com/api.php?amount=10&category=21&type=multiple"
const loading = document.getElementById("loading");
const quiz = document.getElementById("quiz");
const result = document.getElementById("result");

const question = document.getElementById("question");
const questionNumber = document.getElementById("questionNumber");

const optionButtons = document.querySelectorAll(".option-btn");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const restartBtn = document.getElementById("restartBtn");

const scoreText = document.getElementById("score");

let questions = [];
let currentQuestion = 0;
let score = 0;

// Stores the selected option index for each question
let selectedAnswers = [];

// Stores whether a question has already been scored
let answered = [];

fetchQuestions();

async function fetchQuestions() {

    try {

        const response = await fetch(API_URL);

        const data = await response.json();

        questions = data.results;

        loading.classList.add("hide");
        quiz.classList.remove("hide");

        showQuestion();

    } catch (error) {

        loading.innerHTML = "Failed to load questions.";

        console.log(error);

    }

}

function decode(text) {

    const txt = document.createElement("textarea");

    txt.innerHTML = text;

    return txt.value;

}

function showQuestion() {

    const q = questions[currentQuestion];

    questionNumber.innerText =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    question.innerHTML = decode(q.question);

    let answers = [
        ...q.incorrect_answers,
        q.correct_answer
    ];

    // Shuffle answers
    answers.sort(() => Math.random() - 0.5);

    q.shuffledAnswers = answers;

    optionButtons.forEach((button, index) => {

        button.className = "option-btn";

        button.disabled = false;

        button.innerHTML = decode(answers[index]);

        if (selectedAnswers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        button.onclick = function () {

            optionButtons.forEach(btn =>
                btn.classList.remove("selected")
            );

            button.classList.add("selected");

            selectedAnswers[currentQuestion] = index;

        };

    });

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {

        nextBtn.innerText = "Finish";

    } else {

        nextBtn.innerText = "Next";

    }

}

nextBtn.onclick = function () {

    if (selectedAnswers[currentQuestion] == null) {

        alert("Please select an option.");

        return;

    }

    if (!answered[currentQuestion]) {

        const q = questions[currentQuestion];

        const selected =
            q.shuffledAnswers[selectedAnswers[currentQuestion]];

        if (selected === q.correct_answer) {

            score++;

        }

        answered[currentQuestion] = true;

    }

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    } else {

        showResult();

    }

};

prevBtn.onclick = function () {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

};

function showResult() {

    quiz.classList.add("hide");

    result.classList.remove("hide");

    scoreText.innerHTML =
        `Your Score : ${score} / ${questions.length}`;

}

restartBtn.onclick = function () {

    questions = [];

    currentQuestion = 0;

    score = 0;

    selectedAnswers = [];

    answered = [];

    result.classList.add("hide");

    loading.classList.remove("hide");

    loading.innerHTML = "Loading Questions...";

    fetchQuestions();

};

