"use strict";

/* ======================================================
   report.js
   설천고 스포츠과학 훈련센터
   Report Manager
====================================================== */

const ReportModule = (() => {

/* ======================================================
   State
====================================================== */

const state = {

    records: [],

    filtered: [],

    athlete: "all",

    sport: "all",

    period: "month",

    startDate: "",

    endDate: "",

    charts: {}

};

/* ======================================================
   DOM
====================================================== */

const DOM = {};

function cacheDOM(){

    DOM.container=document.querySelector("#reportContainer");

    DOM.athlete=document.querySelector("#reportAthlete");

    DOM.sport=document.querySelector("#reportSport");

    DOM.period=document.querySelector("#reportPeriod");

    DOM.start=document.querySelector("#reportStartDate");

    DOM.end=document.querySelector("#reportEndDate");

    DOM.summary=document.querySelector("#reportSummary");

    DOM.chart=document.querySelector("#reportChart");

}

/* ======================================================
   Load
====================================================== */

function loadData(){

    if(window.appData){

        state.records=[
            ...(appData.sportsRecords||[])
        ];

    }else{

        state.records=[];

    }

}

/* ======================================================
   Filter
====================================================== */

function filterRecords(){

    let records=[...state.records];

    if(state.athlete!=="all"){

        records=records.filter(

            record=>

            record.athleteId===state.athlete

        );

    }

    if(state.sport!=="all"){

        records=records.filter(

            record=>

            record.sport===state.sport

        );

    }

    if(state.startDate){

        records=records.filter(

            record=>

            record.date>=state.startDate

        );

    }

    if(state.endDate){

        records=records.filter(

            record=>

            record.date<=state.endDate

        );

    }

    state.filtered=records;

}

/* ======================================================
   Refresh
====================================================== */

function refresh(){

    filterRecords();

    renderSummary();

}
/* ======================================================
   Summary Statistics
====================================================== */

function calculateSummary(){

    const summary={

        totalTraining:0,

        totalDistance:0,

        totalTime:0,

        averageDistance:0,

        averageTime:0,

        bestDistance:0,

        bestTime:0

    };

    summary.totalTraining=state.filtered.length;

    state.filtered.forEach(record=>{

        const distance=

            Number(record.distance)||0;

        const time=

            Number(record.time)||0;

        summary.totalDistance+=distance;

        summary.totalTime+=time;

        if(distance>summary.bestDistance){

            summary.bestDistance=distance;

        }

        if(time>summary.bestTime){

            summary.bestTime=time;

        }

    });

    if(summary.totalTraining>0){

        summary.averageDistance=

            (

                summary.totalDistance/

                summary.totalTraining

            ).toFixed(2);

        summary.averageTime=

            (

                summary.totalTime/

                summary.totalTraining

            ).toFixed(2);

    }

    return summary;

}

/* ======================================================
   Summary Card
====================================================== */

function renderSummary(){

    if(!DOM.summary){

        return;

    }

    const summary=

        calculateSummary();

    DOM.summary.innerHTML=`

<div class="report-grid">

<div class="report-card">

<h3>훈련 횟수</h3>

<p>${summary.totalTraining}</p>

</div>

<div class="report-card">

<h3>총 거리</h3>

<p>${summary.totalDistance}</p>

</div>

<div class="report-card">

<h3>총 시간</h3>

<p>${summary.totalTime}</p>

</div>

<div class="report-card">

<h3>평균 거리</h3>

<p>${summary.averageDistance}</p>

</div>

<div class="report-card">

<h3>평균 시간</h3>

<p>${summary.averageTime}</p>

</div>

<div class="report-card">

<h3>최고 거리</h3>

<p>${summary.bestDistance}</p>

</div>

<div class="report-card">

<h3>최고 시간</h3>

<p>${summary.bestTime}</p>

</div>

</div>

`;

}

/* ======================================================
   Athlete Statistics
====================================================== */

function getAthleteStatistics(){

    const map={};

    state.filtered.forEach(record=>{

        const name=

            record.athleteName||

            "미등록";

        if(!map[name]){

            map[name]={

                count:0,

                distance:0,

                time:0

            };

        }

        map[name].count++;

        map[name].distance+=

            Number(record.distance)||0;

        map[name].time+=

            Number(record.time)||0;

    });

    return map;

}

/* ======================================================
   Sport Statistics
====================================================== */

function getSportStatistics(){

    const map={};

    state.filtered.forEach(record=>{

        const sport=

            record.sport||

            "기타";

        if(!map[sport]){

            map[sport]={

                count:0,

                distance:0,

                time:0

            };

        }

        map[sport].count++;

        map[sport].distance+=

            Number(record.distance)||0;

        map[sport].time+=

            Number(record.time)||0;

    });

    return map;

}
/* ======================================================
   Chart.js
====================================================== */

function destroyCharts(){

    Object.values(state.charts).forEach(chart=>{

        if(chart){

            chart.destroy();

        }

    });

    state.charts={};

}

/* ======================================================
   Distance Chart
====================================================== */

function renderDistanceChart(){

    const canvas=document.querySelector(

        "#distanceChart"

    );

    if(!canvas){

        return;

    }

    const context=canvas.getContext("2d");

    const athletes=getAthleteStatistics();

    const labels=Object.keys(athletes);

    const values=labels.map(

        name=>athletes[name].distance

    );

    state.charts.distance=new Chart(

        context,

        {

            type:"bar",

            data:{

                labels,

                datasets:[{

                    label:"총 거리",

                    data:values,

                    borderWidth:1

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{

                        display:true

                    }

                }

            }

        }

    );

}

/* ======================================================
   Time Chart
====================================================== */

function renderTimeChart(){

    const canvas=document.querySelector(

        "#timeChart"

    );

    if(!canvas){

        return;

    }

    const context=canvas.getContext("2d");

    const athletes=getAthleteStatistics();

    const labels=Object.keys(athletes);

    const values=labels.map(

        name=>athletes[name].time

    );

    state.charts.time=new Chart(

        context,

        {

            type:"line",

            data:{

                labels,

                datasets:[{

                    label:"훈련 시간",

                    data:values,

                    tension:0.35,

                    fill:false

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* ======================================================
   Sport Pie Chart
====================================================== */

function renderSportChart(){

    const canvas=document.querySelector(

        "#sportChart"

    );

    if(!canvas){

        return;

    }

    const context=canvas.getContext("2d");

    const sports=getSportStatistics();

    const labels=Object.keys(sports);

    const values=labels.map(

        name=>sports[name].count

    );

    state.charts.sport=new Chart(

        context,

        {

            type:"pie",

            data:{

                labels,

                datasets:[{

                    data:values

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* ======================================================
   Render Charts
====================================================== */

function renderCharts(){

    destroyCharts();

    renderDistanceChart();

    renderTimeChart();

    renderSportChart();

}
/* ======================================================
   Monthly Statistics
====================================================== */

function getMonthlyStatistics(){

    const monthly={};

    state.filtered.forEach(record=>{

        if(!record.date){

            return;

        }

        const month=record.date.substring(0,7);

        if(!monthly[month]){

            monthly[month]={

                count:0,

                distance:0,

                time:0

            };

        }

        monthly[month].count++;

        monthly[month].distance+=

            Number(record.distance)||0;

        monthly[month].time+=

            Number(record.time)||0;

    });

    return monthly;

}

/* ======================================================
   Monthly Trend
====================================================== */

function renderMonthlyTrend(){

    const canvas=document.querySelector(

        "#monthlyChart"

    );

    if(!canvas){

        return;

    }

    const context=canvas.getContext("2d");

    const monthly=

        getMonthlyStatistics();

    const labels=

        Object.keys(monthly).sort();

    const values=

        labels.map(

            month=>monthly[month].distance

        );

    state.charts.monthly=new Chart(

        context,

        {

            type:"line",

            data:{

                labels,

                datasets:[{

                    label:"월별 거리",

                    data:values,

                    fill:false,

                    tension:0.3

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* ======================================================
   Personal Best
====================================================== */

function getPersonalBest(){

    const result={};

    state.filtered.forEach(record=>{

        const athlete=

            record.athleteName||

            "미등록";

        if(!result[athlete]){

            result[athlete]={

                distance:0,

                time:0,

                training:null

            };

        }

        const distance=

            Number(record.distance)||0;

        const time=

            Number(record.time)||0;

        if(distance>

            result[athlete].distance){

            result[athlete].distance=

                distance;

            result[athlete].training=

                record.trainingName;

            result[athlete].date=

                record.date;

        }

        if(time>

            result[athlete].time){

            result[athlete].time=time;

        }

    });

    return result;

}

/* ======================================================
   Render PB
====================================================== */

function renderPersonalBest(){

    const container=document.querySelector(

        "#personalBest"

    );

    if(!container){

        return;

    }

    const pb=

        getPersonalBest();

    container.innerHTML=

        Object.entries(pb)

        .map(

            ([name,data])=>`

<div class="pb-card">

<h3>${name}</h3>

<p><strong>최고 거리</strong>

${data.distance}</p>

<p><strong>최고 시간</strong>

${data.time}</p>

<p><strong>훈련</strong>

${data.training||"-"}</p>

<p><strong>날짜</strong>

${data.date||"-"}</p>

</div>

`

        )

        .join("");

}

/* ======================================================
   Refresh Report
====================================================== */

function refreshReport(){

    filterRecords();

    renderSummary();

    renderCharts();

    renderMonthlyTrend();

    renderPersonalBest();

}
/* ======================================================
   Athlete Report
====================================================== */

function generateAthleteReport(){

    const athletes={};

    state.filtered.forEach(record=>{

        const name=record.athleteName||"미등록";

        if(!athletes[name]){

            athletes[name]={

                count:0,

                distance:0,

                time:0,

                trainings:[]

            };

        }

        athletes[name].count++;

        athletes[name].distance+=Number(record.distance)||0;

        athletes[name].time+=Number(record.time)||0;

        athletes[name].trainings.push(record);

    });

    return athletes;

}

/* ======================================================
   Sport Report
====================================================== */

function generateSportReport(){

    const sports={};

    state.filtered.forEach(record=>{

        const sport=record.sport||"기타";

        if(!sports[sport]){

            sports[sport]={

                count:0,

                distance:0,

                time:0

            };

        }

        sports[sport].count++;

        sports[sport].distance+=Number(record.distance)||0;

        sports[sport].time+=Number(record.time)||0;

    });

    return sports;

}

/* ======================================================
   Growth Rate
====================================================== */

function calculateGrowthRate(records){

    if(records.length<2){

        return 0;

    }

    const first=Number(records[0].distance)||0;

    const last=Number(

        records[records.length-1].distance

    )||0;

    if(first===0){

        return 0;

    }

    return (

        ((last-first)/first)*100

    ).toFixed(1);

}

/* ======================================================
   Ranking
====================================================== */

function createRanking(){

    const athletes=

        generateAthleteReport();

    return Object.entries(athletes)

        .map(([name,data])=>({

            name,

            count:data.count,

            distance:data.distance,

            time:data.time,

            average:

                data.count===0

                ?0

                :data.distance/data.count

        }))

        .sort(

            (a,b)=>

            b.distance-a.distance

        );

}

/* ======================================================
   MVP
====================================================== */

function calculateMVP(){

    const ranking=

        createRanking();

    if(ranking.length===0){

        return null;

    }

    return ranking[0];

}

/* ======================================================
   Render Ranking
====================================================== */

function renderRanking(){

    const container=document.querySelector(

        "#rankingList"

    );

    if(!container){

        return;

    }

    const ranking=

        createRanking();

    container.innerHTML=

        ranking.map(

            (player,index)=>`

<div class="ranking-card">

<div class="rank">

${index+1}

</div>

<div class="name">

${player.name}

</div>

<div class="distance">

${player.distance}

</div>

<div class="count">

${player.count}회

</div>

</div>

`

        ).join("");

}

/* ======================================================
   Render MVP
====================================================== */

function renderMVP(){

    const container=document.querySelector(

        "#mvpCard"

    );

    if(!container){

        return;

    }

    const mvp=

        calculateMVP();

    if(!mvp){

        container.innerHTML="";

        return;

    }

    container.innerHTML=`

<div class="mvp">

<h2>🏆 MVP</h2>

<h3>${mvp.name}</h3>

<p>총 거리 : ${mvp.distance}</p>

<p>훈련 횟수 : ${mvp.count}</p>

<p>평균 거리 : ${mvp.average.toFixed(2)}</p>

</div>

`;

}
/* ======================================================
   Export CSV
====================================================== */

function exportReportCSV(){

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

            record.distance||0,

            record.time||0,

            record.memo||""

        ]);

    });

    const csv=rows

        .map(row=>row.join(","))

        .join("\n");

    const blob=new Blob(

        [csv],

        {

            type:"text/csv;charset=utf-8"

        }

    );

    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");

    link.href=url;

    link.download="training-report.csv";

    link.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   Export JSON
====================================================== */

function exportReportJSON(){

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

    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");

    link.href=url;

    link.download="training-report.json";

    link.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   Print Report
====================================================== */

function printReport(){

    window.print();

}

/* ======================================================
   AI Comment
====================================================== */

function generateAIComment(){

    const summary=

        calculateSummary();

    let comment="";

    if(summary.totalTraining===0){

        return "훈련 기록이 없습니다.";

    }

    if(summary.averageDistance>=10){

        comment+=

        "평균 훈련 거리가 매우 우수합니다. ";

    }else if(summary.averageDistance>=5){

        comment+=

        "훈련량이 안정적으로 유지되고 있습니다. ";

    }else{

        comment+=

        "훈련 거리를 조금 더 늘리는 것을 추천합니다. ";

    }

    if(summary.averageTime>=60){

        comment+=

        "훈련 시간이 충분합니다. ";

    }else{

        comment+=

        "훈련 시간을 조금 더 확보하면 좋습니다. ";

    }

    if(summary.bestDistance>=20){

        comment+=

        "최고 기록이 매우 뛰어납니다.";

    }

    return comment;

}

/* ======================================================
   Render AI Comment
====================================================== */

function renderAIComment(){

    const container=document.querySelector(

        "#aiComment"

    );

    if(!container){

        return;

    }

    container.innerHTML=`

<div class="ai-report">

<h3>AI 훈련 분석</h3>

<p>

${generateAIComment()}

</p>

</div>

`;

}

/* ======================================================
   PDF (Print Version)
====================================================== */

function exportPDF(){

    printReport();

}
/* ======================================================
   Event Binding
====================================================== */

function bindEvents(){

    if(DOM.athlete){

        DOM.athlete.addEventListener(

            "change",

            event=>{

                state.athlete=

                    event.target.value;

                refreshReport();

            }

        );

    }

    if(DOM.sport){

        DOM.sport.addEventListener(

            "change",

            event=>{

                state.sport=

                    event.target.value;

                refreshReport();

            }

        );

    }

    if(DOM.period){

        DOM.period.addEventListener(

            "change",

            event=>{

                state.period=

                    event.target.value;

                refreshReport();

            }

        );

    }

    if(DOM.start){

        DOM.start.addEventListener(

            "change",

            event=>{

                state.startDate=

                    event.target.value;

                refreshReport();

            }

        );

    }

    if(DOM.end){

        DOM.end.addEventListener(

            "change",

            event=>{

                state.endDate=

                    event.target.value;

                refreshReport();

            }

        );

    }

}

/* ======================================================
   Reload
====================================================== */

function reload(){

    loadData();

    refreshReport();

}

/* ======================================================
   Init
====================================================== */

function init(){

    cacheDOM();

    loadData();

    bindEvents();

    refreshReport();

}

/* ======================================================
   Public API
====================================================== */

return{

    init,

    reload,

    refresh:refreshReport,

    exportCSV:exportReportCSV,

    exportJSON:exportReportJSON,

    exportPDF,

    print:printReport,

    renderCharts,

    renderSummary,

    renderRanking,

    renderMVP,

    renderAIComment,

    getMonthlyStatistics,

    getAthleteStatistics,

    getSportStatistics,

    generateAthleteReport,

    generateSportReport,

    calculateSummary,

    calculateGrowthRate,

    createRanking,

    getPersonalBest

};

})();

/* ======================================================
   Auto Start
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        ReportModule.init();

    }

);

/* ======================================================
   Global
====================================================== */

window.ReportModule=ReportModule;