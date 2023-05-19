
let clickCounter = 0;
let timeRemaining = 0; 
let todaysDate = new Date();
let currentDate = {};
let existing = {};
let startSound = {};
let playSound = false;


// if Pomodoro Tracker doesn't exist yet in local storage, create one:
if (localStorage.getItem('pomTracker') === null) {
    localStorage.setItem('pomTracker', 
    JSON.stringify({totalPomodoros: 0, totalMinutes: 0, date: 0}))
};

let updateStorage = () => {
    let pomTrackerObject = JSON.parse(localStorage.getItem('pomTracker'));

    switch (pomTrackerObject.date === todaysDate.getDate()) {
        case true:
            break;
        case false: 
            pomTrackerObject.totalPomodoros = 0;
            pomTrackerObject.totalMinutes = 0;
            pomTrackerObject.date = todaysDate.getDate();
            localStorage.setItem('pomTracker', JSON.stringify(pomTrackerObject));
            break;
    };

};

updateStorage();


let validateInput = (inputType) => {
    let inputValue = document.getElementById(inputType);
    const numbers = /^[0-9]+$/;
    if (!inputValue.value.match(numbers)) {
        alert('Please enter a positive number.');
        document.getElementById(inputType).value = document.getElementById(inputType).defaultValue;
    }
};


document.getElementById('focusInc').addEventListener('click', () => {
    let focusTime = document.getElementById('focusTime');
    focusTime.value = parseInt(focusTime.value) + 1;
    document.getElementById('clock').innerHTML = document.getElementById('focusTime').value + ':00';
});

document.getElementById('focusDec').addEventListener('click', () => {
    let focusTime = document.getElementById('focusTime');
    if (focusTime.value != 0) {
        focusTime.value = parseInt(focusTime.value) - 1;
        document.getElementById('clock').innerHTML = document.getElementById('focusTime').value + ':00';
    }
});

document.getElementById('breakInc').addEventListener('click', () => {
    let breakTime = document.getElementById('breakTime');
    breakTime.value = parseInt(breakTime.value) + 1;
});

document.getElementById('breakDec').addEventListener('click', () => { 
    let breakTime = document.getElementById('breakTime'); 
    if (breakTime.value != 0) {
        breakTime.value = parseInt(breakTime.value) - 1;
    }
});

document.getElementById('focusTime').addEventListener('change', () => {
    validateInput('focusTime');
    document.getElementById('clock').innerHTML = document.getElementById('focusTime').value + ':00';
});

document.getElementById('breakTime').addEventListener('change', () => {
    validateInput('breakTime');
});


let updateProductivityTracker = (storedObject) => {

    let totalMins = storedObject.totalMinutes;
    let hours = Math.floor(totalMins / 60);
    let mins = totalMins % 60;
    let minsPrefix = mins < 10 ? '0': '';
    let hoursPrefix = hours < 10 && hours > 0 ? '0': '';

    document.getElementById('pomTracker').innerHTML = storedObject.totalPomodoros;
    document.getElementById('timeTracker').innerHTML = hoursPrefix + hours + ':' + minsPrefix + mins;
};

// display correct # pomodoros and minutes if you close/reopen page
updateProductivityTracker(JSON.parse(localStorage.getItem('pomTracker')));


let soundFunction = () => {
    // sound effects from pixabay.com
    let soundToggle = document.getElementById('toggle');
    playSound = soundToggle.checked == true ? true : false;
};


let startBreakTimer = () => {
    if (document.getElementById('breakTime').value > 0) {
        document.getElementById('clock').innerHTML = document.getElementById('breakTime').value + ':00';
        document.getElementById('timerType').innerHTML = 'Break';

        todaysDate = new Date();
        let breakMilliseconds = document.getElementById('breakTime').value * 60000;
        timesUpDate = new Date(todaysDate.getTime() + breakMilliseconds);

        let breakCountdown = () => {
            timeRemaining = timesUpDate.getTime() - new Date().getTime(); 
    
            if (timeRemaining > 0) {
                let minsLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                let secsLeft = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                secsLeft = secsLeft < 10 ? '0' + secsLeft : secsLeft;
                document.getElementById('clock').innerHTML = minsLeft + ':' + secsLeft;
                return timeRemaining;
            } else {
                document.getElementById('timerType').innerHTML = '';
                startSound.src = 'breakCompleteSound.mp3';
                if (playSound == true) {
                    startSound.play();
                };

                clearInterval(countdown);

                document.getElementById('clock').innerHTML = document.getElementById('focusTime').value + ':00';
            }
        };

        countdown = setInterval(breakCountdown, 300);
    }
};


