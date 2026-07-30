/* ======================================================
   설천고 스포츠과학 훈련센터
   app.js 1번
   기본 데이터, 저장소, 화면 전환, 공통 기능
====================================================== */

"use strict";

/* ======================================================
   앱 기본 설정
====================================================== */

const APP_STORAGE_KEY = "seolcheonSportsScienceCenter";

const DEFAULT_APP_DATA = {
    athletes: [],
    selectedAthleteId: null,

    sportsRecords: [],
    weightRecords: [],
    poseRecords: [],

    settings: {
        sound: true,
        autoSave: true,
        darkMode: true
    }
};

/* ======================================================
   앱 데이터
====================================================== */

let appData = loadAppData();

/* ======================================================
   DOM 선택 도우미
====================================================== */

const $ = (selector, parent = document) => {
    return parent.querySelector(selector);
};

const $$ = (selector, parent = document) => {
    return [...parent.querySelectorAll(selector)];
};

/* ======================================================
   로컬 저장소 불러오기
====================================================== */

function loadAppData() {
    try {
        const savedData = localStorage.getItem(APP_STORAGE_KEY);

        if (!savedData) {
            return structuredClone(DEFAULT_APP_DATA);
        }

        const parsedData = JSON.parse(savedData);

        return {
            ...structuredClone(DEFAULT_APP_DATA),
            ...parsedData,

            settings: {
                ...DEFAULT_APP_DATA.settings,
                ...(parsedData.settings || {})
            },

            athletes: Array.isArray(parsedData.athletes)
                ? parsedData.athletes
                : [],

            sportsRecords: Array.isArray(parsedData.sportsRecords)
                ? parsedData.sportsRecords
                : [],

            weightRecords: Array.isArray(parsedData.weightRecords)
                ? parsedData.weightRecords
                : [],

            poseRecords: Array.isArray(parsedData.poseRecords)
                ? parsedData.poseRecords
                : []
        };
    } catch (error) {
        console.error("데이터 불러오기 실패:", error);

        return structuredClone(DEFAULT_APP_DATA);
    }
}

/* ======================================================
   로컬 저장소 저장
====================================================== */

function saveAppData() {
    try {
        localStorage.setItem(
            APP_STORAGE_KEY,
            JSON.stringify(appData)
        );

        return true;
    } catch (error) {
        console.error("데이터 저장 실패:", error);

        showToast(
            "데이터 저장에 실패했어용.",
            "error"
        );

        return false;
    }
}

/* ======================================================
   고유 ID 생성
====================================================== */

function createId(prefix = "item") {
    const randomText = Math.random()
        .toString(36)
        .slice(2, 9);

    return `${prefix}-${Date.now()}-${randomText}`;
}

/* ======================================================
   날짜 형식 변환
====================================================== */

function formatDate(dateValue) {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
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

/* ======================================================
   오늘 날짜 구하기
====================================================== */

function getTodayValue() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* ======================================================
   숫자 안전 변환
====================================================== */

function toNumber(value, defaultValue = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : defaultValue;
}

/* ======================================================
   HTML 특수문자 처리
====================================================== */

function escapeHTML(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* ======================================================
   토스트 알림
====================================================== */

let toastTimer = null;

function showToast(message, type = "default") {
    const toast = $("#toast");

    if (!toast) {
        console.log(message);
        return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.remove(
        "show",
        "success",
        "error"
    );

    if (type === "success") {
        toast.classList.add("success");
    }

    if (type === "error") {
        toast.classList.add("error");
    }

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

/* ======================================================
   확인 모달
====================================================== */

let confirmCallback = null;

function openConfirmModal({
    title = "확인",
    message = "계속 진행할까요?",
    confirmText = "확인",
    onConfirm = null
} = {}) {
    const modal = $("#confirmModal");
    const titleElement =
        $("#confirmModalTitle") ||
        $("#confirmTitle");

    const messageElement =
        $("#confirmModalMessage") ||
        $("#confirmMessage");

    const confirmButton =
        $("#confirmModalConfirm") ||
        $("#confirmButton");

    if (!modal) {
        const result = window.confirm(message);

        if (result && typeof onConfirm === "function") {
            onConfirm();
        }

        return;
    }

    if (titleElement) {
        titleElement.textContent = title;
    }

    if (messageElement) {
        messageElement.textContent = message;
    }

    if (confirmButton) {
        confirmButton.textContent = confirmText;
    }

    confirmCallback = onConfirm;

    modal.classList.add("show");
}

function closeConfirmModal() {
    const modal = $("#confirmModal");

    if (modal) {
        modal.classList.remove("show");
    }

    confirmCallback = null;
}

function initializeConfirmModal() {
    const modal = $("#confirmModal");

    const cancelButton =
        $("#confirmModalCancel") ||
        $("#confirmCancelButton");

    const confirmButton =
        $("#confirmModalConfirm") ||
        $("#confirmButton");

    const closeButton =
        $(".modal-close", modal || document);

    cancelButton?.addEventListener(
        "click",
        closeConfirmModal
    );

    closeButton?.addEventListener(
        "click",
        closeConfirmModal
    );

    confirmButton?.addEventListener(
        "click",
        () => {
            const callback = confirmCallback;

            closeConfirmModal();

            if (typeof callback === "function") {
                callback();
            }
        }
    );

    modal?.addEventListener(
        "click",
        event => {
            if (event.target === modal) {
                closeConfirmModal();
            }
        }
    );
}

/* ======================================================
   페이지 정보
====================================================== */

const PAGE_TITLES = {
    dashboardPage: "대시보드",
    athletePage: "선수 관리",
    sportsPage: "종목 훈련",
    weightPage: "웨이트 훈련",
    posePage: "AI 카메라",
    recordsPage: "훈련 기록",
    reportPage: "보고서",
    settingsPage: "설정"
};

/* ======================================================
   페이지 전환
====================================================== */

function openPage(pageId) {
    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        console.warn(
            `페이지를 찾을 수 없습니다: ${pageId}`
        );

        return;
    }

    $$(".app-page").forEach(page => {
        page.classList.remove("active-page");
    });

    targetPage.classList.add("active-page");

    $$(".menu-button").forEach(button => {
        const buttonPageId =
            button.dataset.page ||
            button.dataset.target;

        button.classList.toggle(
            "active",
            buttonPageId === pageId
        );
    });

    updateHeaderTitle(pageId);
    closeSidebar();

    const pageWrapper = $(".page-wrapper");

    if (pageWrapper) {
        pageWrapper.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    refreshPage(pageId);
}

/* ======================================================
   헤더 제목 변경
====================================================== */

function updateHeaderTitle(pageId) {
    const headerTitle =
        $("#currentPageTitle") ||
        $("#headerPageTitle") ||
        $(".top-header h2");

    if (!headerTitle) {
        return;
    }

    headerTitle.textContent =
        PAGE_TITLES[pageId] ||
        "스포츠과학 훈련센터";
}

/* ======================================================
   메뉴 이벤트
====================================================== */

function initializeNavigation() {
    $$(".menu-button").forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const pageId =
                    button.dataset.page ||
                    button.dataset.target;

                if (pageId) {
                    openPage(pageId);
                }
            }
        );
    });

    $$("[data-open-page]").forEach(button => {
        button.addEventListener(
            "click",
            () => {
                const pageId =
                    button.dataset.openPage;

                if (pageId) {
                    openPage(pageId);
                }
            }
        );
    });
}

