import { upload } from './Data';

let flag: boolean = true; // Инициализация переменной flag

// Функция navigateToDirectory - для перехода внутрь директории при нажатии на неё
export function navigateToDirectory(event: Event) {
    let clickedElement = event.target;

    let currentPath = (<HTMLDivElement>document.getElementById('current-path')).innerHTML + (<HTMLLinkElement>clickedElement).innerHTML + "/";

    (<HTMLElement>document.getElementById('current-path')).innerHTML = currentPath;

    upload(currentPath, flag);
}

// Функция backBut - для возврата назад по директории при нажатии кнопки "назад"
export function backBut(): void {
    let currentPathElement = document.getElementById('current-path') as HTMLDivElement;
    let currentPath = currentPathElement.innerText;

    if (currentPath === "/") {
        alert("Дальше некуда!");
        return;
    }

    let pathArray = currentPath.split('/');
    pathArray.splice(-2, 2); // Удаляем последние два элемента из массива

    let newPath = pathArray.join('/') + "/";

    currentPathElement.innerHTML = newPath;

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
    document.location.href = `http://localhost:80/webd.php`;
}