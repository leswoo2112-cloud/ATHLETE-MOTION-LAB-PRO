/* ======================================================
   설천고 스포츠과학 훈련센터
   records.js 1-1
   통합 기록 관리
====================================================== */

"use strict";

/* ======================================================
   통합 기록 필터 상태
====================================================== */

const recordsFilterState = {
    searchText: "",
    athlete: "all",
    type: "all",
    startDate: "",
    endDate: "",
    sort: "newest"
};

/* ======================================================
   Chart.js 객체
====================================================== */

let recordsTypeChart = null;
let recordsMonthlyChart = null;
let recordsAthleteChart = null;

/* ======================================================
   통합 기록 생성
====================================================== */

function getMergedRecords() {

    const sports =
        (appData.sportsRecords || []).map(record => ({
            ...record,
            recordType: "sports"
        }));

    const weight =
        (appData.weightRecords || []).map(record => ({
            ...record,
            recordType: "weight"
        }));

    const pose =
        (appData.poseRecords || []).map(record => ({
            ...record,
            recordType: "pose"
        }));

    return [
        ...sports,
        ...weight,
        ...pose
    ];
}

/* ======================================================
   선수 이름
====================================================== */

function getRecordAthleteName(record){

    const athlete =
        appData.athletes.find(
            item=>item.id===record.athleteId
        );

    return athlete
        ? athlete.name
        : "선수 없음";
}

/* ======================================================
   기록 날짜
====================================================== */

function getRecordDate(record){

    return record.date ||
           record.createdAt ||
           "";
}

/* ======================================================
   기록 종류
====================================================== */

function getRecordTypeLabel(type){

    switch(type){

        case "sports":
            return "스포츠";

        case "weight":
            return "웨이트";

        case "pose":
            return "자세";

        default:
            return "-";
    }

}
/* ======================================================
   records.js 1-1 계속
   통합 기록 검색 · 필터
====================================================== */

/* ======================================================
   검색 문자열
====================================================== */

function normalizeRecordSearchText(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");

}

/* ======================================================
   검색 대상 생성
====================================================== */

function createRecordSearchTarget(record) {

    return normalizeRecordSearchText(
        [
            getRecordAthleteName(record),

            record.event,
            record.exercise,
            record.memo,
            record.condition,

            getRecordTypeLabel(
                record.recordType
            )
        ]
            .filter(Boolean)
            .join(" ")
    );

}

/* ======================================================
   날짜 검사
====================================================== */

function isRecordInDateRange(record) {

    const date = getRecordDate(record);

    if (
        recordsFilterState.startDate &&
        date < recordsFilterState.startDate
    ) {
        return false;
    }

    if (
        recordsFilterState.endDate &&
        date > recordsFilterState.endDate
    ) {
        return false;
    }

    return true;

}

/* ======================================================
   정렬 시간
====================================================== */

function getRecordTimestamp(record) {

    return new Date(
        getRecordDate(record)
    ).getTime();

}

/* ======================================================
   정렬
====================================================== */

function sortMergedRecords(records) {

    const result = [...records];

    switch(recordsFilterState.sort){

        case "oldest":

            result.sort(
                (a,b)=>
                    getRecordTimestamp(a)-
                    getRecordTimestamp(b)
            );

            break;

        case "athlete":

            result.sort(
                (a,b)=>
                    getRecordAthleteName(a)
                        .localeCompare(
                            getRecordAthleteName(b),
                            "ko"
                        )
            );

            break;

        default:

            result.sort(
                (a,b)=>
                    getRecordTimestamp(b)-
                    getRecordTimestamp(a)
            );

    }

    return result;

}

/* ======================================================
   필터 적용
====================================================== */

function getFilteredMergedRecords() {

    const keyword =
        normalizeRecordSearchText(
            recordsFilterState.searchText
        );

    const records =
        getMergedRecords()
        .filter(record=>{

            const searchMatched =
                !keyword ||
                createRecordSearchTarget(record)
                .includes(keyword);

            const athleteMatched =
                recordsFilterState.athlete==="all" ||
                record.athleteId===
                recordsFilterState.athlete;

            const typeMatched =
                recordsFilterState.type==="all" ||
                record.recordType===
                recordsFilterState.type;

            return (
                searchMatched &&
                athleteMatched &&
                typeMatched &&
                isRecordInDateRange(record)
            );

        });

    return sortMergedRecords(records);

}

