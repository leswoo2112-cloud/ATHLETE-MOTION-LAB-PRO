/* ======================================================
   weight.js Part 1-1
   State / Constants / DOM / Utils / Calculations
====================================================== */

"use strict";

/* ======================================================
   상태
====================================================== */

const weightState = {

    editingId: null,

    searchKeyword: "",

    selectedBodyPart: "",

    selectedExercise: "",

    sortType: "date-desc",

    page: 1,

    pageSize: 10

};

/* ======================================================
   운동 부위
====================================================== */

const BODY_PARTS = [

    "가슴",

    "등",

    "어깨",

    "하체",

    "이두",

    "삼두",

    "복근",

    "전신"

];

/* ======================================================
   운동 목록
====================================================== */

const EXERCISE_LIST = {

    "가슴": [

        "벤치프레스",

        "인클라인 벤치프레스",

        "덤벨프레스",

        "인클라인 덤벨프레스",

        "체스트프레스",

        "케이블 플라이",

        "펙덱 플라이",

        "푸쉬업"

    ],

    "등": [

        "데드리프트",

        "랫풀다운",

        "풀업",

        "바벨로우",

        "덤벨로우",

        "시티드로우",

        "티바로우",

        "백익스텐션"

    ],

    "어깨": [

        "밀리터리프레스",

        "덤벨 숄더프레스",

        "사이드레터럴레이즈",

        "프론트레이즈",

        "리어델트 플라이",

        "페이스풀",

        "아놀드프레스",

        "슈러그"

    ],

    "하체": [

        "스쿼트",

        "프론트스쿼트",

        "레그프레스",

        "레그익스텐션",

        "레그컬",

        "런지",

        "루마니안 데드리프트",

        "힙쓰러스트",

        "카프레이즈"

    ],

    "이두": [

        "바벨컬",

        "덤벨컬",

        "해머컬",

        "프리처컬",

        "케이블컬"

    ],

    "삼두": [

        "푸쉬다운",

        "오버헤드 익스텐션",

        "라잉 트라이셉스 익스텐션",

        "클로즈그립 벤치프레스",

        "딥스"

    ],

    "복근": [

        "크런치",

        "레그레이즈",

        "행잉 레그레이즈",

        "플랭크",

        "사이드 플랭크",

        "러시안 트위스트",

        "케이블 크런치"

    ],

    "전신": [

        "클린",

        "파워클린",

        "스내치",

        "케틀벨 스윙",

        "버피",

        "슬레드 푸쉬",

        "메디신볼 슬램"

    ]

};

/* ======================================================
   DOM
====================================================== */

function getWeightElements() {

    return {

        form:
            document.querySelector("#weightForm"),

        date:
            document.querySelector("#weightDate"),

        bodyPart:
            document.querySelector("#weightBodyPart"),

        exercise:
            document.querySelector("#weightExercise"),

        weight:
            document.querySelector("#weightKg"),

        reps:
            document.querySelector("#weightReps"),

        sets:
            document.querySelector("#weightSets"),

        rpe:
            document.querySelector("#weightRPE"),

        memo:
            document.querySelector("#weightMemo"),

        submit:
            document.querySelector("#weightSubmitButton"),

        cancel:
            document.querySelector("#cancelWeightEditButton"),

        list:
            document.querySelector("#weightList"),

        search:
            document.querySelector("#weightSearch"),

        bodyPartFilter:
            document.querySelector("#weightFilter"),

        exerciseFilter:
            document.querySelector("#weightExerciseFilter"),

        sort:
            document.querySelector("#weightSort"),

        pagination:
            document.querySelector("#weightPagination"),

        pageInfo:
            document.querySelector("#weightPageInfo"),

        previousPage:
            document.querySelector("#weightPrevPage"),

        nextPage:
            document.querySelector("#weightNextPage"),

        previewOneRM:
            document.querySelector("#previewOneRM"),

        previewVolume:
            document.querySelector("#previewVolume"),

        previewIntensity:
            document.querySelector("#previewIntensity")

    };

}

/* ======================================================
   공통 함수 안전 처리
====================================================== */

function weightToNumber(value) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}

