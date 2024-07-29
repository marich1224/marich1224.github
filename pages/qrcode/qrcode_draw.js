
function getDataCoordinates(version) {
    const template = qrCodeTemplates[version];
    const L = template.length;

    var p = [L - 1, L - 1];
    var yDirection = -1;

    var datacoordsArray = new Array();

    let formatInfoCoords = {};
    for (var i = 0; i < 15; i++){
        formatInfoCoords[i] = new Array();
    }

    console.log("formatInfoCoords", formatInfoCoords);
    var cnt = 0;

    for (var i = 0; i < L * L; i++){
        // if reach to the end of the leftmost column
        if (p[0] < 0) {
            break;
        }
        
        let str = template[p[1]][p[0]];

        // if the pointer is on the data placement zone
        if (str == ";") {
            datacoordsArray.push([p[0], p[1], cnt]);
            cnt += 1;
        }
        else {
            // get coordinates of format information bits
            for (var j = 0; j < 15; j++){
                if (str == j.toString(16)) {
                    formatInfoCoords[j].push([p[0], p[1]]);
                }
            }
        }

        // moving pointer in zigzag way
        if (i % 2 == 0) {
            p[0] = p[0] - 1;
        } else {
            p[1] = p[1] + yDirection;
            p[0] = p[0] + 1;
        }

        // if reach to the end
        if ((p[1] == -1) || (p[1] == L)) {
            // go onestep-backward
            p[1] = p[1] - yDirection

            // reverse direction
            yDirection *= -1

            // move to next column
            p[0] = p[0] - 2;
            if (p[0] == 6) {
                // if on the timing pattern
                p[0] = p[0] - 1;
            }
        }
    }

    return [datacoordsArray, formatInfoCoords];
}

function maskData(i, j, maskID) {
    if (maskID == 0) {
        if ((i + j) % 2 == 0) return true;
    }
    
    else if (maskID == 1) {
        if (i % 2 == 0) return true;
    }

    else if (maskID == 2) {
        if (j % 3 == 0) return true;
    }

    else if (maskID == 3) {
        if ((i + j) % 3 == 0) return true;
    }
    
    else if (maskID == 4) {
        if ((Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0) return true;
    }

    else if (maskID == 5) {
        if ((i * j) % 2 + (i * j) % 3 == 0) return true;
    }

    else if (maskID == 6) {
        if (((i * j) % 2 + (i * j) % 3) % 2 == 0) return true;
    }

    else if (maskID == 7) {
        if (((i + j) % 2 + (i * j) % 3) % 2 == 0) return true;
    }

    return false;
}

function getMaskedFormatInfoBits(errorLevel, maskID) {
    let formatInfoID = (errorLevelIDs[errorLevel] << 3) + maskID;
    let filledInfoBits = "000000000000000" + maskedFormatInfoDatabits[formatInfoID].toString(2);
    return filledInfoBits.slice(-15);
}

// function setDataToQRCode(binaryDataArrayWithRSCode, version, errorLevel, maskID) {
//     let _crds = getDataCoordinates(version);
//     const coordsArray = _crds[0];
//     const formatInfoCoords = _crds[1];
//     const dataLength = binaryDataArrayWithRSCode.length;
//     const pattern = [".", "#"];
//     var template = new Array();
    
//     qrCodeTemplates[version].forEach(s => {
//         template.push(s.split(""));
//     });

//     coordsArray.forEach(c => {
//         let x = c[0];
//         let y = c[1];
//         let i = c[2];

//         var d = 0;
//         if (i >= dataLength) {
//             // fill with zero
//             d = 0;
//         } else {
//             d = parseInt(binaryDataArrayWithRSCode[i], 2);
//         }

//         var masked_d = d;
//         if (maskData(x, y, maskID)) {
//             masked_d = 1 - d;
//         }

//         // set databit to QR code
//         template[y][x] = pattern[masked_d];
//     });

//     var maskedFormatInfoData = getMaskedFormatInfoBits(errorLevel, maskID);

//     for (var k = 0; k < 15; k++){
//         formatInfoCoords[k].forEach(c => {
//             template[c[1]][c[0]] = pattern[parseInt(maskedFormatInfoData[k], 2)];
//         });
//     }

//     console.log(template);

//     var result = new Array();
//     template.forEach(s => {
//         result.push(s.join(""));
//     });
    
//     return result;
// }

function setDataToQRCode(binaryDataArrayWithRSCode, version, errorLevel, maskID) {
    let _crds = getDataCoordinates(version);
    const coordsArray = _crds[0];
    const formatInfoCoords = _crds[1];
    const dataLength = binaryDataArrayWithRSCode.length;
    const pattern = [".", "#"];
    var template = new Array();
    
    // initialize template
    qrCodeTemplates[version].forEach(s => {
        template.push(s.split(""));
    });

    coordsArray.forEach(c => {
        let x = c[0];
        let y = c[1];
        let i = c[2];

        var d = 0;
        if (i >= dataLength) {
            // fill with zero
            d = 0;
        } else {
            d = parseInt(binaryDataArrayWithRSCode[i], 2);
        }

        var masked_d = d;
        // 縦方向が i だった(i行j列のカウント)
        if (maskData(y, x, maskID)) {
            masked_d = 1 - d;
        }

        // set databit to QR code
        template[y][x] = pattern[masked_d];
    });

    var maskedFormatInfoData = getMaskedFormatInfoBits(errorLevel, maskID);

    for (var k = 0; k < 15; k++){
        formatInfoCoords[k].forEach(c => {
            template[c[1]][c[0]] = pattern[parseInt(maskedFormatInfoData[k], 2)];
        });
    }

    console.log(template);

    var result = new Array();
    template.forEach(s => {
        result.push(s.join(""));
    });
    
    return result;
}