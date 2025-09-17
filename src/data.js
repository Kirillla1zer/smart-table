import {makeIndex} from "./lib/utils.js";
const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api'; 
export function initData(sourceData) {
// переменные для кеширования данных
let sellers;
let customers;
let lastResult;
let lastQuery;
console.log("------------------data.js START----------------------------------")
// функция для приведения строк в тот вид, который нужен нашей таблице
const mapRecords = (data) => data.map(item => (
{
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount
}));

// функция получения индексов
const getIndexes = async () => {
    if (!sellers || !customers) { // если индексы ещё не установлены, то делаем запросы
        [sellers, customers] = await Promise.all([ // запрашиваем и деструктурируем в уже объявленные ранее переменные
            fetch(`${BASE_URL}/sellers`).then(res => res.json()), // запрашиваем продавцов
            fetch(`${BASE_URL}/customers`).then(res => res.json()), // запрашиваем покупателей
        ]);
    }
    console.log('getIndexes вернула:sellers:',sellers)
    console.log('getIndexes вернула:customers:',customers)
    return { sellers, customers };
}
// Вывод:
// sellers: {seller_1: 'Alexey Petrov', seller_2: 'Mikhail Nikolaev', seller_3: 'Ivan Petrov', seller_4: 'Petr Alekseev', seller_5: 'Nikolai Ivanov'}
// customers: {customer_1: 'Andrey Alekseev', customer_2: 'Petr Smirnov', customer_3: 'Sergey Andreev', customer_4: 'Petr Sidorov', customer_5: 'Ivan Volkov', …}

// функция получения записей о продажах с сервера
const getRecords = async (query, isUpdated = false) => {
        const qs = new URLSearchParams(query); // преобразуем объект параметров в SearchParams объект, представляющий query часть url
        const nextQuery = qs.toString(); // и приводим к строковому виду

        if (lastQuery === nextQuery && !isUpdated) { // isUpdated параметр нужен, чтобы иметь возможность делать запрос без кеша
            return lastResult; // если параметры запроса не поменялись, то отдаём сохранённые ранее данные
        }

        // если прошлый квери не был ранее установлен или поменялись параметры, то запрашиваем данные с сервера
        const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
        console.log('Строка запроса',`${BASE_URL}/records?${nextQuery}`);
        const records = await response.json();

        lastQuery = nextQuery; // сохраняем для следующих запросов
        lastResult = {
            total: records.total,
            items: mapRecords(records.items)
        };
        console.log("lastResult(важно) тут total и items ):",lastResult)
        console.log("records.items(чеки которые приводим к нужному виду(не супер важно) ):",records.items)
        console.log("------------------data.js END----------------------------------")
        return lastResult;
    };
//lastResult:
//{total: 230, items: Array(10)}
//{items:[
// {id: 'receipt_1', date: '2023-12-04', seller: 'Nikolai Ivanov', customer: 'Andrey Alekseev', total: 4657.56}
// {id: 'receipt_2', date: '2023-12-04', seller: 'Alexey Petrov', customer: 'Andrey Alekseev', total: 5015.02}
// {id: 'receipt_3', date: '2024-01-04', seller: 'Alexey Petrov', customer: 'Andrey Alekseev', total: 875.65}
// {id: 'receipt_4', date: '2024-01-04', seller: 'Nikolai Ivanov', customer: 'Andrey Alekseev', total: 1635.5}
// {id: 'receipt_5', date: '2024-02-04', seller: 'Petr Alekseev', customer: 'Andrey Alekseev', total: 2921.92}
// {id: 'receipt_6', date: '2024-03-04', seller: 'Ivan Petrov', customer: 'Andrey Alekseev', total: 1308.66}
// {id: 'receipt_7', date: '2024-03-04', seller: 'Mikhail Nikolaev', customer: 'Andrey Alekseev', total: 6190.54}
// {id: 'receipt_8', date: '2024-04-03', seller: 'Nikolai Ivanov', customer: 'Andrey Alekseev', total: 2384.46}
// {id: 'receipt_9', date: '2024-05-03', seller: 'Petr Alekseev', customer: 'Andrey Alekseev', total: 1744.23}
// {id: 'receipt_10', date: '2024-06-03', seller: 'Mikhail Nikolaev', customer: 'Andrey Alekseev', total: 3302.37}
// ],
// total: 230}

return {
    getIndexes,
    getRecords
}; 




// const sellers = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
    // const customers = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`);
    // const data = sourceData.purchase_records.map(item => ({
    //     id: item.receipt_id,
    //     date: item.date,
    //     seller: sellers[item.seller_id],
    //     customer: customers[item.customer_id],
    //     total: item.total_amount
    // }));
    // const getIndexes = async () => {
    //     return { sellers, customers };
    // }
    
    // const getRecords = async () => {
    //     return {
    //         total: data.length,
    //         items: data
    //     };
    // }
    
    // return {
    //     getIndexes,
    //     getRecords
    // } 

}