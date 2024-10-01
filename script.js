//const pWords = document.querySelector(".p-words")

let timer = 120

let skipNumCount = 2

let points = 0
let redPoints = 0

var timerInterval = null

let player = "blue"

$(document).ready(function() {
    
    $("#btnStartGame").click(startGame)
    
    $("#skip").click(function() {
        skipLogic()
    })

    $("#error").click(function() {
        setResult("error")
        pickCard(player)
        //pickCard("card")
    })

    $("#correct").click(function() {
        correctLogic()
    })

    $("#btnChangeTurn").click(function () {
        if(player === "red") {
            summary()
        } else {
            newTurn()
        timer = 120
        timerInterval = setInterval(countdown, 1000)
        player = "red"
        pickCard(player)
        }
    })

    $("#btnPlayAgain").click(() => location.reload())
})

function startGame() {
    $("#container-1").css("display", "flex")
    $("#pregame-container").css("display", "none")
    clearPlayerTables()
    timerInterval = setInterval(countdown,1000)
    //pickCard("card")
    pickCard(player)
}

function skipLogic() {
    setResult("skipped")
    skipNumCount--
    $("#skip-num").text(skipNumCount)
    if(skipNumCount === 0) {
        $("#skip").css("pointerEvents", "none")
        $("#skip").css("filter", "brightness(0.25)")
    }
    //pickCard("card")
    pickCard(player)
}

function correctLogic() {
    setResult("correct")
    //pickCard("card")
    pickCard(player)
    if(player == "blue") {
        points++
        $("#turn-points").text(points)
    } else {
        redPoints++
        $("#turn-points").text(redPoints)
    }
    nextCard()
}

function pickCard(turn) {
    clearCard()
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            const arr = JSON.parse(this.responseText)
            console.log(arr[0].word)
            console.log(arr[0].prohibited.split(","))
            
            $(".guess").text(arr[0].word.toUpperCase())
            arr[0].prohibited.split(",").forEach(pWord => {
                let div = $('<div/>',{
                    text: pWord.toUpperCase(),
                    class: 'p-word fl-full-center'
                }).appendTo('.p-words');
                /*let div = document.createElement("div")
                pWords.appendChild(div)
                div.innerText = pWord.toUpperCase()
                div.classList.add("p-word", "fl-full-center")*/
            })
        }
    }
    xhr.open("GET", `functions.php?q=${turn}`)
    xhr.send()
}

function clearCard() {
    $(".guess").text("")
    /*while (pWords.firstChild) {
        pWords.removeChild(pWords.lastChild);
    }*/
    $(".p-words").empty()
}

function nextCard() {
    $(".card").hide()
    $(".card").show("slow")
}

//X schermata riepilogo
function getAllCards(player) {
    let tab = ""
    if(player == "blue") {
        tab = "p1All"
        $(".turn").text("TURNO BLU")
    } else {
        tab = "p2All"
        $(".turn").text("TURNO ROSSO")
    }
    $.ajax({
        type: "GET",
        url: `functions.php?q=${tab}`,
        success: function (data) {
            const arr = JSON.parse(data)
            console.log(arr)
            //console.log(JSON.parse(data))
            arr.forEach(function(row) {
                let card = $('<article/>', {
                    class: 'card'
                }).appendTo('#results-container')
                let guess = $('<div/>',{
                    text: row["word"].toUpperCase(),
                    class: 'guess fl-full-center'
                }).appendTo(card)
                let pWords = $('<div/>', {
                    class: 'p-words fl-full-center'
                }).appendTo(card)
                row.prohibited.split(",").forEach(pWord => {
                    let div = $('<div/>',{
                        text: pWord.toUpperCase(),
                        class: 'p-word fl-full-center'
                    }).appendTo(pWords)
                })
                let classToAdd = ""
                let idToAdd = ""
                switch(row.status) {
                    case "correct":
                        classToAdd = 'status'
                        idToAdd = 'status-correct'
                        break;
                    case "error":
                        classToAdd = 'status'
                        idToAdd = 'status-error'
                        break;
                    case "skipped":
                        classToAdd = 'status'
                        idToAdd = 'status-skipped'
                        break;
                    default:
                        console.log("unfinished")
                }
                let displayStatus = $('<div/>', {
                    text: '',
                    class: classToAdd,
                    id: idToAdd
                }).appendTo(card)
            })
        }
    })
}

//X modificare status tessera in db
function setResult(result) {
    let table = ""
    if (player == "blue") {
        table = "p1_words"
    } else {
        table = "p2_words"
    }
    let word = ""
    word = $(".guess").text().charAt(0) + $(".guess").text().substring(1).toLowerCase()
    console.log(word)
    $.ajax({
        type: "POST",
        url: "functions.php",
        data: {
            "word" : word,
            "result" : result,
            "table" : table
        }
    })
}

function countdown() {
    timer--
    $("#timer").text(timer)
    if(timer <= 10) {
        $("#timer").css({
            "color": "red",
            "border-color": "red"
        })
    }
    if(timer === 0) {
        clearCountdown()
        displayResults()
    }
}

function clearCountdown() {
    clearInterval(timerInterval)
}

function clearPlayerTables() {
    let p1Table = "p1_words"
    let p2Table = "p2_words"
    $.ajax({
        type:"POST",
        url: "functions.php",
        data: {
            "table1" : p1Table,
            "table2" : p2Table
        }
    })
}

function displayResults() {
    $("#container-1").css('display', 'none')
    $("#container-2").css('display', 'flex')
    if(player === "blue") {
        $(".final-score").text(`Punteggio: ${points}`)
    } else {
        $(".final-score").text(`Punteggio: ${redPoints}`)
        $("#btnChangeTurn").text("RIEPILOGO")
    }
    getAllCards(player)
}

function newTurn() {
    $("#container-2").css('display', 'none')
    $("#container-1").css('display', 'flex')
    $('#results-container').empty()
    if(player === "blue") {
        $(".turn").html('TURNO ROSSO<span id="turn-points">0</span>').css("background", "var(--p2-color)")
    }
    skipNumCount = 2
    $("#skip-num").text(skipNumCount)
    $("#skip").css({
        "pointerEvents": "auto",
        "filter": "brightness(1)"
    })
    $("#timer").css({
        "text": "120",
        "color": "#F4F3F2",
        "border-color": "#000"
    })
}

function summary() {
    $("#container-2").css('display', 'none')
    $("#container-3").css('display', 'flex')
    if(points == redPoints) {
        $("#winner").text("PAREGGIO")
    } else if(points < redPoints) {
        $("#winner").text("VINCE LA SQUADRA ROSSA")
    } else {
        $("#winner").text("VINCE LA SQUADRA BLU")
    }
    $("#blue-final-points").text(points)
    $("#red-final-points").text(redPoints)
}