import { sortAsc } from './script';
import { sortDesc } from './script';
import { Spin } from './script';
import {ElemCreate} from "./ElementCreate";
import { path } from './script';
import {navigateToDirectory} from "./Navigate";

//upload - загружает все файлы на стрнице по текущему пути
export async function upload(currentPath: string, sortFlag: boolean) {

    Spin.on();
    let sort = sortAsc;

    if (!sortFlag) {
        sort = sortDesc;
    }

    const url = `${location.origin}?root=${currentPath}&sort=${sort}`;

    const response = await fetch(url, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            if(data["Status"]===200){
                ElemCreate(data)
            }else{
                alert(data["Error"])
            }})
        .catch(error => {
            console.error('Ошибка:', error);
        });

    Spin.off();
}
