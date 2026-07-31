/* ======================================================
   설천고 스포츠과학 훈련센터
   weight.js 1번
   웨이트 기록 입력 · 저장 · 자동 계산
====================================================== */

"use strict";

/* ======================================================
   웨이트 입력 요소 찾기
====================================================== */

function getWeightFormElements() {
    return {
        form:
            document.querySelector("#weightTrainingForm") ||
            document.querySelector("#weightForm"),

        date:
            document.querySelector("#weightDate") ||
            document.querySelector("#weightTrainingDate"),

        exercise:
            document.querySelector("#weightExercise") ||
            document.querySelector("#exerciseName"),

        category:
            document.querySelector("#weightCategory") ||
            document.querySelector("#exerciseCategory"),

        sets:
            document.querySelector("#weightSets") ||
            document.querySelector("#exerciseSets"),

        reps:
            document.querySelector("#weightReps") ||
            document.querySelector("#exerciseReps"),

        weight:
            document.querySelector("#exerciseWeight") ||
            document.querySelector("#weightLoad"),

        duration:
            document.querySelector("#weightDuration") ||
            document.querySelector("#weightTrainingDuration"),

        rpe:
            document.querySelector("#weightRpe") ||
            document.querySelector("#weightTrainingRpe"),

        restSeconds:
            document.querySelector("#weightRestSeconds") ||
            document.querySelector("#restSeconds"),

        bodyPart:
            document.querySelector("#weightBodyPart") ||
            document.querySelector("#bodyPart"),

        condition:
            document.querySelector("#weightCondition") ||
            document.querySelector("#weightTrainingCondition"),

        memo:
            document.querySelector("#weightMemo") ||
            document.querySelector("#weightTrainingMemo"),

        submitButton:
            document.querySelector("#saveWeightRecordButton") ||
            document.querySelector("#weightSubmitButton"),

        resetButton:
            document.querySelector("#resetWeightFormButton") ||
            document.querySelector("#weightResetButton")
    };
}

/* ======================================================
   수정 중인 웨이트 기록 ID
====================================================== */

let editingWeightRecordId = null;

/* ======================================================
   운동 부위 표시
====================================================== */

function getWeightBodyPartLabel(bodyPart) {
    const labels = {
        chest: "가슴",
        back: "등",
        shoulder: "어깨",
        arms: "팔",
        biceps: "이두",
        triceps: "삼두",
        legs: "하체",
        glutes: "둔근",
        core: "코어",
        fullbody: "전신",
        other: "기타"
    };

    return labels[bodyPart] || bodyPart || "-";
}

/* ======================================================
   운동 분류 표시
====================================================== */

function getWeightCategoryLabel(category) {
    const labels = {
        strength: "근력",
        hypertrophy: "근비대",
        endurance: "근지구력",
        power: "파워",
        rehabilitation: "재활",
        mobility: "가동성",
        other: "기타"
    };

    return labels[category] || category || "-";
}

/* ======================================================
   입력 데이터 읽기
====================================================== */

function getWeightFormData() {
    const elements = getWeightFormElements();

    return {
        date:
            elements.date?.value ||
            getTodayValue(),

        exercise:
            elements.exercise?.value.trim() || "",

        category:
            elements.category?.value || "",

        sets:
            toNumber(elements.sets?.value),

        reps:
            toNumber(elements.reps?.value),

        weight:
            toNumber(elements.weight?.value),

        duration:
            toNumber(elements.duration?.value),

        rpe:
            toNumber(elements.rpe?.value),

        restSeconds:
            toNumber(elements.restSeconds?.value),

        bodyPart:
            elements.bodyPart?.value || "",

        condition:
            elements.condition?.value || "",

        memo:
            elements.memo?.value.trim() || ""
    };
}

/* ======================================================
   입력값 검사
====================================================== */

