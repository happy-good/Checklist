const inputArea = document.getElementById("inputArea");
const buttonArea = document.getElementById("buttonArea");
const completeBtn = document.getElementById("completeBtn");
const editBtn = document.getElementById("editBtn");
const todayTitle = document.getElementById("todayTitle");
const midnightTimer = document.getElementById("midnightTimer");

let tasks = [];

function getLocalDate() { return new Date(); }

function getLocalDateString() {
    const d = getLocalDate();
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

todayTitle.innerText = getLocalDateString();

function updateMidnightTimer() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;

    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    midnightTimer.innerText =
        `⏳ 자정까지 ${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;
}

setInterval(updateMidnightTimer, 1000);
updateMidnightTimer();

function scheduleMidnightReset() {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    const diff = nextMidnight - now;

    setTimeout(() => {
        resetDoneState();
        scheduleMidnightReset();
    }, diff);
}

function resetDoneState() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(t => t.done = false);
    localStorage.setItem("tasks", JSON.stringify(saved));
    todayTitle.innerText = getLocalDateString();
    renderButtons();
}

for (let i = 0; i < 10; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "task-input";
    input.placeholder = `항목 ${i + 1}`;
    input.addEventListener("input", saveInputs);
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const nextInput = this.nextElementSibling;
            if (nextInput && nextInput.classList.contains("task-input")) {
                nextInput.focus();
            } else {
                completeBtn.click();
            }
        }
    });
    inputArea.appendChild(input);
}

function saveInputs() {
    const inputs = document.querySelectorAll(".task-input");
    let data = [];
    inputs.forEach(input => {
        data.push({ text: input.value, done: false });
    });
    localStorage.setItem("tasks", JSON.stringify(data));
}

function loadInputs() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const inputs = document.querySelectorAll(".task-input");
    inputs.forEach((input, i) => {
        if (saved[i]) input.value = saved[i].text;
    });
}
loadInputs();

function initialScreenCheck() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    const hasText = saved.some(t => t.text && t.text.trim() !== "");
    if (hasText) {
        tasks = saved.filter(t => t.text.trim() !== "");
        renderButtons();
    }
}
initialScreenCheck();

completeBtn.addEventListener("click", () => {
    saveInputs();
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = saved.filter(t => t.text.trim() !== "");
    if (tasks.length === 0) return;
    renderButtons();
});

function renderButtons() {
    buttonArea.innerHTML = "";
    inputArea.classList.add("hidden");
    completeBtn.classList.add("hidden");
    buttonArea.classList.remove("hidden");
    editBtn.classList.remove("hidden");

    tasks.forEach((task, index) => {
        const btn = document.createElement("button");
        btn.className = "task-btn";
        if (task.done) {
            btn.classList.add("done");
        }

        const text = document.createElement("span");
        text.innerText = task.text;

        const doneContainer = document.createElement('div');
        doneContainer.className = 'done-container';

        const statusText = document.createElement("span");
        statusText.className = "status-text";
        statusText.innerText = "완료";

        const cancelBtn = document.createElement('span');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.innerText = 'X';
        cancelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            task.done = false;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderButtons();
        });

        doneContainer.appendChild(statusText);
        doneContainer.appendChild(cancelBtn);

        btn.appendChild(text);
        btn.appendChild(doneContainer);

        if (!task.done) {
            btn.addEventListener("click", () => {
                task.done = true;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderButtons();
            });
        }

        buttonArea.appendChild(btn);
    });
}

editBtn.addEventListener("click", () => {
    inputArea.classList.remove("hidden");
    completeBtn.classList.remove("hidden");
    buttonArea.classList.add("hidden");
    editBtn.classList.add("hidden");
    loadInputs();
});

scheduleMidnightReset();