import { sortAsc } from './script';
import { sortDesc } from './script';
import { Spin } from './script';
import { ElemCreate } from "./ElementCreate";
import { navigateToDirectory } from "./Navigate";

//upload - загружает все файлы на странице по текущему пути
export async function upload(currentPath: string, sortFlag: boolean) {
    Spin.on();
    let sort = sortAsc;

    if (!sortFlag) {
        sort = sortDesc;
    }

    const url = `/fs?root=${currentPath}&sort=${sort}`;


    try {
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json();


        if (data["Status"] === 200) {

            ElemCreate(data);
        } else {
            alert(data["Error"]);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    } finally {
        Spin.off();
    }
}
