

function convBtoI(baseexp) {
    if (baseexp == "00000000") {
        return -1;
    }
    return gfBaseExpr.indexOf(baseexp);
}

function convItoB(index) {
    if (index == -1) {
        index = 255;
    }
    return gfBaseExpr[index];
}

function sumOfBaseExp(_baseexp1, _baseexp2) {
    let baseexp1 = _baseexp1.split('');
    let baseexp2 = _baseexp2.split('');
    if ((baseexp1.length != 8) || (baseexp2.length != 8)) {
        return -1;
    }

    var _result = [];
    for (var i = 0; i < 8; i++){
        if (baseexp1[i] == baseexp2[i]) {
            _result.push("0");
        }
        else {
            _result.push("1");
        }
    }

    return _result.join('');
}

function multiplied_gx(poly_coeff, shift) {
    let next_row_dec = [];
    poly_coeff.forEach(i => {
        let j = i + shift
        if (shift < 0) {
            next_row_dec.push(-1);
        }
        else {
            next_row_dec.push((j % 255).toString(10));
        }
    });
    return next_row_dec;
}

function getPolynomialForRSCode() {
    return polyCoeffs[polyDegree[HTMLValueGetter.getQRCodeFullVersion()]];
}

function substract_rows(data_with_zeros, poly_length, next_row_bin) {
    var substracted_row = [];
    next_row_bin.forEach((str, i) => {
        substracted_row.push(sumOfBaseExp(str, data_with_zeros[i]));
    });
    return substracted_row;
}

function iteration_unit(data_with_zeros, poly_coeff, next_data) {
    // 最高位の数を取得
    let msv = convBtoI(data_with_zeros[0]);

    // 最高位の数を割る多項式にかけ．基底表示に変換
    let next_row_dec = multiplied_gx(poly_coeff, msv);
    let next_row_bin = [];
    next_row_dec.forEach(i => {
        next_row_bin.push(convItoB(i));
    });

    let poly_length = poly_coeff.length;
    let substracted_row = substract_rows(data_with_zeros, poly_length, next_row_bin);

    substracted_row[substracted_row.length] = next_data;
    // delete first entry
    substracted_row.shift();

    // 割った結果を出力（1段だけ）
    return [next_row_dec, next_row_bin, substracted_row];
}

function setDivProcessIntoHTML(iterated, shift_array) {
    let next_row_dec = iterated[0];
    let next_row_bin = iterated[1];
    var next_fullval = iterated[2];

    var decimal_row     = document.createElement("tr");
    var binary_row      = document.createElement("tr");
    var substracted_row = document.createElement("tr");
    
    // αの指数部分
    table.appendChild(decimal_row);
    HTMLValueSetter.createTds(shift_array, decimal_row);
    HTMLValueSetter.createTds([next_row_dec[0]], decimal_row, id="", classname="quotientDecimal");
    HTMLValueSetter.createTds(next_row_dec.slice(1), decimal_row);

    // αのべき乗を基底表示に
    table.appendChild(binary_row);
    HTMLValueSetter.createTds(shift_array.slice(1), binary_row);
    HTMLValueSetter.createTds(["⊕"], binary_row, id="", classname="oplus");
    HTMLValueSetter.createTds([next_row_bin[0]], binary_row, id="", classname="finalstep triviallyZero");
    HTMLValueSetter.createTds(next_row_bin.slice(1), binary_row, id="", classname="finalstep");
    HTMLValueSetter.createTds([""], binary_row, id="", classname="finalstep");

    // 1段インデント
    shift_array.push("");

    // 引き算した行を追加
    table.appendChild(substracted_row);
    HTMLValueSetter.createTds(shift_array, substracted_row);

    return [next_fullval, substracted_row];
}
    
