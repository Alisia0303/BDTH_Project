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

// *DOM elements
// Navigation bar
const navLaw = document.querySelector(".nav-law");
const navFine = document.querySelector(".nav-fine");

/////////////////////////////////////////////////////////
// *Data objects
const host = "http://localhost:3001/";
const showOneRule = function (ruleInfo) {
  var html3 = `<div class="card-info info--${ruleInfo.number}">
                    <p class="card-title card-title--${ruleInfo.number}">Điều ${ruleInfo.number}: ${ruleInfo.name}</p>
                    <p class="card-content card-content--${ruleInfo.number}">
                    </p>
                </div>`;
  document.querySelector(".card").insertAdjacentHTML("beforeend", html3);
  let ruleDesc = "";
  ruleInfo.content.forEach((ruleRow) => {
    ruleDesc += ruleRow + " <br>";
  });
  document.querySelector(`.card-content--${ruleInfo.number}`).innerHTML =
    ruleDesc;
};

/////////////////////////////////////////////////////////
// *Scripts

// Add chapter numbers and their rule numbers to the navigation bar
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

      var html2 = "<li>";
      var ruleNum = 1;
      chapData.rules.forEach(function (rule) {
        html2 += `<a href="#" class="rule rule--${rule} open-link"><i class="fas fa-traffic-light"></i>Điều ${rule}</a>`;
      });
      html2 += "</li>";

      var chapDiv = document.querySelector(`.chapter--${chapData.number}`);
      var ruleListDiv = document.querySelector(`.ruleList--${chapData.number}`);
      ruleListDiv.insertAdjacentHTML("beforeend", html2);

      /// Add event listener to expand the chapter list in the navigation bar
      navLaw.addEventListener("click", function (e) {
        e.preventDefault();

        //Checking if we click the nav-name "Luật"
        if (e.target.classList.contains("nav-name")) {
          chapDiv.classList.toggle("hidden");
        }
      });
    });
  })
  .catch((err) => {
    // Do something for an error here
    const [, lineno, colno] = err.stack.match(/(\d+):(\d+)/);
    console.log(`Error Reading data at line ${lineno}: ${err}`);
  });

// Add event listener to the Law navigation bar
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
          document.querySelector(".parent").innerHTML = ""; //reset parent to empty
          document
            .querySelector(".parent")
            .insertAdjacentHTML(
              "beforeend",
              `Chương ${chapterInfo.number} - ${chapterInfo.name}`
            ); //display chapter (parent)
          document.querySelector(".card").innerHTML = ""; //reset card to empty
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
              document.querySelector(".parent").innerHTML = ""; //reset parent to empty
              document
                .querySelector(".parent")
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

          document.querySelector(".card").innerHTML = ""; //reset card to empty
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
