import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const api = initData(sourceData);

// ТУТ НЕ УВЕРЕН ЧТО НАДО БЫЛО УБРАТЬ
// const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1);
  return {
    // расширьте существующий return вот так
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  let state = collectState(); // состояние полей из таблицы
  let query = {}; // здесь будут формироваться параметры запроса

  // другие apply*
  // result = applySearching(result, state, action);
  query = applySearching(query, state, action);
  query = applyFiltering(query, state, action);
  query = applySorting(query, state, action);
  query = applyPagination(query, state, action); // обновляем query

  const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items);

  // let state = collectState(); // состояние полей из таблицы
  // let query = {}; // копируем для последующего изменения

  // // result = applySearching(result, state, action)
  // // result = applyFiltering(result, state, action);
  // // result = applySorting(result, state, action);
  // // result = applyPagination(result, state, action);

  // const { total, items } = await api.getRecords(query);

  // sampleTable.render(items)
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["filter", "header", "search"],
    after: ["pagination"],
  },
  render
);
console.log(
  "main.js sampleTable.pagination.elements:",
  sampleTable.pagination.elements
);
const applySearching = initSearching("search");

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
);
const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  //Фильтеринг
  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}
init().then((value) => render(value));