function weightCreateId(prefix = "weight") {

    if(typeof createId === "function") {

        return createId(prefix);

    }

    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 10)}`;

}

function weightEscapeHTML(value) {

    if(typeof escapeHTML === "function") {

        return escapeHTML(value);

    }

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}

function weightFormatDate(value) {

    if(typeof formatDate === "function") {

        return formatDate(value);

    }

    if(!value) {

        return "-";

    }

    const date = new Date(value);

    if(Number.isNaN(date.getTime())) {

        return value;

    }

    return new Intl.DateTimeFormat(

        "ko-KR",

        {

            year: "numeric",

            month: "2-digit",

            day: "2-digit"

        }

    ).format(date);

}

function weightFormatNumber(value) {

    const number = weightToNumber(value);

    if(typeof formatNumber === "function") {

        return formatNumber(number);

    }

    return number.toLocaleString("ko-KR");

}

function weightGetTodayValue() {

    if(typeof getTodayValue === "function") {

        return getTodayValue();

    }

    const now = new Date();

    const localDate = new Date(

        now.getTime() -

        now.getTimezoneOffset() * 60000

    );

    return localDate

        .toISOString()

        .slice(0, 10);

}

function weightShowToast(message, type = "info") {

    if(typeof showToast === "function") {

        showToast(message, type);

        return;

    }

    console.log(`[${type}] ${message}`);

}

function weightAutoSave() {

    if(typeof autoSave === "function") {

        autoSave();

        return;

    }

    if(typeof saveAppData === "function") {

        saveAppData();

    }

}

function weightRenderDashboard() {

    if(typeof renderDashboard === "function") {

        renderDashboard();

    }

}

/* ======================================================
   appData 안전 처리
====================================================== */

function ensureWeightDataStore() {

    if(typeof window.appData !== "object" || !window.appData) {

        window.appData = {};

    }

    if(!Array.isArray(window.appData.weightRecords)) {

        window.appData.weightRecords = [];

    }

    return window.appData.weightRecords;

}

/* ======================================================
   선택 선수
====================================================== */

function getWeightSelectedAthlete() {

    if(typeof getSelectedAthlete !== "function") {

        return null;

    }

    return getSelectedAthlete();

}

function requireWeightAthlete() {

    const athlete = getWeightSelectedAthlete();

    if(!athlete) {

        weightShowToast(

            "선수를 먼저 선택하세요.",

            "error"

        );

        return null;

    }

    return athlete;

}

/* ======================================================
   1RM 계산
   Epley 공식
====================================================== */

function calculateOneRM(weight, reps) {

    const safeWeight =
        weightToNumber(weight);

    const safeReps =
        weightToNumber(reps);

    if(safeWeight <= 0 || safeReps <= 0) {

        return 0;

    }

    if(safeReps === 1) {

        return Number(

            safeWeight.toFixed(1)

        );

    }

    return Number(

        (

            safeWeight *

            (1 + safeReps / 30)

        ).toFixed(1)

    );

}

/* ======================================================
   볼륨 계산
====================================================== */

function calculateVolume(weight, reps, sets) {

    return Number(

        (

            weightToNumber(weight) *

            weightToNumber(reps) *

            weightToNumber(sets)

        ).toFixed(1)

    );

}

/* ======================================================
   강도 계산
====================================================== */

function calculateIntensity(weight, oneRM) {

    const safeWeight =
        weightToNumber(weight);

    const safeOneRM =
        weightToNumber(oneRM);

    if(safeWeight <= 0 || safeOneRM <= 0) {

        return 0;

    }

    return Number(

        (

            safeWeight /

            safeOneRM *

            100

        ).toFixed(1)

    );

}

/* ======================================================
   기록 값 보정
====================================================== */

function normalizeWeightRecord(record = {}) {

    const weight =
        weightToNumber(record.weight);

    const reps =
        weightToNumber(record.reps);

    const sets =
        weightToNumber(record.sets);

    const oneRM =
        weightToNumber(record.oneRM) ||

        calculateOneRM(weight, reps);

    const volume =
        weightToNumber(record.volume) ||

        calculateVolume(weight, reps, sets);

    const intensity =
        weightToNumber(record.intensity) ||

        calculateIntensity(weight, oneRM);

    return {

        ...record,

        weight,

        reps,

        sets,

        rpe:
            weightToNumber(record.rpe),

        oneRM,

        volume,

        intensity,

        memo:
            String(record.memo ?? ""),

        bodyPart:
            String(record.bodyPart ?? ""),

        exercise:
            String(record.exercise ?? "")

    };

}

/* ======================================================
   날짜 기본값
====================================================== */

function initializeWeightDate() {

    const elements =
        getWeightElements();

    if(

        elements.date &&

        !elements.date.value

    ) {

        elements.date.value =
            weightGetTodayValue();

    }

}

/* ======================================================
   운동 부위 옵션
====================================================== */

function initializeWeightBodyPartOptions() {

    const elements =
        getWeightElements();

    if(!elements.bodyPart) {

        return;

    }

    const currentValue =
        elements.bodyPart.value;

    elements.bodyPart.innerHTML =

        `<option value="">운동 부위 선택</option>`;

    BODY_PARTS.forEach(bodyPart => {

        elements.bodyPart.insertAdjacentHTML(

            "beforeend",

            `<option value="${weightEscapeHTML(bodyPart)}">
                ${weightEscapeHTML(bodyPart)}
            </option>`

        );

    });

    if(BODY_PARTS.includes(currentValue)) {

        elements.bodyPart.value =
            currentValue;

    }

}

/* ======================================================
   운동 선택 옵션
====================================================== */

function updateExerciseOptions(selectedExercise = "") {

    const elements =
        getWeightElements();

    if(

        !elements.bodyPart ||

        !elements.exercise

    ) {

        return;

    }

    const bodyPart =
        elements.bodyPart.value;

    const exercises =
        EXERCISE_LIST[bodyPart] || [];

    const previousValue =
        selectedExercise ||

        elements.exercise.value;

    elements.exercise.innerHTML =

        `<option value="">운동 선택</option>`;

    exercises.forEach(exercise => {

        elements.exercise.insertAdjacentHTML(

            "beforeend",

            `<option value="${weightEscapeHTML(exercise)}">
                ${weightEscapeHTML(exercise)}
            </option>`

        );

    });

    if(exercises.includes(previousValue)) {

        elements.exercise.value =
            previousValue;

    }

}

/* ======================================================
   실시간 미리보기
====================================================== */

function updateWeightPreview() {

    const elements =
        getWeightElements();

    const oneRM =
        calculateOneRM(

            elements.weight?.value,

            elements.reps?.value

        );

    const volume =
        calculateVolume(

            elements.weight?.value,

            elements.reps?.value,

            elements.sets?.value

        );

    const intensity =
        calculateIntensity(

            elements.weight?.value,

            oneRM

        );

    if(elements.previewOneRM) {

        elements.previewOneRM.textContent =
            `${oneRM} kg`;

    }

    if(elements.previewVolume) {

        elements.previewVolume.textContent =
            `${weightFormatNumber(volume)} kg`;

    }

    if(elements.previewIntensity) {

        elements.previewIntensity.textContent =
            `${intensity}%`;

    }

}
/* ======================================================
   weight.js Part 1-2
   Form / Validation / Save / Update / Reset
====================================================== */

/* ======================================================
   폼 데이터 가져오기
====================================================== */

function getWeightFormData() {

    const elements =
        getWeightElements();

    const athlete =
        getWeightSelectedAthlete();

    const weight =
        weightToNumber(

            elements.weight?.value

        );

    const reps =
        weightToNumber(

            elements.reps?.value

        );

    const sets =
        weightToNumber(

            elements.sets?.value

        );

    const oneRM =
        calculateOneRM(

            weight,

            reps

        );

    const volume =
        calculateVolume(

            weight,

            reps,

            sets

        );

    const intensity =
        calculateIntensity(

            weight,

            oneRM

        );

    return {

        athleteId:
            athlete?.id || "",

        athleteName:
            athlete?.name ||

            athlete?.athleteName ||

            "",

        date:
            elements.date?.value ||

            weightGetTodayValue(),

        bodyPart:
            elements.bodyPart?.value ||

            "",

        exercise:
            elements.exercise?.value ||

            "",

        weight,

        reps,

        sets,

        rpe:
            weightToNumber(

                elements.rpe?.value

            ),

        memo:
            String(

                elements.memo?.value || ""

            ).trim(),

        oneRM,

        volume,

        intensity

    };

}

/* ======================================================
   입력 검사
====================================================== */

function validateWeightData(data) {

    if(!data.athleteId) {

        weightShowToast(

            "선수를 먼저 선택하세요.",

            "error"

        );

        return false;

    }

    if(!data.date) {

        weightShowToast(

            "운동 날짜를 입력하세요.",

            "error"

        );

        return false;

    }

    if(!data.bodyPart) {

        weightShowToast(

            "운동 부위를 선택하세요.",

            "error"

        );

        return false;

    }

    if(!data.exercise) {

        weightShowToast(

            "운동을 선택하세요.",

            "error"

        );

        return false;

    }

    if(data.weight <= 0) {

        weightShowToast(

            "중량을 입력하세요.",

            "error"

        );

        return false;

    }

    if(data.reps <= 0) {

        weightShowToast(

            "횟수를 입력하세요.",

            "error"

        );

        return false;

    }

    if(data.sets <= 0) {

        weightShowToast(

            "세트 수를 입력하세요.",

            "error"

        );

        return false;

    }

    if(data.rpe < 0 || data.rpe > 10) {

        weightShowToast(

            "RPE는 0부터 10까지 입력하세요.",

            "error"

        );

        return false;

    }

    return true;

}

/* ======================================================
   새 기록 저장
====================================================== */

function saveWeightRecord(event) {

    event?.preventDefault();

    const athlete =
        requireWeightAthlete();

    if(!athlete) {

        return;

    }

    const records =
        ensureWeightDataStore();

    const formData =
        getWeightFormData();

    if(!validateWeightData(formData)) {

        return;

    }

    const now =
        new Date().toISOString();

    const record = {

        id:
            weightCreateId("weight"),

        ...formData,

        createdAt:
            now,

        updatedAt:
            now

    };

    records.unshift(record);

    weightAutoSave();

    resetWeightForm();

    refreshWeightPage();

    weightRenderDashboard();

    weightShowToast(

        "웨이트 기록이 저장되었습니다.",

        "success"

    );

}

/* ======================================================
   기록 수정 저장
====================================================== */

function updateWeightRecord(event) {

    event?.preventDefault();

    const records =
        ensureWeightDataStore();

    const index =
        records.findIndex(

            record =>

                record.id ===

                weightState.editingId

        );

    if(index === -1) {

        weightShowToast(

            "수정할 기록을 찾을 수 없습니다.",

            "error"

        );

        resetWeightForm();

        return;

    }

    const formData =
        getWeightFormData();

    if(!validateWeightData(formData)) {

        return;

    }

    records[index] = {

        ...records[index],

        ...formData,

        updatedAt:
            new Date().toISOString()

    };

    weightAutoSave();

    resetWeightForm();

    refreshWeightPage();

    weightRenderDashboard();

    weightShowToast(

        "웨이트 기록을 수정했습니다.",

        "success"

    );

}

/* ======================================================
   폼 저장 처리
====================================================== */

function handleWeightFormSubmit(event) {

    if(weightState.editingId) {

        updateWeightRecord(event);

        return;

    }

    saveWeightRecord(event);

}

/* ======================================================
   폼 초기화
====================================================== */

function resetWeightForm() {

    const elements =
        getWeightElements();

    elements.form?.reset();

    weightState.editingId =
        null;

    initializeWeightDate();

    initializeWeightBodyPartOptions();

    updateExerciseOptions();

    if(elements.submit) {

        elements.submit.textContent =
            "기록 저장";

    }

    if(elements.cancel) {

        elements.cancel.hidden =
            true;

    }

    updateWeightPreview();

}

/* ======================================================
   수정 시작
====================================================== */

function startEditWeightRecord(id) {

    const records =
        ensureWeightDataStore();

    const record =
        records.find(

            item =>

                item.id === id

        );

    if(!record) {

        weightShowToast(

            "기록을 찾을 수 없습니다.",

            "error"

        );

        return;

    }

    const normalizedRecord =
        normalizeWeightRecord(record);

    const elements =
        getWeightElements();

    weightState.editingId =
        normalizedRecord.id;

    if(elements.date) {

        elements.date.value =
            normalizedRecord.date || "";

    }

    if(elements.bodyPart) {

        elements.bodyPart.value =
            normalizedRecord.bodyPart || "";

    }

    updateExerciseOptions(

        normalizedRecord.exercise

    );

    if(elements.exercise) {

        elements.exercise.value =
            normalizedRecord.exercise || "";

    }

    if(elements.weight) {

        elements.weight.value =
            normalizedRecord.weight || "";

    }

    if(elements.reps) {

        elements.reps.value =
            normalizedRecord.reps || "";

    }

    if(elements.sets) {

        elements.sets.value =
            normalizedRecord.sets || "";

    }

    if(elements.rpe) {

        elements.rpe.value =
            normalizedRecord.rpe || "";

    }

    if(elements.memo) {

        elements.memo.value =
            normalizedRecord.memo || "";

    }

    if(elements.submit) {

        elements.submit.textContent =
            "기록 수정";

    }

    if(elements.cancel) {

        elements.cancel.hidden =
            false;

    }

    updateWeightPreview();

    elements.weight?.focus();

    elements.form?.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}

/* ======================================================
   수정 취소
====================================================== */

function cancelWeightEdit(event) {

    event?.preventDefault();

    resetWeightForm();

    weightShowToast(

        "수정을 취소했습니다.",

        "info"

    );

}

/* ======================================================
   삭제 확인
====================================================== */

function requestDeleteWeightRecord(id) {

    const records =
        ensureWeightDataStore();

    const record =
        records.find(

            item =>

                item.id === id

        );

    if(!record) {

        weightShowToast(

            "삭제할 기록을 찾을 수 없습니다.",

            "error"

        );

        return;

    }

    const message =

        `${record.exercise || "운동"} 기록을 삭제하시겠습니까?`;

    if(typeof openConfirmModal === "function") {

        openConfirmModal({

            title:
                "기록 삭제",

            message,

            confirmText:
                "삭제",

            cancelText:
                "취소",

            onConfirm() {

                deleteWeightRecord(id);

            }

        });

        return;

    }

    const confirmed =
        window.confirm(message);

    if(confirmed) {

        deleteWeightRecord(id);

    }

}

/* ======================================================
   기록 삭제
====================================================== */

function deleteWeightRecord(id) {

    const records =
        ensureWeightDataStore();

    const index =
        records.findIndex(

            record =>

                record.id === id

        );

    if(index === -1) {

        weightShowToast(

            "삭제할 기록을 찾을 수 없습니다.",

            "error"

        );

        return;

    }

    records.splice(index, 1);

    if(weightState.editingId === id) {

        resetWeightForm();

    }

    weightAutoSave();

    refreshWeightPage();

    weightRenderDashboard();

    weightShowToast(

        "웨이트 기록을 삭제했습니다.",

        "success"

    );

}

/* ======================================================
   모든 기록 삭제
====================================================== */

function requestDeleteAllWeightRecords() {

    const athlete =
        requireWeightAthlete();

    if(!athlete) {

        return;

    }

    const records =
        getCurrentWeightRecords();

    if(records.length === 0) {

        weightShowToast(

            "삭제할 기록이 없습니다.",

            "info"

        );

        return;

    }

    const message =

        `${athlete.name || "선수"}의 웨이트 기록 ${records.length}개를 모두 삭제하시겠습니까?`;

    if(typeof openConfirmModal === "function") {

        openConfirmModal({

            title:
                "전체 기록 삭제",

            message,

            confirmText:
                "전체 삭제",

            cancelText:
                "취소",

            onConfirm() {

                deleteAllWeightRecords();

            }

        });

        return;

    }

    if(window.confirm(message)) {

        deleteAllWeightRecords();

    }

}

/* ======================================================
   선택 선수 전체 기록 삭제
====================================================== */

function deleteAllWeightRecords() {

    const athlete =
        getWeightSelectedAthlete();

    if(!athlete) {

        return;

    }

    const records =
        ensureWeightDataStore();

    window.appData.weightRecords =

        records.filter(

            record =>

                record.athleteId !==

                athlete.id

        );

    resetWeightForm();

    weightAutoSave();

    refreshWeightPage();

    weightRenderDashboard();

    weightShowToast(

        "선택한 선수의 웨이트 기록을 모두 삭제했습니다.",

        "success"

    );

}

/* ======================================================
   입력 이벤트 초기화
====================================================== */

function initializeWeightInputs() {

    const elements =
        getWeightElements();

    elements.bodyPart?.addEventListener(

        "change",

        () => {

            updateExerciseOptions();

            updateWeightPreview();

        }

    );

    [

        elements.weight,

        elements.reps,

        elements.sets

    ].forEach(input => {

        input?.addEventListener(

            "input",

            updateWeightPreview

        );

    });

}

/* ======================================================
   기록 데이터 보정
====================================================== */

function normalizeAllWeightRecords() {

    const records =
        ensureWeightDataStore();

    window.appData.weightRecords =

        records.map(record => {

            const normalized =
                normalizeWeightRecord(record);

            return {

                id:
                    normalized.id ||

                    weightCreateId("weight"),

                athleteId:
                    normalized.athleteId ||

                    "",

                athleteName:
                    normalized.athleteName ||

                    "",

                date:
                    normalized.date ||

                    weightGetTodayValue(),

                bodyPart:
                    normalized.bodyPart,

                exercise:
                    normalized.exercise,

                weight:
                    normalized.weight,

                reps:
                    normalized.reps,

                sets:
                    normalized.sets,

                rpe:
                    normalized.rpe,

                memo:
                    normalized.memo,

                oneRM:
                    normalized.oneRM,

                volume:
                    normalized.volume,

                intensity:
                    normalized.intensity,

                createdAt:
                    normalized.createdAt ||

                    new Date().toISOString(),

                updatedAt:
                    normalized.updatedAt ||

                    new Date().toISOString()

            };

        });

}
/* ======================================================
   weight.js Part 2-1
   Records / Search / Filter / Sort / Pagination
====================================================== */

/* ======================================================
   현재 선수 기록
====================================================== */

function getCurrentWeightRecords() {

    const athlete =
        getWeightSelectedAthlete();

    if(!athlete) {

        return [];

    }

    const records =
        ensureWeightDataStore();

    return records

        .filter(record => {

            return (

                String(record.athleteId) ===

                String(athlete.id)

            );

        })

        .map(normalizeWeightRecord);

}

/* ======================================================
   검색
====================================================== */

function searchWeightRecords(records) {

    const keyword =

        String(

            weightState.searchKeyword || ""

        )

        .trim()

        .toLowerCase();

    if(!keyword) {

        return records;

    }

    return records.filter(record => {

        const exercise =

            String(record.exercise || "")

            .toLowerCase();

        const bodyPart =

            String(record.bodyPart || "")

            .toLowerCase();

        const memo =

            String(record.memo || "")

            .toLowerCase();

        const date =

            String(record.date || "")

            .toLowerCase();

        return (

            exercise.includes(keyword) ||

            bodyPart.includes(keyword) ||

            memo.includes(keyword) ||

            date.includes(keyword)

        );

    });

}

/* ======================================================
   운동 부위 필터
====================================================== */

function filterWeightRecordsByBodyPart(records) {

    const bodyPart =

        weightState.selectedBodyPart;

    if(!bodyPart) {

        return records;

    }

    return records.filter(record => {

        return (

            record.bodyPart ===

            bodyPart

        );

    });

}

/* ======================================================
   운동 필터
====================================================== */

function filterWeightRecordsByExercise(records) {

    const exercise =

        weightState.selectedExercise;

    if(!exercise) {

        return records;

    }

    return records.filter(record => {

        return (

            record.exercise ===

            exercise

        );

    });

}

/* ======================================================
   날짜 시간값
====================================================== */

function getWeightDateTime(record) {

    const value =

        record?.date ||

        record?.createdAt ||

        "";

    const time =

        new Date(value).getTime();

    return Number.isNaN(time)

        ? 0

        : time;

}

/* ======================================================
   정렬
====================================================== */

function sortWeightRecords(records) {

    const sorted =

        [...records];

    switch(weightState.sortType) {

        case "date-asc":

            return sorted.sort(

                (a, b) =>

                    getWeightDateTime(a) -

                    getWeightDateTime(b)

            );

        case "weight-desc":

            return sorted.sort(

                (a, b) =>

                    b.weight -

                    a.weight

            );

        case "weight-asc":

            return sorted.sort(

                (a, b) =>

                    a.weight -

                    b.weight

            );

        case "volume-desc":

            return sorted.sort(

                (a, b) =>

                    b.volume -

                    a.volume

            );

        case "volume-asc":

            return sorted.sort(

                (a, b) =>

                    a.volume -

                    b.volume

            );

        case "onerm-desc":

            return sorted.sort(

                (a, b) =>

                    b.oneRM -

                    a.oneRM

            );

        case "onerm-asc":

            return sorted.sort(

                (a, b) =>

                    a.oneRM -

                    b.oneRM

            );

        case "rpe-desc":

            return sorted.sort(

                (a, b) =>

                    b.rpe -

                    a.rpe

            );

        case "rpe-asc":

            return sorted.sort(

                (a, b) =>

                    a.rpe -

                    b.rpe

            );

        case "exercise-asc":

            return sorted.sort(

                (a, b) =>

                    String(a.exercise)

                    .localeCompare(

                        String(b.exercise),

                        "ko"

                    )

            );

        case "date-desc":

        default:

            return sorted.sort(

                (a, b) => {

                    const dateDifference =

                        getWeightDateTime(b) -

                        getWeightDateTime(a);

                    if(dateDifference !== 0) {

                        return dateDifference;

                    }

                    return String(

                        b.createdAt || ""

                    ).localeCompare(

                        String(

                            a.createdAt || ""

                        )

                    );

                }

            );

    }

}

/* ======================================================
   모든 검색/필터/정렬 적용
====================================================== */

function getFilteredWeightRecords() {

    let records =

        getCurrentWeightRecords();

    records =

        searchWeightRecords(records);

    records =

        filterWeightRecordsByBodyPart(records);

    records =

        filterWeightRecordsByExercise(records);

    records =

        sortWeightRecords(records);

    return records;

}

/* ======================================================
   총 페이지 수
====================================================== */

function getWeightTotalPages(records = null) {

    const targetRecords =

        records ||

        getFilteredWeightRecords();

    const pageSize =

        Math.max(

            1,

            weightToNumber(

                weightState.pageSize

            ) || 10

        );

    return Math.max(

        1,

        Math.ceil(

            targetRecords.length /

            pageSize

        )

    );

}

/* ======================================================
   현재 페이지 보정
====================================================== */

function normalizeWeightPage(records = null) {

    const totalPages =

        getWeightTotalPages(records);

    if(weightState.page < 1) {

        weightState.page = 1;

    }

    if(weightState.page > totalPages) {

        weightState.page = totalPages;

    }

    return weightState.page;

}

/* ======================================================
   현재 페이지 기록
====================================================== */

function getPaginatedWeightRecords(records = null) {

    const targetRecords =

        records ||

        getFilteredWeightRecords();

    normalizeWeightPage(targetRecords);

    const pageSize =

        Math.max(

            1,

            weightToNumber(

                weightState.pageSize

            ) || 10

        );

    const start =

        (

            weightState.page - 1

        ) * pageSize;

    const end =

        start + pageSize;

    return targetRecords.slice(

        start,

        end

    );

}

/* ======================================================
   검색 상태 초기화
====================================================== */

function resetWeightFilters() {

    const elements =

        getWeightElements();

    weightState.searchKeyword =
        "";

    weightState.selectedBodyPart =
        "";

    weightState.selectedExercise =
        "";

    weightState.sortType =
        "date-desc";

    weightState.page =
        1;

    if(elements.search) {

        elements.search.value =
            "";

    }

    if(elements.bodyPartFilter) {

        elements.bodyPartFilter.value =
            "";

    }

    if(elements.exerciseFilter) {

        elements.exerciseFilter.value =
            "";

    }

    if(elements.sort) {

        elements.sort.value =
            "date-desc";

    }

    renderWeightPage();

}

/* ======================================================
   필터용 부위 옵션
====================================================== */

function initializeWeightFilterOptions() {

    const elements =

        getWeightElements();

    if(!elements.bodyPartFilter) {

        return;

    }

    const currentValue =

        weightState.selectedBodyPart ||

        elements.bodyPartFilter.value;

    elements.bodyPartFilter.innerHTML =

        `<option value="">전체 부위</option>`;

    BODY_PARTS.forEach(bodyPart => {

        elements.bodyPartFilter

            .insertAdjacentHTML(

                "beforeend",

                `<option value="${weightEscapeHTML(bodyPart)}">
                    ${weightEscapeHTML(bodyPart)}
                </option>`

            );

    });

    if(BODY_PARTS.includes(currentValue)) {

        elements.bodyPartFilter.value =

            currentValue;

    }

}

/* ======================================================
   필터용 운동 목록
====================================================== */

function getAvailableWeightExercises() {

    const records =

        getCurrentWeightRecords();

    const exerciseSet =

        new Set();

    records.forEach(record => {

        if(record.exercise) {

            exerciseSet.add(

                record.exercise

            );

        }

    });

    if(weightState.selectedBodyPart) {

        const bodyPartExercises =

            EXERCISE_LIST[

                weightState.selectedBodyPart

            ] || [];

        bodyPartExercises.forEach(

            exercise =>

                exerciseSet.add(exercise)

        );

    }

    return [...exerciseSet]

        .sort(

            (a, b) =>

                String(a).localeCompare(

                    String(b),

                    "ko"

                )

        );

}

/* ======================================================
   운동 필터 옵션 갱신
====================================================== */

function updateWeightExerciseFilterOptions() {

    const elements =

        getWeightElements();

    if(!elements.exerciseFilter) {

        return;

    }

    const previousValue =

        weightState.selectedExercise ||

        elements.exerciseFilter.value;

    const exercises =

        getAvailableWeightExercises();

    elements.exerciseFilter.innerHTML =

        `<option value="">전체 운동</option>`;

    exercises.forEach(exercise => {

        elements.exerciseFilter

            .insertAdjacentHTML(

                "beforeend",

                `<option value="${weightEscapeHTML(exercise)}">
                    ${weightEscapeHTML(exercise)}
                </option>`

            );

    });

    if(exercises.includes(previousValue)) {

        elements.exerciseFilter.value =

            previousValue;

    } else {

        weightState.selectedExercise =
            "";

    }

}

/* ======================================================
   검색 이벤트
====================================================== */

function initializeWeightSearch() {

    const elements =

        getWeightElements();

    elements.search?.addEventListener(

        "input",

        event => {

            weightState.searchKeyword =

                event.target.value;

            weightState.page = 1;

            renderWeightPage();

        }

    );

}

/* ======================================================
   부위 필터 이벤트
====================================================== */

function initializeWeightFilter() {

    const elements =

        getWeightElements();

    elements.bodyPartFilter

        ?.addEventListener(

            "change",

            event => {

                weightState.selectedBodyPart =

                    event.target.value;

                weightState.selectedExercise =
                    "";

                weightState.page =
                    1;

                updateWeightExerciseFilterOptions();

                renderWeightPage();

            }

        );

}

/* ======================================================
   운동 필터 이벤트
====================================================== */

function initializeWeightExerciseFilter() {

    const elements =

        getWeightElements();

    elements.exerciseFilter

        ?.addEventListener(

            "change",

            event => {

                weightState.selectedExercise =

                    event.target.value;

                weightState.page =
                    1;

                renderWeightPage();

            }

        );

}

/* ======================================================
   정렬 이벤트
====================================================== */

function initializeWeightSort() {

    const elements =

        getWeightElements();

    elements.sort?.addEventListener(

        "change",

        event => {

            weightState.sortType =

                event.target.value ||

                "date-desc";

            weightState.page =
                1;

            renderWeightPage();

        }

    );

}

/* ======================================================
   이전 페이지
====================================================== */

function goToPreviousWeightPage() {

    if(weightState.page <= 1) {

        return;

    }

    weightState.page -= 1;

    renderWeightPage();

}

/* ======================================================
   다음 페이지
====================================================== */

function goToNextWeightPage() {

    const totalPages =

        getWeightTotalPages();

    if(weightState.page >= totalPages) {

        return;

    }

    weightState.page += 1;

    renderWeightPage();

}

/* ======================================================
   특정 페이지 이동
====================================================== */

function goToWeightPage(page) {

    const totalPages =

        getWeightTotalPages();

    const nextPage =

        Math.min(

            totalPages,

            Math.max(

                1,

                weightToNumber(page)

            )

        );

    weightState.page =

        nextPage;

    renderWeightPage();

}
/* ======================================================
   weight.js Part 2-2
   Card UI / Empty State / Pagination / Render
====================================================== */

/* ======================================================
   RPE 표시
====================================================== */

function getWeightRPELabel(rpe) {

    const value =
        weightToNumber(rpe);

    if(value <= 0) {

        return "-";

    }

    if(value <= 5) {

        return `${value} · 여유`;

    }

    if(value <= 7) {

        return `${value} · 보통`;

    }

    if(value <= 8) {

        return `${value} · 높음`;

    }

    return `${value} · 매우 높음`;

}

/* ======================================================
   강도 표시
====================================================== */

function getWeightIntensityLabel(intensity) {

    const value =
        weightToNumber(intensity);

    if(value <= 0) {

        return "-";

    }

    if(value < 60) {

        return `${value}% · 가벼움`;

    }

    if(value < 75) {

        return `${value}% · 중간`;

    }

    if(value < 90) {

        return `${value}% · 높음`;

    }

    return `${value}% · 최대`;

}

/* ======================================================
   카드 HTML
====================================================== */

function createWeightCardHTML(record) {

    const safeRecord =
        normalizeWeightRecord(record);

    const memoHTML =
        safeRecord.memo

            ? `