/* ======================================================
   기록 카드 제목
====================================================== */

function getRecordTitle(record){

    switch(record.recordType){

        case "sports":
            return record.event || "종목 기록";

        case "weight":
            return record.exercise || "웨이트";

        case "pose":
            return record.poseName ||
                   record.exercise ||
                   "자세 분석";

        default:
            return "기록";

    }

}

/* ======================================================
   기록 요약
====================================================== */

function getRecordSummary(record){

    switch(record.recordType){

        case "sports":

            return [
                record.distance
                    ? `${record.distance}m`
                    : "",

                record.time
                    ? `${record.time}초`
                    : "",

                record.rpe
                    ? `RPE ${record.rpe}`
                    : ""
            ]
            .filter(Boolean)
            .join(" · ");

        case "weight":

            return [
                record.weight
                    ? `${record.weight}kg`
                    : "",

                record.sets
                    ? `${record.sets}세트`
                    : "",

                record.reps
                    ? `${record.reps}회`
                    : "",

                record.trainingVolume
                    ? `${record.trainingVolume}kg`
                    : ""
            ]
            .filter(Boolean)
            .join(" · ");

        case "pose":

            return [
                record.score
                    ? `${record.score}점`
                    : "",

                record.grade || "",

                record.feedback || ""
            ]
            .filter(Boolean)
            .join(" · ");

        default:
            return "";

    }

}
/* ======================================================
   records.js 1-1 계속
   기록 카드 생성 · 목록 출력
====================================================== */

/* ======================================================
   기록 종류 배지
====================================================== */

function getRecordBadgeClass(type) {

    switch (type) {

        case "sports":
            return "badge-sports";

        case "weight":
            return "badge-weight";

        case "pose":
            return "badge-pose";

        default:
            return "badge-default";
    }

}

/* ======================================================
   수정 버튼 HTML
====================================================== */

function createRecordEditButton(record) {

    return `
        <button
            type="button"
            class="btn btn-sm btn-primary"
            data-record-action="edit"
            data-record-type="${record.recordType}"
            data-record-id="${record.id}">
            수정
        </button>
    `;

}

/* ======================================================
   삭제 버튼 HTML
====================================================== */

function createRecordDeleteButton(record) {

    return `
        <button
            type="button"
            class="btn btn-sm btn-danger"
            data-record-action="delete"
            data-record-type="${record.recordType}"
            data-record-id="${record.id}">
            삭제
        </button>
    `;

}

/* ======================================================
   카드 HTML
====================================================== */

function createRecordCard(record) {

    const athlete =
        escapeHTML(
            getRecordAthleteName(record)
        );

    const title =
        escapeHTML(
            getRecordTitle(record)
        );

    const summary =
        escapeHTML(
            getRecordSummary(record)
        );

    const memo =
        escapeHTML(
            record.memo || ""
        );

    return `

    <article
        class="record-card ${record.recordType}"
        data-record-id="${record.id}"
        data-record-type="${record.recordType}">

        <div class="record-card-header">

            <span
                class="record-badge ${getRecordBadgeClass(record.recordType)}">

                ${getRecordTypeLabel(record.recordType)}

            </span>

            <span class="record-date">

                ${formatDate(
                    getRecordDate(record)
                )}

            </span>

        </div>

        <div class="record-card-body">

            <h3 class="record-title">

                ${title}

            </h3>

            <p class="record-athlete">

                👤 ${athlete}

            </p>

            <p class="record-summary">

                ${summary}

            </p>

            ${
                memo
                    ? `
                        <p class="record-memo">
                            ${memo}
                        </p>
                      `
                    : ""
            }

        </div>

        <div class="record-card-footer">

            ${createRecordEditButton(record)}

            ${createRecordDeleteButton(record)}

        </div>

    </article>

    `;

}

/* ======================================================
   빈 목록
====================================================== */

function renderEmptyRecordList(container) {

    container.innerHTML = `

        <div class="empty-state">

            <h3>
                기록이 없습니다.
            </h3>

            <p>

                새로운 기록을 추가해 주세요.

            </p>

        </div>

    `;

}

