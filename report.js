// ==========================================
// report.js
// 설천고 스포츠과학 훈련센터
// 선수 종합 분석 보고서
// ==========================================

(function () {
  "use strict";

  // HTML 요소 가져오기
  const $ = (id) => document.getElementById(id);

  const elements = {
    average: $("reportAverage"),
    best: $("reportBest"),
    count: $("reportCount"),
    latest: $("reportLatest"),

    ai: $("reportAI"),
    recommendation: $("reportRecommendation"),
    chart: $("reportChart"),

    makeButton: $("makeReport"),
    printButton: $("printReport"),

    playerName: $("reportPlayerName"),
    mainSport: $("reportMainSport"),
    mainSkill: $("reportMainSkill"),

    reportDate: $("reportDate"),
    reportArea: $("reportArea")
  };


  // ==========================================
  // 전체 기록 가져오기
  // ==========================================

  function getAllRecords() {

    // records.js의 기록 배열이 있으면 사용
    if (Array.isArray(window.records)) {
      return window.records;
    }

    // localStorage에서 기록 불러오기
    try {

      const savedRecords =
        JSON.parse(
          localStorage.getItem("records") || "[]"
        );

      if (Array.isArray(savedRecords)) {
        return savedRecords;
      }

      return [];

    } catch (error) {

      console.error(
        "훈련 기록을 불러오지 못했습니다.",
        error
      );

      return [];
    }
  }


  // ==========================================
  // 현재 선택된 선수 이름 가져오기
  // ==========================================

  function getCurrentAthleteName() {

    // app.js의 현재 선수 변수 확인
    if (
      typeof window.currentAthlete === "string" &&
      window.currentAthlete.trim()
    ) {
      return window.currentAthlete.trim();
    }

    // 저장된 선수 이름 확인
    const savedAthlete =
      localStorage.getItem("currentAthlete") ||
      localStorage.getItem("selectedAthlete") ||
      "";

    return savedAthlete.trim();
  }


  // ==========================================
  // 기록 속 선수 이름 가져오기
  // ==========================================

  function getRecordPlayer(record) {

    return String(
      record.player ??
      record.athlete ??
      record.name ??
      ""
    ).trim();
  }


  // ==========================================
  // 기록 속 점수 가져오기
  // ==========================================

  function getRecordScore(record) {

    const score = Number(record.score);

    if (Number.isFinite(score)) {
      return score;
    }

    return 0;
  }


  // ==========================================
  // 기록 날짜 가져오기
  // ==========================================

  function getRecordDate(record) {

    const dateValue =
      record.date ??
      record.createdAt ??
      record.time ??
      record.timestamp;

    const date =
      dateValue
        ? new Date(dateValue)
        : new Date(0);

    if (Number.isNaN(date.getTime())) {
      return new Date(0);
    }

    return date;
  }


  // ==========================================
  // 현재 선수의 기록만 가져오기
  // ==========================================

  function getAthleteRecords() {

    const athlete =
      getCurrentAthleteName();

    if (!athlete) {
      return [];
    }

    return getAllRecords()

      .filter((record) => {

        return (
          getRecordPlayer(record) === athlete
        );

      })

      .sort((a, b) => {

        return (
          getRecordDate(a) -
          getRecordDate(b)
        );

      });
  }
  // ==========================================
  // 평균 점수 계산
  // ==========================================

  function calculateAverage(recordList) {

    if (!recordList.length) {
      return 0;
    }

    const totalScore =
      recordList.reduce((sum, record) => {

        return sum + getRecordScore(record);

      }, 0);

    return Number(
      (totalScore / recordList.length).toFixed(1)
    );
  }


  // ==========================================
  // 최고 점수 계산
  // ==========================================

  function calculateBest(recordList) {

    if (!recordList.length) {
      return 0;
    }

    const scores =
      recordList.map((record) => {

        return getRecordScore(record);

      });

    return Math.max(...scores);
  }


  // ==========================================
  // 최근 점수 계산
  // ==========================================

  function calculateLatest(recordList) {

    if (!recordList.length) {
      return 0;
    }

    const latestRecord =
      recordList[recordList.length - 1];

    return getRecordScore(latestRecord);
  }


  // ==========================================
  // 최근 점수 변화 계산
  // ==========================================

  function calculateChange(recordList) {

    if (recordList.length < 2) {
      return 0;
    }

    const latestScore =
      getRecordScore(
        recordList[recordList.length - 1]
      );

    const previousScore =
      getRecordScore(
        recordList[recordList.length - 2]
      );

    return Number(
      (latestScore - previousScore).toFixed(1)
    );
  }


  // ==========================================
  // 가장 많이 훈련한 값 찾기
  // ==========================================

  function findMostFrequent(
    recordList,
    key,
    fallback = "-"
  ) {

    if (!recordList.length) {
      return fallback;
    }

    const countMap = {};

    recordList.forEach((record) => {

      const value =
        String(record[key] || fallback).trim()
        || fallback;

      countMap[value] =
        (countMap[value] || 0) + 1;
    });

    const sortedValues =
      Object.entries(countMap)
        .sort((a, b) => {

          return b[1] - a[1];

        });

    if (!sortedValues.length) {
      return fallback;
    }

    return sortedValues[0][0];
  }


  // ==========================================
  // 주요 종목 찾기
  // ==========================================

  function findMainSport(recordList) {

    return findMostFrequent(
      recordList,
      "sport"
    );
  }


  // ==========================================
  // 주요 기술 찾기
  // ==========================================

  function findMainSkill(recordList) {

    return findMostFrequent(
      recordList,
      "skill"
    );
  }


  // ==========================================
  // AI 종합평가 만들기
  // ==========================================

  function createEvaluation(
    average,
    change,
    count
  ) {

    if (!count) {

      return (
        "아직 저장된 훈련 기록이 없습니다. " +
        "훈련을 진행한 뒤 기록을 저장해 주세요."
      );
    }

    let levelText = "";

    if (average >= 95) {

      levelText =
        "최상급 수행 수준입니다. " +
        "높은 정확도와 안정성을 꾸준히 유지하고 있습니다.";

    } else if (average >= 90) {

      levelText =
        "매우 우수한 수행입니다. " +
        "세부 기술의 완성도를 높이면 더 좋은 결과를 기대할 수 있습니다.";

    } else if (average >= 85) {

      levelText =
        "좋은 수행 수준입니다. " +
        "반복 훈련을 통해 동작의 일관성을 높이는 것이 좋습니다.";

    } else if (average >= 75) {

      levelText =
        "기본 수행 능력은 안정적입니다. " +
        "정확도와 균형 능력을 집중적으로 보완해 주세요.";

    } else {

      levelText =
        "기본기 중심의 단계적인 훈련이 필요합니다. " +
        "낮은 강도에서 정확한 동작을 반복해 주세요.";
    }

    let trendText = "";

    if (change >= 5) {

      trendText =
        "최근 기록이 크게 향상되는 상승 흐름입니다.";

    } else if (change > 0) {

      trendText =
        "최근 기록이 조금씩 향상되고 있습니다.";

    } else if (change === 0) {

      trendText =
        "최근 수행 수준이 안정적으로 유지되고 있습니다.";

    } else if (change > -5) {

      trendText =
        "최근 점수가 조금 낮아졌습니다. " +
        "피로도와 훈련 강도를 함께 확인해 주세요.";

    } else {

      trendText =
        "최근 점수가 크게 낮아졌습니다. " +
        "충분히 회복한 뒤 자세와 기본 동작을 다시 점검해 주세요.";
    }

    return `${levelText} ${trendText}`;
  }
  // ==========================================
  // 추천 훈련 만들기
  // ==========================================

  function createRecommendations(
    average,
    change,
    mainSport,
    mainSkill
  ) {

    const recommendations = [];

    if (average < 75) {

      recommendations.push(
        "기본 자세 연습 15~20분"
      );

      recommendations.push(
        "저강도 정확도 훈련 20분"
      );

      recommendations.push(
        "균형 및 코어 안정화 훈련 15분"
      );

    } else if (average < 85) {

      recommendations.push(
        "기술 반복 훈련 20~25분"
      );

      recommendations.push(
        "정확도 중심 훈련 15분"
      );

      recommendations.push(
        "훈련 영상 확인 및 자세 교정"
      );

    } else if (average < 95) {

      recommendations.push(
        "실전 상황 기술 훈련 25분"
      );

      recommendations.push(
        "반응 속도 및 집중력 훈련 15분"
      );

      recommendations.push(
        "고난도 세부 기술 보완"
      );

    } else {

      recommendations.push(
        "현재 기술 수준 유지 훈련"
      );

      recommendations.push(
        "실전 압박 상황 훈련"
      );

      recommendations.push(
        "회복과 컨디션 관리"
      );
    }

    if (change < 0) {

      recommendations.push(
        "훈련 강도를 잠시 조절하고 회복 상태 확인"
      );
    }

    if (mainSport !== "-") {

      recommendations.push(
        `${mainSport} 종목의 핵심 기술 집중 점검`
      );
    }

    if (mainSkill !== "-") {

      recommendations.push(
        `${mainSkill} 동작의 정확성과 일관성 확인`
      );
    }

    return [...new Set(recommendations)];
  }


  // ==========================================
  // 텍스트 넣기
  // ==========================================

  function setText(element, value) {

    if (element) {

      element.textContent = value;
    }
  }


  // ==========================================
  // HTML 넣기
  // ==========================================

  function setHTML(element, value) {

    if (element) {

      element.innerHTML = value;
    }
  }


  // ==========================================
  // 날짜 형식 만들기
  // ==========================================

  function formatDate(date = new Date()) {

    return new Intl.DateTimeFormat(
      "ko-KR",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    ).format(date);
  }


  // ==========================================
  // 기록이 없을 때 보고서 화면
  // ==========================================

  function renderEmptyReport() {

    setText(
      elements.playerName,
      "선수를 선택해 주세요"
    );

    setText(
      elements.average,
      "0점"
    );

    setText(
      elements.best,
      "0점"
    );

    setText(
      elements.count,
      "0회"
    );

    setText(
      elements.latest,
      "0점"
    );

    setText(
      elements.mainSport,
      "-"
    );

    setText(
      elements.mainSkill,
      "-"
    );

    setText(
      elements.reportDate,
      formatDate()
    );

    setHTML(
      elements.ai,
      "선수를 선택하고 훈련 기록을 저장하면 종합 분석이 표시됩니다."
    );

    setHTML(
      elements.recommendation,
      "<p>저장된 기록이 없습니다.</p>"
    );

    drawReportChart([]);
  }


  // ==========================================
  // 종합 보고서 화면 표시
  // ==========================================

  function renderReport() {

    const athlete =
      getCurrentAthleteName();

    const recordList =
      getAthleteRecords();

    if (!athlete) {

      renderEmptyReport();

      return;
    }

    const average =
      calculateAverage(recordList);

    const best =
      calculateBest(recordList);

    const latest =
      calculateLatest(recordList);

    const change =
      calculateChange(recordList);

    const mainSport =
      findMainSport(recordList);

    const mainSkill =
      findMainSkill(recordList);

    setText(
      elements.playerName,
      athlete
    );

    setText(
      elements.average,
      `${average}점`
    );

    setText(
      elements.best,
      `${best}점`
    );

    setText(
      elements.count,
      `${recordList.length}회`
    );

    setText(
      elements.latest,
      `${latest}점`
    );

    setText(
      elements.mainSport,
      mainSport
    );

    setText(
      elements.mainSkill,
      mainSkill
    );

    setText(
      elements.reportDate,
      formatDate()
    );

    const evaluation =
      createEvaluation(
        average,
        change,
        recordList.length
      );

    const changeText =
      change > 0
        ? `+${change}점`
        : `${change}점`;

    setHTML(
      elements.ai,
      `
        <strong>종합평가</strong>

        <p>
          ${evaluation}
        </p>

        <p>
          <strong>최근 점수 변화:</strong>
          ${changeText}
        </p>

        <p>
          <strong>주요 종목:</strong>
          ${mainSport}
        </p>

        <p>
          <strong>주요 기술:</strong>
          ${mainSkill}
        </p>
      `
    );

    const recommendations =
      createRecommendations(
        average,
        change,
        mainSport,
        mainSkill
      );

    if (recommendations.length) {

      const recommendationHTML =
        recommendations
          .map((item) => {

            return `<li>${item}</li>`;

          })
          .join("");

      setHTML(
        elements.recommendation,
        `<ul>${recommendationHTML}</ul>`
      );

    } else {

      setHTML(
        elements.recommendation,
        "<p>추천 훈련을 만들 수 없습니다.</p>"
      );
    }

    drawReportChart(recordList);
  }
  // ==========================================
  // 보고서 인쇄
  // ==========================================

  function printReport() {

    const athlete =
      getCurrentAthleteName();

    if (!athlete) {

      alert(
        "먼저 선수를 선택해 주세요."
      );

      return;
    }

    renderReport();

    window.print();
  }


  // ==========================================
  // 종합 보고서 만들기 버튼
  // ==========================================

  if (elements.makeButton) {

    elements.makeButton.addEventListener(
      "click",
      renderReport
    );
  }


  // ==========================================
  // 보고서 인쇄 버튼
  // ==========================================

  if (elements.printButton) {

    elements.printButton.addEventListener(
      "click",
      printReport
    );
  }


  // ==========================================
  // 화면 크기가 바뀌면 그래프 다시 그리기
  // ==========================================

  window.addEventListener(
    "resize",
    () => {

      drawReportChart(
        getAthleteRecords()
      );
    }
  );


  // ==========================================
  // 저장 기록이 바뀌면 보고서 새로고침
  // ==========================================

  window.addEventListener(
    "storage",
    () => {

      renderReport();
    }
  );


  // ==========================================
  // 선수가 바뀌었을 때 보고서 새로고침
  // ==========================================

  document.addEventListener(
    "athleteChanged",
    () => {

      renderReport();
    }
  );


  // ==========================================
  // 기록이 추가되었을 때 보고서 새로고침
  // ==========================================

  document.addEventListener(
    "recordsUpdated",
    () => {

      renderReport();
    }
  );


  // ==========================================
  // 다른 자바스크립트 파일에서도 사용 가능
  // ==========================================

  window.updateReport =
    renderReport;

  window.makeReport =
    renderReport;


  // ==========================================
  // 페이지가 열리면 자동 실행
  // ==========================================

  document.addEventListener(
    "DOMContentLoaded",
    () => {

      renderReport();
    }
  );

})();