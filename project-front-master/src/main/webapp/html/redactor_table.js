// noinspection JSUnusedGlobalSymbols,HtmlRequiredAltAttribute

function page(pageNumber) {
    $("tr:has(td)").remove();

    let url = "/rest/players?";

    let getList = $("#number").val();
    if (getList == null) {
        getList = -1;
    }

    url = url.concat("pageSize=").concat(getList);

    if (pageNumber == null) {
        pageNumber = -2;
    }
    url = url.concat("&pageNumber=").concat(pageNumber);

    let xhr = new XMLHttpRequest();
    let myTable = document.querySelector('#myTable');
    xhr.open("GET", url);
    xhr.addEventListener("load",() =>{
         let response = JSON.parse(xhr.response);
        let fragment = document.createDocumentFragment();
        response.forEach(post =>{
            let tr =document.createElement("tr");
            let td_id = document.createElement("td");
           td_id.textContent = post.id;
           tr.appendChild(td_id);
           let  td_name = document.createElement("td");
           tr.appendChild(td_name);
           td_name.textContent = post.name;
           let td_title = document.createElement("td");
            td_title.textContent = post.title;
            tr.appendChild(td_title);
           let td_race  = document.createElement("td");
            td_race.textContent = post.race
            tr.appendChild(td_race);
            let td_profession = document.createElement("td");
            td_profession.textContent = post.profession;
            tr.appendChild(td_profession);
            let td_level = document.createElement("td");
            td_level.textContent = post.level;
            tr.appendChild(td_level);
           let td_birthday = document.createElement("td");
           td_birthday.textContent = new Date(post.birthday).toLocaleDateString();
            tr.appendChild(td_birthday);
           let td_banned = document.createElement("td");
           td_banned.textContent = post.banned;
            tr.appendChild(td_banned);
           let but_app = document.createElement("td");
           let btn_ap = document.createElement("button");
           btn_ap.id = "edidId" + post.id;
            let img_app = document.createElement("img");
            img_app.src = "/img/edit.png";
            $(btn_ap).attr("onclick","changeParameter("+ post.id +")");
            btn_ap.appendChild(img_app);
            but_app.appendChild(btn_ap);
            tr.appendChild(but_app);
              let but_del =document.createElement("td");
            let btn_delete = document.createElement("button");
            btn_delete.id = "deleteId" + post.id;
            let img_del = document.createElement("img");
            img_del.src = "/img/delete.png";
            $(btn_delete).attr("onclick","deleteAccount("+ post.id +")");
            btn_delete.appendChild(img_del);
            but_del.appendChild(btn_delete);
            tr.appendChild(but_del);
            fragment.append(tr);
        });
        myTable.append(fragment);
            });
    xhr.send();


    let account = getAccount();
    let resultList = Math.ceil(account / getList);

    $("button.bnt-styled").remove();
    for (let i = 0; i < resultList; i++) {
        let button_tag = "<button>" + (i + 1) + "</button>";
        let bt = $(button_tag)
            .attr("id", "pagination" + i)
            .attr("onclick", "page(" + i + ")")
            .addClass('bnt-styled');
        $("#pagination").append(bt);
    }
    let click = "#pagination" + pageNumber;

    $(click).addClass('active');
}

function getAccount() {
    let url = "/rest/players/count";
    let result = 0;
    $.ajax({
        url: url,
        async: false,
        success: function (res) {
            result = parseInt(res);

        }
    })
    return result;
}

function deleteAccount(id) {
    let url = "/rest/players/" + id;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE",url);
    xhr.addEventListener('load',function (){
        page(stayPage());
    })
    xhr.send();
}

