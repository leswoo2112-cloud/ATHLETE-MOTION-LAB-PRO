/* ======================================================
   설천고 스포츠과학 훈련센터
   sports.js
   Part 1
   기본 설정 / 상태 / DOM / 공통 함수
====================================================== */

"use strict";

/* ======================================================
   Module
====================================================== */

const SportsModule = (() => {

/* ======================================================
   Constants
====================================================== */

const STORAGE_KEY = "sportsRecords";

const SPORTS_TYPES = {

    biathlon: "바이애슬론",
    crosscountry: "크로스컨트리",
    rollerski: "롤러스키",
    running: "달리기",
    cycling: "사이클",
    shooting: "사격",
    basketball: "농구",
    football: "축구",
    volleyball: "배구",
    swimming: "수영",
    other: "기타"

};

const WEATHER_TYPES = {

    sunny: "맑음",
    cloudy: "흐림",
    rain: "비",
    snow: "눈",
    windy: "바람"

};

const CONDITION_TYPES = {

    excellent:"매우좋음",
    good:"좋음",
    normal:"보통",
    tired:"피곤",
    bad:"나쁨",
    pain:"통증"

};

/* ======================================================
   State
====================================================== */

const state = {

    editingId:null,

    records:[],

    search:"",

    sport:"all",

    sort:"newest",

    startDate:"",

    endDate:"",

    charts:{

        load:null,

        distance:null,

        duration:null,

        type:null

    }

};

/* ======================================================
   DOM Cache
====================================================== */

const DOM = {};

/* ======================================================
   DOM Cache
====================================================== */

function cacheDOM(){

    DOM.form=$("#sportsTrainingForm");

    DOM.date=$("#sportsDate");

    DOM.sport=$("#sportsType");

    DOM.training=$("#sportsTrainingName");

    DOM.duration=$("#sportsDuration");

    DOM.distance=$("#sportsDistance");

    DOM.avgHr=$("#sportsAverageHeartRate");

    DOM.maxHr=$("#sportsMaxHeartRate");

    DOM.rpe=$("#sportsRpe");

    DOM.total=$("#shootingTotal");

    DOM.hit=$("#shootingHit");

    DOM.prone=$("#shootingProne");

    DOM.standing=$("#shootingStanding");

    DOM.weather=$("#sportsWeather");

    DOM.condition=$("#sportsCondition");

    DOM.memo=$("#sportsMemo");

    DOM.save=$("#saveSportsRecordButton");

    DOM.reset=$("#resetSportsFormButton");

    DOM.list=$("#sportsRecordList");

    DOM.search=$("#sportsSearchInput");

    DOM.filter=$("#sportsFilterSelect");

    DOM.sort=$("#sportsSortSelect");

}

/* ======================================================
   Selector
====================================================== */

function $(selector){

    return document.querySelector(selector);

}

function $all(selector){

    return [...document.querySelectorAll(selector)];

}

/* ======================================================
   Utils
====================================================== */

function today(){

    return new Date()

        .toISOString()

        .slice(0,10);

}

function number(value){

    const n=Number(value);

    return Number.isFinite(n)

        ? n

        :0;

}

function uuid(){

    return

        "sports_"+

        Date.now()+

        "_"+

        Math.random()

        .toString(36)

        .substring(2,8);

}

function clone(data){

    return JSON.parse(

        JSON.stringify(data)

    );

}

/* ======================================================
   Storage
====================================================== */

function load(){

    state.records=

        clone(

            appData.sportsRecords||[]

        );

}

function save(){

    appData.sportsRecords=

        clone(state.records);

    saveAppData();

}

/* ======================================================
   Athlete
====================================================== */

function athlete(){

    return getSelectedAthlete();

}

/* ======================================================
   Toast
====================================================== */

function toast(message,type="success"){

    if(typeof showToast==="function"){

        showToast(message,type);

    }

}

/* ======================================================
   Logger
====================================================== */

function log(message){

    if(window.Logger){

        Logger.info(message);

    }

}

/* ======================================================
   Refresh
====================================================== */

function refreshModules(){

    if(window.renderDashboard){

        renderDashboard();

    }

    if(window.renderRecordsPage){

        renderRecordsPage();

    }

    if(window.renderReportPage){

        renderReportPage();

    }

}

/* ======================================================
   Record Factory
====================================================== */

function createRecord(data){

    return{

        id:uuid(),

        athleteId:athlete().id,

        createdAt:new Date().toISOString(),

        updatedAt:new Date().toISOString(),

        ...data

    };

}

/* ======================================================
   Reset State
====================================================== */

function clearEditing(){

    state.editingId=null;

}

/* ======================================================
   Exports (Temporary)
====================================================== */

return{

    state,

    DOM,

    load,

    save,

    cacheDOM,

    createRecord,

    clearEditing,

    toast,

    log,

    refreshModules,

    today,

    number

};

})();
/* ======================================================
   sports.js
   Part 2-1
   입력폼 / Validation / 실시간 계산
====================================================== */

/* ======================================================
   Form Data
====================================================== */

function getFormData(){

    return{

        date:DOM.date?.value||today(),

        sport:DOM.sport?.value||"",

        trainingName:DOM.training?.value.trim()||"",

        duration:number(DOM.duration?.value),

        distance:number(DOM.distance?.value),

        averageHeartRate:number(DOM.avgHr?.value),

        maxHeartRate:number(DOM.maxHr?.value),

        rpe:number(DOM.rpe?.value),

        shootingTotal:number(DOM.total?.value),

        shootingHit:number(DOM.hit?.value),

        shootingProne:number(DOM.prone?.value),

        shootingStanding:number(DOM.standing?.value),

        weather:DOM.weather?.value||"",

        condition:DOM.condition?.value||"",

        memo:DOM.memo?.value.trim()

    };

}

/* ======================================================
   Validation
====================================================== */

function validate(data){

    if(!athlete()){

        toast("선수를 먼저 선택해주세요.","error");

        return false;

    }

    if(!data.date){

        toast("날짜를 입력해주세요.","error");

        return false;

    }

    if(!data.sport){

        toast("종목을 선택해주세요.","error");

        DOM.sport?.focus();

        return false;

    }

    if(!data.trainingName){

        toast("훈련명을 입력해주세요.","error");

        DOM.training?.focus();

        return false;

    }

    if(data.duration<0||data.duration>1440){

        toast("훈련 시간을 확인해주세요.","error");

        return false;

    }

    if(data.distance<0){

        toast("훈련 거리를 확인해주세요.","error");

        return false;

    }

    if(

        data.averageHeartRate>

        data.maxHeartRate

        &&

        data.maxHeartRate>0

    ){

        toast(

            "평균 심박수가 최대 심박수보다 높습니다.",

            "error"

        );

        return false;

    }

    if(

        data.rpe<0||

        data.rpe>10

    ){

        toast(

            "RPE는 0~10입니다.",

            "error"

        );

        return false;

    }

    if(

        data.shootingHit>

        data.shootingTotal

    ){

        toast(

            "명중수가 전체 발수보다 큽니다.",

            "error"

        );

        return false;

    }

    return true;

}

/* ======================================================
   Calculation
====================================================== */

function calcAccuracy(hit,total){

    if(total<=0)return 0;

    return Number(

        (

            hit/

            total*

            100

        ).toFixed(1)

    );

}

function calcPace(duration,distance){

    if(

        duration<=0||

        distance<=0

    ){

        return "-";

    }

    const pace=

        duration/distance;

    const min=

        Math.floor(pace);

    const sec=

        Math.round(

            (pace-min)*60

        );

    return

`${min}:${String(sec).padStart(2,"0")}`;

}

function calcSpeed(duration,distance){

    if(

        duration<=0||

        distance<=0

    ){

        return 0;

    }

    return Number(

        (

            distance/

            (duration/60)

        ).toFixed(1)

    );

}

function calcLoad(duration,rpe){

    return Math.round(

        duration*rpe

    );

}

/* ======================================================
   Live Preview
====================================================== */

