//upload - загрузка данных при загрузке страницы

async function upload(currentPath,sortFlag) {
    Spin.on()
    let sort = sortAsc

    if (!sortFlag) {
        sort = sortDesc
    }



    await fetch(path + '?root=' + currentPath.slice(1, -1)+ '&sort=' + sort, {
        method: "GET",
    })
        .then(response => response.json())
        .then(data => {
            let file_list = document.getElementById("new")
            file_list.innerHTML = ""
            console.log("path")
            data["Files"].forEach(element => {
                file_list.inertHTML += ` <div class="File-Container"></div>`
                if (element["Type"] === "directory") {
                    console.log(element["Name"]);
                    file_list.innerHTML += ` <div class="File-Menu-Container" id="new"><div class="Type-con"><div class="Type">Dir</div></div><div class="Name-Form"> <div class="Name-Form-Container"><a href="#" onclick="navigateToDirectory(event)">${element["Name"]}</a></div></div><div class="Size-Form"><div class="Size">${element["Size"]}</div></div></div>`
                }
                if (element["Type"] === "file") {
                    console.log(element["Name"]);
                    file_list.innerHTML += ` <div class="File-Menu-Container"><div class="Type-con"><div class="Type">File</div>
                                                            </div><div class="Name-Form"> <div class="Name-Form-Container">${element["Name"]}</div>
                                                                     </div>
                                                                                             <div class="Size-Form">
                                                                                               <div class="Size">${element["Size"]}</div>
                                                                                                              </div>
                                                                                                                      </div>`
                }
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
        })
    Spin.off()
}