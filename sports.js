/* ======================================================
   설천고 스포츠과학 훈련센터
   sports.js 1번
   종목 훈련 입력 · 저장 · 종목별 기본 계산
====================================================== */

"use strict";

/* ======================================================
   종목 훈련 입력 요소 찾기
====================================================== */

function getSportsFormElements() {
    return {
        form:
            document.querySelector("#sportsTrainingForm") ||
            document.querySelector("#sportsForm"),

        date:
            document.querySelector("#sportsDate") ||
            document.querySelector("#trainingDate"),

        sport:
            document.querySelector("#sportsType") ||
            document.querySelector("#trainingSport"),

        trainingName:
            document.querySelector("#sportsTrainingName") ||
            document.querySelector("#trainingName"),

        duration:
            document.querySelector("#sportsDuration") ||
            document.querySelector("#trainingDuration"),

        distance:
            document.querySelector("#sportsDistance") ||
            document.querySelector("#trainingDistance"),

        averageHeartRate:
            document.querySelector("#sportsAverageHeartRate") ||
            document.querySelector("#averageHeartRate"),

        maxHeartRate:
            document.querySelector("#sportsMaxHeartRate") ||
            document.querySelector("#maxHeartRate"),

        rpe:
            document.querySelector("#sportsRpe") ||
            document.querySelector("#trainingRpe"),

        shootingTotal:
            document.querySelector("#shootingTotal") ||
            document.querySelector("#totalShots"),

        shootingHit:
            document.querySelector("#shootingHit") ||
            document.querySelector("#hitShots"),

        shootingProne:
            document.querySelector("#shootingProne") ||
            document.querySelector("#proneHits"),

        shootingStanding:
            document.querySelector("#shootingStanding") ||
            document.querySelector("#standingHits"),

        weather:
            document.querySelector("#sportsWeather") ||
            document.querySelector("#trainingWeather"),

        condition:
            document.querySelector("#sportsCondition") ||
            document.querySelector("#trainingCondition"),

        memo:
            document.querySelector("#sportsMemo") ||
            document.querySelector("#trainingMemo"),

        submitButton:
            document.querySelector("#saveSportsRecordButton") ||
            document.querySelector("#sportsSubmitButton"),

        resetButton:
            document.querySelector("#resetSportsFormButton") ||
            document.querySelector("#sportsResetButton"),

        shootingSection:
            document.querySelector("#shootingInputSection") ||
            document.querySelector(".shooting-input-section")
    };
}

/* ======================================================
   수정 중인 종목 기록 ID
====================================================== */

let editingSportsRecordId = null;

/* ======================================================
   종목 이름 변환
====================================================== */

function getSportsTypeLabel(sport) {
    const labels = {
        biathlon: "바이애슬론",
        crosscountry: "크로스컨트리",
        ski: "크로스컨트리",
        rollerski: "롤러스키",
        roller: "롤러스키",
        shooting: "사격",
        running: "달리기",
        athletics: "육상",
        cycling: "사이클",
        basketball: "농구",
        football: "축구",
        volleyball: "배구",
        swimming: "수영",
        other: "기타"
    };

    if (!sport) {
        return "종목 미선택";
    }

    return labels[sport] || sport;
}

/* ======================================================
   종목 훈련 데이터 읽기
====================================================== */

function getSportsFormData() {
    const elements = getSportsFormElements();

    return {
        date:
            elements.date?.value ||
            getTodayValue(),

        sport:
            elements.sport?.value || "",

        trainingName:
            elements.trainingName?.value.trim() || "",

        duration:
            toNumber(elements.duration?.value),

        distance:
            toNumber(elements.distance?.value),

        averageHeartRate:
            toNumber(elements.averageHeartRate?.value),

        maxHeartRate:
            toNumber(elements.maxHeartRate?.value),

        rpe:
            toNumber(elements.rpe?.value),

        shootingTotal:
            toNumber(elements.shootingTotal?.value),

        shootingHit:
            toNumber(elements.shootingHit?.value),

        shootingProne:
            toNumber(elements.shootingProne?.value),

        shootingStanding:
            toNumber(elements.shootingStanding?.value),

        weather:
            elements.weather?.value || "",

        condition:
            elements.condition?.value || "",

        memo:
            elements.memo?.value.trim() || ""
    };
}

/* ======================================================
   입력값 검사
====================================================== */

