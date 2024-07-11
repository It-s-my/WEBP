import { navigateToDirectory } from "./Navigate";
let isFirstLoad = true;

export function ElemCreate(data: any) {

    let file_list = <HTMLDivElement>document.getElementById("new");
    // Отображаем корневой путь при первой загрузке
    let startpath = "";
    file_list.innerHTML = "";
    if (isFirstLoad) {
        startpath = data["root"];
        //(<HTMLDivElement>document.getElementById('current-path')).innerHTML = startpath;
        isFirstLoad = false; // После первой загрузки меняем значение флага
    }
    data["Files"].forEach((element:any) => {
        let fileContainer = document.createElement("div");
        fileContainer.className = "File-Container";

        if (element["Type"] === "directory") {
            const fileMenuContainer = document.createElement("div");
            fileMenuContainer.className = "File-Menu-Container";

            const typeCon = document.createElement("div");
            typeCon.className = "Type-con";
            const typeDir = document.createElement("div");
            typeDir.className = "Type";
            typeDir.textContent = "Dir";
            typeCon.appendChild(typeDir);

            const nameForm = document.createElement("div");
            nameForm.className = "Name-Form";
            const nameFormContainer = document.createElement("div");
            nameFormContainer.className = "Name-Form-Container";
            const directoryLink = document.createElement("div");
            directoryLink.id = "path";
            directoryLink.textContent = element["Name"];
            directoryLink.addEventListener("click", navigateToDirectory)


            nameFormContainer.appendChild(directoryLink);
            nameForm.appendChild(nameFormContainer);

            let sizeForm = document.createElement("div");
            sizeForm.className = "Size-Form";
            let size = document.createElement("div");
            size.className = "Size";
            size.textContent = element["Size"];
            sizeForm.appendChild(size);

            fileMenuContainer.appendChild(typeCon);
            fileMenuContainer.appendChild(nameForm);
            fileMenuContainer.appendChild(sizeForm);

            fileContainer.appendChild(fileMenuContainer);
        }

        if (element["Type"] === "file") {
            const fileMenuContainer = document.createElement("div");
            fileMenuContainer.className = "File-Menu-Container";

            const typeCon = document.createElement("div");
            typeCon.className = "Type-con";
            const typeDir = document.createElement("div");
            typeDir.className = "Type";
            typeDir.textContent = "File";
            typeCon.appendChild(typeDir);

            const nameForm = document.createElement("div");
            nameForm.className = "Name-Form";
            const nameFormContainer = document.createElement("div");
            nameFormContainer.className = "Name-Form-Container";
            const directoryLink = document.createElement("div");
            directoryLink.id = "filepath";
            directoryLink.textContent = element["Name"];
            console.log(startpath)

            nameFormContainer.appendChild(directoryLink);
            nameForm.appendChild(nameFormContainer);

            let sizeForm = document.createElement("div");
            sizeForm.className = "Size-Form";
            let size = document.createElement("div");
            size.className = "Size";
            size.textContent = element["Size"];
            sizeForm.appendChild(size);

            fileMenuContainer.appendChild(typeCon);
            fileMenuContainer.appendChild(nameForm);
            fileMenuContainer.appendChild(sizeForm);

            fileContainer.appendChild(fileMenuContainer);
        }

        file_list.appendChild(fileContainer);
    });
}
