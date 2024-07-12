import { sortAsc } from './script';
import { sortDesc } from './script';
import { Spin } from './script';
import {ElemCreate} from "./ElementCreate";
import {navigateToDirectory} from "./Navigate";

//upload - загружает все файлы на стрнице по текущему пути
export async function upload(currentPath: string, sortFlag: boolean) {

    Spin.on();
    let sort = sortAsc;

    if (!sortFlag) {
        sort = sortDesc;
    }

    const url = `/fs?root=${currentPath}&sort=${sort}`;
    console.log(url)
    console.log(currentPath)
    const response = await fetch(url, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            console.log(currentPath)
            if(data["Status"]===200){
                console.log(currentPath)
                ElemCreate(data)
            }else{
                alert(data["Error"])
            }})
        .catch(error => {
            console.error('Ошибка:', error);
        });

    Spin.off();
}