function validateSportsRecord(data) {
    const athlete = getSelectedAthlete();

    if (!athlete) {
        showToast(
            "먼저 선수를 선택해 주세요용.",
            "error"
        );

        return false;
    }

    if (!data.date) {
        showToast(
            "훈련 날짜를 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (!data.sport) {
        showToast(
            "훈련 종목을 선택해 주세요용.",
            "error"
        );

        getSportsFormElements().sport?.focus();

        return false;
    }

    if (!data.trainingName) {
        showToast(
            "훈련 이름을 입력해 주세요용.",
            "error"
        );

        getSportsFormElements().trainingName?.focus();

        return false;
    }

    if (data.duration < 0 || data.duration > 1440) {
        showToast(
            "훈련 시간을 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.distance < 0 || data.distance > 1000) {
        showToast(
            "훈련 거리를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (
        data.averageHeartRate &&
        (
            data.averageHeartRate < 30 ||
            data.averageHeartRate > 240
        )
    ) {
        showToast(
            "평균 심박수를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (
        data.maxHeartRate &&
        (
            data.maxHeartRate < 30 ||
            data.maxHeartRate > 250
        )
    ) {
        showToast(
            "최대 심박수를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (
        data.averageHeartRate &&
        data.maxHeartRate &&
        data.averageHeartRate > data.maxHeartRate
    ) {
        showToast(
            "평균 심박수는 최대 심박수보다 높을 수 없어용.",
            "error"
        );

        return false;
    }

    if (data.rpe < 0 || data.rpe > 10) {
        showToast(
            "운동 강도는 0부터 10까지 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.shootingHit > data.shootingTotal) {
        showToast(
            "명중 수는 전체 발수보다 많을 수 없어용.",
            "error"
        );

        return false;
    }

    return true;
}

/* ======================================================
   사격 명중률 계산
====================================================== */

function calculateShootingAccuracy(hit, total) {
    const hitNumber = toNumber(hit);
    const totalNumber = toNumber(total);

    if (totalNumber <= 0) {
        return 0;
    }

    return Number(
        (
            hitNumber /
            totalNumber *
            100
        ).toFixed(1)
    );
}

/* ======================================================
   평균 페이스 계산
   분/km 형식
====================================================== */

function calculateAveragePace(duration, distance) {
    const durationNumber = toNumber(duration);
    const distanceNumber = toNumber(distance);

    if (
        durationNumber <= 0 ||
        distanceNumber <= 0
    ) {
        return null;
    }

    const paceMinutes =
        durationNumber / distanceNumber;

    const minutes =
        Math.floor(paceMinutes);

    const seconds =
        Math.round(
            (paceMinutes - minutes) * 60
        );

    if (seconds === 60) {
        return `${minutes + 1}:00`;
    }

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/* ======================================================
   평균 속도 계산
====================================================== */

function calculateAverageSpeed(duration, distance) {
    const durationNumber = toNumber(duration);
    const distanceNumber = toNumber(distance);

    if (
        durationNumber <= 0 ||
        distanceNumber <= 0
    ) {
        return 0;
    }

    const durationHours =
        durationNumber / 60;

    return Number(
        (
            distanceNumber /
            durationHours
        ).toFixed(1)
    );
}

/* ======================================================
   훈련 부하 계산
   세션 RPE 방식
====================================================== */

function calculateTrainingLoad(duration, rpe) {
    const durationNumber = toNumber(duration);
    const rpeNumber = toNumber(rpe);

    return Math.round(
        durationNumber * rpeNumber
    );
}

/* ======================================================
   종목 훈련 저장
====================================================== */

function saveSportsRecord(event) {
    event?.preventDefault();

    const athlete = getSelectedAthlete();
    const formData = getSportsFormData();

    if (!validateSportsRecord(formData)) {
        return;
    }

    const calculatedData = {
        shootingAccuracy:
            calculateShootingAccuracy(
                formData.shootingHit,
                formData.shootingTotal
            ),

        averagePace:
            calculateAveragePace(
                formData.duration,
                formData.distance
            ),

        averageSpeed:
            calculateAverageSpeed(
                formData.duration,
                formData.distance
            ),

        trainingLoad:
            calculateTrainingLoad(
                formData.duration,
                formData.rpe
            )
    };

    if (editingSportsRecordId) {
        updateSportsRecord(
            editingSportsRecordId,
            formData,
            calculatedData
        );

        return;
    }

    const newRecord = {
        id: createId("sports"),
        athleteId: athlete.id,

        ...formData,
        ...calculatedData,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    appData.sportsRecords.unshift(newRecord);

    saveAppData();
    resetSportsForm();
    renderSportsPage();

    if (
        typeof window.renderDashboard ===
        "function"
    ) {
        window.renderDashboard();
    }

    if (
        typeof window.renderRecordsPage ===
        "function"
    ) {
        window.renderRecordsPage();
    }

    showToast(
        `${athlete.name} 선수의 종목 훈련 기록을 저장했어용.`,
        "success"
    );

    if (
        typeof window.playUiSound ===
        "function"
    ) {
        window.playUiSound("success");
    }
}

/* ======================================================
   종목 기록 수정 저장
====================================================== */

function updateSportsRecord(
    recordId,
    formData,
    calculatedData
) {
    const recordIndex =
        appData.sportsRecords.findIndex(
            record => record.id === recordId
        );

    if (recordIndex === -1) {
        showToast(
            "수정할 기록을 찾을 수 없어용.",
            "error"
        );

        editingSportsRecordId = null;
        return;
    }

    appData.sportsRecords[recordIndex] = {
        ...appData.sportsRecords[recordIndex],
        ...formData,
        ...calculatedData,
        updatedAt: new Date().toISOString()
    };

    const recordName =
        formData.trainingName;

    editingSportsRecordId = null;

    saveAppData();
    resetSportsForm();
    renderSportsPage();

    if (
        typeof window.renderDashboard ===
        "function"
    ) {
        window.renderDashboard();
    }

    if (
        typeof window.renderRecordsPage ===
        "function"
    ) {
        window.renderRecordsPage();
    }

    showToast(
        `${recordName} 기록을 수정했어용.`,
        "success"
    );
}

/* ======================================================
   종목 기록 수정 시작
====================================================== */

function startEditSportsRecord(recordId) {
    const record =
        appData.sportsRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "훈련 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    const elements =
        getSportsFormElements();

    editingSportsRecordId = recordId;

    if (elements.date) {
        elements.date.value =
            record.date || "";
    }

    if (elements.sport) {
        elements.sport.value =
            record.sport || "";
    }

    if (elements.trainingName) {
        elements.trainingName.value =
            record.trainingName || "";
    }

    if (elements.duration) {
        elements.duration.value =
            record.duration || "";
    }

    if (elements.distance) {
        elements.distance.value =
            record.distance || "";
    }

    if (elements.averageHeartRate) {
        elements.averageHeartRate.value =
            record.averageHeartRate || "";
    }

    if (elements.maxHeartRate) {
        elements.maxHeartRate.value =
            record.maxHeartRate || "";
    }

    if (elements.rpe) {
        elements.rpe.value =
            record.rpe || "";
    }

    if (elements.shootingTotal) {
        elements.shootingTotal.value =
            record.shootingTotal || "";
    }

    if (elements.shootingHit) {
        elements.shootingHit.value =
            record.shootingHit || "";
    }

    if (elements.shootingProne) {
        elements.shootingProne.value =
            record.shootingProne || "";
    }

    if (elements.shootingStanding) {
        elements.shootingStanding.value =
            record.shootingStanding || "";
    }

    if (elements.weather) {
        elements.weather.value =
            record.weather || "";
    }

    if (elements.condition) {
        elements.condition.value =
            record.condition || "";
    }

    if (elements.memo) {
        elements.memo.value =
            record.memo || "";
    }

    if (elements.submitButton) {
        elements.submitButton.textContent =
            "훈련 기록 수정";
    }

    updateShootingSectionVisibility();

    elements.form?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    showToast(
        "종목 훈련 기록을 수정 중이에용."
    );
}

/* ======================================================
   종목 입력 폼 초기화
====================================================== */

function resetSportsForm() {
    const elements =
        getSportsFormElements();

    editingSportsRecordId = null;

    elements.form?.reset();

    if (elements.date) {
        elements.date.value =
            getTodayValue();
    }

    if (elements.submitButton) {
        elements.submitButton.textContent =
            "훈련 기록 저장";
    }

    updateShootingSectionVisibility();
    updateSportsLivePreview();
}

/* ======================================================
   사격 입력 영역 표시
====================================================== */

function updateShootingSectionVisibility() {
    const elements =
        getSportsFormElements();

    const selectedSport =
        elements.sport?.value || "";

    const shootingSports = [
        "biathlon",
        "shooting"
    ];

    const shouldShow =
        shootingSports.includes(selectedSport);

    if (elements.shootingSection) {
        elements.shootingSection.classList.toggle(
            "hidden",
            !shouldShow
        );
    }
}

/* ======================================================
   실시간 계산값 표시
====================================================== */

function setSportsPreviewValue(
    selectors,
    value
) {
    selectors.forEach(selector => {
        const element =
            document.querySelector(selector);

        if (element) {
            element.textContent = value;
        }
    });
}

function updateSportsLivePreview() {
    const data = getSportsFormData();

    const accuracy =
        calculateShootingAccuracy(
            data.shootingHit,
            data.shootingTotal
        );

    const pace =
        calculateAveragePace(
            data.duration,
            data.distance
        );

    const speed =
        calculateAverageSpeed(
            data.duration,
            data.distance
        );

    const load =
        calculateTrainingLoad(
            data.duration,
            data.rpe
        );

    setSportsPreviewValue(
        [
            "#sportsAccuracyPreview",
            "[data-sports-preview='accuracy']"
        ],
        data.shootingTotal
            ? `${accuracy}%`
            : "-"
    );

    setSportsPreviewValue(
        [
            "#sportsPacePreview",
            "[data-sports-preview='pace']"
        ],
        pace
            ? `${pace} /km`
            : "-"
    );

    setSportsPreviewValue(
        [
            "#sportsSpeedPreview",
            "[data-sports-preview='speed']"
        ],
        speed
            ? `${speed} km/h`
            : "-"
    );

    setSportsPreviewValue(
        [
            "#sportsLoadPreview",
            "[data-sports-preview='load']"
        ],
        load || "-"
    );
}

/* ======================================================
   선택 선수 종목 기록 가져오기
====================================================== */

function getSelectedAthleteSportsRecords() {
    const athlete = getSelectedAthlete();

    if (!athlete) {
        return [];
    }

    return appData.sportsRecords
        .filter(
            record =>
                record.athleteId === athlete.id
        )
        .sort((a, b) => {
            const dateA =
                new Date(
                    a.date ||
                    a.createdAt ||
                    0
                ).getTime();

            const dateB =
                new Date(
                    b.date ||
                    b.createdAt ||
                    0
                ).getTime();

            return dateB - dateA;
        });
}

/* ======================================================
   종목 페이지 기본 정보 표시
====================================================== */

function renderSportsPage() {
    const athlete = getSelectedAthlete();
    const records =
        getSelectedAthleteSportsRecords();

    document
        .querySelectorAll(
            "[data-sports-athlete-name]"
        )
        .forEach(element => {
            element.textContent =
                athlete
                    ? athlete.name
                    : "선수 미선택";
        });

    setSportsPreviewValue(
        [
            "#sportsTotalRecordCount",
            "[data-sports-summary='count']"
        ],
        records.length
    );

    const totalDuration =
        records.reduce(
            (sum, record) =>
                sum + toNumber(record.duration),
            0
        );

    setSportsPreviewValue(
        [
            "#sportsTotalDuration",
            "[data-sports-summary='duration']"
        ],
        `${totalDuration}분`
    );

    const totalDistance =
        records.reduce(
            (sum, record) =>
                sum + toNumber(record.distance),
            0
        );

    setSportsPreviewValue(
        [
            "#sportsTotalDistance",
            "[data-sports-summary='distance']"
        ],
        `${totalDistance.toFixed(1)} km`
    );

    const averageLoad =
        records.length
            ? Math.round(
                records.reduce(
                    (sum, record) =>
                        sum +
                        toNumber(
                            record.trainingLoad
                        ),
                    0
                ) / records.length
            )
            : 0;

    setSportsPreviewValue(
        [
            "#sportsAverageLoad",
            "[data-sports-summary='load']"
        ],
        averageLoad
    );

    if (elementsNeedDisabled()) {
        setSportsFormDisabled(!athlete);
    }

    updateSportsLivePreview();
}

/* ======================================================
   입력창 비활성화 처리
====================================================== */

function elementsNeedDisabled() {
    return Boolean(
        getSportsFormElements().form
    );
}

function setSportsFormDisabled(disabled) {
    const elements =
        getSportsFormElements();

    const formControls = [
        elements.date,
        elements.sport,
        elements.trainingName,
        elements.duration,
        elements.distance,
        elements.averageHeartRate,
        elements.maxHeartRate,
        elements.rpe,
        elements.shootingTotal,
        elements.shootingHit,
        elements.shootingProne,
        elements.shootingStanding,
        elements.weather,
        elements.condition,
        elements.memo,
        elements.submitButton,
        elements.resetButton
    ];

    formControls.forEach(element => {
        if (element) {
            element.disabled = disabled;
        }
    });
}

/* ======================================================
   종목 훈련 이벤트 초기화
====================================================== */

function initializeSportsTraining() {
    const elements =
        getSportsFormElements();

    if (elements.date && !elements.date.value) {
        elements.date.value =
            getTodayValue();
    }

    elements.form?.addEventListener(
        "submit",
        saveSportsRecord
    );

    if (
        !elements.form &&
        elements.submitButton
    ) {
        elements.submitButton.addEventListener(
            "click",
            saveSportsRecord
        );
    }

    elements.resetButton?.addEventListener(
        "click",
        event => {
            event.preventDefault();
            resetSportsForm();
        }
    );

    elements.sport?.addEventListener(
        "change",
        () => {
            updateShootingSectionVisibility();
            updateSportsLivePreview();
        }
    );

    [
        elements.duration,
        elements.distance,
        elements.rpe,
        elements.shootingTotal,
        elements.shootingHit,
        elements.shootingProne,
        elements.shootingStanding
    ].forEach(element => {
        element?.addEventListener(
            "input",
            updateSportsLivePreview
        );
    });

    updateShootingSectionVisibility();
    renderSportsPage();
}

/* ======================================================
   DOM 준비 후 실행
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeSportsTraining
);

/* ======================================================
   다른 파일에서 사용할 함수
====================================================== */

window.renderSportsPage =
    renderSportsPage;

window.saveSportsRecord =
    saveSportsRecord;

window.startEditSportsRecord =
    startEditSportsRecord;

window.resetSportsForm =
    resetSportsForm;

window.calculateShootingAccuracy =
    calculateShootingAccuracy;

window.calculateAveragePace =
    calculateAveragePace;

window.calculateAverageSpeed =
    calculateAverageSpeed;

window.calculateTrainingLoad =
    calculateTrainingLoad;

window.getSelectedAthleteSportsRecords =
    getSelectedAthleteSportsRecords;
    /* ======================================================
   sports.js 2-1
   종목 훈련 기록 카드 생성 · 목록 출력
====================================================== */

/* ======================================================
   기록 날짜 표시
====================================================== */

function formatSportsRecordDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    try {
        return formatDate(dateValue);
    } catch (error) {
        return dateValue;
    }
}

/* ======================================================
   날씨 표시
====================================================== */

function getSportsWeatherLabel(weather) {
    const labels = {
        sunny: "맑음",
        cloudy: "흐림",
        rain: "비",
        snow: "눈",
        windy: "바람",
        hot: "더움",
        cold: "추움"
    };

    if (!weather) {
        return "-";
    }

    return labels[weather] || weather;
}

/* ======================================================
   컨디션 표시
====================================================== */

function getSportsConditionLabel(condition) {
    const labels = {
        excellent: "매우 좋음",
        good: "좋음",
        normal: "보통",
        tired: "피곤함",
        bad: "좋지 않음",
        pain: "통증 있음"
    };

    if (!condition) {
        return "-";
    }

    return labels[condition] || condition;
}

/* ======================================================
   훈련 부하 단계 계산
====================================================== */

function getTrainingLoadLevel(load) {
    const loadNumber = toNumber(load);

    if (loadNumber <= 0) {
        return {
            label: "미측정",
            className: "load-none"
        };
    }

    if (loadNumber < 200) {
        return {
            label: "낮음",
            className: "load-low"
        };
    }

    if (loadNumber < 400) {
        return {
            label: "보통",
            className: "load-medium"
        };
    }

    if (loadNumber < 700) {
        return {
            label: "높음",
            className: "load-high"
        };
    }

    return {
        label: "매우 높음",
        className: "load-very-high"
    };
}

/* ======================================================
   사격 기록 존재 여부
====================================================== */

function hasShootingRecord(record) {
    return (
        toNumber(record.shootingTotal) > 0 ||
        toNumber(record.shootingHit) > 0 ||
        toNumber(record.shootingProne) > 0 ||
        toNumber(record.shootingStanding) > 0
    );
}

/* ======================================================
   기록 요약 문장 생성
====================================================== */

function createSportsRecordSummary(record) {
    const summaryParts = [];

    if (toNumber(record.duration) > 0) {
        summaryParts.push(
            `${toNumber(record.duration)}분`
        );
    }

    if (toNumber(record.distance) > 0) {
        summaryParts.push(
            `${toNumber(record.distance).toFixed(1)} km`
        );
    }

    if (toNumber(record.averageHeartRate) > 0) {
        summaryParts.push(
            `평균 ${toNumber(
                record.averageHeartRate
            )} bpm`
        );
    }

    if (toNumber(record.rpe) > 0) {
        summaryParts.push(
            `RPE ${toNumber(record.rpe)}`
        );
    }

    return summaryParts.length
        ? summaryParts.join(" · ")
        : "세부 기록 없음";
}

/* ======================================================
   종목 훈련 기록 카드 HTML
====================================================== */

function createSportsRecordCardHTML(record) {
    const athlete =
        appData.athletes.find(
            item =>
                item.id === record.athleteId
        );

    const loadLevel =
        getTrainingLoadLevel(
            record.trainingLoad
        );

    const sportLabel =
        getSportsTypeLabel(record.sport);

    const trainingName =
        record.trainingName ||
        sportLabel ||
        "종목 훈련";

    const paceText =
        record.averagePace
            ? `${record.averagePace} /km`
            : "-";

    const speedText =
        toNumber(record.averageSpeed) > 0
            ? `${toNumber(
                record.averageSpeed
            ).toFixed(1)} km/h`
            : "-";

    const accuracyText =
        toNumber(record.shootingTotal) > 0
            ? `${toNumber(
                record.shootingAccuracy
            ).toFixed(1)}%`
            : "-";

    const shootingText =
        toNumber(record.shootingTotal) > 0
            ? `${toNumber(
                record.shootingHit
            )}/${toNumber(
                record.shootingTotal
            )}`
            : "-";

    const memoHTML = record.memo
        ? `
            <div class="sports-record-memo">
                <span class="sports-record-memo-label">
                    훈련 메모
                </span>

                <p>
                    ${escapeHTML(record.memo)}
                </p>
            </div>
        `
        : "";

    const shootingHTML =
        hasShootingRecord(record)
            ? `
                <div class="sports-shooting-summary">
                    <div class="sports-shooting-title">
                        사격 기록
                    </div>

                    <div class="sports-shooting-grid">
                        <div>
                            <span>전체 명중</span>
                            <strong>
                                ${escapeHTML(shootingText)}
                            </strong>
                        </div>

                        <div>
                            <span>명중률</span>
                            <strong>
                                ${escapeHTML(accuracyText)}
                            </strong>
                        </div>

                        <div>
                            <span>복사 명중</span>
                            <strong>
                                ${
                                    toNumber(
                                        record.shootingProne
                                    ) || "-"
                                }
                            </strong>
                        </div>

                        <div>
                            <span>입사 명중</span>
                            <strong>
                                ${
                                    toNumber(
                                        record.shootingStanding
                                    ) || "-"
                                }
                            </strong>
                        </div>
                    </div>
                </div>
            `
            : "";

    return `
        <article
            class="sports-record-card"
            data-sports-record-id="${
                escapeHTML(record.id)
            }"
        >
            <div class="sports-record-header">

                <div class="sports-record-heading">

                    <div class="sports-record-icon">
                        🏃
                    </div>

                    <div>
                        <div class="sports-record-title-row">

                            <h3>
                                ${escapeHTML(trainingName)}
                            </h3>

                            <span class="sports-type-badge">
                                ${escapeHTML(sportLabel)}
                            </span>

                        </div>

                        <p class="sports-record-subtitle">
                            ${
                                athlete
                                    ? `${escapeHTML(
                                        athlete.name
                                    )} 선수 · `
                                    : ""
                            }

                            ${escapeHTML(
                                formatSportsRecordDate(
                                    record.date
                                )
                            )}
                        </p>
                    </div>

                </div>

                <span
                    class="training-load-badge ${
                        loadLevel.className
                    }"
                >
                    부하 ${escapeHTML(
                        loadLevel.label
                    )}
                </span>

            </div>

            <div class="sports-record-summary">
                ${escapeHTML(
                    createSportsRecordSummary(
                        record
                    )
                )}
            </div>

            <div class="sports-record-metrics">

                <div class="sports-record-metric">
                    <span>훈련 시간</span>

                    <strong>
                        ${
                            toNumber(record.duration) > 0
                                ? `${toNumber(
                                    record.duration
                                )}분`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>훈련 거리</span>

                    <strong>
                        ${
                            toNumber(record.distance) > 0
                                ? `${toNumber(
                                    record.distance
                                ).toFixed(1)} km`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>평균 페이스</span>

                    <strong>
                        ${escapeHTML(paceText)}
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>평균 속도</span>

                    <strong>
                        ${escapeHTML(speedText)}
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>평균 심박수</span>

                    <strong>
                        ${
                            toNumber(
                                record.averageHeartRate
                            ) > 0
                                ? `${toNumber(
                                    record.averageHeartRate
                                )} bpm`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>최대 심박수</span>

                    <strong>
                        ${
                            toNumber(
                                record.maxHeartRate
                            ) > 0
                                ? `${toNumber(
                                    record.maxHeartRate
                                )} bpm`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>운동 강도</span>

                    <strong>
                        ${
                            toNumber(record.rpe) > 0
                                ? `${toNumber(
                                    record.rpe
                                )} / 10`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="sports-record-metric">
                    <span>훈련 부하</span>

                    <strong>
                        ${
                            toNumber(
                                record.trainingLoad
                            ) > 0
                                ? toNumber(
                                    record.trainingLoad
                                )
                                : "-"
                        }
                    </strong>
                </div>

            </div>

            ${shootingHTML}

            <div class="sports-record-details">

                <div>
                    <span>날씨</span>

                    <strong>
                        ${escapeHTML(
                            getSportsWeatherLabel(
                                record.weather
                            )
                        )}
                    </strong>
                </div>

                <div>
                    <span>컨디션</span>

                    <strong>
                        ${escapeHTML(
                            getSportsConditionLabel(
                                record.condition
                            )
                        )}
                    </strong>
                </div>

            </div>

            ${memoHTML}

            <div class="sports-record-actions">

                <button
                    type="button"
                    class="secondary-button"
                    data-sports-action="edit"
                    data-sports-record-id="${
                        escapeHTML(record.id)
                    }"
                >
                    수정
                </button>

                <button
                    type="button"
                    class="danger-button"
                    data-sports-action="delete"
                    data-sports-record-id="${
                        escapeHTML(record.id)
                    }"
                >
                    삭제
                </button>

            </div>

        </article>
    `;
}

/* ======================================================
   종목 기록이 없을 때 화면
====================================================== */

function createSportsEmptyStateHTML() {
    const athlete = getSelectedAthlete();

    if (!athlete) {
        return `
            <div class="empty-box">
                <div class="empty-icon">
                    👤
                </div>

                <p>
                    먼저 선수 관리 화면에서<br>
                    선수를 선택해 주세요용.
                </p>
            </div>
        `;
    }

    return `
        <div class="empty-box">
            <div class="empty-icon">
                🏃
            </div>

            <p>
                ${escapeHTML(
                    athlete.name
                )} 선수의 종목 훈련 기록이 없어용.<br>
                위 입력창에서 첫 기록을 저장해 주세요용.
            </p>
        </div>
    `;
}

/* ======================================================
   종목 훈련 기록 목록 출력
====================================================== */

function renderSportsRecordList(records = null) {
    const container =
        document.querySelector(
            "#sportsRecordList"
        ) ||
        document.querySelector(
            "#sportsTrainingRecordList"
        ) ||
        document.querySelector(
            ".sports-record-list"
        ) ||
        document.querySelector(
            "[data-sports-record-list]"
        );

    if (!container) {
        return;
    }

    const recordList =
        Array.isArray(records)
            ? records
            : getSelectedAthleteSportsRecords();

    if (recordList.length === 0) {
        container.innerHTML =
            createSportsEmptyStateHTML();

        return;
    }

    container.innerHTML = recordList
        .map(createSportsRecordCardHTML)
        .join("");
}

/* ======================================================
   종목 기록 개수 문구
====================================================== */

function renderSportsRecordCount(
    records = null
) {
    const recordList =
        Array.isArray(records)
            ? records
            : getSelectedAthleteSportsRecords();

    const countElements =
        document.querySelectorAll(
            "[data-sports-list-count]"
        );

    countElements.forEach(element => {
        element.textContent =
            `총 ${recordList.length}개의 기록`;
    });

    const directCountElement =
        document.querySelector(
            "#sportsRecordListCount"
        );

    if (directCountElement) {
        directCountElement.textContent =
            `총 ${recordList.length}개의 기록`;
    }
}

/* ======================================================
   목록 화면 전체 갱신
====================================================== */

function refreshSportsRecordList(
    records = null
) {
    renderSportsRecordList(records);
    renderSportsRecordCount(records);
}

/* ======================================================
   기존 renderSportsPage 확장
====================================================== */

const originalRenderSportsPage =
    window.renderSportsPage ||
    renderSportsPage;

function renderSportsPageWithList() {
    originalRenderSportsPage();
    refreshSportsRecordList();
}

/* ======================================================
   DOM 준비 후 목록 출력
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        refreshSportsRecordList();
    }
);

/* ======================================================
   다른 파일에서 사용할 함수
====================================================== */

window.createSportsRecordCardHTML =
    createSportsRecordCardHTML;

window.renderSportsRecordList =
    renderSportsRecordList;

window.renderSportsRecordCount =
    renderSportsRecordCount;

window.refreshSportsRecordList =
    refreshSportsRecordList;

window.renderSportsPage =
    renderSportsPageWithList;
    /* ======================================================
   sports.js 2-2
   종목 기록 수정 · 삭제 · 버튼 이벤트
====================================================== */

/* ======================================================
   종목 기록 삭제 요청
====================================================== */

function requestDeleteSportsRecord(recordId) {
    const record =
        appData.sportsRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "삭제할 훈련 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    const recordName =
        record.trainingName ||
        getSportsTypeLabel(record.sport) ||
        "종목 훈련";

    openConfirmModal({
        title: "종목 기록 삭제",
        message:
            `${recordName} 기록을 삭제할까요? ` +
            "삭제한 기록은 복구할 수 없어용.",

        confirmText: "삭제",

        onConfirm: () => {
            deleteSportsRecord(recordId);
        }
    });
}

/* ======================================================
   종목 기록 삭제
====================================================== */

function deleteSportsRecord(recordId) {
    const record =
        appData.sportsRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "삭제할 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    const recordName =
        record.trainingName ||
        getSportsTypeLabel(record.sport) ||
        "종목 훈련";

    appData.sportsRecords =
        appData.sportsRecords.filter(
            item => item.id !== recordId
        );

    if (
        editingSportsRecordId === recordId
    ) {
        resetSportsForm();
    }

    saveAppData();

    if (
        typeof window.renderSportsPage ===
        "function"
    ) {
        window.renderSportsPage();
    }

    if (
        typeof window.renderDashboard ===
        "function"
    ) {
        window.renderDashboard();
    }

    if (
        typeof window.renderRecordsPage ===
        "function"
    ) {
        window.renderRecordsPage();
    }

    if (
        typeof window.renderReportPage ===
        "function"
    ) {
        window.renderReportPage();
    }

    if (
        typeof window.playUiSound ===
        "function"
    ) {
        window.playUiSound("success");
    }

    showToast(
        `${recordName} 기록을 삭제했어용.`,
        "success"
    );
}

/* ======================================================
   수정 취소 버튼 찾기
====================================================== */

function getSportsCancelEditButton() {
    return (
        document.querySelector(
            "#cancelSportsEditButton"
        ) ||
        document.querySelector(
            "#sportsCancelEditButton"
        ) ||
        document.querySelector(
            "[data-sports-cancel-edit]"
        )
    );
}

/* ======================================================
   수정 상태 화면 반영
====================================================== */

function updateSportsEditState() {
    const elements =
        getSportsFormElements();

    const cancelButton =
        getSportsCancelEditButton();

    const isEditing =
        Boolean(editingSportsRecordId);

    if (elements.submitButton) {
        elements.submitButton.textContent =
            isEditing
                ? "훈련 기록 수정"
                : "훈련 기록 저장";
    }

    if (cancelButton) {
        cancelButton.classList.toggle(
            "hidden",
            !isEditing
        );

        cancelButton.disabled =
            !isEditing;
    }

    const formTitle =
        document.querySelector(
            "#sportsFormTitle"
        ) ||
        document.querySelector(
            "[data-sports-form-title]"
        );

    if (formTitle) {
        formTitle.textContent =
            isEditing
                ? "종목 훈련 기록 수정"
                : "종목 훈련 기록 입력";
    }

    const editNotice =
        document.querySelector(
            "#sportsEditNotice"
        ) ||
        document.querySelector(
            "[data-sports-edit-notice]"
        );

    if (editNotice) {
        editNotice.classList.toggle(
            "hidden",
            !isEditing
        );

        editNotice.textContent =
            isEditing
                ? "현재 저장된 훈련 기록을 수정 중이에용."
                : "";
    }
}

/* ======================================================
   종목 기록 수정 시작 기능 보강
====================================================== */

function beginSportsRecordEdit(recordId) {
    const record =
        appData.sportsRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "수정할 훈련 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    startEditSportsRecord(recordId);
    updateSportsEditState();

    const form =
        getSportsFormElements().form;

    const formContainer =
        form?.closest(
            ".form-card, .panel, .content-card"
        ) || form;

    formContainer?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* ======================================================
   종목 기록 수정 취소
====================================================== */

function cancelSportsRecordEdit() {
    if (!editingSportsRecordId) {
        resetSportsForm();
        updateSportsEditState();
        return;
    }

    editingSportsRecordId = null;

    resetSportsForm();
    updateSportsEditState();

    showToast(
        "종목 기록 수정을 취소했어용."
    );
}

/* ======================================================
   resetSportsForm 기능 확장
====================================================== */

const originalResetSportsForm =
    window.resetSportsForm ||
    resetSportsForm;

function resetSportsFormWithEditState() {
    originalResetSportsForm();
    updateSportsEditState();
}

window.resetSportsForm =
    resetSportsFormWithEditState;

/* ======================================================
   종목 기록 카드 버튼 처리
====================================================== */

function handleSportsRecordAction(event) {
    const actionButton =
        event.target.closest(
            "[data-sports-action]"
        );

    if (!actionButton) {
        return;
    }

    const action =
        actionButton.dataset.sportsAction;

    const recordId =
        actionButton.dataset.sportsRecordId;

    if (!recordId) {
        showToast(
            "훈련 기록 번호를 찾을 수 없어용.",
            "error"
        );

        return;
    }

    switch (action) {
        case "edit":
            beginSportsRecordEdit(recordId);
            break;

        case "delete":
            requestDeleteSportsRecord(recordId);
            break;

        default:
            break;
    }
}

/* ======================================================
   기록 카드 클릭 선택 효과
====================================================== */

function handleSportsRecordCardSelection(event) {
    if (
        event.target.closest(
            "button, input, select, textarea, a"
        )
    ) {
        return;
    }

    const card =
        event.target.closest(
            ".sports-record-card"
        );

    if (!card) {
        return;
    }

    document
        .querySelectorAll(
            ".sports-record-card.selected"
        )
        .forEach(item => {
            item.classList.remove("selected");
        });

    card.classList.add("selected");
}

/* ======================================================
   종목 기록 목록 이벤트 연결
====================================================== */

function initializeSportsRecordActions() {
    const container =
        document.querySelector(
            "#sportsRecordList"
        ) ||
        document.querySelector(
            "#sportsTrainingRecordList"
        ) ||
        document.querySelector(
            ".sports-record-list"
        ) ||
        document.querySelector(
            "[data-sports-record-list]"
        );

    container?.addEventListener(
        "click",
        event => {
            handleSportsRecordAction(event);
            handleSportsRecordCardSelection(event);
        }
    );

    const cancelButton =
        getSportsCancelEditButton();

    cancelButton?.addEventListener(
        "click",
        event => {
            event.preventDefault();
            cancelSportsRecordEdit();
        }
    );

    updateSportsEditState();
}

/* ======================================================
   키보드 단축키
====================================================== */

function initializeSportsKeyboardShortcuts() {
    document.addEventListener(
        "keydown",
        event => {
            const sportsPage =
                document.querySelector(
                    "#sportsPage"
                ) ||
                document.querySelector(
                    "[data-page='sports']"
                );

            if (
                !sportsPage ||
                sportsPage.classList.contains(
                    "hidden"
                )
            ) {
                return;
            }

            if (
                event.key === "Escape" &&
                editingSportsRecordId
            ) {
                cancelSportsRecordEdit();
            }
        }
    );
}

/* ======================================================
   DOM 준비 후 실행
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeSportsRecordActions();
        initializeSportsKeyboardShortcuts();
    }
);

/* ======================================================
   다른 파일에서 사용할 함수
====================================================== */

window.requestDeleteSportsRecord =
    requestDeleteSportsRecord;

window.deleteSportsRecord =
    deleteSportsRecord;

window.beginSportsRecordEdit =
    beginSportsRecordEdit;

window.cancelSportsRecordEdit =
    cancelSportsRecordEdit;

window.updateSportsEditState =
    updateSportsEditState;
    /* ======================================================
   sports.js 2-3
   검색 · 필터 · 정렬 · 통계 · 차트
====================================================== */

/* ======================================================
   필터 상태
====================================================== */

const sportsFilterState = {
    searchText: "",
    sport: "all",
    sort: "newest",
    startDate: "",
    endDate: ""
};

/* ======================================================
   종목 필터 요소 찾기
====================================================== */

function getSportsFilterElements() {
    return {
        searchInput:
            document.querySelector(
                "#sportsSearchInput"
            ) ||
            document.querySelector(
                "[data-sports-filter='search']"
            ),

        sportSelect:
            document.querySelector(
                "#sportsFilterSelect"
            ) ||
            document.querySelector(
                "#sportsSportFilter"
            ) ||
            document.querySelector(
                "[data-sports-filter='sport']"
            ),

        sortSelect:
            document.querySelector(
                "#sportsSortSelect"
            ) ||
            document.querySelector(
                "[data-sports-filter='sort']"
            ),

        startDate:
            document.querySelector(
                "#sportsStartDate"
            ) ||
            document.querySelector(
                "[data-sports-filter='start-date']"
            ),

        endDate:
            document.querySelector(
                "#sportsEndDate"
            ) ||
            document.querySelector(
                "[data-sports-filter='end-date']"
            ),

        resetButton:
            document.querySelector(
                "#resetSportsFilterButton"
            ) ||
            document.querySelector(
                "[data-sports-filter-reset]"
            ),

        resultCount:
            document.querySelector(
                "#sportsFilterResultCount"
            ) ||
            document.querySelector(
                "[data-sports-filter-result]"
            )
    };
}

/* ======================================================
   검색용 문자열 정리
====================================================== */

function normalizeSportsSearchText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/* ======================================================
   기록 검색 대상 문자열 생성
====================================================== */

function createSportsSearchTarget(record) {
    const athlete =
        appData.athletes.find(
            item =>
                item.id === record.athleteId
        );

    return normalizeSportsSearchText(
        [
            record.trainingName,
            getSportsTypeLabel(record.sport),
            record.sport,
            record.memo,
            record.weather,
            getSportsWeatherLabel(record.weather),
            record.condition,
            getSportsConditionLabel(
                record.condition
            ),
            athlete?.name
        ]
            .filter(Boolean)
            .join(" ")
    );
}

/* ======================================================
   날짜 범위 포함 여부
====================================================== */

function isSportsRecordInDateRange(record) {
    const recordDate = record.date;

    if (!recordDate) {
        return (
            !sportsFilterState.startDate &&
            !sportsFilterState.endDate
        );
    }

    if (
        sportsFilterState.startDate &&
        recordDate <
            sportsFilterState.startDate
    ) {
        return false;
    }

    if (
        sportsFilterState.endDate &&
        recordDate >
            sportsFilterState.endDate
    ) {
        return false;
    }

    return true;
}

/* ======================================================
   필터 적용
====================================================== */

function getFilteredSportsRecords() {
    const records =
        getSelectedAthleteSportsRecords();

    const searchText =
        normalizeSportsSearchText(
            sportsFilterState.searchText
        );

    const filteredRecords =
        records.filter(record => {
            const matchesSearch =
                !searchText ||
                createSportsSearchTarget(
                    record
                ).includes(searchText);

            const matchesSport =
                sportsFilterState.sport ===
                    "all" ||
                record.sport ===
                    sportsFilterState.sport;

            const matchesDate =
                isSportsRecordInDateRange(
                    record
                );

            return (
                matchesSearch &&
                matchesSport &&
                matchesDate
            );
        });

    return sortSportsRecords(
        filteredRecords,
        sportsFilterState.sort
    );
}

/* ======================================================
   정렬
====================================================== */

function sortSportsRecords(
    records,
    sortType
) {
    const sortedRecords = [...records];

    switch (sortType) {
        case "oldest":
            sortedRecords.sort(
                (a, b) =>
                    getSportsRecordTimestamp(a) -
                    getSportsRecordTimestamp(b)
            );
            break;

        case "duration-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(b.duration) -
                    toNumber(a.duration)
            );
            break;

        case "distance-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(b.distance) -
                    toNumber(a.distance)
            );
            break;

        case "load-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(
                        b.trainingLoad
                    ) -
                    toNumber(
                        a.trainingLoad
                    )
            );
            break;

        case "rpe-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(b.rpe) -
                    toNumber(a.rpe)
            );
            break;

        case "newest":
        default:
            sortedRecords.sort(
                (a, b) =>
                    getSportsRecordTimestamp(b) -
                    getSportsRecordTimestamp(a)
            );
            break;
    }

    return sortedRecords;
}

/* ======================================================
   기록 시간값
====================================================== */

function getSportsRecordTimestamp(record) {
    return new Date(
        record.date ||
        record.createdAt ||
        0
    ).getTime();
}

/* ======================================================
   필터 결과 화면 갱신
====================================================== */

function applySportsFilters() {
    const records =
        getFilteredSportsRecords();

    refreshSportsRecordList(records);
    renderSportsFilterResultCount(records);
    renderSportsStatistics(records);
    renderSportsCharts(records);
}

/* ======================================================
   필터 결과 개수
====================================================== */

function renderSportsFilterResultCount(
    records
) {
    const elements =
        getSportsFilterElements();

    const totalRecords =
        getSelectedAthleteSportsRecords()
            .length;

    const filteredCount =
        records.length;

    if (elements.resultCount) {
        elements.resultCount.textContent =
            totalRecords === filteredCount
                ? `총 ${totalRecords}개`
                : `${totalRecords}개 중 ${filteredCount}개`;
    }
}

/* ======================================================
   필터 초기화
====================================================== */

function resetSportsFilters() {
    sportsFilterState.searchText = "";
    sportsFilterState.sport = "all";
    sportsFilterState.sort = "newest";
    sportsFilterState.startDate = "";
    sportsFilterState.endDate = "";

    const elements =
        getSportsFilterElements();

    if (elements.searchInput) {
        elements.searchInput.value = "";
    }

    if (elements.sportSelect) {
        elements.sportSelect.value =
            "all";
    }

    if (elements.sortSelect) {
        elements.sortSelect.value =
            "newest";
    }

    if (elements.startDate) {
        elements.startDate.value = "";
    }

    if (elements.endDate) {
        elements.endDate.value = "";
    }

    applySportsFilters();

    showToast(
        "종목 기록 필터를 초기화했어용."
    );
}

/* ======================================================
   기간 입력값 검사
====================================================== */

function validateSportsDateFilter() {
    const startDate =
        sportsFilterState.startDate;

    const endDate =
        sportsFilterState.endDate;

    if (
        startDate &&
        endDate &&
        startDate > endDate
    ) {
        showToast(
            "시작 날짜는 종료 날짜보다 늦을 수 없어용.",
            "error"
        );

        return false;
    }

    return true;
}

/* ======================================================
   필터 이벤트 연결
====================================================== */

function initializeSportsFilters() {
    const elements =
        getSportsFilterElements();

    elements.searchInput
        ?.addEventListener(
            "input",
            event => {
                sportsFilterState.searchText =
                    event.target.value;

                applySportsFilters();
            }
        );

    elements.sportSelect
        ?.addEventListener(
            "change",
            event => {
                sportsFilterState.sport =
                    event.target.value || "all";

                applySportsFilters();
            }
        );

    elements.sortSelect
        ?.addEventListener(
            "change",
            event => {
                sportsFilterState.sort =
                    event.target.value ||
                    "newest";

                applySportsFilters();
            }
        );

    elements.startDate
        ?.addEventListener(
            "change",
            event => {
                sportsFilterState.startDate =
                    event.target.value;

                if (
                    !validateSportsDateFilter()
                ) {
                    event.target.value = "";
                    sportsFilterState.startDate =
                        "";
                }

                applySportsFilters();
            }
        );

    elements.endDate
        ?.addEventListener(
            "change",
            event => {
                sportsFilterState.endDate =
                    event.target.value;

                if (
                    !validateSportsDateFilter()
                ) {
                    event.target.value = "";
                    sportsFilterState.endDate =
                        "";
                }

                applySportsFilters();
            }
        );

    elements.resetButton
        ?.addEventListener(
            "click",
            event => {
                event.preventDefault();
                resetSportsFilters();
            }
        );
}

/* ======================================================
   통계 계산
====================================================== */

function calculateSportsStatistics(
    records
) {
    const totalCount = records.length;

    const totalDuration =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(record.duration),
            0
        );

    const totalDistance =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(record.distance),
            0
        );

    const totalLoad =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(
                    record.trainingLoad
                ),
            0
        );

    const recordsWithRpe =
        records.filter(
            record =>
                toNumber(record.rpe) > 0
        );

    const recordsWithHeartRate =
        records.filter(
            record =>
                toNumber(
                    record.averageHeartRate
                ) > 0
        );

    const recordsWithShooting =
        records.filter(
            record =>
                toNumber(
                    record.shootingTotal
                ) > 0
        );

    const averageRpe =
        recordsWithRpe.length
            ? recordsWithRpe.reduce(
                (sum, record) =>
                    sum +
                    toNumber(record.rpe),
                0
            ) / recordsWithRpe.length
            : 0;

    const averageHeartRate =
        recordsWithHeartRate.length
            ? recordsWithHeartRate.reduce(
                (sum, record) =>
                    sum +
                    toNumber(
                        record.averageHeartRate
                    ),
                0
            ) /
            recordsWithHeartRate.length
            : 0;

    const totalShots =
        recordsWithShooting.reduce(
            (sum, record) =>
                sum +
                    toNumber(
                        record.shootingTotal
                    ),
            0
        );

    const totalHits =
        recordsWithShooting.reduce(
            (sum, record) =>
                sum +
                    toNumber(
                        record.shootingHit
                    ),
            0
        );

    const shootingAccuracy =
        totalShots > 0
            ? totalHits /
                totalShots *
                100
            : 0;

    return {
        totalCount,
        totalDuration,
        totalDistance,
        totalLoad,

        averageDuration:
            totalCount
                ? totalDuration /
                    totalCount
                : 0,

        averageDistance:
            totalCount
                ? totalDistance /
                    totalCount
                : 0,

        averageLoad:
            totalCount
                ? totalLoad /
                    totalCount
                : 0,

        averageRpe,
        averageHeartRate,
        shootingAccuracy,
        totalShots,
        totalHits
    };
}

