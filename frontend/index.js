"use strict";

// Function calling api and return the data
async function fetchDataFromAPI(url) {
  // Storing response
  const response = await fetch(url);

  if (!response.ok) {
    const message = `😢 An error has occured: ${response.status}. Cannot get data from ${url}`;
    throw new Error(message);
  }

  let received = await response.clone().json();
  console.log("🙂 Received data from", url);
  return received;
}

async function fetchDataFromPostAPI(url, data) {
  // Storing response
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = `😢 An error has occured: ${response.status}. Cannot get data from ${url}`;
    throw new Error(message);
  }

  let received = await response.clone().json();
  console.log("🙂 Received data from", url);
  return received;
}

// *DOM elements
// Navigation bar
const navLaw = document.querySelector(".nav-law");
const navFine = document.querySelector(".nav-fine");
const navExam = document.querySelector(".nav-exam");
const liVehicle = document.querySelector(".fine-option--vehicle");
const liAviolation = document.querySelector(".fine-option--aviolation");
const header = document.querySelector(".header");
const lawInfo = document.querySelector(".law-info");
const fineInfo = document.querySelector(".fine-info");
const beforeExamInfo = document.querySelector(".before-exam-info");
const examInfo = document.querySelector(".exam-info");
const answerInfo = document.querySelector(".answer-info");
const historyInfo = document.querySelector(".history-info");
const btnStartExam = document.querySelector(".btn-start-exam");
const btnSubmitExam = document.querySelector(".btn-submit-exam");
const btnCancelExam = document.querySelector(".btn-cancel-exam");
const btnCheckHistoryExam = document.querySelector(".btn-check-history-exam");
const btnContinueExam = document.querySelector(".btn-continue-exam");
const ulExamOptionsAll = document.getElementsByClassName(
  "exam-question-options-ul"
);
var questionBoxList;
var infoList = [
  lawInfo,
  fineInfo,
  beforeExamInfo,
  examInfo,
  answerInfo,
  historyInfo,
];

/////////////////////////////////////////////////////////
// *Data objects
const host = "http://localhost:3001/";
var selectedVehicle = "",
  selectedAviolation = "LANE"; //default
var history_results = [],
  history_full_results = [],
  history_statistics = [];
var temp_question_ids = [],
  temp_question_numbers = [],
  temp_answer_ids = [],
  temp_result = [],
  temp_full_result = [],
  temp_result_with_type = [],
  temp_correct = [],
  temp_checked_answer = [],
  temp_statistics;

// Number of questions for each type
var num_law = 0,
  num_board = 0,
  num_figure = 0;

// Function show/hide info div
const showOneInfoDiv = function (infoList, divToShow) {
  infoList.forEach((info) => {
    info.classList.add("hidden");
    if (info === divToShow) {
      info.classList.remove("hidden");
    }
  });
};

// Function creating DOM elements displaying one rule at main_content
const showOneRule = function (ruleInfo) {
  var html3 = `<div class="law-card-info law-info--${ruleInfo.number}">
                    <p class="law-card-title law-card-title--${ruleInfo.number}">Điều ${ruleInfo.number}: ${ruleInfo.name}</p>
                    <p class="law-card-content law-card-content--${ruleInfo.number}">
                    </p>
                </div>`;
  document.querySelector(".law-card").insertAdjacentHTML("beforeend", html3);
  let ruleDesc = "";
  ruleInfo.content.forEach((ruleRow) => {
    ruleDesc += ruleRow + " <br>";
  });
  document.querySelector(`.law-card-content--${ruleInfo.number}`).innerHTML =
    ruleDesc;
};

