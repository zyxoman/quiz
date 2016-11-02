/*-----------------------------------------------------
  REQUIRE
-------------------------------------------------------*/
var yo       = require('yo-yo')
var csjs     = require('csjs-inject')
var minixhr  = require('minixhr')
var chart    = require('chart.js')
/*-----------------------------------------------------
  THEME
-------------------------------------------------------*/
var font       = 'Days One, cursive'
var yellow     = 'hsla(235,60%,34%,1)'
var white      = 'hsla(120,24%,96%,1)'
var violet     = 'hsla(300,25%,45%,1)'
var lightBrown = 'hsla(29,21%,67%,1)'
var darkBrown  = 'hsla(63,19%,55%,1)'
var blue       = 'hsla(225,21%,41%,1)'
var red        = 'hsla(361,76%,60%,1)'
/*-----------------------------------------------------------------------------
  LOADING FONT
-----------------------------------------------------------------------------*/
var links = ['https://fonts.googleapis.com/css?family=Days+One']
var font = yo`<link href=${links[0]} rel='stylesheet' type='text/css'>`
document.head.appendChild(font)
/*-----------------------------------------------------------------------------
LOADING DATA
-----------------------------------------------------------------------------*/
var questions = [
`
Statement #1:
Darwin was right. Humans evolved from apes/monkeys.
`,
`
Statement #2:
Egyptian pyramids were built using only human power and primitive tools.
`,
`
Statement #3:
I believe in destiny. The future is destined and unchangeable.
`,
`
Statement #4:
The Earth has already been visited by alien species.
`,
`
Statement #5:
Reincarnation is true. We are eternal spiritual beings in a physical body.
`,
`
Statement #6:
The Earth, like all planets and stars, is a conscious being.
`
]
var i               = 0
var question        = questions[i]
var results         = []
var answerOptions   = [1,2,3,4,5,6]
/*-----------------------------------------------------------------------------
  QUIZ
-----------------------------------------------------------------------------*/
function quizComponent () {
  var css = csjs`
    .quiz {
      background-color: ${yellow};
      text-align: center;
      font-family: 'Days One', cursive;
      padding-bottom: 200px;
    }
    .welcome {
      font-size: 4em;
      padding: 50px;
      color: ${darkBrown}
    }
    .question {
      font-size: 2em;
      color: ${white};
      padding: 40px;
      margin: 0 5%;
    }
    .answers {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin: 0 5%;
    }
    .answer {
      background-color: ${violet};
      padding: 15px;
      margin: 5px;
      border: 2px solid ${white};
      border-radius: 30%;
    }
    .answer:hover {
      background-color: ${lightBrown};
      cursor: pointer;
    }
    .instruction {
      color: ${violet};
      font-size: 1.5em;
      margin: 0 15%;
      padding: 20px;
    }
    .results {
      background-color: ${white};
      text-align: center;
      font-family: 'Days One', cursive;
      padding-bottom: 200px;
    }
    .resultTitle{
      font-size: 4em;
      padding: 50px;
      color: ${blue}
    }
    .back {
      display: flex;
      justify-content: center;
    }
    .backImg {
      height: 30px;
      padding: 5px;
    }
    .backText {
      color: ${white};
      font-size: 25px;
    }
    .showChart {
      font-size: 2em;
      color: ${violet};
      margin: 35px;
    }
    .showChart:hover {
      color: ${red};
      cursor: pointer;
    }
    .myChart {
      width: 300px;
      height: 300px;
    }
  `

  function template () {
    return yo`
      <div class="${css.quiz}">
        <div class="${css.welcome}">
          Welcome to my quiz!
        </div>
        <div class="${css.question}">
          ${question}
        </div>
        <div class="${css.answers}">
          ${answerOptions.map(x=>yo`<div class="${css.answer}" onclick=${nextQuestion(x)}>${x}</div>`)}
        </div>
        <div class="${css.instruction}">
          Choose how strongly do you agree with the statement<br>
          (1 - don't agree at all, 6 - completely agree)
        </div>
           <div class="${css.back}" onclick=${back}>
           <img src="http://i.imgur.com/L6kXXEi.png" class="${css.backImg}">
           <div class="${css.backText}">Back</div>
        </div>
      </div>
    `
  }
  var element = template()
  document.body.appendChild(element)

  return element

  function nextQuestion(id) {
    return function () {
      if (i < (questions.length-1)) {
        results[i] = id
        i = i+1
        question = questions[i]
        yo.update(element, template())
      } else {
        results[i] = id
        sendData(results)
        yo.update(element, seeResults(results))
      }
    }
	}

  function seeResults(data) {
  var ctx = yo`<canvas class="${css.myChart}"></canvas>`
  return yo`
    <div class="${css.results}">
      <div class="${css.resultTitle}">
        Compare your answers
      </div>
        <div class="${css.showChart}" onclick=${function(){createChart(ctx, data)}}>
        Click to see the chart
      </div>
      ${ctx}
    </div>
  `
	}

  function back() {
    if (i > 0) {
      i = i-1
      question = questions[i]
      yo.update(element, template())
    }
  }

  function sendData(results) {
    var request  = {
      url          : 'https://quiz-8678d.firebaseio.com/results.json',
      method       : 'POST',
      data         : JSON.stringify(results)
    }
    minixhr(request)
  }

  function createChart(ctx, myData) {
    minixhr('https://quiz-8678d.firebaseio.com/results.json', responseHandler)
    function responseHandler (data, response, xhr, header) {
      var data = JSON.parse(data)
      var keys = Object.keys(data)
      var arrayOfAnswers = keys.map(x=>data[x])
      var stats = arrayOfAnswers.reduce(function(currentResult,answer,i) {
        var newResult=currentResult.map((x,count)=>(x*(i+1)+answer[count])/(i+2))
        return newResult
      }, myData)
      var data = {
        labels: [
          "Statement #1", "Statement #2", "Statement #3",
          "Statement #4", "Statement #5", "Statement #6"
        ],
        datasets: [
          {
            label: "My statments",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "rgba(179,181,198,1)",
            pointBackgroundColor: "rgba(179,181,198,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(179,181,198,1)",
            data: myData
          },
          {
            label: "Others statements",
            backgroundColor: "rgba(255,99,132,0.2)",
            borderColor: "rgba(255,99,132,1)",
            pointBackgroundColor: "rgba(255,99,132,1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(255,99,132,1)",
            data: stats
          }
        ]
      }
      var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: {
          scale: {
            scale: [1,2,3,4,5,6],
            ticks: {
              beginAtZero: true
            }
          }
        }
      })
    }
  }

}
quizComponent()