/* ======================================================
   모바일 사이드바
====================================================== */

function openSidebar() {
    const sidebar = $(".sidebar");
    const overlay = $(".sidebar-overlay");

    sidebar?.classList.add("open");
    overlay?.classList.add("show");

    document.body.style.overflow = "hidden";
}

function closeSidebar() {
    const sidebar = $(".sidebar");
    const overlay = $(".sidebar-overlay");

    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");

    document.body.style.overflow = "";
}

function toggleSidebar() {
    const sidebar = $(".sidebar");

    if (!sidebar) {
        return;
    }

    if (sidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function initializeSidebar() {
    const menuButton =
        $("#mobileMenuButton") ||
        $(".mobile-menu-button");

    const overlay =
        $("#sidebarOverlay") ||
        $(".sidebar-overlay");

    menuButton?.addEventListener(
        "click",
        toggleSidebar
    );

    overlay?.addEventListener(
        "click",
        closeSidebar
    );

    window.addEventListener(
        "resize",
        () => {
            if (window.innerWidth > 1024) {
                closeSidebar();
            }
        }
    );
}

/* ======================================================
   선택된 선수 찾기
====================================================== */

function getSelectedAthlete() {
    if (!appData.selectedAthleteId) {
        return null;
    }

    return appData.athletes.find(
        athlete =>
            athlete.id === appData.selectedAthleteId
    ) || null;
}

/* ======================================================
   선택 선수 표시
====================================================== */

function updateSelectedAthleteDisplay() {
    const athlete = getSelectedAthlete();

    const selectedNameElements = [
        $("#selectedAthleteName"),
        $("#headerSelectedAthlete"),
        $("#dashboardSelectedAthlete")
    ].filter(Boolean);

    selectedNameElements.forEach(element => {
        element.textContent = athlete
            ? athlete.name
            : "선수 미선택";
    });

    $$("[data-selected-athlete-name]").forEach(
        element => {
            element.textContent = athlete
                ? athlete.name
                : "선수 미선택";
        }
    );
}

/* ======================================================
   페이지 새로고침 함수
====================================================== */

function refreshPage(pageId) {
    updateSelectedAthleteDisplay();

    switch (pageId) {
        case "dashboardPage":
            if (
                typeof window.renderDashboard ===
                "function"
            ) {
                window.renderDashboard();
            }
            break;

        case "athletePage":
            if (
                typeof window.renderAthleteList ===
                "function"
            ) {
                window.renderAthleteList();
            }
            break;

        case "sportsPage":
            if (
                typeof window.renderSportsPage ===
                "function"
            ) {
                window.renderSportsPage();
            }
            break;

        case "weightPage":
            if (
                typeof window.renderWeightPage ===
                "function"
            ) {
                window.renderWeightPage();
            }
            break;

        case "posePage":
            if (
                typeof window.renderPosePage ===
                "function"
            ) {
                window.renderPosePage();
            }
            break;

        case "recordsPage":
            if (
                typeof window.renderRecordsPage ===
                "function"
            ) {
                window.renderRecordsPage();
            }
            break;

        case "reportPage":
            if (
                typeof window.renderReportPage ===
                "function"
            ) {
                window.renderReportPage();
            }
            break;

        case "settingsPage":
            if (
                typeof window.renderSettingsPage ===
                "function"
            ) {
                window.renderSettingsPage();
            }
            break;
    }
}

/* ======================================================
   키보드 공통 이벤트
====================================================== */

function initializeKeyboardEvents() {
    document.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                closeConfirmModal();
                closeSidebar();

                const imageModal =
                    $("#imagePreviewModal");

                imageModal?.classList.remove("show");
            }
        }
    );
}

