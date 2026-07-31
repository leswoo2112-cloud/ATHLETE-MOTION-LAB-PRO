/* ======================================================
   설천고 스포츠과학 훈련센터
   app.js 1-1
   기본 설정 / LocalStorage / 공통 유틸
====================================================== */

"use strict";

/* ======================================================
   앱 정보
====================================================== */

const APP_NAME = "설천고 스포츠과학 훈련센터";
const APP_VERSION = "1.0.0";
const STORAGE_KEY = "seolcheon_sports_science";

/* ======================================================
   기본 데이터
====================================================== */

const DEFAULT_APP_DATA = {

    athletes: [],

    selectedAthleteId: null,

    sportsRecords: [],

    weightRecords: [],

    poseRecords: [],

    settings: {

        darkMode: true,

        autoSave: true,

        sound: true

    }

};

/* ======================================================
   앱 데이터
====================================================== */

let appData = loadAppData();

/* ======================================================
   DOM Helper
====================================================== */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

/* ======================================================
   LocalStorage
====================================================== */

function loadAppData() {

    try{

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if(!saved){

            return structuredClone(
                DEFAULT_APP_DATA
            );

        }

        const parsed = JSON.parse(saved);

        return {

            ...structuredClone(DEFAULT_APP_DATA),

            ...parsed,

            settings:{

                ...DEFAULT_APP_DATA.settings,

                ...(parsed.settings || {})

            }

        };

    }

    catch(error){

        console.error(error);

        return structuredClone(
            DEFAULT_APP_DATA
        );

    }

}

/* ======================================================
   저장
====================================================== */

function saveAppData(){

    try{

        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(appData)

        );

        return true;

    }

    catch(error){

        console.error(error);

        showToast(
            "저장 실패",
            "error"
        );

        return false;

    }

}

/* ======================================================
   UUID
====================================================== */