// Function creating DOM elements displaying fine information at main_content
// Filtered by clicking on button at navigation bar
const showFines = function (vehicle, aviolation) {
  fetchDataFromAPI(
    host + `api/fine/list?types=${vehicle}&aviolation=${aviolation}`
  )
    .then((fineList) => {
      var data = fineList.data;
      console.log("***data", data);

      // Empty the content
      document.querySelector(".fine-card").innerHTML = "";

      var html_fine_card_info = "";

      data.forEach((data_i, i) => {
        // Check if the vehicle has values
        if (
          ("bike" in data_i && data_i.bike.length > 0) ||
          ("motor" in data_i && data_i.motor.length > 0) ||
          ("car" in data_i && data_i.car.length > 0)
        ) {
          html_fine_card_info += `
        <div class="fine-card-info fine-info--${data_i.aviolation} 
        fine-info--${data_i.aviolation}--${i + 1}">
          <div class="fine-card-title fine-card-title--${data_i.aviolation}">
            <p class="fine-card-title fine-card-title--${data_i.aviolation}">
              ${data_i.name}
            </p>
          </div>
          <div class="fine-card-content fine-card-content--${
            data_i.aviolation
          }">`;
          if ("bike" in data_i && data_i.bike.length > 0) {
            html_fine_card_info += `
            <div class="fine-card-vehicle fine-card-vehicle--bike">
              <div class="fine-card-column fine-card-icon fine-card-icon--bike">
                  <i class="fas fa-bicycle fine-card-i fine-card-i--bike fa-5x" aria-hidden="true"></i>
              </div>
              <div class="fine-card-column fine-card-subcontent-list fine-card-subcontent-list--bike">`;

            //Loop array of fines for bike
            data_i.bike.forEach((data_bike_j, j) => {
              html_fine_card_info += `
                <div class="fine-card-column fine-card-subcontent 
                fine-card-subcontent--bike--${j + 1}">`;

              if (data_bike_j.level != null) {
                html_fine_card_info += `
                  <div class="fine-card-subcontent-level fine-card-subcontent-level--bike">
                      ${data_bike_j.level}
                  </div>`;
              }
              if (data_bike_j.money != null) {
                html_fine_card_info += `
                  <div class="fine-card-subcontent-money fine-card-subcontent-money--bike">
                      ${data_bike_j.money}
                  </div>`;
              }
              if (data_bike_j.additional != null) {
                html_fine_card_info += `
                  <div
                      class="fine-card-subcontent-additional fine-card-subcontent-additional--bike">
                      ${data_bike_j.additional}
                  </div>`;
              }
              html_fine_card_info += `
                </div>`;
            });
            html_fine_card_info += `
              </div>
            </div>`;
          }
          if ("motor" in data_i && data_i.motor.length > 0) {
            html_fine_card_info += `
            <div class="fine-card-vehicle fine-card-vehicle--motor">
              <div class="fine-card-column fine-card-icon fine-card-icon--motor">
                  <i class="fas fa-motorcycle fine-card-i fine-card-i--motor fa-5x" aria-hidden="true"></i>
              </div>
              <div class="fine-card-column fine-card-subcontent-list fine-card-subcontent-list--motor">`;

            //Loop array of fines for motor
            data_i.motor.forEach((data_motor_j, j) => {
              html_fine_card_info += `
                <div class="fine-card-column fine-card-subcontent 
                fine-card-subcontent--motor--${j + 1}">`;

              if (data_motor_j.level != null) {
                html_fine_card_info += `
                  <div class="fine-card-subcontent-level fine-card-subcontent-level--motor">
                      ${data_motor_j.level}
                  </div>`;
              }
              if (data_motor_j.money != null) {
                html_fine_card_info += `
                  <div class="fine-card-subcontent-money fine-card-subcontent-money--motor">
                      ${data_motor_j.money}
                  </div>`;
              }
              if (data_motor_j.additional != null) {
                html_fine_card_info += `
                  <div
                      class="fine-card-subcontent-additional fine-card-subcontent-additional--motor">
                      ${data_motor_j.additional}
                  </div>`;
              }
              html_fine_card_info += `
                </div>`;
            });
            html_fine_card_info += `
              </div>
            </div>`;
          }
          if ("car" in data_i && data_i.car.length > 0) {
            html_fine_card_info += `
            <div class="fine-card-vehicle fine-card-vehicle--car">
              <div class="fine-card-column fine-card-icon fine-card-icon--car">
                  <i class="fas fa-car fine-card-i fine-card-i--car fa-5x" aria-hidden="true"></i>
              </div>
              <div class="fine-card-column fine-card-subcontent-list fine-card-subcontent-list--car">`;

            //Loop array of fines for car
            data_i.car.forEach((data_car_j, j) => {
              html_fine_card_info += `
                <div class="fine-card-column fine-card-subcontent 
                fine-card-subcontent--car--${j + 1}">`;

              if (data_car_j.level != null) {
                html_fine_card_info += `
                  <div class="fine-card-subcontent-level fine-card-subcontent-level--car">
                      ${data_car_j.level}
                  </div>`;
              }
              if (data_car_j.money != null) {
                html_fine_card_info += `
                  <div class="fine-card-subcontent-money fine-card-subcontent-money--car">
                      ${data_car_j.money}
                  </div>`;
              }
              if (data_car_j.additional != null) {
                html_fine_card_info += `
                  <div
                      class="fine-card-subcontent-additional fine-card-subcontent-additional--car">
                      ${data_car_j.additional}
                  </div>`;
              }
              html_fine_card_info += `
                  </div>`;
            });
            html_fine_card_info += `
              </div>
            </div>`;
          }
          html_fine_card_info += `</div></div>`;
        }
      });
      document
        .querySelector(".fine-card")
        .insertAdjacentHTML("beforeend", html_fine_card_info);
    })
    .catch((err) => {
      // Do something for an error here
      const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
      console.log(`Error Reading data at line ${lineno}: ${err}`);
    });
};

// Function to check an image exists
const checkImageExist = function (path) {
  var http = new XMLHttpRequest();

  http.open("HEAD", path, false);
  http.send();

  return http.status != 404;
};

// Function switch between question's class type
const switchQuestionClassType1 = function (class_type) {
  var _type = "";
  switch (class_type) {
    case "law":
      _type = "Luật giao thông";
      break;
    case "board":
      _type = "Biển báo";
      break;
    case "figure":
      _type = "Sa hình";
      break;
    default:
      _type = "";
      break;
  }
  return _type;
};

// Function creating DOM elements displaying 1 exam question at main_content
const showOneQuestion = function (question, id, type) {
  var title_1 = `Câu ${id}:`,
    title_2 = question.question.split(": ")[1];

  var newType = switchQuestionClassType1(type);

  var html_question_info = "";

  html_question_info += `
    <div class="exam-question-box exam-question-box--${id} question-id--${id} question-number--${question.number} type--${type}">
      <div class="exam-question-title question-id--${id} question-number--${question.number} 
      type--${type}">
          <div class="title--1">
              ${title_1}<br><p>Thể loại: ${newType}</p>
          </div>
          <div class="title--2">
              ${title_2}
          </div>
      </div>`;

  if (
    question.image != null &&
    checkImageExist(`frontend/img/${question.image}`) === true
  ) {
    html_question_info += `
      <div class="image">
          <img src="frontend/img/${question.image}" alt="${question.image}">
      </div>
    `;
  }

  html_question_info += `
      <div class="exam-question-options question-id--${id} question-number--${question.number}
      type--${type}">
        <ul class="exam-question-options-ul question-id--${id} question-number--${question.number}
        type--${type}">
  `;

  question.answer_list.forEach((answer, j) => {
    html_question_info += `
            <li class="question-id--${id} 
            question-number--${question.number}" li-option--${j + 1}
            type--${type}">
                <button class="question-id--${id} 
                question-number--${question.number} 
                btn-option btn-option--${j + 1}
                type--${type}">
                    ${j + 1}) ${answer}
                </button>
            </li>
    `;
  });

  html_question_info += `
        </ul>
      </div>
    </div>
  `;
  html_question_info += `<hr>`;
  return html_question_info;
};