/* ======================================================
   통계값 표시
====================================================== */

function setSportsStatisticsValue(
    key,
    value
) {
    document
        .querySelectorAll(
            `[data-sports-stat="${key}"]`
        )
        .forEach(element => {
            element.textContent = value;
        });

    const idMap = {
        count:
            "#sportsStatisticsCount",

        duration:
            "#sportsStatisticsDuration",

        distance:
            "#sportsStatisticsDistance",

        averageRpe:
            "#sportsStatisticsAverageRpe",

        averageHeartRate:
            "#sportsStatisticsHeartRate",

        load:
            "#sportsStatisticsLoad",

        accuracy:
            "#sportsStatisticsAccuracy"
    };

    const directElement =
        document.querySelector(
            idMap[key]
        );

    if (directElement) {
        directElement.textContent = value;
    }
}

/* ======================================================
   종목 통계 출력
====================================================== */

function renderSportsStatistics(
    records = null
) {
    const recordList =
        Array.isArray(records)
            ? records
            : getFilteredSportsRecords();

    const statistics =
        calculateSportsStatistics(
            recordList
        );

    setSportsStatisticsValue(
        "count",
        statistics.totalCount
    );

    setSportsStatisticsValue(
        "duration",
        `${Math.round(
            statistics.totalDuration
        )}분`
    );

    setSportsStatisticsValue(
        "distance",
        `${statistics.totalDistance.toFixed(
            1
        )} km`
    );

    setSportsStatisticsValue(
        "averageRpe",
        statistics.averageRpe
            ? statistics.averageRpe.toFixed(
                1
            )
            : "-"
    );

    setSportsStatisticsValue(
        "averageHeartRate",
        statistics.averageHeartRate
            ? `${Math.round(
                statistics.averageHeartRate
            )} bpm`
            : "-"
    );

    setSportsStatisticsValue(
        "load",
        Math.round(
            statistics.totalLoad
        )
    );

    setSportsStatisticsValue(
        "accuracy",
        statistics.totalShots
            ? `${statistics.shootingAccuracy.toFixed(
                1
            )}%`
            : "-"
    );
}