function preview(selector,value){

    document

        .querySelectorAll(selector)

        .forEach(el=>{

            el.textContent=value;

        });

}

function updatePreview(){

    const d=getFormData();

    preview(

        "[data-preview='accuracy']",

        d.shootingTotal

        ?`${calcAccuracy(

            d.shootingHit,

            d.shootingTotal

        )}%`

        :"-"

    );

    preview(

        "[data-preview='pace']",

        calcPace(

            d.duration,

            d.distance

        )

    );

    preview(

        "[data-preview='speed']",

        d.distance

        ?`${calcSpeed(

            d.duration,

            d.distance

        )} km/h`

        :"-"

    );

    preview(

        "[data-preview='load']",

        calcLoad(

            d.duration,

            d.rpe

        )

    );

}

/* ======================================================
   Shooting Section
====================================================== */

function updateShootingSection(){

    const section=

        $("#shootingInputSection");

    if(!section)return;

    section.classList.toggle(

        "hidden",

        !["biathlon","shooting"]

        .includes(

            DOM.sport.value

        )

    );

}

/* ======================================================
   Events
====================================================== */

function bindPreviewEvents(){

    [

        DOM.duration,

        DOM.distance,

        DOM.rpe,

        DOM.total,

        DOM.hit,

        DOM.prone,

        DOM.standing

    ].forEach(input=>{

        input?.addEventListener(

            "input",

            updatePreview

        );

    });

    DOM.sport

    ?.addEventListener(

        "change",

        ()=>{

            updateShootingSection();

            updatePreview();

        }

    );

}

/* ======================================================
   Initialize Form
====================================================== */

function initializeForm(){

    DOM.date.value=today();

    updatePreview();

    updateShootingSection();

    bindPreviewEvents();

}
/* ======================================================
   Part 2-2
   Update / Delete
====================================================== */

/* ======================================================
   Find Record
====================================================== */

function findRecord(id){

    return state.records.find(

        record=>record.id===id

    );

}

/* ======================================================
   Create Record
====================================================== */

function createSportsRecord(){

    const data=getFormData();

    if(!validate(data)){

        return;

    }

    const record=createRecord({

        ...data,

        load:calcLoad(

            data.duration,

            data.rpe

        ),

        pace:calcPace(

            data.duration,

            data.distance

        ),

        speed:calcSpeed(

            data.duration,

            data.distance

        ),

        accuracy:calcAccuracy(

            data.shootingHit,

            data.shootingTotal

        )

    });

    state.records.unshift(record);

    save();

    refreshModules();

    renderSportsPage();

    toast("훈련기록이 저장되었습니다.");

    log("Create Sports Record");

    resetForm();

}

/* ======================================================
   Update Record
====================================================== */

function updateSportsRecord(){

    const data=getFormData();

    if(!validate(data)){

        return;

    }

    const record=findRecord(

        state.editingId

    );

    if(!record){

        toast("기록을 찾을 수 없습니다.","error");

        return;

    }

    Object.assign(

        record,

        data,

        {

            updatedAt:new Date().toISOString(),

            load:calcLoad(

                data.duration,

                data.rpe

            ),

            pace:calcPace(

                data.duration,

                data.distance

            ),

            speed:calcSpeed(

                data.duration,

                data.distance

            ),

            accuracy:calcAccuracy(

                data.shootingHit,

                data.shootingTotal

            )

        }

    );

    save();

    refreshModules();

    renderSportsPage();

    toast("훈련기록이 수정되었습니다.");

    log("Update Sports Record");

    resetForm();

}

/* ======================================================
   Save
====================================================== */

function saveSportsRecord(){

    if(state.editingId){

        updateSportsRecord();

    }else{

        createSportsRecord();

    }

}

/* ======================================================
   Delete
====================================================== */

function deleteSportsRecord(id){

    const record=findRecord(id);

    if(!record){

        return;

    }

    const ok=confirm(

        "이 기록을 삭제하시겠습니까?"

    );

    if(!ok){

        return;

    }

    state.records=

        state.records.filter(

            item=>item.id!==id

        );

    save();

    refreshModules();

    renderSportsPage();

    toast("삭제되었습니다.");

    log("Delete Sports Record");

}

/* ======================================================
   Edit Mode
====================================================== */

function editSportsRecord(id){

    const record=findRecord(id);

    if(!record){

        return;

    }

    state.editingId=id;

    DOM.date.value=record.date;

    DOM.sport.value=record.sport;

    DOM.training.value=record.trainingName;

    DOM.duration.value=record.duration;

    DOM.distance.value=record.distance;

    DOM.avgHr.value=record.averageHeartRate;

    DOM.maxHr.value=record.maxHeartRate;

    DOM.rpe.value=record.rpe;

    DOM.total.value=record.shootingTotal;

    DOM.hit.value=record.shootingHit;

    DOM.prone.value=record.shootingProne;

    DOM.standing.value=record.shootingStanding;

    DOM.weather.value=record.weather;

    DOM.condition.value=record.condition;

    DOM.memo.value=record.memo;

    DOM.save.textContent="수정 완료";

    updatePreview();

    updateShootingSection();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ======================================================
   Reset Form
====================================================== */

function resetForm(){

    state.editingId=null;

    DOM.form.reset();

    DOM.date.value=today();

    DOM.save.textContent="기록 저장";

    updatePreview();

    updateShootingSection();

}
/* ======================================================
   Part 2-3
   CRUD Finish
====================================================== */

/* ======================================================
   Auto Save
====================================================== */

let autoSaveTimer = null;

function scheduleAutoSave(){

    clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {

        if(state.editingId){

            return;
        }

        saveDraft();

    },1000);

}

function saveDraft(){

    try{

        localStorage.setItem(

            "sportsDraft",

            JSON.stringify(getFormData())

        );

    }catch(error){

        console.error(error);

    }

}

function loadDraft(){

    try{

        const draft = JSON.parse(

            localStorage.getItem("sportsDraft")

        );

        if(!draft){

            return;

        }

        Object.keys(draft).forEach(key=>{

            const element = DOM[key];

            if(element){

                element.value = draft[key];

            }

        });

        updatePreview();

    }catch(error){

        console.error(error);

    }

}

function clearDraft(){

    localStorage.removeItem(

        "sportsDraft"

    );

}

/* ======================================================
   Button Events
====================================================== */

function bindButtonEvents(){

    DOM.save?.addEventListener(

        "click",

        event=>{

            event.preventDefault();

            saveSportsRecord();

            clearDraft();

        }

    );

    DOM.reset?.addEventListener(

        "click",

        event=>{

            event.preventDefault();

            resetForm();

            clearDraft();

        }

    );

}

/* ======================================================
   Form Events
====================================================== */

function bindFormEvents(){

    if(!DOM.form){

        return;

    }

    DOM.form.addEventListener(

        "input",

        ()=>{

            updatePreview();

            scheduleAutoSave();

        }

    );

}

/* ======================================================
   List Events
====================================================== */

function bindListEvents(){

    if(!DOM.list){

        return;

    }

    DOM.list.addEventListener(

        "click",

        event=>{

            const button = event.target.closest("button");

            if(!button){

                return;

            }

            const id = button.dataset.id;

            if(!id){

                return;

            }

            switch(button.dataset.action){

                case "edit":

                    editSportsRecord(id);

                    break;

                case "delete":

                    deleteSportsRecord(id);

                    break;

            }

        }

    );

}

/* ======================================================
   Keyboard Shortcut
====================================================== */

function bindKeyboard(){

    document.addEventListener(

        "keydown",

        event=>{

            if(

                event.ctrlKey &&

                event.key==="s"

            ){

                event.preventDefault();

                saveSportsRecord();

            }

            if(

                event.key==="Escape"

            ){

                resetForm();

            }

        }

    );

}

/* ======================================================
   Initialize CRUD
====================================================== */

function initializeCRUD(){

    bindButtonEvents();

    bindFormEvents();

    bindListEvents();

    bindKeyboard();

    loadDraft();

}

/* ======================================================
   Export
====================================================== */