// Function generate answer's explain
const getExplainString = function (lstExplain) {
  var strResult = "";
  lstExplain.forEach((explain, i) => {
    strResult += explain.replace("\\", ""); //remove '\'
    strResult += "<br>";
  });
  return strResult;
};

// Function check missing questions that user hasn't answered
const getMissing = function (questions_ids, answer_ids) {
  console.log("questions_ids", questions_ids);
  console.log("answer_ids", answer_ids);
  var missing = [];
  questions_ids.forEach((ques) => {
    if (!answer_ids.includes(ques)) {
      missing.push(ques);
    }
  });
  return missing;
};

// Function to find the user's answer in the temp_result by number
const findUserAnswer = function (number, temp_result) {
  for (var i = 0; i < temp_result.length; i++) {
    if (temp_result[i].number === number) {
      return temp_result[i].answer;
    }
  }
  return -1;
};

// Check one answer => return 'correct'/'wrong'
const checkAnswer = function (lstCorrect, myAnswer) {
  // myAnswer: {number: 1, answer: 1}

  for (var i = 0; i < lstCorrect.length; i++) {
    if (
      lstCorrect[i].number === myAnswer.number &&
      lstCorrect[i].answer !== myAnswer.answer
    ) {
      return "wrong";
    }
  }
  return "correct";
};

// Function switch between question's class type
const switchQuestionClassType2 = function (class_type) {
  var _type = "";
  switch (class_type) {
    case "Luật giao thông":
      _type = "law";
      break;
    case "Biển báo":
      _type = "board";
      break;
    case "Sa hình":
      _type = "figure";
      break;
    default:
      _type = "";
      break;
  }
  return _type;
};

// Function creating DOM elements displaying 1 exam answer at main_content
const showOneAnswer = function (answer, id) {
  // console.log(id, "----answer:", answer);
  var _type = switchQuestionClassType2(answer.class);

  var title_1 = `Câu ${id}:`,
    title_2 = answer.question.split(": ")[1];

  var html_answer_info = "";

  html_answer_info += `
    <div class="exam-answer-box exam-answer-box--${id} answer-id--${id} answer-number--${answer.number} type--${_type}">
      <div class="exam-answer-title answer-id--${id} answer-number--${answer.number} 
      type--${_type}">
          <div class="title--1">
              ${title_1}<br><p>Thể loại: ${answer.class}</p>
          </div>
          <div class="title--2">
              ${title_2}
          </div>
      </div>`;

  if (
    answer.image != null &&
    checkImageExist(`frontend/img/${answer.image}`) === true
  ) {
    html_answer_info += `
      <div class="image">
          <img src="frontend/img/${answer.image}" alt="${answer.image}">
      </div>
    `;
  }

  html_answer_info += `
      <div class="exam-answer-options answer-id--${id} answer-number--${answer.number}
      type--${_type}">
        <ul class="exam-answer-options-ul answer-id--${id} answer-number--${answer.number}
        type--${_type}">
  `;

  answer.answer_list.forEach((answer_j, j) => {
    // status: wrong/correct
    var userAnswer = findUserAnswer(answer.number, temp_result);
    // console.log("answer.number:", answer.number);
    // console.log("userAnswer:", userAnswer);

    if (userAnswer !== -1) {
      var _status = checkAnswer(temp_correct, {
        number: answer.number,
        answer: userAnswer,
      });
      // console.log("_status:", _status);
      if (_status === "correct") {
        if (j + 1 === userAnswer) {
          // If the user answer is correct
          html_answer_info += `
            <li class="answer-id--${id} 
            answer-number--${answer.number}" li-option--${j + 1}
            type--${_type}">
                <button class="answer-id--${id} 
                answer-number--${answer.number} 
                btn-option btn-option--${j + 1}
                type--${_type} ${_status}">
                    ${j + 1}) ${answer_j}
                </button>
            </li>
        `;
        } else {
          // Show other answers with normal style
          html_answer_info += `
            <li class="answer-id--${id} 
            answer-number--${answer.number}" li-option--${j + 1}
            type--${_type}">
                <button class="answer-id--${id} 
                answer-number--${answer.number} 
                btn-option btn-option--${j + 1}
                type--${_type}">
                    ${j + 1}) ${answer_j}
                </button>
            </li>
        `;
        }
      } else {
        // If the user answer is wrong
        // -> Show the user answer with 'wrong' class name
        if (j + 1 === userAnswer) {
          html_answer_info += `
            <li class="answer-id--${id} 
            answer-number--${answer.number}" li-option--${j + 1}
            type--${_type}">
                <button class="answer-id--${id} 
                answer-number--${answer.number} 
                btn-option btn-option--${j + 1}
                type--${_type} ${_status}">
                    ${j + 1}) ${answer_j}
                </button>
            </li>
        `;
        }
        // Show correct answer
        else if (j + 1 === answer.right_answer) {
          html_answer_info += `
            <li class="answer-id--${id} 
            answer-number--${answer.number}" li-option--${j + 1}
            type--${_type}">
                <button class="answer-id--${id} 
                answer-number--${answer.number} 
                btn-option btn-option--${j + 1}
                type--${_type} correct">
                    ${j + 1}) ${answer_j}
                </button>
            </li>
        `;
        } else {
          // Show other answers with normal style
          html_answer_info += `
            <li class="answer-id--${id} 
            answer-number--${answer.number}" li-option--${j + 1}
            type--${_type}">
                <button class="answer-id--${id} 
                answer-number--${answer.number} 
                btn-option btn-option--${j + 1}
                type--${_type}">
                    ${j + 1}) ${answer_j}
                </button>
            </li>
        `;
        }
      }

      // List of user's answers after being checked
      temp_checked_answer.push({
        number: answer.number,
        answer: userAnswer,
        status: _status,
        type: _type,
      });
    } else {
      console.log(`*CANNOT FIND THE ANSWER FOR QUESTION ID ${id}`);
    }
  });

  html_answer_info += `
        </ul>
      </div>
    `;
  if (answer.explain.length > 0) {
    html_answer_info += `
      <div class="exam-answer-explain answer-id--${id} answer-number--${
      answer.number
    }">
          Giải thích:<br><br>${getExplainString(answer.explain)}
      </div>
    </div>
  `;
  }
  html_answer_info += `<hr>`;
  return html_answer_info;
};