/* ======================================================
   목록 출력
====================================================== */

function refreshRecordList(records) {

    const container =
        document.querySelector(
            "#recordsList"
        ) ||
        document.querySelector(
            "#recordList"
        ) ||
        document.querySelector(
            "[data-record-list]"
        );

    if (!container) {
        return;
    }

    if (records.length === 0) {

        renderEmptyRecordList(
            container
        );

        return;

    }

    container.innerHTML =
        records
            .map(createRecordCard)
            .join("");

}

/* ======================================================
   메인 렌더링
====================================================== */

function renderRecordsPage() {

    const records =
        getFilteredMergedRecords();

    refreshRecordList(records);

    renderRecordsStatistics(records);

    renderRecordsCharts(records);

}

window.renderRecordsPage =
    renderRecordsPage;
    /* ======================================================
   records.js 1-2
   수정 · 삭제 · 이벤트 처리
====================================================== */

"use strict";

/* ======================================================
   기록 찾기
====================================================== */

function findMergedRecord(recordType, recordId) {

    switch (recordType) {

        case "sports":
            return appData.sportsRecords.find(
                record => record.id === recordId
            );

        case "weight":
            return appData.weightRecords.find(
                record => record.id === recordId
            );

        case "pose":
            return appData.poseRecords.find(
                record => record.id === recordId
            );

        default:
            return null;

    }

}

/* ======================================================
   수정 시작
====================================================== */

function startMergedRecordEdit(
    recordType,
    recordId
) {

    const record =
        findMergedRecord(
            recordType,
            recordId
        );

    if (!record) {

        showToast(
            "기록을 찾을 수 없어용.",
            "error"
        );

        return;

    }

    switch (recordType) {

        case "sports":

            if (
                typeof window.startEditSportsRecord ===
                "function"
            ) {

                window.startEditSportsRecord(
                    recordId
                );

            }

            break;

        case "weight":

            if (
                typeof window.startEditWeightRecord ===
                "function"
            ) {

                window.startEditWeightRecord(
                    recordId
                );

            }

            break;

        case "pose":

            if (
                typeof window.startEditPoseRecord ===
                "function"
            ) {

                window.startEditPoseRecord(
                    recordId
                );

            }

            break;

    }

    showToast(
        "수정 화면으로 이동했어용."
    );

}

/* ======================================================
   삭제
====================================================== */

function deleteMergedRecord(
    recordType,
    recordId
) {

    switch (recordType) {

        case "sports":

            if (
                typeof window.requestDeleteSportsRecord ===
                "function"
            ) {

                window.requestDeleteSportsRecord(
                    recordId
                );

            }

            break;

        case "weight":

            if (
                typeof window.requestDeleteWeightRecord ===
                "function"
            ) {

                window.requestDeleteWeightRecord(
                    recordId
                );

            }

            break;

        case "pose":

            if (
                typeof window.requestDeletePoseRecord ===
                "function"
            ) {

                window.requestDeletePoseRecord(
                    recordId
                );

            }

            break;

    }

}

/* ======================================================
   카드 버튼 처리
====================================================== */

function handleRecordCardAction(
    event
) {

    const button =
        event.target.closest(
            "[data-record-action]"
        );

    if (!button) {

        return;

    }

    const action =
        button.dataset.recordAction;

    const recordType =
        button.dataset.recordType;

    const recordId =
        button.dataset.recordId;

    if (
        !recordType ||
        !recordId
    ) {

        return;

    }

    switch (action) {

        case "edit":

            startMergedRecordEdit(
                recordType,
                recordId
            );

            break;

        case "delete":

            deleteMergedRecord(
                recordType,
                recordId
            );

            break;

    }

}

/* ======================================================
   카드 선택
====================================================== */

function selectRecordCard(
    event
) {

    if (
        event.target.closest(
            "button"
        )
    ) {

        return;

    }

    const card =
        event.target.closest(
            ".record-card"
        );

    if (!card) {

        return;

    }

    document
        .querySelectorAll(
            ".record-card.selected"
        )
        .forEach(card => {

            card.classList.remove(
                "selected"
            );

        });

    card.classList.add(
        "selected"
    );

}

/* ======================================================
   이벤트 연결
====================================================== */