function changeParameter(id) {
    let ed = "#edidId" + id;
    let del = "#deleteId" + id;
    $(del).remove();
    let newIcon = "<img src = '/img/save.png'>";
    $(ed).html(newIcon);

    let edParents = $(ed).parent().parent();
    let edChildren = edParents.children();

    let ed_name = edChildren[1];
    ed_name.innerHTML = "<input id = 'input_name" + id + "' type = 'text' value='" + ed_name.innerHTML + "'/>"

    let ed_title = edChildren[2];
    ed_title.innerHTML = "<input id = 'input_title" + id + "' type = 'text' value='" + ed_title.innerHTML + "'/>"

    let ed_race = edChildren[3];
    let id_race = "#select_race" + id;
    let change_race = ed_race.innerHTML;
    ed_race.innerHTML = dropRace(id);
    $(id_race).val(change_race).change();

    let ed_profession = edChildren[4];
    let id_profession = "#select_profession" + id;
    let change_profession = ed_profession.innerHTML;
    ed_profession.innerHTML = dropProfession(id);
    $(id_profession).val(change_profession).change();

    let ed_banned = edChildren[7];
    let id_banned = "#select_banned" + id;
    let change_banned = ed_banned.innerHTML;
    ed_banned.innerHTML = dropBanned(id);
    $(id_banned).val(change_banned).change();

    let save_parameter = "saveChange(" + id + ")";
    $(ed).attr("onclick", save_parameter);

}

function saveChange(id) {
    let val_name = $("#input_name" + id).val();
    let val_title = $("#input_title" + id).val();
    let val_race = $("#select_race" + id).val();
    let val_profession = $("#select_profession" + id).val();
    let val_banned = $("#select_banned" + id).val();

    let url = "/rest/players/" + id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST",url,false);
    xhr.addEventListener("load",function (){
        page(stayPage());
    });
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify({
        "name": val_name,
        "title": val_title,
        "race": val_race,
        "profession": val_profession,
        "banned": val_banned}));
}




function dropRace(id) {
    let race_id = "select_race" + id;
    return "<label for= 'race'></label>"
        + "<select id = " + race_id + " name = 'race'>"
        + "<option value='HUMAN'>HUMAN</option>"
        + "<option value='DWARF'>DWARF</option>"
        + "<option value='ELF'>ELF</option>"
        + "<option value='GIANT'>GIANT</option>"
        + "<option value='ORC'>ORC</option>"
        + "<option value='TROLL'>TROLL</option>"
        + "<option value='HOBBIT'>HOBBIT</option></select>";

}

function dropProfession(id) {
    let select_id = "select_profession" + id;
    return "<label for = 'profession'></label>"
        + "<select id=" + select_id + " name = 'profession'>"
        + "<option value='WARRIOR'>WARRIOR</option>"
        + "<option value='ROGUE'>ROGUE</option> "
        + "<option value='SORCERER'>SORCERER</option> "
        + "<option value='CLERIC'>CLERIC</option> "
        + "<option value='PALADIN'>PALADIN</option> "
        + "<option value='NAZGUL'>NAZGUL</option> "
        + "<option value='WARLOCK'>WARLOCK</option> "
        + "<option value='DRUID'>DRUID</option></select>";
}

function dropBanned(id) {
    let id_banned = "select_banned" + id;
    return "<label for = 'banned'></label>"
        + "<select id= " + id_banned + " name = 'banned'>" +
        "<option value='true'>true</option> " +
        "<option value='false'>false</option></select>"
}

function save_new_acc() {
    let val_name = $("#name").val();
    let val_title = $("#title").val();
    let val_race = $("#race").val();
    let val_profession = $("#profession").val();
    let val_level = $("#level").val();
    let val_birthday = $("#birthday").val();
    let val_banned = $("#banned").val();

    let url = "/rest/players"
    let xhr = new XMLHttpRequest();
    xhr.open("POST",url,false);
    xhr.addEventListener("load",function (){
        $("#name").val("");
        $("#title").val("");
        $("#race").val("");
        $("#profession").val("");
        $("#level").val("");
        $("#birthday").val("");
        $("#banned").val("");
        page(stayPage());
    });
    xhr.setRequestHeader('Content-type','application/json');
    xhr.send(JSON.stringify({
        "name": val_name,
        "title": val_title,
        "race": val_race,
        "profession": val_profession,
        "level": val_level,
        "birthday": new Date(val_birthday).getTime(),
        "banned": val_banned}));
}
function stayPage() {
    let count = 1;
        $("button:parent(div)").each(function () {
            if ($.className === "active") {
                count = $(this).text();
            }
        });
    return parseInt(count)-1;
}