// Function creating DOM elements displaying 20 exam questions at main_content
const showExamAndAddButtonEvents = function () {
  // Empty the content
  document.querySelector(".exam-question-list").innerHTML = "";
  var result = [];
  if (history_results.length > 0) {
    result = history_results[history_results.length - 1];
  }
  //fetchDataFromAPI(`${host}api/a1/exams`)
  fetchDataFromPostAPI(`${host}api/a1/exams`, { user_result: result })
    .then((questions) => {
      var data = questions.data;
      console.log("***questions", data);
      num_law = 0;
      num_board = 0;
      num_figure = 0;

      var count = 0,
        html_question_list = "";
      num_law = data.traffic_law.length;
      data.traffic_law.forEach((law_i, i) => {
        count += 1;
        html_question_list += showOneQuestion(law_i, count, "law");
        temp_question_ids.push(count);
        temp_question_numbers.push(law_i.number);
      });

      num_board = data.notice_board.length;
      data.notice_board.forEach((board_i, i) => {
        count += 1;
        html_question_list += showOneQuestion(board_i, count, "board");
        temp_question_ids.push(count);
        temp_question_numbers.push(board_i.number);
      });

      num_figure = data.figure.length;
      data.figure.forEach((figure_i, i) => {
        count += 1;
        html_question_list += showOneQuestion(figure_i, count, "figure");
        temp_question_ids.push(count);
        temp_question_numbers.push(figure_i.number);
      });

      document
        .querySelector(".exam-question-list")
        .insertAdjacentHTML("beforeend", html_question_list);

      /*/show main_content.exam-info
      examInfo.classList.remove("hidden");*/
      showOneInfoDiv(infoList, examInfo);
      header.classList.add("hidden");

      questionBoxList = document.querySelectorAll(".exam-question-box");

      // Add event listener for btn-option (when user select an answer)
      var questionBoxArr = [...questionBoxList]; // converts NodeList to Array
      questionBoxArr.forEach((box) => {
        box.addEventListener("click", function (e) {
          e.preventDefault();

          // Check if select a button
          if (e.target.classList.contains("btn-option")) {
            // console.log("btn clicked:", e.target);
            var q_number, q_id, q_option;

            // Find the question's number and id
            e.target.classList.forEach((className, i) => {
              // console.log("className:", className);
              if (className.includes("number")) {
                q_number = className.split("--")[1];
              } else if (className.includes("id")) {
                q_id = className.split("--")[1];
              } else if (className.includes("option")) {
                q_option = className.split("--")[1];
              }
            });

            // Remove 'selected' from all buttons of the same question, and then add the new selected one
            var btnList = document.querySelectorAll(
              `.btn-option.question-id--${q_id}.question-number--${q_number}`
            );
            btnList.forEach((btn) => {
              btn.classList.remove("selected");
            });
            e.target.classList.add("selected"); //add for the new selected one
          }
        });
      });
    })
    .catch((err) => {
      // Do something for an error here
      const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
      console.log(`Error Reading data at line ${lineno}: ${err}`);
    });
};

// Function creating DOM elements displaying exam points at main_content
const showPoints = function (point, statistics) {
  // Empty the content
  document.querySelector(".exam-answer-point").innerHTML = "";

  var html_point_info = "";
  html_point_info += `
    <div class="title">
        <div class="title--1">Số điểm của bạn là:</div>
        <div class="title--2">${point}/20</div>
    </div>
    <div class="statistics">
        <table class="statistics-table">
            <tr>
                <th class="column--1">Loại câu hỏi</th>
                <th class="column--2">Số điểm</th>
            </tr>
            <tr>
                <td>Luật giao thông</td>
                <td class="column--2">${statistics.law}/${num_law}</td>
            </tr>
            <tr>
                <td>Biển báo</td>
                <td class="column--2">${statistics.board}/${num_board}</td>
            </tr>
            <tr>
                <td>Sa hình</td>
                <td class="column--2">${statistics.figure}/${num_figure}</td>
            </tr>
        </table>
    </div>
    <hr>`;
  document
    .querySelector(".exam-answer-point")
    .insertAdjacentHTML("beforeend", html_point_info);
};

// Function generate statistics for full answers
const getStatistics = function (full_result) {
  var point_law = 0,
    point_board = 0,
    point_figure = 0,
    total_law = 0,
    total_board = 0,
    total_figure = 0;

  console.log("full_result", full_result);
  full_result.forEach((res) => {
    if (res.type === "law") {
      total_law += 1;
      if (res.status === "correct") {
        point_law += 1;
      }
    }
    if (res.type === "board") {
      total_board += 1;
      if (res.status === "correct") {
        point_board += 1;
      }
    }
    if (res.type === "figure") {
      total_figure += 1;
      if (res.status === "correct") {
        point_figure += 1;
      }
    }
  });
  return {
    law: point_law,
    board: point_board,
    figure: point_figure,
    total_law: total_law,
    total_board: total_board,
    total_figure: total_figure,
  };
};