function initializeRecordActions() {

    const container =
        document.querySelector(
            "#recordsList"
        ) ||
        document.querySelector(
            "[data-record-list]"
        );

    if (!container) {

        return;

    }

    container.addEventListener(
        "click",
        event => {

            handleRecordCardAction(
                event
            );

            selectRecordCard(
                event
            );

        }
    );

}
/* ======================================================
   records.js 1-2 계속
   검색 · 필터 · 정렬
====================================================== */

/* ======================================================
   필터 요소
====================================================== */

function getRecordsFilterElements() {

    return {

        searchInput:
            document.querySelector(
                "#recordsSearchInput"
            ) ||
            document.querySelector(
                "[data-record-filter='search']"
            ),

        athleteSelect:
            document.querySelector(
                "#recordsAthleteFilter"
            ) ||
            document.querySelector(
                "[data-record-filter='athlete']"
            ),

        typeSelect:
            document.querySelector(
                "#recordsTypeFilter"
            ) ||
            document.querySelector(
                "[data-record-filter='type']"
            ),

        startDate:
            document.querySelector(
                "#recordsStartDate"
            ) ||
            document.querySelector(
                "[data-record-filter='start-date']"
            ),

        endDate:
            document.querySelector(
                "#recordsEndDate"
            ) ||
            document.querySelector(
                "[data-record-filter='end-date']"
            ),

        sortSelect:
            document.querySelector(
                "#recordsSortSelect"
            ) ||
            document.querySelector(
                "[data-record-filter='sort']"
            ),

        resetButton:
            document.querySelector(
                "#resetRecordsFilterButton"
            ) ||
            document.querySelector(
                "[data-record-filter-reset]"
            ),

        resultCount:
            document.querySelector(
                "#recordsResultCount"
            ) ||
            document.querySelector(
                "[data-record-result-count]"
            )

    };

}

/* ======================================================
   결과 개수
====================================================== */

function renderRecordsResultCount(records){

    const element =
        getRecordsFilterElements()
        .resultCount;

    if(!element){

        return;

    }

    const total =
        getMergedRecords().length;

    if(records.length===total){

        element.textContent =
            `총 ${total}개`;

        return;

    }

    element.textContent =
        `${total}개 중 ${records.length}개`;

}

/* ======================================================
   날짜 검사
====================================================== */

function validateRecordsDateFilter(){

    if(
        recordsFilterState.startDate &&
        recordsFilterState.endDate &&
        recordsFilterState.startDate >
        recordsFilterState.endDate
    ){

        showToast(
            "시작 날짜가 종료 날짜보다 늦어요.",
            "error"
        );

        return false;

    }

    return true;

}

/* ======================================================
   필터 초기화
====================================================== */

function resetRecordsFilters(){

    recordsFilterState.searchText="";

    recordsFilterState.athlete="all";

    recordsFilterState.type="all";

    recordsFilterState.startDate="";

    recordsFilterState.endDate="";

    recordsFilterState.sort="newest";

    const elements =
        getRecordsFilterElements();

    if(elements.searchInput){

        elements.searchInput.value="";

    }

    if(elements.athleteSelect){

        elements.athleteSelect.value="all";

    }

    if(elements.typeSelect){

        elements.typeSelect.value="all";

    }

    if(elements.sortSelect){

        elements.sortSelect.value="newest";

    }

    if(elements.startDate){

        elements.startDate.value="";

    }

    if(elements.endDate){

        elements.endDate.value="";

    }

    renderRecordsPage();

}

/* ======================================================
   필터 적용
====================================================== */

function applyRecordsFilters(){

    const records =
        getFilteredMergedRecords();

    refreshRecordList(records);

    renderRecordsStatistics(records);

    renderRecordsCharts(records);

    renderRecordsResultCount(records);

}

/* ======================================================
   이벤트 연결
====================================================== */

