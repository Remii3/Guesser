const question = document.querySelector("#question");
const gameBoard = document.querySelector("#gameBoard");
const h2 = document.querySelector("h2");

function fillQuestionElements(data) {
  if (data.winner === true) {
    gameBoard.style.display = "none";
    h2.innerText = "You won !!!";
    return;
  }
  if (data.loser === true) {
    gameBoard.style.display = "none";
    h2.innerText = "You lost...";
    return;
  }

  question.innerText = data.question;

  for (const i in data.answers) {
    const answerEl = document.querySelector(`#answer${parseInt(i) + 1}`);
    answerEl.innerText = data.answers[i];
  }
}

function showNextQuestion() {
  fetch("/question", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => fillQuestionElements(data));
}
showNextQuestion();

const goodAnswersSpan = document.querySelector("#goodAnswers");

function handleAnswerFeedback(data) {
  goodAnswersSpan.innerText = data.goodAnswers;
  showNextQuestion();
}

function sendAnswer(answerIndex) {
  fetch(`/answer/${answerIndex}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      handleAnswerFeedback(data);
    });
}

const buttons = document.querySelectorAll(".answer-btn");

for (const button of buttons) {
  button.addEventListener("click", (e) => {
    const answerIndex = e.target.dataset.answer;
    sendAnswer(answerIndex);
  });
}

const adviseDiv = document.querySelector("#tip");

function handleFriendsAdvise(data) {
  adviseDiv.innerText = data.text;
}

function callToAFriend() {
  fetch("/help/friend", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      handleFriendsAdvise(data);
    });
}

document.querySelector("#callAFriend").addEventListener("click", callToAFriend);

///

function handleHalfOnHalf(data) {
  if (typeof data.text === "string") {
    adviseDiv.innerText = data.text;
  } else {
    for (const button of buttons) {
      if (data.answersToRemove.indexOf(button.innerText) > -1) {
        button.innerText = "";
      }
    }
  }
}

function halfOnHalf() {
  fetch("/help/half", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      handleHalfOnHalf(data);
    });
}

document.querySelector("#halfOnHalf").addEventListener("click", halfOnHalf);

function handleAskCrowd(data) {
  if (typeof data.text === "string") {
    adviseDiv.innerText = data.text;
  } else {
    data.chart.forEach((percent, index) => {
      buttons[index].innerText = `${buttons[index].innerText}: ${percent}%`;
    });
  }
}

function askCrowd() {
  fetch("/help/crowd", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      handleAskCrowd(data);
    });
}

document.querySelector("#askCrowd").addEventListener("click", askCrowd);