// Function creating DOM elements displaying 20 exam answers at main_content
const showAnswers = function (result) {
  // Empty the content
  document.querySelector(".exam-answer-list").innerHTML = "";
  fetchDataFromPostAPI(`${host}api/a1/points`, { user_result: result })
    .then((answers) => {
      console.log("*MY RESULT:", result);
      var data = answers.data;
      console.log("*Answers", data);

      var count = 0,
        html_answer_list = "";
      data.exams.forEach((answer_i, i) => {
        count += 1;
        html_answer_list += showOneAnswer(answer_i[0], count);
      });

      document
        .querySelector(".exam-answer-list")
        .insertAdjacentHTML("beforeend", html_answer_list);

      /*/show main_content.exam-info
      examInfo.classList.remove("hidden");*/
      showOneInfoDiv(infoList, answerInfo);
      header.classList.add("hidden");
    })
    .catch((err) => {
      // Do something for an error here
      const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
      console.log(`Error Reading data at line ${lineno}: ${err}`);
    });
};

// Count number of correct answer of the result
const countCorrectAnswers = function (full_result) {
  var count = 0;
  full_result.forEach((res, i) => {
    if (res.status === "correct") {
      count += 1;
    }
  });
  return count;
};
// /****funcion random***/
const randomAnswers = function (questions_numbers) {
  var randomResult = [];
  questions_numbers.forEach((ques) => {
    randomResult.push({
      number: ques,
      answer: 1,
    });
  });
  return randomResult;
};
const randomAnswersWithType = function (questions_numbers) {
  var randomResult = [];
  questions_numbers.forEach((ques) => {
    randomResult.push({
      number: ques,
      answer: 1,
      type: "law",
    });
  });
  return randomResult;
};
const randomFullAnswers = function (questions_numbers) {
  var randomResult = [];
  questions_numbers.forEach((ques) => {
    randomResult.push({
      number: ques,
      answer: 1,
      type: "law",
      status: "correct",
    });
  });
  return randomResult;
};

/////////////////////////////////////////////////////////
// *Scripts

// **Add chapter numbers and their rule numbers to the navigation bar
fetchDataFromAPI(host + "api/law_chapter/list")
  .then((chapterList) => {
    chapterList.data.forEach(function (chapData) {
      // Add to navigation
      var html1 = `<li class="chapter chapter--${chapData.number} hidden">
                          <div class="chapter">
                              <i class="far fa-caret-square-down icon--${chapData.number}"></i>
                              <a href="#" class="chapter chapter--${chapData.number} open-link">Chương ${chapData.number}</a>
                              <ul class="rule ruleList--${chapData.number} hidden">
                              </ul>
                          </div>
                      </li>`;
      navLaw.insertAdjacentHTML("beforeend", html1);

      var html2 = "";
      var ruleNum = 1;
      chapData.rules.forEach(function (rule) {
        html2 += `<li>
                    <a href="#" class="rule rule--${rule} open-link">
                      <i class="fas fa-book fa-lg"></i>
                      Điều ${rule}
                    </a>
                  </li>`;
      });

      var chapDiv = document.querySelector(`.chapter--${chapData.number}`);
      var ruleListDiv = document.querySelector(`.ruleList--${chapData.number}`);
      ruleListDiv.insertAdjacentHTML("beforeend", html2);

      /// Add event listener to expand the chapter list in the navigation bar
      navLaw.addEventListener("click", function (e) {
        e.preventDefault();

        //Checking if we click the nav-name "Luật"
        if (e.target.classList.contains("nav-name")) {
          chapDiv.classList.toggle("hidden");

          // Show law-info
          showOneInfoDiv(infoList, lawInfo);

          // Show header
          header.classList.remove("hidden");

          /*
          // Unhide the main content info of law
          lawInfo.classList.remove("hidden");
          // Hide the main content info of fine
          fineInfo.classList.add("hidden");
          // Hide the main content info of before exam
          beforeExamInfo.classList.add("hidden");
          // Hide the main content info of exam
          examInfo.classList.add("hidden");*/
        }
      });
    });
  })
  .catch((err) => {
    // Do something for an error here
    const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
    console.log(`Error Reading data at line ${lineno}: ${err}`);
  });

