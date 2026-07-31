/* ============================================================
   pose.js
   설천고 스포츠과학 훈련센터
   Pose Analysis Module
   Version 1.0
============================================================ */

/* -----------------------------
   LocalStorage Key
------------------------------ */
const POSE_STORAGE_KEY = "st_pose_records";

/* -----------------------------
   전역 변수
------------------------------ */
let poseRecords = [];
let currentEditId = null;
let poseChart = null;
let currentPoseScore = 0;
let currentFeedback = [];

/* -----------------------------
   DOM
------------------------------ */
const startBtn = document.getElementById("startPoseAnalysisButton");
const saveBtn = document.getElementById("savePoseRecordButton");

const poseScoreElement = document.getElementById("poseScore");
const poseFeedbackList = document.getElementById("poseFeedbackList");

const athleteInput = document.getElementById("captureAthleteName");
const movementInput = document.getElementById("captureMovementName");
const memoInput = document.getElementById("captureMemoInput");

const scoreInput = document.getElementById("capturePoseScore");

/* -----------------------------
   시작
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {

    loadPoseRecords();

    initializeChart();

    updateStatistics();

    renderPoseTable();

});

/* -----------------------------
   분석 버튼
------------------------------ */
startBtn?.addEventListener("click", () => {

    analyzePose();

});

/* -----------------------------
   저장 버튼
------------------------------ */
saveBtn?.addEventListener("click", () => {

    savePoseRecord();

});

/* ============================================================
   Pose 분석
============================================================ */

function analyzePose(){

    const shoulder = random(82,100);
    const hip = random(80,100);
    const knee = random(75,100);
    const balance = random(70,100);
    const stability = random(78,100);

    currentPoseScore = calculateScore([
        shoulder,
        hip,
        knee,
        balance,
        stability
    ]);

    scoreInput.value = currentPoseScore;
    poseScoreElement.textContent = currentPoseScore + "점";

    currentFeedback = [];

    if(shoulder>=90){

        currentFeedback.push("✔ 어깨 정렬이 매우 안정적입니다.");

    }else{

        currentFeedback.push("△ 어깨 높이를 조금 맞춰주세요.");

    }

    if(hip>=90){

        currentFeedback.push("✔ 골반 중심이 좋습니다.");

    }else{

        currentFeedback.push("△ 골반이 약간 기울어져 있습니다.");

    }

    if(knee>=90){

        currentFeedback.push("✔ 무릎 정렬이 좋습니다.");

    }else{

        currentFeedback.push("△ 무릎 방향을 조금 수정하세요.");

    }

    if(balance>=90){

        currentFeedback.push("✔ 균형 유지가 뛰어납니다.");

    }else{

        currentFeedback.push("△ 중심 이동을 줄여보세요.");

    }

    if(stability>=90){

        currentFeedback.push("✔ 자세 안정성이 우수합니다.");

    }else{

        currentFeedback.push("△ 코어를 조금 더 사용하세요.");

    }

    renderFeedback();

}

/* ============================================================
   점수 계산
============================================================ */

function calculateScore(arr){

    let total = 0;

    arr.forEach(v=>{

        total += v;

    });

    return Math.round(total / arr.length);

}

/* ============================================================
   의견 출력
============================================================ */

function renderFeedback(){

    poseFeedbackList.innerHTML="";

    currentFeedback.forEach(item=>{

        const li=document.createElement("li");

        li.textContent=item;

        poseFeedbackList.appendChild(li);

    });

}

/* ============================================================
   랜덤
============================================================ */

function random(min,max){

    return Math.floor(Math.random()*(max-min+1))+min;

}
/* ============================================================
   저장
============================================================ */

function savePoseRecord() {

    const athlete = athleteInput.value.trim();
    const movement = movementInput.value.trim();
    const memo = memoInput.value.trim();

    if (!athlete) {
        alert("선수명을 입력하세요.");
        athleteInput.focus();
        return;
    }

    if (!movement) {
        alert("운동 종목을 입력하세요.");
        movementInput.focus();
        return;
    }

    if (currentPoseScore <= 0) {
        alert("먼저 자세 분석을 진행하세요.");
        return;
    }

    const record = {
        id: currentEditId ?? Date.now(),
        athlete,
        movement,
        score: currentPoseScore,
        memo,
        feedback: [...currentFeedback],
        date: new Date().toLocaleString()
    };

    if (currentEditId === null) {

        poseRecords.push(record);

    } else {

        const index = poseRecords.findIndex(r => r.id === currentEditId);

        if (index !== -1) {
            poseRecords[index] = record;
        }

        currentEditId = null;
        saveBtn.textContent = "저장";
    }

    savePoseRecords();

    renderPoseTable();

    updateStatistics();

    updateChart();

    clearPoseForm();

}