// for main focus timer
let timerCompleted = () => {
    
    startSound.src = 'timerCompleteSound.mp3';
    if (playSound == true) {
        startSound.play();
    };

    clearInterval(countdown);

    timeRemaining = 0;
    clickCounter = 0;
    document.getElementById('startBtn').innerHTML = 'Start';
    currentDate = new Date();
    document.getElementById('clock').innerHTML = document.getElementById('focusTime').value + ':00';
    
    startBreakTimer();
    
    // if timer completes on same day it started, update pomTracker in local storage
    if (todaysDate.getDate() == currentDate.getDate()) {
        existing = JSON.parse(localStorage.getItem('pomTracker'));
        existing.totalPomodoros++;
        existing.totalMinutes += parseInt(document.getElementById('focusTime').value);
        updateProductivityTracker(existing);
        localStorage.setItem('pomTracker', JSON.stringify(existing));

    // if timer completed on a new date, reset pomTracker and add this pomodoro to it
    } else {
        localStorage.clear();
        pomTrackerObj = {totalPomodoros: 1, totalMinutes: parseInt(document.getElementById('focusTime').value), date: currentDate.getDate()};
        localStorage.setItem('pomTracker', JSON.stringify(pomTrackerObj));
        updateProductivityTracker(pomTrackerObj);
    };

};


let myCountdownFunction = () => {
    timeRemaining = timesUpDate.getTime() - new Date().getTime(); 
    
    if (timeRemaining > 0) {
        let minsLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        let secsLeft = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        secsLeft = secsLeft < 10 ? '0' + secsLeft : secsLeft;
        document.getElementById('clock').innerHTML = minsLeft + ':' + secsLeft;
        return timeRemaining;
    } else {
        timerCompleted();
    }
};


let startTimer = () => {
    document.getElementById('timerType').innerHTML = 'Focus';

    startSound = new Audio(src = 'startTimerSound.mp3');
    if (playSound == true) {
        startSound.play();
    };
    
    document.getElementById('startBtn').innerHTML = 'Pause';

    todaysDate = new Date();
    let pomodoroMillisecs = document.getElementById('focusTime').value * 60000;
    timesUpDate = new Date(todaysDate.getTime() + pomodoroMillisecs); 

    updateStorage();

    countdown = setInterval(myCountdownFunction, 100);
};


let resumeTimer = () => {
    document.getElementById('startBtn').innerHTML = 'Pause';

    let now = new Date();
    timesUpDate = new Date(now.getTime() + timeRemaining);
    countdown = setInterval(myCountdownFunction, 100);
};


let pauseTimer = () => {
    document.getElementById('startBtn').innerHTML = 'Resume';
    clearInterval(countdown);
};



let controlTimer = () => {
    clickCounter++;

    if (clickCounter == 1) {
        startTimer();
    }

    if (clickCounter % 2 == 0) {
        pauseTimer();
    }

    if (clickCounter > 1 && clickCounter % 2 == 1) {
        resumeTimer();
    }
}


document.getElementById('startBtn').addEventListener('click', controlTimer);


let resetTimer = () => {
    clearInterval(countdown);    
    clickCounter = 0;
    document.getElementById('clock').innerHTML = document.getElementById('focusTime').value + ':00';
    document.getElementById('startBtn').innerHTML = 'Start';
    document.getElementById('timerType').innerHTML = '';
}

document.getElementById('resetBtn').addEventListener('click', resetTimer);
