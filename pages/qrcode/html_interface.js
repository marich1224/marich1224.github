
class HTMLValueSetter{
    static clearTable(tableID, parentObjID) {
        var table = document.getElementById(tableID);
        var _table = document.getElementById(parentObjID);
        table.remove();
        table = document.createElement("tbody");
        table.id = tableID;
        _table.appendChild(table);
        return table;
    }

    static createTds(formatted_str_array, parent_tr, id="", classname="") {
        formatted_str_array.forEach(str => {
            var td = document.createElement("td");
            td.textContent = str;
            if (id != "") {
                td.id = id;
            }
            if (classname != "") {
                td.className = classname;
            }
            parent_tr.appendChild(td);
        });
    }
}

class HTMLValueGetter{
    static getSelectedValue(docObj) {
        var selectedValue = "";
    
        Array.from(docObj.options).forEach((e) => {
            if (e.selected) {
                selectedValue = e.value;
            }
        });
        return selectedValue;
    }

    static getDatamode() {
        var checked_value = "";
        let elements = document.getElementsByName('datamode');
        elements.forEach((e) => {
            if (e.checked) {
                checked_value = e.value;
            }
        });
        return checked_value;
    }

    static getMaskID() {
        let elements = document.getElementById('qrcodeMask');
        let checked_value = HTMLValueGetter.getSelectedValue(elements);
        return parseInt(checked_value, 2);
    }

    static getInputText() {
        return document.getElementById("rawtext").value;
    }

    static getQRCodeVersion() {
        return HTMLValueGetter.getSelectedValue(document.getElementById("qrcodeVersion"));
    }

    static getQRCodeErrorLevel() {
        return HTMLValueGetter.getSelectedValue(document.getElementById("qrcodeErrorLevel"));
    }

    static getQRCodeFullVersion() {
        var version = HTMLValueGetter.getSelectedValue(document.getElementById("qrcodeVersion"));
        var errorlevel = HTMLValueGetter.getSelectedValue(document.getElementById("qrcodeErrorLevel"));
        return version + errorlevel;
    }
}