/* ======================================================
   Chart.js 차트 객체
====================================================== */

let sportsLoadChart = null;
let sportsDurationChart = null;
let sportsTypeChart = null;

/* ======================================================
   차트 사용 가능 여부
====================================================== */

function isChartJsAvailable() {
    return typeof window.Chart !==
        "undefined";
}

/* ======================================================
   차트 공통 제거
====================================================== */

function destroySportsCharts() {
    if (sportsLoadChart) {
        sportsLoadChart.destroy();
        sportsLoadChart = null;
    }

    if (sportsDurationChart) {
        sportsDurationChart.destroy();
        sportsDurationChart = null;
    }

    if (sportsTypeChart) {
        sportsTypeChart.destroy();
        sportsTypeChart = null;
    }
}

/* ======================================================
   차트용 최근 기록 정렬
====================================================== */

function getSportsChartRecords(
    records,
    limit = 10
) {
    return [...records]
        .sort(
            (a, b) =>
                getSportsRecordTimestamp(a) -
                getSportsRecordTimestamp(b)
        )
        .slice(-limit);
}

/* ======================================================
   날짜 차트 라벨
====================================================== */

function createSportsChartDateLabel(
    record
) {
    const date =
        record.date ||
        record.createdAt;

    if (!date) {
        return "-";
    }

    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return String(date);
    }

    return `${parsedDate.getMonth() + 1}/${parsedDate.getDate()}`;
}

