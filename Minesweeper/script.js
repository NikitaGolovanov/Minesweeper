var tittle = document.createElement("h1")
tittle.innerText = "Minesweeper"
tittle.className = "tittle"

var back = document.createElement("div")
back.className = "back"

var cellsbox = document.createElement("div")
cellsbox.className = "cellsbox"

var restart = document.createElement("button")
restart.innerText = "New Game"
restart.className = "restart"

var clicksCounter = document.createElement("div")
clicksCounter.innerText = "Clicks:"
clicksCounter.className = "clicksCounter"

var flagMode = document.createElement('button')
flagMode.innerHTML = '🏳️‍🌈'
flagMode.className = 'flagMode'

var dayNight = document.createElement('button')
dayNight.innerHTML = '🌅'
dayNight.className = 'dayNight'

var music = document.createElement('button')
music.innerHTML = '🔊'
music.className = 'music'

var timer = document.createElement("div")
timer.innerText = 'Time: 0 sec'
timer.className = "timer"


var cells = []
for (let i = 0; i < 100; i++){
   cells[i] = document.createElement("button")
   cells[i].className = "cell"
}

var flagsCounter = document.createElement("div")
flagsCounter.innerText = "Flags:"
flagsCounter.className = "flagsCounter"

var MinesCounter = document.createElement("div")
MinesCounter.innerText = "Mines:"
MinesCounter.className = "MinesCounter"

var container = document.createElement('div')
container.className = 'container'

for (let i = 0; i < 100; i++){
    cellsbox.appendChild(cells[i])
}

container.appendChild(clicksCounter)
container.appendChild(timer)
container.appendChild(flagsCounter)
container.appendChild(MinesCounter)

document.body.appendChild(tittle)
document.body.appendChild(back)
document.body.appendChild(cellsbox)
document.body.appendChild(restart)
document.body.appendChild(flagMode)
document.body.appendChild(dayNight)
document.body.appendChild(music)
document.body.appendChild(container)

let winMusic = new Audio ('./assets/win.wav')
let loseMusic = new Audio ('./assets/lose.wav')
let clickMusic = new Audio ('./assets/click.wav')

let timerInterval 
var time = 0

function startTimer () {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            time++
            document.querySelector('.timer').innerText = `Time: ${time} sec` 
        },1000)
    }
}

var allCells = []
var FinalArray = []
var totalArray = []

function fillupCells (i) {
    const ArrayForBombs = Array(10).fill(1)
    const ArrayForSafe = Array(89).fill(0)
    const MainArray = ArrayForBombs.concat(ArrayForSafe)
    FinalArray = MainArray.sort(() => Math.random() - 0.5)
    FinalArray.splice(i,0,0)

    for (let i = 0; i<100; i++) {
        let total = 0
        if (FinalArray[i-11] == 1 && i % 10!= 0) total++
        if (FinalArray[i-10] == 1) total++
        if (FinalArray[i-9] == 1 && i % 10!= 9) total++
        if (FinalArray[i-1] == 1 && i % 10!= 0) total++
        if (FinalArray[i+1] == 1 && i % 10!= 9) total++
        if (FinalArray[i+9] == 1 && i % 10!= 0) total++
        if (FinalArray[i+10] == 1) total++
        if (FinalArray[i+11] == 1 && i % 10!= 9) total++
        totalArray.push(total) 
    }
}

var cellsInfo = document.getElementsByClassName('cell')
var clicks = 0
var GameStarted = false

function firstClick (i) {
    if (GameStarted) {
        click(i)
    }else {
        fillupCells(i)
        GameStarted = true
        startTimer()
        firstClick(i)
    }
}

var wasClicked = Array(100).fill(false)
var clickedCount = 0
var gameOver = false

