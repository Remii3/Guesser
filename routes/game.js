function gameRoutes(app) {
  let isGameOver = false;
  let goodAnswers = 0;
  let friendCallUsed = false;
  let crowdQuestionUsed = false;
  let halfUsed = false;

  const questions = [
    {
      question: "Equation 2+(2+2-6-2) equals?",
      answers: ["2", "3", "4", "10"],
      correctAnswer: 2,
    },
    {
      question: "What color is the black car?",
      answers: ["blue", "black", "pink", "violet"],
      correctAnswer: 1,
    },
    {
      question:
        "How many, out of 4 birds, would remain on a tree after one gun shot?",
      answers: ["four", "two", "three", "none"],
      correctAnswer: 3,
    },
  ];

  app.get("/question", (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true,
      });
    } else if (isGameOver) {
      res.json({
        loser: true,
      });
    } else {
      const nextQuestion = questions[goodAnswers];
      const { question, answers } = nextQuestion;

      res.json({
        question,
        answers,
      });
    }
  });

  app.post("/answer/:index", (req, res) => {
    if (isGameOver) {
      res.json({
        loser: true,
      });
    }

    const { index } = req.params;
    const question = questions[goodAnswers];
    const isCorrect = question.correctAnswer === Number(index);

    if (isCorrect) {
      goodAnswers++;
    } else {
      isGameOver = true;
    }

    res.json({
      correct: isCorrect,
      goodAnswers,
    });
  });

  app.get("/help/friend", (req, res) => {
    if (friendCallUsed) {
      res.json({
        text: "This aid has been already used.",
      });
      return;
    }

    friendCallUsed = true;
    const doesFriendKnowAnswer = Math.random() < 0.5;
    const question = questions[goodAnswers];

    res.json({
      text: doesFriendKnowAnswer
        ? `I think the correct answer is ${
            question.answers[question.correctAnswer]
          }`
        : `Unfortunately I don't know the correct answer to that question.`,
    });
  });

  app.get("/help/half", (req, res) => {
    if (halfUsed) {
      res.json({
        text: "This aid has been already used.",
      });
      return;
    }

    halfUsed = true;
    const question = questions[goodAnswers];
    const answersCopy = question.answers.filter(
      (s, index) => index !== question.correctAnswer
    );
    answersCopy.splice(~~(Math.random() * answersCopy.length), 1);
    res.json({
      answersToRemove: answersCopy,
    });
  });

  app.get("/help/crowd", (req, res) => {
    if (crowdQuestionUsed) {
      res.json({
        text: "This aid has been already used.",
      });
      return;
    }

    crowdQuestionUsed = true;

    const chart = [10, 20, 30, 40];

    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10);

      chart[i] += change;
      chart[i - 1] -= change;
    }
    const question = questions[goodAnswers];
    const { correctAnswer } = question;

    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];

    res.json({
      chart,
    });
  });
}

module.exports = gameRoutes;
