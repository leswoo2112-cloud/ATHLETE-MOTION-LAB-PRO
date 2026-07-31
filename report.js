"use strict";

/* ==========================================================
   report.js
   설천고 스포츠과학 훈련센터
========================================================== */

const ReportModule = (()=>{

const state={

    athlete:"",

    period:7,

    records:[]

};

const DOM={};

/* ==========================================================
   DOM
========================================================== */

function cacheDOM(){

    DOM.athlete=document.getElementById("reportAthleteSelect");

    DOM.period=document.getElementById("reportPeriodSelect");

    DOM.generate=document.getElementById("generateReportButton");

    DOM.print=document.getElementById("printReportButton");

    DOM.total=document.getElementById("reportTotalTraining");

    DOM.average=document.getElementById("reportAverageScore");

    DOM.best=document.getElementById("reportBestScore");

    DOM.minutes=document.getElementById("reportTotalMinutes");

    DOM.analysis=document.getElementById("reportAnalysisText");

    DOM.bestList=document.getElementById("reportBestRecords");

}

/* ==========================================================
   Load Records
========================================================== */

function loadRecords(){

    state.records=[];

    if(window.appData){

        (appData.sportsRecords||[]).forEach(record=>{

            state.records.push({

                type:"sports",

                ...record

            });

        });

        (appData.weightRecords||[]).forEach(record=>{

            state.records.push({

                type:"weight",

                ...record

            });

        });

        (appData.poseRecords||[]).forEach(record=>{

            state.records.push({

                type:"pose",

                ...record

            });

        });

    }

}

/* ==========================================================
   Athlete Select
========================================================== */

function renderAthletes(){

    if(!DOM.athlete){

        return;

    }

    DOM.athlete.innerHTML=

    `<option value="">전체 선수</option>`;

    (window.appData?.athletes||[]).forEach(player=>{

        DOM.athlete.innerHTML+=`

<option value="${player.id}">

${player.name}

</option>

`;

    });

}
/* ==========================================================
   Filter Records
========================================================== */

function getFilteredRecords(){

    let records=[...state.records];

    if(state.athlete){

        records=records.filter(record=>

            String(record.athleteId)===String(state.athlete)

        );

    }

    const days=Number(state.period);

    const today=new Date();

    const start=new Date();

    start.setDate(today.getDate()-days);

    records=records.filter(record=>{

        if(!record.date){

            return false;

        }

        return new Date(record.date)>=start;

    });

    return records;

}

/* ==========================================================
   Summary
========================================================== */

function calculateSummary(){

    const records=getFilteredRecords();

    let total=0;

    let totalScore=0;

    let scoreCount=0;

    let bestScore=0;

    let totalMinutes=0;

    records.forEach(record=>{

        total++;

        if(record.score!==undefined){

            totalScore+=Number(record.score)||0;

            scoreCount++;

            if(Number(record.score)>bestScore){

                bestScore=Number(record.score);

            }

        }

        if(record.duration){

            totalMinutes+=Number(record.duration)||0;

        }

    });

    return{

        total,

        average:

            scoreCount===0

            ?0

            :Math.round(

                totalScore/scoreCount

            ),

        best:bestScore,

        minutes:totalMinutes,

        records

    };

}

/* ==========================================================
   Render Summary
========================================================== */

function renderSummary(){

    const summary=

        calculateSummary();

    DOM.total.textContent=

        summary.total+"회";

    DOM.average.textContent=

        summary.average+"점";

    DOM.best.textContent=

        summary.best+"점";

    DOM.minutes.textContent=

        summary.minutes+"분";

}

/* ==========================================================
   Best Records
========================================================== */

function renderBestRecords(){

    const summary=

        calculateSummary();

    DOM.bestList.innerHTML="";

    if(summary.records.length===0){

        DOM.bestList.innerHTML=

        "<li>기록이 없습니다.</li>";

        return;

    }

    summary.records

        .sort(

            (a,b)=>

            (Number(b.score)||0)-

            (Number(a.score)||0)

        )

        .slice(0,5)

        .forEach(record=>{

            DOM.bestList.innerHTML+=`

<li>

${record.date}

&nbsp;

${record.athleteName}

&nbsp;

${record.score||0}점

</li>

`;

        });

}
/* ==========================================================
   Score Chart
========================================================== */

let scoreChart=null;
let trainingTypeChart=null;

function renderScoreChart(){

    const canvas=document.getElementById("scoreChart");

    if(!canvas){

        return;

    }

    const records=getFilteredRecords();

    const labels=records.map(record=>record.date);

    const scores=records.map(record=>

        Number(record.score)||0

    );

    if(scoreChart){

        scoreChart.destroy();

    }

    scoreChart=new Chart(canvas,{

        type:"line",

        data:{

            labels,

            datasets:[{

                label:"훈련 점수",

                data:scores,

                borderWidth:3,

                tension:0.35,

                fill:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/* ==========================================================
   Training Type Chart
========================================================== */

function renderTrainingTypeChart(){

    const canvas=document.getElementById(

        "trainingTypeChart"

    );

    if(!canvas){

        return;

    }

    const map={};

    getFilteredRecords().forEach(record=>{

        let name="기타";

        switch(record.type){

            case "sports":

                name="종목훈련";

                break;

            case "weight":

                name="웨이트";

                break;

            case "pose":

                name="자세분석";

                break;

        }

        map[name]=(map[name]||0)+1;

    });

    if(trainingTypeChart){

        trainingTypeChart.destroy();

    }

    trainingTypeChart=new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:Object.keys(map),

            datasets:[{

                data:Object.values(map)

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/* ==========================================================
   AI Analysis
========================================================== */

function renderAnalysis(){

    const summary=

        calculateSummary();

    let text="";

    if(summary.total===0){

        text="분석할 훈련 기록이 없습니다.";

    }else{

        if(summary.average>=90){

            text+="훈련 점수가 매우 우수합니다. ";

        }else if(summary.average>=80){

            text+="전체적으로 좋은 훈련 상태입니다. ";

        }else if(summary.average>=70){

            text+="평균 수준입니다. ";

        }else{

            text+="훈련 강도와 집중도를 높여보세요. ";

        }

        if(summary.best>=95){

            text+="최고 기록이 뛰어납니다. ";

        }

        if(summary.minutes>=1000){

            text+="훈련량도 충분합니다.";

        }else{

            text+="운동 시간을 조금 늘리면 더 좋은 결과를 기대할 수 있습니다.";

        }

    }

    DOM.analysis.textContent=text;

}

/* ==========================================================
   Generate Report
========================================================== */

function generateReport(){

    renderSummary();

    renderBestRecords();

    renderScoreChart();

    renderTrainingTypeChart();

    renderAnalysis();

}
/* ==========================================================
   Events
========================================================== */

function bindEvents(){

    DOM.generate?.addEventListener(

        "click",

        ()=>{

            state.athlete=

                DOM.athlete.value;

            state.period=

                Number(DOM.period.value);

            generateReport();

        }

    );

    DOM.print?.addEventListener(

        "click",

        ()=>{

            window.print();

        }

    );

}

/* ==========================================================
   Refresh
========================================================== */

function refresh(){

    loadRecords();

    renderAthletes();

    generateReport();

}

/* ==========================================================
   Init
========================================================== */

function init(){

    cacheDOM();

    loadRecords();

    renderAthletes();

    bindEvents();

    generateReport();

}

/* ==========================================================
   Public API
========================================================== */

return{

    init,

    refresh,

    generateReport,

    getFilteredRecords,

    calculateSummary

};

})();

/* ==========================================================
   Auto Start
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        ReportModule.init();

    }

);

/* ==========================================================
   Global
========================================================== */

window.ReportModule=ReportModule;
/* ==========================================================
   Athlete Ranking
========================================================== */

function createRanking(){

    const map={};

    getFilteredRecords().forEach(record=>{

        const id=record.athleteId;

        if(!id){

            return;

        }

        if(!map[id]){

            map[id]={

                id,

                name:record.athleteName,

                score:0,

                count:0,

                minutes:0

            };

        }

        map[id].count++;

        map[id].score+=Number(record.score)||0;

        map[id].minutes+=Number(record.duration)||0;

    });

    return Object.values(map)

    .map(player=>{

        player.average=

            player.count===0

            ?0

            :Math.round(

                player.score/player.count

            );

        return player;

    })

    .sort(

        (a,b)=>b.average-a.average

    );

}

/* ==========================================================
   Render Ranking
========================================================== */

function renderRanking(){

    let container=document.getElementById(

        "reportRanking"

    );

    if(!container){

        container=document.createElement("div");

        container.id="reportRanking";

        container.className="card";

        DOM.analysis.parentNode.after(container);

    }

    const ranking=createRanking();

    container.innerHTML=`

<h3>🏆 선수 랭킹</h3>

<table class="table">

<thead>

<tr>

<th>순위</th>

<th>선수</th>

<th>평균점수</th>

<th>훈련</th>

</tr>

</thead>

<tbody>

${ranking.map((player,index)=>`

<tr>

<td>${index+1}</td>

<td>${player.name}</td>

<td>${player.average}점</td>

<td>${player.count}회</td>

</tr>

`).join("")}

</tbody>

</table>

`;

}

/* ==========================================================
   Personal Best
========================================================== */

function renderPersonalBest(){

    let container=document.getElementById(

        "personalBest"

    );

    if(!container){

        container=document.createElement("div");

        container.id="personalBest";

        container.className="card";

        document.getElementById(

            "reportPage"

        ).appendChild(container);

    }

    const ranking=createRanking();

    container.innerHTML=`

<h3>🥇 개인 최고기록</h3>

<ul>

${ranking.map(player=>`

<li>

${player.name}

-

${player.average}점

(${player.count}회)

</li>

`).join("")}

</ul>

`;

}
/* ==========================================================
   Monthly Statistics
========================================================== */

function getMonthlyStatistics(){

    const monthly={};

    getFilteredRecords().forEach(record=>{

        if(!record.date){

            return;

        }

        const month=record.date.substring(0,7);

        if(!monthly[month]){

            monthly[month]={

                score:0,

                minutes:0,

                count:0

            };

        }

        monthly[month].score+=Number(record.score)||0;

        monthly[month].minutes+=Number(record.duration)||0;

        monthly[month].count++;

    });

    return monthly;

}

/* ==========================================================
   Monthly Chart
========================================================== */

let monthlyChart=null;

function renderMonthlyChart(){

    let canvas=document.getElementById("monthlyChart");

    if(!canvas){

        const card=document.createElement("div");

        card.className="chart-card";

        card.innerHTML=

        `<canvas id="monthlyChart"></canvas>`;

        document.getElementById("reportPage")

            .appendChild(card);

        canvas=document.getElementById("monthlyChart");

    }

    const monthly=

        getMonthlyStatistics();

    const labels=

        Object.keys(monthly);

    const values=

        labels.map(month=>

            Math.round(

                monthly[month].score/

                monthly[month].count

            )

        );

    if(monthlyChart){

        monthlyChart.destroy();

    }

    monthlyChart=new Chart(canvas,{

        type:"bar",

        data:{

            labels,

            datasets:[{

                label:"월 평균 점수",

                data:values

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/* ==========================================================
   Training Streak
========================================================== */

function calculateTrainingStreak(){

    const dates=[

        ...new Set(

            getFilteredRecords()

            .map(record=>record.date)

        )

    ].sort();

    let current=0;

    let best=0;

    let previous=null;

    dates.forEach(date=>{

        if(previous){

            const diff=(

                new Date(date)-

                new Date(previous)

            )/86400000;

            if(diff===1){

                current++;

            }else{

                current=1;

            }

        }else{

            current=1;

        }

        if(current>best){

            best=current;

        }

        previous=date;

    });

    return{

        current,

        best

    };

}

/* ==========================================================
   MVP
========================================================== */

function getMVP(){

    const ranking=

        createRanking();

    if(ranking.length===0){

        return null;

    }

    return ranking[0];

}

function renderMVP(){

    let container=

        document.getElementById(

            "reportMVP"

        );

    if(!container){

        container=document.createElement("div");

        container.id="reportMVP";

        container.className="card";

        document.getElementById(

            "reportPage"

        ).appendChild(container);

    }

    const mvp=getMVP();

    const streak=

        calculateTrainingStreak();

    if(!mvp){

        container.innerHTML=

        "<h3>MVP 없음</h3>";

        return;

    }

    container.innerHTML=`

<h3>🏆 이번 기간 MVP</h3>

<p><strong>${mvp.name}</strong></p>

<p>평균점수 : ${mvp.average}점</p>

<p>훈련횟수 : ${mvp.count}회</p>

<p>총운동시간 : ${mvp.minutes}분</p>

<hr>

<p>최장 연속훈련 : ${streak.best}일</p>

`;

}

/* ==========================================================
   Growth Rate
========================================================== */

function calculateGrowth(){

    const records=

        getFilteredRecords()

        .filter(record=>

            record.score!==undefined

        );

    if(records.length<2){

        return 0;

    }

    const first=

        Number(records[0].score)||0;

    const last=

        Number(

            records[records.length-1].score

        )||0;

    return last-first;

}
/* ==========================================================
   Grade
========================================================== */

function getGrade(score){

    score=Number(score)||0;

    if(score>=95) return "S";
    if(score>=90) return "A";
    if(score>=80) return "B";
    if(score>=70) return "C";
    if(score>=60) return "D";

    return "F";

}

/* ==========================================================
   Goal Achievement
========================================================== */

function calculateGoalAchievement(){

    const summary=calculateSummary();

    const target=90;

    return Math.min(

        100,

        Math.round(

            (summary.average/target)*100

        )

    );

}

/* ==========================================================
   AI Growth Prediction
========================================================== */

function predictNextScore(){

    const records=getFilteredRecords()

        .filter(record=>record.score!==undefined);

    if(records.length===0){

        return 0;

    }

    const recent=

        records.slice(-5);

    const average=

        recent.reduce(

            (sum,record)=>

            sum+(Number(record.score)||0),

            0

        )/recent.length;

    return Math.round(

        average+2

    );

}

/* ==========================================================
   Season Report
========================================================== */

function renderSeasonReport(){

    let container=document.getElementById(

        "seasonReport"

    );

    if(!container){

        container=document.createElement("div");

        container.id="seasonReport";

        container.className="card";

        document.getElementById(

            "reportPage"

        ).appendChild(container);

    }

    const summary=

        calculateSummary();

    const prediction=

        predictNextScore();

    const grade=

        getGrade(summary.average);

    const goal=

        calculateGoalAchievement();

    container.innerHTML=`

<h3>📄 시즌 리포트</h3>

<p>

훈련횟수 :
<strong>${summary.total}</strong>

</p>

<p>

평균점수 :
<strong>${summary.average}점</strong>

</p>

<p>

훈련등급 :
<strong>${grade}</strong>

</p>

<p>

목표달성률 :
<strong>${goal}%</strong>

</p>

<p>

예상 다음 점수 :
<strong>${prediction}점</strong>

</p>

`;

}

/* ==========================================================
   Report PDF
========================================================== */

function downloadPDF(){

    window.print();

}

/* ==========================================================
   Update Report
========================================================== */

function updateAdvancedReport(){

    renderRanking();

    renderPersonalBest();

    renderMonthlyChart();

    renderMVP();

    renderSeasonReport();

}

/* ==========================================================
   Refresh All
========================================================== */

const originalGenerateReport=generateReport;

generateReport=function(){

    originalGenerateReport();

    updateAdvancedReport();

};