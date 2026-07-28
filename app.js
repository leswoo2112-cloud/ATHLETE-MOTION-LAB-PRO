// ===========================
// 설천고 스포츠과학 훈련센터
// app.js
// ===========================

// 메뉴
const menus = document.querySelectorAll(".menu");
const sections = document.querySelectorAll("section");

// 선수
const athleteSelect = document.getElementById("athlete");
const addAthleteBtn = document.getElementById("addAthlete");

// AI
const coachMessage = document.getElementById("coachMessage");

// 평균점수
const averageScore = document.getElementById("averageScore");

// 현재 선수
let currentAthlete = "";

// 선수 목록
let athletes =
JSON.parse(localStorage.getItem("sscAthletes")) || [];

// 기록
let records =
JSON.parse(localStorage.getItem("sscRecords")) || [];

// =========================
// 메뉴 이동
// =========================

menus.forEach(menu=>{

menu.onclick=()=>{

menus.forEach(m=>m.classList.remove("active"));

menu.classList.add("active");

sections.forEach(page=>{

page.classList.add("hidden");

});

document

.getElementById(menu.dataset.page)

.classList.remove("hidden");

};

});

// =========================
// 선수 목록 출력
// =========================

function loadAthletes(){

athleteSelect.innerHTML="";

athletes.forEach(name=>{

const option=document.createElement("option");

option.value=name;

option.textContent=name;

athleteSelect.appendChild(option);

});

if(athletes.length){

currentAthlete=athletes[0];

athleteSelect.value=currentAthlete;

}

}

loadAthletes();

// =========================
// 선수 등록
// =========================

addAthleteBtn.onclick=()=>{

const name=prompt("선수 이름");

if(!name) return;

athletes.push(name);

localStorage.setItem(

"sscAthletes",

JSON.stringify(athletes)

);

loadAthletes();

};

// =========================
// 선수 변경
// =========================

athleteSelect.onchange=()=>{

currentAthlete=athleteSelect.value;

updateDashboard();

};

// =========================
// 평균 계산
// =========================

function getAverage(){

const list=

records.filter(r=>

r.player===currentAthlete

);

if(list.length===0) return 0;

let sum=0;

list.forEach(r=>{

sum+=Number(r.score);

});

return (sum/list.length).toFixed(1);

}

// =========================
// AI 코치
// =========================

function aiCoach(score){

if(score>=90){

return "🏆 아주 훌륭합니다. 현재 훈련을 유지하세요.";

}

if(score>=80){

return "👍 좋은 상태입니다. 세부 기술을 조금 더 보완하세요.";

}

if(score>=70){

return "💪 꾸준한 훈련이 필요합니다.";

}

return "🔥 기본기 훈련을 추천합니다.";

}
// =========================
// 대시보드 업데이트
// =========================

function updateDashboard(){

    if(currentAthlete==="") return;

    const avg=getAverage();

    averageScore.textContent=avg;

    coachMessage.textContent=aiCoach(avg);

    drawDashboardChart();

}

updateDashboard();

// =========================
// 기록 저장
// =========================

function saveRecord(

    sport,
    skill,
    score

){

    const data={

        player:currentAthlete,

        date:new Date().toLocaleDateString(),

        sport:sport,

        skill:skill,

        score:Number(score)

    };

    records.push(data);

    localStorage.setItem(

        "sscRecords",

        JSON.stringify(records)

    );

    updateDashboard();

    updateRecordTable();

}

// =========================
// 기록 테이블
// =========================

function updateRecordTable(){

    const table=

    document.getElementById(

        "recordTable"

    );

    if(!table) return;

    table.innerHTML="";

    records

    .filter(r=>r.player===currentAthlete)

    .forEach(r=>{

        table.innerHTML+=`

<tr>

<td>${r.date}</td>

<td>${r.sport}</td>

<td>${r.skill}</td>

<td>${r.score}</td>

<td>${aiCoach(r.score)}</td>

</tr>

`;

    });

}

updateRecordTable();

// =========================
// 그래프
// =========================

