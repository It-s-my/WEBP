import { sortAsc } from './script';
import { sortDesc } from './script';
import { Spin } from './script';
import { path } from './script';
import {navigateToDirectory} from "./Navigate";

//upload - загружает все файлы на стрнице по текущему пути
export async function upload(currentPath: string, sortFlag: boolean) {

    Spin.on();
    let sort = sortAsc;

    if (!sortFlag) {
        sort = sortDesc;
    }
    const response = await fetch(`${location.origin}?root=${currentPath.slice(1, -1)}&sort=${sort}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            if(data["Status"]===200){
              //  (<HTMLDivElement>document.getElementById('current-path')).innerHTML = data["root"];
                let file_list = <HTMLDivElement>document.getElementById("new");
                file_list.innerHTML = "";
                data["Files"].forEach((element: any) => {
                    let fileContainer = document.createElement('div');
                    fileContainer.classList.add('File-Container');

                    let fileMenuContainer = document.createElement('div');
                    fileMenuContainer.classList.add('File-Menu-Container');

                    let typeCon = document.createElement('div');
                    typeCon.classList.add('Type-con');

                    let type = document.createElement('div');
                    type.classList.add('Type');
                    type.textContent = element["Type"] === "directory" ? 'Dir' : 'File';

                    let nameForm = document.createElement('div');
                    nameForm.classList.add('Name-Form');

                    let nameFormContainer = document.createElement('div');
                    nameFormContainer.classList.add('Name-Form-Container');

                    // Устанавливаем атрибут href только для папок
                    if (element["Type"] === "directory") {
                        let nameLink = document.createElement('a');
                        nameLink.href = '#';
                        nameLink.id = 'nameDir';
                        nameLink.textContent = element["Name"];
                        nameFormContainer.appendChild(nameLink);

                        // Добавляем обработчик события для папок
                        nameLink.addEventListener('click', navigateToDirectory);
                    } else {
                        let nameText = document.createTextNode(element["Name"]);
                        nameFormContainer.appendChild(nameText);
                    }

                    let sizeForm = document.createElement('div');
                    sizeForm.classList.add('Size-Form');
                    let size = document.createElement('div');
                    size.classList.add('Size');
                    size.textContent = element["Size"];

                    // Добавляем все элементы в нужные контейнеры
                    typeCon.appendChild(type);
                    nameForm.appendChild(nameFormContainer);
                    sizeForm.appendChild(size);

                    fileMenuContainer.appendChild(typeCon);
                    fileMenuContainer.appendChild(nameForm);
                    fileMenuContainer.appendChild(sizeForm);

                    fileContainer.appendChild(fileMenuContainer);

                    file_list.appendChild(fileContainer);
                });

            }else{
                alert(data["Error"])
            }})
        .catch(error => {
            console.error('Ошибка:', error);
        });

    Spin.off();
}
