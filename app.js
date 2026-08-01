"use strict";

/* ==========================================
   설천고 스포츠과학 훈련센터
   app.js Part 1
========================================== */

/* ---------- 앱 정보 ---------- */

const STORAGE_KEY = "sports_science_center";

/* ---------- 데이터 ---------- */

let appData = {
    athletes: [],
    sportsRecords: [],
    weightRecords: [],
    poseRecords: []
};

/* ---------- 저장 ---------- */

function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
    );
}

/* ---------- 불러오기 ---------- */

function loadData() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if(saved){

        appData = JSON.parse(saved);

    }

}

/* ---------- DOM ---------- */

const $ = (id)=>document.getElementById(id);

const $$ = (selector)=>document.querySelectorAll(selector);

/* ---------- UUID ---------- */

function createId(){

    return Date.now().toString(36)+
    Math.random().toString(36).substring(2,8);

}

/* ---------- Toast ---------- */

function showToast(message){

    const toast=$("#toast");

    if(!toast)return;

    toast.textContent=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}

/* ---------- 날짜 ---------- */

function today(){

    return new Date()

    .toISOString()

    .slice(0,10);

}

/* ---------- 시계 ---------- */

function updateClock(){

    const clock=$("#clock");

    if(!clock)return;

    clock.textContent=

    new Date()

    .toLocaleTimeString("ko-KR");

}

setInterval(updateClock,1000);

/* ---------- 페이지 ---------- */

function hideAllPages(){

    document

    .querySelectorAll(".page")

    .forEach(page=>{

        page.classList.remove("active");

    });

}

function showPage(pageName){

    hideAllPages();

    const page=

    document.getElementById(

        pageName+"Page"

    );

    if(page){

        page.classList.add("active");

    }

}

/* ---------- 메뉴 ---------- */

function initializeMenu(){

    document

    .querySelectorAll(".menu")

    .forEach(button=>{

        button.onclick=()=>{

            document

            .querySelectorAll(".menu")

            .forEach(btn=>{

                btn.classList.remove("active");

            });

            button.classList.add("active");

            showPage(

                button.dataset.page

            );

        };

    });

}

/* ---------- 시작 ---------- */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadData();

        updateClock();

        initializeMenu();

        showPage("dashboard");

    }

);
/* ==========================================
   app.js Part 2
   선수 관리
========================================== */

/* ---------- 선수 목록 ---------- */

function renderAthletes(){

    const tbody=$("#athleteTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    appData.athletes.forEach((athlete,index)=>{

        tbody.innerHTML += `

<tr>

<td>${athlete.name}</td>

<td>${athlete.gender}</td>

<td>${athlete.event}</td>

<td>${athlete.height}</td>

<td>${athlete.weight}</td>

<td>

<button onclick="editAthlete(${index})">

수정

</button>

<button onclick="deleteAthlete(${index})">

삭제

</button>

</td>

</tr>

`;

    });

}

/* ---------- 저장 ---------- */

$("#saveAthleteButton")?.addEventListener(

"click",

()=>{

    const name=$("#athleteName").value.trim();

    const gender=$("#athleteGender").value;

    const birth=$("#athleteBirth").value;

    const event=$("#athleteEvent").value.trim();

    const height=$("#athleteHeight").value;

    const weight=$("#athleteWeight").value;

    if(name===""){

        showToast("이름을 입력하세요.");

        return;

    }

    appData.athletes.push({

        id:createId(),

        name,

        gender,

        birth,

        event,

        height,

        weight

    });

    saveData();

    renderAthletes();

    updateDashboard();

    clearAthleteForm();

    showToast("선수가 등록되었습니다.");

}

);

/* ---------- 초기화 ---------- */

$("#resetAthleteButton")?.addEventListener(

"click",

clearAthleteForm

);

function clearAthleteForm(){

    $("#athleteName").value="";

    $("#athleteBirth").value="";

    $("#athleteEvent").value="";

    $("#athleteHeight").value="";

    $("#athleteWeight").value="";

}

/* ---------- 삭제 ---------- */

function deleteAthlete(index){

    if(!confirm("삭제하시겠습니까?")) return;

    appData.athletes.splice(index,1);

    saveData();

    renderAthletes();

    updateDashboard();

}

/* ---------- 수정 ---------- */

function editAthlete(index){

    const athlete=appData.athletes[index];

    $("#athleteName").value=athlete.name;

    $("#athleteGender").value=athlete.gender;

    $("#athleteBirth").value=athlete.birth;

    $("#athleteEvent").value=athlete.event;

    $("#athleteHeight").value=athlete.height;

    $("#athleteWeight").value=athlete.weight;

    appData.athletes.splice(index,1);

    saveData();

    renderAthletes();

}

/* ---------- 선수 Select 갱신 ---------- */

function refreshAthleteSelect(){

    const ids=[

        "sportsAthleteSelect",

        "weightAthleteSelect",

        "cameraAthleteSelect",

        "recordAthleteFilter",

        "reportAthleteSelect"

    ];

    ids.forEach(id=>{

        const select=$(id);

        if(!select) return;

        const first=select.options[0].outerHTML;

        select.innerHTML=first;

        appData.athletes.forEach(a=>{

            select.innerHTML+=`<option value="${a.id}">${a.name}</option>`;

        });

    });

}

/* ---------- 갱신 ---------- */

const oldRenderAthletes=renderAthletes;

renderAthletes=function(){

    oldRenderAthletes();

    refreshAthleteSelect();

};