<div class="weight-card-memo">

    <strong>메모</strong>

    <p>
        ${weightEscapeHTML(safeRecord.memo)}
    </p>

</div>

`

            : "";

    return `

<article
    class="weight-card"
    data-weight-record-id="${weightEscapeHTML(safeRecord.id)}"
>

    <div class="weight-card-header">

        <div>

            <span class="weight-body-part-badge">

                ${weightEscapeHTML(safeRecord.bodyPart || "미분류")}

            </span>

            <h3>

                ${weightEscapeHTML(safeRecord.exercise || "운동")}

            </h3>

        </div>

        <time datetime="${weightEscapeHTML(safeRecord.date)}">

            ${weightFormatDate(safeRecord.date)}

        </time>

    </div>

    <div class="weight-card-main">

        <div class="weight-main-value">

            <span>중량</span>

            <strong>

                ${weightFormatNumber(safeRecord.weight)}
                <small>kg</small>

            </strong>

        </div>

        <div class="weight-main-value">

            <span>반복</span>

            <strong>

                ${weightFormatNumber(safeRecord.reps)}
                <small>회</small>

            </strong>

        </div>

        <div class="weight-main-value">

            <span>세트</span>

            <strong>

                ${weightFormatNumber(safeRecord.sets)}
                <small>세트</small>

            </strong>

        </div>

    </div>

    <div class="weight-card-stat-grid">

        <div class="weight-card-stat">

            <span>예상 1RM</span>

            <strong>

                ${weightFormatNumber(safeRecord.oneRM)} kg

            </strong>

        </div>

        <div class="weight-card-stat">

            <span>총 볼륨</span>

            <strong>

                ${weightFormatNumber(safeRecord.volume)} kg

            </strong>

        </div>

        <div class="weight-card-stat">

            <span>강도</span>

            <strong>

                ${weightEscapeHTML(
                    getWeightIntensityLabel(
                        safeRecord.intensity
                    )
                )}

            </strong>

        </div>

        <div class="weight-card-stat">

            <span>RPE</span>

            <strong>

                ${weightEscapeHTML(
                    getWeightRPELabel(
                        safeRecord.rpe
                    )
                )}

            </strong>

        </div>

    </div>

    ${memoHTML}

    <div class="weight-card-actions">

        <button
            type="button"
            class="weight-edit-button"
            data-action="edit-weight"
            data-id="${weightEscapeHTML(safeRecord.id)}"
        >

            수정

        </button>

        <button
            type="button"
            class="weight-delete-button danger"
            data-action="delete-weight"
            data-id="${weightEscapeHTML(safeRecord.id)}"
        >

            삭제

        </button>

    </div>

</article>

`;

}

/* ======================================================
   선수 미선택 화면
====================================================== */

function renderWeightAthleteRequired() {

    const elements =
        getWeightElements();

    if(!elements.list) {

        return;

    }

    elements.list.innerHTML = `

<div class="empty-box weight-empty-box">

    <div class="empty-icon">

        👤

    </div>

    <h3>

        선수를 먼저 선택하세요

    </h3>

    <p>

        선수 선택 후 웨이트 기록을 확인하거나 저장할 수 있습니다.

    </p>

</div>

`;

}

/* ======================================================
   기본 빈 화면
====================================================== */

function renderEmptyWeight() {

    const elements =
        getWeightElements();

    if(!elements.list) {

        return;

    }

    const hasFilter =

        Boolean(

            weightState.searchKeyword ||

            weightState.selectedBodyPart ||

            weightState.selectedExercise

        );

    if(hasFilter) {

        elements.list.innerHTML = `

<div class="empty-box weight-empty-box">

    <div class="empty-icon">

        🔎

    </div>

    <h3>

        검색 결과가 없습니다

    </h3>

    <p>

        검색어나 필터 조건을 변경해 주세요.

    </p>

    <button
        type="button"
        data-action="reset-weight-filter"
    >

        필터 초기화

    </button>

</div>

`;

        return;

    }

    elements.list.innerHTML = `

<div class="empty-box weight-empty-box">

    <div class="empty-icon">

        🏋️

    </div>

    <h3>

        등록된 웨이트 기록이 없습니다

    </h3>

    <p>

        첫 번째 운동 기록을 저장해 보세요.

    </p>

</div>

`;

}

/* ======================================================
   페이지 번호 버튼 HTML
====================================================== */

function createWeightPageButtonHTML(page) {

    const isCurrent =

        page === weightState.page;

    return `

<button
    type="button"
    class="weight-page-button${isCurrent ? " active" : ""}"
    data-action="weight-page"
    data-page="${page}"
    ${isCurrent ? 'aria-current="page"' : ""}
>

    ${page}

</button>

`;

}

/* ======================================================
   페이지 번호 범위
====================================================== */

function getWeightPageRange(totalPages) {

    const maximumButtons =
        5;

    if(totalPages <= maximumButtons) {

        return Array.from(

            {

                length:
                    totalPages

            },

            (_, index) =>
                index + 1

        );

    }

    let start =

        weightState.page - 2;

    let end =

        weightState.page + 2;

    if(start < 1) {

        start = 1;

        end = maximumButtons;

    }

    if(end > totalPages) {

        end = totalPages;

        start =

            totalPages -

            maximumButtons +

            1;

    }

    return Array.from(

        {

            length:
                end - start + 1

        },

        (_, index) =>
            start + index

    );

}

/* ======================================================
   페이지네이션 출력
====================================================== */

function renderWeightPagination(records) {

    const elements =
        getWeightElements();

    const totalRecords =
        records.length;

    const totalPages =
        getWeightTotalPages(records);

    normalizeWeightPage(records);

    if(elements.pageInfo) {

        elements.pageInfo.textContent =

            totalRecords === 0

                ? "0개 기록"

                : `${weightState.page} / ${totalPages} 페이지 · 총 ${totalRecords}개`;

    }

    if(elements.previousPage) {

        elements.previousPage.disabled =

            weightState.page <= 1;

    }

    if(elements.nextPage) {

        elements.nextPage.disabled =

            weightState.page >= totalPages;

    }

    if(!elements.pagination) {

        return;

    }

    if(totalRecords === 0 || totalPages <= 1) {

        elements.pagination.innerHTML =
            "";

        elements.pagination.hidden =
            true;

        return;

    }

    elements.pagination.hidden =
        false;

    const pages =
        getWeightPageRange(totalPages);

    const firstButton =

        pages[0] > 1

            ? `

<button
    type="button"
    class="weight-page-button"
    data-action="weight-page"
    data-page="1"
>

    1

</button>

${pages[0] > 2 ? '<span class="weight-page-gap">…</span>' : ""}

`

            : "";

    const lastPage =

        pages[pages.length - 1];

    const lastButton =

        lastPage < totalPages

            ? `

${lastPage < totalPages - 1 ? '<span class="weight-page-gap">…</span>' : ""}

<button
    type="button"
    class="weight-page-button"
    data-action="weight-page"
    data-page="${totalPages}"
>

    ${totalPages}

</button>

`

            : "";

    elements.pagination.innerHTML = `

<button
    type="button"
    class="weight-page-arrow"
    data-action="weight-prev-page"
    ${weightState.page <= 1 ? "disabled" : ""}
>

    이전

</button>

${firstButton}

${pages
    .map(createWeightPageButtonHTML)
    .join("")}

${lastButton}

<button
    type="button"
    class="weight-page-arrow"
    data-action="weight-next-page"
    ${weightState.page >= totalPages ? "disabled" : ""}
>

    다음

</button>