function drawDashboardChart(){

    const canvas=

    document.getElementById(

        "dashboardChart"

    );

    if(!canvas) return;

    const ctx=

    canvas.getContext("2d");

    canvas.width=700;

    canvas.height=250;

    ctx.clearRect(

        0,

        0,

        canvas.width,

        canvas.height

    );

    const list=

    records

    .filter(r=>

        r.player===currentAthlete

    )

    .slice(-10);

    if(list.length===0) return;

    ctx.beginPath();

    ctx.strokeStyle="#00D9FF";

    ctx.lineWidth=4;

    list.forEach((r,i)=>{

        const x=50+i*60;

        const y=220-r.score*2;

        if(i===0){

            ctx.moveTo(x,y);

        }else{

            ctx.lineTo(x,y);

        }

        ctx.fillStyle="#00D9FF";

        ctx.beginPath();

        ctx.arc(x,y,5,0,Math.PI*2);

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(x,y);

    });

    ctx.stroke();

}

// =========================
// 메모 저장
// =========================

const memo=

document.getElementById(

"coachMemo"

);

const saveMemo=

document.getElementById(

"saveMemo"

);

if(memo){

memo.value=

localStorage.getItem(

"coachMemo"

)||"";

}

if(saveMemo){

saveMemo.onclick=()=>{

localStorage.setItem(

"coachMemo",

memo.value

);

alert("메모 저장 완료");

};

}
// =========================
// CSV 내보내기
// =========================

const exportBtn = document.getElementById("exportCSV");

if (exportBtn) {

    exportBtn.onclick = () => {

        let csv = "날짜,선수,종목,기술,점수\n";

        records.forEach(r => {

            csv += `${r.date},${r.player},${r.sport},${r.skill},${r.score}\n`;

        });

        const blob = new Blob([csv], {

            type: "text/csv;charset=utf-8"

        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "SSC_Records.csv";

        a.click();

        URL.revokeObjectURL(url);

    };

}

// =========================
// 기록 초기화
// =========================

const clearBtn = document.getElementById("clearRecord");

if (clearBtn) {

    clearBtn.onclick = () => {

        if (!confirm("기록을 모두 삭제하시겠습니까?")) return;

        records = [];

        localStorage.removeItem("sscRecords");

        updateDashboard();

        updateRecordTable();

        alert("기록이 초기화되었습니다.");

    };

}

// =========================
// 보고서 생성
// =========================

const makeReport = document.getElementById("makeReport");

if (makeReport) {

    makeReport.onclick = () => {

        const list = records.filter(

            r => r.player === currentAthlete

        );

        if (list.length === 0) {

            alert("기록이 없습니다.");

            return;

        }

        const avg = getAverage();

        const best = Math.max(

            ...list.map(r => Number(r.score))

        );

        document.getElementById("reportAverage").textContent = avg;

        document.getElementById("reportBest").textContent = best;

        document.getElementById("reportCount").textContent = list.length;

        document.getElementById("reportAI").textContent = aiCoach(avg);

        drawReportChart();

    };

}

// =========================
// 보고서 그래프
// =========================

function drawReportChart() {

    const canvas = document.getElementById("reportChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = 800;

    canvas.height = 300;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const list = records.filter(

        r => r.player === currentAthlete

    );

    if(list.length===0) return;

    ctx.strokeStyle="#00D9FF";

    ctx.lineWidth=4;

    ctx.beginPath();

    list.forEach((r,i)=>{

        const x=60+i*60;

        const y=250-r.score*2;

        if(i===0){

            ctx.moveTo(x,y);

        }else{

            ctx.lineTo(x,y);

        }

        ctx.fillStyle="#00D9FF";

        ctx.beginPath();

        ctx.arc(x,y,5,0,Math.PI*2);

        ctx.fill();

        ctx.beginPath();

        ctx.moveTo(x,y);

    });

    ctx.stroke();

}

// =========================
// PDF / 인쇄
// =========================

const printBtn = document.getElementById("printReport");

if (printBtn) {

    printBtn.onclick = () => {

        window.print();

    };

}

// =========================
// 시작
// =========================

window.onload = () => {

    loadAthletes();

    updateDashboard();

    updateRecordTable();

};