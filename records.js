// ==========================================
// records.js
// 설천고 스포츠과학 훈련센터 - 기록 관리
// ==========================================

const recordTable =
document.getElementById("recordTable");

const recordChart =
document.getElementById("recordChart");

const exportCSVButton =
document.getElementById("exportCSV");

const clearRecordButton =
document.getElementById("clearRecord");

const coachMemo =
document.getElementById("coachMemo");

const saveMemoButton =
document.getElementById("saveMemo");

// ==========================================
// 현재 선수 기록 가져오기
// ==========================================

function getAthleteRecords(){

    if(!currentAthlete){

        return [];

    }

    return records.filter(record =>

        record.player === currentAthlete

    );

}

// ==========================================
// 날짜 표시
// ==========================================

function formatDate(value){

    if(!value){

        return "-";

    }

    const date =
    new Date(value);

    if(Number.isNaN(date.getTime())){

        return value;

    }

    return date.toLocaleDateString(
        "ko-KR"
    );

}

// ==========================================
// HTML 문자 보호
// ==========================================

function safeText(value){

    return String(value ?? "")

    .replaceAll("&","&amp;")

    .replaceAll("<","&lt;")

    .replaceAll(">","&gt;")

    .replaceAll('"',"&quot;")

    .replaceAll("'","&#039;");

}

// ==========================================
// 점수별 AI 피드백
// ==========================================

function recordFeedback(score){

    const value =
    Number(score);

    if(value >= 95){

        return "매우 뛰어난 수행입니다. 현재 훈련 수준을 유지하세요.";

    }

    if(value >= 90){

        return "우수한 수행입니다. 세부 동작을 조금 더 보완하세요.";

    }

    if(value >= 85){

        return "좋은 수행입니다. 반복 훈련으로 안정성을 높이세요.";

    }

    if(value >= 75){

        return "기본 동작은 좋습니다. 밸런스와 정확도를 보완하세요.";

    }

    return "기본기 중심의 반복 훈련이 필요합니다.";

}

// ==========================================
// 기록표 출력
// ==========================================

function updateRecordTable(){

    if(!recordTable){

        return;

    }

    const list =
    getAthleteRecords();

    recordTable.innerHTML = "";

    if(list.length === 0){

        recordTable.innerHTML = `

            <tr>

                <td colspan="5">

                    저장된 기록이 없습니다.

                </td>

            </tr>

        `;

        drawRecordChart();

        loadCoachMemo();

        return;

    }

    [...list]

    .reverse()

    .forEach(record => {

        const row =
        document.createElement("tr");

        row.innerHTML = `

            <td>
                ${safeText(
                    formatDate(record.date)
                )}
            </td>

            <td>
                ${safeText(
                    record.sport
                )}
            </td>

            <td>
                ${safeText(
                    record.skill
                )}
            </td>

            <td>
                <strong>
                    ${safeText(
                        record.score
                    )}점
                </strong>
            </td>

            <td>
                ${safeText(
                    record.feedback ||
                    recordFeedback(
                        record.score
                    )
                )}
            </td>

        `;

        recordTable.appendChild(row);

    });

    drawRecordChart();

    loadCoachMemo();

}

// ==========================================
// 기록 그래프
// ==========================================

