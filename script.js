const inputArea = document.getElementById("inputArea");
const buttonArea = document.getElementById("buttonArea");
const completeBtn = document.getElementById("completeBtn");
const editBtn = document.getElementById("editBtn");
const todayTitle = document.getElementById("todayTitle");

let tasks = [];

function getLocalDate() { return new Date(); }

function getLocalDateString() {
    const d = getLocalDate();
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

todayTitle.innerText = getLocalDateString();

function dailyResetCheck() {
    const currentDate = getLocalDateString();
    const lastResetDate = localStorage.getItem('lastResetDate');

    if (lastResetDate !== currentDate) {
        resetDoneState();
        localStorage.setItem('lastResetDate', currentDate);
    }
}

function resetDoneState() {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    saved.forEach(t => t.done = false);
    localStorage.setItem("tasks", JSON.stringify(saved));
    todayTitle.innerText = getLocalDateString();

    // 할 일 목록 화면일 때만 버튼을 다시 렌더링
    if (!buttonArea.classList.contains("hidden")) {
        renderButtons();
    }
}

dailyResetCheck();
setInterval(dailyResetCheck, 1000 * 60);

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
    const existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let data = [];
    inputs.forEach((input, i) => {
        const existingTask = existingTasks[i] || { done: false };
        data.push({ text: input.value, done: existingTask.done });
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

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = savedTasks.filter(t => t.text && t.text.trim() !== '');

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
            const allTasks = JSON.parse(localStorage.getItem("tasks"));
            const targetTask = allTasks.find(t => t.text === task.text);
            if (targetTask) {
                targetTask.done = false;
            }
            localStorage.setItem("tasks", JSON.stringify(allTasks));
            renderButtons();
        });

        doneContainer.appendChild(statusText);
        doneContainer.appendChild(cancelBtn);

        btn.appendChild(text);
        btn.appendChild(doneContainer);

        if (!task.done) {
            btn.addEventListener("click", () => {
                const allTasks = JSON.parse(localStorage.getItem("tasks"));
                const targetTask = allTasks.find(t => t.text === task.text);
                if (targetTask) {
                    targetTask.done = true;
                }
                localStorage.setItem("tasks", JSON.stringify(allTasks));
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
