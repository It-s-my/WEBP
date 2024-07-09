let path; // Объявляем переменную path здесь
//Константа для сортировки
const sortAsc = "asc"
const sortDesc = "desc"

// Получение текущего пути
let currentPath = document.getElementById('current-path').innerHTML
console.log("path")
// Кнопка "Назад"
const goBackButton = document.getElementById('goback');
// Флаг для управления сортировкой
let flag = true
//История путей
let pathHistory = [currentPath];

//Управление спинером on делает его видимым off - невидимым
const Spin = {
    LoadSpin: document.getElementById('load-spin'),
    on() {
        this.LoadSpin.style.display = 'block'
    },
    off() {
        this.LoadSpin.style.display = 'none'
    }
}


//Вызов функции

document.addEventListener("DOMContentLoaded", (event) => {
    upload(currentPath,flag)
});