`;

}

/* ======================================================
   기록 개수 출력
====================================================== */

function renderWeightRecordCount(

    filteredCount,

    totalCount

) {

    const elements =

        document.querySelectorAll(

            "[data-weight-record-count]"

        );

    elements.forEach(element => {

        if(filteredCount === totalCount) {

            element.textContent =

                `${totalCount}개`;

            return;

        }

        element.textContent =

            `${filteredCount}개 / 전체 ${totalCount}개`;

    });

}

/* ======================================================
   페이지 출력
====================================================== */

function renderWeightPage() {

    const elements =
        getWeightElements();

    if(!elements.list) {

        return;

    }

    const athlete =
        getWeightSelectedAthlete();

    if(!athlete) {

        renderWeightAthleteRequired();

        renderWeightPagination([]);

        renderWeightRecordCount(0, 0);

        return;

    }

    updateWeightExerciseFilterOptions();

    const allRecords =
        getCurrentWeightRecords();

    const filteredRecords =
        getFilteredWeightRecords();

    renderWeightRecordCount(

        filteredRecords.length,

        allRecords.length

    );

    if(filteredRecords.length === 0) {

        renderEmptyWeight();

        renderWeightPagination(

            filteredRecords

        );

        renderWeightDashboardCards?.();

        renderWeightAnalysis?.();

        renderWeightAIReport?.();

        refreshWeightCharts?.();

        return;

    }

    const pageRecords =
        getPaginatedWeightRecords(

            filteredRecords

        );

    elements.list.innerHTML =

        pageRecords

            .map(createWeightCardHTML)

            .join("");

    renderWeightPagination(

        filteredRecords

    );

    renderWeightDashboardCards?.();

    renderWeightAnalysis?.();

    renderWeightAIReport?.();

    refreshWeightCharts?.();

}

/* ======================================================
   카드 버튼 이벤트
====================================================== */

function handleWeightListClick(event) {

    const button =

        event.target.closest(

            "[data-action]"

        );

    if(!button) {

        return;

    }

    const action =
        button.dataset.action;

    const id =
        button.dataset.id;

    switch(action) {

        case "edit-weight":

            startEditWeightRecord(id);

            break;

        case "delete-weight":

            requestDeleteWeightRecord(id);

            break;

        case "reset-weight-filter":

            resetWeightFilters();

            break;

    }

}

/* ======================================================
   페이지네이션 클릭
====================================================== */

function handleWeightPaginationClick(event) {

    const button =

        event.target.closest(

            "[data-action]"

        );

    if(!button) {

        return;

    }

    const action =
        button.dataset.action;

    switch(action) {

        case "weight-page":

            goToWeightPage(

                button.dataset.page

            );

            break;

        case "weight-prev-page":

            goToPreviousWeightPage();

            break;

        case "weight-next-page":

            goToNextWeightPage();

            break;

    }

}

/* ======================================================
   페이지당 기록 개수 변경
====================================================== */

function setWeightPageSize(size) {

    const nextSize =

        Math.max(

            1,

            weightToNumber(size)

        );

    weightState.pageSize =
        nextSize;

    weightState.page =
        1;

    renderWeightPage();

}

/* ======================================================
   페이지 이동 시 상단으로
====================================================== */

function scrollWeightListToTop() {

    const elements =
        getWeightElements();

    elements.list?.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}

/* ======================================================
   페이지 이동 함수 보강
====================================================== */

function changeWeightPage(page) {

    const previousPage =

        weightState.page;

    goToWeightPage(page);

    if(previousPage !== weightState.page) {

        scrollWeightListToTop();

    }

}
/* ======================================================
   weight.js Part 3-1
   Statistics / Summary / Personal Record
====================================================== */

/* ======================================================
   통계용 기록
====================================================== */

function getWeightStatisticsRecords() {

    return getFilteredWeightRecords();

}

/* ======================================================
   필터 영향 없는 전체 선수 기록
====================================================== */

function getAllWeightStatisticsRecords() {

    return getCurrentWeightRecords();

}

/* ======================================================
   총 운동 기록 수
====================================================== */

function getTotalWorkoutCount() {

    return getWeightStatisticsRecords().length;

}

/* ======================================================
   총 볼륨
====================================================== */

function getTotalVolume() {

    return getWeightStatisticsRecords()

        .reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.volume),

            0

        );

}

/* ======================================================
   평균 볼륨
====================================================== */

function getAverageVolume() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return 0;

    }

    return Number(

        (

            getTotalVolume() /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   평균 중량
====================================================== */

function getAverageWeight() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return 0;

    }

    const total =

        records.reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.weight),

            0

        );

    return Number(

        (

            total /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   평균 1RM
====================================================== */

function getAverageOneRM() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return 0;

    }

    const total =

        records.reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.oneRM),

            0

        );

    return Number(

        (

            total /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   평균 RPE
====================================================== */

function getAverageRPE() {

    const records =

        getWeightStatisticsRecords()

        .filter(

            record =>

                weightToNumber(record.rpe) > 0

        );

    if(records.length === 0) {

        return 0;

    }

    const total =

        records.reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.rpe),

            0

        );

    return Number(

        (

            total /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   최고 1RM
====================================================== */

function getBestOneRM() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return 0;

    }

    return Math.max(

        ...records.map(

            record =>

                weightToNumber(record.oneRM)

        )

    );

}

/* ======================================================
   최고 볼륨
====================================================== */

function getBestVolume() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return 0;

    }

    return Math.max(

        ...records.map(

            record =>

                weightToNumber(record.volume)

        )

    );

}

/* ======================================================
   최고 중량
====================================================== */

function getBestWeight() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return 0;

    }

    return Math.max(

        ...records.map(

            record =>

                weightToNumber(record.weight)

        )

    );

}

/* ======================================================
   운동 종류 수
====================================================== */

function getExerciseCount() {

    return new Set(

        getWeightStatisticsRecords()

            .map(

                record =>

                    record.exercise

            )

            .filter(Boolean)

    ).size;

}

/* ======================================================
   운동 부위 수
====================================================== */

function getBodyPartCount() {

    return new Set(

        getWeightStatisticsRecords()

            .map(

                record =>

                    record.bodyPart

            )

            .filter(Boolean)

    ).size;

}

/* ======================================================
   운동별 기록
====================================================== */

function getExerciseRecords(exercise) {

    if(!exercise) {

        return [];

    }

    return getAllWeightStatisticsRecords()

        .filter(

            record =>

                record.exercise ===

                exercise

        )

        .map(normalizeWeightRecord);

}

/* ======================================================
   운동별 최고 기록
====================================================== */

function getExercisePR(exercise) {

    const records =
        getExerciseRecords(exercise);

    if(records.length === 0) {

        return null;

    }

    return records.reduce(

        (best, current) => {

            if(

                weightToNumber(current.oneRM) >

                weightToNumber(best.oneRM)

            ) {

                return current;

            }

            if(

                weightToNumber(current.oneRM) ===

                weightToNumber(best.oneRM)

                &&

                getWeightDateTime(current) >

                getWeightDateTime(best)

            ) {

                return current;

            }

            return best;

        }

    );

}

/* ======================================================
   전체 최고 기록
====================================================== */

function getWeightPersonalRecord() {

    const records =
        getWeightStatisticsRecords();

    if(records.length === 0) {

        return null;

    }

    return records.reduce(

        (best, current) => {

            return (

                weightToNumber(current.oneRM) >

                weightToNumber(best.oneRM)

            )

                ? current

                : best;

        }

    );

}

/* ======================================================
   최근 기록
====================================================== */

function getLatestWeightRecord() {

    const records =

        [...getAllWeightStatisticsRecords()]

        .sort(

            (a, b) =>

                getWeightDateTime(b) -

                getWeightDateTime(a)

        );

    return records[0] || null;

}

/* ======================================================
   첫 번째 기록
====================================================== */

function getFirstWeightRecord() {

    const records =

        [...getAllWeightStatisticsRecords()]

        .sort(

            (a, b) =>

                getWeightDateTime(a) -

                getWeightDateTime(b)

        );

    return records[0] || null;

}

/* ======================================================
   날짜 차이
====================================================== */

function getWeightDaysDifference(

    startDate,

    endDate

) {

    const start =
        new Date(startDate);

    const end =
        new Date(endDate);

    if(

        Number.isNaN(start.getTime()) ||

        Number.isNaN(end.getTime())

    ) {

        return 0;

    }

    const difference =

        end.getTime() -

        start.getTime();

    return Math.max(

        0,

        Math.floor(

            difference /

            86400000

        )

    );

}

/* ======================================================
   최근 N일 기록
====================================================== */

function getRecentWeightRecords(days = 7) {

    const safeDays =

        Math.max(

            1,

            weightToNumber(days)

        );

    const today =
        new Date();

    today.setHours(

        23,

        59,

        59,

        999

    );

    const limit =
        new Date(today);

    limit.setDate(

        limit.getDate() -

        safeDays +

        1

    );

    limit.setHours(

        0,

        0,

        0,

        0

    );

    return getAllWeightStatisticsRecords()

        .filter(record => {

            const date =

                new Date(record.date);

            if(Number.isNaN(date.getTime())) {

                return false;

            }

            return (

                date >= limit &&

                date <= today

            );

        });

}

/* ======================================================
   최근 7일 기록
====================================================== */

function getLastWeekRecords() {

    return getRecentWeightRecords(7);

}

/* ======================================================
   최근 30일 기록
====================================================== */

function getLastMonthRecords() {

    return getRecentWeightRecords(30);

}

/* ======================================================
   기간 볼륨
====================================================== */

function getWeightVolumeByRecords(records) {

    return records.reduce(

        (sum, record) =>

            sum +

            weightToNumber(record.volume),

        0

    );

}

/* ======================================================
   최근 7일 볼륨
====================================================== */

function getLastWeekVolume() {

    return getWeightVolumeByRecords(

        getLastWeekRecords()

    );

}

/* ======================================================
   최근 30일 볼륨
====================================================== */

function getLastMonthVolume() {

    return getWeightVolumeByRecords(

        getLastMonthRecords()

    );

}

/* ======================================================
   가장 많이 수행한 운동
====================================================== */

function getMostPerformedExercise() {

    const counter = {};

    getAllWeightStatisticsRecords()

        .forEach(record => {

            const exercise =
                record.exercise;

            if(!exercise) {

                return;

            }

            counter[exercise] =

                (

                    counter[exercise] ||

                    0

                ) + 1;

        });

    const ranking =

        Object.entries(counter)

        .sort(

            (a, b) =>

                b[1] -

                a[1]

        );

    if(ranking.length === 0) {

        return null;

    }

    return {

        exercise:
            ranking[0][0],

        count:
            ranking[0][1]

    };

}

/* ======================================================
   가장 많이 수행한 부위
====================================================== */

function getMostPerformedBodyPart() {

    const counter = {};

    getAllWeightStatisticsRecords()

        .forEach(record => {

            const bodyPart =
                record.bodyPart;

            if(!bodyPart) {

                return;

            }

            counter[bodyPart] =

                (

                    counter[bodyPart] ||

                    0

                ) + 1;

        });

    const ranking =

        Object.entries(counter)

        .sort(

            (a, b) =>

                b[1] -

                a[1]

        );

    if(ranking.length === 0) {

        return null;

    }

    return {

        bodyPart:
            ranking[0][0],

        count:
            ranking[0][1]

    };

}

/* ======================================================
   운동 부위 통계
====================================================== */

function getBodyPartStatistics() {

    const statistics = {};

    BODY_PARTS.forEach(

        bodyPart => {

            statistics[bodyPart] =
                0;

        }

    );

    getAllWeightStatisticsRecords()

        .forEach(record => {

            const bodyPart =
                record.bodyPart;

            if(!bodyPart) {

                return;

            }

            if(

                typeof statistics[bodyPart] !==

                "number"

            ) {

                statistics[bodyPart] =
                    0;

            }

            statistics[bodyPart] +=
                1;

        });

    return statistics;

}

/* ======================================================
   전체 성장률
====================================================== */

function calculateGrowthRate() {

    const records =

        [...getAllWeightStatisticsRecords()]

        .filter(

            record =>

                weightToNumber(record.oneRM) > 0

        )

        .sort(

            (a, b) =>

                getWeightDateTime(a) -

                getWeightDateTime(b)

        );

    if(records.length < 2) {

        return 0;

    }

    const first =
        weightToNumber(

            records[0].oneRM

        );

    const last =
        weightToNumber(

            records.at(-1).oneRM

        );

    if(first <= 0) {

        return 0;

    }

    return Number(

        (

            (

                last -

                first

            ) /

            first *

            100

        ).toFixed(1)

    );

}

/* ======================================================
   운동별 평균 중량
====================================================== */

function getExerciseAverageWeight(exercise) {

    const records =
        getExerciseRecords(exercise);

    if(records.length === 0) {

        return 0;

    }

    const total =

        records.reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.weight),

            0

        );

    return Number(

        (

            total /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   운동별 평균 볼륨
====================================================== */

function getExerciseAverageVolume(exercise) {

    const records =
        getExerciseRecords(exercise);

    if(records.length === 0) {

        return 0;

    }

    const total =

        records.reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.volume),

            0

        );

    return Number(

        (

            total /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   기본 통계 데이터
====================================================== */

function getWeightDashboardData() {

    return {

        totalWorkout:
            getTotalWorkoutCount(),

        totalVolume:
            getTotalVolume(),

        averageVolume:
            getAverageVolume(),

        averageWeight:
            getAverageWeight(),

        averageOneRM:
            getAverageOneRM(),

        averageRPE:
            getAverageRPE(),

        bestOneRM:
            getBestOneRM(),

        bestVolume:
            getBestVolume(),

        bestWeight:
            getBestWeight(),

        exerciseCount:
            getExerciseCount(),

        bodyPartCount:
            getBodyPartCount(),

        growth:
            calculateGrowthRate(),

        weekVolume:
            getLastWeekVolume(),

        monthVolume:
            getLastMonthVolume()

    };

}
/* ======================================================
   weight.js Part 3-2
   Dashboard / Growth / Recovery / AI Analysis
====================================================== */

/* ======================================================
   통계 값 출력 형식
====================================================== */

function formatWeightStatisticValue(
    key,
    value
) {

    switch(key) {

        case "totalVolume":

        case "averageVolume":

        case "weekVolume":

        case "monthVolume":

        case "bestVolume":

            return `${weightFormatNumber(value)} kg`;

        case "averageWeight":

        case "averageOneRM":

        case "bestOneRM":

        case "bestWeight":

            return `${weightFormatNumber(value)} kg`;

        case "averageRPE":

            return value > 0
                ? String(value)
                : "-";

        case "growth":

            return `${value > 0 ? "+" : ""}${value}%`;

        case "totalWorkout":

        case "exerciseCount":

        case "bodyPartCount":

            return `${weightFormatNumber(value)}개`;

        default:

            return String(value ?? "-");

    }

}

/* ======================================================
   Dashboard 통계 카드 출력
====================================================== */

function renderWeightDashboardCards() {

    const data =
        getWeightDashboardData();

    Object.entries(data)

        .forEach(([key, value]) => {

            const elements =

                document.querySelectorAll(

                    `[data-weight-stat="${key}"]`

                );

            const formattedValue =

                formatWeightStatisticValue(

                    key,

                    value

                );

            elements.forEach(element => {

                element.textContent =
                    formattedValue;

            });

        });

}

/* ======================================================
   운동별 성장률
====================================================== */

function getExerciseGrowth(exercise) {

    const records =

        getExerciseRecords(exercise)

        .filter(

            record =>

                weightToNumber(record.oneRM) > 0

        )

        .sort(

            (a, b) =>

                getWeightDateTime(a) -

                getWeightDateTime(b)

        );

    if(records.length < 2) {

        return 0;

    }

    const first =

        weightToNumber(

            records[0].oneRM

        );

    const last =

        weightToNumber(

            records.at(-1).oneRM

        );

    if(first <= 0) {

        return 0;

    }

    return Number(

        (

            (

                last -

                first

            ) /

            first *

            100

        ).toFixed(1)

    );

}

/* ======================================================
   운동별 성장 순위
====================================================== */

function getExerciseGrowthRanking() {

    const exercises =

        [

            ...new Set(

                getAllWeightStatisticsRecords()

                    .map(

                        record =>

                            record.exercise

                    )

                    .filter(Boolean)

            )

        ];

    return exercises

        .map(exercise => {

            const records =

                getExerciseRecords(exercise);

            return {

                exercise,

                growth:
                    getExerciseGrowth(exercise),

                recordCount:
                    records.length,

                bestOneRM:
                    records.length > 0

                        ? Math.max(

                            ...records.map(

                                record =>

                                    weightToNumber(

                                        record.oneRM

                                    )

                            )

                        )

                        : 0

            };

        })

        .sort((a, b) => {

            if(b.growth !== a.growth) {

                return (

                    b.growth -

                    a.growth

                );

            }

            return (

                b.bestOneRM -

                a.bestOneRM

            );

        });

}

/* ======================================================
   최근 평균 RPE
====================================================== */

function getAverageRecentRPE(days = 7) {

    const records =

        getRecentWeightRecords(days)

        .filter(

            record =>

                weightToNumber(record.rpe) > 0

        );

    if(records.length === 0) {

        return 0;

    }

    const total =

        records.reduce(

            (sum, record) =>

                sum +

                weightToNumber(record.rpe),

            0

        );

    return Number(

        (

            total /

            records.length

        ).toFixed(1)

    );

}

/* ======================================================
   최근 운동 일수
====================================================== */

function getRecentWorkoutDayCount(days = 7) {

    const records =

        getRecentWeightRecords(days);

    return new Set(

        records

            .map(

                record =>

                    record.date

            )

            .filter(Boolean)

    ).size;

}

/* ======================================================
   최근 하루 운동량
====================================================== */

function getLatestDayWeightRecords() {

    const records =

        [...getAllWeightStatisticsRecords()]

        .sort(

            (a, b) =>

                getWeightDateTime(b) -

                getWeightDateTime(a)

        );

    if(records.length === 0) {

        return [];

    }

    const latestDate =

        records[0].date;

    return records.filter(

        record =>

            record.date ===

            latestDate

    );

}

/* ======================================================
   최근 하루 볼륨
====================================================== */

function getLatestDayVolume() {

    return getWeightVolumeByRecords(

        getLatestDayWeightRecords()

    );

}

/* ======================================================
   최근 운동 이후 경과일
====================================================== */

function getDaysSinceLastWorkout() {

    const latest =
        getLatestWeightRecord();

    if(!latest?.date) {

        return null;

    }

    return getWeightDaysDifference(

        latest.date,

        weightGetTodayValue()

    );

}

/* ======================================================
   회복 점수
====================================================== */

function calculateRecoveryScore() {

    const recentRecords =
        getLastWeekRecords();

    if(recentRecords.length === 0) {

        return 100;

    }

    const averageRPE =
        getAverageRecentRPE(7);

    const workoutDays =
        getRecentWorkoutDayCount(7);

    const latestDayVolume =
        getLatestDayVolume();

    const monthRecords =
        getLastMonthRecords();

    const averageSessionVolume =

        monthRecords.length > 0

            ? getWeightVolumeByRecords(

                monthRecords

            ) / monthRecords.length

            : 0;

    let score = 100;

    if(averageRPE >= 9) {

        score -= 40;

    } else if(averageRPE >= 8) {

        score -= 28;

    } else if(averageRPE >= 7) {

        score -= 16;

    } else if(averageRPE >= 6) {

        score -= 8;

    }

    if(workoutDays >= 7) {

        score -= 25;

    } else if(workoutDays >= 6) {

        score -= 18;

    } else if(workoutDays >= 5) {

        score -= 10;

    }

    if(

        averageSessionVolume > 0 &&

        latestDayVolume >

        averageSessionVolume * 1.5

    ) {

        score -= 12;

    }

    const daysSinceLastWorkout =

        getDaysSinceLastWorkout();

    if(

        daysSinceLastWorkout !== null &&

        daysSinceLastWorkout >= 2

    ) {

        score += 5;

    }

    return Math.max(

        0,

        Math.min(

            100,

            Math.round(score)

        )

    );

}

/* ======================================================
   회복 상태
====================================================== */

function getRecoveryStatus(score = null) {

    const recoveryScore =

        score === null

            ? calculateRecoveryScore()

            : weightToNumber(score);

    if(recoveryScore >= 90) {

        return {

            level:
                "매우 좋음",

            message:
                "회복 상태가 매우 좋습니다. 예정된 훈련을 진행해도 좋습니다."

        };

    }

    if(recoveryScore >= 75) {

        return {

            level:
                "좋음",

            message:
                "회복 상태가 좋습니다. 평소 강도로 운동할 수 있습니다."

        };

    }

    if(recoveryScore >= 60) {

        return {

            level:
                "보통",

            message:
                "피로가 조금 남아 있습니다. 운동 강도를 조절하세요."

        };

    }

    if(recoveryScore >= 40) {

        return {

            level:
                "낮음",

            message:
                "회복이 부족합니다. 가벼운 운동이나 회복 훈련을 권장합니다."

        };

    }

    return {

        level:
            "매우 낮음",

        message:
            "피로가 높은 상태입니다. 충분한 휴식과 회복이 필요합니다."

    };

}

/* ======================================================
   피로도
====================================================== */

function getFatigueLevel() {

    const score =
        calculateRecoveryScore();

    if(score >= 90) {

        return "매우 낮음";

    }

    if(score >= 75) {

        return "낮음";

    }

    if(score >= 60) {

        return "보통";

    }

    if(score >= 40) {

        return "높음";

    }

    return "매우 높음";

}

/* ======================================================
   최근 부위 운동 날짜
====================================================== */

function getLatestBodyPartDate(bodyPart) {

    const records =

        getAllWeightStatisticsRecords()

        .filter(

            record =>

                record.bodyPart ===

                bodyPart

        )

        .sort(

            (a, b) =>

                getWeightDateTime(b) -

                getWeightDateTime(a)

        );

    return records[0]?.date || null;

}

/* ======================================================
   부위별 경과일
====================================================== */

function getBodyPartRestDays(bodyPart) {

    const latestDate =

        getLatestBodyPartDate(bodyPart);

    if(!latestDate) {

        return 999;

    }

    return getWeightDaysDifference(

        latestDate,

        weightGetTodayValue()

    );

}

/* ======================================================
   다음 운동 추천
====================================================== */

function recommendNextWorkout() {

    const records =

        getAllWeightStatisticsRecords();

    if(records.length === 0) {

        return {

            bodyPart:
                "전신",

            message:
                "첫 기록은 전신 기본 운동부터 시작해 보세요."

        };

    }

    const statistics =
        getBodyPartStatistics();

    const recommendation =

        BODY_PARTS

        .map(bodyPart => {

            return {

                bodyPart,

                count:
                    weightToNumber(

                        statistics[bodyPart]

                    ),

                restDays:
                    getBodyPartRestDays(

                        bodyPart

                    )

            };

        })

        .sort((a, b) => {

            if(b.restDays !== a.restDays) {

                return (

                    b.restDays -

                    a.restDays

                );

            }

            return (

                a.count -

                b.count

            );

        })[0];

    if(!recommendation) {

        return {

            bodyPart:
                "전신",

            message:
                "전신 운동을 추천합니다."

        };

    }

    return {

        bodyPart:
            recommendation.bodyPart,

        restDays:
            recommendation.restDays,

        message:

            recommendation.restDays >= 999

                ? `${recommendation.bodyPart} 기록이 아직 없습니다. ${recommendation.bodyPart} 운동을 추천합니다.`

                : `${recommendation.bodyPart} 운동 후 ${recommendation.restDays}일이 지났습니다. 다음 운동으로 추천합니다.`

    };

}

/* ======================================================
   훈련 균형 분석
====================================================== */

function getWeightBalanceAnalysis() {

    const statistics =
        getBodyPartStatistics();

    const entries =

        Object.entries(statistics)

        .filter(

            ([, count]) =>

                count > 0

        )

        .sort(

            (a, b) =>

                b[1] -

                a[1]

        );

    if(entries.length === 0) {

        return {

            strongest:
                null,

            weakest:
                null,

            message:
                "운동 기록이 없어 부위별 균형을 분석할 수 없습니다."

        };

    }

    const strongest =
        entries[0];

    const weakest =

        BODY_PARTS

        .map(bodyPart => [

            bodyPart,

            weightToNumber(

                statistics[bodyPart]

            )

        ])

        .sort(

            (a, b) =>

                a[1] -

                b[1]

        )[0];

    const difference =

        strongest[1] -

        weakest[1];

    let message =

        `${strongest[0]} 운동 비중이 가장 높습니다.`;

    if(difference >= 5) {

        message +=

            ` ${weakest[0]} 운동 비중을 조금 늘려 균형을 맞춰보세요.`;

    } else {

        message +=

            " 부위별 운동 횟수가 비교적 균형적입니다.";

    }

    return {

        strongest: {

            bodyPart:
                strongest[0],

            count:
                strongest[1]

        },

        weakest: {

            bodyPart:
                weakest[0],

            count:
                weakest[1]

        },

        message

    };

}

/* ======================================================
   AI 분석 데이터
====================================================== */

function createWeightAnalysisData() {

    const dashboard =
        getWeightDashboardData();

    const latest =
        getLatestWeightRecord();

    const personalRecord =
        getWeightPersonalRecord();

    const favorite =
        getMostPerformedExercise();

    const favoriteBodyPart =
        getMostPerformedBodyPart();

    const recoveryScore =
        calculateRecoveryScore();

    const recoveryStatus =
        getRecoveryStatus(

            recoveryScore

        );

    const recommendation =
        recommendNextWorkout();

    const balance =
        getWeightBalanceAnalysis();

    const growthRanking =
        getExerciseGrowthRanking();

    return {

        ...dashboard,

        latest,

        personalRecord,

        favorite,

        favoriteBodyPart,

        recoveryScore,

        recoveryStatus,

        fatigue:
            getFatigueLevel(),

        recommendation,

        balance,

        growthRanking,

        recentRPE:
            getAverageRecentRPE(7),

        recentWorkoutDays:
            getRecentWorkoutDayCount(7),

        daysSinceLastWorkout:
            getDaysSinceLastWorkout()

    };

}

/* ======================================================
   AI 분석 문장 생성
====================================================== */

function generateWeightAnalysis() {

    const data =
        createWeightAnalysisData();

    if(data.totalWorkout === 0) {

        return "웨이트 기록을 저장하면 운동 성장률과 회복 상태를 분석합니다.";

    }

    const messages = [];

    if(data.growth >= 10) {

        messages.push(

            `전체 예상 1RM이 처음보다 ${data.growth}% 향상되었습니다.`

        );

    } else if(data.growth >= 3) {

        messages.push(

            `예상 1RM이 ${data.growth}% 증가하며 꾸준히 성장하고 있습니다.`

        );

    } else if(data.growth > 0) {

        messages.push(

            `예상 1RM이 ${data.growth}% 증가했습니다.`

        );

    } else if(data.growth < 0) {

        messages.push(

            `최근 예상 1RM이 ${Math.abs(data.growth)}% 낮아졌습니다. 피로와 컨디션을 확인하세요.`

        );

    } else {

        messages.push(

            "현재 기록만으로는 뚜렷한 성장률 변화가 나타나지 않았습니다."

        );

    }

    messages.push(

        `회복 점수는 ${data.recoveryScore}점으로 ${data.recoveryStatus.level} 상태입니다.`

    );

    if(data.recentRPE >= 8.5) {

        messages.push(

            "최근 RPE가 높아 다음 훈련의 중량이나 세트 수를 줄이는 것이 좋습니다."

        );

    } else if(

        data.recentRPE > 0 &&

        data.recentRPE <= 6

    ) {

        messages.push(

            "최근 운동 강도에 여유가 있어 컨디션이 좋다면 소폭 증량할 수 있습니다."

        );

    }

    if(data.favorite) {

        messages.push(

            `가장 많이 수행한 운동은 ${data.favorite.exercise}이며 총 ${data.favorite.count}회 기록했습니다.`

        );

    }

    messages.push(

        data.recommendation.message

    );

    return messages.join(" ");

}

/* ======================================================
   기본 AI 분석 출력
====================================================== */

function renderWeightAnalysis() {

    const element =

        document.querySelector(

            "#weightAnalysis"

        );

    if(!element) {

        return;

    }

    element.textContent =
        generateWeightAnalysis();

}

/* ======================================================
   상세 AI 리포트 출력
====================================================== */

function renderWeightAIReport() {

    const container =

        document.querySelector(

            "#weightAIReport"

        );

    if(!container) {

        return;

    }

    const data =
        createWeightAnalysisData();

    if(data.totalWorkout === 0) {

        container.innerHTML = `

