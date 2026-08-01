/* ==========================================
   sports.js Part 1
   종목훈련 저장
========================================== */

"use strict";

/* ---------- 저장 ---------- */

function saveSportsRecord(){

    const athleteId =
        $("#sportsAthleteSelect").value;

    if(!athleteId){

        showToast("선수를 선택하세요.","error");
        return;

    }

    const record={

        id:createId("sports"),

        athleteId,

        type:$("#sportsTypeSelect").value,

        trainingType:$("#sportsTrainingType").value,

        date:$("#sportsDateInput").value,

        duration:Number(
            $("#sportsDurationInput").value
        ),

        score:Number(
            $("#sportsScoreInput").value
        ),

        memo:$("#sportsMemoInput").value,

        createdAt:new Date().toISOString()

    };

    appData.sportsRecords.unshift(record);

    autoSave();

    renderSportsTable();

    renderDashboard();

    resetSportsForm();

    showToast(
        "훈련이 저장되었습니다.",
        "success"
    );

}

/* ---------- 초기화 ---------- */

function resetSportsForm(){

    $("#sportsTypeSelect").selectedIndex=0;

    $("#sportsTrainingType").selectedIndex=0;

    $("#sportsDateInput").value=getTodayValue();

    $("#sportsDurationInput").value="";

    $("#sportsScoreInput").value="";

    $("#sportsMemoInput").value="";

    $("#sportsAnalysisResult").textContent=
    "점수를 입력하면 자동 분석됩니다.";

}
/* ==========================================
   sports.js Part 2
   목록 출력 / 삭제
========================================== */

/* ---------- 목록 ---------- */

function renderSportsTable(){

    const tbody = $("#sportsTableBody");

    if(!tbody) return;

    tbody.innerHTML = "";

    appData.sportsRecords.forEach(record=>{

        const athlete =
            appData.athletes.find(
                a=>a.id===record.athleteId
            );

        tbody.innerHTML += `

<tr>

<td>${record.date}</td>

<td>${athlete ? athlete.name : "-"}</td>

<td>${record.type}</td>

<td>${record.trainingType}</td>

<td>${record.duration}분</td>

<td>${record.score}점</td>

<td>

<button onclick="deleteSportsRecord('${record.id}')">

삭제

</button>

</td>

</tr>

`;

    });

}

/* ---------- 삭제 ---------- */

function deleteSportsRecord(id){

    if(!confirm("삭제하시겠습니까?")){

        return;

    }

    appData.sportsRecords =

        appData.sportsRecords.filter(

            record=>record.id!==id

        );

    autoSave();

    renderSportsTable();

    renderDashboard();

    showToast(

        "삭제되었습니다.",

        "success"

    );

}

/* ---------- 선수 목록 ---------- */

function updateSportsAthleteSelect(){

    const select = $("#sportsAthleteSelect");

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
   sports.js Part 3
   AI 분석 / 초기화
========================================== */

/* ---------- AI 분석 ---------- */

function analyzeSportsScore(){

    const score = Number(
        $("#sportsScoreInput").value
    );

    const result = $("#sportsAnalysisResult");

    if(!result) return;

    if(!score){

        result.textContent =
        "점수를 입력하면 자동으로 분석됩니다.";

        return;
    }

    if(score >= 90){

        result.innerHTML =
        "🟢 매우 우수한 훈련입니다. 현재 컨디션을 유지하세요.";

    }else if(score >= 80){

        result.innerHTML =
        "🔵 좋은 훈련입니다. 조금만 보완하면 더 좋아집니다.";

    }else if(score >= 70){

        result.innerHTML =
        "🟡 평균 수준입니다. 기술과 체력을 보완하세요.";

    }else{

        result.innerHTML =
        "🔴 개선이 필요합니다. 휴식과 훈련 계획을 점검하세요.";

    }

}

/* ---------- 페이지 ---------- */

function renderSportsPage(){

    updateSportsAthleteSelect();

    renderSportsTable();

}

/* ---------- 이벤트 ---------- */

function initializeSportsModule(){

    $("#sportsDateInput").value =
        getTodayValue();

    $("#saveSportsRecordButton")
    ?.addEventListener(
        "click",
        saveSportsRecord
    );

    $("#resetSportsFormButton")
    ?.addEventListener(
        "click",
        resetSportsForm
    );

    $("#sportsScoreInput")
    ?.addEventListener(
        "input",
        analyzeSportsScore
    );

    renderSportsPage();

}

/* ---------- Export ---------- */

window.renderSportsPage =
    renderSportsPage;

window.initializeSportsModule =
    initializeSportsModule;

/* ---------- 시작 ---------- */

document.addEventListener(

    "DOMContentLoaded",

    initializeSportsModule

);