function createId(prefix="item"){

    return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2,8)}`;

}

/* ======================================================
   숫자 변환
====================================================== */

function toNumber(value, def=0){

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : def;

}

/* ======================================================
   오늘 날짜
====================================================== */

function getTodayValue(){

    const date = new Date();

    return date.toISOString()
        .slice(0,10);

}

/* ======================================================
   날짜 표시
====================================================== */

function formatDate(value){

    if(!value){

        return "-";

    }

    const date = new Date(value);

    if(isNaN(date)){

        return value;

    }

    return new Intl.DateTimeFormat(

        "ko-KR",

        {

            year:"numeric",

            month:"2-digit",

            day:"2-digit"

        }

    ).format(date);

}

/* ======================================================
   HTML Escape
====================================================== */

function escapeHTML(text=""){

    return String(text)

    .replaceAll("&","&amp;")

    .replaceAll("<","&lt;")

    .replaceAll(">","&gt;")

    .replaceAll('"',"&quot;")

    .replaceAll("'","&#039;");

}

/* ======================================================
   Toast
====================================================== */

let toastTimer = null;

function showToast(

    message,

    type="default"

){

    const toast = $("#toast");

    if(!toast){

        console.log(message);

        return;

    }

    clearTimeout(toastTimer);

    toast.className="";

    toast.id="toast";

    toast.textContent=message;

    if(type==="success"){

        toast.classList.add(
            "success"
        );

    }

    if(type==="error"){

        toast.classList.add(
            "error"
        );

    }

    requestAnimationFrame(()=>{

        toast.classList.add(
            "show"
        );

    });

    toastTimer=setTimeout(()=>{

        toast.classList.remove(
            "show"
        );

    },2500);

}

/* ======================================================
   선택 선수
====================================================== */

function getSelectedAthlete(){

    if(!appData.selectedAthleteId){

        return null;

    }

    return appData.athletes.find(

        athlete=>

        athlete.id===

        appData.selectedAthleteId

    ) || null;

}

/* ======================================================
   자동 저장
====================================================== */

function autoSave(){

    if(

        appData.settings.autoSave

    ){

        saveAppData();

    }

}

/* ======================================================
   로그
====================================================== */

function log(...args){

    console.log(

        `[${APP_NAME}]`,

        ...args

    );

}

/* ======================================================
   앱 상태
====================================================== */

const appState={

    charts:{},

    editingAthleteId:null,

    currentPage:"dashboardPage",

    loading:false

};
/* ======================================================
   app.js 1-2
   페이지 이동 / 사이드바 / 헤더 / Confirm Modal
====================================================== */

/* ======================================================
   페이지 제목
====================================================== */

const PAGE_TITLES = {

    dashboardPage : "대시보드",

    athletePage : "선수 관리",

    sportsPage : "종목 훈련",

    weightPage : "웨이트 훈련",

    posePage : "AI 자세 분석",

    recordsPage : "훈련 기록",

    reportPage : "보고서",

    settingsPage : "설정"

};

/* ======================================================
   헤더 제목
====================================================== */

function updateHeaderTitle(pageId){

    const title =

        $("#currentPageTitle") ||

        $("#headerTitle") ||

        $(".header-title");

    if(!title){

        return;

    }

    title.textContent=

        PAGE_TITLES[pageId] ||

        APP_NAME;

}

/* ======================================================
   페이지 새로고침
====================================================== */

function refreshPage(pageId){

    updateSelectedAthleteDisplay();

    switch(pageId){

        case "dashboardPage":

            window.renderDashboard?.();

            break;

        case "athletePage":

            window.renderAthleteList?.();

            break;

        case "sportsPage":

            window.renderSportsPage?.();

            break;

        case "weightPage":

            window.renderWeightPage?.();

            break;

        case "posePage":

            window.renderPosePage?.();

            break;

        case "recordsPage":

            window.renderRecordsPage?.();

            break;

        case "reportPage":

            window.renderReportPage?.();

            break;

        case "settingsPage":

            window.renderSettingsPage?.();

            break;

    }

}

/* ======================================================
   페이지 이동
====================================================== */

function openPage(pageId){

    const page=document.getElementById(pageId);

    if(!page){

        console.warn(pageId);

        return;

    }

    $$(".app-page").forEach(item=>{

        item.classList.remove("active-page");

    });

    page.classList.add("active-page");

    $$(".menu-button").forEach(button=>{

        const target=

            button.dataset.page ||

            button.dataset.target;

        button.classList.toggle(

            "active",

            target===pageId

        );

    });

    appState.currentPage=pageId;

    updateHeaderTitle(pageId);

    refreshPage(pageId);

    closeSidebar();

}

/* ======================================================
   메뉴 이벤트
====================================================== */

function initializeNavigation(){

    $$(".menu-button").forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                const page=

                    button.dataset.page ||

                    button.dataset.target;

                if(page){

                    openPage(page);

                }

            }

        );

    });

    $$("[data-open-page]").forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                openPage(

                    button.dataset.openPage

                );

            }

        );

    });

}

/* ======================================================
   Sidebar
====================================================== */

function openSidebar(){

    $(".sidebar")?.classList.add("open");

    $(".sidebar-overlay")?.classList.add("show");

    document.body.style.overflow="hidden";

}

function closeSidebar(){

    $(".sidebar")?.classList.remove("open");

    $(".sidebar-overlay")?.classList.remove("show");

    document.body.style.overflow="";

}

function toggleSidebar(){

    const sidebar=$(".sidebar");

    if(!sidebar){

        return;

    }

    if(sidebar.classList.contains("open")){

        closeSidebar();

    }

    else{

        openSidebar();

    }

}

/* ======================================================
   Sidebar 초기화
====================================================== */

function initializeSidebar(){

    $("#mobileMenuButton")

    ?.addEventListener(

        "click",

        toggleSidebar

    );

    $(".sidebar-overlay")

    ?.addEventListener(

        "click",

        closeSidebar

    );

    window.addEventListener(

        "resize",

        ()=>{

            if(window.innerWidth>1024){

                closeSidebar();

            }

        }

    );

}

/* ======================================================
   Confirm Modal
====================================================== */

let confirmCallback=null;

function openConfirmModal({

    title="확인",

    message="계속하시겠습니까?",

    confirmText="확인",

    onConfirm=null

}={}){

    const modal=$("#confirmModal");

    if(!modal){

        if(confirm(message)){

            onConfirm?.();

        }

        return;

    }

    $("#confirmTitle")?.textContent=title;

    $("#confirmMessage")?.textContent=message;

    $("#confirmButton")?.textContent=confirmText;

    confirmCallback=onConfirm;

    modal.classList.add("show");

}

function closeConfirmModal(){

    $("#confirmModal")

    ?.classList.remove("show");

    confirmCallback=null;

}

function initializeConfirmModal(){

    $("#confirmCancelButton")

    ?.addEventListener(

        "click",

        closeConfirmModal

    );

    $("#confirmButton")

    ?.addEventListener(

        "click",

        ()=>{

            const callback=

                confirmCallback;

            closeConfirmModal();

            callback?.();

        }

    );

    $("#confirmModal")

    ?.addEventListener(

        "click",

        event=>{

            if(

                event.target===

                $("#confirmModal")

            ){

                closeConfirmModal();

            }

        }

    );

}

/* ======================================================
   선택 선수 표시
====================================================== */

function updateSelectedAthleteDisplay(){

    const athlete=

        getSelectedAthlete();

    const text=

        athlete

        ? athlete.name

        : "선수 미선택";

    [

        "#selectedAthleteName",

        "#dashboardSelectedAthlete",

        "#headerSelectedAthlete"

    ].forEach(selector=>{

        const el=$(selector);

        if(el){

            el.textContent=text;

        }

    });

}
/* ======================================================
   app.js 1-3
   초기화 / 키보드 이벤트 / 공통 이벤트 / 시작
====================================================== */

/* ======================================================
   키보드 이벤트
====================================================== */

function initializeKeyboardEvents(){

    document.addEventListener(

        "keydown",

        event=>{

            switch(event.key){

                case "Escape":

                    closeConfirmModal();

                    closeSidebar();

                    $("#imagePreviewModal")
                    ?.classList.remove("show");

                    break;

            }

        }

    );

}

/* ======================================================
   자동 저장
====================================================== */

function initializeAutoSave(){

    window.addEventListener(

        "beforeunload",

        ()=>{

            autoSave();

        }

    );

}

/* ======================================================
   온라인 / 오프라인
====================================================== */

function initializeNetworkEvents(){

    window.addEventListener(

        "online",

        ()=>{

            showToast(

                "인터넷에 다시 연결됐어용.",

                "success"

            );

        }

    );

    window.addEventListener(

        "offline",

        ()=>{

            showToast(

                "현재 오프라인 상태예용.",

                "error"

            );

        }

    );

}

/* ======================================================
   현재 시간
====================================================== */

function updateClock(){

    const clock =

        $("#currentTime") ||

        $("#headerClock");

    if(!clock){

        return;

    }

    const now = new Date();

    clock.textContent =

        now.toLocaleString(

            "ko-KR"

        );

}

function initializeClock(){

    updateClock();

    setInterval(

        updateClock,

        1000

    );

}

/* ======================================================
   로딩 종료
====================================================== */

function hideLoadingScreen(){

    const loading =

        $("#loadingScreen");

    if(!loading){

        return;

    }

    loading.classList.add(

        "hide"

    );

    setTimeout(()=>{

        loading.remove();

    },500);

}

/* ======================================================
   앱 시작
====================================================== */

function initializeApp(){

    initializeNavigation();

    initializeSidebar();

    initializeConfirmModal();

    initializeKeyboardEvents();

    initializeAutoSave();

    initializeNetworkEvents();

    initializeClock();

    updateSelectedAthleteDisplay();

    renderDashboard?.();

    renderAthleteList?.();

    renderSettingsPage?.();

    openPage(

        appState.currentPage ||

        "dashboardPage"

    );

    hideLoadingScreen();

    log(

        APP_NAME,

        APP_VERSION,

        "시작 완료"

    );

}

/* ======================================================
   DOM Ready
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initializeApp();

    }

);

/* ======================================================
   공통 Export
====================================================== */

window.appData = appData;

window.appState = appState;

window.$ = $;

window.$$ = $$;

window.saveAppData = saveAppData;

window.loadAppData = loadAppData;

window.autoSave = autoSave;

window.createId = createId;

window.toNumber = toNumber;

window.getTodayValue = getTodayValue;

window.formatDate = formatDate;

window.escapeHTML = escapeHTML;

window.showToast = showToast;

window.openConfirmModal = openConfirmModal;

window.closeConfirmModal = closeConfirmModal;

window.openSidebar = openSidebar;

window.closeSidebar = closeSidebar;

window.toggleSidebar = toggleSidebar;

window.openPage = openPage;

window.refreshPage = refreshPage;

window.getSelectedAthlete = getSelectedAthlete;

window.updateSelectedAthleteDisplay =
    updateSelectedAthleteDisplay;

window.hideLoadingScreen =
    hideLoadingScreen;

window.initializeApp =
    initializeApp;

/* ======================================================
   app.js Part 1 끝
====================================================== */
/* ======================================================
   app.js Part 2-1
   선수 관리(CRUD)
====================================================== */

"use strict";

/* ======================================================
   수정 상태
====================================================== */

let editingAthleteId = null;

/* ======================================================
   선수 폼 요소
====================================================== */

function getAthleteFormElements(){

    return{

        form:$("#athleteForm"),

        name:$("#athleteName"),

        studentNumber:$("#athleteStudentNumber"),

        grade:$("#athleteGrade"),

        classNumber:$("#athleteClass"),

        sport:$("#athleteSport"),

        gender:$("#athleteGender"),

        birthDate:$("#athleteBirthDate"),

        height:$("#athleteHeight"),

        weight:$("#athleteWeight"),

        memo:$("#athleteMemo"),

        submit:$("#addAthleteButton"),

        cancel:$("#cancelAthleteEditButton")

    };

}

/* ======================================================
   입력값 가져오기
====================================================== */

function getAthleteFormData(){

    const e = getAthleteFormElements();

    return{

        name:e.name?.value.trim() || "",

        studentNumber:e.studentNumber?.value.trim() || "",

        grade:e.grade?.value || "",

        classNumber:e.classNumber?.value || "",

        sport:e.sport?.value || "",

        gender:e.gender?.value || "",

        birthDate:e.birthDate?.value || "",

        height:toNumber(e.height?.value),

        weight:toNumber(e.weight?.value),

        memo:e.memo?.value.trim() || ""

    };

}

/* ======================================================
   입력 검사
====================================================== */

function validateAthleteData(data){

    if(!data.name){

        showToast("이름을 입력하세요.","error");

        return false;

    }

    if(data.height<0 || data.height>250){

        showToast("키를 확인하세요.","error");

        return false;

    }

    if(data.weight<0 || data.weight>250){

        showToast("몸무게를 확인하세요.","error");

        return false;

    }

    return true;

}

/* ======================================================
   BMI
====================================================== */

function calculateBMI(height,weight){

    const h = toNumber(height)/100;

    const w = toNumber(weight);

    if(h<=0 || w<=0){

        return null;

    }

    return Number(

        (w/(h*h)).toFixed(1)

    );

}

/* ======================================================
   폼 초기화
====================================================== */

function resetAthleteForm(){

    const e=getAthleteFormElements();

    e.form?.reset();

    editingAthleteId=null;

    if(e.submit){

        e.submit.textContent="선수 등록";

    }

}

/* ======================================================
   선수 등록
====================================================== */

function addAthlete(event){

    event?.preventDefault();

    const athlete=getAthleteFormData();

    if(!validateAthleteData(athlete)){

        return;

    }

    const duplicated=

        athlete.studentNumber &&

        appData.athletes.some(

            item=>

            item.studentNumber===

            athlete.studentNumber

        );

    if(duplicated){

        showToast(

            "이미 등록된 학번입니다.",

            "error"

        );

        return;

    }

    const newAthlete={

        id:createId("athlete"),

        ...athlete,

        bmi:calculateBMI(

            athlete.height,

            athlete.weight

        ),

        createdAt:new Date().toISOString(),

        updatedAt:new Date().toISOString()

    };

    appData.athletes.unshift(

        newAthlete

    );

    if(!appData.selectedAthleteId){

        appData.selectedAthleteId=

            newAthlete.id;

    }

    autoSave();

    renderAthleteList();

    renderDashboard();

    updateSelectedAthleteDisplay();

    resetAthleteForm();

    showToast(

        `${newAthlete.name} 등록 완료`,

        "success"

    );

}

/* ======================================================
   수정 시작
====================================================== */

function startEditAthlete(id){

    const athlete=

        appData.athletes.find(

            a=>a.id===id

        );

    if(!athlete){

        return;

    }

    editingAthleteId=id;

    const e=getAthleteFormElements();

    e.name.value=athlete.name;

    e.studentNumber.value=

        athlete.studentNumber;

    e.grade.value=athlete.grade;

    e.classNumber.value=

        athlete.classNumber;

    e.sport.value=

        athlete.sport;

    e.gender.value=

        athlete.gender;

    e.birthDate.value=

        athlete.birthDate;

    e.height.value=

        athlete.height;

    e.weight.value=

        athlete.weight;

    e.memo.value=

        athlete.memo;

    if(e.submit){

        e.submit.textContent=

            "선수 수정";

    }

    e.name.focus();

    showToast(

        "선수 정보를 수정하세요."

    );

}
/* ======================================================
   app.js Part 2-2
   선수 수정 / 삭제 / 선택
====================================================== */

/* ======================================================
   선수 수정 저장
====================================================== */

function updateAthlete(event){

    event?.preventDefault();

    if(!editingAthleteId){

        addAthlete(event);

        return;

    }

    const data = getAthleteFormData();

    if(!validateAthleteData(data)){

        return;

    }

    const index = appData.athletes.findIndex(

        athlete => athlete.id === editingAthleteId

    );

    if(index === -1){

        editingAthleteId = null;

        return;

    }

    const duplicated =

        data.studentNumber &&

        appData.athletes.some(

            athlete =>

                athlete.id !== editingAthleteId &&

                athlete.studentNumber === data.studentNumber

        );

    if(duplicated){

        showToast(

            "같은 학번이 이미 존재합니다.",

            "error"

        );

        return;

    }

    appData.athletes[index] = {

        ...appData.athletes[index],

        ...data,

        bmi:calculateBMI(

            data.height,

            data.weight

        ),

        updatedAt:new Date().toISOString()

    };

    autoSave();

    renderAthleteList();

    renderDashboard();

    updateSelectedAthleteDisplay();

    resetAthleteForm();

    showToast(

        "선수 정보를 수정했습니다.",

        "success"

    );

}

/* ======================================================
   선수 선택
====================================================== */

function selectAthlete(id){

    const athlete =

        appData.athletes.find(

            item => item.id === id

        );

    if(!athlete){

        return;

    }

    appData.selectedAthleteId = id;

    autoSave();

    renderAthleteList();

    renderDashboard();

    updateSelectedAthleteDisplay();

    window.renderSportsPage?.();

    window.renderWeightPage?.();

    window.renderPosePage?.();

    window.renderRecordsPage?.();

    window.renderReportPage?.();

    showToast(

        `${athlete.name} 선택 완료`,

        "success"

    );

}

/* ======================================================
   삭제 요청
====================================================== */

function requestDeleteAthlete(id){

    const athlete =

        appData.athletes.find(

            item => item.id === id

        );

    if(!athlete){

        return;

    }

    openConfirmModal({

        title:"선수 삭제",

        message:

        `${athlete.name} 선수와 모든 기록을 삭제하시겠습니까?`,

        confirmText:"삭제",

        onConfirm:()=>{

            deleteAthlete(id);

        }

    });

}

/* ======================================================
   선수 삭제
====================================================== */

function deleteAthlete(id){

    appData.athletes =

        appData.athletes.filter(

            athlete => athlete.id !== id

        );

    appData.sportsRecords =

        appData.sportsRecords.filter(

            record => record.athleteId !== id

        );

    appData.weightRecords =

        appData.weightRecords.filter(

            record => record.athleteId !== id

        );

    appData.poseRecords =

        appData.poseRecords.filter(

            record => record.athleteId !== id

        );

    if(appData.selectedAthleteId === id){

        appData.selectedAthleteId =

            appData.athletes[0]?.id ||

            null;

    }

    autoSave();

    renderAthleteList();

    renderDashboard();

    updateSelectedAthleteDisplay();

    showToast(

        "선수를 삭제했습니다.",

        "success"

    );

}

/* ======================================================
   선수 카드 생성
====================================================== */

function createAthleteCardHTML(athlete){

    const selected =

        athlete.id ===

        appData.selectedAthleteId;

    return `