<div class="ai-card">

    <h3>AI 웨이트 분석</h3>

    <p>
        기록을 저장하면 회복도, 성장률, 운동 균형과 다음 운동을 분석합니다.
    </p>

</div>

`;

        return;

    }

    const topGrowth =

        data.growthRanking

        .find(

            item =>

                item.recordCount >= 2

        );

    const growthHTML =

        topGrowth

            ? `

<p>

    <strong>가장 성장한 운동</strong>

    ${weightEscapeHTML(topGrowth.exercise)}
    (${topGrowth.growth > 0 ? "+" : ""}${topGrowth.growth}%)

</p>

`

            : "";

    container.innerHTML = `

<div class="ai-card">

    <h3>AI 웨이트 분석</h3>

    <div class="weight-ai-grid">

        <div>

            <span>회복 점수</span>

            <strong>
                ${data.recoveryScore}점
            </strong>

        </div>

        <div>

            <span>회복 상태</span>

            <strong>
                ${weightEscapeHTML(data.recoveryStatus.level)}
            </strong>

        </div>

        <div>

            <span>피로도</span>

            <strong>
                ${weightEscapeHTML(data.fatigue)}
            </strong>

        </div>

        <div>

            <span>최근 7일 운동</span>

            <strong>
                ${data.recentWorkoutDays}일
            </strong>

        </div>

    </div>

    <p>

        ${weightEscapeHTML(data.recoveryStatus.message)}

    </p>

    <p>

        <strong>추천 운동</strong>

        ${weightEscapeHTML(data.recommendation.message)}

    </p>

    <p>

        <strong>훈련 균형</strong>

        ${weightEscapeHTML(data.balance.message)}

    </p>

    ${growthHTML}

</div>

`;

}
/* ======================================================
   weight.js Part 4-1
   Chart.js / Chart Data / Safe Render
====================================================== */

/* ======================================================
   차트 상태
====================================================== */

const weightCharts = {

    oneRM:
        null,

    volume:
        null,

    bodyPart:
        null,

    monthly:
        null,

    growth:
        null

};

/* ======================================================
   Chart.js 사용 가능 여부
====================================================== */

function isWeightChartAvailable() {

    return (

        typeof window.Chart ===

        "function"

    );

}

/* ======================================================
   차트 안전 제거
====================================================== */

function destroyWeightChart(chartName) {

    const chart =

        weightCharts[chartName];

    if(

        chart &&

        typeof chart.destroy ===

        "function"

    ) {

        chart.destroy();

    }

    weightCharts[chartName] =
        null;

}

/* ======================================================
   모든 차트 제거
====================================================== */

function destroyAllWeightCharts() {

    Object.keys(weightCharts)

        .forEach(

            destroyWeightChart

        );

}

/* ======================================================
   차트용 날짜순 기록
====================================================== */

function getWeightChartRecords() {

    return [

        ...getAllWeightStatisticsRecords()

    ]

    .filter(

        record =>

            record.date

    )

    .sort(

        (a, b) =>

            getWeightDateTime(a) -

            getWeightDateTime(b)

    );

}

/* ======================================================
   날짜별 기록 그룹
====================================================== */

function groupWeightRecordsByDate(records) {

    const groups = {};

    records.forEach(record => {

        const date =

            record.date ||

            "날짜 없음";

        if(!groups[date]) {

            groups[date] = [];

        }

        groups[date].push(record);

    });

    return groups;

}

/* ======================================================
   날짜별 최고 1RM
====================================================== */

function getOneRMChartData() {

    const records =

        getWeightChartRecords();

    const groups =

        groupWeightRecordsByDate(

            records

        );

    const labels =

        Object.keys(groups)

        .sort(

            (a, b) =>

                new Date(a) -

                new Date(b)

        );

    const values =

        labels.map(date => {

            const dayRecords =

                groups[date];

            if(dayRecords.length === 0) {

                return 0;

            }

            return Math.max(

                ...dayRecords.map(

                    record =>

                        weightToNumber(

                            record.oneRM

                        )

                )

            );

        });

    return {

        labels:
            labels.map(

                weightFormatDate

            ),

        rawLabels:
            labels,

        values

    };

}

/* ======================================================
   날짜별 볼륨
====================================================== */

function getVolumeChartData() {

    const records =

        getWeightChartRecords();

    const groups =

        groupWeightRecordsByDate(

            records

        );

    const labels =

        Object.keys(groups)

        .sort(

            (a, b) =>

                new Date(a) -

                new Date(b)

        );

    const values =

        labels.map(date => {

            return groups[date]

                .reduce(

                    (sum, record) =>

                        sum +

                        weightToNumber(

                            record.volume

                        ),

                    0

                );

        });

    return {

        labels:
            labels.map(

                weightFormatDate

            ),

        rawLabels:
            labels,

        values

    };

}

/* ======================================================
   부위별 차트 데이터
====================================================== */

function getBodyPartChartData() {

    const statistics =

        getBodyPartStatistics();

    const entries =

        Object.entries(statistics)

        .filter(

            ([, value]) =>

                value > 0

        );

    return {

        labels:
            entries.map(

                ([label]) =>

                    label

            ),

        values:
            entries.map(

                ([, value]) =>

                    value

            )

    };

}

/* ======================================================
   월별 키 생성
====================================================== */

function getWeightMonthKey(dateValue) {

    const date =

        new Date(dateValue);

    if(Number.isNaN(date.getTime())) {

        return null;

    }

    const year =

        date.getFullYear();

    const month =

        String(

            date.getMonth() + 1

        ).padStart(2, "0");

    return `${year}-${month}`;

}

/* ======================================================
   최근 12개월 목록
====================================================== */

function getRecentWeightMonths(count = 12) {

    const months = [];

    const today =

        new Date();

    today.setDate(1);

    for(

        let index = count - 1;

        index >= 0;

        index -= 1

    ) {

        const date =

            new Date(

                today.getFullYear(),

                today.getMonth() -

                index,

                1

            );

        const key =

            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        const label =

            `${date.getFullYear()}.${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

        months.push({

            key,

            label

        });

    }

    return months;

}

