"use strict";

/* ======================================================
   records.js
   설천고 스포츠과학 훈련센터
   Record Manager
====================================================== */

const RecordsModule = (() => {

/* ======================================================
   State
====================================================== */

const state = {

    records: [],

    filtered: [],

    page: 1,

    pageSize: 20,

    keyword: "",

    sport: "all",

    athlete: "all",

    sort: "newest",

    startDate: "",

    endDate: ""

};

/* ======================================================
   DOM
====================================================== */

const DOM = {};

function cacheDOM(){

    DOM.list = document.querySelector("#recordsList");

    DOM.search = document.querySelector("#recordsSearch");

    DOM.sport = document.querySelector("#recordsSport");

    DOM.athlete = document.querySelector("#recordsAthlete");

    DOM.sort = document.querySelector("#recordsSort");

    DOM.start = document.querySelector("#recordsStartDate");

    DOM.end = document.querySelector("#recordsEndDate");

    DOM.total = document.querySelector("#recordsTotal");

}

/* ======================================================
   Load
====================================================== */

function loadRecords(){

    if(window.appData){

        state.records=[

            ...(appData.sportsRecords||[])

        ];

    }

}

/* ======================================================
   Refresh
====================================================== */

function refresh(){

    filterRecords();

    renderRecords();

}

/* ======================================================
   Filter
====================================================== */

function filterRecords(){

    let records=[...state.records];

    if(state.keyword){

        const keyword=state.keyword.toLowerCase();

        records=records.filter(record=>{

            return (

                (record.trainingName||"")

                .toLowerCase()

                .includes(keyword)

                ||

                (record.memo||"")

                .toLowerCase()

                .includes(keyword)

            );

        });

    }

    if(state.sport!=="all"){

        records=records.filter(record=>

            record.sport===state.sport

        );

    }

    if(state.athlete!=="all"){

        records=records.filter(record=>

            record.athleteId===state.athlete

        );

    }

    if(state.startDate){

        records=records.filter(record=>

            record.date>=state.startDate

        );

    }

    if(state.endDate){

        records=records.filter(record=>

            record.date<=state.endDate

        );

    }

    state.filtered=records;

    sortRecords();

}
/* ======================================================
   Sort
====================================================== */

function sortRecords(){

    switch(state.sort){

        case "oldest":

            state.filtered.sort((a,b)=>
                new Date(a.date)-new Date(b.date)
            );

            break;

        case "name":

            state.filtered.sort((a,b)=>

                (a.trainingName||"")

                .localeCompare(

                    b.trainingName||"",

                    "ko"

                )

            );

            break;

        case "sport":

            state.filtered.sort((a,b)=>

                (a.sport||"")

                .localeCompare(

                    b.sport||"",

                    "ko"

                )

            );

            break;

        case "newest":

        default:

            state.filtered.sort((a,b)=>
                new Date(b.date)-new Date(a.date)
            );

            break;

    }

}

/* ======================================================
   Pagination
====================================================== */

function getCurrentPageRecords(){

    const start=(state.page-1)*state.pageSize;

    const end=start+state.pageSize;

    return state.filtered.slice(start,end);

}

/* ======================================================
   Card
====================================================== */

function createRecordCard(record){

    return `

<div class="record-card" data-id="${record.id}">

    <div class="record-card-header">

        <h3>${record.trainingName||"-"}</h3>

        <span class="record-date">

            ${record.date||"-"}

        </span>

    </div>

    <div class="record-card-body">

        <div class="record-row">

            <strong>선수</strong>

            <span>${record.athleteName||"-"}</span>

        </div>

        <div class="record-row">

            <strong>종목</strong>

            <span>${record.sport||"-"}</span>

        </div>

        <div class="record-row">

            <strong>거리</strong>

            <span>${record.distance||"-"}</span>

        </div>

        <div class="record-row">

            <strong>시간</strong>

            <span>${record.time||"-"}</span>

        </div>

    </div>

    <div class="record-card-footer">

        <button

            class="btn btn-primary"

            data-action="detail"

            data-id="${record.id}"

        >

            상세보기

        </button>

        <button

            class="btn btn-warning"

            data-action="edit"

            data-id="${record.id}"

        >

            수정

        </button>

        <button

            class="btn btn-danger"

            data-action="delete"

            data-id="${record.id}"

        >

            삭제

        </button>

    </div>

</div>

`;

}

/* ======================================================
   Render
====================================================== */

function renderRecords(){

    if(!DOM.list){

        return;

    }

    const records=getCurrentPageRecords();

    if(records.length===0){

        DOM.list.innerHTML=`

<div class="empty-state">

    <h3>기록이 없습니다.</h3>

</div>

`;

        updateTotal();

        return;

    }

    DOM.list.innerHTML=

        records

        .map(createRecordCard)

        .join("");

    updateTotal();

}

/* ======================================================
   Total
====================================================== */

function updateTotal(){

    if(!DOM.total){

        return;

    }

    DOM.total.textContent=

        `${state.filtered.length}개의 기록`;

}
/* ======================================================
   Search & Filter Events
====================================================== */

function bindEvents(){

    if(DOM.search){

        DOM.search.addEventListener("input",e=>{

            state.keyword=e.target.value.trim();

            state.page=1;

            refresh();

        });

    }

    if(DOM.sport){

        DOM.sport.addEventListener("change",e=>{

            state.sport=e.target.value;

            state.page=1;

            refresh();

        });

    }

    if(DOM.athlete){

        DOM.athlete.addEventListener("change",e=>{

            state.athlete=e.target.value;

            state.page=1;

            refresh();

        });

    }

    if(DOM.sort){

        DOM.sort.addEventListener("change",e=>{

            state.sort=e.target.value;

            refresh();

        });

    }

    if(DOM.start){

        DOM.start.addEventListener("change",e=>{

            state.startDate=e.target.value;

            state.page=1;

            refresh();

        });

    }

    if(DOM.end){

        DOM.end.addEventListener("change",e=>{

            state.endDate=e.target.value;

            state.page=1;

            refresh();

        });

    }

    if(DOM.list){

        DOM.list.addEventListener("click",handleListClick);

    }

}

/* ======================================================
   List Button Events
====================================================== */

function handleListClick(event){

    const button=event.target.closest("button");

    if(!button){

        return;

    }

    const action=button.dataset.action;

    const id=button.dataset.id;

    switch(action){

        case "detail":

            openDetail(id);

            break;

        case "edit":

            editRecord(id);

            break;

        case "delete":

            removeRecord(id);

            break;

    }

}

/* ======================================================
   Detail
====================================================== */

function openDetail(id){

    const record=

        state.records.find(

            item=>String(item.id)===String(id)

        );

    if(!record){

        return;

    }

    console.table(record);

    alert(

        `${record.trainingName}\n\n`+

        `선수 : ${record.athleteName||"-"}\n`+

        `종목 : ${record.sport||"-"}\n`+

        `날짜 : ${record.date||"-"}\n`+

        `거리 : ${record.distance||"-"}\n`+

        `시간 : ${record.time||"-"}\n\n`+

        `${record.memo||""}`

    );

}

/* ======================================================
   Edit
====================================================== */

function editRecord(id){

    if(typeof window.editSportsRecord==="function"){

        window.editSportsRecord(id);

        return;

    }

    console.warn("editSportsRecord() 없음");

}

/* ======================================================
   Delete
====================================================== */

function removeRecord(id){

    const ok=confirm("이 기록을 삭제하시겠습니까?");

    if(!ok){

        return;

    }

    if(typeof window.deleteSportsRecord==="function"){

        window.deleteSportsRecord(id);

    }

    state.records=

        state.records.filter(

            item=>String(item.id)!==String(id)

        );

    refresh();

}
/* ======================================================
   Pagination
====================================================== */

function getTotalPages(){

    return Math.max(

        1,

        Math.ceil(

            state.filtered.length/state.pageSize

        )

    );

}

function nextPage(){

    if(state.page<getTotalPages()){

        state.page++;

        renderRecords();

        renderPagination();

    }

}

function prevPage(){

    if(state.page>1){

        state.page--;

        renderRecords();

        renderPagination();

    }

}

function goToPage(page){

    page=Number(page);

    if(page<1){

        page=1;

    }

    if(page>getTotalPages()){

        page=getTotalPages();

    }

    state.page=page;

    renderRecords();

    renderPagination();

}

/* ======================================================
   Pagination Render
====================================================== */

function renderPagination(){

    const container=document.querySelector("#recordsPagination");

    if(!container){

        return;

    }

    const total=getTotalPages();

    let html="";

    html+=`

<button class="page-btn"

data-page="prev"

${state.page===1?"disabled":""}

>

◀

</button>

`;

    for(

        let i=1;

        i<=total;

        i++

    ){

        html+=`

<button

class="page-btn ${i===state.page?"active":""}"

data-page="${i}"

>

${i}

</button>

`;

    }

    html+=`

<button

class="page-btn"

data-page="next"

${state.page===total?"disabled":""}

>

▶

</button>

`;

    container.innerHTML=html;

}

/* ======================================================
   Pagination Event
====================================================== */

function bindPagination(){

    const container=document.querySelector(

        "#recordsPagination"

    );

    if(!container){

        return;

    }

    container.addEventListener(

        "click",

        event=>{

            const button=

                event.target.closest("button");

            if(!button){

                return;

            }

            const page=

                button.dataset.page;

            if(page==="prev"){

                prevPage();

                return;

            }

            if(page==="next"){

                nextPage();

                return;

            }

            goToPage(page);

        }

    );

}

/* ======================================================
   Statistics
====================================================== */

function calculateStatistics(){

    const stats={

        total:state.filtered.length,

        sports:{},

        athletes:{}

    };

    state.filtered.forEach(record=>{

        const sport=

            record.sport||"기타";

        const athlete=

            record.athleteName||"미등록";

        stats.sports[sport]=

            (stats.sports[sport]||0)+1;

        stats.athletes[athlete]=

            (stats.athletes[athlete]||0)+1;

    });

    return stats;

}

/* ======================================================
   Statistics Render
====================================================== */

function renderStatistics(){

    const stats=

        calculateStatistics();

    const total=document.querySelector(

        "#recordsStatTotal"

    );

    if(total){

        total.textContent=

            stats.total;

    }

    const sports=document.querySelector(

        "#recordsStatSports"

    );

    if(sports){

        sports.innerHTML=Object.entries(

            stats.sports

        )

        .map(

            ([name,count])=>

            `<li>${name} : ${count}</li>`

        )

        .join("");

    }

    const athletes=document.querySelector(

        "#recordsStatAthletes"

    );

    if(athletes){

        athletes.innerHTML=Object.entries(

            stats.athletes

        )

        .map(

            ([name,count])=>

            `<li>${name} : ${count}</li>`

        )

        .join("");

    }

}
/* ======================================================
   Export CSV
====================================================== */

function exportCSV(){

    const rows=[];

    rows.push([
        "날짜",
        "선수",
        "종목",
        "훈련명",
        "거리",
        "시간",
        "메모"
    ]);

    state.filtered.forEach(record=>{

        rows.push([

            record.date||"",

            record.athleteName||"",

            record.sport||"",

            record.trainingName||"",

            record.distance||"",

            record.time||"",

            record.memo||""

        ]);

    });

    const csv=rows

        .map(row=>row.join(","))

        .join("\n");

    const blob=new Blob(

        [csv],

        {

            type:"text/csv;charset=utf-8;"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const link=

        document.createElement("a");

    link.href=url;

    link.download="records.csv";

    link.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   Export JSON
====================================================== */

function exportJSON(){

    const blob=new Blob(

        [

            JSON.stringify(

                state.filtered,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const link=

        document.createElement("a");

    link.href=url;

    link.download="records.json";

    link.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   Print
====================================================== */

function printRecords(){

    window.print();

}

/* ======================================================
   Reload
====================================================== */

function reload(){

    loadRecords();

    refresh();

    renderStatistics();

    renderPagination();

}

/* ======================================================
   Init
====================================================== */

function init(){

    cacheDOM();

    loadRecords();

    bindEvents();

    bindPagination();

    refresh();

    renderPagination();

    renderStatistics();

}

/* ======================================================
   Public API
====================================================== */

return{

    init,

    reload,

    refresh,

    exportCSV,

    exportJSON,

    printRecords,

    filterRecords,

    renderRecords,

    renderStatistics

};

})();

/* ======================================================
   Auto Start
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        RecordsModule.init();

    }

);

/* ======================================================
   Global
====================================================== */

window.RecordsModule=RecordsModule;