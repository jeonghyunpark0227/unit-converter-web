const convertTypes = {
  "길이 (mil↔mm)": ["mil", "mm"],
  "열저항 (kcm2/w↔kin2/w)": ["kcm2/w", "kin2/w"],
  "압력 (psi↔kpa)": ["psi", "kpa"],
  "점도 (dPa·s↔cP)": ["dpa·s", "cp"],
  "점도 (cP↔Pa·s)": ["cp", "pa·s"],
  "점도 (dPa·s↔Pa·s)": ["dpa·s", "pa·s"],
};

const convertFormulas = {
  "mil->mm": {
    convert: (value) => value * 0.0254,
    formula: "mm = mil × 0.0254",
  },
  "mm->mil": {
    convert: (value) => value / 0.0254,
    formula: "mil = mm ÷ 0.0254",
  },
  "kcm2/w->kin2/w": {
    convert: (value) => value / 6.4516,
    formula: "kin2/w = kcm2/w ÷ 6.4516",
  },
  "kin2/w->kcm2/w": {
    convert: (value) => value * 6.4516,
    formula: "kcm2/w = kin2/w × 6.4516",
  },
  "psi->kpa": {
    convert: (value) => value * 6.89476,
    formula: "kpa = psi × 6.89476",
  },
  "kpa->psi": {
    convert: (value) => value / 6.89476,
    formula: "psi = kpa ÷ 6.89476",
  },
  "dpa·s->cp": {
    convert: (value) => value * 100,
    formula: "cP = dPa·s × 100",
  },
  "cp->dpa·s": {
    convert: (value) => value / 100,
    formula: "dPa·s = cP ÷ 100",
  },
  "cp->pa·s": {
    convert: (value) => value / 1000,
    formula: "Pa·s = cP ÷ 1000",
  },
  "pa·s->cp": {
    convert: (value) => value * 1000,
    formula: "cP = Pa·s × 1000",
  },
  "dpa·s->pa·s": {
    convert: (value) => value / 10,
    formula: "Pa·s = dPa·s ÷ 10",
  },
  "pa·s->dpa·s": {
    convert: (value) => value * 10,
    formula: "dPa·s = Pa·s × 10",
  },
};

const unitDisplayLabels = {
  mil: "mil",
  mm: "mm",
  "kcm2/w": "kcm2/w",
  "kin2/w": "kin2/w",
  psi: "psi",
  kpa: "kpa",
  "dpa·s": "dPa·s",
  cp: "cP",
  "pa·s": "Pa·s",
};

const numberTokenPatternSource =
  "[+-]?(?:(?:(?:\\d{1,3}(?:,\\d{3})+|\\d+)(?:\\.\\d*)?)|\\.\\d+)";

const MIL_TO_MICROMETER = 25.4;

const elements = {
  inputValues: document.querySelector("#inputValues"),
  convertType: document.querySelector("#convertType"),
  fromUnit: document.querySelector("#fromUnit"),
  toUnit: document.querySelector("#toUnit"),
  swapButton: document.querySelector("#swapButton"),
  convertButton: document.querySelector("#convertButton"),
  copyButton: document.querySelector("#copyButton"),
  clearButton: document.querySelector("#clearButton"),
  resultsBody: document.querySelector("#resultsBody"),
  resultsTable: document.querySelector("#resultsTable"),
  emptyState: document.querySelector("#emptyState"),
  statusMessage: document.querySelector("#statusMessage"),
  solidDishWeight: document.querySelector("#solidDishWeight"),
  solidSampleWeight: document.querySelector("#solidSampleWeight"),
  solidDryTotalWeight: document.querySelector("#solidDryTotalWeight"),
  solidPercent: document.querySelector("#solidPercent"),
  solidMass: document.querySelector("#solidMass"),
  volatileMass: document.querySelector("#volatileMass"),
  solidStatus: document.querySelector("#solidStatus"),
  solidResetButton: document.querySelector("#solidResetButton"),
  alThickness: document.querySelector("#alThickness"),
  targetThickness: document.querySelector("#targetThickness"),
  targetThicknessUnit: document.querySelector("#targetThicknessUnit"),
  currentThickness: document.querySelector("#currentThickness"),
  currentThicknessUnit: document.querySelector("#currentThicknessUnit"),
  currentCoatingSingle: document.querySelector("#currentCoatingSingle"),
  targetCoatingSingle: document.querySelector("#targetCoatingSingle"),
  additionalCoatingSingle: document.querySelector("#additionalCoatingSingle"),
  qpadStatus: document.querySelector("#qpadStatus"),
  qpadResetButton: document.querySelector("#qpadResetButton"),
  currentStackGraphic: document.querySelector("#currentStackGraphic"),
  targetStackGraphic: document.querySelector("#targetStackGraphic"),
  currentTopLayerValue: document.querySelector("#currentTopLayerValue"),
  currentAlLayerValue: document.querySelector("#currentAlLayerValue"),
  currentBottomLayerValue: document.querySelector("#currentBottomLayerValue"),
  targetTopLayerValue: document.querySelector("#targetTopLayerValue"),
  targetAlLayerValue: document.querySelector("#targetAlLayerValue"),
  targetBottomLayerValue: document.querySelector("#targetBottomLayerValue"),
  solidInputs: Array.from(document.querySelectorAll("[data-solid-input]")),
  qpadControls: Array.from(document.querySelectorAll("[data-qpad-control]")),
};

