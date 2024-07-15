import { upload } from './Data';
import {navigateToDirectory, sort} from "./Navigate";
import {backBut} from "./Navigate";
import {Stat} from "./Navigate";
import {ElemCreate} from "./ElementCreate";

export const sortAsc = "asc";
export const sortDesc = "desc";


// Получение текущего пути
let currentPath = ""

// Кнопка "Назад"
const goBackButton = document.getElementById('goback');
// Флаг для управления сортировкой
let flag = true;
//История путей
let pathHistory = [currentPath];

//Управление спинером on делает его видимым off - невидимым
export const Spin = {
    LoadSpin: document.getElementById('load-spin'),
    on() {
        (<HTMLDivElement>this.LoadSpin).style.display = 'block';
    },
    off() {
        (<HTMLDivElement>this.LoadSpin).style.display = 'none';
    }
}

//Вызов функции
document.addEventListener("DOMContentLoaded", (event) => {
    upload(currentPath,flag)
});

const sortButton = document.querySelector('#Sort-but');
if (sortButton) {
    sortButton.addEventListener('click', sort);
}

const BackButton = document.querySelector('#Back-But');
if (BackButton) {
    BackButton.addEventListener('click', backBut);
}
const Statis = document.querySelector('#BD');
if (Statis) {
    Statis.addEventListener('click', Stat);
}