<article class="athlete-card ${selected?"selected":""}">

<div class="athlete-header">

<div class="athlete-avatar">

${escapeHTML(

athlete.name.charAt(0)

)}

</div>

<div>

<h3>

${escapeHTML(

athlete.name

)}

</h3>

<p>

${escapeHTML(

athlete.sport||"-"

)}

</p>

</div>

</div>

<div class="athlete-info">

<p><strong>학번</strong> ${escapeHTML(athlete.studentNumber||"-")}</p>

<p><strong>키</strong> ${athlete.height||"-"} cm</p>

<p><strong>몸무게</strong> ${athlete.weight||"-"} kg</p>

<p><strong>BMI</strong> ${athlete.bmi||"-"}</p>

</div>

<div class="athlete-buttons">

<button

data-action="select"

data-id="${athlete.id}"

>

${selected?"선택됨":"선택"}

</button>

<button

data-action="edit"

data-id="${athlete.id}"

>

수정

</button>

<button

class="danger"

data-action="delete"

data-id="${athlete.id}"

>

삭제

</button>

</div>

</article>

`;

}
/* ======================================================
   app.js Part 2-3
   선수 목록 / 검색 / 이벤트 / Dashboard 연동
====================================================== */

/* ======================================================
   선수 검색
====================================================== */

function searchAthletes(keyword = ""){

    const text = keyword
        .trim()
        .toLowerCase();

    if(!text){

        return [...appData.athletes];

    }

    return appData.athletes.filter(

        athlete=>{

            return(

                athlete.name
                    ?.toLowerCase()
                    .includes(text)

                ||

                athlete.studentNumber
                    ?.toLowerCase()
                    .includes(text)

                ||

                athlete.sport
                    ?.toLowerCase()
                    .includes(text)

            );

        }

    );

}

/* ======================================================
   선수 필터
====================================================== */

function filterAthletes(){

    const keyword =

        $("#athleteSearch")

        ?.value || "";

    const sport =

        $("#athleteSportFilter")

        ?.value || "";

    let athletes =

        searchAthletes(keyword);

    if(sport){

        athletes = athletes.filter(

            athlete=>

            athlete.sport===sport

        );

    }

    return athletes;

}

/* ======================================================
   선수 목록 출력
====================================================== */

function renderAthleteList(){

    const list =

        $("#athleteList") ||

        $(".athlete-list");

    if(!list){

        return;

    }

    const athletes =

        filterAthletes();

    if(athletes.length===0){

        list.innerHTML=`

