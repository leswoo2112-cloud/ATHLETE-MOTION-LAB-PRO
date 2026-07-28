// ===========================
// pose.js
// AI 카메라
// ===========================

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const cameraStart =
document.getElementById("cameraStart");

const cameraStop =
document.getElementById("cameraStop");

const capture =
document.getElementById("capture");

const liveFeedback =
document.getElementById("liveFeedback");

let stream = null;

// ===========================
// 카메라 시작
// ===========================

cameraStart.onclick = async () => {

    try{

        stream =
        await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user",
                width:1280,
                height:720
            },

            audio:false

        });

        video.srcObject = stream;

        liveFeedback.innerHTML =

        "📷 카메라 연결 완료";

    }

    catch(e){

        alert("카메라 권한을 허용해주세요.");

    }

};

// ===========================
// 카메라 종료
// ===========================

cameraStop.onclick = ()=>{

    if(stream){

        stream.getTracks().forEach(track=>{

            track.stop();

        });

    }

    video.srcObject=null;

    liveFeedback.innerHTML=

    "카메라 종료";

};

// ===========================
// 캡처
// ===========================

capture.onclick=()=>{

    const ctx=

    canvas.getContext("2d");

    canvas.width=640;

    canvas.height=480;

    ctx.drawImage(

        video,

        0,

        0,

        640,

        480

    );

    analysePose();

};

// ===========================
// AI 자세 분석
// ===========================

function analysePose(){

    const score=

    Math.floor(

        Math.random()*21

    )+80;

    const message=

    createPoseFeedback(

        score

    );

    liveFeedback.innerHTML=`

<h2>

AI 자세 분석

</h2>

<h1>

${score}점

</h1>

<p>

${message}

</p>

`;

    saveRecord(

        "AI자세",

        "자세측정",

        score

    );
showPoseResult(score);
}
// ===========================
// AI 피드백
// ===========================

function createPoseFeedback(score){

    if(score>=95){

        return "🏆 매우 안정적인 자세입니다. 현재 자세를 유지하세요.";

    }

    if(score>=90){

        return "🥇 좋은 자세입니다. 무게중심을 조금 더 일정하게 유지하면 좋습니다.";

    }

    if(score>=85){

        return "💪 평균 이상의 자세입니다. 팔과 다리의 타이밍을 맞춰보세요.";

    }

    return "🔥 자세 교정이 필요합니다. 기본 동작을 반복 연습하세요.";

}

// ===========================
// 관절 좌표(가상)
// ===========================

function createSkeleton(){

    return{

        shoulder:rand(80,100),

        hip:rand(80,100),

        knee:rand(80,100),

        ankle:rand(80,100)

    };

}

// ===========================
// 스쿼트 분석
// ===========================

function analyseSquat(){

    const body=createSkeleton();

    let score=90;

    if(body.knee<85) score-=5;
    if(body.hip<85) score-=3;
    if(body.ankle<85) score-=2;

    return{

        score,

        tip:"무릎과 엉덩이의 깊이를 일정하게 유지하세요."

    };

}

// ===========================
// 데드리프트 분석
// ===========================

function analyseDeadlift(){

    const body=createSkeleton();

    let score=92;

    if(body.shoulder<85) score-=4;
    if(body.hip<85) score-=2;

    return{

        score,

        tip:"허리를 중립으로 유지하고 바벨을 몸 가까이에 두세요."

    };

}

// ===========================
// 점프슛 분석
// ===========================

function analyseJumpShot(){

    const score=rand(85,99);

    return{

        score,

        tip:"릴리즈 순간 손목 스냅을 조금 더 사용해보세요."

    };

}

// ===========================
// 바이애슬론 분석
// ===========================

function analyseBiathlon(){

    const score=rand(86,99);

    return{

        score,

        tip:"사격 전 호흡을 일정하게 유지하면 명중률 향상에 도움이 됩니다."

    };

}
// ===========================
// 스켈레톤 그리기
// ===========================

