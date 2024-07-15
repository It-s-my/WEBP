import { upload } from './Data';

// Получить текущий URL страницы
const currentURL = window.location.href;

// Получить путь к директории на сервере
const serverPath = currentURL.substring(0, currentURL.lastIndexOf('/'));

let flag: boolean = true; // Инициализация переменной flag

// Функция navigateToDirectory - для перехода внутрь директории при нажатии на неё
export function navigateToDirectory(path: string, event: Event) {

    let clickedElement = event.target;
    console.log("BEFORE\n")
    console.log(path + "\n")
    let currentPath = path +"/"+ (<HTMLLinkElement>clickedElement).innerHTML + "/";
    console.log("AFTER \n")
    console.log(currentPath + "\n")
    upload(currentPath, flag);
}

// Функция backBut - для возврата назад по директории при нажатии кнопки "назад"
export function backBut(): void {

    let currentPathElement = document.getElementById('current-path') as HTMLDivElement;
    let currentPath = currentPathElement.innerText;

    let pathArray = currentPath.split('/');
    pathArray.splice(-2, 2); // Удаляем последние два элемента из массива

    let newPath = pathArray.join('/')


    if(newPath === "") {
        alert("Дальше некуда!");
        return;
    }else{
        currentPathElement.innerHTML = newPath;
    }
    upload(newPath, flag);
}

// Функция sort - для выбора сортировки asc/desc
export function sort(): void {
    let currentPathElement = document.getElementById('current-path') as HTMLDivElement;
    let currentPath = currentPathElement.innerText;
    flag = !flag; // Переключаем флаг при каждом вызове функции

    let buttonSort = document.querySelector(".S-but") as HTMLDivElement;
    buttonSort.textContent = flag ? "Asc" : "Desc"; // Устанавливаем текст на кнопке в зависимости от состояния сортировки

    upload(currentPath, flag);
}
export function Stat() {
    let PhpUrl = new URL(location.href)
    document.location.href = `${PhpUrl.protocol}//${PhpUrl.hostname}:80/Table.php`;
}