function drawRecordChart(){

    if(!recordChart){

        return;

    }

    const ctx =
    recordChart.getContext("2d");

    const width =
    recordChart.clientWidth || 800;

    const height = 300;

    const ratio =
    window.devicePixelRatio || 1;

    recordChart.width =
    width * ratio;

    recordChart.height =
    height * ratio;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    ctx.fillStyle =
    "#0D2235";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );

    const padding = {

        left:50,

        right:30,

        top:30,

        bottom:40

    };

    const graphWidth =
    width -
    padding.left -
    padding.right;

    const graphHeight =
    height -
    padding.top -
    padding.bottom;

    // 가로 기준선

    for(
        let score = 0;
        score <= 100;
        score += 20
    ){

        const y =
        padding.top +
        graphHeight *
        (1 - score / 100);

        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.strokeStyle =
        "rgba(255,255,255,.1)";

        ctx.lineWidth = 1;

        ctx.stroke();

        ctx.fillStyle =
        "#94A8BC";

        ctx.font =
        "12px sans-serif";

        ctx.textAlign =
        "right";

        ctx.fillText(
            String(score),
            padding.left - 10,
            y + 4
        );

    }

    const list =
    getAthleteRecords()
    .slice(-10);

    if(list.length === 0){

        ctx.fillStyle =
        "#94A8BC";

        ctx.font =
        "16px sans-serif";

        ctx.textAlign =
        "center";

        ctx.fillText(
            "표시할 기록이 없습니다.",
            width / 2,
            height / 2
        );

        return;

    }

    const gap =
    list.length > 1

    ? graphWidth /
      (list.length - 1)

    : 0;

    const points =
    list.map((record,index) => {

        const score =
        Math.max(
            0,
            Math.min(
                100,
                Number(record.score)
            )
        );

        return {

            x:
            list.length === 1

            ? padding.left +
              graphWidth / 2

            : padding.left +
              index * gap,

            y:
            padding.top +
            graphHeight *
            (1 - score / 100),

            score

        };

    });

    ctx.beginPath();

    points.forEach((point,index) => {

        if(index === 0){

            ctx.moveTo(
                point.x,
                point.y
            );

        }else{

            ctx.lineTo(
                point.x,
                point.y
            );

        }

    });

    ctx.strokeStyle =
    "#00D9FF";

    ctx.lineWidth = 4;

    ctx.lineJoin =
    "round";

    ctx.lineCap =
    "round";

    ctx.stroke();

    points.forEach(point => {

        ctx.beginPath();

        ctx.arc(
            point.x,
            point.y,
            6,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
        "#00D9FF";

        ctx.fill();

        ctx.strokeStyle =
        "#FFFFFF";

        ctx.lineWidth = 2;

        ctx.stroke();

        ctx.fillStyle =
        "#FFFFFF";

        ctx.font =
        "bold 13px sans-serif";

        ctx.textAlign =
        "center";

        ctx.fillText(
            String(point.score),
            point.x,
            point.y - 14
        );

    });

}

// ==========================================
// CSV 문자 처리
// ==========================================

function csvValue(value){

    const text =
    String(value ?? "");

    return `"${text.replaceAll(
        '"',
        '""'
    )}"`;

}

// ==========================================
// CSV 내보내기
// ==========================================

if(exportCSVButton){

    exportCSVButton.onclick = () => {

        const list =
        getAthleteRecords();

        if(list.length === 0){

            alert("내보낼 기록이 없습니다.");

            return;

        }

        const rows = [

            [
                "날짜",
                "선수",
                "종목",
                "기술",
                "점수",
                "AI 피드백"
            ],

            ...list.map(record => [

                formatDate(
                    record.date
                ),

                record.player,

                record.sport,

                record.skill,

                record.score,

                record.feedback ||
                recordFeedback(
                    record.score
                )

            ])

        ];

        const csv =
        "\uFEFF" +
        rows.map(row =>

            row.map(csvValue)
            .join(",")

        ).join("\n");

        const blob =
        new Blob(
            [csv],
            {
                type:
                "text/csv;charset=utf-8"
            }
        );

        const url =
        URL.createObjectURL(blob);

        const link =
        document.createElement("a");

        link.href = url;

        link.download =
        `${currentAthlete || "선수"}_훈련기록.csv`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

    };

}

// ==========================================
// 현재 선수 기록 초기화
// ==========================================

if(clearRecordButton){

    clearRecordButton.onclick = () => {

        if(!currentAthlete){

            alert("선수를 먼저 선택하세요.");

            return;

        }

        const answer =
        confirm(
            `${currentAthlete} 선수의 기록을 모두 삭제할까요?`
        );

        if(!answer){

            return;

        }

        records =
        records.filter(record =>

            record.player !==
            currentAthlete

        );

        localStorage.setItem(
            "sscRecords",
            JSON.stringify(records)
        );

        updateRecordTable();

        if(
            typeof updateDashboard ===
            "function"
        ){

            updateDashboard();

        }

        alert(
            "선수 기록이 초기화되었습니다."
        );

    };

}

// ==========================================
// 선수별 코치 메모 키
// ==========================================

function getMemoKey(){

    return `sscCoachMemo_${
        currentAthlete || "default"
    }`;

}

// ==========================================
// 코치 메모 불러오기
// ==========================================

function loadCoachMemo(){

    if(!coachMemo){

        return;

    }

    coachMemo.value =
    localStorage.getItem(
        getMemoKey()
    ) || "";

}

// ==========================================
// 코치 메모 저장
// ==========================================

if(saveMemoButton){

    saveMemoButton.onclick = () => {

        if(!currentAthlete){

            alert("선수를 먼저 선택하세요.");

            return;

        }

        localStorage.setItem(
            getMemoKey(),
            coachMemo.value
        );

        alert("코치 메모가 저장되었습니다.");

    };

}

// ==========================================
// 화면 크기 변경 시 그래프 다시 그리기
// ==========================================

window.addEventListener(
    "resize",
    () => {

        drawRecordChart();

    }
);

// ==========================================
// 시작
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateRecordTable();

    }
);