// ===========================
// sports.js
// ===========================

const sportButtons = document.querySelectorAll(".sportBtn");
const skillList = document.getElementById("skillList");
const resultBox = document.getElementById("sportResult");
const startButton = document.getElementById("startSport");

let currentSport = "";
let currentSkill = "";

// ===========================
// 종목별 기술
// ===========================

const sportSkills = {

    "🏀 농구":[
        "점프슛",
        "레이업",
        "드리블",
        "패스",
        "리바운드",
        "수비",
        "플로터",
        "3점슛"
    ],

    "⚽ 축구":[
        "드리블",
        "패스",
        "슈팅",
        "헤딩",
        "크로스",
        "볼컨트롤"
    ],

    "⚾ 야구":[
        "배팅",
        "투구",
        "송구",
        "포구",
        "주루"
    ],

    "🎿 바이애슬론":[
        "스케이팅",
        "더블폴링",
        "사격",
        "다운힐",
        "업힐",
        "코너링"
    ]

};

// ===========================
// 종목 선택
// ===========================

sportButtons.forEach(btn=>{

    btn.onclick=()=>{

        currentSport=btn.textContent.trim();

        loadSkills(currentSport);

    };

});

// ===========================
// 기술 출력
// ===========================

function loadSkills(name){

    skillList.innerHTML="";

    sportSkills[name].forEach(skill=>{

        const button=document.createElement("button");

        button.className="skillBtn";

        button.textContent=skill;

        button.onclick=()=>{

            document

            .querySelectorAll(".skillBtn")

            .forEach(b=>b.classList.remove("active"));

            button.classList.add("active");

            currentSkill=skill;

        };

        skillList.appendChild(button);

    });

}
// ===========================
// 분석 시작
// ===========================

startButton.onclick = () => {

    if(currentSport===""){

        alert("종목을 선택하세요.");

        return;

    }

    if(currentSkill===""){

        alert("기술을 선택하세요.");

        return;

    }

    const score = randomScore();

    const feedback = makeFeedback(

        currentSport,

        currentSkill,

        score

    );

    resultBox.innerHTML = `

<h2>${score}점</h2>

<p>${feedback}</p>

`;

    saveRecord(

        currentSport,

        currentSkill,

        score

    );
showAnalysis(score);
};

// ===========================
// 점수 생성
// ===========================

function randomScore(){

    return Math.floor(

        Math.random()*21

    )+80;

}

// ===========================
// AI 피드백
// ===========================

function makeFeedback(

    sport,

    skill,

    score

){

    let text="";

    if(score>=95){

        text="매우 뛰어난 수행입니다. ";

    }

    else if(score>=90){

        text="우수한 수행입니다. ";

    }

    else if(score>=85){

        text="좋은 수행입니다. ";

    }

    else{

        text="기본기 보완이 필요합니다. ";

    }

    switch(skill){

        case "점프슛":

            text += "릴리즈와 손목 스냅이 안정적입니다.";

            break;

        case "레이업":

            text += "마지막 두 스텝과 마무리를 보완하세요.";

            break;

        case "드리블":

            text += "시선과 볼 컨트롤이 중요합니다.";

            break;

        case "패스":

            text += "패스 타이밍이 좋습니다.";

            break;

        case "리바운드":

            text += "박스아웃을 조금 더 적극적으로 하세요.";

            break;

        case "수비":

            text += "무게중심을 조금 더 낮춰보세요.";

            break;

        case "플로터":

            text += "릴리즈 높이가 좋습니다.";

            break;

        case "3점슛":

            text += "하체 밸런스를 유지하세요.";

            break;

        case "사격":

            text += "호흡과 방아쇠 조작이 안정적입니다.";

            break;

        case "스케이팅":

            text += "글라이딩 시간을 늘려보세요.";

            break;

        case "더블폴링":

            text += "상체 리듬을 일정하게 유지하세요.";

            break;

        default:

            text += "꾸준한 반복 훈련을 추천합니다.";

    }

    return text;

}
// ===========================
// 능력치 계산
// ===========================

function createAbility(score){

    return{

        power:Math.min(100,score+rand(-5,5)),

        accuracy:Math.min(100,score+rand(-6,6)),

        balance:Math.min(100,score+rand(-4,4)),

        speed:Math.min(100,score+rand(-8,8))

    };

}

function rand(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}

// ===========================
// 레이더 차트
// ===========================

function drawRadar(score){

    const canvas=document.getElementById("dashboardChart");

    if(!canvas) return;

    const ctx=canvas.getContext("2d");

    canvas.width=500;

    canvas.height=500;

    ctx.clearRect(0,0,500,500);

    const value=createAbility(score);

    const data=[

        value.power,

        value.accuracy,

        value.balance,

        value.speed

    ];

    const labels=[

        "파워",

        "정확도",

        "밸런스",

        "스피드"

    ];

    const centerX=250;

    const centerY=250;

    const radius=160;

    ctx.strokeStyle="#345";

    for(let i=1;i<=5;i++){

        ctx.beginPath();

        const r=radius*i/5;

        for(let j=0;j<4;j++){

            const angle=Math.PI*2/4*j-Math.PI/2;

            const x=centerX+Math.cos(angle)*r;

            const y=centerY+Math.sin(angle)*r;

            if(j===0){

                ctx.moveTo(x,y);

            }else{

                ctx.lineTo(x,y);

            }

        }

        ctx.closePath();

        ctx.stroke();

    }

    ctx.fillStyle="rgba(0,217,255,.35)";

    ctx.beginPath();

    data.forEach((v,i)=>{

        const angle=Math.PI*2/4*i-Math.PI/2;

        const r=radius*(v/100);

        const x=centerX+Math.cos(angle)*r;

        const y=centerY+Math.sin(angle)*r;

        if(i===0){

            ctx.moveTo(x,y);

        }else{

            ctx.lineTo(x,y);

        }

    });

    ctx.closePath();

    ctx.fill();

    ctx.strokeStyle="#00D9FF";

    ctx.lineWidth=3;

    ctx.stroke();

    ctx.fillStyle="#fff";

    ctx.font="16px Pretendard";

    labels.forEach((t,i)=>{

        const angle=Math.PI*2/4*i-Math.PI/2;

        const x=centerX+Math.cos(angle)*(radius+25);

        const y=centerY+Math.sin(angle)*(radius+25);

        ctx.fillText(t,x-25,y);

    });

}

// ===========================
// AI 종합평가
// ===========================

function finalCoach(score){

    if(score>=95){

        return "🏆 국가대표 수준입니다. 현재 훈련을 유지하며 경기 감각을 높이세요.";

    }

    if(score>=90){

        return "🥇 매우 우수합니다. 세부 기술만 다듬으면 경기력이 더욱 향상됩니다.";

    }

    if(score>=85){

        return "💪 좋은 수준입니다. 반복 훈련으로 안정성을 높이세요.";

    }

    return "🔥 기본기와 체력 훈련 비중을 높이는 것을 추천합니다.";

}

// ===========================
// 분석 화면 업데이트
// ===========================

function showAnalysis(score){

    drawRadar(score);

    resultBox.innerHTML += `

<hr style="margin:20px 0;">

<h3>AI 종합평가</h3>

<p>${finalCoach(score)}</p>

<h3>추천 훈련</h3>

<ul>

<li>기본기 20분</li>

<li>기술 반복 30분</li>

<li>실전 상황 훈련 20분</li>

<li>마무리 스트레칭 10분</li>

</ul>

`;

}