/* ======================================================
   월별 운동 데이터
====================================================== */

function getMonthlyWeightData() {

    const months =

        getRecentWeightMonths(12);

    const counter = {};

    const volumeCounter = {};

    months.forEach(month => {

        counter[month.key] =
            0;

        volumeCounter[month.key] =
            0;

    });

    getAllWeightStatisticsRecords()

        .forEach(record => {

            const key =

                getWeightMonthKey(

                    record.date

                );

            if(

                !key ||

                typeof counter[key] ===

                "undefined"

            ) {

                return;

            }

            counter[key] +=
                1;

            volumeCounter[key] +=

                weightToNumber(

                    record.volume

                );

        });

    return {

        labels:
            months.map(

                month =>

                    month.label

            ),

        counts:
            months.map(

                month =>

                    counter[month.key]

            ),

        volumes:
            months.map(

                month =>

                    volumeCounter[month.key]

            )

    };

}

/* ======================================================
   운동별 성장 차트 데이터
====================================================== */

function getGrowthChartData() {

    const ranking =

        getExerciseGrowthRanking()

        .filter(

            item =>

                item.recordCount >= 2

        )

        .slice(0, 8);

    return {

        labels:
            ranking.map(

                item =>

                    item.exercise

            ),

        values:
            ranking.map(

                item =>

                    item.growth

            )

    };

}

/* ======================================================
   기본 차트 옵션
====================================================== */

function getWeightBaseChartOptions() {

    return {

        responsive:
            true,

        maintainAspectRatio:
            false,

        interaction: {

            mode:
                "index",

            intersect:
                false

        },

        plugins: {

            legend: {

                display:
                    true,

                position:
                    "bottom"

            },

            tooltip: {

                enabled:
                    true

            }

        }

    };

}

/* ======================================================
   빈 차트 메시지
====================================================== */

function renderWeightChartEmpty(

    canvas,

    message =
        "차트에 표시할 기록이 없습니다."

) {

    if(!canvas) {

        return;

    }

    const wrapper =

        canvas.parentElement;

    if(!wrapper) {

        return;

    }

    const existing =

        wrapper.querySelector(

            ".weight-chart-empty"

        );

    if(existing) {

        existing.textContent =
            message;

        existing.hidden =
            false;

        canvas.hidden =
            true;

        return;

    }

    const empty =

        document.createElement("div");

    empty.className =

        "weight-chart-empty";

    empty.textContent =
        message;

    wrapper.appendChild(empty);

    canvas.hidden =
        true;

}

/* ======================================================
   빈 메시지 제거
====================================================== */

function clearWeightChartEmpty(canvas) {

    if(!canvas) {

        return;

    }

    canvas.hidden =
        false;

    const wrapper =

        canvas.parentElement;

    const empty =

        wrapper?.querySelector(

            ".weight-chart-empty"

        );

    if(empty) {

        empty.hidden =
            true;

    }

}

/* ======================================================
   1RM 차트
====================================================== */

function renderOneRMChart() {

    const canvas =

        document.querySelector(

            "#weightOneRMChart"

        );

    destroyWeightChart("oneRM");

    if(!canvas) {

        return;

    }

    if(!isWeightChartAvailable()) {

        renderWeightChartEmpty(

            canvas,

            "Chart.js가 연결되지 않았습니다."

        );

        return;

    }

    const chartData =

        getOneRMChartData();

    if(chartData.values.length === 0) {

        renderWeightChartEmpty(

            canvas

        );

        return;

    }

    clearWeightChartEmpty(canvas);

    weightCharts.oneRM =

        new Chart(

            canvas,

            {

                type:
                    "line",

                data: {

                    labels:
                        chartData.labels,

                    datasets: [

                        {

                            label:
                                "최고 예상 1RM",

                            data:
                                chartData.values,

                            tension:
                                0.3,

                            fill:
                                false,

                            pointRadius:
                                4,

                            pointHoverRadius:
                                6,

                            borderWidth:
                                2

                        }

                    ]

                },

                options: {

                    ...getWeightBaseChartOptions(),

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            title: {

                                display:
                                    true,

                                text:
                                    "kg"

                            }

                        }

                    }

                }

            }

        );

}

/* ======================================================
   볼륨 차트
====================================================== */

function renderVolumeChart() {

    const canvas =

        document.querySelector(

            "#weightVolumeChart"

        );

    destroyWeightChart("volume");

    if(!canvas) {

        return;

    }

    if(!isWeightChartAvailable()) {

        renderWeightChartEmpty(

            canvas,

            "Chart.js가 연결되지 않았습니다."

        );

        return;

    }

    const chartData =

        getVolumeChartData();

    if(chartData.values.length === 0) {

        renderWeightChartEmpty(

            canvas

        );

        return;

    }

    clearWeightChartEmpty(canvas);

    weightCharts.volume =

        new Chart(

            canvas,

            {

                type:
                    "bar",

                data: {

                    labels:
                        chartData.labels,

                    datasets: [

                        {

                            label:
                                "일일 총 볼륨",

                            data:
                                chartData.values,

                            borderWidth:
                                1,

                            borderRadius:
                                6

                        }

                    ]

                },

                options: {

                    ...getWeightBaseChartOptions(),

                    plugins: {

                        ...getWeightBaseChartOptions()
                            .plugins,

                        legend: {

                            display:
                                false

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            title: {

                                display:
                                    true,

                                text:
                                    "kg"

                            }

                        }

                    }

                }

            }

        );

}

/* ======================================================
   부위 비율 차트
====================================================== */

function renderBodyPartChart() {

    const canvas =

        document.querySelector(

            "#weightBodyPartChart"

        );

    destroyWeightChart("bodyPart");

    if(!canvas) {

        return;

    }

    if(!isWeightChartAvailable()) {

        renderWeightChartEmpty(

            canvas,

            "Chart.js가 연결되지 않았습니다."

        );

        return;

    }

    const chartData =

        getBodyPartChartData();

    if(chartData.values.length === 0) {

        renderWeightChartEmpty(

            canvas

        );

        return;

    }

    clearWeightChartEmpty(canvas);

    weightCharts.bodyPart =

        new Chart(

            canvas,

            {

                type:
                    "doughnut",

                data: {

                    labels:
                        chartData.labels,

                    datasets: [

                        {

                            label:
                                "운동 횟수",

                            data:
                                chartData.values,

                            borderWidth:
                                1

                        }

                    ]

                },

                options: {

                    ...getWeightBaseChartOptions(),

                    cutout:
                        "60%",

                    plugins: {

                        ...getWeightBaseChartOptions()
                            .plugins,

                        legend: {

                            display:
                                true,

                            position:
                                "bottom"

                        }

                    }

                }

            }

        );

}

/* ======================================================
   월별 차트
====================================================== */

function renderMonthlyWeightChart() {

    const canvas =

        document.querySelector(

            "#weightMonthlyChart"

        );

    destroyWeightChart("monthly");

    if(!canvas) {

        return;

    }

    if(!isWeightChartAvailable()) {

        renderWeightChartEmpty(

            canvas,

            "Chart.js가 연결되지 않았습니다."

        );

        return;

    }

    const chartData =

        getMonthlyWeightData();

    const hasData =

        chartData.counts.some(

            value =>

                value > 0

        );

    if(!hasData) {

        renderWeightChartEmpty(

            canvas

        );

        return;

    }

    clearWeightChartEmpty(canvas);

    weightCharts.monthly =

        new Chart(

            canvas,

            {

                type:
                    "bar",

                data: {

                    labels:
                        chartData.labels,

                    datasets: [

                        {

                            label:
                                "운동 기록 수",

                            data:
                                chartData.counts,

                            borderWidth:
                                1,

                            borderRadius:
                                6,

                            yAxisID:
                                "countAxis"

                        },

                        {

                            label:
                                "월간 볼륨",

                            data:
                                chartData.volumes,

                            type:
                                "line",

                            tension:
                                0.3,

                            borderWidth:
                                2,

                            yAxisID:
                                "volumeAxis"

                        }

                    ]

                },

                options: {

                    ...getWeightBaseChartOptions(),

                    scales: {

                        countAxis: {

                            beginAtZero:
                                true,

                            position:
                                "left",

                            ticks: {

                                precision:
                                    0

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "기록 수"

                            }

                        },

                        volumeAxis: {

                            beginAtZero:
                                true,

                            position:
                                "right",

                            grid: {

                                drawOnChartArea:
                                    false

                            },

                            title: {

                                display:
                                    true,

                                text:
                                    "볼륨(kg)"

                            }

                        }

                    }

                }

            }

        );

}

/* ======================================================
   성장률 차트
====================================================== */

function renderWeightGrowthChart() {

    const canvas =

        document.querySelector(

            "#weightGrowthChart"

        );

    destroyWeightChart("growth");

    if(!canvas) {

        return;

    }

    if(!isWeightChartAvailable()) {

        renderWeightChartEmpty(

            canvas,

            "Chart.js가 연결되지 않았습니다."

        );

        return;

    }

    const chartData =

        getGrowthChartData();

    if(chartData.values.length === 0) {

        renderWeightChartEmpty(

            canvas,

            "운동별 성장률을 계산하려면 같은 운동 기록이 2개 이상 필요합니다."

        );

        return;

    }

    clearWeightChartEmpty(canvas);

    weightCharts.growth =

        new Chart(

            canvas,

            {

                type:
                    "bar",

                data: {

                    labels:
                        chartData.labels,

                    datasets: [

                        {

                            label:
                                "예상 1RM 성장률",

                            data:
                                chartData.values,

                            borderWidth:
                                1,

                            borderRadius:
                                6

                        }

                    ]

                },

                options: {

                    ...getWeightBaseChartOptions(),

                    indexAxis:
                        "y",

                    scales: {

                        x: {

                            title: {

                                display:
                                    true,

                                text:
                                    "성장률(%)"

                            }

                        }

                    }

                }

            }

        );

}

/* ======================================================
   모든 차트 출력
====================================================== */

function renderWeightCharts() {

    renderOneRMChart();

    renderVolumeChart();

    renderBodyPartChart();

    renderMonthlyWeightChart();

    renderWeightGrowthChart();

}

/* ======================================================
   차트 새로고침
====================================================== */

function refreshWeightCharts() {

    if(

        !getWeightSelectedAthlete()

    ) {

        destroyAllWeightCharts();

        return;

    }

    renderWeightCharts();

}
/* ======================================================
   weight.js Part 4-2
   Exercise Ranking / PR Ranking / Summary UI
====================================================== */

/* ======================================================
   운동별 랭킹 데이터
====================================================== */

function getExerciseRanking() {

    const ranking = {};

    getAllWeightStatisticsRecords()

        .forEach(record => {

            const exercise =
                record.exercise;

            if(!exercise) {

                return;

            }

            if(!ranking[exercise]) {

                ranking[exercise] = {

                    count:
                        0,

                    bestOneRM:
                        0,

                    bestWeight:
                        0,

                    totalWeight:
                        0,

                    totalVolume:
                        0,

                    totalRPE:
                        0,

                    rpeCount:
                        0

                };

            }

            const item =
                ranking[exercise];

            item.count +=
                1;

            item.bestOneRM =

                Math.max(

                    item.bestOneRM,

                    weightToNumber(

                        record.oneRM

                    )

                );

            item.bestWeight =

                Math.max(

                    item.bestWeight,

                    weightToNumber(

                        record.weight

                    )

                );

            item.totalWeight +=

                weightToNumber(

                    record.weight

                );

            item.totalVolume +=

                weightToNumber(

                    record.volume

                );

            if(

                weightToNumber(

                    record.rpe

                ) > 0

            ) {

                item.totalRPE +=

                    weightToNumber(

                        record.rpe

                    );

                item.rpeCount +=
                    1;

            }

        });

    return Object.entries(ranking)

        .map(([exercise, data]) => {

            return {

                exercise,

                count:
                    data.count,

                bestOneRM:
                    Number(

                        data.bestOneRM

                        .toFixed(1)

                    ),

                bestWeight:
                    Number(

                        data.bestWeight

                        .toFixed(1)

                    ),

                averageWeight:

                    data.count > 0

                        ? Number(

                            (

                                data.totalWeight /

                                data.count

                            ).toFixed(1)

                        )

                        : 0,

                totalVolume:
                    Number(

                        data.totalVolume

                        .toFixed(1)

                    ),

                averageRPE:

                    data.rpeCount > 0

                        ? Number(

                            (

                                data.totalRPE /

                                data.rpeCount

                            ).toFixed(1)

                        )

                        : 0,

                growth:
                    getExerciseGrowth(

                        exercise

                    )

            };

        })

        .sort((a, b) => {

            if(

                b.bestOneRM !==

                a.bestOneRM

            ) {

                return (

                    b.bestOneRM -

                    a.bestOneRM

                );

            }

            return (

                b.totalVolume -

                a.totalVolume

            );

        });

}

/* ======================================================
   운동 랭킹 카드
====================================================== */

function createExerciseRankingHTML(

    item,

    index

) {

    return `

<div class="ranking-card">

    <div class="ranking-position">

        ${index + 1}

    </div>

    <div class="ranking-main">

        <strong>

            ${weightEscapeHTML(item.exercise)}

        </strong>

        <span>

            ${item.count}회 수행

        </span>

    </div>

    <div class="ranking-stat">

        <span>PR</span>

        <strong>

            ${weightFormatNumber(item.bestOneRM)} kg

        </strong>

    </div>

    <div class="ranking-stat">

        <span>평균 중량</span>

        <strong>

            ${weightFormatNumber(item.averageWeight)} kg

        </strong>

    </div>

    <div class="ranking-stat">

        <span>총 볼륨</span>

        <strong>

            ${weightFormatNumber(item.totalVolume)} kg

        </strong>

    </div>

    <div class="ranking-stat">

        <span>성장률</span>

        <strong>

            ${item.growth > 0 ? "+" : ""}${item.growth}%

        </strong>

    </div>

</div>

`;

}

/* ======================================================
   운동 랭킹 출력
====================================================== */

function renderExerciseRanking() {

    const container =

        document.querySelector(

            "#exerciseRanking"

        );

    if(!container) {

        return;

    }

    const ranking =
        getExerciseRanking();

    if(ranking.length === 0) {

        container.innerHTML = `

<div class="empty-box">

    운동 기록이 없습니다.

</div>

`;

        return;

    }

    container.innerHTML =

        ranking

            .map(

                createExerciseRankingHTML

            )

            .join("");

}