// **Add event listener to the Law ("Luật") navigation bar
// 1) If select the expand icon of the chapter -> show the rule list of that chapter at the navigation bar
// 2) If select the chapter -> show the content of that chapter (including all of its rules) at the main content section
// 3) If select the rule -> show the content of that rule at the main content section
// 4) Highlight the selected element at nav
navLaw.addEventListener("click", function (e) {
  e.preventDefault();
  //console.log("e.target", e.target);

  var targetID = "";
  // Find the chapter id
  Array.from(e.target.classList).forEach((elem) => {
    if (elem.includes("--")) {
      targetID = elem.split("--")[1];
    }
  });

  var ruleListToExpand = document.querySelector(`.ruleList--${targetID}`);

  //1) Checking if we click the expand icon of the chapter (nav)
  // -> Expand/Close the rule list of the chapter
  if (e.target.classList.contains("far")) {
    ruleListToExpand.classList.toggle("hidden");
  }

  //2) If we click the chapter name (nav)
  //-> Show all rules of a chapter in the main_content
  if (
    e.target.classList.contains("chapter") &&
    e.target.classList.contains("open-link")
  ) {
    //Get data of one chapter base on chapter number
    fetchDataFromAPI(`${host}api/law_chapter/getNumber?number=${targetID}`)
      .then((output) => {
        let chapterInfo = output.data[0];
        if (chapterInfo) {
          document.querySelector(".law-parent").innerHTML = ""; //reset parent to empty
          document
            .querySelector(".law-parent")
            .insertAdjacentHTML(
              "beforeend",
              `Chương ${chapterInfo.number} - ${chapterInfo.name}`
            ); //display chapter (parent)
          document.querySelector(".law-card").innerHTML = ""; //reset card to empty
          var ruleDesc = "";
          chapterInfo.rules.forEach((ruleNumber) => {
            //Get data of one rule base on rule number
            fetchDataFromAPI(
              `${host}api/law_rule/getNumber?number=${ruleNumber}`
            )
              .then((output) => {
                let ruleData = output.data[0];
                if (ruleData) {
                  showOneRule(ruleData);
                }
              })
              .catch((err) => {
                // Do something for an error here
                const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
                console.log(`Error Reading data at line ${lineno}: ${err}`);
              });
          });

          //Add class "opened" for selected chapter at nav (highlight selected element at nav)
          document.querySelectorAll(`.open-link`).forEach((elem) => {
            elem.classList.remove("opened");
          }); //remove if already have
          document
            .querySelector(`.chapter--${targetID}.open-link`)
            .classList.toggle("opened");
        }
      })
      .catch((err) => {
        // Do something for an error here
        const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
        console.log(`Error Reading data at line ${lineno}: ${err}`);
      });
  }

  //3) If we click the rule name
  //-> Show 1 rule in the main_content
  if (
    e.target.classList.contains("rule") &&
    e.target.classList.contains("open-link")
  ) {
    // Show law-info
    showOneInfoDiv(infoList, lawInfo);
    // Show header
    header.classList.remove("hidden");

    /*// Unhide the main content info of law
    lawInfo.classList.remove("hidden");
    // Hide the main content info of fine
    fineInfo.classList.add("hidden");
    // Hide the main content info of before exam
    beforeExamInfo.classList.add("hidden");
    // Hide the main content info of exam
    examInfo.classList.add("hidden");*/

    //Get data of one rule base on rule number
    fetchDataFromAPI(`${host}api/law_rule/getNumber?number=${targetID}`)
      .then((output) => {
        let ruleData = output.data[0];
        if (ruleData) {
          //Find the chapter name
          ////Get data of one chapter base on chapter number from the rule
          fetchDataFromAPI(
            `${host}api/law_chapter/getNumber?number=${ruleData.chapter}`
          )
            .then((output) => {
              let chapterInfo = output.data[0];
              document.querySelector(".law-parent").innerHTML = ""; //reset parent to empty
              document
                .querySelector(".law-parent")
                .insertAdjacentHTML(
                  "beforeend",
                  `Chương ${ruleData.chapter} - ${chapterInfo.name}`
                );
            })
            .catch((err) => {
              // Do something for an error here
              const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
              console.log(`Error Reading data at line ${lineno}: ${err}`);
            });

          document.querySelector(".law-card").innerHTML = ""; //reset card to empty
          var ruleDesc = "";
          showOneRule(ruleData);
        }
      })
      .catch((err) => {
        // Do something for an error here
        const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
        console.log(`Error Reading data at line ${lineno}: ${err}`);
      });

    //Add class "opened" for selected rule at nav
    document.querySelectorAll(`.open-link`).forEach((elem) => {
      elem.classList.remove("opened");
    }); //remove if already have
    document
      .querySelector(`.rule--${targetID}.open-link`)
      .classList.toggle("opened");
  }
});

// **Add event listener to the Fine ("Mức phạt") navigation bar
// 1) If we click the nav-name "Mức phạt"
// -> Show/Hide its ul, hide other info, show header & fine-info with filter fines
navFine.addEventListener("click", function (e) {
  // 1) If we click the nav-name "Mức phạt"
  if (e.target.classList.contains("nav-name")) {
    document.querySelector(".nav-option").classList.toggle("hidden");

    /*lawInfo.classList.add("hidden"); //hide main_content.law-info
    beforeExamInfo.classList.add("hidden"); //hide main_content.before-exam-info
    examInfo.classList.add("hidden"); //hide main_content.exam-info*/

    header.classList.remove("hidden"); //show header

    //show main_content.fine-info with filter fines
    showFines(selectedVehicle, selectedAviolation);
    // Show fine-info
    showOneInfoDiv(infoList, fineInfo);
  }
});

// 2) Choose 1 in 3 vehicles (liVehicle) -> Update main_content
// 3) Choose 1 in 7 aviolation (liAviolation) -> Update main_content
liVehicle.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("e.target:", e.target);

  var targetID_vehicle = "";
  // Find the target type/aviolation
  Array.from(e.target.classList).forEach((elem) => {
    if (elem.includes("--")) {
      targetID_vehicle = elem.split("--")[1];
    }
  });
  console.log("targetID_vehicle:", targetID_vehicle);

  if (
    e.target.classList.contains("fine-vehicle-button") ||
    e.target.classList.contains("fine-vehicle-i") ||
    e.target.classList.contains("fine-vehicle-a")
  ) {
    // Reset all before add
    for (var button of document.querySelectorAll(".fine-vehicle-button")) {
      button.classList.remove("selected");
    }
    for (var a of document.querySelectorAll(".fine-vehicle-a")) {
      a.classList.remove("selected");
    }
    for (var i of document.querySelectorAll(".fine-vehicle-i")) {
      i.classList.remove("selected");
    }

    document
      .querySelector(`.fine-vehicle-button.fine-vehicle--${targetID_vehicle}`)
      .classList.toggle("selected");
    document
      .querySelector(`.fine-vehicle-a.fine-vehicle--${targetID_vehicle}`)
      .classList.toggle("selected");
    document
      .querySelector(`.fine-vehicle-i.fine-vehicle--${targetID_vehicle}`)
      .classList.toggle("selected");

    selectedVehicle = targetID_vehicle;

    // Show filtered fines at main_content
    // Aviolation "MUST" be selected
    if (selectedAviolation != "") {
      showFines(selectedVehicle, selectedAviolation);
    }
    // Show fine-info
    showOneInfoDiv(infoList, fineInfo);
    // Show the header
    header.classList.remove("hidden");

    /*/// Hide the main content info of law
    lawInfo.classList.add("hidden");
    // Hide the main content info of before exam
    beforeExamInfo.classList.add("hidden");
    // Hide the main content info of exam
    examInfo.classList.add("hidden");

    //// Unhide the main content info of fine
    fineInfo.classList.remove("hidden");*/
  }
});