Object.assign(

    window,

    {

        saveSportsRecord,

        editSportsRecord,

        deleteSportsRecord,

        resetForm,

        initializeCRUD

    }

);
/* ======================================================
   Part 3-2
   Advanced Card UI
====================================================== */

function getSportIcon(type){

    const icons={

        biathlon:"🎯",

        crosscountry:"🎿",

        rollerski:"🛼",

        running:"🏃",

        cycling:"🚴",

        shooting:"🎯",

        basketball:"🏀",

        football:"⚽",

        volleyball:"🏐",

        swimming:"🏊",

        other:"🏅"

    };

    return icons[type]||"🏅";

}

/* ======================================================
   Athlete Avatar
====================================================== */

function getAthleteAvatar(record){

    const athlete=

        appData.athletes.find(

            a=>a.id===record.athleteId

        );

    if(

        athlete&&

        athlete.photo

    ){

        return athlete.photo;

    }

    return "assets/default-avatar.png";

}

/* ======================================================
   Heart Rate Color
====================================================== */

function getHeartColor(hr){

    if(hr>=190){

        return "danger";

    }

    if(hr>=170){

        return "warning";

    }

    return "success";

}

/* ======================================================
   Training Load Color
====================================================== */

function getLoadColor(load){

    if(load>=900){

        return "danger";

    }

    if(load>=600){

        return "warning";

    }

    return "success";

}

/* ======================================================
   Condition Badge
====================================================== */

function renderCondition(condition){

    const colors={

        excellent:"success",

        good:"primary",

        normal:"secondary",

        tired:"warning",

        bad:"danger",

        pain:"danger"

    };

    return `

<span class="badge badge-${colors[condition]}">

${CONDITION_TYPES[condition]}

</span>

`;

}

/* ======================================================
   Weather Badge
====================================================== */

function renderWeather(weather){

    const emoji={

        sunny:"☀️",

        cloudy:"☁️",

        rain:"🌧️",

        snow:"❄️",

        windy:"🌬️"

    };

    return `

<span class="weather">

${emoji[weather]||""}

${WEATHER_TYPES[weather]||""}

</span>

`;

}

/* ======================================================
   Card Header
====================================================== */

function renderCardHeader(record){

return`

<div class="sports-header">

<div class="left">

<img

src="${getAthleteAvatar(record)}"

class="avatar"

>

<div>

<h3>

${getSportIcon(record.sport)}

${escapeHTML(record.trainingName)}

</h3>

<small>

${record.date}

</small>

</div>

</div>

<div>

${renderCondition(record.condition)}

</div>

</div>

`;

}

/* ======================================================
   Card Stats
====================================================== */

function renderStats(record){

return`

<div class="sports-grid">

<div>

<label>거리</label>

<strong>

${record.distance} km

</strong>

</div>

<div>

<label>시간</label>

<strong>

${record.duration}분

</strong>

</div>

<div>

<label>페이스</label>

<strong>

${record.pace}

</strong>

</div>

<div>

<label>속도</label>

<strong>

${record.speed} km/h

</strong>

</div>

<div>

<label>심박</label>

<strong class="${getHeartColor(record.averageHeartRate)}">

${record.averageHeartRate}

</strong>

</div>

<div>

<label>훈련부하</label>

<strong class="${getLoadColor(record.load)}">

${record.load}

</strong>

</div>

</div>

`;

}

/* ======================================================
   Card Footer
====================================================== */

function renderCardFooter(record){

return`

<div class="sports-footer">

${renderWeather(record.weather)}

<div>

<button

class="btn btn-primary"

data-action="edit"

data-id="${record.id}">

수정

</button>

<button

class="btn btn-danger"

data-action="delete"

data-id="${record.id}">

삭제

</button>

</div>

</div>

`;

}

/* ======================================================
   Create Card
====================================================== */

function createSportsCard(record){

return`

<div class="sports-card fade-in">

${renderCardHeader(record)}

${renderStats(record)}

${renderShooting(record)}

${renderCardFooter(record)}

</div>

`;

}
/* ======================================================
   Part 3-3
   Pagination / Lazy Render
====================================================== */

const PAGE_SIZE = 20;

state.currentPage = 1;
state.isLoading = false;
state.hasMore = true;

/* ======================================================
   Pagination
====================================================== */

function getFilteredRecords(){

    let records = [...state.records];

    if(state.search){

        const keyword = state.search.toLowerCase();

        records = records.filter(record=>{

            return (

                record.trainingName.toLowerCase().includes(keyword) ||

                record.memo.toLowerCase().includes(keyword)

            );

        });

    }

    if(state.sport!=="all"){

        records = records.filter(

            record=>record.sport===state.sport

        );

    }

    switch(state.sort){

        case "oldest":

            records.sort((a,b)=>

                new Date(a.date)-new Date(b.date)

            );

            break;

        case "distance":

            records.sort((a,b)=>

                b.distance-a.distance

            );

            break;

        case "duration":

            records.sort((a,b)=>

                b.duration-a.duration

            );

            break;

        case "load":

            records.sort((a,b)=>

                b.load-a.load

            );

            break;

        default:

            records.sort((a,b)=>

                new Date(b.date)-new Date(a.date)

            );

    }

    return records;

}

/* ======================================================
   Current Page
====================================================== */

function getCurrentRecords(){

    const records = getFilteredRecords();

    return records.slice(

        0,

        PAGE_SIZE*state.currentPage

    );

}

/* ======================================================
   Render
====================================================== */

function renderSportsPage(){

    const records = getCurrentRecords();

    if(records.length===0){

        renderEmptyState();

        return;

    }

    DOM.list.innerHTML =

        records

        .map(createSportsCard)

        .join("");

    observeBottom();

}

/* ======================================================
   Infinite Scroll
====================================================== */

let observer = null;

function observeBottom(){

    if(observer){

        observer.disconnect();

    }

    const cards =

        DOM.list.querySelectorAll(

            ".sports-card"

        );

    const last =

        cards[cards.length-1];

    if(!last){

        return;

    }

    observer =

        new IntersectionObserver(

            handleObserver,

            {

                threshold:0.2

            }

        );

    observer.observe(last);

}

/* ======================================================
   Observer
====================================================== */

function handleObserver(entries){

    entries.forEach(entry=>{

        if(

            entry.isIntersecting

        ){

            loadNextPage();

        }

    });

}

/* ======================================================
   Next Page
====================================================== */

function loadNextPage(){

    if(state.isLoading){

        return;

    }

    const total=

        getFilteredRecords().length;

    if(

        PAGE_SIZE*

        state.currentPage>=

        total

    ){

        return;

    }

    state.isLoading=true;

    state.currentPage++;

    renderSportsPage();

    state.isLoading=false;

}

/* ======================================================
   Reset Page
====================================================== */

function resetPagination(){

    state.currentPage=1;

}

/* ======================================================
   Search
====================================================== */

let searchTimer=null;

function searchRecords(value){

    clearTimeout(searchTimer);

    searchTimer=setTimeout(()=>{

        state.search=value;

        resetPagination();

        renderSportsPage();

    },300);

}

/* ======================================================
   Filter
====================================================== */

function filterSport(value){

    state.sport=value;

    resetPagination();

    renderSportsPage();

}

/* ======================================================
   Sort
====================================================== */

function sortRecords(value){

    state.sort=value;

    resetPagination();

    renderSportsPage();

}

/* ======================================================
   Events
====================================================== */

function bindSearchEvents(){

    DOM.search?.addEventListener(

        "input",

        e=>{

            searchRecords(

                e.target.value

            );

        }

    );

    DOM.filter?.addEventListener(

        "change",

        e=>{

            filterSport(

                e.target.value

            );

        }

    );

    DOM.sort?.addEventListener(

        "change",

        e=>{

            sortRecords(

                e.target.value

            );

        }

    );

}
/* ======================================================
   Part 4-1
   Statistics Engine
====================================================== */

/* ======================================================
   Statistics
====================================================== */