function drawSkeleton(){

    const ctx = canvas.getContext("2d");

    const points = [

        {x:320,y:80},    // 머리
        {x:320,y:150},   // 목
        {x:260,y:220},   // 왼어깨
        {x:380,y:220},   // 오른어깨
        {x:280,y:320},   // 왼손
        {x:360,y:320},   // 오른손
        {x:320,y:260},   // 허리
        {x:280,y:400},   // 왼무릎
        {x:360,y:400},   // 오른무릎
        {x:280,y:470},   // 왼발
        {x:360,y:470}    // 오른발

    ];

    ctx.strokeStyle="#00D9FF";
    ctx.lineWidth=4;

    for(let i=0;i<points.length-1;i++){

        ctx.beginPath();

        ctx.moveTo(
            points[i].x,
            points[i].y
        );

        ctx.lineTo(
            points[i+1].x,
            points[i+1].y
        );

        ctx.stroke();

    }

    ctx.fillStyle="#00D9FF";

    points.forEach(p=>{

        ctx.beginPath();

        ctx.arc(

            p.x,
            p.y,
            6,
            0,
            Math.PI*2

        );

        ctx.fill();

    });

}

// ===========================
// 실시간 점수
// ===========================

function showLiveScore(score){

    const color =

    score>=90

    ? "#00D9FF"

    : "#FFAA00";

    liveFeedback.innerHTML += `

<hr>

<h3 style="color:${color};">

실시간 자세 점수

</h3>

<h1>

${score}점

</h1>

`;

}

// ===========================
// AI 코치
// ===========================

function liveCoach(score){

    if(score>=95){

        return "🏆 자세가 매우 안정적입니다.";

    }

    if(score>=90){

        return "🥇 조금만 보완하면 최고 수준입니다.";

    }

    if(score>=85){

        return "💪 기본 자세는 좋지만 균형을 조금 더 유지하세요.";

    }

    return "🔥 무릎과 허리 정렬을 먼저 교정하는 것을 추천합니다.";

}

// ===========================
// 결과 출력
// ===========================

function showPoseResult(score){

    drawSkeleton();

    showLiveScore(score);

    liveFeedback.innerHTML += `

<p>

${liveCoach(score)}

</p>

`;

}
// ===========================
// 실시간 분석 상태
// ===========================

let analysing = false;
let animationId = null;
let lastFrameTime = 0;
let frameCount = 0;
let currentFps = 0;

// ===========================
// 실시간 분석 시작
// ===========================

function startLiveAnalysis(){

    if(!stream){

        alert("먼저 카메라를 시작하세요.");

        return;

    }

    analysing = true;

    lastFrameTime = performance.now();

    frameCount = 0;

    liveFeedback.innerHTML = `
        <h3>실시간 자세 분석 중</h3>
        <p>카메라 앞에서 전신이 보이도록 움직여주세요.</p>
    `;

    analyseFrame();

}

// ===========================
// 프레임 분석
// ===========================

function analyseFrame(){

    if(!analysing) return;

    const ctx = canvas.getContext("2d");

    canvas.width = 640;
    canvas.height = 480;

    if(video.readyState >= 2){

        ctx.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const liveScore = rand(82,98);

        drawLiveSkeleton(ctx);

        drawScoreOverlay(
            ctx,
            liveScore
        );

        updateFps();

    }

    animationId =
    requestAnimationFrame(
        analyseFrame
    );

}

// ===========================
// 실시간 스켈레톤
// ===========================

function drawLiveSkeleton(ctx){

    const points = {

        head:{x:320,y:70},

        neck:{x:320,y:125},

        leftShoulder:{x:255,y:155},

        rightShoulder:{x:385,y:155},

        leftElbow:{x:220,y:235},

        rightElbow:{x:420,y:235},

        leftHand:{x:205,y:315},

        rightHand:{x:435,y:315},

        hip:{x:320,y:265},

        leftKnee:{x:275,y:375},

        rightKnee:{x:365,y:375},

        leftFoot:{x:260,y:460},

        rightFoot:{x:380,y:460}

    };

    const lines = [

        ["head","neck"],

        ["neck","leftShoulder"],

        ["neck","rightShoulder"],

        ["leftShoulder","leftElbow"],

        ["leftElbow","leftHand"],

        ["rightShoulder","rightElbow"],

        ["rightElbow","rightHand"],

        ["neck","hip"],

        ["hip","leftKnee"],

        ["hip","rightKnee"],

        ["leftKnee","leftFoot"],

        ["rightKnee","rightFoot"]

    ];

    ctx.strokeStyle = "#00D9FF";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    lines.forEach(line=>{

        const start =
        points[line[0]];

        const end =
        points[line[1]];

        ctx.beginPath();

        ctx.moveTo(
            start.x,
            start.y
        );

        ctx.lineTo(
            end.x,
            end.y
        );

        ctx.stroke();

    });

    ctx.fillStyle = "#FFFFFF";

    Object.values(points).forEach(point=>{

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            6,
            0,
            Math.PI*2
        );

        ctx.fill();

    });

}