liAviolation.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("e.target:", e.target);

  var targetID_aviolation = "";
  // Find the target type/aviolation
  Array.from(e.target.classList).forEach((elem) => {
    if (elem.includes("--")) {
      targetID_aviolation = elem.split("--")[1];
    }
  });
  console.log("targetID_aviolation:", targetID_aviolation);

  if (
    e.target.classList.contains("fine-aviolation-button") ||
    e.target.classList.contains("fine-aviolation-i") ||
    e.target.classList.contains("fine-aviolation-a")
  ) {
    // Reset all before add
    for (var button of document.querySelectorAll(".fine-aviolation-button")) {
      button.classList.remove("selected");
    }
    for (var a of document.querySelectorAll(".fine-aviolation-a")) {
      a.classList.remove("selected");
    }
    for (var i of document.querySelectorAll(".fine-aviolation-i")) {
      i.classList.remove("selected");
    }
    document
      .querySelector(
        `.fine-aviolation-button.fine-aviolation--${targetID_aviolation}`
      )
      .classList.toggle("selected");
    document
      .querySelector(
        `.fine-aviolation-a.fine-aviolation--${targetID_aviolation}`
      )
      .classList.toggle("selected");
    document
      .querySelector(
        `.fine-aviolation-i.fine-aviolation--${targetID_aviolation}`
      )
      .classList.toggle("selected");

    selectedAviolation = targetID_aviolation;

    // Show filtered fines at main_content
    // Aviolation "MUST" be selected
    if (selectedAviolation != "") {
      showFines(selectedVehicle, selectedAviolation);
    }

    // Show fine-info
    showOneInfoDiv(infoList, fineInfo);
    // Show the header
    header.classList.remove("hidden");

    /*/// Hide the main content info of law
    lawInfo.classList.add("hidden");
    // Hide the main content info of before exam
    beforeExamInfo.classList.add("hidden");
    // Hide the main content info of exam
    examInfo.classList.add("hidden");

    //// Unhide the main content info of fine
    fineInfo.classList.remove("hidden");*/
  }
});

// **Add event listener to the Exam ("Đề thi bằng lái A1") at the navigation bar
// If we click the nav-name "Đề thi bằng lái A1"
// -> Hide header & other info, show main_content.before-exam-info
navExam.addEventListener("click", function (e) {
  // If we click the nav-name "Đề thi bằng lái A1"
  // Reset result
  temp_result = [];
  temp_result_with_type = [];
  temp_question_numbers = [];
  temp_question_ids = [];
  temp_answer_ids = [];
  temp_statistics = [];
  num_law = 0;
  num_board = 0;
  num_figure = 0;

  if (e.target.classList.contains("nav-name")) {
    // document.querySelector(".nav-option").classList.toggle("hidden");

    // Show main_content.before-exam-info
    showOneInfoDiv(infoList, beforeExamInfo);

    // Hide header
    header.classList.add("hidden");

    /*lawInfo.classList.add("hidden"); //hide main_content.law-info
    fineInfo.classList.add("hidden"); //hide main_content.fine-info
    examInfo.classList.add("hidden"); //hide main_content.exam-info

    beforeExamInfo.classList.remove("hidden");*/
  }
});

// **Add event listener to the button start-exam ("Làm bài")
// -> Hide other info, show main_content.exam-info with exam questions
btnStartExam.addEventListener("click", function (e) {
  /*lawInfo.classList.add("hidden"); //hide main_content.law-info
  fineInfo.classList.add("hidden"); //hide main_content.fine-info
  beforeExamInfo.classList.add("hidden"); //hide main_content.before-exam-info*/

  temp_result = [];
  temp_result_with_type = [];
  temp_question_numbers = [];
  temp_question_ids = [];
  temp_answer_ids = [];
  temp_statistics = [];
  num_law = 0;
  num_board = 0;
  num_figure = 0;

  // Generate questions
  showExamAndAddButtonEvents();
});

// **Add event listener to the list of answer options (exam-question-options-ul)
// ulExamOptionsAll.forEach((ul, id) => {
//   console.log(`ul: ${ul}`);
//   ul.addEventListener("click", function (e) {
//     e.preventDefault();

//     // Check if select the button
//     if (e.target.classList.contains("btn-option")) {
//       console.log(`Selected:${e.target}`);
//       e.target.classList.toggle("selected");
//     }
//   });
// });

btnCancelExam.addEventListener("click", function (e) {
  if (confirm("Bạn muốn hủy bài làm?")) {
    showOneInfoDiv(infoList, beforeExamInfo);
    temp_result = [];
    temp_result_with_type = [];
    temp_answer_ids = [];
    temp_statistics = [];
    num_law = 0;
    num_board = 0;
    num_figure = 0;
  }
});