let currentResults = [];
let statusTimerId = 0;

function getFormulaKey(fromUnit, toUnit) {
  return `${fromUnit}->${toUnit}`;
}

function getOppositeUnit(unit, units) {
  return unit === units[0] ? units[1] : units[0];
}

function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function populateConvertTypes() {
  Object.keys(convertTypes).forEach((convertType) => {
    elements.convertType.append(createOption(convertType, convertType));
  });
}

function updateUnitBoxes() {
  const selectedType = elements.convertType.value;
  const units = convertTypes[selectedType];

  elements.fromUnit.replaceChildren();
  elements.toUnit.replaceChildren();

  units.forEach((unit) => {
    const label = unitDisplayLabels[unit];
    elements.fromUnit.append(createOption(unit, label));
    elements.toUnit.append(createOption(unit, label));
  });

  elements.fromUnit.value = units[0];
  elements.toUnit.value = units[1];
}

function onFromChanged() {
  const selectedType = elements.convertType.value;
  const units = convertTypes[selectedType];
  elements.toUnit.value = getOppositeUnit(elements.fromUnit.value, units);
}

function onTypeChanged() {
  updateUnitBoxes();
  onFromChanged();
}

function swapUnits() {
  const fromUnit = elements.fromUnit.value;
  const toUnit = elements.toUnit.value;
  elements.fromUnit.value = toUnit;
  elements.toUnit.value = fromUnit;
}

function normalizeTextInput(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\t/g, " ");
}

function splitChunkTokens(chunk) {
  const tokens = [];
  let index = 0;

  while (index < chunk.length) {
    if (chunk[index] === ",") {
      index += 1;
      continue;
    }

    const pattern = new RegExp(numberTokenPatternSource, "y");
    pattern.lastIndex = index;
    const match = pattern.exec(chunk);

    if (match) {
      const matchEnd = pattern.lastIndex;
      if (matchEnd === chunk.length || chunk[matchEnd] === ",") {
        tokens.push(match[0]);
        index = matchEnd;
        continue;
      }
    }

    const invalidStart = index;
    while (index < chunk.length && chunk[index] !== ",") {
      index += 1;
    }

    const invalidToken = chunk.slice(invalidStart, index).trim();
    if (invalidToken) {
      tokens.push(invalidToken);
    }
  }

  return tokens;
}

function parseInputTokens(rawText) {
  const normalized = normalizeTextInput(rawText).trim();
  if (!normalized) {
    return [];
  }

  const tokens = [];
  normalized.split(/\s+/).forEach((chunk) => {
    if (chunk) {
      tokens.push(...splitChunkTokens(chunk));
    }
  });

  return tokens;
}

function isTouchDevice() {
  const hasCoarsePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  const hasTouchPoints = Number(navigator.maxTouchPoints || 0) > 0;
  const hasTouchEvent = "ontouchstart" in window;

  return hasCoarsePointer || hasTouchPoints || hasTouchEvent;
}

function shouldAutoFocusInput() {
  return !isTouchDevice();
}

function dismissMobileKeyboard() {
  if (shouldAutoFocusInput()) {
    return;
  }

  const activeElement = document.activeElement;
  if (activeElement && typeof activeElement.blur === "function") {
    activeElement.blur();
  }

  elements.inputValues.blur();
}

