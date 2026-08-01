/* ==========================================
   weight.js Part 1
   저장 / 1RM 계산
========================================== */

"use strict";

/* ---------- 1RM ---------- */

function calculateOneRM(weight, reps){

    weight = Number(weight);
    reps = Number(reps);

    if(weight<=0 || reps<=0){

        return 0;

    }

    return Math.round(

        weight * (1 + reps / 30)

    );

}

/* ---------- 저장 ---------- */

function saveWeightRecord(){

    const athleteId =
        $("#weightAthleteSelect").value;

    if(!athleteId){

        showToast("선수를 선택하세요.","error");

        return;

    }

    const kg =
        Number($("#weightKgInput").value);

    const reps =
        Number($("#weightRepInput").value);

    const record={

        id:createId("weight"),

        athleteId,

        exercise:
        $("#weightExerciseSelect").value,

        date:
        $("#weightDateInput").value,

        kg,

        set:
        Number($("#weightSetInput").value),

        rep:reps,

        oneRM:
        calculateOneRM(kg,reps),

        memo:
        $("#weightMemoInput").value,

        createdAt:
        new Date().toISOString()

    };

    appData.weightRecords.unshift(record);

    autoSave();

    renderWeightTable();

    renderDashboard();

    resetWeightForm();

    showToast(

        "웨이트 기록 저장 완료",

        "success"

    );

}

/* ---------- 초기화 ---------- */

function resetWeightForm(){

    $("#weightDateInput").value =
        getTodayValue();

    $("#weightKgInput").value="";

    $("#weightSetInput").value="";

    $("#weightRepInput").value="";

    $("#weightMemoInput").value="";

    $("#estimatedOneRepMax").textContent="0 kg";

}
/* ==========================================
   weight.js Part 2
   목록 출력 / 삭제 / 선수목록
========================================== */

/* ---------- 목록 ---------- */

function renderWeightTable(){

    const tbody = $("#weightTableBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    appData.weightRecords.forEach(record=>{

        const athlete = appData.athletes.find(

            a => a.id === record.athleteId

        );

        tbody.innerHTML += `

<tr>

<td>${record.date}</td>

<td>${athlete ? athlete.name : "-"}</td>

<td>${record.exercise}</td>

<td>${record.kg} kg</td>

<td>${record.set}</td>

<td>${record.rep}</td>

<td>

<button onclick="deleteWeightRecord('${record.id}')">

삭제

</button>

</td>

</tr>

`;

    });

}

/* ---------- 삭제 ---------- */

function deleteWeightRecord(id){

    if(!confirm("삭제하시겠습니까?")){

        return;

    }

    appData.weightRecords =

        appData.weightRecords.filter(

            record => record.id !== id

        );

    autoSave();

    renderWeightTable();

    renderDashboard();

    showToast(

        "삭제되었습니다.",

        "success"

    );

}

/* ---------- 선수목록 ---------- */

function updateWeightAthleteSelect(){

    const select = $("#weightAthleteSelect");

    if(!select) return;

    select.innerHTML =

        `<option value="">선수 선택</option>`;

    appData.athletes.forEach(athlete=>{

        select.innerHTML += `

<option value="${athlete.id}">

${athlete.name}

</option>

`;

    });

}
/* ==========================================
   weight.js Part 3
   1RM 계산 / 초기화
========================================== */

/* ---------- 실시간 1RM ---------- */

function updateEstimatedOneRM(){

    const kg = Number(
        $("#weightKgInput").value
    );

    const rep = Number(
        $("#weightRepInput").value
    );

    const oneRM = calculateOneRM(kg, rep);

    $("#estimatedOneRepMax").textContent =
        `${oneRM} kg`;

}

/* ---------- 페이지 ---------- */

function renderWeightPage(){

    updateWeightAthleteSelect();

    renderWeightTable();

}

/* ---------- 이벤트 ---------- */

function initializeWeightModule(){

    $("#weightDateInput").value =
        getTodayValue();

    $("#saveWeightRecordButton")
    ?.addEventListener(
        "click",
        saveWeightRecord
    );

    $("#resetWeightFormButton")
    ?.addEventListener(
        "click",
        resetWeightForm
    );

    $("#weightKgInput")
    ?.addEventListener(
        "input",
        updateEstimatedOneRM
    );

    $("#weightRepInput")
    ?.addEventListener(
        "input",
        updateEstimatedOneRM
    );

    renderWeightPage();

}

/* ---------- Export ---------- */

window.renderWeightPage =
    renderWeightPage;

window.initializeWeightModule =
    initializeWeightModule;

/* ---------- 시작 ---------- */

document.addEventListener(

    "DOMContentLoaded",

    initializeWeightModule

);