<div class="empty-box">

<div class="empty-icon">

👤

</div>

<p>

등록된 선수가 없습니다.

</p>

</div>

`;

        return;

    }

    list.innerHTML=

        athletes

        .map(

            createAthleteCardHTML

        )

        .join("");

}

/* ======================================================
   카드 버튼 이벤트
====================================================== */

function handleAthleteListClick(event){

    const button=

        event.target.closest(

            "[data-action]"

        );

    if(!button){

        return;

    }

    const action=

        button.dataset.action;

    const id=

        button.dataset.id;

    switch(action){

        case "select":

            selectAthlete(id);

            break;

        case "edit":

            startEditAthlete(id);

            break;

        case "delete":

            requestDeleteAthlete(id);

            break;

    }

}

/* ======================================================
   검색 이벤트
====================================================== */

function initializeAthleteSearch(){

    $("#athleteSearch")

    ?.addEventListener(

        "input",

        renderAthleteList

    );

    $("#athleteSportFilter")

    ?.addEventListener(

        "change",

        renderAthleteList

    );

}

/* ======================================================
   Dashboard 선수 정보
====================================================== */

function updateDashboardAthlete(){

    const athlete=

        getSelectedAthlete();

    const name=

        $("#dashboardSelectedAthlete");

    const info=

        $("#dashboardAthleteInfo");

    if(!athlete){

        if(name){

            name.textContent=

                "선수 미선택";

        }

        if(info){

            info.textContent=

                "선수를 등록하세요.";

        }

        return;

    }

    if(name){

        name.textContent=

            athlete.name;

    }

    if(info){

        info.textContent=

`${athlete.grade || "-"}학년 · ${athlete.sport || "-"}`;

    }

}

/* ======================================================
   Dashboard 통계
====================================================== */

function updateDashboardStatistics(){

    const stats={

        totalAthletes:

            appData.athletes.length,

        sports:

            appData.sportsRecords.length,

        weight:

            appData.weightRecords.length,

        pose:

            appData.poseRecords.length

    };

    Object.entries(stats)

    .forEach(

        ([key,value])=>{

            $$(`[data-stat="${key}"]`)

            .forEach(el=>{

                el.textContent=value;

            });

        }

    );

}

/* ======================================================
   Dashboard 렌더링
====================================================== */

function renderDashboard(){

    updateDashboardAthlete();

    updateDashboardStatistics();

    if(

        typeof renderRecentRecords===

        "function"

    ){

        renderRecentRecords();

    }

    if(

        typeof renderDashboardCharts===

        "function"

    ){

        renderDashboardCharts();

    }

}

/* ======================================================
   선수 기능 초기화
====================================================== */

function initializeAthleteModule(){

    const form=

        $("#athleteForm");

    form?.addEventListener(

        "submit",

        event=>{

            if(editingAthleteId){

                updateAthlete(event);

            }

            else{

                addAthlete(event);

            }

        }

    );

    $("#cancelAthleteEditButton")

    ?.addEventListener(

        "click",

        cancelAthleteEdit

    );

    $("#athleteList")

    ?.addEventListener(

        "click",

        handleAthleteListClick

    );

    initializeAthleteSearch();

    renderAthleteList();

    renderDashboard();

}

/* ======================================================
   DOM Ready
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeAthleteModule

);

/* ======================================================
   Export
====================================================== */

window.renderAthleteList =
    renderAthleteList;

window.renderDashboard =
    renderDashboard;

window.selectAthlete =
    selectAthlete;

window.addAthlete =
    addAthlete;

window.updateAthlete =
    updateAthlete;

window.deleteAthlete =
    deleteAthlete;

window.requestDeleteAthlete =
    requestDeleteAthlete;

window.startEditAthlete =
    startEditAthlete;

window.calculateBMI =
    calculateBMI;

window.searchAthletes =
    searchAthletes;
    /* ======================================================
   app.js Part 3-1
   Dashboard 통계 / 최근 기록 / Chart.js
====================================================== */

"use strict";

/* ======================================================
   차트 객체
====================================================== */

const dashboardCharts = {
    monthly: null,
    training: null
};

/* ======================================================
   최근 기록 가져오기
====================================================== */

function getRecentRecords(limit = 5) {

    const records = [

        ...appData.sportsRecords.map(item => ({
            ...item,
            type: "종목훈련"
        })),

        ...appData.weightRecords.map(item => ({
            ...item,
            type: "웨이트"
        })),

        ...appData.poseRecords.map(item => ({
            ...item,
            type: "AI 자세"
        }))

    ];

    return records
        .sort((a, b) => {

            const timeA = new Date(
                a.createdAt || a.date || 0
            ).getTime();

            const timeB = new Date(
                b.createdAt || b.date || 0
            ).getTime();

            return timeB - timeA;

        })
        .slice(0, limit);

}

/* ======================================================
   최근 기록 출력
====================================================== */

function renderRecentRecords() {

    const container =
        $("#recentTrainingList");

    if (!container) return;

    const records = getRecentRecords();

    if (records.length === 0) {

        container.innerHTML = `