/* ======================================================
   앱 시작
====================================================== */

function initializeApp() {
    initializeNavigation();
    initializeSidebar();
    initializeConfirmModal();
    initializeKeyboardEvents();

    updateSelectedAthleteDisplay();

    const activePage =
        $(".app-page.active-page");

    if (activePage) {
        refreshPage(activePage.id);
        updateHeaderTitle(activePage.id);
    } else {
        openPage("dashboardPage");
    }

    console.log(
        "설천고 스포츠과학 훈련센터가 시작됐어용."
    );
}

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

/* ======================================================
   다른 JS 파일에서 사용할 공통 기능
====================================================== */

window.appData = appData;
window.saveAppData = saveAppData;
window.createId = createId;
window.formatDate = formatDate;
window.getTodayValue = getTodayValue;
window.toNumber = toNumber;
window.escapeHTML = escapeHTML;
window.showToast = showToast;
window.openConfirmModal = openConfirmModal;
window.closeConfirmModal = closeConfirmModal;
window.openPage = openPage;
window.getSelectedAthlete = getSelectedAthlete;
window.updateSelectedAthleteDisplay =
    updateSelectedAthleteDisplay;
    /* ======================================================
   app.js 2번
   선수 등록 · 선택 · 삭제 · 목록 출력
====================================================== */

/* ======================================================
   선수 입력 요소 찾기
====================================================== */

function getAthleteFormElements() {
    return {
        form:
            $("#athleteForm") ||
            $(".athlete-form"),

        name:
            $("#athleteName") ||
            $("#athleteNameInput"),

        studentNumber:
            $("#athleteStudentNumber") ||
            $("#studentNumber"),

        grade:
            $("#athleteGrade") ||
            $("#athleteGradeSelect"),

        classNumber:
            $("#athleteClass") ||
            $("#athleteClassNumber"),

        sport:
            $("#athleteSport") ||
            $("#athleteSportSelect"),

        gender:
            $("#athleteGender") ||
            $("#athleteGenderSelect"),

        birthDate:
            $("#athleteBirthDate") ||
            $("#athleteBirthday"),

        height:
            $("#athleteHeight") ||
            $("#heightInput"),

        weight:
            $("#athleteWeight") ||
            $("#weightInput"),

        memo:
            $("#athleteMemo") ||
            $("#athleteNote"),

        submitButton:
            $("#addAthleteButton") ||
            $("#athleteSubmitButton")
    };
}

/* ======================================================
   선수 입력값 가져오기
====================================================== */

function getAthleteFormData() {
    const elements = getAthleteFormElements();

    return {
        name: elements.name?.value.trim() || "",

        studentNumber:
            elements.studentNumber?.value.trim() || "",

        grade:
            elements.grade?.value || "",

        classNumber:
            elements.classNumber?.value.trim() || "",

        sport:
            elements.sport?.value.trim() || "",

        gender:
            elements.gender?.value || "",

        birthDate:
            elements.birthDate?.value || "",

        height:
            toNumber(elements.height?.value),

        weight:
            toNumber(elements.weight?.value),

        memo:
            elements.memo?.value.trim() || ""
    };
}

/* ======================================================
   선수 입력값 검사
====================================================== */