function initializeRecordsFilters(){

    const elements =
        getRecordsFilterElements();

    elements.searchInput
    ?.addEventListener(
        "input",
        event=>{

            recordsFilterState.searchText =
                event.target.value;

            applyRecordsFilters();

        }
    );

    elements.athleteSelect
    ?.addEventListener(
        "change",
        event=>{

            recordsFilterState.athlete =
                event.target.value;

            applyRecordsFilters();

        }
    );

    elements.typeSelect
    ?.addEventListener(
        "change",
        event=>{

            recordsFilterState.type =
                event.target.value;

            applyRecordsFilters();

        }
    );

    elements.sortSelect
    ?.addEventListener(
        "change",
        event=>{

            recordsFilterState.sort =
                event.target.value;

            applyRecordsFilters();

        }
    );

    elements.startDate
    ?.addEventListener(
        "change",
        event=>{

            recordsFilterState.startDate =
                event.target.value;

            if(
                !validateRecordsDateFilter()
            ){

                event.target.value="";

                recordsFilterState.startDate="";

            }

            applyRecordsFilters();

        }
    );

    elements.endDate
    ?.addEventListener(
        "change",
        event=>{

            recordsFilterState.endDate =
                event.target.value;

            if(
                !validateRecordsDateFilter()
            ){

                event.target.value="";

                recordsFilterState.endDate="";

            }

            applyRecordsFilters();

        }
    );

    elements.resetButton
    ?.addEventListener(
        "click",
        event=>{

            event.preventDefault();

            resetRecordsFilters();

        }
    );

}

/* ======================================================
   초기화
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        initializeRecordActions();

        initializeRecordsFilters();

        renderRecordsPage();

    }
);

/* ======================================================
   외부 사용
====================================================== */

window.applyRecordsFilters =
    applyRecordsFilters;

window.resetRecordsFilters =
    resetRecordsFilters;

window.getFilteredMergedRecords =
    getFilteredMergedRecords;
    /* ======================================================
   records.js 2-1
   통합 통계 계산
====================================================== */

"use strict";

/* ======================================================
   통계 계산
====================================================== */

function calculateRecordsStatistics(
    records = getFilteredMergedRecords()
) {

    const statistics = {

        totalRecords: records.length,

        sportsCount: 0,

        weightCount: 0,

        poseCount: 0,

        totalDuration: 0,

        totalTrainingLoad: 0,

        totalWeightVolume: 0,

        totalDistance: 0,

        averageRpe: 0,

        averagePoseScore: 0,

        highestOneRM: 0

    };

    let totalRpe = 0;
    let rpeCount = 0;

    let poseScore = 0;
    let poseCount = 0;

    records.forEach(record=>{

        switch(record.recordType){

            case "sports":

                statistics.sportsCount++;

                statistics.totalDuration +=
                    toNumber(record.duration);

                statistics.totalTrainingLoad +=
                    toNumber(record.trainingLoad);

                statistics.totalDistance +=
                    toNumber(record.distance);

                break;

            case "weight":

                statistics.weightCount++;

                statistics.totalDuration +=
                    toNumber(record.duration);

                statistics.totalTrainingLoad +=
                    toNumber(record.trainingLoad);

                statistics.totalWeightVolume +=
                    toNumber(record.trainingVolume);

                statistics.highestOneRM =
                    Math.max(
                        statistics.highestOneRM,
                        toNumber(
                            record.estimatedOneRepMax
                        )
                    );

                break;

            case "pose":

                statistics.poseCount++;

                poseScore +=
                    toNumber(record.score);

                poseCount++;

                break;

        }

        if(
            toNumber(record.rpe) > 0
        ){

            totalRpe +=
                toNumber(record.rpe);

            rpeCount++;

        }

    });

    statistics.averageRpe =
        rpeCount
            ? Number(
                (
                    totalRpe /
                    rpeCount
                ).toFixed(1)
            )
            : 0;

    statistics.averagePoseScore =
        poseCount
            ? Number(
                (
                    poseScore /
                    poseCount
                ).toFixed(1)
            )
            : 0;

    return statistics;

}

/* ======================================================
   통계 표시
====================================================== */

function setRecordsStatisticValue(
    key,
    value
){

    document
        .querySelectorAll(
            `[data-record-stat="${key}"]`
        )
        .forEach(element=>{

            element.textContent =
                value;

        });

}

/* ======================================================
   통계 출력
====================================================== */

