import { sortAsc } from './script';
import { sortDesc } from './script';
import { Spin } from './script';
import { path } from './script';

export async function upload(currentPath: string, sortFlag: boolean) {
    Spin.on();
    let sort = sortAsc;

    if (!sortFlag) {
        sort = sortDesc;
    }
    const response = await fetch(`${path}?root=${currentPath.slice(1, -1)}&sort=${sort}`, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            if(data["Status"]===200){
            let file_list = <HTMLDivElement>document.getElementById("new");
            file_list.innerHTML = "";

            data["Files"].forEach((element:any) => {
                file_list.innerHTML += `<div class="File-Container"></div>`
                if (element["Type"] === "directory") {
                    console.log(element["Name"]);
                    file_list.innerHTML += `<div class="File-Menu-Container" id="new">
                    <div class="Type-con">
                    <div class="Type">Dir</div>
                        </div>
                        <div class="Name-Form">
                    <div class="Name-Form-Container" ><a href="#" id="nameDir" >${element["Name"]}</a></div>
                        </div>
                        <div class="Size-Form">
                    <div class="Size">${element["Size"]}</div>
                        </div>
                        </div>`
                }
                if (element["Type"] === "file") {
                    console.log(element["Name"]);
                    file_list.innerHTML += `<div class="File-Menu-Container">
                    <div class="Type-con">
                    <div class="Type">File</div>
                        </div>
                        <div class="Name-Form">
                    <div class="Name-Form-Container">${element["Name"]}</div>
                        </div>
                        <div class="Size-Form">
                    <div class="Size">${element["Size"]}</div>
                        </div>
                        </div>`
                }
            });
        }else{
                alert(data["Error"])
            }})
        .catch(error => {
            console.error('Ошибка:', error);
        });

    Spin.off();
}
