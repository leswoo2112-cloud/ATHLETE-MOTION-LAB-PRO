/* ==========================================
   report.js Part 1
   리포트 생성
========================================== */

"use strict";

/* ---------- 리포트 ---------- */

function generateReport(){

    const athleteId =
        $("#reportAthleteSelect").value;

    const period =
        Number($("#reportPeriodSelect").value);

    const today = new Date();

    const limit = new Date();

    limit.setDate(

        today.getDate()-period

    );

    const sports = appData.sportsRecords.filter(record=>{

        return (

            (!athleteId || record.athleteId===athleteId)

            &&

            new Date(record.date)>=limit

        );

    });

    const weight = appData.weightRecords.filter(record=>{

        return (

            (!athleteId || record.athleteId===athleteId)

            &&

            new Date(record.date)>=limit

        );

    });

    const pose = appData.poseRecords.filter(record=>{

        return (

            (!athleteId || record.athleteId===athleteId)

            &&

            new Date(record.date)>=limit

        );

    });

    const totalTraining =

        sports.length +

        weight.length +

        pose.length;

    const scores = [

        ...sports.map(r=>Number(r.score||0)),

        ...pose.map(r=>Number(r.score||0))

    ];

    const average =

        scores.length

        ? Math.round(

            scores.reduce((a,b)=>a+b,0)

            /scores.length

        )

        : 0;

    const best =

        scores.length

        ? Math.max(...scores)

        : 0;

    const minutes =

        sports.reduce(

            (a,b)=>a+Number(b.duration||0),

            0

        );

    $("#reportTotalTraining").textContent =
        totalTraining+"회";

    $("#reportAverageScore").textContent =
        average+"점";

    $("#reportBestScore").textContent =
        best+"점";

    $("#reportTotalMinutes").textContent =
        minutes+"분";

    drawScoreChart(scores);

    drawTrainingTypeChart(

        sports.length,

        weight.length,

        pose.length

    );

    createAIReport(

        totalTraining,

        average,

        best

    );

}
/* ==========================================
   report.js Part 2
   Chart.js 그래프
========================================== */

let scoreChart = null;
let trainingTypeChart = null;

/* ---------- 점수 그래프 ---------- */

function drawScoreChart(scores){

    const canvas = $("#scoreChart");

    if(!canvas) return;

    if(scoreChart){

        scoreChart.destroy();

    }

    scoreChart = new Chart(canvas,{

        type:"line",

        data:{

            labels:scores.map((_,i)=>`#${i+1}`),

            datasets:[{

                label:"훈련 점수",

                data:scores,

                tension:0.3,

                fill:false

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            scales:{

                y:{

                    beginAtZero:true,

                    max:100

                }

            }

        }

    });

}

/* ---------- 훈련 비율 ---------- */

function drawTrainingTypeChart(sports,weight,pose){

    const canvas=$("#trainingTypeChart");

    if(!canvas) return;

    if(trainingTypeChart){

        trainingTypeChart.destroy();

    }

    trainingTypeChart = new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:[

                "종목훈련",

                "웨이트",

                "AI 자세"

            ],

            datasets:[{

                data:[

                    sports,

                    weight,

                    pose

                ]

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}
/* ==========================================
   report.js Part 3
   AI 리포트 / 최고기록 / PDF / 초기화
========================================== */

/* ---------- AI 리포트 ---------- */

function createAIReport(total, average, best){

    const text = $("#reportAnalysisText");

    if(!text) return;

    let result = "";

    if(total===0){

        result =
        "훈련 기록이 없습니다.";

    }else{

        result += `총 ${total}회의 훈련을 진행했습니다.\n`;

        if(average>=90){

            result +=
            "훈련 수준이 매우 우수합니다.\n";

        }else if(average>=80){

            result +=
            "꾸준한 훈련이 유지되고 있습니다.\n";

        }else{

            result +=
            "기초 체력과 기술 보완이 필요합니다.\n";

        }

        result +=
        `최고 점수는 ${best}점입니다.`;

    }

    text.textContent = result;

}

/* ---------- 최고 기록 ---------- */

function updateBestRecords(){

    const list = $("#reportBestRecords");

    if(!list) return;

    list.innerHTML="";

    const bestSports =

        [...appData.sportsRecords]

        .sort((a,b)=>b.score-a.score)[0];

    const bestPose =

        [...appData.poseRecords]

        .sort((a,b)=>b.score-a.score)[0];

    if(bestSports){

        list.innerHTML +=
        `<li>🏃 종목훈련 : ${bestSports.score}점</li>`;

    }

    if(bestPose){

        list.innerHTML +=
        `<li>📷 AI 자세 : ${bestPose.score}점</li>`;

    }

    if(!bestSports && !bestPose){

        list.innerHTML =
        "<li>기록이 없습니다.</li>";

    }

}

/* ---------- PDF ---------- */

function printReport(){

    window.print();

}

/* ---------- 선수 목록 ---------- */

function updateReportAthleteSelect(){

    const select =
        $("#reportAthleteSelect");

    if(!select) return;

    select.innerHTML =
    `<option value="">전체 선수</option>`;

    appData.athletes.forEach(athlete=>{

        select.innerHTML +=

        `<option value="${athlete.id}">
            ${athlete.name}
        </option>`;

    });

}

/* ---------- 페이지 ---------- */

function renderReportPage(){

    updateReportAthleteSelect();

    updateBestRecords();

}

/* ---------- 이벤트 ---------- */

function initializeReportModule(){

    renderReportPage();

    $("#generateReportButton")
    ?.addEventListener(

        "click",

        ()=>{

            generateReport();

            updateBestRecords();

        }

    );

    $("#printReportButton")
    ?.addEventListener(

        "click",

        printReport

    );

}

/* ---------- Export ---------- */

window.renderReportPage =
    renderReportPage;

window.initializeReportModule =
    initializeReportModule;

window.generateReport =
    generateReport;

/* ---------- 시작 ---------- */

document.addEventListener(

    "DOMContentLoaded",

    initializeReportModule

);