function click (i) {
    if (gameOver) return
    if (FinalArray[i] == 1) {
        loseMusic.play()
        alert('Game over. Try again')
        gameOver = true
        return
    }
    if (wasClicked[i]) return
    if (FinalArray[i] == 0) {
        let total = totalArray[i] 
        if (total > 0) {
            wasClicked[i] = true
            cellsInfo[i].classList.add('clicked')
            clickedCount++
            if (clickedCount == 90) {
                winMusic.play()
                alert (`Hooray! You found all mines in ${time} seconds and ${clicks} moves!`)
                return
            }
            cellsInfo[i].innerText = total
            switch(total){
                case 1: cellsInfo[i].classList.add('n1')
                break
                case 2: cellsInfo[i].classList.add('n2')
                break
                case 3: cellsInfo[i].classList.add('n3')
                break
                case 4: cellsInfo[i].classList.add('n4')
                break
                case 5: cellsInfo[i].classList.add('n5')
                break
            }
            return
        }
        recursiveCheck(i)
    }
    wasClicked[i] = true
    cellsInfo[i].classList.add('clicked')
    clickedCount++
}

var flags = 0
var mines = 10

for (let i = 0; i<100; i++) {
    cellsInfo[i].addEventListener('click', () => {
        if (!flagPlace) {
            if (!wasClicked[i]) {
                clicks++
                clickMusic.play()
                document.querySelector('.clicksCounter').innerText = `Clicks: ${clicks}`
            }
            firstClick(i)
        }else{
            if (!wasClicked[i]) {
                if (cellsInfo[i].innerHTML != '🏳️‍🌈') {
                    cellsInfo[i].innerHTML = '🏳️‍🌈'
                    flags++
                    clickMusic.play()
                    document.querySelector('.flagsCounter').innerText = `Flags: ${flags}`
                    mines--
                    document.querySelector('.MinesCounter').innerText = `Mines: ${mines}`
                }else{
                    cellsInfo[i].innerHTML = ''
                    flags--
                    clickMusic.play()
                    document.querySelector('.flagsCounter').innerText = `Flags: ${flags}`
                    mines++
                    document.querySelector('.MinesCounter').innerText = `Mines: ${mines}`
                }           
            }
        }
    })
}

function recursiveCheck (i) {
    setTimeout(() => {
        if (i % 10!= 0 && i >10) click(i-11)
        if (i>9) click(i-10)
        if (i % 10!= 9 && i > 8) click(i-9)
        if (i % 10!= 0 && i > 0) click(i-1)
        if (i % 10!= 9 && i < 99) click(i+1)
        if (i % 10!= 0 && i < 91) click(i+9)
        if (i < 90) click(i+10)
        if (i % 10!= 9 && i < 89) click(i+11)
    },10 )
}

function NewGame () {
    allCells.splice(0,allCells.length)
    FinalArray.splice(0,FinalArray.length)
    totalArray.splice(0,totalArray.length)
    clicks = 0
    wasClicked = Array(100).fill(false)
    for (let i = 0; i < 100; i++) {
    cellsInfo[i].classList.remove('clicked')
    cellsInfo[i].innerText = ''
    }
    clickedCount = 0
    flags = 0
    mines = 10
    document.querySelector('.clicksCounter').innerText = `Clicks: ${0}`
    document.querySelector('.flagsCounter').innerText = `Flags: ${0}`             
    document.querySelector('.MinesCounter').innerText = `Mines: ${10}`
    GameStarted = false
    clearInterval(timerInterval)
    timerInterval = null
    time = 0
    document.querySelector('.timer').innerText = `Time: ${0} sec`
     cellsInfo[i].classList.remove('n1')
     cellsInfo[i].classList.remove('n2')
     cellsInfo[i].classList.remove('n3')
     cellsInfo[i].classList.remove('n4')
     cellsInfo[i].classList.remove('n5')
}

restart.addEventListener('click', () => {
    NewGame()
})

var flagPlace = false


flagMode.addEventListener('click', () => {
    flagPlace = !flagPlace
})

document.querySelector('.dayNight').addEventListener('click', () => {
    document.body.classList.toggle('dark')
})