function validateAthleteData(data) {
    if (!data.name) {
        showToast(
            "선수 이름을 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.height < 0 || data.height > 250) {
        showToast(
            "키를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    if (data.weight < 0 || data.weight > 300) {
        showToast(
            "몸무게를 올바르게 입력해 주세요용.",
            "error"
        );

        return false;
    }

    return true;
}

/* ======================================================
   선수 등록
====================================================== */

function addAthlete(event) {
    event?.preventDefault();

    const athleteData = getAthleteFormData();

    if (!validateAthleteData(athleteData)) {
        return;
    }

    const duplicatedStudentNumber =
        athleteData.studentNumber &&
        appData.athletes.some(
            athlete =>
                athlete.studentNumber ===
                athleteData.studentNumber
        );

    if (duplicatedStudentNumber) {
        showToast(
            "같은 학번의 선수가 이미 등록되어 있어용.",
            "error"
        );

        return;
    }

    const newAthlete = {
        id: createId("athlete"),

        ...athleteData,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    appData.athletes.unshift(newAthlete);

    if (!appData.selectedAthleteId) {
        appData.selectedAthleteId = newAthlete.id;
    }

    saveAppData();
    resetAthleteForm();
    renderAthleteList();
    updateSelectedAthleteDisplay();
    renderDashboard();

    showToast(
        `${newAthlete.name} 선수를 등록했어용.`,
        "success"
    );
}

/* ======================================================
   선수 등록 폼 초기화
====================================================== */

function resetAthleteForm() {
    const elements = getAthleteFormElements();

    if (elements.form) {
        elements.form.reset();
    } else {
        [
            elements.name,
            elements.studentNumber,
            elements.grade,
            elements.classNumber,
            elements.sport,
            elements.gender,
            elements.birthDate,
            elements.height,
            elements.weight,
            elements.memo
        ].forEach(element => {
            if (element) {
                element.value = "";
            }
        });
    }
}

/* ======================================================
   선수 선택
====================================================== */

function selectAthlete(athleteId) {
    const athlete = appData.athletes.find(
        item => item.id === athleteId
    );

    if (!athlete) {
        showToast(
            "선수 정보를 찾지 못했어용.",
            "error"
        );

        return;
    }

    appData.selectedAthleteId = athleteId;

    saveAppData();
    updateSelectedAthleteDisplay();
    renderAthleteList();
    renderDashboard();

    if (
        typeof window.renderSportsPage ===
        "function"
    ) {
        window.renderSportsPage();
    }

    if (
        typeof window.renderWeightPage ===
        "function"
    ) {
        window.renderWeightPage();
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

    showToast(
        `${athlete.name} 선수를 선택했어용.`,
        "success"
    );
}

/* ======================================================
   선수 삭제 요청
====================================================== */

function requestDeleteAthlete(athleteId) {
    const athlete = appData.athletes.find(
        item => item.id === athleteId
    );

    if (!athlete) {
        return;
    }

    openConfirmModal({
        title: "선수 삭제",
        message:
            `${athlete.name} 선수와 관련된 훈련 기록을 ` +
            "모두 삭제할까요?",

        confirmText: "삭제",

        onConfirm: () => {
            deleteAthlete(athleteId);
        }
    });
}

/* ======================================================
   선수 및 관련 기록 삭제
====================================================== */

function deleteAthlete(athleteId) {
    const athlete = appData.athletes.find(
        item => item.id === athleteId
    );

    if (!athlete) {
        return;
    }

    appData.athletes = appData.athletes.filter(
        item => item.id !== athleteId
    );

    appData.sportsRecords =
        appData.sportsRecords.filter(
            record =>
                record.athleteId !== athleteId
        );

    appData.weightRecords =
        appData.weightRecords.filter(
            record =>
                record.athleteId !== athleteId
        );

    appData.poseRecords =
        appData.poseRecords.filter(
            record =>
                record.athleteId !== athleteId
        );

    if (
        appData.selectedAthleteId === athleteId
    ) {
        appData.selectedAthleteId =
            appData.athletes[0]?.id || null;
    }

    saveAppData();
    renderAthleteList();
    updateSelectedAthleteDisplay();
    renderDashboard();

    showToast(
        `${athlete.name} 선수를 삭제했어용.`,
        "success"
    );
}

/* ======================================================
   선수 정보 수정용 폼 채우기
====================================================== */

let editingAthleteId = null;

function startEditAthlete(athleteId) {
    const athlete = appData.athletes.find(
        item => item.id === athleteId
    );

    if (!athlete) {
        return;
    }

    editingAthleteId = athleteId;

    const elements = getAthleteFormElements();

    if (elements.name) {
        elements.name.value = athlete.name || "";
    }

    if (elements.studentNumber) {
        elements.studentNumber.value =
            athlete.studentNumber || "";
    }

    if (elements.grade) {
        elements.grade.value = athlete.grade || "";
    }

    if (elements.classNumber) {
        elements.classNumber.value =
            athlete.classNumber || "";
    }

    if (elements.sport) {
        elements.sport.value = athlete.sport || "";
    }

    if (elements.gender) {
        elements.gender.value = athlete.gender || "";
    }

    if (elements.birthDate) {
        elements.birthDate.value =
            athlete.birthDate || "";
    }

    if (elements.height) {
        elements.height.value =
            athlete.height || "";
    }

    if (elements.weight) {
        elements.weight.value =
            athlete.weight || "";
    }

    if (elements.memo) {
        elements.memo.value = athlete.memo || "";
    }

    if (elements.submitButton) {
        elements.submitButton.textContent =
            "선수 정보 수정";
    }

    elements.name?.focus();

    showToast(
        "선수 정보를 수정한 뒤 저장해 주세요용."
    );
}

/* ======================================================
   선수 정보 수정 저장
====================================================== */

function updateAthlete(event) {
    event?.preventDefault();

    if (!editingAthleteId) {
        addAthlete(event);
        return;
    }

    const athleteData = getAthleteFormData();

    if (!validateAthleteData(athleteData)) {
        return;
    }

    const athleteIndex =
        appData.athletes.findIndex(
            athlete =>
                athlete.id === editingAthleteId
        );

    if (athleteIndex === -1) {
        editingAthleteId = null;
        return;
    }

    const duplicatedStudentNumber =
        athleteData.studentNumber &&
        appData.athletes.some(
            athlete =>
                athlete.id !== editingAthleteId &&
                athlete.studentNumber ===
                    athleteData.studentNumber
        );

    if (duplicatedStudentNumber) {
        showToast(
            "같은 학번의 선수가 이미 등록되어 있어용.",
            "error"
        );

        return;
    }

    appData.athletes[athleteIndex] = {
        ...appData.athletes[athleteIndex],
        ...athleteData,
        updatedAt: new Date().toISOString()
    };

    const updatedName =
        appData.athletes[athleteIndex].name;

    editingAthleteId = null;

    saveAppData();
    resetAthleteForm();
    resetAthleteSubmitButton();
    renderAthleteList();
    updateSelectedAthleteDisplay();
    renderDashboard();

    showToast(
        `${updatedName} 선수 정보를 수정했어용.`,
        "success"
    );
}

/* ======================================================
   등록 버튼 문구 초기화
====================================================== */

function resetAthleteSubmitButton() {
    const elements = getAthleteFormElements();

    if (elements.submitButton) {
        elements.submitButton.textContent =
            "선수 등록";
    }
}

/* ======================================================
   선수 수정 취소
====================================================== */

function cancelAthleteEdit() {
    editingAthleteId = null;

    resetAthleteForm();
    resetAthleteSubmitButton();

    showToast(
        "수정을 취소했어용."
    );
}

/* ======================================================
   신체질량지수 계산
====================================================== */

function calculateBMI(height, weight) {
    const heightMeter = toNumber(height) / 100;
    const weightNumber = toNumber(weight);

    if (
        heightMeter <= 0 ||
        weightNumber <= 0
    ) {
        return null;
    }

    return weightNumber /
        (heightMeter * heightMeter);
}

/* ======================================================
   선수 카드 HTML 생성
====================================================== */

function createAthleteCardHTML(athlete) {
    const isSelected =
        athlete.id ===
        appData.selectedAthleteId;

    const bmi = calculateBMI(
        athlete.height,
        athlete.weight
    );

    const firstCharacter =
        athlete.name?.trim().charAt(0) || "선";

    const gradeText = athlete.grade
        ? `${athlete.grade}학년`
        : "학년 미입력";

    const classText = athlete.classNumber
        ? `${athlete.classNumber}반`
        : "";

    const studentText =
        [gradeText, classText]
            .filter(Boolean)
            .join(" ");

    return `
        <article
            class="athlete-card ${
                isSelected ? "selected" : ""
            }"
            data-athlete-id="${
                escapeHTML(athlete.id)
            }"
        >
            <div class="athlete-card-header">

                <div class="athlete-profile">

                    <div class="athlete-avatar">
                        ${escapeHTML(firstCharacter)}
                    </div>

                    <div>
                        <div class="athlete-name">
                            ${escapeHTML(athlete.name)}
                        </div>

                        <div class="athlete-sub-info">
                            ${escapeHTML(studentText)}
                            ${
                                athlete.sport
                                    ? ` · ${escapeHTML(
                                        athlete.sport
                                    )}`
                                    : ""
                            }
                        </div>
                    </div>

                </div>

                ${
                    isSelected
                        ? `
                            <span
                                class="status-badge status-on"
                            >
                                선택됨
                            </span>
                        `
                        : ""
                }

            </div>

            <div class="athlete-meta-grid">

                <div class="athlete-meta-item">
                    <span>학번</span>
                    <strong>
                        ${
                            escapeHTML(
                                athlete.studentNumber
                            ) || "-"
                        }
                    </strong>
                </div>

                <div class="athlete-meta-item">
                    <span>성별</span>
                    <strong>
                        ${
                            escapeHTML(
                                athlete.gender
                            ) || "-"
                        }
                    </strong>
                </div>

                <div class="athlete-meta-item">
                    <span>키</span>
                    <strong>
                        ${
                            athlete.height
                                ? `${athlete.height} cm`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="athlete-meta-item">
                    <span>몸무게</span>
                    <strong>
                        ${
                            athlete.weight
                                ? `${athlete.weight} kg`
                                : "-"
                        }
                    </strong>
                </div>

                <div class="athlete-meta-item">
                    <span>BMI</span>
                    <strong>
                        ${
                            bmi
                                ? bmi.toFixed(1)
                                : "-"
                        }
                    </strong>
                </div>

                <div class="athlete-meta-item">
                    <span>생년월일</span>
                    <strong>
                        ${formatDate(
                            athlete.birthDate
                        )}
                    </strong>
                </div>

            </div>

            ${
                athlete.memo
                    ? `
                        <p
                            class="record-description mt-10"
                        >
                            ${escapeHTML(athlete.memo)}
                        </p>
                    `
                    : ""
            }

            <div
                class="athlete-card-actions mt-20"
            >
                <button
                    type="button"
                    class="athlete-select-button"
                    data-athlete-action="select"
                    data-athlete-id="${
                        escapeHTML(athlete.id)
                    }"
                >
                    ${
                        isSelected
                            ? "현재 선수"
                            : "선택"
                    }
                </button>

                <button
                    type="button"
                    class="athlete-select-button"
                    data-athlete-action="edit"
                    data-athlete-id="${
                        escapeHTML(athlete.id)
                    }"
                >
                    수정
                </button>

                <button
                    type="button"
                    class="athlete-delete-button"
                    data-athlete-action="delete"
                    data-athlete-id="${
                        escapeHTML(athlete.id)
                    }"
                >
                    삭제
                </button>
            </div>

        </article>
    `;
}

/* ======================================================
   선수 목록 출력
====================================================== */

function renderAthleteList() {
    const list =
        $("#athleteList") ||
        $(".athlete-list");

    if (!list) {
        return;
    }

    if (appData.athletes.length === 0) {
        list.innerHTML = `
            <div class="empty-box">
                <div class="empty-icon">👤</div>

                <p>
                    등록된 선수가 없어용.<br>
                    위 입력창에서 첫 선수를 등록해 주세요용.
                </p>
            </div>
        `;

        return;
    }

    list.innerHTML = appData.athletes
        .map(createAthleteCardHTML)
        .join("");
}

/* ======================================================
   선수 목록 버튼 이벤트
====================================================== */

function handleAthleteListClick(event) {
    const actionButton =
        event.target.closest(
            "[data-athlete-action]"
        );

    if (!actionButton) {
        return;
    }

    const athleteId =
        actionButton.dataset.athleteId;

    const action =
        actionButton.dataset.athleteAction;

    if (!athleteId) {
        return;
    }

    switch (action) {
        case "select":
            selectAthlete(athleteId);
            break;

        case "edit":
            startEditAthlete(athleteId);
            break;

        case "delete":
            requestDeleteAthlete(athleteId);
            break;
    }
}

/* ======================================================
   대시보드 기본 정보 출력
====================================================== */

function renderDashboard() {
    const selectedAthlete =
        getSelectedAthlete();

    const totalAthletes =
        appData.athletes.length;

    const totalSportsRecords =
        appData.sportsRecords.length;

    const totalWeightRecords =
        appData.weightRecords.length;

    const totalPoseRecords =
        appData.poseRecords.length;

    const totalRecords =
        totalSportsRecords +
        totalWeightRecords +
        totalPoseRecords;

    const values = {
        totalAthletes,
        totalRecords,
        totalSportsRecords,
        totalWeightRecords,
        totalPoseRecords
    };

    Object.entries(values).forEach(
        ([key, value]) => {
            $$(`[data-dashboard-value="${key}"]`)
                .forEach(element => {
                    element.textContent = value;
                });
        }
    );

    const directElements = {
        totalAthletes:
            $("#totalAthletes"),

        totalRecords:
            $("#totalRecords"),

        totalSportsRecords:
            $("#totalSportsRecords"),

        totalWeightRecords:
            $("#totalWeightRecords"),

        totalPoseRecords:
            $("#totalPoseRecords")
    };

    Object.entries(directElements).forEach(
        ([key, element]) => {
            if (element) {
                element.textContent = values[key];
            }
        }
    );

    const athleteStatus =
        $("#dashboardAthleteStatus");

    if (athleteStatus) {
        athleteStatus.textContent =
            selectedAthlete
                ? `${selectedAthlete.name} 선수 분석 중`
                : "선수를 먼저 선택해 주세요용.";
    }

    renderRecentRecords();
}

/* ======================================================
   최근 기록 통합
====================================================== */

function getAllTrainingRecords() {
    const sportsRecords =
        appData.sportsRecords.map(record => ({
            ...record,
            recordType: "sports",
            recordTypeLabel: "종목 훈련"
        }));

    const weightRecords =
        appData.weightRecords.map(record => ({
            ...record,
            recordType: "weight",
            recordTypeLabel: "웨이트"
        }));

    const poseRecords =
        appData.poseRecords.map(record => ({
            ...record,
            recordType: "pose",
            recordTypeLabel: "AI 분석"
        }));

    return [
        ...sportsRecords,
        ...weightRecords,
        ...poseRecords
    ].sort((a, b) => {
        const dateA = new Date(
            a.createdAt || a.date || 0
        ).getTime();

        const dateB = new Date(
            b.createdAt || b.date || 0
        ).getTime();

        return dateB - dateA;
    });
}

/* ======================================================
   최근 기록 출력
====================================================== */

function renderRecentRecords() {
    const container =
        $("#recentTrainingList") ||
        $("#dashboardRecentRecords");

    if (!container) {
        return;
    }

    const records =
        getAllTrainingRecords().slice(0, 5);

    if (records.length === 0) {
        container.innerHTML = `
            <div class="empty-box">
                <div class="empty-icon">📊</div>

                <p>
                    아직 저장된 훈련 기록이 없어용.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = records
        .map(record => {
            const athlete =
                appData.athletes.find(
                    item =>
                        item.id ===
                        record.athleteId
                );

            const title =
                record.title ||
                record.exercise ||
                record.sport ||
                record.recordTypeLabel;

            const date =
                record.date ||
                record.createdAt;

            return `
                <div class="record-item">

                    <div class="record-main">

                        <div class="record-title-row">
                            <span
                                class="record-type ${
                                    record.recordType
                                }"
                            >
                                ${
                                    escapeHTML(
                                        record.recordTypeLabel
                                    )
                                }
                            </span>

                            <h4>
                                ${escapeHTML(title)}
                            </h4>

                            <span class="record-date">
                                ${formatDate(date)}
                            </span>
                        </div>

                        <p class="record-description">
                            ${
                                athlete
                                    ? `${escapeHTML(
                                        athlete.name
                                    )} 선수`
                                    : "선수 정보 없음"
                            }
                        </p>

                    </div>

                </div>
            `;
        })
        .join("");
}

/* ======================================================
   선수 관리 이벤트 초기화
====================================================== */

function initializeAthleteManagement() {
    const elements =
        getAthleteFormElements();

    if (elements.form) {
        elements.form.addEventListener(
            "submit",
            event => {
                if (editingAthleteId) {
                    updateAthlete(event);
                } else {
                    addAthlete(event);
                }
            }
        );
    } else {
        elements.submitButton
            ?.addEventListener(
                "click",
                event => {
                    if (editingAthleteId) {
                        updateAthlete(event);
                    } else {
                        addAthlete(event);
                    }
                }
            );
    }

    const athleteList =
        $("#athleteList") ||
        $(".athlete-list");

    athleteList?.addEventListener(
        "click",
        handleAthleteListClick
    );

    const cancelButton =
        $("#cancelAthleteEditButton");

    cancelButton?.addEventListener(
        "click",
        cancelAthleteEdit
    );

    renderAthleteList();
    renderDashboard();
}

/* ======================================================
   DOM 준비 후 선수 기능 시작
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeAthleteManagement
);

/* ======================================================
   다른 파일에서 사용할 함수
====================================================== */

window.addAthlete = addAthlete;
window.selectAthlete = selectAthlete;
window.deleteAthlete = deleteAthlete;
window.requestDeleteAthlete =
    requestDeleteAthlete;
window.startEditAthlete =
    startEditAthlete;
window.cancelAthleteEdit =
    cancelAthleteEdit;
window.renderAthleteList =
    renderAthleteList;
window.renderDashboard =
    renderDashboard;
window.getAllTrainingRecords =
    getAllTrainingRecords;
    /* ======================================================
   app.js 3번
   설정 저장 · 데이터 초기화 · 백업 · 복원
====================================================== */

/* ======================================================
   설정 요소 찾기
====================================================== */

function getSettingsElements() {
    return {
        soundSwitch:
            $("#soundSetting") ||
            $("#soundSwitch") ||
            $("[data-setting='sound']"),

        autoSaveSwitch:
            $("#autoSaveSetting") ||
            $("#autoSaveSwitch") ||
            $("[data-setting='autoSave']"),

        darkModeSwitch:
            $("#darkModeSetting") ||
            $("#darkModeSwitch") ||
            $("[data-setting='darkMode']"),

        resetButton:
            $("#resetAllDataButton") ||
            $("#clearAllDataButton"),

        exportButton:
            $("#exportDataButton") ||
            $("#backupDataButton"),

        importButton:
            $("#importDataButton") ||
            $("#restoreDataButton"),

        importInput:
            $("#importDataInput") ||
            $("#restoreFileInput")
    };
}

/* ======================================================
   설정 스위치 화면 반영
====================================================== */

function renderSettingsPage() {
    const elements = getSettingsElements();

    setSwitchState(
        elements.soundSwitch,
        appData.settings.sound
    );

    setSwitchState(
        elements.autoSaveSwitch,
        appData.settings.autoSave
    );

    setSwitchState(
        elements.darkModeSwitch,
        appData.settings.darkMode
    );

    document.body.classList.toggle(
        "light-mode",
        !appData.settings.darkMode
    );
}

/* ======================================================
   스위치 상태 적용
====================================================== */

function setSwitchState(element, isActive) {
    if (!element) {
        return;
    }

    element.classList.toggle(
        "active",
        Boolean(isActive)
    );

    element.setAttribute(
        "aria-pressed",
        String(Boolean(isActive))
    );
}

/* ======================================================
   설정 변경
====================================================== */

function toggleSetting(settingName) {
    if (
        !Object.prototype.hasOwnProperty.call(
            appData.settings,
            settingName
        )
    ) {
        return;
    }

    appData.settings[settingName] =
        !appData.settings[settingName];

    saveAppData();
    renderSettingsPage();

    const settingLabels = {
        sound: "효과음",
        autoSave: "자동 저장",
        darkMode: "다크 모드"
    };

    const stateText =
        appData.settings[settingName]
            ? "켜졌어용."
            : "꺼졌어용.";

    showToast(
        `${settingLabels[settingName]}가 ${stateText}`,
        "success"
    );
}

/* ======================================================
   효과음 재생
====================================================== */

function playUiSound(type = "click") {
    if (!appData.settings.sound) {
        return;
    }

    try {
        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        const audioContext =
            new AudioContextClass();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        const frequencyMap = {
            click: 440,
            success: 660,
            error: 220
        };

        oscillator.frequency.value =
            frequencyMap[type] || 440;

        oscillator.type = "sine";

        gain.gain.setValueAtTime(
            0.05,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioContext.currentTime + 0.12
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(
            audioContext.currentTime + 0.12
        );

        oscillator.addEventListener(
            "ended",
            () => {
                audioContext.close();
            }
        );
    } catch (error) {
        console.warn(
            "효과음을 재생하지 못했어용:",
            error
        );
    }
}

/* ======================================================
   JSON 백업 파일 생성
====================================================== */

function exportAppData() {
    try {
        const backupData = {
            appName: "설천고 스포츠과학 훈련센터",
            version: "1.0",
            exportedAt: new Date().toISOString(),
            data: appData
        };

        const jsonText = JSON.stringify(
            backupData,
            null,
            2
        );

        const blob = new Blob(
            [jsonText],
            {
                type: "application/json"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        const dateText =
            getTodayValue().replaceAll("-", "");

        link.href = url;
        link.download =
            `설천고_스포츠과학_백업_${dateText}.json`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);

        playUiSound("success");

        showToast(
            "데이터 백업 파일을 만들었어용.",
            "success"
        );
    } catch (error) {
        console.error(
            "백업 생성 실패:",
            error
        );

        playUiSound("error");

        showToast(
            "백업 파일 생성에 실패했어용.",
            "error"
        );
    }
}

/* ======================================================
   복원 파일 선택
====================================================== */

function openImportFilePicker() {
    const input =
        getSettingsElements().importInput;

    if (!input) {
        showToast(
            "복원 파일 입력창을 찾을 수 없어용.",
            "error"
        );

        return;
    }

    input.click();
}

/* ======================================================
   백업 데이터 구조 검사
====================================================== */

function validateImportedData(parsedFile) {
    const importedData =
        parsedFile?.data || parsedFile;

    if (
        !importedData ||
        typeof importedData !== "object"
    ) {
        return null;
    }

    const hasValidArrays =
        Array.isArray(importedData.athletes) &&
        Array.isArray(importedData.sportsRecords) &&
        Array.isArray(importedData.weightRecords) &&
        Array.isArray(importedData.poseRecords);

    if (!hasValidArrays) {
        return null;
    }

    return {
        ...structuredClone(DEFAULT_APP_DATA),
        ...importedData,

        settings: {
            ...DEFAULT_APP_DATA.settings,
            ...(importedData.settings || {})
        },

        athletes: importedData.athletes,
        sportsRecords: importedData.sportsRecords,
        weightRecords: importedData.weightRecords,
        poseRecords: importedData.poseRecords
    };
}

/* ======================================================
   데이터 복원
====================================================== */

function importAppData(event) {
    const file =
        event.target.files?.[0];

    if (!file) {
        return;
    }

    if (
        !file.name.toLowerCase().endsWith(".json")
    ) {
        showToast(
            "JSON 백업 파일만 선택해 주세요용.",
            "error"
        );

        event.target.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        try {
            const parsedFile =
                JSON.parse(reader.result);

            const validatedData =
                validateImportedData(parsedFile);

            if (!validatedData) {
                throw new Error(
                    "올바르지 않은 데이터 구조"
                );
            }

            openConfirmModal({
                title: "데이터 복원",
                message:
                    "현재 데이터가 백업 파일 내용으로 바뀌어용. 계속할까요?",
                confirmText: "복원",
                onConfirm: () => {
                    restoreImportedData(
                        validatedData
                    );
                }
            });
        } catch (error) {
            console.error(
                "데이터 복원 실패:",
                error
            );

            playUiSound("error");

            showToast(
                "올바른 백업 파일이 아니에용.",
                "error"
            );
        } finally {
            event.target.value = "";
        }
    };

    reader.onerror = () => {
        showToast(
            "파일을 읽는 중 문제가 발생했어용.",
            "error"
        );

        event.target.value = "";
    };

    reader.readAsText(file);
}

/* ======================================================
   복원 데이터 적용
====================================================== */

function restoreImportedData(importedData) {
    appData.athletes =
        importedData.athletes;

    appData.selectedAthleteId =
        importedData.selectedAthleteId;

    appData.sportsRecords =
        importedData.sportsRecords;

    appData.weightRecords =
        importedData.weightRecords;

    appData.poseRecords =
        importedData.poseRecords;

    appData.settings = {
        ...DEFAULT_APP_DATA.settings,
        ...(importedData.settings || {})
    };

    const selectedAthleteExists =
        appData.athletes.some(
            athlete =>
                athlete.id ===
                appData.selectedAthleteId
        );

    if (!selectedAthleteExists) {
        appData.selectedAthleteId =
            appData.athletes[0]?.id || null;
    }

    saveAppData();
    refreshEntireApp();

    playUiSound("success");

    showToast(
        "백업 데이터를 복원했어용.",
        "success"
    );
}

/* ======================================================
   모든 데이터 초기화 요청
====================================================== */

function requestResetAllData() {
    openConfirmModal({
        title: "전체 데이터 초기화",
        message:
            "등록된 선수와 모든 훈련 기록이 삭제돼용. 정말 초기화할까요?",
        confirmText: "전체 삭제",
        onConfirm: resetAllData
    });
}

/* ======================================================
   모든 데이터 초기화
====================================================== */

function resetAllData() {
    const freshData =
        structuredClone(DEFAULT_APP_DATA);

    appData.athletes =
        freshData.athletes;

    appData.selectedAthleteId =
        freshData.selectedAthleteId;

    appData.sportsRecords =
        freshData.sportsRecords;

    appData.weightRecords =
        freshData.weightRecords;

    appData.poseRecords =
        freshData.poseRecords;

    appData.settings =
        freshData.settings;

    localStorage.removeItem(
        APP_STORAGE_KEY
    );

    saveAppData();
    refreshEntireApp();

    playUiSound("success");

    showToast(
        "전체 데이터를 초기화했어용.",
        "success"
    );
}

/* ======================================================
   앱 전체 화면 새로고침
====================================================== */

function refreshEntireApp() {
    updateSelectedAthleteDisplay();

    if (
        typeof window.renderAthleteList ===
        "function"
    ) {
        window.renderAthleteList();
    }

    if (
        typeof window.renderDashboard ===
        "function"
    ) {
        window.renderDashboard();
    }

    if (
        typeof window.renderSportsPage ===
        "function"
    ) {
        window.renderSportsPage();
    }

    if (
        typeof window.renderWeightPage ===
        "function"
    ) {
        window.renderWeightPage();
    }

    if (
        typeof window.renderPosePage ===
        "function"
    ) {
        window.renderPosePage();
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

    renderSettingsPage();
}

/* ======================================================
   설정 이벤트 초기화
====================================================== */

function initializeSettings() {
    const elements =
        getSettingsElements();

    elements.soundSwitch
        ?.addEventListener(
            "click",
            () => {
                toggleSetting("sound");
            }
        );

    elements.autoSaveSwitch
        ?.addEventListener(
            "click",
            () => {
                toggleSetting("autoSave");
            }
        );

    elements.darkModeSwitch
        ?.addEventListener(
            "click",
            () => {
                toggleSetting("darkMode");
            }
        );

    elements.resetButton
        ?.addEventListener(
            "click",
            requestResetAllData
        );

    elements.exportButton
        ?.addEventListener(
            "click",
            exportAppData
        );

    elements.importButton
        ?.addEventListener(
            "click",
            openImportFilePicker
        );

    elements.importInput
        ?.addEventListener(
            "change",
            importAppData
        );

    renderSettingsPage();
}

/* ======================================================
   공통 버튼 효과음
====================================================== */

function initializeButtonSounds() {
    document.addEventListener(
        "click",
        event => {
            const button =
                event.target.closest("button");

            if (
                !button ||
                button.disabled
            ) {
                return;
            }

            playUiSound("click");
        }
    );
}

/* ======================================================
   앱 설정 기능 시작
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initializeSettings();
        initializeButtonSounds();
    }
);

/* ======================================================
   다른 파일에서 사용할 기능
====================================================== */

window.renderSettingsPage =
    renderSettingsPage;

window.toggleSetting =
    toggleSetting;

window.playUiSound =
    playUiSound;

window.exportAppData =
    exportAppData;

window.importAppData =
    importAppData;

window.requestResetAllData =
    requestResetAllData;

window.refreshEntireApp =
    refreshEntireApp;