/* ======================================================
   PR 기록 목록
====================================================== */

function getWeightPRRanking() {

    const exercises =

        [

            ...new Set(

                getAllWeightStatisticsRecords()

                    .map(

                        record =>

                            record.exercise

                    )

                    .filter(Boolean)

            )

        ];

    return exercises

        .map(exercise => {

            const record =
                getExercisePR(exercise);

            if(!record) {

                return null;

            }

            return {

                exercise,

                date:
                    record.date,

                bodyPart:
                    record.bodyPart,

                weight:
                    record.weight,

                reps:
                    record.reps,

                sets:
                    record.sets,

                oneRM:
                    record.oneRM,

                volume:
                    record.volume

            };

        })

        .filter(Boolean)

        .sort(

            (a, b) =>

                b.oneRM -

                a.oneRM

        );

}

/* ======================================================
   PR 카드 HTML
====================================================== */

function createWeightPRCardHTML(

    item,

    index

) {

    return `

<article class="weight-pr-card">

    <div class="weight-pr-rank">

        ${index + 1}

    </div>

    <div class="weight-pr-main">

        <span>

            ${weightEscapeHTML(item.bodyPart)}

        </span>

        <h4>

            ${weightEscapeHTML(item.exercise)}

        </h4>

        <time>

            ${weightFormatDate(item.date)}

        </time>

    </div>

    <div class="weight-pr-result">

        <strong>

            ${weightFormatNumber(item.oneRM)} kg

        </strong>

        <span>

            ${weightFormatNumber(item.weight)}kg
            ×
            ${item.reps}회
            ×
            ${item.sets}세트

        </span>

    </div>

</article>

`;

}

/* ======================================================
   PR 목록 출력
====================================================== */

function renderWeightPRRanking() {

    const container =

        document.querySelector(

            "#weightPRRanking"

        );

    if(!container) {

        return;

    }

    const ranking =
        getWeightPRRanking();

    if(ranking.length === 0) {

        container.innerHTML = `

<div class="empty-box">

    개인 최고 기록이 없습니다.

</div>

`;

        return;

    }

    container.innerHTML =

        ranking

            .map(

                createWeightPRCardHTML

            )

            .join("");

}

/* ======================================================
   최근 기록 카드
====================================================== */

function renderLatestWeightRecord() {

    const container =

        document.querySelector(

            "#latestWeightRecord"

        );

    if(!container) {

        return;

    }

    const latest =
        getLatestWeightRecord();

    if(!latest) {

        container.innerHTML = `

<div class="empty-box">

    최근 기록이 없습니다.

</div>

`;

        return;

    }

    const record =
        normalizeWeightRecord(

            latest

        );

    container.innerHTML = `

<div class="latest-weight-card">

    <div>

        <span>

            ${weightEscapeHTML(record.bodyPart)}

        </span>

        <h3>

            ${weightEscapeHTML(record.exercise)}

        </h3>

        <time>

            ${weightFormatDate(record.date)}

        </time>

    </div>

    <div>

        <strong>

            ${weightFormatNumber(record.weight)} kg

        </strong>

        <span>

            ${record.reps}회 × ${record.sets}세트

        </span>

    </div>

    <div>

        <strong>

            예상 1RM
            ${weightFormatNumber(record.oneRM)} kg

        </strong>

        <span>

            볼륨
            ${weightFormatNumber(record.volume)} kg

        </span>

    </div>

</div>

`;

}

/* ======================================================
   최고 기록 요약
====================================================== */

function renderBestWeightRecord() {

    const container =

        document.querySelector(

            "#bestWeightRecord"

        );

    if(!container) {

        return;

    }

    const best =
        getWeightPersonalRecord();

    if(!best) {

        container.innerHTML = `

<div class="empty-box">

    최고 기록이 없습니다.

</div>

`;

        return;

    }

    container.innerHTML = `

<div class="best-weight-record-card">

    <span>

        최고 예상 1RM

    </span>

    <strong>

        ${weightFormatNumber(best.oneRM)} kg

    </strong>

    <p>

        ${weightEscapeHTML(best.exercise)}
        ·
        ${weightFormatDate(best.date)}

    </p>

</div>

`;

}

/* ======================================================
   운동 부위 요약
====================================================== */

function renderBodyPartSummary() {

    const container =

        document.querySelector(

            "#weightBodyPartSummary"

        );

    if(!container) {

        return;

    }

    const statistics =
        getBodyPartStatistics();

    const total =

        Object.values(statistics)

        .reduce(

            (sum, value) =>

                sum + value,

            0

        );

    if(total === 0) {

        container.innerHTML = `

<div class="empty-box">

    부위별 운동 기록이 없습니다.

</div>

`;

        return;

    }

    container.innerHTML =

        BODY_PARTS

            .map(bodyPart => {

                const count =

                    weightToNumber(

                        statistics[bodyPart]

                    );

                const percentage =

                    total > 0

                        ? Number(

                            (

                                count /

                                total *

                                100

                            ).toFixed(1)

                        )

                        : 0;

                return `

<div class="weight-body-part-summary-item">

    <div>

        <strong>

            ${weightEscapeHTML(bodyPart)}

        </strong>

        <span>

            ${count}회

        </span>

    </div>

    <div class="weight-body-part-progress">

        <span
            style="width:${percentage}%"
        ></span>

    </div>

    <small>

        ${percentage}%

    </small>

</div>

`;

            })

            .join("");

}

/* ======================================================
   주간 요약
====================================================== */

function getWeightWeeklySummary() {

    const records =
        getLastWeekRecords();

    const volume =
        getWeightVolumeByRecords(

            records

        );

    const workoutDays =
        getRecentWorkoutDayCount(7);

    const averageRPE =
        getAverageRecentRPE(7);

    const exercises =

        new Set(

            records

                .map(

                    record =>

                        record.exercise

                )

                .filter(Boolean)

        ).size;

    return {

        count:
            records.length,

        volume,

        workoutDays,

        averageRPE,

        exercises

    };

}

/* ======================================================
   주간 요약 출력
====================================================== */

function renderWeightWeeklySummary() {

    const container =

        document.querySelector(

            "#weightWeeklySummary"

        );

    if(!container) {

        return;

    }

    const summary =
        getWeightWeeklySummary();

    container.innerHTML = `

<div class="weight-summary-card">

    <span>최근 7일 기록</span>

    <strong>

        ${summary.count}개

    </strong>

</div>

<div class="weight-summary-card">

    <span>운동 일수</span>

    <strong>

        ${summary.workoutDays}일

    </strong>

</div>

<div class="weight-summary-card">

    <span>운동 종류</span>

    <strong>

        ${summary.exercises}개

    </strong>

</div>

<div class="weight-summary-card">

    <span>총 볼륨</span>

    <strong>

        ${weightFormatNumber(summary.volume)} kg

    </strong>

</div>

<div class="weight-summary-card">

    <span>평균 RPE</span>

    <strong>

        ${summary.averageRPE || "-"}

    </strong>

</div>

`;

}

/* ======================================================
   모든 요약 UI 출력
====================================================== */

function renderWeightSummaryUI() {

    renderExerciseRanking();

    renderWeightPRRanking();

    renderLatestWeightRecord();

    renderBestWeightRecord();

    renderBodyPartSummary();

    renderWeightWeeklySummary();

}
/* ======================================================
   weight.js Part 5-1
   CSV Import / Export / Print
====================================================== */

/* ======================================================
   CSV 헤더
====================================================== */

const WEIGHT_CSV_HEADER = [

    "날짜",

    "선수ID",

    "선수명",

    "부위",

    "운동",

    "중량",

    "횟수",

    "세트",

    "RPE",

    "예상1RM",

    "볼륨",

    "강도",

    "메모"

];

/* ======================================================
   CSV 값 변환
====================================================== */

function escapeWeightCSVValue(value) {

    const text =
        String(value ?? "");

    if(

        text.includes(",") ||

        text.includes('"') ||

        text.includes("\n") ||

        text.includes("\r")

    ) {

        return `"${text.replaceAll('"', '""')}"`;

    }

    return text;

}

/* ======================================================
   CSV 한 줄 파싱
====================================================== */

function parseWeightCSVLine(line) {

    const values = [];

    let current = "";

    let insideQuotes = false;

    for(

        let index = 0;

        index < line.length;

        index += 1

    ) {

        const character =
            line[index];

        const nextCharacter =
            line[index + 1];

        if(character === '"') {

            if(

                insideQuotes &&

                nextCharacter === '"'

            ) {

                current += '"';

                index += 1;

            } else {

                insideQuotes =
                    !insideQuotes;

            }

            continue;

        }

        if(

            character === "," &&

            !insideQuotes

        ) {

            values.push(current);

            current = "";

            continue;

        }

        current +=
            character;

    }

    values.push(current);

    return values;

}

/* ======================================================
   CSV 생성
====================================================== */

function createWeightCSV() {

    const records =
        getAllWeightStatisticsRecords();

    const rows = [

        WEIGHT_CSV_HEADER

            .map(

                escapeWeightCSVValue

            )

            .join(",")

    ];

    records.forEach(record => {

        const safeRecord =
            normalizeWeightRecord(record);

        rows.push(

            [

                safeRecord.date,

                safeRecord.athleteId,

                safeRecord.athleteName,

                safeRecord.bodyPart,

                safeRecord.exercise,

                safeRecord.weight,

                safeRecord.reps,

                safeRecord.sets,

                safeRecord.rpe,

                safeRecord.oneRM,

                safeRecord.volume,

                safeRecord.intensity,

                safeRecord.memo

            ]

            .map(

                escapeWeightCSVValue

            )

            .join(",")

        );

    });

    return `\uFEFF${rows.join("\n")}`;

}

/* ======================================================
   파일 다운로드
====================================================== */

function downloadWeightFile(

    content,

    fileName,

    type

) {

    const blob =

        new Blob(

            [content],

            {

                type

            }

        );

    const url =

        URL.createObjectURL(blob);

    const link =

        document.createElement("a");

    link.href =
        url;

    link.download =
        fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(

        () => {

            URL.revokeObjectURL(url);

        },

        100

    );

}

/* ======================================================
   CSV 내보내기
====================================================== */

