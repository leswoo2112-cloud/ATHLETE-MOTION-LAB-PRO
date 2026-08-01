/* ==========================================
   records.js Part 1
   통합 기록 조회
========================================== */

"use strict";

/* ---------- 모든 기록 ---------- */

function getAllRecords(){

    const records=[];

    appData.sportsRecords.forEach(record=>{

        records.push({

            id:record.id,

            type:"sports",

            date:record.date,

            athleteId:record.athleteId,

            title:record.type,

            score:record.score || "-"

        });

    });

    appData.weightRecords.forEach(record=>{

        records.push({

            id:record.id,

            type:"weight",

            date:record.date,

            athleteId:record.athleteId,

            title:record.exercise,

            score:record.oneRM+"kg"

        });

    });

    appData.poseRecords.forEach(record=>{

        records.push({

            id:record.id,

            type:"pose",

            date:record.date,

            athleteId:record.athleteId,

            title:record.movement,

            score:record.score

        });

    });

    return records.sort(

        (a,b)=>new Date(b.date)-new Date(a.date)

    );

}

/* ---------- 목록 출력 ---------- */

function renderRecordsPage(){

    const tbody=$("#recordsList");

    if(!tbody) return;

    tbody.innerHTML="";

    const records=getAllRecords();

    $("#recordCountText").textContent=

        `총 ${records.length}건`;

    records.forEach(record=>{

        const athlete=

            appData.athletes.find(

                a=>a.id===record.athleteId

            );

        tbody.innerHTML+=`

<tr>

<td>${record.date}</td>

<td>${athlete ? athlete.name : "-"}</td>

<td>${record.type}</td>

<td>${record.title}</td>

<td>${record.score}</td>

<td>-</td>

</tr>

`;

    });

}
/* ==========================================
   records.js Part 2
   검색 / 필터
========================================== */

/* ---------- 검색 ---------- */

function searchRecords(){

    const athleteFilter =
        $("#recordAthleteFilter").value;

    const typeFilter =
        $("#recordTypeFilter").value;

    const keyword =
        $("#recordSearchInput")
        .value
        .trim()
        .toLowerCase();

    const tbody = $("#recordsList");

    if(!tbody) return;

    tbody.innerHTML="";

    let records = getAllRecords();

    records = records.filter(record=>{

        const athlete =
            appData.athletes.find(
                a=>a.id===record.athleteId
            );

        if(

            athleteFilter &&

            record.athleteId !== athleteFilter

        ){

            return false;

        }

        if(

            typeFilter &&

            record.type !== typeFilter

        ){

            return false;

        }

        if(keyword){

            const athleteName =
                athlete
                ? athlete.name.toLowerCase()
                : "";

            const title =
                String(record.title)
                .toLowerCase();

            if(

                !athleteName.includes(keyword) &&

                !title.includes(keyword)

            ){

                return false;

            }

        }

        return true;

    });

    $("#recordCountText").textContent =
        `총 ${records.length}건`;

    records.forEach(record=>{

        const athlete =
            appData.athletes.find(
                a=>a.id===record.athleteId
            );

        tbody.innerHTML += `

<tr>

<td>${record.date}</td>

<td>${athlete ? athlete.name : "-"}</td>

<td>${record.type}</td>

<td>${record.title}</td>

<td>${record.score}</td>

<td>-</td>

</tr>

`;

    });

}

/* ---------- 선수목록 ---------- */

function updateRecordAthleteFilter(){

    const select =
        $("#recordAthleteFilter");

    if(!select) return;

    select.innerHTML =

`<option value="">전체 선수</option>`;

    appData.athletes.forEach(athlete=>{

        select.innerHTML += `

<option value="${athlete.id}">

${athlete.name}

</option>

`;

    });

}
/* ==========================================
   records.js Part 3
   CSV / 초기화 / 이벤트
========================================== */

/* ---------- CSV ---------- */

function exportRecordCSV(){

    exportCSV(

        getAllRecords(),

        "훈련기록"

    );

}

/* ---------- 초기화 ---------- */

function resetRecordFilter(){

    $("#recordAthleteFilter").value="";

    $("#recordTypeFilter").value="";

    $("#recordSearchInput").value="";

    renderRecordsPage();

}

/* ---------- 이벤트 ---------- */

function initializeRecordsModule(){

    updateRecordAthleteFilter();

    renderRecordsPage();

    $("#searchRecordsButton")
    ?.addEventListener(

        "click",

        searchRecords

    );

    $("#resetRecordFilterButton")
    ?.addEventListener(

        "click",

        resetRecordFilter

    );

    $("#exportRecordsButton")
    ?.addEventListener(

        "click",

        exportRecordCSV

    );

    $("#recordSearchInput")
    ?.addEventListener(

        "keyup",

        event=>{

            if(event.key==="Enter"){

                searchRecords();

            }

        }

    );

}

/* ---------- Export ---------- */

window.renderRecordsPage =
    renderRecordsPage;

window.initializeRecordsModule =
    initializeRecordsModule;

window.searchRecords =
    searchRecords;

/* ---------- 시작 ---------- */

document.addEventListener(

    "DOMContentLoaded",

    initializeRecordsModule

);