function calculateStatistics(records = getFilteredRecords()){

    if(records.length===0){

        return getEmptyStatistics();

    }

    const totalDistance = sum(records,"distance");
    const totalDuration = sum(records,"duration");
    const totalLoad = sum(records,"load");

    const averageDistance = average(records,"distance");
    const averageDuration = average(records,"duration");
    const averageSpeed = average(records,"speed");
    const averageHeart = average(records,"averageHeartRate");
    const averageRPE = average(records,"rpe");
    const averageAccuracy = average(records,"accuracy");

    return{

        count:records.length,

        totalDistance,

        totalDuration,

        totalLoad,

        averageDistance,

        averageDuration,

        averageSpeed,

        averageHeart,

        averageRPE,

        averageAccuracy,

        maxDistance:max(records,"distance"),

        maxDuration:max(records,"duration"),

        maxHeart:max(records,"maxHeartRate"),

        maxLoad:max(records,"load"),

        minHeart:min(records,"averageHeartRate")

    };

}

/* ======================================================
   Empty Statistics
====================================================== */

function getEmptyStatistics(){

    return{

        count:0,

        totalDistance:0,

        totalDuration:0,

        totalLoad:0,

        averageDistance:0,

        averageDuration:0,

        averageSpeed:0,

        averageHeart:0,

        averageRPE:0,

        averageAccuracy:0,

        maxDistance:0,

        maxDuration:0,

        maxHeart:0,

        maxLoad:0,

        minHeart:0

    };

}

/* ======================================================
   Utils
====================================================== */

function sum(records,key){

    return records.reduce(

        (total,item)=>

            total+(Number(item[key])||0),

        0

    );

}

function average(records,key){

    if(records.length===0){

        return 0;

    }

    return Number(

        (

            sum(records,key)/

            records.length

        ).toFixed(1)

    );

}

function max(records,key){

    return Math.max(

        ...records.map(

            item=>Number(item[key])||0

        )

    );

}

function min(records,key){

    return Math.min(

        ...records.map(

            item=>Number(item[key])||0

        )

    );

}

/* ======================================================
   Weekly Statistics
====================================================== */

function getWeeklyStatistics(){

    const now = new Date();

    const weekAgo = new Date();

    weekAgo.setDate(

        now.getDate()-7

    );

    const records=

        state.records.filter(record=>{

            return new Date(record.date)>=weekAgo;

        });

    return calculateStatistics(records);

}

/* ======================================================
   Monthly Statistics
====================================================== */

function getMonthlyStatistics(){

    const now=new Date();

    const month=

        now.getMonth();

    const year=

        now.getFullYear();

    const records=

        state.records.filter(record=>{

            const d=

                new Date(record.date);

            return(

                d.getMonth()===month &&

                d.getFullYear()===year

            );

        });

    return calculateStatistics(records);

}

/* ======================================================
   Best Record
====================================================== */

function getBestDistance(){

    return state.records.reduce(

        (best,current)=>{

            if(!best){

                return current;

            }

            return current.distance>

                best.distance

                ?current

                :best;

        },

        null

    );

}

function getBestLoad(){

    return state.records.reduce(

        (best,current)=>{

            if(!best){

                return current;

            }

            return current.load>

                best.load

                ?current

                :best;

        },

        null

    );

}

function getBestAccuracy(){

    return state.records.reduce(

        (best,current)=>{

            if(!best){

                return current;

            }

            return current.accuracy>

                best.accuracy

                ?current

                :best;

        },

        null

    );

}
/* ======================================================
   Part 4-2
   Statistics UI
====================================================== */

/* ======================================================
   DOM
====================================================== */

DOM.totalDistance = $("#statTotalDistance");
DOM.totalDuration = $("#statTotalDuration");
DOM.totalLoad = $("#statTotalLoad");
DOM.averageSpeed = $("#statAverageSpeed");
DOM.averageHeart = $("#statAverageHeart");
DOM.averageRPE = $("#statAverageRPE");
DOM.averageAccuracy = $("#statAverageAccuracy");
DOM.totalTraining = $("#statTrainingCount");

/* ======================================================
   Render Statistics
====================================================== */

function renderStatistics(){

    const stats = calculateStatistics();

    setStat(DOM.totalTraining, stats.count);

    setStat(
        DOM.totalDistance,
        `${stats.totalDistance.toFixed(1)} km`
    );

    setStat(
        DOM.totalDuration,
        `${stats.totalDuration} 분`
    );

    setStat(
        DOM.totalLoad,
        stats.totalLoad
    );

    setStat(
        DOM.averageSpeed,
        `${stats.averageSpeed.toFixed(1)} km/h`
    );

    setStat(
        DOM.averageHeart,
        `${stats.averageHeart.toFixed(0)} bpm`
    );

    setStat(
        DOM.averageRPE,
        stats.averageRPE.toFixed(1)
    );

    setStat(
        DOM.averageAccuracy,
        `${stats.averageAccuracy.toFixed(1)} %`
    );

}

/* ======================================================
   Dashboard Summary
====================================================== */

function renderDashboardSummary(){

    const week = getWeeklyStatistics();

    const month = getMonthlyStatistics();

    const bestDistance = getBestDistance();

    const bestLoad = getBestLoad();

    const bestAccuracy = getBestAccuracy();

    $("#weekDistance").textContent =
        `${week.totalDistance.toFixed(1)} km`;

    $("#weekLoad").textContent =
        week.totalLoad;

    $("#monthDistance").textContent =
        `${month.totalDistance.toFixed(1)} km`;

    $("#monthLoad").textContent =
        month.totalLoad;

    $("#bestDistance").textContent =
        bestDistance
            ?`${bestDistance.distance} km`
            :"0 km";

    $("#bestLoad").textContent =
        bestLoad
            ?bestLoad.load
            :0;

    $("#bestAccuracy").textContent =
        bestAccuracy
            ?`${bestAccuracy.accuracy}%`
            :"0%";

}

/* ======================================================
   Helper
====================================================== */

function setStat(element,value){

    if(!element){

        return;

    }

    element.textContent=value;

}

/* ======================================================
   Weekly Card
====================================================== */

function renderWeeklyCard(){

    const stats=getWeeklyStatistics();

    $("#weeklyCard").innerHTML=

`
<div class="summary-card">

<h3>이번 주</h3>

<p>훈련횟수 : ${stats.count}</p>

<p>거리 : ${stats.totalDistance.toFixed(1)} km</p>

<p>시간 : ${stats.totalDuration}분</p>

<p>훈련부하 : ${stats.totalLoad}</p>

<p>평균 RPE : ${stats.averageRPE.toFixed(1)}</p>

</div>

`;

}

/* ======================================================
   Monthly Card
====================================================== */

function renderMonthlyCard(){

    const stats=getMonthlyStatistics();

    $("#monthlyCard").innerHTML=

`
<div class="summary-card">

<h3>이번 달</h3>

<p>훈련횟수 : ${stats.count}</p>

<p>거리 : ${stats.totalDistance.toFixed(1)} km</p>

<p>시간 : ${stats.totalDuration}분</p>

<p>훈련부하 : ${stats.totalLoad}</p>

<p>평균심박 : ${stats.averageHeart.toFixed(0)}</p>

</div>

`;

}

/* ======================================================
   Personal Best
====================================================== */

function renderBestRecord(){

    const distance=getBestDistance();

    const load=getBestLoad();

    const accuracy=getBestAccuracy();

    $("#bestRecord").innerHTML=

`
<div class="summary-card">

<h3>🏆 Personal Best</h3>

<p>최장거리 :
${distance?distance.distance:0} km</p>

<p>최고부하 :
${load?load.load:0}</p>

<p>최고명중률 :
${accuracy?accuracy.accuracy:0}%</p>

</div>

`;

}

/* ======================================================
   Refresh Statistics
====================================================== */

function refreshStatistics(){

    renderStatistics();

    renderWeeklyCard();

    renderMonthlyCard();

    renderBestRecord();

    renderDashboardSummary();

}
/* ======================================================
   Part 5-1
   Chart.js
====================================================== */

/* ======================================================
   Chart
====================================================== */

state.charts = {

    distance:null,
    duration:null,
    load:null,
    heart:null,
    accuracy:null,
    sport:null

};