function buttonClick() {
    table = HTMLValueSetter.clearTable("main_table", "main_form");

    var poly_coeff = getPolynomialForRSCode();
    var poly_length = poly_coeff.length;

    let element = document.getElementById('rawdata_qrcode');
    let parsed = parseBitstring(element.value);
    let msv = convBtoI(parsed[0]);

    let zeros = new Array(poly_length - 1);
    zeros.fill("00000000")
    let data_with_zeros = parsed.concat(zeros);

    var parent_tr = document.createElement("tr");
    table.appendChild(parent_tr);

    HTMLValueSetter.createTds([""], parent_tr);
    HTMLValueSetter.createTds(parsed, parent_tr);
    HTMLValueSetter.createTds(zeros, parent_tr, "filled_zeros");

    var next_tr = document.createElement("tr");
    table.appendChild(next_tr);

    var parsed_val = data_with_zeros;
    var shift_array = [""];
    // var final_result = [];

    for (let i = 0; i < parsed.length; i++){
        let next_data = data_with_zeros[poly_coeff.length + i];
        let iterated = iteration_unit(parsed_val, poly_coeff, next_data);

        var parsed_vals = setDivProcessIntoHTML(iterated, shift_array);
        parsed_val = parsed_vals[0];
        substracted_row = parsed_vals[1];
        
        if (i == parsed.length - 1) {
            HTMLValueSetter.createTds(parsed_val.slice(0, -1), substracted_row, id="", classname="finalResult");
        }
        else {
            HTMLValueSetter.createTds(parsed_val, substracted_row);
        }

    }
    var final_result = parsed_val.slice(0, -1);

    var qrFullData = document.getElementById("qrcodeFullData");
    qrFullData.value = parsed.concat(final_result);
    console.log(final_result);
}

function showFullQRCode() {
    var qrFullData = document.getElementById("qrcodeFullData");
    var bitwiseQRCode = [];
    qrFullData.value.split(',').forEach(e => {
        bitwiseQRCode = bitwiseQRCode.concat(e.split(''));
    });
    console.log(bitwiseQRCode);

    var versionAndError = HTMLValueGetter.getQRCodeFullVersion();
    console.log(versionAndError.slice(0,1));
    
    var qrCode = setDataToQRCode(bitwiseQRCode,
        parseInt(versionAndError.slice(0, 1), 10),
        versionAndError.slice(-1),
        HTMLValueGetter.getMaskID());

    var viewer = HTMLValueSetter.clearTable("showQRCode", "showQRCodeParent");

    console.log(qrCode);

    qrCode.forEach(row => {
        var r = document.createElement("tr");

        row.split('').forEach(elem => {
            var td = document.createElement("td");
            td.id = "qrCodeElement"
            r.appendChild(td);

            var p = document.createElement("div");
            if (elem == "#") {
                p.id = "k";
            }
            else if (elem == ".") {
                p.id = "w";
            }
            td.appendChild(p);
        });

        viewer.appendChild(r);

    });

    // var svg1 = document.getElementById("svgArea");
    // // var round = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    // // round.setAttributeNS(null,"cx", 220);
    // // round.setAttributeNS(null,"cy", 80);
    // // round.setAttributeNS(null,"r", 50);
    // // round.setAttributeNS(null,"fill", "#EFC1C1");
    // // round.setAttributeNS(null,"stroke-width", "5");
    // // round.setAttributeNS(null,"stroke", "#C9949C");
    // // svg1.appendChild(round);
    // appendText(svg1);
    // //svg1.insertBefore(round,square);

    // downloadSvg(svg1, "download.svg");
      
}

function appendText(rootobj) {
    var textobj = document.createTextNode("10001100");
    var textele = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textele.appendChild(textobj);
    textele.setAttributeNS(null, "x", 100);
    textele.setAttributeNS(null, "y", 20);
    textele.setAttributeNS(null, "font-family", "serif");
    textele.setAttributeNS(null, "font-size", 18);
    textele.setAttributeNS(null, "fill", "#f00");
    rootobj.appendChild(textele);
}
  
function downloadSvg(svgNode, filename) {
    const svgText = new XMLSerializer().serializeToString(svgNode);
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
  
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = filename;
  
    document.body.appendChild(a);
    a.click();
  
    document.body.removeChild(a);
    URL.revokeObjectURL(svgUrl);
}

function parseBitstring(str) {
    let splitted_str = str.split(' ');
    let formatted_array = [];
    splitted_str.forEach(e => {
        if (e.length == 8) {
            formatted_array.push(e);
        }
        else if (e.length == 0) {
            // do nothing
        }
        else if (e.length < 8) {
            let filled = e;
            for (var i = 0; i < 8 - e.length; i++){
                filled = "0" + filled;
            }
            formatted_array.push(filled);
        } else {
            alert("Ill-formatted");
        }
    });
    return formatted_array;
}