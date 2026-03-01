const STORAGE_KEY="checklistData";

const todayTitle=document.getElementById("todayTitle");
const screen1=document.getElementById("screen1");
const screen2=document.getElementById("screen2");
const screen3=document.getElementById("screen3");

const countInput=document.getElementById("countInput");
const goToScreen2=document.getElementById("goToScreen2");
const completeBtn=document.getElementById("completeBtn");
const backTo1=document.getElementById("backTo1");
const backTo2=document.getElementById("backTo2");

/* 날짜 */
function getTodayKey(){
  return new Date().toISOString().split("T")[0];
}

function getDisplayDate(){
  const d=new Date();
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

/* 저장 */
function loadData(){
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveData(data){
  localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
}

function resetIfDateChanged(){
  const saved=loadData();
  const today=getTodayKey();
  if(!saved || saved.date!==today){
    localStorage.removeItem(STORAGE_KEY);
    return {date:today,count:0,inputs:[],tasks:[]};
  }
  return saved;
}

/* 화면 전환 */
function showScreen(num){
  screen1.classList.add("hidden");
  screen2.classList.add("hidden");
  screen3.classList.add("hidden");
  completeBtn.classList.add("hidden");
  backTo1.classList.add("hidden");
  backTo2.classList.add("hidden");

  if(num===1) screen1.classList.remove("hidden");

  if(num===2){
    screen2.classList.remove("hidden");
    completeBtn.classList.remove("hidden");
    backTo1.classList.remove("hidden");
  }

  if(num===3){
    screen3.classList.remove("hidden");
    backTo2.classList.remove("hidden");
  }
}

/* 입력창 생성 */
function createInputs(count, values=[]){
  screen2.innerHTML="";
  const inputs = [];
  for(let i=0;i<count;i++){
    const input=document.createElement("input");
    input.type="text";
    input.placeholder=`항목 ${i+1}`;
    input.value=values[i] || "";

    input.addEventListener("input",()=>{
      const data=resetIfDateChanged();
      data.inputs[i]=input.value;
      saveData(data);
    });
    
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const nextInput = inputs[i + 1];
        if (nextInput) {
          nextInput.focus();
        } else {
          completeBtn.focus();
        }
      }
    });

    screen2.appendChild(input);
    inputs.push(input);
  }
  if(inputs.length > 0) {
      inputs[0].focus();
  }
}

/* 1 -> 2 */
goToScreen2.addEventListener("click",()=>{
  const count=parseInt(countInput.value);
  if(!count || count<1) return;

  let data=resetIfDateChanged();
  data.count=count;
  data.inputs=new Array(count).fill("");
  saveData(data);

  createInputs(count,data.inputs);
  showScreen(2);
});

countInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // 기본 엔터 동작(예: 폼 제출) 방지
    goToScreen2.click(); // '다음' 버튼을 프로그래매틱하게 클릭
  }
});

/* 2 -> 3 */
completeBtn.addEventListener("click",()=>{
  let data=resetIfDateChanged();

  const inputs=screen2.querySelectorAll("input");
  data.tasks=[];
  data.inputs=[];

  inputs.forEach(input=>{
    data.inputs.push(input.value);
    if(input.value.trim()!==""){
      data.tasks.push({text:input.value.trim(),done:false});
    }
  });

  saveData(data);
  renderButtons(data);
});

/* 버튼 화면 */
function renderButtons(data){
  screen3.innerHTML="";
  data.tasks.forEach((task,index)=>{
    const btn=document.createElement("button");
    btn.className="task-btn";
    if(task.done) btn.classList.add("done");

    btn.innerHTML=`
      <span>${task.text}</span>
      <span>${task.done?"완료":""}</span>
    `;

    btn.addEventListener("click",()=>{
      task.done=true;
      saveData(data);
      renderButtons(data);
    });

    screen3.appendChild(btn);
  });

  showScreen(3);
}

/* 뒤로가기 */
backTo1.addEventListener("click",()=>{
  showScreen(1);
});

backTo2.addEventListener("click",()=>{
  const data=resetIfDateChanged();
  createInputs(data.count,data.inputs);
  showScreen(2);
});

/* 초기 실행 */
function initialize(){
  todayTitle.innerText=getDisplayDate();
  const data=resetIfDateChanged();

  if(data.tasks.length>0){
    renderButtons(data);
  }else if(data.count>0){
    countInput.value=data.count;
    createInputs(data.count,data.inputs);
    showScreen(2);
  }
}

initialize();
