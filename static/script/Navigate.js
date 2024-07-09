
//navigateToDirectory - для прохода вглубь директории при нажатии на неё
function navigateToDirectory(event) {
    let clickedElement = event.target;

    let currentPath = document.getElementById('current-path').textContent + clickedElement.textContent + "/"

    document.getElementById('current-path').innerHTML = currentPath

    upload(currentPath,flag)

    console.log(currentPath)
}
//backBut - Для возвращения назад по директории при нажатии кнопки назад
function backBut() {
    let currentPath = document.getElementById('current-path').textContent

    if (currentPath === "/") {
        alert("Дальше некуда!")
        return
    }

    let pathArray = currentPath.split('/');

    pathArray.pop();
    pathArray.pop();

    let newPath = pathArray.join('/') + "/";

    document.getElementById('current-path').innerHTML = newPath

    upload(newPath, flag)
}
//sort - для выбора сортировки asc/desc
function sort() {
    let currentPath = document.getElementById('current-path').textContent;
    flag = !flag; // Переключаем флаг при каждом вызове функции

    let buttonSort = document.querySelector(".S-but");

    if (flag) {
        buttonSort.textContent = "Asc"; // Устанавливаем текст на кнопке в зависимости от состояния сортировки
    } else {
        buttonSort.textContent = "Desc"; // Устанавливаем текст на кнопке в зависимости от состояния сортировки
    }

    upload(currentPath, flag);
}