function validateWeightRecord(data) {
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

    if (!data.exercise) {
        showToast(
            "운동 이름을 입력해 주세요용.",
            "error"
        );

        getWeightFormElements().exercise?.focus();

        return false;
    }

    if (data.sets < 0 || data.sets > 100) {
        showToast(
            "세트 수를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.reps < 0 || data.reps > 1000) {
        showToast(
            "반복 횟수를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.weight < 0 || data.weight > 1000) {
        showToast(
            "중량을 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.duration < 0 || data.duration > 1440) {
        showToast(
            "훈련 시간을 올바르게 입력해 주세요용.",
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

    return true;
}

/* ======================================================
   총 반복 수 계산
====================================================== */

function calculateTotalReps(sets, reps) {
    return Math.round(
        toNumber(sets) *
        toNumber(reps)
    );
}

/* ======================================================
   총 훈련 볼륨 계산
   세트 × 반복 × 중량
====================================================== */

function calculateTrainingVolume(
    sets,
    reps,
    weight
) {
    return Number(
        (
            toNumber(sets) *
            toNumber(reps) *
            toNumber(weight)
        ).toFixed(1)
    );
}

/* ======================================================
   추정 1RM 계산
   Epley 공식
====================================================== */

function calculateEstimatedOneRepMax(
    weight,
    reps
) {
    const weightNumber =
        toNumber(weight);

    const repsNumber =
        toNumber(reps);

    if (
        weightNumber <= 0 ||
        repsNumber <= 0
    ) {
        return 0;
    }

    if (repsNumber === 1) {
        return weightNumber;
    }

    return Number(
        (
            weightNumber *
            (1 + repsNumber / 30)
        ).toFixed(1)
    );
}

/* ======================================================
   웨이트 훈련 부하 계산
====================================================== */

function calculateWeightTrainingLoad(
    duration,
    rpe
) {
    return Math.round(
        toNumber(duration) *
        toNumber(rpe)
    );
}

/* ======================================================
   웨이트 기록 저장
====================================================== */

function saveWeightRecord(event) {
    event?.preventDefault();

    const athlete = getSelectedAthlete();
    const formData = getWeightFormData();

    if (!validateWeightRecord(formData)) {
        return;
    }

    const calculatedData = {
        totalReps:
            calculateTotalReps(
                formData.sets,
                formData.reps
            ),

        trainingVolume:
            calculateTrainingVolume(
                formData.sets,
                formData.reps,
                formData.weight
            ),

        estimatedOneRepMax:
            calculateEstimatedOneRepMax(
                formData.weight,
                formData.reps
            ),

        trainingLoad:
            calculateWeightTrainingLoad(
                formData.duration,
                formData.rpe
            )
    };

    if (editingWeightRecordId) {
        updateWeightRecord(
            editingWeightRecordId,
            formData,
            calculatedData
        );

        return;
    }

    const newRecord = {
        id: createId("weight"),
        athleteId: athlete.id,

        ...formData,
        ...calculatedData,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    appData.weightRecords.unshift(newRecord);

    saveAppData();
    resetWeightForm();
    renderWeightPage();

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
        `${athlete.name} 선수의 웨이트 기록을 저장했어용.`,
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
   웨이트 기록 수정 저장
====================================================== */

function updateWeightRecord(
    recordId,
    formData,
    calculatedData
) {
    const recordIndex =
        appData.weightRecords.findIndex(
            record => record.id === recordId
        );

    if (recordIndex === -1) {
        showToast(
            "수정할 웨이트 기록을 찾을 수 없어용.",
            "error"
        );

        editingWeightRecordId = null;
        return;
    }

    appData.weightRecords[recordIndex] = {
        ...appData.weightRecords[recordIndex],
        ...formData,
        ...calculatedData,
        updatedAt: new Date().toISOString()
    };

    editingWeightRecordId = null;

    saveAppData();
    resetWeightForm();
    renderWeightPage();

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
        `${formData.exercise} 기록을 수정했어용.`,
        "success"
    );
}

/* ======================================================
   웨이트 폼 초기화
====================================================== */

function resetWeightForm() {
    const elements =
        getWeightFormElements();

    editingWeightRecordId = null;

    elements.form?.reset();

    if (elements.date) {
        elements.date.value =
            getTodayValue();
    }

    if (elements.submitButton) {
        elements.submitButton.textContent =
            "웨이트 기록 저장";
    }

    updateWeightLivePreview();
}

/* ======================================================
   실시간 계산값 표시
====================================================== */

function setWeightPreviewValue(
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

function updateWeightLivePreview() {
    const data = getWeightFormData();

    const totalReps =
        calculateTotalReps(
            data.sets,
            data.reps
        );

    const volume =
        calculateTrainingVolume(
            data.sets,
            data.reps,
            data.weight
        );

    const oneRepMax =
        calculateEstimatedOneRepMax(
            data.weight,
            data.reps
        );

    const trainingLoad =
        calculateWeightTrainingLoad(
            data.duration,
            data.rpe
        );

    setWeightPreviewValue(
        [
            "#weightTotalRepsPreview",
            "[data-weight-preview='total-reps']"
        ],
        totalReps || "-"
    );

    setWeightPreviewValue(
        [
            "#weightVolumePreview",
            "[data-weight-preview='volume']"
        ],
        volume
            ? `${volume.toFixed(1)} kg`
            : "-"
    );

    setWeightPreviewValue(
        [
            "#weightOneRepMaxPreview",
            "[data-weight-preview='one-rm']"
        ],
        oneRepMax
            ? `${oneRepMax.toFixed(1)} kg`
            : "-"
    );

    setWeightPreviewValue(
        [
            "#weightLoadPreview",
            "[data-weight-preview='load']"
        ],
        trainingLoad || "-"
    );
}

/* ======================================================
   선택 선수 웨이트 기록
====================================================== */

function getSelectedAthleteWeightRecords() {
    const athlete = getSelectedAthlete();

    if (!athlete) {
        return [];
    }

    return appData.weightRecords
        .filter(
            record =>
                record.athleteId ===
                athlete.id
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
   웨이트 페이지 요약 표시
====================================================== */

function renderWeightPage() {
    const athlete = getSelectedAthlete();
    const records =
        getSelectedAthleteWeightRecords();

    document
        .querySelectorAll(
            "[data-weight-athlete-name]"
        )
        .forEach(element => {
            element.textContent =
                athlete
                    ? athlete.name
                    : "선수 미선택";
        });

    const totalDuration =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(record.duration),
            0
        );

    const totalVolume =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(
                    record.trainingVolume
                ),
            0
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

    setWeightPreviewValue(
        [
            "#weightTotalRecordCount",
            "[data-weight-summary='count']"
        ],
        records.length
    );

    setWeightPreviewValue(
        [
            "#weightTotalDuration",
            "[data-weight-summary='duration']"
        ],
        `${totalDuration}분`
    );

    setWeightPreviewValue(
        [
            "#weightTotalVolume",
            "[data-weight-summary='volume']"
        ],
        `${totalVolume.toFixed(1)} kg`
    );

    setWeightPreviewValue(
        [
            "#weightAverageLoad",
            "[data-weight-summary='load']"
        ],
        averageLoad
    );

    setWeightFormDisabled(!athlete);
    updateWeightLivePreview();
}

/* ======================================================
   폼 비활성화
====================================================== */

function setWeightFormDisabled(disabled) {
    const elements =
        getWeightFormElements();

    [
        elements.date,
        elements.exercise,
        elements.category,
        elements.sets,
        elements.reps,
        elements.weight,
        elements.duration,
        elements.rpe,
        elements.restSeconds,
        elements.bodyPart,
        elements.condition,
        elements.memo,
        elements.submitButton,
        elements.resetButton
    ].forEach(element => {
        if (element) {
            element.disabled = disabled;
        }
    });
}

/* ======================================================
   웨이트 기능 초기화
====================================================== */

function initializeWeightTraining() {
    const elements =
        getWeightFormElements();

    if (elements.date && !elements.date.value) {
        elements.date.value =
            getTodayValue();
    }

    elements.form?.addEventListener(
        "submit",
        saveWeightRecord
    );

    if (
        !elements.form &&
        elements.submitButton
    ) {
        elements.submitButton.addEventListener(
            "click",
            saveWeightRecord
        );
    }

    elements.resetButton?.addEventListener(
        "click",
        event => {
            event.preventDefault();
            resetWeightForm();
        }
    );

    [
        elements.sets,
        elements.reps,
        elements.weight,
        elements.duration,
        elements.rpe
    ].forEach(element => {
        element?.addEventListener(
            "input",
            updateWeightLivePreview
        );
    });

    renderWeightPage();
}

/* ======================================================
   DOM 준비 후 실행
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeWeightTraining
);

/* ======================================================
   다른 파일에서 사용할 함수
====================================================== */

window.renderWeightPage =
    renderWeightPage;

window.saveWeightRecord =
    saveWeightRecord;

window.resetWeightForm =
    resetWeightForm;

window.calculateTotalReps =
    calculateTotalReps;

window.calculateTrainingVolume =
    calculateTrainingVolume;

window.calculateEstimatedOneRepMax =
    calculateEstimatedOneRepMax;

window.calculateWeightTrainingLoad =
    calculateWeightTrainingLoad;

window.getSelectedAthleteWeightRecords =
    getSelectedAthleteWeightRecords;
    /* ======================================================
   weight.js 2-2
   웨이트 기록 수정 · 삭제 · 버튼 이벤트
====================================================== */

/* ======================================================
   삭제 확인 요청
====================================================== */

function requestDeleteWeightRecord(recordId) {
    const record =
        appData.weightRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "삭제할 웨이트 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    const exerciseName =
        record.exercise || "웨이트 훈련";

    if (
        typeof window.openConfirmModal ===
        "function"
    ) {
        window.openConfirmModal({
            title: "웨이트 기록 삭제",

            message:
                `${exerciseName} 기록을 삭제할까요? ` +
                "삭제한 기록은 복구할 수 없어용.",

            confirmText: "삭제",

            onConfirm: () => {
                deleteWeightRecord(recordId);
            }
        });

        return;
    }

    const confirmed = window.confirm(
        `${exerciseName} 기록을 삭제할까요?\n` +
        "삭제한 기록은 복구할 수 없어용."
    );

    if (confirmed) {
        deleteWeightRecord(recordId);
    }
}

/* ======================================================
   웨이트 기록 삭제
====================================================== */

function deleteWeightRecord(recordId) {
    const record =
        appData.weightRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "삭제할 웨이트 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    const exerciseName =
        record.exercise || "웨이트 훈련";

    appData.weightRecords =
        appData.weightRecords.filter(
            item => item.id !== recordId
        );

    if (
        editingWeightRecordId === recordId
    ) {
        resetWeightForm();
    }

    saveAppData();

    if (
        typeof window.renderWeightPage ===
        "function"
    ) {
        window.renderWeightPage();
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
        `${exerciseName} 기록을 삭제했어용.`,
        "success"
    );
}

/* ======================================================
   웨이트 수정 시작 보강
====================================================== */

function beginWeightRecordEdit(recordId) {
    const record =
        appData.weightRecords.find(
            item => item.id === recordId
        );

    if (!record) {
        showToast(
            "수정할 웨이트 기록을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    startEditWeightRecord(recordId);

    const form =
        getWeightFormElements().form;

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
   웨이트 수정 취소
====================================================== */

function cancelWeightRecordEditWithNotice() {
    const wasEditing =
        Boolean(editingWeightRecordId);

    resetWeightForm();

    if (wasEditing) {
        showToast(
            "웨이트 기록 수정을 취소했어용."
        );
    }
}

/* ======================================================
   웨이트 카드 버튼 처리
====================================================== */

function handleWeightRecordAction(event) {
    const actionButton =
        event.target.closest(
            "[data-weight-action]"
        );

    if (!actionButton) {
        return;
    }

    const action =
        actionButton.dataset.weightAction;

    const recordId =
        actionButton.dataset.weightRecordId;

    if (!recordId) {
        showToast(
            "웨이트 기록 번호를 찾을 수 없어용.",
            "error"
        );

        return;
    }

    if (action === "edit") {
        beginWeightRecordEdit(recordId);
        return;
    }

    if (action === "delete") {
        requestDeleteWeightRecord(recordId);
    }
}

/* ======================================================
   카드 선택 효과
====================================================== */

function handleWeightRecordCardSelection(
    event
) {
    if (
        event.target.closest(
            "button, input, select, textarea, a"
        )
    ) {
        return;
    }

    const card =
        event.target.closest(
            ".weight-record-card"
        );

    if (!card) {
        return;
    }

    document
        .querySelectorAll(
            ".weight-record-card.selected"
        )
        .forEach(item => {
            item.classList.remove("selected");
        });

    card.classList.add("selected");
}

/* ======================================================
   목록 이벤트 연결
====================================================== */

function initializeWeightRecordActions() {
    const container =
        document.querySelector(
            "#weightRecordList"
        ) ||
        document.querySelector(
            "#weightTrainingRecordList"
        ) ||
        document.querySelector(
            ".weight-record-list"
        ) ||
        document.querySelector(
            "[data-weight-record-list]"
        );

    if (container) {
        container.addEventListener(
            "click",
            event => {
                handleWeightRecordAction(event);
                handleWeightRecordCardSelection(
                    event
                );
            }
        );
    }

    const cancelButton =
        getWeightFormElements()
            .cancelButton;

    cancelButton?.addEventListener(
        "click",
        event => {
            event.preventDefault();
            cancelWeightRecordEditWithNotice();
        }
    );
}

/* ======================================================
   웨이트 페이지 키보드 단축키
====================================================== */

function initializeWeightKeyboardShortcuts() {
    document.addEventListener(
        "keydown",
        event => {
            const weightPage =
                document.querySelector(
                    "#weightPage"
                ) ||
                document.querySelector(
                    "[data-page='weight']"
                );

            if (!weightPage) {
                return;
            }

            if (
                weightPage.classList.contains(
                    "hidden"
                )
            ) {
                return;
            }

            if (
                event.key === "Escape" &&
                editingWeightRecordId
            ) {
                cancelWeightRecordEditWithNotice();
            }
        }
    );
}

/* ======================================================
   수정 상태 표시 보강
====================================================== */

function renderWeightEditNotice() {
    const notice =
        document.querySelector(
            "#weightEditNotice"
        ) ||
        document.querySelector(
            "[data-weight-edit-notice]"
        );

    if (!notice) {
        return;
    }

    const isEditing =
        Boolean(editingWeightRecordId);

    notice.classList.toggle(
        "hidden",
        !isEditing
    );

    notice.textContent =
        isEditing
            ? "현재 저장된 웨이트 기록을 수정 중이에용."
            : "";
}

/* ======================================================
   기존 수정 상태 함수 확장
====================================================== */

const originalUpdateWeightEditState =
    window.updateWeightEditState ||
    updateWeightEditState;

function updateWeightEditStateWithNotice() {
    if (
        typeof originalUpdateWeightEditState ===
        "function"
    ) {
        originalUpdateWeightEditState();
    }

    renderWeightEditNotice();
}

window.updateWeightEditState =
    updateWeightEditStateWithNotice;

/* ======================================================
   수정 시작 함수 확장
====================================================== */

const originalStartEditWeightRecord =
    window.startEditWeightRecord ||
    startEditWeightRecord;

function startEditWeightRecordWithNotice(
    recordId
) {
    originalStartEditWeightRecord(recordId);
    renderWeightEditNotice();
}

window.startEditWeightRecord =
    startEditWeightRecordWithNotice;

/* ======================================================
   폼 초기화 함수 확장
====================================================== */

const originalResetWeightForm =
    window.resetWeightForm ||
    resetWeightForm;

function resetWeightFormWithNotice() {
    originalResetWeightForm();
    renderWeightEditNotice();
}

window.resetWeightForm =
    resetWeightFormWithNotice;

/* ======================================================
   DOM 준비 후 실행
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeWeightRecordActions();
        initializeWeightKeyboardShortcuts();
        renderWeightEditNotice();
    }
);

/* ======================================================
   외부 사용 함수
====================================================== */

window.requestDeleteWeightRecord =
    requestDeleteWeightRecord;

window.deleteWeightRecord =
    deleteWeightRecord;

window.beginWeightRecordEdit =
    beginWeightRecordEdit;

window.handleWeightRecordAction =
    handleWeightRecordAction;
    /* ======================================================
   weight.js 2-3
   검색 · 부위 필터 · 정렬 · 통계 · 차트
====================================================== */

/* ======================================================
   웨이트 필터 상태
====================================================== */

const weightFilterState = {
    searchText: "",
    bodyPart: "all",
    sort: "newest",
    startDate: "",
    endDate: ""
};

/* ======================================================
   필터 요소 찾기
====================================================== */

function getWeightFilterElements() {
    return {
        searchInput:
            document.querySelector(
                "#weightSearchInput"
            ) ||
            document.querySelector(
                "[data-weight-filter='search']"
            ),

        bodyPartSelect:
            document.querySelector(
                "#weightBodyPartFilter"
            ) ||
            document.querySelector(
                "#weightFilterSelect"
            ) ||
            document.querySelector(
                "[data-weight-filter='body-part']"
            ),

        sortSelect:
            document.querySelector(
                "#weightSortSelect"
            ) ||
            document.querySelector(
                "[data-weight-filter='sort']"
            ),

        startDate:
            document.querySelector(
                "#weightStartDate"
            ) ||
            document.querySelector(
                "[data-weight-filter='start-date']"
            ),

        endDate:
            document.querySelector(
                "#weightEndDate"
            ) ||
            document.querySelector(
                "[data-weight-filter='end-date']"
            ),

        resetButton:
            document.querySelector(
                "#resetWeightFilterButton"
            ) ||
            document.querySelector(
                "[data-weight-filter-reset]"
            ),

        resultCount:
            document.querySelector(
                "#weightFilterResultCount"
            ) ||
            document.querySelector(
                "[data-weight-filter-result]"
            )
    };
}

/* ======================================================
   검색어 정리
====================================================== */

function normalizeWeightSearchText(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

/* ======================================================
   검색 대상 문자열 생성
====================================================== */

function createWeightSearchTarget(record) {
    const athlete =
        appData.athletes.find(
            item =>
                item.id === record.athleteId
        );

    return normalizeWeightSearchText(
        [
            record.exercise,
            record.bodyPart,
            getWeightBodyPartLabel(
                record.bodyPart
            ),
            record.memo,
            record.tempo,
            record.condition,
            getWeightConditionLabel(
                record.condition
            ),
            athlete?.name
        ]
            .filter(Boolean)
            .join(" ")
    );
}

/* ======================================================
   날짜 범위 확인
====================================================== */

function isWeightRecordInDateRange(record) {
    const recordDate =
        record.date || "";

    if (!recordDate) {
        return (
            !weightFilterState.startDate &&
            !weightFilterState.endDate
        );
    }

    if (
        weightFilterState.startDate &&
        recordDate <
            weightFilterState.startDate
    ) {
        return false;
    }

    if (
        weightFilterState.endDate &&
        recordDate >
            weightFilterState.endDate
    ) {
        return false;
    }

    return true;
}

/* ======================================================
   기록 시간값
====================================================== */

function getWeightRecordTimestamp(record) {
    return new Date(
        record.date ||
        record.createdAt ||
        0
    ).getTime();
}

/* ======================================================
   웨이트 정렬
====================================================== */

function sortWeightRecords(
    records,
    sortType
) {
    const sortedRecords = [...records];

    switch (sortType) {
        case "oldest":
            sortedRecords.sort(
                (a, b) =>
                    getWeightRecordTimestamp(a) -
                    getWeightRecordTimestamp(b)
            );
            break;

        case "volume-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(
                        b.trainingVolume
                    ) -
                    toNumber(
                        a.trainingVolume
                    )
            );
            break;

        case "weight-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(b.weight) -
                    toNumber(a.weight)
            );
            break;

        case "one-rm-high":
            sortedRecords.sort(
                (a, b) =>
                    toNumber(
                        b.estimatedOneRepMax
                    ) -
                    toNumber(
                        a.estimatedOneRepMax
                    )
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

        case "newest":
        default:
            sortedRecords.sort(
                (a, b) =>
                    getWeightRecordTimestamp(b) -
                    getWeightRecordTimestamp(a)
            );
            break;
    }

    return sortedRecords;
}

/* ======================================================
   필터 적용 기록
====================================================== */

function getFilteredWeightRecords() {
    const records =
        getSelectedAthleteWeightRecords();

    const searchText =
        normalizeWeightSearchText(
            weightFilterState.searchText
        );

    const filteredRecords =
        records.filter(record => {
            const matchesSearch =
                !searchText ||
                createWeightSearchTarget(
                    record
                ).includes(searchText);

            const matchesBodyPart =
                weightFilterState.bodyPart ===
                    "all" ||
                record.bodyPart ===
                    weightFilterState.bodyPart;

            const matchesDate =
                isWeightRecordInDateRange(
                    record
                );

            return (
                matchesSearch &&
                matchesBodyPart &&
                matchesDate
            );
        });

    return sortWeightRecords(
        filteredRecords,
        weightFilterState.sort
    );
}

/* ======================================================
   필터 전체 적용
====================================================== */

function applyWeightFilters() {
    const records =
        getFilteredWeightRecords();

    refreshWeightRecordList(records);
    renderWeightFilterResultCount(records);
    renderWeightStatistics(records);
    renderWeightCharts(records);
}

/* ======================================================
   필터 결과 개수
====================================================== */

function renderWeightFilterResultCount(
    records
) {
    const elements =
        getWeightFilterElements();

    const totalRecords =
        getSelectedAthleteWeightRecords()
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
   날짜 필터 검사
====================================================== */

function validateWeightDateFilter() {
    const startDate =
        weightFilterState.startDate;

    const endDate =
        weightFilterState.endDate;

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
   필터 초기화
====================================================== */

function resetWeightFilters() {
    weightFilterState.searchText = "";
    weightFilterState.bodyPart = "all";
    weightFilterState.sort = "newest";
    weightFilterState.startDate = "";
    weightFilterState.endDate = "";

    const elements =
        getWeightFilterElements();

    if (elements.searchInput) {
        elements.searchInput.value = "";
    }

    if (elements.bodyPartSelect) {
        elements.bodyPartSelect.value =
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

    applyWeightFilters();

    showToast(
        "웨이트 기록 필터를 초기화했어용."
    );
}

/* ======================================================
   필터 이벤트 연결
====================================================== */

function initializeWeightFilters() {
    const elements =
        getWeightFilterElements();

    elements.searchInput
        ?.addEventListener(
            "input",
            event => {
                weightFilterState.searchText =
                    event.target.value;

                applyWeightFilters();
            }
        );

    elements.bodyPartSelect
        ?.addEventListener(
            "change",
            event => {
                weightFilterState.bodyPart =
                    event.target.value ||
                    "all";

                applyWeightFilters();
            }
        );

    elements.sortSelect
        ?.addEventListener(
            "change",
            event => {
                weightFilterState.sort =
                    event.target.value ||
                    "newest";

                applyWeightFilters();
            }
        );

    elements.startDate
        ?.addEventListener(
            "change",
            event => {
                weightFilterState.startDate =
                    event.target.value;

                if (
                    !validateWeightDateFilter()
                ) {
                    event.target.value = "";
                    weightFilterState.startDate =
                        "";
                }

                applyWeightFilters();
            }
        );

    elements.endDate
        ?.addEventListener(
            "change",
            event => {
                weightFilterState.endDate =
                    event.target.value;

                if (
                    !validateWeightDateFilter()
                ) {
                    event.target.value = "";
                    weightFilterState.endDate =
                        "";
                }

                applyWeightFilters();
            }
        );

    elements.resetButton
        ?.addEventListener(
            "click",
            event => {
                event.preventDefault();
                resetWeightFilters();
            }
        );
}

/* ======================================================
   통계 계산
====================================================== */

function calculateWeightStatistics(
    records
) {
    const totalCount =
        records.length;

    const totalVolume =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(
                    record.trainingVolume
                ),
            0
        );

    const totalSets =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(record.sets),
            0
        );

    const totalReps =
        records.reduce(
            (sum, record) =>
                sum +
                (
                    toNumber(record.totalReps) ||
                    calculateTotalReps(
                        record.sets,
                        record.reps
                    )
                ),
            0
        );

    const totalDuration =
        records.reduce(
            (sum, record) =>
                sum +
                toNumber(record.duration),
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

    const highestWeight =
        records.reduce(
            (highest, record) =>
                Math.max(
                    highest,
                    toNumber(record.weight)
                ),
            0
        );

    const highestOneRepMax =
        records.reduce(
            (highest, record) =>
                Math.max(
                    highest,
                    toNumber(
                        record.estimatedOneRepMax
                    )
                ),
            0
        );

    const recordsWithRpe =
        records.filter(
            record =>
                toNumber(record.rpe) > 0
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

    return {
        totalCount,
        totalVolume,
        totalSets,
        totalReps,
        totalDuration,
        totalLoad,
        highestWeight,
        highestOneRepMax,
        averageRpe,

        averageVolume:
            totalCount
                ? totalVolume /
                    totalCount
                : 0,

        averageLoad:
            totalCount
                ? totalLoad /
                    totalCount
                : 0
    };
}

/* ======================================================
   통계값 표시
====================================================== */

function setWeightStatisticsValue(
    key,
    value
) {
    document
        .querySelectorAll(
            `[data-weight-stat="${key}"]`
        )
        .forEach(element => {
            element.textContent = value;
        });

    const idMap = {
        count:
            "#weightStatisticsCount",

        volume:
            "#weightStatisticsVolume",

        sets:
            "#weightStatisticsSets",

        reps:
            "#weightStatisticsReps",

        duration:
            "#weightStatisticsDuration",

        load:
            "#weightStatisticsLoad",

        highestWeight:
            "#weightStatisticsHighestWeight",

        oneRm:
            "#weightStatisticsOneRm",

        averageRpe:
            "#weightStatisticsAverageRpe"
    };

    const element =
        document.querySelector(
            idMap[key]
        );

    if (element) {
        element.textContent = value;
    }
}

/* ======================================================
   통계 출력
====================================================== */

function renderWeightStatistics(
    records = null
) {
    const recordList =
        Array.isArray(records)
            ? records
            : getFilteredWeightRecords();

    const statistics =
        calculateWeightStatistics(
            recordList
        );

    setWeightStatisticsValue(
        "count",
        statistics.totalCount
    );

    setWeightStatisticsValue(
        "volume",
        `${statistics.totalVolume.toLocaleString()} kg`
    );

    setWeightStatisticsValue(
        "sets",
        `${statistics.totalSets}세트`
    );

    setWeightStatisticsValue(
        "reps",
        `${statistics.totalReps}회`
    );

    setWeightStatisticsValue(
        "duration",
        `${statistics.totalDuration}분`
    );

    setWeightStatisticsValue(
        "load",
        Math.round(
            statistics.totalLoad
        )
    );

    setWeightStatisticsValue(
        "highestWeight",
        statistics.highestWeight
            ? `${statistics.highestWeight} kg`
            : "-"
    );

    setWeightStatisticsValue(
        "oneRm",
        statistics.highestOneRepMax
            ? `${statistics.highestOneRepMax} kg`
            : "-"
    );

    setWeightStatisticsValue(
        "averageRpe",
        statistics.averageRpe
            ? statistics.averageRpe.toFixed(
                1
            )
            : "-"
    );
}

/* ======================================================
   Chart.js 객체
====================================================== */

let weightVolumeChart = null;
let weightOneRepMaxChart = null;
let weightBodyPartChart = null;

/* ======================================================
   Chart.js 확인
====================================================== */

function isWeightChartAvailable() {
    return typeof window.Chart !==
        "undefined";
}

/* ======================================================
   차트 제거
====================================================== */

function destroyWeightCharts() {
    if (weightVolumeChart) {
        weightVolumeChart.destroy();
        weightVolumeChart = null;
    }

    if (weightOneRepMaxChart) {
        weightOneRepMaxChart.destroy();
        weightOneRepMaxChart = null;
    }

    if (weightBodyPartChart) {
        weightBodyPartChart.destroy();
        weightBodyPartChart = null;
    }
}

/* ======================================================
   최근 기록 정렬
====================================================== */

function getWeightChartRecords(
    records,
    limit = 10
) {
    return [...records]
        .sort(
            (a, b) =>
                getWeightRecordTimestamp(a) -
                getWeightRecordTimestamp(b)
        )
        .slice(-limit);
}

/* ======================================================
   차트 날짜 라벨
====================================================== */

function createWeightChartDateLabel(
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
   볼륨 차트
====================================================== */

function renderWeightVolumeChart(
    records
) {
    const canvas =
        document.querySelector(
            "#weightVolumeChart"
        );

    if (
        !canvas ||
        !isWeightChartAvailable()
    ) {
        return;
    }

    if (weightVolumeChart) {
        weightVolumeChart.destroy();
    }

    const chartRecords =
        getWeightChartRecords(records);

    weightVolumeChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {
                    labels:
                        chartRecords.map(
                            createWeightChartDateLabel
                        ),

                    datasets: [
                        {
                            label: "훈련 볼륨(kg)",

                            data:
                                chartRecords.map(
                                    record =>
                                        toNumber(
                                            record.trainingVolume
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
   예상 1RM 차트
====================================================== */

function renderWeightOneRepMaxChart(
    records
) {
    const canvas =
        document.querySelector(
            "#weightOneRepMaxChart"
        );

    if (
        !canvas ||
        !isWeightChartAvailable()
    ) {
        return;
    }

    if (weightOneRepMaxChart) {
        weightOneRepMaxChart.destroy();
    }

    const chartRecords =
        getWeightChartRecords(records);

    weightOneRepMaxChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {
                    labels:
                        chartRecords.map(
                            record =>
                                `${createWeightChartDateLabel(
                                    record
                                )} ${record.exercise || ""}`
                        ),

                    datasets: [
                        {
                            label: "예상 1RM(kg)",

                            data:
                                chartRecords.map(
                                    record =>
                                        toNumber(
                                            record.estimatedOneRepMax
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
   운동 부위별 기록 수 계산
====================================================== */

function groupWeightRecordsByBodyPart(
    records
) {
    return records.reduce(
        (groups, record) => {
            const label =
                getWeightBodyPartLabel(
                    record.bodyPart
                );

            groups[label] =
                (groups[label] || 0) + 1;

            return groups;
        },
        {}
    );
}

/* ======================================================
   운동 부위 분포 차트
====================================================== */

function renderWeightBodyPartChart(
    records
) {
    const canvas =
        document.querySelector(
            "#weightBodyPartChart"
        );

    if (
        !canvas ||
        !isWeightChartAvailable()
    ) {
        return;
    }

    if (weightBodyPartChart) {
        weightBodyPartChart.destroy();
    }

    const grouped =
        groupWeightRecordsByBodyPart(
            records
        );

    weightBodyPartChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {
                    labels:
                        Object.keys(grouped),

                    datasets: [
                        {
                            label: "기록 수",

                            data:
                                Object.values(
                                    grouped
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
   빈 차트 상태
====================================================== */

function renderWeightChartEmptyState(
    records
) {
    document
        .querySelectorAll(
            "[data-weight-chart-empty]"
        )
        .forEach(element => {
            element.classList.toggle(
                "hidden",
                records.length > 0
            );
        });

    document
        .querySelectorAll(
            "[data-weight-chart-container]"
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

function renderWeightCharts(
    records = null
) {
    const recordList =
        Array.isArray(records)
            ? records
            : getFilteredWeightRecords();

    renderWeightChartEmptyState(
        recordList
    );

    if (recordList.length === 0) {
        destroyWeightCharts();
        return;
    }

    renderWeightVolumeChart(
        recordList
    );

    renderWeightOneRepMaxChart(
        recordList
    );

    renderWeightBodyPartChart(
        recordList
    );
}

/* ======================================================
   renderWeightPage 최종 확장
====================================================== */

const previousRenderWeightPage =
    window.renderWeightPage;

function renderWeightPageWithFilters() {
    if (
        typeof previousRenderWeightPage ===
        "function"
    ) {
        previousRenderWeightPage();
    }

    applyWeightFilters();
}

window.renderWeightPage =
    renderWeightPageWithFilters;

/* ======================================================
   DOM 준비 후 시작
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeWeightFilters();
        applyWeightFilters();
    }
);

/* ======================================================
   외부 사용 함수
====================================================== */

window.weightFilterState =
    weightFilterState;

window.getFilteredWeightRecords =
    getFilteredWeightRecords;

window.applyWeightFilters =
    applyWeightFilters;

window.resetWeightFilters =
    resetWeightFilters;

window.calculateWeightStatistics =
    calculateWeightStatistics;

window.renderWeightStatistics =
    renderWeightStatistics;

window.renderWeightCharts =
    renderWeightCharts;

window.destroyWeightCharts =
    destroyWeightCharts;