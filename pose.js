/* ==========================================
   pose.js Part 1
   카메라 시작 / 종료
========================================== */

"use strict";

let cameraStream = null;

/* ---------- 카메라 시작 ---------- */

async function startCamera(){

    const video = $("#cameraVideo");

    if(!video) return;

    try{

        cameraStream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user",
                width:640,
                height:480
            },

            audio:false

        });

        video.srcObject = cameraStream;

        await video.play();

        showToast(
            "카메라가 시작되었습니다.",
            "success"
        );

    }

    catch(error){

        console.error(error);

        showToast(
            "카메라를 사용할 수 없습니다.",
            "error"
        );

    }

}

/* ---------- 카메라 종료 ---------- */

function stopCamera(){

    if(cameraStream){

        cameraStream.getTracks().forEach(track=>{

            track.stop();

        });

    }

    $("#cameraVideo").srcObject = null;

    cameraStream = null;

    showToast(
        "카메라를 종료했습니다."
    );

}
/* ==========================================
   pose.js Part 2
   AI 자세 분석
========================================== */

let currentPoseScore = 0;

/* ---------- 점수 계산 ---------- */

function analyzePose(){

    const movement =
        $("#poseMovementSelect").value;

    let score =
        Math.floor(Math.random()*21)+80;

    if(movement==="squat"){

        score += 3;

    }

    if(movement==="plank"){

        score += 2;

    }

    if(score>100){

        score=100;

    }

    currentPoseScore=score;

    $("#poseScore").textContent=
        `${score}점`;

    updatePoseFeedback(score);

}

/* ---------- 피드백 ---------- */

function updatePoseFeedback(score){

    const list=$("#poseFeedbackList");

    if(!list) return;

    list.innerHTML="";

    let feedback=[];

    if(score>=95){

        feedback=[

            "✅ 자세가 매우 안정적입니다.",

            "✅ 현재 자세를 유지하세요.",

            "✅ 운동 수행 능력이 우수합니다."

        ];

    }

    else if(score>=85){

        feedback=[

            "👍 전반적으로 좋은 자세입니다.",

            "조금만 더 깊게 움직여 보세요.",

            "호흡을 일정하게 유지하세요."

        ];

    }

    else{

        feedback=[

            "⚠ 무릎과 허리 정렬을 확인하세요.",

            "천천히 반복하는 것이 좋습니다.",

            "거울을 보며 자세를 교정하세요."

        ];

    }

    feedback.forEach(text=>{

        list.innerHTML +=

        `<li>${text}</li>`;

    });

}

/* ---------- AI 시작 ---------- */

function startPoseAnalysis(){

    analyzePose();

    window.poseTimer = setInterval(

        analyzePose,

        1000

    );

}

/* ---------- AI 종료 ---------- */

function stopPoseAnalysis(){

    clearInterval(window.poseTimer);

}
/* ==========================================
   pose.js Part 3
   기록 저장 / 목록 출력 / 삭제
========================================== */

/* ---------- 기록 저장 ---------- */

function savePoseRecord(){

    const athleteId =
        $("#cameraAthleteSelect").value;

    if(!athleteId){

        showToast(
            "선수를 선택하세요.",
            "error"
        );

        return;
    }

    const record={

        id:createId("pose"),

        athleteId,

        movement:
        $("#poseMovementSelect").value,

        direction:
        $("#cameraDirectionSelect").value,

        score:
        currentPoseScore,

        grade:
        currentPoseScore>=90
            ? "A"
            : currentPoseScore>=80
            ? "B"
            : "C",

        date:getTodayValue(),

        createdAt:
        new Date().toISOString()

    };

    appData.poseRecords.unshift(record);

    autoSave();

    renderPoseTable();

    renderDashboard();

    showToast(
        "자세 분석 기록 저장 완료",
        "success"
    );

}

/* ---------- 목록 ---------- */

function renderPoseTable(){

    const tbody=$("#poseTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    appData.poseRecords.forEach(record=>{

        const athlete=
            appData.athletes.find(
                a=>a.id===record.athleteId
            );

        tbody.innerHTML += `

<tr>

<td>${record.date}</td>

<td>${athlete ? athlete.name : "-"}</td>

<td>${record.movement}</td>

<td>${record.score}점</td>

<td>${record.grade}</td>

<td>

<button
onclick="deletePoseRecord('${record.id}')">

삭제

</button>

</td>

</tr>

`;

    });

}

/* ---------- 삭제 ---------- */

function deletePoseRecord(id){

    if(!confirm("삭제하시겠습니까?")){

        return;

    }

    appData.poseRecords =
        appData.poseRecords.filter(
            record=>record.id!==id
        );

    autoSave();

    renderPoseTable();

    renderDashboard();

    showToast(
        "삭제되었습니다.",
        "success"
    );

}
/* ==========================================
   pose.js Part 4
   초기화 / 이벤트 / Export
========================================== */

/* ---------- 선수 목록 ---------- */

function updatePoseAthleteSelect(){

    const select = $("#cameraAthleteSelect");

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

/* ---------- 페이지 ---------- */

function renderPosePage(){

    updatePoseAthleteSelect();

    renderPoseTable();

}

/* ---------- 이벤트 ---------- */

function initializePoseModule(){

    $("#startCameraButton")
    ?.addEventListener("click",()=>{

        startCamera();

        startPoseAnalysis();

    });

    $("#stopCameraButton")
    ?.addEventListener("click",()=>{

        stopPoseAnalysis();

        stopCamera();

    });

    $("#savePoseRecordButton")
    ?.addEventListener(

        "click",

        savePoseRecord

    );

    renderPosePage();

}

/* ---------- Export ---------- */

window.renderPosePage =
    renderPosePage;

window.initializePoseModule =
    initializePoseModule;

window.startCamera =
    startCamera;

window.stopCamera =
    stopCamera;

window.savePoseRecord =
    savePoseRecord;

/* ---------- 시작 ---------- */

document.addEventListener(

    "DOMContentLoaded",

    initializePoseModule

);