// ===========================
// 점수 오버레이
// ===========================

function drawScoreOverlay(

    ctx,

    score

){

    ctx.fillStyle =
    "rgba(6,18,30,.82)";

    ctx.fillRect(
        18,
        18,
        205,
        96
    );

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px sans-serif";

    ctx.fillText(
        "AI POSTURE SCORE",
        34,
        48
    );

    ctx.fillStyle =
    score>=90
    ? "#00D9FF"
    : "#FFB547";

    ctx.font =
    "bold 38px sans-serif";

    ctx.fillText(
        `${score}`,
        34,
        91
    );

    ctx.fillStyle = "#94A8BC";
    ctx.font = "15px sans-serif";

    ctx.fillText(
        `${currentFps} FPS`,
        132,
        88
    );

}

// ===========================
// FPS 계산
// ===========================

function updateFps(){

    frameCount++;

    const now =
    performance.now();

    const elapsed =
    now-lastFrameTime;

    if(elapsed>=1000){

        currentFps =
        Math.round(
            frameCount*1000/elapsed
        );

        frameCount = 0;

        lastFrameTime = now;

    }

}

// ===========================
// 실시간 분석 종료
// ===========================

function stopLiveAnalysis(){

    analysing = false;

    if(animationId){

        cancelAnimationFrame(
            animationId
        );

        animationId = null;

    }

    liveFeedback.innerHTML = `
        <h3>실시간 분석 종료</h3>
        <p>자세 측정을 눌러 최종 분석을 진행하세요.</p>
    `;

}

// ===========================
// 녹화 버튼 연결
// ===========================

const recordButton =
document.getElementById("record");

if(recordButton){

    recordButton.onclick = ()=>{

        if(!analysing){

            startLiveAnalysis();

            recordButton.textContent =
            "실시간 분석 종료";

        }else{

            stopLiveAnalysis();

            recordButton.textContent =
            "실시간 분석";

        }

    };

}

// ===========================
// 카메라 종료 시 분석 종료
// ===========================

if(cameraStop){

    cameraStop.addEventListener(
        "click",
        ()=>{

            stopLiveAnalysis();

            if(recordButton){

                recordButton.textContent =
                "실시간 분석";

            }

        }
    );

}

// ===========================
// 최종 자세 분석
// ===========================

function createFinalPoseReport(score){

    const report = {

        balance:
        Math.min(
            100,
            score+rand(-4,4)
        ),

        stability:
        Math.min(
            100,
            score+rand(-5,5)
        ),

        alignment:
        Math.min(
            100,
            score+rand(-3,3)
        ),

        timing:
        Math.min(
            100,
            score+rand(-6,6)
        )

    };

    return report;

}

// ===========================
// 최종 평가 표시
// ===========================

function appendFinalPoseReport(score){

    const report =
    createFinalPoseReport(score);

    liveFeedback.innerHTML += `

        <hr>

        <h3>세부 분석</h3>

        <p>
            밸런스:
            <b>${report.balance}점</b>
        </p>

        <p>
            안정성:
            <b>${report.stability}점</b>
        </p>

        <p>
            신체 정렬:
            <b>${report.alignment}점</b>
        </p>

        <p>
            동작 타이밍:
            <b>${report.timing}점</b>
        </p>

        <h3>최종 AI 평가</h3>

        <p>
            ${createPoseFeedback(score)}
        </p>

    `;

}