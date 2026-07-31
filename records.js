"use strict";

/* ==========================================================
   records.js
   설천고 스포츠과학 훈련센터
========================================================== */

const RecordsModule = (() => {

const state = {

    athlete: "",

    type: "",

    keyword: "",

    records: []

};

const DOM = {};

/* ==========================================================
   DOM
========================================================== */

function cacheDOM(){

    DOM.athleteFilter=document.getElementById("recordAthleteFilter");

    DOM.typeFilter=document.getElementById("recordTypeFilter");

    DOM.searchInput=document.getElementById("recordSearchInput");

    DOM.searchButton=document.getElementById("searchRecordsButton");

    DOM.resetButton=document.getElementById("resetRecordFilterButton");

    DOM.exportButton=document.getElementById("exportRecordsButton");

    DOM.table=document.getElementById("recordsList");

    DOM.count=document.getElementById("recordCountText");

}

/* ==========================================================
   Load All Records
========================================================== */

function loadRecords(){

    state.records=[];

    if(window.appData){

        (appData.sportsRecords||[]).forEach(item=>{

            state.records.push({

                type:"sports",

                ...item

            });

        });

        (appData.weightRecords||[]).forEach(item=>{

            state.records.push({

                type:"weight",

                ...item

            });

        });

        (appData.poseRecords||[]).forEach(item=>{

            state.records.push({

                type:"pose",

                ...item

            });

        });

    }

}

/* ==========================================================
   Athlete Filter
========================================================== */

function renderAthleteFilter(){

    if(!DOM.athleteFilter) return;

    DOM.athleteFilter.innerHTML=

    `<option value="">전체 선수</option>`;

    if(!window.appData) return;

    (appData.athletes||[]).forEach(player=>{

        DOM.athleteFilter.innerHTML+=`

<option value="${player.id}">

${player.name}

</option>

`;

    });

}
/* ==========================================================
   Search & Filter
========================================================== */

function getFilteredRecords(){

    let records=[...state.records];

    if(state.athlete){

        records=records.filter(record=>

            String(record.athleteId)===String(state.athlete)

        );

    }

    if(state.type){

        records=records.filter(record=>

            record.type===state.type

        );

    }

    if(state.keyword){

        const keyword=

            state.keyword.toLowerCase();

        records=records.filter(record=>{

            return(

                (record.memo||"")

                .toLowerCase()

                .includes(keyword)

                ||

                (record.trainingType||"")

                .toLowerCase()

                .includes(keyword)

                ||

                (record.exercise||"")

                .toLowerCase()

                .includes(keyword)

                ||

                (record.movement||"")

                .toLowerCase()

                .includes(keyword)

            );

        });

    }

    return records.sort(

        (a,b)=>

        new Date(b.date)-new Date(a.date)

    );

}

/* ==========================================================
   Record Name
========================================================== */

function getRecordTitle(record){

    switch(record.type){

        case "sports":

            return record.trainingType||

                   record.typeName||

                   "-";

        case "weight":

            return record.exercise||

                   "-";

        case "pose":

            return record.movement||

                   "-";

        default:

            return "-";

    }

}

/* ==========================================================
   Score
========================================================== */

function getRecordScore(record){

    if(record.type==="sports"){

        return record.score??"-";

    }

    if(record.type==="weight"){

        return record.weight

            ?`${record.weight}kg`

            :"-";

    }

    if(record.type==="pose"){

        return record.score

            ?`${record.score}점`

            :"-";

    }

    return "-";

}

/* ==========================================================
   Render Table
========================================================== */

function renderRecords(){

    if(!DOM.table){

        return;

    }

    const records=

        getFilteredRecords();

    DOM.count.textContent=

        `총 ${records.length}건`;

    if(records.length===0){

        DOM.table.innerHTML=`

<tr>

<td colspan="6">

기록이 없습니다.

</td>

</tr>

`;

        return;

    }

    DOM.table.innerHTML=

        records.map(record=>`

<tr>

<td>

${record.date||"-"}

</td>

<td>

${record.athleteName||"-"}

</td>

<td>

${record.type}

</td>

<td>

${getRecordTitle(record)}

</td>

<td>

${getRecordScore(record)}

</td>

<td>

<button

class="record-delete"

data-id="${record.id}"

data-type="${record.type}"

>

삭제

</button>

</td>

</tr>

`).join("");

}
/* ==========================================================
   Delete Record
========================================================== */

function deleteRecord(type,id){

    if(!confirm("이 기록을 삭제하시겠습니까?")){

        return;

    }

    switch(type){

        case "sports":

            if(typeof window.deleteSportsRecord==="function"){

                window.deleteSportsRecord(id);

            }

            break;

        case "weight":

            if(typeof window.deleteWeightRecord==="function"){

                window.deleteWeightRecord(id);

            }

            break;

        case "pose":

            if(typeof window.deletePoseRecord==="function"){

                window.deletePoseRecord(id);

            }

            break;

    }

    loadRecords();

    renderRecords();

}

/* ==========================================================
   CSV Export
========================================================== */

function exportCSV(){

    const records=getFilteredRecords();

    let csv="날짜,선수,유형,내용,점수\n";

    records.forEach(record=>{

        csv+=`"${record.date||""}","${record.athleteName||""}","${record.type}","${getRecordTitle(record)}","${getRecordScore(record)}"\n`;

    });

    const blob=new Blob(

        [csv],

        {

            type:"text/csv;charset=utf-8"

        }

    );

    const url=URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download="training_records.csv";

    a.click();

    URL.revokeObjectURL(url);

}

/* ==========================================================
   Event
========================================================== */

function bindEvents(){

    DOM.searchButton?.addEventListener(

        "click",

        ()=>{

            state.athlete=

                DOM.athleteFilter.value;

            state.type=

                DOM.typeFilter.value;

            state.keyword=

                DOM.searchInput.value.trim();

            renderRecords();

        }

    );

    DOM.resetButton?.addEventListener(

        "click",

        ()=>{

            state.athlete="";

            state.type="";

            state.keyword="";

            DOM.athleteFilter.value="";

            DOM.typeFilter.value="";

            DOM.searchInput.value="";

            renderRecords();

        }

    );

    DOM.exportButton?.addEventListener(

        "click",

        exportCSV

    );

    DOM.table?.addEventListener(

        "click",

        event=>{

            const button=

                event.target.closest(

                    ".record-delete"

                );

            if(!button){

                return;

            }

            deleteRecord(

                button.dataset.type,

                button.dataset.id

            );

        }

    );

}

/* ==========================================================
   Init
========================================================== */

function init(){

    cacheDOM();

    loadRecords();

    renderAthleteFilter();

    renderRecords();

    bindEvents();

}

/* ==========================================================
   Public
========================================================== */

return{

    init,

    refresh(){

        loadRecords();

        renderAthleteFilter();

        renderRecords();

    },

    exportCSV

};

})();

/* ==========================================================
   Start
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        RecordsModule.init();

    }

);

window.RecordsModule=RecordsModule;