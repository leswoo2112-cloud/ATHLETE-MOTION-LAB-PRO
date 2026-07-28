// ===========================
// weight.js
// ===========================

const exerciseButtons =
document.querySelectorAll(".exerciseBtn");

const weightCategory =
document.getElementById("weightCategory");

const weightResult =
document.getElementById("weightResult");

const startWeight =
document.getElementById("startWeight");

const kgInput =
document.getElementById("kg");

const setInput =
document.getElementById("set");

const repInput =
document.getElementById("rep");

let currentExercise = "";

// ===========================
// 운동 선택
// ===========================

exerciseButtons.forEach(button=>{

    button.onclick=()=>{

        exerciseButtons.forEach(b=>{

            b.classList.remove("active");

        });

        button.classList.add("active");

        currentExercise=button.textContent;

    };

});

// ===========================
// 웨이트 분석 시작
// ===========================

startWeight.onclick=()=>{

    if(currentExercise===""){

        alert("운동을 선택하세요.");

        return;

    }

    const kg=Number(kgInput.value);

    const set=Number(setInput.value);

    const rep=Number(repInput.value);

    if(kg<=0||set<=0||rep<=0){

        alert("중량, 세트, 횟수를 입력하세요.");

        return;

    }

    const score=createWeightScore(
        kg,
        set,
        rep
    );

    const text=createWeightFeedback(
        score
    );

    weightResult.innerHTML=`

<h2>${currentExercise}</h2>

<h1>${score}점</h1>

<p>${text}</p>

`;

    saveRecord(
        "웨이트",
        currentExercise,
        score
    );
showWeightAnalysis(
    kg,
    set,
    rep,
    score
);
};
// ===========================
// 점수 계산
// ===========================

function createWeightScore(

    kg,

    set,

    rep

){

    let volume = kg * set * rep;

    let score = 60;

    if(volume>=1000) score+=10;
    if(volume>=2000) score+=10;
    if(volume>=3000) score+=8;
    if(volume>=4000) score+=6;
    if(volume>=5000) score+=6;

    if(score>100) score=100;

    return score;

}

// ===========================
// AI 피드백
// ===========================

function createWeightFeedback(score){

    if(score>=95){

        return `

🏆 매우 우수한 훈련입니다.

근력과 근지구력이 매우 뛰어난 수준입니다.

현재 프로그램을 유지하세요.

`;

    }

    if(score>=90){

        return `

🥇 좋은 훈련입니다.

중량을 조금씩 증가시키는 것을 추천합니다.

`;

    }

    if(score>=80){

        return `

💪 평균 이상의 수행입니다.

세트 수를 늘리면 더욱 효과적입니다.

`;

    }

    return `

🔥 운동량이 부족합니다.

기본기를 먼저 다지고 점진적으로 중량을 올려보세요.

`;

}

// ===========================
// 운동 추천
// ===========================

function recommendExercise(category){

    switch(category){

        case "하체":

            return [

                "백 스쿼트",

                "프론트 스쿼트",

                "런지",

                "힙 쓰러스트"

            ];

        case "상체":

            return [

                "벤치프레스",

                "풀업",

                "바벨로우",

                "숄더프레스"

            ];

        case "코어":

            return [

                "플랭크",

                "행잉 레그레이즈",

                "러시안 트위스트",

                "데드버그"

            ];

        default:

            return [];

    }

}
// ===========================
// 1RM 계산
// ===========================

function calculate1RM(kg, rep){

    if(rep<=1){

        return kg;

    }

    return Math.round(

        kg*(1+rep/30)

    );

}

// ===========================
// 훈련 강도
// ===========================

function trainingIntensity(score){

    if(score>=95){

        return "매우 높음";

    }

    if(score>=90){

        return "높음";

    }

    if(score>=80){

        return "보통";

    }

    return "낮음";

}

// ===========================
// AI 프로그램 추천
// ===========================

function createProgram(category){

    const program={

        "하체":[

            "백 스쿼트 5×5",

            "루마니안 데드리프트 4×8",

            "런지 3×12",

            "카프 레이즈 4×20"

        ],

        "상체":[

            "벤치프레스 5×5",

            "풀업 4×10",

            "바벨로우 4×10",

            "숄더프레스 3×12"

        ],

        "코어":[

            "플랭크 4세트",

            "행잉 레그레이즈 15회",

            "러시안 트위스트 20회",

            "사이드 플랭크"

        ]

    };

    return program[category];

}

// ===========================
// 결과 출력
// ===========================

function showWeightAnalysis(

    kg,

    set,

    rep,

    score

){

    const oneRM=

    calculate1RM(

        kg,

        rep

    );

    const volume=

    kg*set*rep;

    const intensity=

    trainingIntensity(

        score

    );

    const recommend=

    createProgram(

        weightCategory.value

    );

    weightResult.innerHTML+=`

<hr>

<h3>훈련 분석</h3>

<p>

훈련 볼륨 :

<b>${volume}kg</b>

</p>

<p>

예상 1RM :

<b>${oneRM}kg</b>

</p>

<p>

훈련 강도 :

<b>${intensity}</b>

</p>

<h3>

AI 추천 프로그램

</h3>

<ul>

${recommend.map(

x=>`<li>${x}</li>`

).join("")}

</ul>

`;

}

// ===========================
// 실행
// ===========================

// startWeight.onclick 안에서
// saveRecord(...) 바로 아래에 추가

showWeightAnalysis(

    kg,

    set,

    rep,

    score

);