/* ======================================================
   Destroy
====================================================== */

function destroyChart(name){

    if(state.charts[name]){

        state.charts[name].destroy();

        state.charts[name]=null;

    }

}

/* ======================================================
   Labels
====================================================== */

function chartLabels(records){

    return records.map(

        record=>record.date

    );

}

/* ======================================================
   Distance Chart
====================================================== */

function renderDistanceChart(){

    const canvas=$("#distanceChart");

    if(!canvas) return;

    destroyChart("distance");

    const records=getFilteredRecords();

    state.charts.distance=new Chart(

        canvas,

        {

            type:"line",

            data:{

                labels:chartLabels(records),

                datasets:[{

                    label:"거리",

                    data:records.map(

                        r=>r.distance

                    ),

                    borderWidth:3,

                    tension:.3,

                    fill:false

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

            }

        }

    );

}

/* ======================================================
   Duration Chart
====================================================== */

function renderDurationChart(){

    const canvas=$("#durationChart");

    if(!canvas) return;

    destroyChart("duration");

    const records=getFilteredRecords();

    state.charts.duration=new Chart(

        canvas,

        {

            type:"bar",

            data:{

                labels:chartLabels(records),

                datasets:[{

                    label:"훈련시간",

                    data:records.map(

                        r=>r.duration

                    )

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}

/* ======================================================
   Training Load
====================================================== */

function renderLoadChart(){

    const canvas=$("#loadChart");

    if(!canvas) return;

    destroyChart("load");

    const records=getFilteredRecords();

    state.charts.load=new Chart(

        canvas,

        {

            type:"line",

            data:{

                labels:chartLabels(records),

                datasets:[{

                    label:"훈련부하",

                    data:records.map(

                        r=>r.load

                    ),

                    borderWidth:3,

                    tension:.4

                }]

            }

        }

    );

}

/* ======================================================
   Heart Rate
====================================================== */

function renderHeartChart(){

    const canvas=$("#heartChart");

    if(!canvas) return;

    destroyChart("heart");

    const records=getFilteredRecords();

    state.charts.heart=new Chart(

        canvas,

        {

            type:"line",

            data:{

                labels:chartLabels(records),

                datasets:[

                    {

                        label:"평균",

                        data:records.map(

                            r=>r.averageHeartRate

                        )

                    },

                    {

                        label:"최대",

                        data:records.map(

                            r=>r.maxHeartRate

                        )

                    }

                ]

            }

        }

    );

}

/* ======================================================
   Accuracy
====================================================== */

function renderAccuracyChart(){

    const canvas=$("#accuracyChart");

    if(!canvas) return;

    destroyChart("accuracy");

    const records=

        getFilteredRecords()

        .filter(

            r=>r.shootingTotal>0

        );

    state.charts.accuracy=new Chart(

        canvas,

        {

            type:"line",

            data:{

                labels:chartLabels(records),

                datasets:[{

                    label:"명중률",

                    data:records.map(

                        r=>r.accuracy

                    ),

                    borderWidth:3

                }]

            }

        }

    );

}

/* ======================================================
   Sport Pie
====================================================== */

function renderSportChart(){

    const canvas=$("#sportChart");

    if(!canvas) return;

    destroyChart("sport");

    const count={};

    getFilteredRecords().forEach(record=>{

        count[record.sport]??=0;

        count[record.sport]++;

    });

    state.charts.sport=new Chart(

        canvas,

        {

            type:"pie",

            data:{

                labels:Object.keys(count).map(

                    k=>SPORTS_TYPES[k]

                ),

                datasets:[{

                    data:Object.values(count)

                }]

            }

        }

    );

}

/* ======================================================
   Refresh Charts
====================================================== */

function refreshCharts(){

    renderDistanceChart();

    renderDurationChart();

    renderLoadChart();

    renderHeartChart();

    renderAccuracyChart();

    renderSportChart();

}
/* ======================================================
   Part 5-2
   Advanced Charts
====================================================== */

/* ======================================================
   Weekly Load Chart
====================================================== */

function renderWeeklyLoadChart(){

    const canvas=$("#weeklyLoadChart");

    if(!canvas) return;

    destroyChart("weeklyLoad");

    const map={};

    state.records.forEach(record=>{

        const week=getWeekKey(record.date);

        map[week]??=0;

        map[week]+=record.load;

    });

    state.charts.weeklyLoad=new Chart(canvas,{

        type:"bar",

        data:{

            labels:Object.keys(map),

            datasets:[{

                label:"주간 훈련부하",

                data:Object.values(map),

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false

        }

    });

}

/* ======================================================
   Monthly Distance
====================================================== */

function renderMonthlyDistanceChart(){

    const canvas=$("#monthlyDistanceChart");

    if(!canvas) return;

    destroyChart("monthlyDistance");

    const map={};

    state.records.forEach(record=>{

        const month=record.date.substring(0,7);

        map[month]??=0;

        map[month]+=record.distance;

    });

    state.charts.monthlyDistance=new Chart(canvas,{

        type:"bar",

        data:{

            labels:Object.keys(map),

            datasets:[{

                label:"월간 거리",

                data:Object.values(map)

            }]

        }

    });

}

/* ======================================================
   Heart Zone
====================================================== */

function renderHeartZoneChart(){

    const canvas=$("#heartZoneChart");

    if(!canvas) return;

    destroyChart("heartZone");

    const zone=[0,0,0,0,0];

    state.records.forEach(record=>{

        const hr=record.averageHeartRate;

        if(hr<120){

            zone[0]++;

        }else if(hr<140){

            zone[1]++;

        }else if(hr<160){

            zone[2]++;

        }else if(hr<180){

            zone[3]++;

        }else{

            zone[4]++;

        }

    });

    state.charts.heartZone=new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:[

                "Zone1",

                "Zone2",

                "Zone3",

                "Zone4",

                "Zone5"

            ],

            datasets:[{

                data:zone

            }]

        }

    });

}

/* ======================================================
   RPE Chart
====================================================== */

function renderRPEChart(){

    const canvas=$("#rpeChart");

    if(!canvas) return;

    destroyChart("rpe");

    const records=getFilteredRecords();

    state.charts.rpe=new Chart(canvas,{

        type:"line",

        data:{

            labels:chartLabels(records),

            datasets:[{

                label:"RPE",

                data:records.map(r=>r.rpe),

                borderWidth:3,

                tension:.35

            }]

        }

    });

}

/* ======================================================
   Pace Chart
====================================================== */

function renderPaceChart(){

    const canvas=$("#paceChart");

    if(!canvas) return;

    destroyChart("pace");

    const records=getFilteredRecords();

    state.charts.pace=new Chart(canvas,{

        type:"line",

        data:{

            labels:chartLabels(records),

            datasets:[{

                label:"평균 페이스",

                data:records.map(r=>{

                    if(!r.distance)return 0;

                    return (r.duration/r.distance).toFixed(2);

                })

            }]

        }

    });

}

/* ======================================================
   Dashboard Mini Charts
====================================================== */

function renderMiniCharts(){

    renderWeeklyLoadChart();

    renderMonthlyDistanceChart();

    renderHeartZoneChart();

    renderRPEChart();

    renderPaceChart();

}

/* ======================================================
   Chart Animation
====================================================== */

Chart.defaults.animation.duration=800;

Chart.defaults.animation.easing="easeOutQuart";

Chart.defaults.plugins.legend.position="bottom";

/* ======================================================
   Week Helper
====================================================== */

function getWeekKey(date){

    const d=new Date(date);

    const first=new Date(

        d.getFullYear(),

        0,

        1

    );

    const day=Math.floor(

        (d-first)/86400000

    );

    const week=Math.ceil(

        (day+first.getDay()+1)/7

    );

    return `${d.getFullYear()}-${week}주`;

}

/* ======================================================
   Refresh All Charts
====================================================== */

function refreshAllCharts(){

    refreshCharts();

    renderMiniCharts();

}
/* ======================================================
   Part 6-1
   AI Analysis Engine
====================================================== */

/* ======================================================
   AI
====================================================== */

function analyzeTraining(){

    const records=getFilteredRecords();

    if(records.length===0){

        renderAIMessage([

            "훈련기록이 없습니다."

        ]);

        return;

    }

    const result=[];

    analyzeLoad(records,result);

    analyzeHeart(records,result);

    analyzeAccuracy(records,result);

    analyzeRecovery(records,result);

    analyzeProgress(records,result);

    analyzeConsistency(records,result);

    renderAIMessage(result);

}

/* ======================================================
   Training Load
====================================================== */

function analyzeLoad(records,result){

    const avg=average(records,"load");

    if(avg>=900){

        result.push(

            "🔥 평균 훈련부하가 매우 높습니다. 회복훈련을 권장합니다."

        );

    }else if(avg>=700){

        result.push(

            "⚠️ 최근 훈련강도가 높은 편입니다."

        );

    }else{

        result.push(

            "✅ 훈련부하가 안정적으로 유지되고 있습니다."

        );

    }

}

/* ======================================================
   Heart Rate
====================================================== */

function analyzeHeart(records,result){

    const avg=average(

        records,

        "averageHeartRate"

    );

    if(avg>=180){

        result.push(

            "❤️ 평균 심박수가 매우 높습니다."

        );

    }else if(avg>=165){

        result.push(

            "💪 고강도 훈련이 지속되고 있습니다."

        );

    }else{

        result.push(

            "😊 심박수가 안정적인 범위입니다."

        );

    }

}

/* ======================================================
   Shooting
====================================================== */

function analyzeAccuracy(records,result){

    const shooting=

        records.filter(

            r=>r.shootingTotal>0

        );

    if(shooting.length===0){

        return;

    }

    const accuracy=

        average(

            shooting,

            "accuracy"

        );

    if(accuracy>=90){

        result.push(

            "🎯 사격 명중률이 매우 우수합니다."

        );

    }else if(accuracy>=80){

        result.push(

            "🎯 명중률이 안정적으로 유지됩니다."

        );

    }else{

        result.push(

            "🎯 사격 집중훈련이 필요합니다."

        );

    }

}

/* ======================================================
   Recovery
====================================================== */

function analyzeRecovery(records,result){

    const recent=

        records

        .slice(0,5);

    const load=

        average(

            recent,

            "load"

        );

    const rpe=

        average(

            recent,

            "rpe"

        );

    if(load>850&&rpe>=8){

        result.push(

            "😴 회복훈련 또는 휴식을 권장합니다."

        );

    }

}

/* ======================================================
   Progress
====================================================== */

function analyzeProgress(records,result){

    if(records.length<6){

        return;

    }

    const first=

        average(

            records.slice(-5),

            "distance"

        );

    const last=

        average(

            records.slice(0,5),

            "distance"

        );

    if(last>first){

        result.push(

            "📈 최근 훈련량이 증가하고 있습니다."

        );

    }else{

        result.push(

            "📉 최근 훈련량이 감소했습니다."

        );

    }

}

/* ======================================================
   Consistency
====================================================== */

function analyzeConsistency(records,result){

    const dates=[

        ...new Set(

            records.map(

                r=>r.date

            )

        )

    ];

    if(dates.length>=20){

        result.push(

            "🏆 매우 꾸준하게 훈련 중입니다."

        );

    }else if(dates.length>=10){

        result.push(

            "👍 꾸준한 훈련을 유지하고 있습니다."

        );

    }else{

        result.push(

            "📅 훈련 빈도를 조금 더 늘려보세요."

        );

    }

}

/* ======================================================
   Render
====================================================== */

function renderAIMessage(messages){

    const box=$("#aiAnalysis");

    if(!box){

        return;

    }

    box.innerHTML=

        messages

        .map(message=>

`

<div class="ai-card">

${message}

</div>

`

        )

        .join("");

}

/* ======================================================
   Refresh
====================================================== */

function refreshAI(){

    analyzeTraining();

}
/* ======================================================
   Part 6-2
   Advanced AI Analysis
====================================================== */

/* ======================================================
   AI Score
====================================================== */

function calculateTrainingScore(){

    const stats = calculateStatistics();

    let score = 100;

    if(stats.averageRPE > 8){

        score -= 15;

    }

    if(stats.averageHeart > 175){

        score -= 10;

    }

    if(stats.averageLoad > 850){

        score -= 20;

    }

    if(stats.averageAccuracy < 75){

        score -= 10;

    }

    if(stats.count < 5){

        score -= 15;

    }

    return Math.max(0,Math.round(score));

}

/* ======================================================
   Over Training
====================================================== */

function detectOverTraining(){

    const recent = state.records.slice(0,7);

    if(recent.length < 5){

        return false;

    }

    const load = average(recent,"load");

    const rpe = average(recent,"rpe");

    const heart = average(recent,"averageHeartRate");

    return (

        load > 900 &&

        rpe >= 8 &&

        heart >= 170

    );

}

/* ======================================================
   Acute Chronic Ratio
====================================================== */

function calculateACWR(){

    const acute = average(

        state.records.slice(0,7),

        "load"

    );

    const chronic = average(

        state.records.slice(0,28),

        "load"

    );

    if(chronic===0){

        return 0;

    }

    return Number(

        (acute/chronic)

        .toFixed(2)

    );

}

/* ======================================================
   Recovery Recommendation
====================================================== */

function getRecoveryMessage(){

    if(detectOverTraining()){

        return "🔴 과훈련 위험입니다. 1~2일 회복훈련을 권장합니다.";

    }

    const acwr = calculateACWR();

    if(acwr>1.5){

        return "🟠 훈련량이 급격히 증가했습니다.";

    }

    if(acwr<0.8){

        return "🟢 안정적인 훈련 상태입니다.";

    }

    return "🟡 현재 훈련량은 적절합니다.";

}

/* ======================================================
   Sport Recommendation
====================================================== */

function recommendTraining(){

    const sport = DOM.sport.value;

    switch(sport){

        case "biathlon":

            return "🎯 사격 집중 + 저강도 스키";

        case "rollerski":

            return "🛼 인터벌 훈련";

        case "running":

            return "🏃 템포런";

        case "cycling":

            return "🚴 지구력 라이딩";

        case "shooting":

            return "🎯 복사/입사 반복훈련";

        default:

            return "💪 회복 및 기술훈련";

    }

}

/* ======================================================
   Trend
====================================================== */

function trainingTrend(){

    if(state.records.length<10){

        return "데이터 부족";

    }

    const recent = average(

        state.records.slice(0,5),

        "load"

    );

    const old = average(

        state.records.slice(5,10),

        "load"

    );

    if(recent>old){

        return "📈 상승";

    }

    if(recent<old){

        return "📉 감소";

    }

    return "➖ 유지";

}

/* ======================================================
   Weekly Compare
====================================================== */

function compareWeek(){

    const week = getWeeklyStatistics();

    const month = getMonthlyStatistics();

    if(week.totalLoad>month.averageLoad){

        return "최근 훈련강도가 높습니다.";

    }

    return "평균 수준을 유지합니다.";

}

/* ======================================================
   Report
====================================================== */

function generateAIReport(){

    return{

        score:calculateTrainingScore(),

        recovery:getRecoveryMessage(),

        recommendation:recommendTraining(),

        trend:trainingTrend(),

        week:compareWeek(),

        acwr:calculateACWR()

    };

}

/* ======================================================
   Render AI Report
====================================================== */

function renderAdvancedAI(){

    const report = generateAIReport();

    const box = $("#aiAdvanced");

    if(!box){

        return;

    }

    box.innerHTML =

`
<div class="ai-report">

<h2>AI 훈련 분석</h2>

<p>훈련 점수 : <strong>${report.score}점</strong></p>

<p>${report.recovery}</p>

<p>추천훈련 : ${report.recommendation}</p>

<p>훈련추세 : ${report.trend}</p>

<p>${report.week}</p>

<p>ACWR : ${report.acwr}</p>

</div>

`;

}

/* ======================================================
   Refresh
====================================================== */

function refreshAdvancedAI(){

    refreshAI();

    renderAdvancedAI();

}
/* ======================================================
   Part 7-1
   Export / Import
====================================================== */

/* ======================================================
   Export CSV
====================================================== */

function exportCSV(){

    const records = getFilteredRecords();

    if(records.length===0){

        toast("내보낼 데이터가 없습니다.","warning");

        return;

    }

    const headers=[

        "날짜",
        "종목",
        "훈련명",
        "거리",
        "시간",
        "평균심박",
        "최대심박",
        "RPE",
        "훈련부하",
        "명중률",
        "날씨",
        "컨디션",
        "메모"

    ];

    const rows=records.map(record=>[

        record.date,
        SPORTS_TYPES[record.sport],
        record.trainingName,
        record.distance,
        record.duration,
        record.averageHeartRate,
        record.maxHeartRate,
        record.rpe,
        record.load,
        record.accuracy,
        WEATHER_TYPES[record.weather],
        CONDITION_TYPES[record.condition],
        record.memo

    ]);

    downloadCSV(

        "sports_records.csv",

        [

            headers,

            ...rows

        ]

    );

}

/* ======================================================
   Download CSV
====================================================== */

function downloadCSV(filename,data){

    const csv=data

        .map(row=>

            row.map(item=>`"${item}"`).join(",")

        )

        .join("\n");

    const blob=new Blob(

        [

            "\ufeff"+csv

        ],

        {

            type:"text/csv"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const a=

        document.createElement("a");

    a.href=url;

    a.download=filename;

    a.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   Export JSON
====================================================== */

function exportJSON(){

    const blob=new Blob(

        [

            JSON.stringify(

                state.records,

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=

        URL.createObjectURL(blob);

    const a=

        document.createElement("a");

    a.href=url;

    a.download="sports_backup.json";

    a.click();

    URL.revokeObjectURL(url);

}

/* ======================================================
   Import JSON
====================================================== */

function importJSON(file){

    const reader=

        new FileReader();

    reader.onload=e=>{

        try{

            const data=

                JSON.parse(

                    e.target.result

                );

            if(

                !Array.isArray(data)

            ){

                throw Error();

            }

            state.records=data;

            save();

            renderSportsPage();

            refreshStatistics();

            refreshAllCharts();

            refreshAdvancedAI();

            toast(

                "복원이 완료되었습니다."

            );

        }catch{

            toast(

                "파일 형식이 올바르지 않습니다.",

                "error"

            );

        }

    };

    reader.readAsText(file);

}

/* ======================================================
   Export Print
====================================================== */

function printReport(){

    window.print();

}

/* ======================================================
   Backup
====================================================== */

function backupLocal(){

    localStorage.setItem(

        "sports_backup",

        JSON.stringify(

            state.records

        )

    );

}

/* ======================================================
   Restore
====================================================== */

function restoreLocal(){

    const backup=

        localStorage.getItem(

            "sports_backup"

        );

    if(!backup){

        return;

    }

    state.records=

        JSON.parse(backup);

    save();

    renderSportsPage();

}
/* ======================================================
   Part 7-2
   Excel / PDF / Auto Backup
====================================================== */

/* ======================================================
   Excel Export (SheetJS 필요)
====================================================== */

function exportExcel(){

    if(typeof XLSX==="undefined"){

        toast("SheetJS가 필요합니다.","error");

        return;

    }

    const data=getFilteredRecords();

    const worksheet=XLSX.utils.json_to_sheet(data);

    const workbook=XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Training"

    );

    XLSX.writeFile(

        workbook,

        "sports_records.xlsx"

    );

}

/* ======================================================
   PDF Export (jsPDF 필요)
====================================================== */

function exportPDF(){

    if(typeof window.jspdf==="undefined"){

        toast("jsPDF가 필요합니다.","error");

        return;

    }

    const { jsPDF } = window.jspdf;

    const pdf=new jsPDF();

    pdf.setFontSize(18);

    pdf.text(

        "Sports Training Report",

        20,

        20

    );

    pdf.setFontSize(11);

    let y=35;

    state.records.forEach(record=>{

        pdf.text(

            `${record.date} | ${record.trainingName} | ${record.distance}km | Load:${record.load}`,

            15,

            y

        );

        y+=8;

        if(y>270){

            pdf.addPage();

            y=20;

        }

    });

    pdf.save("training_report.pdf");

}

/* ======================================================
   Auto Backup
====================================================== */

function autoBackup(){

    const backup={

        version:"1.0",

        date:new Date().toISOString(),

        records:state.records

    };

    localStorage.setItem(

        "sports_auto_backup",

        JSON.stringify(backup)

    );

}

/* ======================================================
   Restore Auto Backup
====================================================== */

function restoreAutoBackup(){

    const backup=localStorage.getItem(

        "sports_auto_backup"

    );

    if(!backup){

        return;

    }

    try{

        const data=JSON.parse(backup);

        if(Array.isArray(data.records)){

            state.records=data.records;

            save();

        }

    }catch(e){

        console.error(e);

    }

}

/* ======================================================
   Backup History
====================================================== */

function saveBackupHistory(){

    const history=

        JSON.parse(

            localStorage.getItem(

                "sports_backup_history"

            )||"[]"

        );

    history.unshift({

        date:new Date().toISOString(),

        count:state.records.length,

        data:clone(state.records)

    });

    if(history.length>10){

        history.length=10;

    }

    localStorage.setItem(

        "sports_backup_history",

        JSON.stringify(history)

    );

}

/* ======================================================
   Load Backup History
====================================================== */

function loadBackupHistory(){

    return JSON.parse(

        localStorage.getItem(

            "sports_backup_history"

        )||"[]"

    );

}

/* ======================================================
   Restore History
====================================================== */

function restoreBackup(index){

    const history=loadBackupHistory();

    if(!history[index]){

        return;

    }

    state.records=history[index].data;

    save();

    refreshModules();

    toast("백업을 복원했습니다.");

}

/* ======================================================
   Download Backup
====================================================== */

function downloadBackup(){

    saveBackupHistory();

    exportJSON();

}

/* ======================================================
   Auto Save Timer
====================================================== */

function initializeBackup(){

    autoBackup();

    setInterval(

        autoBackup,

        1000*60*5

    );

}
/* ======================================================
   Part 8-1
   Dashboard & Real-Time
====================================================== */

/* ======================================================
   Dashboard
====================================================== */

function refreshDashboard(){

    renderTodaySummary();

    renderRecentTraining();

    renderPersonalBest();

    renderWeeklySummary();

    renderClock();

}

/* ======================================================
   Today Summary
====================================================== */

function renderTodaySummary(){

    const todayRecords=state.records.filter(

        r=>r.date===today()

    );

    const box=$("#todaySummary");

    if(!box) return;

    const distance=sum(todayRecords,"distance");

    const duration=sum(todayRecords,"duration");

    const load=sum(todayRecords,"load");

    box.innerHTML=

`
<div class="summary-item">

<h3>${todayRecords.length}</h3>

<p>오늘 훈련</p>

</div>

<div class="summary-item">

<h3>${distance.toFixed(1)} km</h3>

<p>거리</p>

</div>

<div class="summary-item">

<h3>${duration} min</h3>

<p>시간</p>

</div>

<div class="summary-item">

<h3>${Math.round(load)}</h3>

<p>Load</p>

</div>

`;

}

/* ======================================================
   Recent Training
====================================================== */

function renderRecentTraining(){

    const list=$("#recentTraining");

    if(!list) return;

    list.innerHTML=

        state.records

        .slice(0,5)

        .map(record=>`

<div class="recent-card">

<strong>${record.trainingName}</strong>

<p>${record.date}</p>

<p>${SPORTS_TYPES[record.sport]}</p>

</div>

`)

.join("");

}

/* ======================================================
   Personal Best
====================================================== */

function renderPersonalBest(){

    const best=$("#bestRecord");

    if(!best) return;

    const distance=getBestDistance();

    const load=getBestLoad();

    const accuracy=getBestAccuracy();

    best.innerHTML=

`

<div>

<h4>최장거리</h4>

<strong>${distance} km</strong>

</div>

<div>

<h4>최고 Load</h4>

<strong>${load}</strong>

</div>

<div>

<h4>최고 명중률</h4>

<strong>${accuracy}%</strong>

</div>

`;

}

/* ======================================================
   Weekly Summary
====================================================== */

function renderWeeklySummary(){

    const week=getWeeklyStatistics();

    const box=$("#weeklySummary");

    if(!box) return;

    box.innerHTML=

`

<p>이번주 훈련 : ${week.count}회</p>

<p>거리 : ${week.totalDistance.toFixed(1)} km</p>

<p>시간 : ${week.totalDuration}분</p>

<p>Load : ${Math.round(week.totalLoad)}</p>

`;

}

/* ======================================================
   Live Clock
====================================================== */

function renderClock(){

    const clock=$("#clock");

    if(!clock) return;

    const now=new Date();

    clock.textContent=

        now.toLocaleString(

            "ko-KR"

        );

}

/* ======================================================
   Clock Timer
====================================================== */

function startClock(){

    renderClock();

    setInterval(

        renderClock,

        1000

    );

}
/* ======================================================
   Part 8-2
   Final System & Bootstrap
====================================================== */

/* ======================================================
   Theme
====================================================== */

function loadTheme(){

    const theme=

        localStorage.getItem("theme")||

        "light";

    document.documentElement

        .setAttribute(

            "data-theme",

            theme

        );

}

function toggleTheme(){

    const current=

        document.documentElement

        .getAttribute(

            "data-theme"

        );

    const next=

        current==="dark"

        ?"light"

        :"dark";

    document.documentElement

        .setAttribute(

            "data-theme",

            next

        );

    localStorage.setItem(

        "theme",

        next

    );

}

/* ======================================================
   Goal Notification
====================================================== */

function checkGoals(){

    const stats=

        calculateStatistics();

    if(stats.totalDistance>=100){

        toast(

            "🏅 총 100km를 달성했습니다!"

        );

    }

    if(stats.count>=50){

        toast(

            "🔥 훈련 50회를 달성했습니다!"

        );

    }

}

/* ======================================================
   Online Status
====================================================== */

function updateNetworkStatus(){

    const badge=$("#networkStatus");

    if(!badge){

        return;

    }

    if(navigator.onLine){

        badge.textContent="🟢 Online";

    }else{

        badge.textContent="🔴 Offline";

    }

}

function initializeNetwork(){

    updateNetworkStatus();

    window.addEventListener(

        "online",

        updateNetworkStatus

    );

    window.addEventListener(

        "offline",

        updateNetworkStatus

    );

}

/* ======================================================
   Notification Permission
====================================================== */

async function requestNotification(){

    if(

        !("Notification" in window)

    ){

        return;

    }

    if(

        Notification.permission==="default"

    ){

        await Notification.requestPermission();

    }

}

function sendNotification(title,body){

    if(

        Notification.permission!

        =="granted"

    ){

        return;

    }

    new Notification(

        title,

        {

            body

        }

    );

}

/* ======================================================
   Auto Refresh
====================================================== */

function startRealtime(){

    setInterval(()=>{

        refreshDashboard();

    },60000);

}

/* ======================================================
   Initialize
====================================================== */

function initializeApp(){

    cacheDOM();

    load();

    loadTheme();

    loadDraft();

    initializeForm();

    initializeCRUD();

    bindSearchEvents();

    initializeBackup();

    initializeNetwork();

    startClock();

    startRealtime();

    renderSportsPage();

    refreshStatistics();

    refreshAllCharts();

    refreshAdvancedAI();

    refreshDashboard();

    requestNotification();

    checkGoals();

}

/* ======================================================
   DOM Ready
====================================================== */

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);

/* ======================================================
   Window Export
====================================================== */

Object.assign(window,{

    saveSportsRecord,

    editSportsRecord,

    deleteSportsRecord,

    exportCSV,

    exportExcel,

    exportJSON,

    exportPDF,

    importJSON,

    printReport,

    toggleTheme,

    refreshDashboard,

    refreshStatistics,

    refreshAllCharts,

    refreshAdvancedAI

});
/* ======================================================
   Part 9
   Optimization & Final Utilities
====================================================== */

/* ======================================================
   Debounce
====================================================== */

function debounce(fn, delay = 300){

    let timer = null;

    return function(...args){

        clearTimeout(timer);

        timer = setTimeout(()=>{

            fn.apply(this,args);

        },delay);

    };

}

/* ======================================================
   Throttle
====================================================== */

function throttle(fn, limit = 200){

    let waiting = false;

    return function(...args){

        if(waiting){

            return;

        }

        waiting = true;

        fn.apply(this,args);

        setTimeout(()=>{

            waiting = false;

        },limit);

    };

}

/* ======================================================
   Safe JSON
====================================================== */

function safeJSON(value,fallback=null){

    try{

        return JSON.parse(value);

    }catch{

        return fallback;

    }

}

/* ======================================================
   Format Number
====================================================== */

function formatNumber(value,digits=1){

    return Number(value||0).toLocaleString(

        "ko-KR",

        {

            minimumFractionDigits:digits,

            maximumFractionDigits:digits

        }

    );

}

/* ======================================================
   Format Time
====================================================== */

function formatMinutes(minutes){

    const h=Math.floor(minutes/60);

    const m=minutes%60;

    if(h===0){

        return `${m}분`;

    }

    return `${h}시간 ${m}분`;

}

/* ======================================================
   Scroll Top
====================================================== */

function scrollTopSmooth(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ======================================================
   Loading
====================================================== */

function showLoading(){

    document.body.classList.add(

        "loading"

    );

}

function hideLoading(){

    document.body.classList.remove(

        "loading"

    );

}

/* ======================================================
   Error Handler
====================================================== */

window.addEventListener(

    "error",

    event=>{

        console.error(event.error);

        toast(

            "오류가 발생했습니다.",

            "error"

        );

    }

);

window.addEventListener(

    "unhandledrejection",

    event=>{

        console.error(event.reason);

        toast(

            "예상하지 못한 오류가 발생했습니다.",

            "error"

        );

    }

);

/* ======================================================
   Resize
====================================================== */

window.addEventListener(

    "resize",

    debounce(()=>{

        refreshDashboard();

        refreshAllCharts();

    },300)

);

/* ======================================================
   Visibility
====================================================== */

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(

            !document.hidden

        ){

            refreshModules();

        }

    }

);

/* ======================================================
   Keyboard Shortcuts
====================================================== */

document.addEventListener(

    "keydown",

    e=>{

        if(e.ctrlKey && e.key==="s"){

            e.preventDefault();

            saveSportsRecord();

        }

        if(e.ctrlKey && e.key==="e"){

            e.preventDefault();

            exportCSV();

        }

        if(e.key==="Escape"){

            resetForm();

        }

    }

);

/* ======================================================
   Performance Monitor
====================================================== */

function performanceLog(name,callback){

    const start=performance.now();

    callback();

    console.log(

        `${name}: ${

            (

                performance.now()-start

            ).toFixed(2)

        } ms`

    );

}

/* ======================================================
   Health Check
====================================================== */

function systemHealth(){

    return{

        records:state.records.length,

        charts:Object.keys(

            state.charts

        ).length,

        online:navigator.onLine,

        theme:

            document.documentElement.getAttribute(

                "data-theme"

            ),

        version:"1.0.0"

    };

}

/* ======================================================
   Console Banner
====================================================== */

console.log(

`

███████╗██████╗  ██████╗ ██████╗ ████████╗███████╗
██╔════╝██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝
███████╗██████╔╝██║   ██║██████╔╝   ██║   ███████╗
╚════██║██╔═══╝ ██║   ██║██╔══██╗   ██║   ╚════██║
███████║██║     ╚██████╔╝██║  ██║   ██║   ███████║
╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝

Sports Training Manager
Version 1.0.0

`

);

/* ======================================================
   End
====================================================== */