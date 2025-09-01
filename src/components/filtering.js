import {createComparison, defaultRules} from "../lib/compare.js";
const compare = createComparison(defaultRules); 
// @todo: #4.3 — настроить компаратор

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    console.log(elements.searchBySeller)
    console.log(indexes)
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => { 
                        const option = document.createElement('option')    
                        option.value = name;  
                        option.textContent = name;                 
                        elements.searchBySeller.append(option)                                // @todo: создать и вернуть тег опции
                      })
        )
     })         
    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        
        if(action != undefined && action.name == 'clear')
        {
            action.parentElement.querySelector('input').value = '';
            state.date = '';
            return data
        }
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    
    }
}