<div class="empty-box">

📊

<p>훈련 기록이 없습니다.</p>

</div>

`;

        return;

    }

    container.innerHTML = records.map(record => {

        const athlete = appData.athletes.find(

            a => a.id === record.athleteId

        );

        return `

<div class="record-card">

<div class="record-header">

<span class="badge blue">

${record.type}

</span>

<span>

${formatDate(record.date)}

</span>

</div>

<h4>

${escapeHTML(

record.title ||

record.exercise ||

record.type

)}

</h4>

<p>

${escapeHTML(

athlete?.name ||

"선수 없음"

)}

</p>

</div>

`;

    }).join("");

}

/* ======================================================
   평균 점수
====================================================== */

function calculateAverageScore(records){

    if(records.length===0){

        return 0;

    }

    const total = records.reduce(

        (sum,item)=>{

            return sum +

            Number(item.score || 0);

        },

        0

    );

    return Number(

        (total / records.length)

        .toFixed(1)

    );

}

/* ======================================================
   Dashboard 카드
====================================================== */

function renderDashboardCards(){

    const sportsAverage =

        calculateAverageScore(

            appData.sportsRecords

        );

    const poseAverage =

        calculateAverageScore(

            appData.poseRecords

        );

    const totalTraining =

        appData.sportsRecords.length +

        appData.weightRecords.length +

        appData.poseRecords.length;

    const values = {

        athlete:

        appData.athletes.length,

        total:

        totalTraining,

        sports:

        sportsAverage,

        pose:

        poseAverage

    };

    Object.entries(values)

    .forEach(([key,value])=>{

        $$(`[data-dashboard="${key}"]`)

        .forEach(el=>{

            el.textContent=value;

        });

    });

}
/* ======================================================
   app.js Part 3-2
   Chart.js Dashboard
====================================================== */

/* ======================================================
   월별 훈련 데이터
====================================================== */

function getMonthlyTrainingData(){

    const months = [
        "1월","2월","3월","4월","5월","6월",
        "7월","8월","9월","10월","11월","12월"
    ];

    const values = new Array(12).fill(0);

    const allRecords = [

        ...appData.sportsRecords,
        ...appData.weightRecords,
        ...appData.poseRecords

    ];

    allRecords.forEach(record=>{

        if(!record.date){

            return;

        }

        const month = new Date(record.date).getMonth();

        values[month]++;

    });

    return{

        labels:months,
        data:values

    };

}

/* ======================================================
   훈련 종류 통계
====================================================== */

function getTrainingTypeData(){

    return{

        labels:[

            "종목훈련",
            "웨이트",
            "AI 자세"

        ],

        data:[

            appData.sportsRecords.length,

            appData.weightRecords.length,

            appData.poseRecords.length

        ]

    };

}

/* ======================================================
   월별 그래프
====================================================== */

function renderMonthlyChart(){

    const canvas = $("#monthlyChart");

    if(!canvas){

        return;

    }

    if(dashboardCharts.monthly){

        dashboardCharts.monthly.destroy();

    }

    const chart = getMonthlyTrainingData();

    dashboardCharts.monthly =

        new Chart(

            canvas,

            {

                type:"bar",

                data:{

                    labels:chart.labels,

                    datasets:[{

                        label:"훈련 횟수",

                        data:chart.data,

                        borderWidth:1,

                        borderRadius:8

                    }]

                },

                options:{

                    responsive:true,

                    maintainAspectRatio:false,

                    plugins:{

                        legend:{

                            display:false

                        }

                    },

                    scales:{

                        y:{

                            beginAtZero:true,

                            ticks:{

                                precision:0

                            }

                        }

                    }

                }

            }

        );

}

/* ======================================================
   훈련 종류 비율
====================================================== */

function renderTrainingChart(){

    const canvas=$("#trainingChart");

    if(!canvas){

        return;

    }

    if(dashboardCharts.training){

        dashboardCharts.training.destroy();

    }

    const chart = getTrainingTypeData();

    dashboardCharts.training=

        new Chart(

            canvas,

            {

                type:"doughnut",

                data:{

                    labels:chart.labels,

                    datasets:[{

                        data:chart.data

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

            }

        );

}

/* ======================================================
   모든 차트
====================================================== */

function renderDashboardCharts(){

    renderMonthlyChart();

    renderTrainingChart();

}

/* ======================================================
   차트 새로고침
====================================================== */

function refreshDashboardCharts(){

    renderDashboardCards();

    renderDashboardCharts();

    renderRecentRecords();

}

/* ======================================================
   Export
====================================================== */

window.renderMonthlyChart =
    renderMonthlyChart;

window.renderTrainingChart =
    renderTrainingChart;

window.renderDashboardCharts =
    renderDashboardCharts;

window.refreshDashboardCharts =
    refreshDashboardCharts;
    /* ======================================================
   app.js Part 3-3
   Dashboard AI 분석 / 최고기록 / 연속훈련
====================================================== */

/* ======================================================
   최근 N일 기록
====================================================== */

function getRecordsWithinDays(days){

    const today = new Date();

    const limit = new Date();

    limit.setDate(today.getDate() - days);

    return [

        ...appData.sportsRecords,

        ...appData.weightRecords,

        ...appData.poseRecords

    ].filter(record=>{

        if(!record.date){

            return false;

        }

        return new Date(record.date) >= limit;

    });

}

/* ======================================================
   최고 점수
====================================================== */

function getBestScore(){

    const scores = [

        ...appData.sportsRecords,

        ...appData.poseRecords

    ].map(record=>

        Number(record.score || 0)

    );

    if(scores.length===0){

        return 0;

    }

    return Math.max(...scores);

}

/* ======================================================
   평균 점수
====================================================== */

function getOverallAverage(){

    const scores = [

        ...appData.sportsRecords,

        ...appData.poseRecords

    ].map(record=>

        Number(record.score || 0)

    );

    if(scores.length===0){

        return 0;

    }

    const average =

        scores.reduce(

            (a,b)=>a+b,

            0

        ) / scores.length;

    return Number(

        average.toFixed(1)

    );

}

/* ======================================================
   연속 훈련일
====================================================== */

function calculateTrainingStreak(){

    const dates = [

        ...appData.sportsRecords,

        ...appData.weightRecords,

        ...appData.poseRecords

    ]

    .map(record=>record.date)

    .filter(Boolean)

    .map(date=>{

        return new Date(date)

        .toISOString()

        .slice(0,10);

    });

    if(dates.length===0){

        return 0;

    }

    const unique =

        [...new Set(dates)]

        .sort()

        .reverse();

    let streak = 1;

    for(let i=1;i<unique.length;i++){

        const prev =

            new Date(unique[i-1]);

        const current =

            new Date(unique[i]);

        const diff =

            (prev-current)

            /(1000*60*60*24);

        if(diff===1){

            streak++;

        }else{

            break;

        }

    }

    return streak;

}

/* ======================================================
   AI 분석
====================================================== */

function generateDashboardAnalysis(){

    const recent7 =

        getRecordsWithinDays(7).length;

    const recent30 =

        getRecordsWithinDays(30).length;

    const average =

        getOverallAverage();

    const best =

        getBestScore();

    const streak =

        calculateTrainingStreak();

    let result = "";

    if(recent7===0){

        result +=
        "최근 7일 동안 훈련 기록이 없습니다. ";

    }else if(recent7>=5){

        result +=
        "최근 훈련 빈도가 매우 좋습니다. ";

    }else{

        result +=
        "훈련 빈도를 조금 더 높이면 좋습니다. ";

    }

    if(average>=90){

        result +=
        "평균 점수가 매우 우수합니다. ";

    }else if(average>=80){

        result +=
        "안정적인 수행 능력을 보이고 있습니다. ";

    }else{

        result +=
        "기초 기술 보완이 필요합니다. ";

    }

    result +=

`최고 점수 ${best}점 · 연속 훈련 ${streak}일 · 최근 30일 ${recent30}회`;

    return result;

}

/* ======================================================
   Dashboard AI 카드
====================================================== */

function renderDashboardAnalysis(){

    const element =

        $("#dashboardAnalysis");

    if(!element){

        return;

    }

    element.textContent =

        generateDashboardAnalysis();

}

/* ======================================================
   Dashboard 전체 업데이트
====================================================== */

function updateDashboard(){

    renderDashboardCards();

    renderRecentRecords();

    renderDashboardCharts();

    renderDashboardAnalysis();

}

/* ======================================================
   자동 새로고침
====================================================== */

function initializeDashboardAutoRefresh(){

    setInterval(

        ()=>{

            updateDashboard();

        },

        60000

    );

}

/* ======================================================
   Dashboard 초기화
====================================================== */

function initializeDashboard(){

    updateDashboard();

    initializeDashboardAutoRefresh();

}

/* ======================================================
   Export
====================================================== */

window.getBestScore =
    getBestScore;

window.getOverallAverage =
    getOverallAverage;

window.calculateTrainingStreak =
    calculateTrainingStreak;

window.generateDashboardAnalysis =
    generateDashboardAnalysis;

window.renderDashboardAnalysis =
    renderDashboardAnalysis;

window.updateDashboard =
    updateDashboard;

window.initializeDashboard =
    initializeDashboard;
    /* ======================================================
   app.js Part 4-1
   공통 유틸리티
====================================================== */

"use strict";

/* ======================================================
   날짜 문자열
====================================================== */

function getDateString(date = new Date()) {

    const y = date.getFullYear();

    const m = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
        date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;

}

/* ======================================================
   시간 문자열
====================================================== */

function getTimeString(date = new Date()) {

    return date.toLocaleTimeString(
        "ko-KR",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}

/* ======================================================
   날짜 + 시간
====================================================== */

function getDateTimeString(){

    return `${getDateString()} ${getTimeString()}`;

}

/* ======================================================
   숫자 포맷
====================================================== */

function formatNumber(value){

    return Number(value || 0)
        .toLocaleString("ko-KR");

}

/* ======================================================
   퍼센트
====================================================== */

function formatPercent(value){

    return `${Number(value || 0).toFixed(1)}%`;

}

/* ======================================================
   랜덤 색상
====================================================== */

function randomColor(){

    const colors = [

        "#2563EB",
        "#059669",
        "#EA580C",
        "#DC2626",
        "#7C3AED",
        "#0891B2"

    ];

    return colors[
        Math.floor(
            Math.random() * colors.length
        )
    ];

}

/* ======================================================
   배열 평균
====================================================== */

function average(array){

    if(array.length===0){

        return 0;

    }

    return Number(

        (

            array.reduce(

                (a,b)=>a+b,

                0

            )

            / array.length

        ).toFixed(1)

    );

}

/* ======================================================
   배열 합계
====================================================== */

function sum(array){

    return array.reduce(

        (a,b)=>a+b,

        0

    );

}

/* ======================================================
   최고값
====================================================== */

function max(array){

    if(array.length===0){

        return 0;

    }

    return Math.max(...array);

}

/* ======================================================
   최저값
====================================================== */

function min(array){

    if(array.length===0){

        return 0;

    }

    return Math.min(...array);

}

/* ======================================================
   정렬
====================================================== */

function sortByDate(records){

    return [...records].sort(

        (a,b)=>{

            return new Date(b.date)

            -

            new Date(a.date);

        }

    );

}

/* ======================================================
   ID 검색
====================================================== */

function findById(list,id){

    return list.find(

        item=>item.id===id

    );

}

/* ======================================================
   삭제
====================================================== */

function removeById(list,id){

    return list.filter(

        item=>item.id!==id

    );

}

/* ======================================================
   Deep Copy
====================================================== */

function deepCopy(object){

    return JSON.parse(

        JSON.stringify(object)

    );

}

/* ======================================================
   LocalStorage 크기
====================================================== */

function getStorageSize(){

    return new Blob(

        [

            JSON.stringify(appData)

        ]

    ).size;

}

/* ======================================================
   Storage 정보
====================================================== */

function updateStorageInfo(){

    const element =

        $("#storageInfo");

    if(!element){

        return;

    }

    const kb =

        (

            getStorageSize()

            /1024

        ).toFixed(2);

    element.textContent=

        `${kb} KB`;

}

/* ======================================================
   Export
====================================================== */

window.getDateString = getDateString;
window.getTimeString = getTimeString;
window.getDateTimeString = getDateTimeString;

window.formatNumber = formatNumber;
window.formatPercent = formatPercent;

window.randomColor = randomColor;

window.average = average;
window.sum = sum;
window.max = max;
window.min = min;

window.sortByDate = sortByDate;

window.findById = findById;
window.removeById = removeById;

window.deepCopy = deepCopy;

window.getStorageSize = getStorageSize;
window.updateStorageInfo = updateStorageInfo;
/* ======================================================
   app.js Part 4-2
   백업 / 복원 / CSV / 설정
====================================================== */

"use strict";

/* ======================================================
   JSON 백업
====================================================== */

function exportBackup(){

    const backup = {

        app: APP_NAME,

        version: APP_VERSION,

        exportedAt: new Date().toISOString(),

        data: appData

    };

    const blob = new Blob(

        [

            JSON.stringify(

                backup,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download =

`${APP_NAME}_${getDateString()}.json`;

    a.click();

    URL.revokeObjectURL(url);

    showToast(

        "백업이 저장되었습니다.",

        "success"

    );

}

/* ======================================================
   JSON 복원
====================================================== */

function importBackup(file){

    if(!file){

        return;

    }

    const reader = new FileReader();

    reader.onload = event=>{

        try{

            const backup = JSON.parse(

                event.target.result

            );

            if(!backup.data){

                throw new Error();

            }

            appData = backup.data;

            saveAppData();

            refreshPage();

            renderDashboard();

            renderAthleteList();

            updateSelectedAthleteDisplay();

            showToast(

                "복원이 완료되었습니다.",

                "success"

            );

        }

        catch{

            showToast(

                "백업 파일이 올바르지 않습니다.",

                "error"

            );

        }

    };

    reader.readAsText(file);

}

/* ======================================================
   CSV 만들기
====================================================== */

function convertArrayToCSV(data){

    if(!data.length){

        return "";

    }

    const header =

        Object.keys(data[0]).join(",");

    const rows =

        data.map(item=>{

            return Object.values(item)

            .map(value=>{

                return `"${String(value ?? "")}"`;

            })

            .join(",");

        });

    return [

        header,

        ...rows

    ].join("\n");

}

/* ======================================================
   CSV 저장
====================================================== */

function exportCSV(data,fileName){

    const csv =

        convertArrayToCSV(data);

    const blob = new Blob(

        [

            "\uFEFF"+csv

        ],

        {

            type:"text/csv"

        }

    );

    const url =

        URL.createObjectURL(blob);

    const a =

        document.createElement("a");

    a.href = url;

    a.download =

`${fileName}_${getDateString()}.csv`;

    a.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   전체 초기화
====================================================== */

function resetApplication(){

    openConfirmModal({

        title:"초기화",

        message:

"모든 데이터를 삭제하시겠습니까?",

        confirmText:"삭제",

        onConfirm:()=>{

            localStorage.removeItem(

                STORAGE_KEY

            );

            appData =

                deepCopy(

                    DEFAULT_APP_DATA

                );

            saveAppData();

            location.reload();

        }

    });

}

/* ======================================================
   인쇄
====================================================== */

function printPage(){

    window.print();

}

/* ======================================================
   설정 저장
====================================================== */

function saveSettings(){

    appData.settings = {

        darkMode:

        $("#darkMode")

        ?.checked ?? true,

        autoSave:

        $("#autoSave")

        ?.checked ?? true,

        sound:

        $("#sound")

        ?.checked ?? true

    };

    saveAppData();

    showToast(

        "설정을 저장했습니다.",

        "success"

    );

}

/* ======================================================
   설정 불러오기
====================================================== */

function loadSettings(){

    const setting =

        appData.settings || {};

    if($("#darkMode")){

        $("#darkMode").checked =

            setting.darkMode ??

            true;

    }

    if($("#autoSave")){

        $("#autoSave").checked =

            setting.autoSave ??

            true;

    }

    if($("#sound")){

        $("#sound").checked =

            setting.sound ??

            true;

    }

}

/* ======================================================
   자동 백업
====================================================== */

function autoBackup(){

    if(

        !appData.settings?.autoSave

    ){

        return;

    }

    saveAppData();

    updateStorageInfo();

}

/* ======================================================
   5분 자동 저장
====================================================== */

setInterval(

    autoBackup,

    300000

);

/* ======================================================
   Export
====================================================== */

window.exportBackup = exportBackup;
window.importBackup = importBackup;

window.exportCSV = exportCSV;

window.convertArrayToCSV =
    convertArrayToCSV;

window.resetApplication =
    resetApplication;

window.printPage = printPage;

window.saveSettings =
    saveSettings;

window.loadSettings =
    loadSettings;

window.autoBackup =
    autoBackup;
    /* ======================================================
   app.js Part 4-3
   최종 마무리
   Error Handler / Logger / Version / Performance
====================================================== */

"use strict";

/* ======================================================
   앱 정보
====================================================== */

const APP_INFO = {

    name: APP_NAME,

    version: APP_VERSION,

    developer: "Seolcheon High School Sports Science Center",

    buildDate: "2026-07-31"

};

/* ======================================================
   Logger
====================================================== */

const Logger = {

    history: [],

    write(type, message){

        const log = {

            time: getDateTimeString(),

            type,

            message

        };

        this.history.push(log);

        console[type === "error" ? "error" : "log"](
            `[${log.time}] ${message}`
        );

    },

    info(message){

        this.write("log", message);

    },

    warn(message){

        this.write("warn", message);

    },

    error(message){

        this.write("error", message);

    }

};

/* ======================================================
   전역 Error
====================================================== */

window.addEventListener(

    "error",

    event=>{

        Logger.error(

            event.message

        );

        showToast(

            "오류가 발생했습니다.",

            "error"

        );

    }

);

/* ======================================================
   Promise Error
====================================================== */

window.addEventListener(

    "unhandledrejection",

    event=>{

        Logger.error(

            String(event.reason)

        );

    }

);

/* ======================================================
   성능 측정
====================================================== */

function measurePerformance(name, callback){

    const start = performance.now();

    callback();

    const end = performance.now();

    Logger.info(

`${name} : ${(end-start).toFixed(2)}ms`

    );

}

/* ======================================================
   앱 정보 출력
====================================================== */

function showAppInfo(){

    console.table(APP_INFO);

    updateStorageInfo();

}

/* ======================================================
   개발자 명령
====================================================== */

window.DevTools = {

    appData,

    clear(){

        console.clear();

    },

    storage(){

        console.log(appData);

    },

    logs(){

        console.table(

            Logger.history

        );

    },

    version(){

        console.table(APP_INFO);

    }

};

/* ======================================================
   모듈 초기화
====================================================== */

function initializeModules(){

    try{

        initializeDashboard?.();

        initializeAthleteModule?.();

        initializeSportsModule?.();

        initializeWeightModule?.();

        initializePoseModule?.();

        initializeRecordsModule?.();

        initializeReportModule?.();

        loadSettings?.();

        Logger.info(

            "모든 모듈 초기화 완료"

        );

    }

    catch(error){

        Logger.error(

            error.message

        );

    }

}

/* ======================================================
   앱 시작
====================================================== */

function startApplication(){

    measurePerformance(

        "Application Start",

        ()=>{

            initializeModules();

            renderDashboard();

            refreshPage();

            updateStorageInfo();

        }

    );

}

/* ======================================================
   종료
====================================================== */

window.addEventListener(

    "beforeunload",

    ()=>{

        autoBackup();

        Logger.info(

            "Application Closed"

        );

    }

);

/* ======================================================
   DOM Ready
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        startApplication();

        showAppInfo();

    }

);

/* ======================================================
   Export
====================================================== */

window.Logger = Logger;

window.APP_INFO = APP_INFO;

window.measurePerformance =
    measurePerformance;

window.showAppInfo =
    showAppInfo;

window.startApplication =
    startApplication;

/* ======================================================
   app.js COMPLETE
====================================================== */