function renderRecordsStatistics(
    records = getFilteredMergedRecords()
){

    const statistics =
        calculateRecordsStatistics(
            records
        );

    setRecordsStatisticValue(
        "total",
        statistics.totalRecords
    );

    setRecordsStatisticValue(
        "sports",
        statistics.sportsCount
    );

    setRecordsStatisticValue(
        "weight",
        statistics.weightCount
    );

    setRecordsStatisticValue(
        "pose",
        statistics.poseCount
    );

    setRecordsStatisticValue(
        "duration",
        `${statistics.totalDuration}분`
    );

    setRecordsStatisticValue(
        "load",
        statistics.totalTrainingLoad
    );

    setRecordsStatisticValue(
        "volume",
        `${statistics.totalWeightVolume.toLocaleString()} kg`
    );

    setRecordsStatisticValue(
        "distance",
        `${statistics.totalDistance} m`
    );

    setRecordsStatisticValue(
        "rpe",
        statistics.averageRpe || "-"
    );

    setRecordsStatisticValue(
        "pose-score",
        statistics.averagePoseScore || "-"
    );

    setRecordsStatisticValue(
        "one-rm",
        statistics.highestOneRM
            ? `${statistics.highestOneRM} kg`
            : "-"
    );

}

/* ======================================================
   최근 N일 기록
====================================================== */

function getRecentRecords(
    days = 7
){

    const today =
        new Date();

    return getMergedRecords()
        .filter(record=>{

            const date =
                new Date(
                    getRecordDate(record)
                );

            const diff =
                (
                    today-date
                )/
                (
                    1000*60*60*24
                );

            return diff<=days;

        });

}

/* ======================================================
   최근 7일 통계
====================================================== */

function getLastWeekStatistics(){

    return calculateRecordsStatistics(
        getRecentRecords(7)
    );

}

/* ======================================================
   최근 30일 통계
====================================================== */

function getLastMonthStatistics(){

    return calculateRecordsStatistics(
        getRecentRecords(30)
    );

}

/* ======================================================
   Dashboard 연동
====================================================== */

function refreshDashboardStatistics(){

    if(
        typeof window.renderDashboard===
        "function"
    ){

        window.renderDashboard();

    }

}

/* ======================================================
   Report 연동
====================================================== */

function refreshReportStatistics(){

    if(
        typeof window.renderReportPage===
        "function"
    ){

        window.renderReportPage();

    }

}

/* ======================================================
   외부 사용
====================================================== */

window.calculateRecordsStatistics =
    calculateRecordsStatistics;

window.renderRecordsStatistics =
    renderRecordsStatistics;

window.getLastWeekStatistics =
    getLastWeekStatistics;

window.getLastMonthStatistics =
    getLastMonthStatistics;
    /* ======================================================
   records.js 2-2
   Chart.js · CSV · Excel · 최종 연동
====================================================== */

"use strict";

/* ======================================================
   Chart 객체
====================================================== */

let recordsMonthlyChart = null;
let recordsTypeChart = null;
let recordsAthleteChart = null;

/* ======================================================
   Chart 사용 가능 여부
====================================================== */

function isRecordsChartAvailable() {
    return typeof window.Chart !== "undefined";
}

/* ======================================================
   기존 차트 제거
====================================================== */

function destroyRecordsCharts() {

    [
        recordsMonthlyChart,
        recordsTypeChart,
        recordsAthleteChart
    ].forEach(chart => {

        if (chart) {
            chart.destroy();
        }

    });

    recordsMonthlyChart = null;
    recordsTypeChart = null;
    recordsAthleteChart = null;

}

/* ======================================================
   월별 데이터
====================================================== */