function exportWeightCSV() {

    const athlete =
        requireWeightAthlete();

    if(!athlete) {

        return;

    }

    const records =
        getAllWeightStatisticsRecords();

    if(records.length === 0) {

        weightShowToast(

            "내보낼 웨이트 기록이 없습니다.",

            "info"

        );

        return;

    }

    const csv =
        createWeightCSV();

    const athleteName =

        athlete.name ||

        athlete.athleteName ||

        "athlete";

    const safeName =

        String(athleteName)

        .replace(

            /[\\/:*?"<>|]/g,

            "_"

        );

    const fileName =

        `weight_${safeName}_${weightGetTodayValue()}.csv`;

    downloadWeightFile(

        csv,

        fileName,

        "text/csv;charset=utf-8"

    );

    weightShowToast(

        "CSV 파일을 내보냈습니다.",

        "success"

    );

}

/* ======================================================
   CSV 파일 선택
====================================================== */

function requestWeightCSVImport() {

    const input =

        document.querySelector(

            "#weightCSVInput"

        );

    if(input) {

        input.value =
            "";

        input.click();

        return;

    }

    weightShowToast(

        "CSV 파일 입력 요소를 찾을 수 없습니다.",

        "error"

    );

}

/* ======================================================
   CSV 가져오기
====================================================== */

function importWeightCSV(file) {

    if(!file) {

        return;

    }

    const lowerName =

        String(file.name || "")

        .toLowerCase();

    if(!lowerName.endsWith(".csv")) {

        weightShowToast(

            "CSV 파일만 가져올 수 있습니다.",

            "error"

        );

        return;

    }

    const reader =

        new FileReader();

    reader.onload = event => {

        try {

            parseWeightCSV(

                String(

                    event.target?.result ||

                    ""

                )

            );

        } catch(error) {

            console.error(error);

            weightShowToast(

                "CSV 파일을 처리하지 못했습니다.",

                "error"

            );

        }

    };

    reader.onerror = () => {

        weightShowToast(

            "CSV 파일을 읽지 못했습니다.",

            "error"

        );

    };

    reader.readAsText(

        file,

        "utf-8"

    );

}

/* ======================================================
   CSV 파싱
====================================================== */

function parseWeightCSV(text) {

    const athlete =
        requireWeightAthlete();

    if(!athlete) {

        return;

    }

    const lines =

        String(text || "")

        .replace(/^\uFEFF/, "")

        .split(/\r?\n/)

        .filter(

            line =>

                line.trim()

        );

    if(lines.length <= 1) {

        weightShowToast(

            "가져올 기록이 없습니다.",

            "info"

        );

        return;

    }

    const header =

        parseWeightCSVLine(

            lines.shift()

        );

    const headerMap = {};

    header.forEach(

        (name, index) => {

            headerMap[

                String(name).trim()

            ] = index;

        }

    );

    const getValue = (

        values,

        names

    ) => {

        for(const name of names) {

            const index =
                headerMap[name];

            if(

                typeof index ===

                "number"

            ) {

                return values[index] ?? "";

            }

        }

        return "";

    };

    const importedRecords = [];

    lines.forEach(line => {

        const values =
            parseWeightCSVLine(line);

        const bodyPart =
            getValue(

                values,

                ["부위", "운동부위"]

            ).trim();

        const exercise =
            getValue(

                values,

                ["운동", "운동명"]

            ).trim();

        const weight =
            weightToNumber(

                getValue(

                    values,

                    ["중량", "무게"]

                )

            );

        const reps =
            weightToNumber(

                getValue(

                    values,

                    ["횟수", "반복"]

                )

            );

        const sets =
            weightToNumber(

                getValue(

                    values,

                    ["세트", "세트수"]

                )

            );

        if(

            !exercise ||

            weight <= 0 ||

            reps <= 0 ||

            sets <= 0

        ) {

            return;

        }

        const date =

            getValue(

                values,

                ["날짜", "운동날짜"]

            ) ||

            weightGetTodayValue();

        const oneRM =

            weightToNumber(

                getValue(

                    values,

                    ["예상1RM", "1RM"]

                )

            ) ||

            calculateOneRM(

                weight,

                reps

            );

        const volume =

            weightToNumber(

                getValue(

                    values,

                    ["볼륨", "Volume"]

                )

            ) ||

            calculateVolume(

                weight,

                reps,

                sets

            );

        const intensity =

            weightToNumber(

                getValue(

                    values,

                    ["강도", "Intensity"]

                )

            ) ||

            calculateIntensity(

                weight,

                oneRM

            );

        const now =
            new Date().toISOString();

        importedRecords.push({

            id:
                weightCreateId("weight"),

            athleteId:
                athlete.id,

            athleteName:

                athlete.name ||

                athlete.athleteName ||

                getValue(

                    values,

                    ["선수명", "선수"]

                ) ||

                "",

            date,

            bodyPart,

            exercise,

            weight,

            reps,

            sets,

            rpe:
                weightToNumber(

                    getValue(

                        values,

                        ["RPE", "rpe"]

                    )

                ),

            oneRM,

            volume,

            intensity,

            memo:
                getValue(

                    values,

                    ["메모", "비고"]

                ),

            createdAt:
                now,

            updatedAt:
                now

        });

    });

    if(importedRecords.length === 0) {

        weightShowToast(

            "가져올 수 있는 기록이 없습니다.",

            "error"

        );

        return;

    }

    const records =
        ensureWeightDataStore();

    records.unshift(

        ...importedRecords

    );

    weightAutoSave();

    refreshWeightPage();

    weightRenderDashboard();

    weightShowToast(

        `${importedRecords.length}개의 기록을 가져왔습니다.`,

        "success"

    );

}

/* ======================================================
   CSV 입력 변경 이벤트
====================================================== */

function handleWeightCSVInput(event) {

    const file =

        event.target.files?.[0];

    importWeightCSV(file);

    event.target.value =
        "";

}

/* ======================================================
   인쇄용 행 HTML
====================================================== */

function createWeightPrintRowHTML(record) {

    const safeRecord =
        normalizeWeightRecord(record);

    return `

<tr>

    <td>
        ${weightEscapeHTML(
            weightFormatDate(
                safeRecord.date
            )
        )}
    </td>

    <td>
        ${weightEscapeHTML(
            safeRecord.bodyPart
        )}
    </td>

    <td>
        ${weightEscapeHTML(
            safeRecord.exercise
        )}
    </td>

    <td>
        ${weightFormatNumber(
            safeRecord.weight
        )} kg
    </td>

    <td>
        ${safeRecord.reps}회
    </td>

    <td>
        ${safeRecord.sets}세트
    </td>

    <td>
        ${weightFormatNumber(
            safeRecord.oneRM
        )} kg
    </td>

    <td>
        ${weightFormatNumber(
            safeRecord.volume
        )} kg
    </td>

    <td>
        ${safeRecord.rpe || "-"}
    </td>

</tr>

`;

}

/* ======================================================
   인쇄 리포트
====================================================== */

function printWeightReport() {

    const athlete =
        requireWeightAthlete();

    if(!athlete) {

        return;

    }

    const records =
        getFilteredWeightRecords();

    if(records.length === 0) {

        weightShowToast(

            "인쇄할 웨이트 기록이 없습니다.",

            "info"

        );

        return;

    }

    const summary =
        getWeightDashboardData();

    const athleteName =

        athlete.name ||

        athlete.athleteName ||

        "선수";

    const printWindow =

        window.open(

            "",

            "_blank",

            "width=1100,height=800"

        );

    if(!printWindow) {

        weightShowToast(

            "팝업이 차단되어 인쇄 창을 열지 못했습니다.",

            "error"

        );

        return;

    }

    printWindow.document.write(`

<!DOCTYPE html>

<html lang="ko">

<head>

<meta charset="UTF-8">

<title>
    ${weightEscapeHTML(athleteName)} 웨이트 리포트
</title>

<style>

body {

    margin: 0;

    padding: 32px;

    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    color: #111827;

}

h1 {

    margin: 0 0 8px;

}

.report-date {

    margin-bottom: 24px;

    color: #6b7280;

}

.summary {

    display: grid;

    grid-template-columns:
        repeat(4, 1fr);

    gap: 12px;

    margin-bottom: 24px;

}

.summary div {

    padding: 14px;

    border: 1px solid #d1d5db;

    border-radius: 10px;

}

.summary span {

    display: block;

    margin-bottom: 6px;

    color: #6b7280;

    font-size: 13px;

}

.summary strong {

    font-size: 18px;

}

table {

    width: 100%;

    border-collapse: collapse;

    font-size: 13px;

}

th,
td {

    padding: 9px;

    border: 1px solid #d1d5db;

    text-align: center;

}

th {

    background: #f3f4f6;

}

@media print {

    body {

        padding: 0;

    }

}

</style>

</head>

<body>

<h1>
    ${weightEscapeHTML(athleteName)} 웨이트 리포트
</h1>

<p class="report-date">
    출력일: ${weightFormatDate(weightGetTodayValue())}
</p>

<section class="summary">

    <div>

        <span>총 기록</span>

        <strong>
            ${summary.totalWorkout}개
        </strong>

    </div>

    <div>

        <span>총 볼륨</span>

        <strong>
            ${weightFormatNumber(
                summary.totalVolume
            )} kg
        </strong>

    </div>

    <div>

        <span>최고 예상 1RM</span>

        <strong>
            ${weightFormatNumber(
                summary.bestOneRM
            )} kg
        </strong>

    </div>

    <div>

        <span>평균 RPE</span>

        <strong>
            ${summary.averageRPE || "-"}
        </strong>

    </div>

</section>

<table>

<thead>

<tr>

    <th>날짜</th>

    <th>부위</th>

    <th>운동</th>

    <th>중량</th>

    <th>횟수</th>

    <th>세트</th>

    <th>예상 1RM</th>

    <th>볼륨</th>

    <th>RPE</th>

</tr>

</thead>

<tbody>

${records
    .map(createWeightPrintRowHTML)
    .join("")}

</tbody>

</table>

<script>

window.addEventListener(
    "load",
    function() {

        window.print();

    }
);

<\/script>

</body>

</html>

`);

    printWindow.document.close();

}
/* ======================================================
   weight.js Part 5-2
   Refresh / Initialize / Events / Export
====================================================== */

/* ======================================================
   모듈 초기화 상태
====================================================== */

let weightModuleInitialized =
    false;

/* ======================================================
   전체 화면 새로고침
====================================================== */

function refreshWeightPage() {

    renderWeightPage();

    renderWeightDashboardCards();

    renderWeightAnalysis();

    renderWeightAIReport();

    renderWeightSummaryUI();

    refreshWeightCharts();

    updateWeightPreview();

}

/* ======================================================
   선수 변경 시 새로고침
====================================================== */

function handleWeightAthleteChange() {

    weightState.editingId =
        null;

    weightState.page =
        1;

    resetWeightForm();

    updateWeightExerciseFilterOptions();

    refreshWeightPage();

}

/* ======================================================
   목록 이벤트 초기화
====================================================== */

function initializeWeightListEvents() {

    const elements =
        getWeightElements();

    elements.list?.addEventListener(

        "click",

        handleWeightListClick

    );

}

/* ======================================================
   페이지네이션 이벤트 초기화
====================================================== */

function initializeWeightPaginationEvents() {

    const elements =
        getWeightElements();

    elements.pagination?.addEventListener(

        "click",

        handleWeightPaginationClick

    );

    elements.previousPage?.addEventListener(

        "click",

        goToPreviousWeightPage

    );

    elements.nextPage?.addEventListener(

        "click",

        goToNextWeightPage

    );

}

/* ======================================================
   폼 이벤트 초기화
====================================================== */

function initializeWeightFormEvents() {

    const elements =
        getWeightElements();

    elements.form?.addEventListener(

        "submit",

        handleWeightFormSubmit

    );

    elements.cancel?.addEventListener(

        "click",

        cancelWeightEdit

    );

}

/* ======================================================
   CSV 이벤트 초기화
====================================================== */

function initializeWeightCSVEvents() {

    const csvInput =

        document.querySelector(

            "#weightCSVInput"

        );

    const importButton =

        document.querySelector(

            "#weightImportButton"

        );

    const exportButton =

        document.querySelector(

            "#weightExportButton"

        );

    csvInput?.addEventListener(

        "change",

        handleWeightCSVInput

    );

    importButton?.addEventListener(

        "click",

        requestWeightCSVImport

    );

    exportButton?.addEventListener(

        "click",

        exportWeightCSV

    );

}

/* ======================================================
   인쇄 이벤트 초기화
====================================================== */

function initializeWeightPrintEvents() {

    const printButton =

        document.querySelector(

            "#weightPrintButton"

        );

    printButton?.addEventListener(

        "click",

        printWeightReport

    );

}

/* ======================================================
   필터 초기화 버튼
====================================================== */

function initializeWeightResetFilterEvent() {

    const buttons =

        document.querySelectorAll(

            "[data-action='reset-weight-filters']"

        );

    buttons.forEach(button => {

        button.addEventListener(

            "click",

            resetWeightFilters

        );

    });

}

/* ======================================================
   전체 삭제 버튼
====================================================== */

function initializeWeightDeleteAllEvent() {

    const buttons =

        document.querySelectorAll(

            "[data-action='delete-all-weight-records']"

        );

    buttons.forEach(button => {

        button.addEventListener(

            "click",

            requestDeleteAllWeightRecords

        );

    });

}

/* ======================================================
   페이지 크기 이벤트
====================================================== */

function initializeWeightPageSizeEvent() {

    const select =

        document.querySelector(

            "#weightPageSize"

        );

    if(!select) {

        return;

    }

    if(select.value) {

        weightState.pageSize =

            Math.max(

                1,

                weightToNumber(

                    select.value

                ) || 10

            );

    }

    select.addEventListener(

        "change",

        event => {

            setWeightPageSize(

                event.target.value

            );

        }

    );

}

/* ======================================================
   공통 action 이벤트
====================================================== */

function handleWeightDocumentAction(event) {

    const button =

        event.target.closest(

            "[data-weight-action]"

        );

    if(!button) {

        return;

    }

    const action =

        button.dataset.weightAction;

    switch(action) {

        case "import":

            requestWeightCSVImport();

            break;

        case "export":

            exportWeightCSV();

            break;

        case "print":

            printWeightReport();

            break;

        case "reset-filter":

            resetWeightFilters();

            break;

        case "delete-all":

            requestDeleteAllWeightRecords();

            break;

        case "refresh":

            refreshWeightPage();

            break;

    }

}

/* ======================================================
   선수 변경 이벤트 감지
====================================================== */

function initializeWeightAthleteEvents() {

    document.addEventListener(

        "athleteChanged",

        handleWeightAthleteChange

    );

    document.addEventListener(

        "selectedAthleteChanged",

        handleWeightAthleteChange

    );

}

/* ======================================================
   창 크기 변경 시 차트 보정
====================================================== */

function initializeWeightResizeEvent() {

    let resizeTimer =
        null;

    window.addEventListener(

        "resize",

        () => {

            clearTimeout(

                resizeTimer

            );

            resizeTimer =

                setTimeout(

                    () => {

                        Object.values(

                            weightCharts

                        ).forEach(chart => {

                            if(

                                chart &&

                                typeof chart.resize ===

                                "function"

                            ) {

                                chart.resize();

                            }

                        });

                    },

                    150

                );

        }

    );

}

/* ======================================================
   초기 입력값 반영
====================================================== */

function initializeWeightStateFromDOM() {

    const elements =
        getWeightElements();

    if(elements.search) {

        weightState.searchKeyword =

            elements.search.value ||

            "";

    }

    if(elements.bodyPartFilter) {

        weightState.selectedBodyPart =

            elements.bodyPartFilter.value ||

            "";

    }

    if(elements.exerciseFilter) {

        weightState.selectedExercise =

            elements.exerciseFilter.value ||

            "";

    }

    if(elements.sort) {

        weightState.sortType =

            elements.sort.value ||

            "date-desc";

    }

}

/* ======================================================
   웨이트 모듈 초기화
====================================================== */

function initializeWeightModule() {

    if(weightModuleInitialized) {

        refreshWeightPage();

        return;

    }

    ensureWeightDataStore();

    normalizeAllWeightRecords();

    initializeWeightDate();

    initializeWeightBodyPartOptions();

    updateExerciseOptions();

    initializeWeightFilterOptions();

    updateWeightExerciseFilterOptions();

    initializeWeightStateFromDOM();

    initializeWeightInputs();

    initializeWeightFormEvents();

    initializeWeightListEvents();

    initializeWeightPaginationEvents();

    initializeWeightSearch();

    initializeWeightFilter();

    initializeWeightExerciseFilter();

    initializeWeightSort();

    initializeWeightCSVEvents();

    initializeWeightPrintEvents();

    initializeWeightResetFilterEvent();

    initializeWeightDeleteAllEvent();

    initializeWeightPageSizeEvent();

    initializeWeightAthleteEvents();

    initializeWeightResizeEvent();

    document.addEventListener(

        "click",

        handleWeightDocumentAction

    );

    weightModuleInitialized =
        true;

    resetWeightForm();

    refreshWeightPage();

}

/* ======================================================
   모듈 해제
====================================================== */

function destroyWeightModule() {

    destroyAllWeightCharts();

    weightModuleInitialized =
        false;

}

/* ======================================================
   DOM 준비 후 자동 초기화
====================================================== */

function autoInitializeWeightModule() {

    const weightPageExists =

        Boolean(

            document.querySelector(

                "#weightForm"

            ) ||

            document.querySelector(

                "#weightList"

            )

        );

    if(!weightPageExists) {

        return;

    }

    initializeWeightModule();

}

if(

    document.readyState ===

    "loading"

) {

    document.addEventListener(

        "DOMContentLoaded",

        autoInitializeWeightModule,

        {

            once:
                true

        }

    );

} else {

    autoInitializeWeightModule();

}

/* ======================================================
   전역 함수 Export
====================================================== */

window.weightState =
    weightState;

window.BODY_PARTS =
    BODY_PARTS;

window.EXERCISE_LIST =
    EXERCISE_LIST;

window.initializeWeightModule =
    initializeWeightModule;

window.destroyWeightModule =
    destroyWeightModule;

window.refreshWeightPage =
    refreshWeightPage;

window.renderWeightPage =
    renderWeightPage;

window.renderWeightDashboardCards =
    renderWeightDashboardCards;

window.renderWeightAnalysis =
    renderWeightAnalysis;

window.renderWeightAIReport =
    renderWeightAIReport;

window.renderWeightCharts =
    renderWeightCharts;

window.refreshWeightCharts =
    refreshWeightCharts;

window.renderWeightSummaryUI =
    renderWeightSummaryUI;

window.saveWeightRecord =
    saveWeightRecord;

window.updateWeightRecord =
    updateWeightRecord;

window.startEditWeightRecord =
    startEditWeightRecord;

window.cancelWeightEdit =
    cancelWeightEdit;

window.deleteWeightRecord =
    deleteWeightRecord;

window.requestDeleteWeightRecord =
    requestDeleteWeightRecord;

window.deleteAllWeightRecords =
    deleteAllWeightRecords;

window.requestDeleteAllWeightRecords =
    requestDeleteAllWeightRecords;

window.resetWeightForm =
    resetWeightForm;

window.resetWeightFilters =
    resetWeightFilters;

window.setWeightPageSize =
    setWeightPageSize;

window.goToWeightPage =
    goToWeightPage;

window.exportWeightCSV =
    exportWeightCSV;

window.importWeightCSV =
    importWeightCSV;

window.requestWeightCSVImport =
    requestWeightCSVImport;

window.printWeightReport =
    printWeightReport;

window.calculateOneRM =
    calculateOneRM;

window.calculateVolume =
    calculateVolume;

window.calculateIntensity =
    calculateIntensity;

window.getCurrentWeightRecords =
    getCurrentWeightRecords;

window.getFilteredWeightRecords =
    getFilteredWeightRecords;

window.getWeightDashboardData =
    getWeightDashboardData;

window.createWeightAnalysisData =
    createWeightAnalysisData;

window.generateWeightAnalysis =
    generateWeightAnalysis;