/* ============================================================
   LocalStorage 저장
============================================================ */

function savePoseRecords() {

    localStorage.setItem(
        POSE_STORAGE_KEY,
        JSON.stringify(poseRecords)
    );

}

/* ============================================================
   LocalStorage 불러오기
============================================================ */

function loadPoseRecords() {

    const data = localStorage.getItem(POSE_STORAGE_KEY);

    if (!data) {

        poseRecords = [];

        return;

    }

    poseRecords = JSON.parse(data);

}

/* ============================================================
   수정
============================================================ */

function editPoseRecord(id) {

    const record = poseRecords.find(r => r.id === id);

    if (!record) return;

    athleteInput.value = record.athlete;
    movementInput.value = record.movement;
    memoInput.value = record.memo;

    currentPoseScore = record.score;

    scoreInput.value = record.score;

    poseScoreElement.textContent = record.score + "점";

    currentFeedback = [...record.feedback];

    renderFeedback();

    currentEditId = id;

    saveBtn.textContent = "수정 완료";

}

/* ============================================================
   삭제
============================================================ */

function deletePoseRecord(id) {

    if (!confirm("삭제하시겠습니까?")) return;

    poseRecords = poseRecords.filter(r => r.id !== id);

    savePoseRecords();

    renderPoseTable();

    updateStatistics();

    updateChart();

}

/* ============================================================
   입력 초기화
============================================================ */

function clearPoseForm() {

    athleteInput.value = "";
    movementInput.value = "";
    memoInput.value = "";

    scoreInput.value = "";

    poseScoreElement.textContent = "0점";

    currentPoseScore = 0;

    currentFeedback = [];

    poseFeedbackList.innerHTML = "";

}

/* ============================================================
   테이블 출력
============================================================ */

function renderPoseTable() {

    const tbody = document.getElementById("poseTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    poseRecords.forEach(record => {

        tbody.innerHTML += `
        <tr>

            <td>${record.athlete}</td>

            <td>${record.movement}</td>

            <td>${record.score}</td>

            <td>${record.date}</td>

            <td>

                <button onclick="editPoseRecord(${record.id})">
                    수정
                </button>

                <button onclick="deletePoseRecord(${record.id})">
                    삭제
                </button>

            </td>

        </tr>
        `;

    });

}
/* ============================================================
   검색
============================================================ */