function createMonthlyRecordData(records){

    const grouped = {};

    records.forEach(record=>{

        const date =
            new Date(
                getRecordDate(record)
            );

        if(
            Number.isNaN(date.getTime())
        ){
            return;
        }

        const key =
            `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;

        grouped[key] =
            (grouped[key]||0)+1;

    });

    return grouped;

}

/* ======================================================
   월별 차트
====================================================== */

function renderMonthlyChart(records){

    const canvas =
        document.querySelector(
            "#recordsMonthlyChart"
        );

    if(
        !canvas ||
        !isRecordsChartAvailable()
    ){
        return;
    }

    if(recordsMonthlyChart){
        recordsMonthlyChart.destroy();
    }

    const grouped =
        createMonthlyRecordData(records);

    recordsMonthlyChart =
        new Chart(canvas,{

            type:"line",

            data:{

                labels:Object.keys(grouped),

                datasets:[{

                    label:"월별 기록",

                    data:Object.values(grouped),

                    tension:0.3,

                    fill:false

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        });

}

/* ======================================================
   기록 종류 차트
====================================================== */

function renderRecordTypeChart(records){

    const canvas =
        document.querySelector(
            "#recordsTypeChart"
        );

    if(
        !canvas ||
        !isRecordsChartAvailable()
    ){
        return;
    }

    if(recordsTypeChart){
        recordsTypeChart.destroy();
    }

    const count={

        스포츠:0,
        웨이트:0,
        자세:0

    };

    records.forEach(record=>{

        if(record.recordType==="sports"){
            count["스포츠"]++;
        }

        if(record.recordType==="weight"){
            count["웨이트"]++;
        }

        if(record.recordType==="pose"){
            count["자세"]++;
        }

    });

    recordsTypeChart =
        new Chart(canvas,{

            type:"doughnut",

            data:{

                labels:Object.keys(count),

                datasets:[{

                    data:Object.values(count)

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

/* ======================================================
   선수별 차트
====================================================== */

function renderAthleteChart(records){

    const canvas =
        document.querySelector(
            "#recordsAthleteChart"
        );

    if(
        !canvas ||
        !isRecordsChartAvailable()
    ){
        return;
    }

    if(recordsAthleteChart){
        recordsAthleteChart.destroy();
    }

    const grouped={};

    records.forEach(record=>{

        const athlete =
            getRecordAthleteName(record);

        grouped[athlete]=
            (grouped[athlete]||0)+1;

    });

    recordsAthleteChart =
        new Chart(canvas,{

            type:"bar",

            data:{

                labels:Object.keys(grouped),

                datasets:[{

                    label:"기록 수",

                    data:Object.values(grouped)

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                scales:{
                    y:{
                        beginAtZero:true
                    }
                }

            }

        });

}

/* ======================================================
   전체 차트
====================================================== */

function renderRecordsCharts(
    records=getFilteredMergedRecords()
){

    if(records.length===0){

        destroyRecordsCharts();

        return;

    }

    renderMonthlyChart(records);

    renderRecordTypeChart(records);

    renderAthleteChart(records);

}

/* ======================================================
   CSV 내보내기
====================================================== */

function exportRecordsCsv(){

    const records =
        getFilteredMergedRecords();

    const rows=[[
        "날짜",
        "선수",
        "종류",
        "제목",
        "요약"
    ]];

    records.forEach(record=>{

        rows.push([

            getRecordDate(record),

            getRecordAthleteName(record),

            getRecordTypeLabel(record.recordType),

            getRecordTitle(record),

            getRecordSummary(record)

        ]);

    });

    const csv=
        rows
        .map(row=>row.join(","))
        .join("\n");

    const blob=
        new Blob(
            ["\uFEFF"+csv],
            {type:"text/csv;charset=utf-8;"}
        );

    const url=
        URL.createObjectURL(blob);

    const a=
        document.createElement("a");

    a.href=url;

    a.download="records.csv";

    a.click();

    URL.revokeObjectURL(url);

    showToast(
        "CSV를 저장했어용."
    );

}

/* ======================================================
   Excel(CSV) 저장
====================================================== */

function exportRecordsExcel(){

    exportRecordsCsv();

}

/* ======================================================
   render 확장
====================================================== */

const previousRenderRecordsPage =
    window.renderRecordsPage;

window.renderRecordsPage=function(){

    if(
        typeof previousRenderRecordsPage==="function"
    ){

        previousRenderRecordsPage();

    }

    const records=
        getFilteredMergedRecords();

    renderRecordsStatistics(records);

    renderRecordsCharts(records);

};

/* ======================================================
   DOM
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        renderRecordsPage();

    }
);

/* ======================================================
   외부 사용
====================================================== */

window.renderRecordsCharts =
    renderRecordsCharts;

window.destroyRecordsCharts =
    destroyRecordsCharts;

window.exportRecordsCsv =
    exportRecordsCsv;

window.exportRecordsExcel =
    exportRecordsExcel;