/* ======================================================
   훈련 부하 차트
====================================================== */

function renderSportsLoadChart(
    records
) {
    const canvas =
        document.querySelector(
            "#sportsLoadChart"
        );

    if (
        !canvas ||
        !isChartJsAvailable()
    ) {
        return;
    }

    if (sportsLoadChart) {
        sportsLoadChart.destroy();
    }

    const chartRecords =
        getSportsChartRecords(records);

    sportsLoadChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {
                    labels:
                        chartRecords.map(
                            createSportsChartDateLabel
                        ),

                    datasets: [
                        {
                            label: "훈련 부하",

                            data:
                                chartRecords.map(
                                    record =>
                                        toNumber(
                                            record.trainingLoad
                                        )
                                ),

                            tension: 0.3,
                            fill: false
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            display: true
                        }
                    },

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
}

/* ======================================================
   훈련 시간 차트
====================================================== */

function renderSportsDurationChart(
    records
) {
    const canvas =
        document.querySelector(
            "#sportsDurationChart"
        );

    if (
        !canvas ||
        !isChartJsAvailable()
    ) {
        return;
    }

    if (sportsDurationChart) {
        sportsDurationChart.destroy();
    }

    const chartRecords =
        getSportsChartRecords(records);

    sportsDurationChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {
                    labels:
                        chartRecords.map(
                            createSportsChartDateLabel
                        ),

                    datasets: [
                        {
                            label: "훈련 시간(분)",

                            data:
                                chartRecords.map(
                                    record =>
                                        toNumber(
                                            record.duration
                                        )
                                ),

                            borderWidth: 1
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
}

/* ======================================================
   종목별 기록 수 계산
====================================================== */

function groupSportsRecordsByType(
    records
) {
    return records.reduce(
        (groups, record) => {
            const label =
                getSportsTypeLabel(
                    record.sport
                );

            groups[label] =
                (groups[label] || 0) + 1;

            return groups;
        },
        {}
    );
}

/* ======================================================
   종목 분포 차트
====================================================== */

function renderSportsTypeChart(
    records
) {
    const canvas =
        document.querySelector(
            "#sportsTypeChart"
        );

    if (
        !canvas ||
        !isChartJsAvailable()
    ) {
        return;
    }

    if (sportsTypeChart) {
        sportsTypeChart.destroy();
    }

    const groupedRecords =
        groupSportsRecordsByType(
            records
        );

    sportsTypeChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {
                    labels:
                        Object.keys(
                            groupedRecords
                        ),

                    datasets: [
                        {
                            label: "기록 수",

                            data:
                                Object.values(
                                    groupedRecords
                                )
                        }
                    ]
                },

                options: {
                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );
}

/* ======================================================
   차트 빈 화면 표시
====================================================== */

function renderSportsChartEmptyState(
    records
) {
    document
        .querySelectorAll(
            "[data-sports-chart-empty]"
        )
        .forEach(element => {
            element.classList.toggle(
                "hidden",
                records.length > 0
            );
        });

    document
        .querySelectorAll(
            "[data-sports-chart-container]"
        )
        .forEach(element => {
            element.classList.toggle(
                "has-no-data",
                records.length === 0
            );
        });
}

/* ======================================================
   전체 차트 출력
====================================================== */

function renderSportsCharts(
    records = null
) {
    const recordList =
        Array.isArray(records)
            ? records
            : getFilteredSportsRecords();

    renderSportsChartEmptyState(
        recordList
    );

    if (recordList.length === 0) {
        destroySportsCharts();
        return;
    }

    renderSportsLoadChart(recordList);
    renderSportsDurationChart(
        recordList
    );
    renderSportsTypeChart(recordList);
}

/* ======================================================
   renderSportsPage 최종 확장
====================================================== */

const previousRenderSportsPage =
    window.renderSportsPage;

function renderSportsPageWithFilters() {
    if (
        typeof previousRenderSportsPage ===
        "function"
    ) {
        previousRenderSportsPage();
    }

    applySportsFilters();
}

window.renderSportsPage =
    renderSportsPageWithFilters;

/* ======================================================
   DOM 준비 후 필터 · 통계 · 차트 시작
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeSportsFilters();
        applySportsFilters();
    }
);

/* ======================================================
   다른 파일에서 사용할 기능
====================================================== */

window.sportsFilterState =
    sportsFilterState;

window.getFilteredSportsRecords =
    getFilteredSportsRecords;

window.applySportsFilters =
    applySportsFilters;

window.resetSportsFilters =
    resetSportsFilters;

window.calculateSportsStatistics =
    calculateSportsStatistics;

window.renderSportsStatistics =
    renderSportsStatistics;

window.renderSportsCharts =
    renderSportsCharts;

window.destroySportsCharts =
    destroySportsCharts;