function searchPose(keyword = "") {

    keyword = keyword.toLowerCase().trim();

    const tbody = document.getElementById("poseTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    poseRecords
        .filter(record => {

            return (
                record.athlete.toLowerCase().includes(keyword) ||
                record.movement.toLowerCase().includes(keyword)
            );

        })
        .forEach(record => {

            tbody.innerHTML += `
            <tr>

                <td>${record.athlete}</td>
                <td>${record.movement}</td>
                <td>${record.score}</td>
                <td>${record.date}</td>

                <td>

                    <button onclick="editPoseRecord(${record.id})">
                    수정
                    </button>

                    <button onclick="deletePoseRecord(${record.id})">
                    삭제
                    </button>

                </td>

            </tr>
            `;

        });

}

/* ============================================================
   종목 필터
============================================================ */

function filterMovement(type){

    const tbody=document.getElementById("poseTableBody");

    if(!tbody) return;

    tbody.innerHTML="";

    let list=poseRecords;

    if(type!=="전체"){

        list=poseRecords.filter(r=>r.movement===type);

    }

    list.forEach(record=>{

        tbody.innerHTML+=`
        <tr>

            <td>${record.athlete}</td>

            <td>${record.movement}</td>

            <td>${record.score}</td>

            <td>${record.date}</td>

            <td>

            <button onclick="editPoseRecord(${record.id})">

            수정

            </button>

            <button onclick="deletePoseRecord(${record.id})">

            삭제

            </button>

            </td>

        </tr>
        `;

    });

}

/* ============================================================
   통계
============================================================ */

function updateStatistics(){

    if(poseRecords.length===0){

        document.getElementById("poseAverage").textContent="0";

        document.getElementById("poseBest").textContent="0";

        document.getElementById("poseWorst").textContent="0";

        return;

    }

    const scores=poseRecords.map(r=>r.score);

    const avg=Math.round(

        scores.reduce((a,b)=>a+b,0)/scores.length

    );

    const best=Math.max(...scores);

    const worst=Math.min(...scores);

    document.getElementById("poseAverage").textContent=avg;

    document.getElementById("poseBest").textContent=best;

    document.getElementById("poseWorst").textContent=worst;

}

/* ============================================================
   Chart.js
============================================================ */

function initializeChart(){

    const canvas=document.getElementById("poseChart");

    if(!canvas) return;

    poseChart=new Chart(canvas,{

        type:"line",

        data:{

            labels:[],

            datasets:[{

                label:"자세 점수",

                data:[],

                borderWidth:3,

                tension:0.3,

                fill:false

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

    });

}

/* ============================================================
   그래프 업데이트
============================================================ */

function updateChart(){

    if(!poseChart) return;

    poseChart.data.labels=

    poseRecords.map(r=>r.athlete);

    poseChart.data.datasets[0].data=

    poseRecords.map(r=>r.score);

    poseChart.update();

}

/* ============================================================
   자동 AI 분석
============================================================ */

function generateAnalysis(score){

    if(score>=95){

        return "국가대표 수준의 매우 안정적인 자세입니다.";

    }

    if(score>=90){

        return "자세가 매우 우수합니다. 현재 상태를 유지하세요.";

    }

    if(score>=80){

        return "좋은 자세입니다. 코어 안정성을 조금 더 높여보세요.";

    }

    if(score>=70){

        return "무릎과 골반 정렬을 조금 보완하면 더욱 좋아집니다.";

    }

    if(score>=60){

        return "기본 자세는 좋지만 중심 이동이 큽니다.";

    }

    return "기본 자세부터 다시 연습하는 것을 권장합니다.";

}
/* ============================================================
   CSV 다운로드
============================================================ */

function exportPoseCSV() {

    if (poseRecords.length === 0) {
        alert("저장된 기록이 없습니다.");
        return;
    }

    let csv = "선수명,운동종목,점수,메모,날짜\n";

    poseRecords.forEach(record => {

        csv += `"${record.athlete}",`;
        csv += `"${record.movement}",`;
        csv += `"${record.score}",`;
        csv += `"${record.memo}",`;
        csv += `"${record.date}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "pose_records.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

/* ============================================================
   날짜 정렬
============================================================ */

function sortPoseNewest() {

    poseRecords.sort((a, b) => b.id - a.id);

    renderPoseTable();

}

function sortPoseOldest() {

    poseRecords.sort((a, b) => a.id - b.id);

    renderPoseTable();

}

/* ============================================================
   최고 점수 강조
============================================================ */

function highlightBestRecord() {

    if (poseRecords.length === 0) return;

    const best = Math.max(...poseRecords.map(r => r.score));

    const rows = document.querySelectorAll("#poseTableBody tr");

    rows.forEach((row, index) => {

        row.classList.remove("best-score");

        if (poseRecords[index].score === best) {

            row.classList.add("best-score");

        }

    });

}

/* ============================================================
   AI 리포트 생성
============================================================ */

function createPoseReport(record) {

    let level = "";

    if (record.score >= 95) {

        level = "A+";

    } else if (record.score >= 90) {

        level = "A";

    } else if (record.score >= 80) {

        level = "B";

    } else if (record.score >= 70) {

        level = "C";

    } else {

        level = "D";

    }

    return `
=========================
설천고 스포츠과학 훈련센터

자세 분석 리포트
=========================

선수 : ${record.athlete}

종목 : ${record.movement}

점수 : ${record.score}점

등급 : ${level}

AI 분석

${generateAnalysis(record.score)}

메모

${record.memo}

분석일

${record.date}

=========================
`;

}

/* ============================================================
   리포트 다운로드
============================================================ */

function downloadPoseReport(id){

    const record = poseRecords.find(r=>r.id===id);

    if(!record) return;

    const text = createPoseReport(record);

    const blob = new Blob([text],{

        type:"text/plain"

    });

    const url = URL.createObjectURL(blob);

    const a=document.createElement("a");

    a.href=url;

    a.download=`${record.athlete}_Pose_Report.txt`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);

}

/* ============================================================
   검색 이벤트
============================================================ */

const searchInput = document.getElementById("poseSearchInput");

if(searchInput){

    searchInput.addEventListener("keyup",(e)=>{

        searchPose(e.target.value);

    });

}

/* ============================================================
   필터 이벤트
============================================================ */

const filterSelect=document.getElementById("poseFilter");

if(filterSelect){

    filterSelect.addEventListener("change",(e)=>{

        filterMovement(e.target.value);

    });

}

/* ============================================================
   페이지 최초 실행
============================================================ */

loadPoseRecords();

renderPoseTable();

initializeChart();

updateChart();

updateStatistics();

highlightBestRecord();

/* ============================================================
   End of pose.js
============================================================ */