function restoreInputFocus() {
  if (!shouldAutoFocusInput()) {
    dismissMobileKeyboard();
    return;
  }

  elements.inputValues.focus({ preventScroll: true });
  elements.inputValues.select();
}

function focusInputIfDesktop(input) {
  if (shouldAutoFocusInput() && input) {
    input.focus({ preventScroll: true });
  }
}

function setEmptyState(isEmpty) {
  elements.emptyState.classList.toggle("is-hidden", !isEmpty);
}

function showStatus(message, tone = "success") {
  window.clearTimeout(statusTimerId);
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status-message is-visible is-${tone}`;
  statusTimerId = window.setTimeout(() => {
    elements.statusMessage.textContent = "";
    elements.statusMessage.className = "status-message";
  }, 2600);
}

function renderResults(rows) {
  elements.resultsBody.replaceChildren();

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.dataset.resultValue = row.resultValue;

    const inputValueCell = document.createElement("td");
    inputValueCell.textContent = row.inputValue;

    const inputUnitCell = document.createElement("td");
    inputUnitCell.textContent = row.inputUnit;

    const resultValueCell = document.createElement("td");
    const resultButton = document.createElement("button");
    resultButton.type = "button";
    resultButton.className = "result-copy-button";
    if (row.resultState !== "ok") {
      resultButton.classList.add("is-error");
    }
    resultButton.textContent = row.resultValue;
    resultButton.setAttribute("aria-label", `결과값 ${row.resultValue} 복사`);
    resultValueCell.append(resultButton);

    const outputUnitCell = document.createElement("td");
    outputUnitCell.textContent = row.outputUnit;

    const formulaCell = document.createElement("td");
    formulaCell.textContent = row.formula;

    tr.append(inputValueCell, inputUnitCell, resultValueCell, outputUnitCell, formulaCell);
    elements.resultsBody.append(tr);
  });

  setEmptyState(rows.length === 0);
}

function buildTableLines() {
  const headers = Array.from(elements.resultsTable.querySelectorAll("thead th")).map((cell) =>
    cell.textContent.trim(),
  );
  const lines = [headers.join("\t")];

  currentResults.forEach((row) => {
    lines.push(
      [row.inputValue, row.inputUnit, row.resultValue, row.outputUnit, row.formula].join("\t"),
    );
  });

  return lines;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  const copied =
    typeof document.execCommand === "function" &&
    document.execCommand("copy");
  helper.remove();

  if (!copied) {
    throw new Error("클립보드 복사를 지원하지 않는 환경입니다.");
  }
}

async function copyAllResults() {
  if (!currentResults.length) {
    showStatus("복사할 결과가 없습니다.", "warning");
    return;
  }

  try {
    await copyText(buildTableLines().join("\n"));
    showStatus("결과 전체를 클립보드에 복사했습니다.", "success");
  } catch (error) {
    showStatus(`복사하지 못했습니다. ${error.message}`, "error");
  }
}

async function copySingleResult(resultValue) {
  try {
    await copyText(resultValue);
    showStatus(`'${resultValue}' 복사 완료`, "success");
  } catch (error) {
    showStatus(`결과값을 복사하지 못했습니다. ${error.message}`, "error");
  }
}

function clearResults() {
  if (!currentResults.length) {
    showStatus("지울 결과가 없습니다.", "warning");
    return;
  }

  if (!window.confirm("표시된 결과를 모두 지우시겠습니까?")) {
    return;
  }

  currentResults = [];
  renderResults(currentResults);
  showStatus("결과를 지웠습니다.", "success");
  restoreInputFocus();
}

function convertToken(token, fromUnit, toUnit, convertConfig) {
  try {
    const value = Number(token.replace(/,/g, ""));
    if (Number.isNaN(value)) {
      throw new TypeError("숫자 오류");
    }

    const result = convertConfig.convert(value);
    if (!Number.isFinite(result)) {
      throw new Error("계산 결과가 유효하지 않습니다.");
    }

    return {
      inputValue: token,
      inputUnit: unitDisplayLabels[fromUnit],
      resultValue: result.toFixed(6),
      outputUnit: unitDisplayLabels[toUnit],
      formula: convertConfig.formula,
      resultState: "ok",
    };
  } catch (error) {
    if (error instanceof TypeError) {
      return {
        inputValue: token,
        inputUnit: unitDisplayLabels[fromUnit],
        resultValue: "숫자 오류",
        outputUnit: unitDisplayLabels[toUnit],
        formula: "유효한 숫자를 입력하세요",
        resultState: "error",
      };
    }

    return {
      inputValue: token,
      inputUnit: unitDisplayLabels[fromUnit],
      resultValue: "변환 오류",
      outputUnit: unitDisplayLabels[toUnit],
      formula: error.message,
      resultState: "error",
    };
  }
}

function onConvert() {
  dismissMobileKeyboard();

  const tokens = parseInputTokens(elements.inputValues.value);
  if (!tokens.length) {
    showStatus("변환할 값을 입력해주세요.", "warning");
    restoreInputFocus();
    return;
  }

  const fromUnit = elements.fromUnit.value;
  const toUnit = elements.toUnit.value;
  const convertConfig = convertFormulas[getFormulaKey(fromUnit, toUnit)];

  if (!convertConfig) {
    showStatus(`${unitDisplayLabels[fromUnit]} → ${unitDisplayLabels[toUnit]} 변환식이 없습니다.`, "error");
    restoreInputFocus();
    return;
  }

  currentResults = tokens.map((token) => convertToken(token, fromUnit, toUnit, convertConfig));
  renderResults(currentResults);
  showStatus(`${currentResults.length}개 항목을 변환했습니다.`, "success");
  restoreInputFocus();
  window.setTimeout(dismissMobileKeyboard, 0);
}

function parseNumberInput(input) {
  if (!input) {
    return null;
  }

  const normalizedValue = input.value.trim().replace(/,/g, "");
  if (!normalizedValue) {
    return null;
  }

  const value = Number(normalizedValue);
  return Number.isFinite(value) ? value : null;
}

function formatNumber(value, maximumFractionDigits = 4) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  const absValue = Math.abs(value);
  const digits = absValue > 0 && absValue < 0.01 ? 6 : maximumFractionDigits;
  return value.toLocaleString("ko-KR", {
    maximumFractionDigits: digits,
  });
}

function formatMeasurement(value, unit, maximumFractionDigits = 4) {
  return `${formatNumber(value, maximumFractionDigits)} ${unit}`;
}

function formatThicknessPair(valueUm) {
  return `${formatMeasurement(valueUm, "μm")} (${formatMeasurement(valueUm / MIL_TO_MICROMETER, "mil")})`;
}

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function setCalculationNote(element, message, tone = "muted") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `calculation-note is-${tone}`;
}

function renderSolidEmpty() {
  setText(elements.solidPercent, "-");
  setText(elements.solidMass, "-");
  setText(elements.volatileMass, "-");
  setCalculationNote(elements.solidStatus, "입력 대기", "muted");
}

function updateSolidsCalculator() {
  if (!elements.solidPercent) {
    return;
  }

  const dishWeight = parseNumberInput(elements.solidDishWeight);
  const sampleWeight = parseNumberInput(elements.solidSampleWeight);
  const dryTotalWeight = parseNumberInput(elements.solidDryTotalWeight);

  if ([dishWeight, sampleWeight, dryTotalWeight].some((value) => value === null)) {
    renderSolidEmpty();
    return;
  }

  if (sampleWeight <= 0) {
    renderSolidEmpty();
    setCalculationNote(elements.solidStatus, "시료 용액 무게는 0보다 커야 합니다.", "error");
    return;
  }

  const solidMass = dryTotalWeight - dishWeight;
  const volatileMass = sampleWeight - solidMass;

  if (solidMass < 0) {
    renderSolidEmpty();
    setCalculationNote(elements.solidStatus, "건조 후 전체 무게가 접시 무게보다 작습니다.", "error");
    return;
  }

  if (volatileMass < 0) {
    renderSolidEmpty();
    setCalculationNote(elements.solidStatus, "고형분 무게가 시료 용액 무게보다 큽니다.", "error");
    return;
  }

  const solidPercent = (solidMass / sampleWeight) * 100;
  setText(elements.solidPercent, formatMeasurement(solidPercent, "%", 3));
  setText(elements.solidMass, formatMeasurement(solidMass, "g", 4));
  setText(elements.volatileMass, formatMeasurement(volatileMass, "g", 4));
  setCalculationNote(elements.solidStatus, "계산 완료", "success");
}

function resetSolidsCalculator() {
  elements.solidInputs.forEach((input) => {
    input.value = "";
  });
  renderSolidEmpty();
  focusInputIfDesktop(elements.solidDishWeight);
}

function convertThicknessToMicrometer(value, unit) {
  return unit === "mil" ? value * MIL_TO_MICROMETER : value;
}

function setStackRows(graphic, coatingOneSideUm, alUm) {
  if (!graphic || !Number.isFinite(coatingOneSideUm) || !Number.isFinite(alUm) || coatingOneSideUm < 0 || alUm <= 0) {
    graphic?.style.removeProperty("--top-ratio");
    graphic?.style.removeProperty("--core-ratio");
    graphic?.style.removeProperty("--bottom-ratio");
    graphic?.classList.add("is-empty");
    return;
  }

  const totalUm = alUm + coatingOneSideUm * 2;
  const minimumVisible = totalUm * 0.055;
  const coatingRatio = coatingOneSideUm > 0 ? Math.max(coatingOneSideUm, minimumVisible) : 0.01;
  const coreRatio = Math.max(alUm, minimumVisible);

  graphic.style.setProperty("--top-ratio", `${coatingRatio}fr`);
  graphic.style.setProperty("--core-ratio", `${coreRatio}fr`);
  graphic.style.setProperty("--bottom-ratio", `${coatingRatio}fr`);
  graphic.classList.remove("is-empty");
}

function resetStackVisual(graphic, topValue, alValue, bottomValue) {
  setStackRows(graphic, null, null);
  setText(topValue, "-");
  setText(alValue, "-");
  setText(bottomValue, "-");
}

function updateStackVisual(graphic, topValue, alValue, bottomValue, coatingOneSideUm, alUm) {
  setStackRows(graphic, coatingOneSideUm, alUm);
  setText(topValue, formatMeasurement(coatingOneSideUm, "μm"));
  setText(alValue, formatMeasurement(alUm, "μm"));
  setText(bottomValue, formatMeasurement(coatingOneSideUm, "μm"));
}

function renderQpadEmpty() {
  setText(elements.currentCoatingSingle, "-");
  setText(elements.targetCoatingSingle, "-");
  setText(elements.additionalCoatingSingle, "-");
  setCalculationNote(elements.qpadStatus, "입력 대기", "muted");
  resetStackVisual(
    elements.currentStackGraphic,
    elements.currentTopLayerValue,
    elements.currentAlLayerValue,
    elements.currentBottomLayerValue,
  );
  resetStackVisual(
    elements.targetStackGraphic,
    elements.targetTopLayerValue,
    elements.targetAlLayerValue,
    elements.targetBottomLayerValue,
  );
}

function updateQpadCalculator() {
  if (!elements.currentCoatingSingle) {
    return;
  }

  const alUm = parseNumberInput(elements.alThickness);
  const targetThickness = parseNumberInput(elements.targetThickness);
  const currentThickness = parseNumberInput(elements.currentThickness);

  if ([alUm, targetThickness, currentThickness].some((value) => value === null)) {
    renderQpadEmpty();
    return;
  }

  if (alUm <= 0 || targetThickness <= 0 || currentThickness <= 0) {
    renderQpadEmpty();
    setCalculationNote(elements.qpadStatus, "두께는 모두 0보다 커야 합니다.", "error");
    return;
  }

  const targetTotalUm = convertThicknessToMicrometer(targetThickness, elements.targetThicknessUnit.value);
  const currentTotalUm = convertThicknessToMicrometer(currentThickness, elements.currentThicknessUnit.value);
  const targetOneSideUm = (targetTotalUm - alUm) / 2;
  const currentOneSideUm = (currentTotalUm - alUm) / 2;
  const targetIsValid = targetOneSideUm >= 0;
  const currentIsValid = currentOneSideUm >= 0;

  setText(
    elements.currentCoatingSingle,
    currentIsValid ? formatThicknessPair(currentOneSideUm) : "Al보다 작음",
  );
  setText(
    elements.targetCoatingSingle,
    targetIsValid ? formatThicknessPair(targetOneSideUm) : "Al보다 작음",
  );

  if (currentIsValid) {
    updateStackVisual(
      elements.currentStackGraphic,
      elements.currentTopLayerValue,
      elements.currentAlLayerValue,
      elements.currentBottomLayerValue,
      currentOneSideUm,
      alUm,
    );
  } else {
    resetStackVisual(
      elements.currentStackGraphic,
      elements.currentTopLayerValue,
      elements.currentAlLayerValue,
      elements.currentBottomLayerValue,
    );
  }

  if (targetIsValid) {
    updateStackVisual(
      elements.targetStackGraphic,
      elements.targetTopLayerValue,
      elements.targetAlLayerValue,
      elements.targetBottomLayerValue,
      targetOneSideUm,
      alUm,
    );
  } else {
    resetStackVisual(
      elements.targetStackGraphic,
      elements.targetTopLayerValue,
      elements.targetAlLayerValue,
      elements.targetBottomLayerValue,
    );
  }

  if (!targetIsValid || !currentIsValid) {
    setText(elements.additionalCoatingSingle, "-");
    setCalculationNote(elements.qpadStatus, "최종 두께는 Al 두께보다 커야 합니다.", "error");
    return;
  }

  const additionalOneSideUm = targetOneSideUm - currentOneSideUm;

  if (additionalOneSideUm > 0) {
    setText(elements.additionalCoatingSingle, formatThicknessPair(additionalOneSideUm));
    setCalculationNote(elements.qpadStatus, "한쪽면 기준 추가 필요", "warning");
    return;
  }

  if (additionalOneSideUm < 0) {
    setText(elements.additionalCoatingSingle, `0 μm (초과 ${formatThicknessPair(Math.abs(additionalOneSideUm))})`);
    setCalculationNote(elements.qpadStatus, "목표 두께 이상", "success");
    return;
  }

  setText(elements.additionalCoatingSingle, "0 μm");
  setCalculationNote(elements.qpadStatus, "목표 두께 일치", "success");
}

function resetQpadCalculator() {
  elements.qpadControls.forEach((control) => {
    if (control.tagName !== "SELECT") {
      control.value = "";
    }
  });

  if (elements.targetThicknessUnit) {
    elements.targetThicknessUnit.value = "um";
  }
  if (elements.currentThicknessUnit) {
    elements.currentThicknessUnit.value = "um";
  }

  renderQpadEmpty();
  focusInputIfDesktop(elements.alThickness);
}

function handleInputPaste(event) {
  const pastedText = event.clipboardData?.getData("text");
  if (typeof pastedText !== "string") {
    return;
  }

  event.preventDefault();

  const normalizedText = pastedText.replace(/[\t\r\n]+/g, " ");
  const input = elements.inputValues;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;

  input.setRangeText(normalizedText, start, end, "end");
}

function bindEvents() {
  elements.convertType.addEventListener("change", onTypeChanged);
  elements.fromUnit.addEventListener("change", onFromChanged);
  elements.swapButton.addEventListener("click", swapUnits);
  elements.convertButton.addEventListener("pointerdown", dismissMobileKeyboard);
  elements.convertButton.addEventListener("click", onConvert);
  elements.copyButton.addEventListener("click", copyAllResults);
  elements.clearButton.addEventListener("click", clearResults);

  elements.inputValues.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onConvert();
    }
  });

  elements.inputValues.addEventListener("paste", handleInputPaste);

  elements.resultsBody.addEventListener("click", (event) => {
    const row = event.target.closest("tr");
    if (!row) {
      return;
    }

    const resultValue = row.dataset.resultValue;
    if (!resultValue) {
      return;
    }

    copySingleResult(resultValue);
  });
}

function bindSpecialCalculatorEvents() {
  elements.solidInputs.forEach((input) => {
    input.addEventListener("input", updateSolidsCalculator);
  });
  elements.solidResetButton?.addEventListener("click", resetSolidsCalculator);

  elements.qpadControls.forEach((control) => {
    control.addEventListener("input", updateQpadCalculator);
    control.addEventListener("change", updateQpadCalculator);
  });
  elements.qpadResetButton?.addEventListener("click", resetQpadCalculator);
}

function initializeSpecialCalculators() {
  if (elements.solidPercent) {
    renderSolidEmpty();
  }
  if (elements.currentCoatingSingle) {
    renderQpadEmpty();
  }
}

function initializeApp() {
  populateConvertTypes();
  elements.convertType.value = Object.keys(convertTypes)[0];
  updateUnitBoxes();
  onFromChanged();
  bindEvents();
  bindSpecialCalculatorEvents();
  renderResults(currentResults);
  initializeSpecialCalculators();

  if (shouldAutoFocusInput()) {
    elements.inputValues.focus({ preventScroll: true });
  }
}

initializeApp();