btnSubmitExam.addEventListener("click", function (e) {
  // var result = [],
  //   result_with_type = [];
  temp_result = [];
  temp_result_with_type = [];
  temp_answer_ids = [];
  temp_statistics = [];
  temp_full_result = [];

  // Find all buttons has 'selected' class name -> list of answers
  var selectedBtns = [...document.querySelectorAll(".btn-option.selected")];
  console.log("selectedBtns:", selectedBtns);
  selectedBtns.forEach((btn) => {
    var q_number, q_id, q_option, q_type;
    console.log("btn.classList:", btn.classList);
    // Find the question's number and id
    btn.classList.forEach((className, i) => {
      // console.log("className:", className);
      if (className.includes("number")) {
        q_number = className.split("--")[1];
      } else if (className.includes("id")) {
        q_id = className.split("--")[1];
      } else if (className.includes("option")) {
        q_option = className.split("--")[1];
      } else if (className.includes("type")) {
        q_type = className.split("--")[1];
      }
    });
    // Add to the list of result
    temp_result.push({
      number: parseInt(q_number),
      answer: parseInt(q_option),
    });
    temp_result_with_type.push({
      number: parseInt(q_number),
      answer: parseInt(q_option),
      type: q_type,
    });
    temp_answer_ids.push(parseInt(q_id));
  });

  //*****/
  // temp_result = randomAnswers(temp_question_numbers);
  // temp_result_with_type = randomAnswersWithType(temp_question_numbers);
  // temp_full_result = randomFullAnswers(temp_question_numbers);

  console.log("temp_result:", temp_result);
  console.log("temp_result.length:", temp_result.length);

  if (temp_result.length === 20) {
    // temp_result = result; //current result

    // Add the history
    history_results.push(temp_result);

    if (confirm("Bạn muốn nộp bài?")) {
      fetchDataFromPostAPI(`${host}api/a1/points`, { user_result: temp_result })
        .then((res) => {
          console.log("Request complete! response:", res);
          var data = res.data;
          console.log(`Điểm = ${data.points}`);
          showOneInfoDiv(infoList, answerInfo);

          temp_correct = [];
          data.exams.forEach((elem) => {
            temp_correct.push({
              number: elem[0].number,
              answer: elem[0].right_answer,
              type: switchQuestionClassType2(elem[0].class),
            });
          });

          temp_result_with_type.forEach((elem) => {
            var q_status = checkAnswer(temp_correct, {
              number: elem.number,
              answer: elem.answer,
            });
            temp_full_result.push({
              number: elem.number,
              answer: elem.answer,
              type: elem.type,
              status: q_status,
            });
          });
          history_full_results.push(temp_full_result);
          console.log("correct", temp_correct);
          console.log("my", temp_result);

          showAnswers(temp_result);
          temp_statistics = getStatistics(temp_full_result);
          history_statistics.push(temp_statistics);
          showPoints(data.points, temp_statistics);
          console.log("temp_statistics", temp_statistics);
        })
        .catch((err) => {
          // Do something for an error here
          const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
          console.log(`Error Reading data at line ${lineno}: ${err}`);
        });
    }
  } else if (temp_result.length >= 0 && temp_result.length < 20) {
    alert(
      `Bạn chưa hoàn thành bài thi (câu ${[
        ...getMissing(temp_question_ids, temp_answer_ids),
      ]})!`
    );
  }
});

btnContinueExam.addEventListener("click", function (e) {
  if (confirm("Bạn muốn tiếp tục?")) {
    window.scrollTo(0, 0);

    temp_result = [];
    temp_result_with_type = [];
    temp_question_numbers = [];
    temp_question_ids = [];
    temp_answer_ids = [];

    // Generate questions
    showExamAndAddButtonEvents();
  }
});

btnCheckHistoryExam.addEventListener("click", function (e) {
  console.log("history_results:", history_results);
  console.log("history_full_results:", history_full_results);
  console.log("history_statistics:", history_statistics);
  if (confirm("Bạn muốn xem lịch sử làm bài?")) {
    showOneInfoDiv(infoList, historyInfo);

    historyInfo.innerHTML = "";

    var html_history = "";
    html_history += `
    <table class="statistics-table">
      <tr class="parent">
          <th class="parent column--1">Lần</th>
          <th class="parent column--2">Tổng điểm</th>
          <th class="parent column--3">Thống kê</th>
      </tr>`;

    history_full_results.forEach((res, i) => {
      html_history += `
      <tr class="parent">
          <td class="parent column--1">${i + 1}</td>
          <td class="parent column--2">${countCorrectAnswers(res)}/20</td>
          <td class="parent column--3">
              <table class="statistics-sub-table">
                  <tr>
                      <th class="column--1-1">Loại câu hỏi</th>
                      <th class="column--1-2">Số điểm</th>
                  </tr>
                  <tr>
                      <td>Luật giao thông</td>
                      <td>
                      ${history_statistics[i].law}/${
        history_statistics[i].total_law
      }
                      </td>
                  </tr>
                  <tr>
                      <td>Biển báo</td>
                      <td>
                      ${history_statistics[i].board}/${
        history_statistics[i].total_board
      }
                      </td>
                  </tr>
                  <tr>
                      <td>Sa hình</td>
                      <td>
                      ${history_statistics[i].figure}/${
        history_statistics[i].total_figure
      }
                      </td>
                  </tr>
              </table>
          </td>
      </tr>
      `;
    });
    html_history += `</table>`;
    historyInfo.insertAdjacentHTML("beforeend", html_history);
  }
});
// var answers = {
//   user_result: [
//     { number: 10, answer: 2 },
//     { number: 20, answer: 2 },
//     { number: 30, answer: 2 },
//     { number: 40, answer: 2 },
//     { number: 50, answer: 2 },
//     { number: 60, answer: 2 },
//     { number: 70, answer: 2 },
//     { number: 80, answer: 2 },
//     { number: 90, answer: 2 },
//     { number: 100, answer: 2 },
//     { number: 110, answer: 2 },
//     { number: 120, answer: 2 },
//     { number: 130, answer: 2 },
//     { number: 140, answer: 2 },
//     { number: 150, answer: 2 },
//     { number: 160, answer: 2 },
//     { number: 170, answer: 2 },
//     { number: 180, answer: 2 },
//     { number: 190, answer: 2 },
//     { number: 199, answer: 2 },
//   ],
// };
// var answers = {
//   user_result: [],
// };
// console.log("answers:", answers);
// console.log(`host: ${host}api/a1/points`);
// fetchDataFromPostAPI(`${host}api/a1/points`, answers)
//   .then((res) => {
//     console.log("Request complete! response:", res);
//   })
//   .catch((err) => {
//     // Do something for an error here
//     const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
//     console.log(`Error Reading data at line ${lineno}: ${err}`);
//   });
