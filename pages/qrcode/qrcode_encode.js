
class NumberMode{
    static dataModeID = "0001";
    static get dataLengthBitLength() {
        // this dataLengthBitLength is valid only for version 1 -- 9
        return 10;
    }
    
    static encodeText(str) {
        var resultArray = new Array();
        str.split('').forEach(s => {
            resultArray.push(parseInt(s, 10));
        });
        return resultArray;
    }

    static encodeToBitArray(str) {
        var enc = NumberMode.encodeText(str);
        var len = enc.length;
        var iter = Math.floor(len / 3);

        var resultArray = new Array();
        for (let i = 0; i < iter; i++){
            var val = 100 * enc[3 * i] + 10 * enc[3 * i + 1] + enc[3 * i + 2];
            var bin = ("0000000000" + val.toString(2)).slice(-10);
            resultArray.push(bin);
        }

        if (len % 3 == 2) {
            var val = 10 * enc[len - 2] + enc[len - 1];
            var bin = ("0000000" + val.toString(2)).slice(-7);
            resultArray.push(bin);
        }

        if (len % 3 == 1) {
            var val = enc[len - 1];
            var bin = ("0000" + val.toString(2)).slice(-4);
            resultArray.push(bin);
        }

        console.log(bin);

        return resultArray;
    }

    static getDataLength(rawText) {
        return NumberMode.encodeText(rawText).length;
    }

    static getDataLengthBitString(rawText) {
        let dataLength = NumberMode.getDataLength(rawText);
        let zeroFiller = new Array(NumberMode.dataLengthBitLength);
        zeroFiller.fill('0');
        return (zeroFiller.join('') + dataLength.toString(2)).slice(-NumberMode.dataLengthBitLength);
    }

}

class AlphabetMode{
    static dataModeID = "0010";
    static get dataLengthBitLength() {
        // this dataLengthBitLength is valid only for version 1 -- 9
        return 9;
    }

    static encodeList = {
        // numbers
        "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
        "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
        // capital letters
        "A": 10, "B": 11, "C": 12, "D": 13, "E": 14,
        "F": 15, "G": 16, "H": 17, "I": 18, "J": 19,
        "K": 20, "L": 21, "M": 22, "N": 23, "O": 24,
        "P": 25, "Q": 26, "R": 27, "S": 28, "T": 29,
        "U": 30, "V": 31, "W": 32, "X": 33, "Y": 34, "Z": 35,
        // small letters (NOTE: capital and small letters are not distinguished)
        "a": 10, "b": 11, "c": 12, "d": 13, "e": 14,
        "f": 15, "g": 16, "h": 17, "i": 18, "j": 19,
        "k": 20, "l": 21, "m": 22, "n": 23, "o": 24,
        "p": 25, "q": 26, "r": 27, "s": 28, "t": 29,
        "u": 30, "v": 31, "w": 32, "x": 33, "y": 34, "z": 35,
        // some symbols
        " ": 36, "$": 37, "%": 38, "*": 39, "+": 40,
        "-": 41, ".": 42, "/": 43, ":": 44
    };
    
    static encodeText(str) {
        var resultArray = new Array();
        str.split('').forEach(s => {
            resultArray.push(AlphabetMode.encodeList[s]);
        });
        return resultArray;
    }

    static encodeToBitArray(str) {
        var enc = AlphabetMode.encodeText(str);
        var len = enc.length;
        var iter = Math.floor(len / 2);

        var resultArray = new Array();
        for (let i = 0; i < iter; i++){
            var val = enc[2 * i] * 45 + enc[2 * i + 1];
            var bin = ("00000000000" + val.toString(2)).slice(-11);
            resultArray.push(bin);
        }

        if (len % 2 == 1) {
            var val = enc[len - 1];
            var bin = ("000000" + val.toString(2)).slice(-6);
            resultArray.push(bin);
        }
        return resultArray;
    }

    static getDataLength(rawText) {
        return AlphabetMode.encodeText(rawText).length;
    }

    static getDataLengthBitString(rawText) {
        let dataLength = AlphabetMode.getDataLength(rawText);
        let zeroFiller = new Array(AlphabetMode.dataLengthBitLength);
        zeroFiller.fill('0');
        return (zeroFiller.join('') + dataLength.toString(2)).slice(-AlphabetMode.dataLengthBitLength);
    }

}

class EightbitMode{
    static dataModeID = "0100";
    static get dataLengthBitLength() {
        // this dataLengthBitLength is valid only for version 1 -- 9
        return 8;
    }

    static encodeText(str) {
        // convert string into UTF-8
        var unicodeArray = Encoding.stringToCode(str);
        var utf8Text = Encoding.convert(unicodeArray, {
            to: 'UTF8',
            from: 'UNICODE'
        });

        var resultArray = new Array();
        utf8Text.forEach(c => {
            // var c = e.charCodeAt(0);
            if ((c >> 8) > 0) {
                var msb = ("00" + (c >> 8).toString(16)).slice(-2);
                resultArray.push(msb);
            }
            var lsb = ("00" + (c & 0xff).toString(16)).slice(-2);
            resultArray.push(lsb);
        })
        return resultArray;
    }

    static encodeToBitArray(str) {
        var resultArray = new Array();
        EightbitMode.encodeText(str).forEach(s => {
            var c = parseInt(s, 16);
            var b = c.toString(2);
            resultArray.push(("00000000" + b).slice(-8));
        });
        return resultArray;
    }

    static getDataLength(rawText) {
        return Math.floor(EightbitMode.encodeToBitArray(rawText).length);
    }

    static getDataLengthBitString(rawText) {
        let dataLength = EightbitMode.getDataLength(rawText);
        let zeroFiller = new Array(EightbitMode.dataLengthBitLength);
        console.log(EightbitMode.dataLengthBitLength);
        zeroFiller.fill('0');
        return (zeroFiller.join('') + dataLength.toString(2)).slice(-EightbitMode.dataLengthBitLength);
    }

}

class KanjiMode {
    static dataModeID = "1000";
    static get dataLengthBitLength() {
        // this dataLengthBitLength is valid only for version 1 -- 9
        return 8;
    }

    static encodeText(str) {
        // convert string into SJIS
        var unicodeArray = Encoding.stringToCode(str);
        var sjisText = Encoding.convert(unicodeArray, {
            to: 'SJIS',
            from: 'UNICODE'
        });
    
        var m = sjisText.length;
        var result_array = new Array();
        var buf = "";
        
        var is_twobytes = false;
    
        for (var i = 0; i < m; i++){
            let e = sjisText[i];
    
            if (!is_twobytes) {
                buf = e.toString(16);
                // first byte of 2byte char
                if (((e >= 0x81) && (e <= 0x9f)) || ((e >= 0xe0) && (e <= 0xfc))) {
                    is_twobytes = true;
                } else {
                    result_array.push("00" + buf);
                    buf = "";
                }
            } else {
                result_array.push(buf + ("00" + e.toString(16)).slice(-2));
                buf = "";
                is_twobytes = false;
            }
        }
        return result_array;
    }

    static encodeToBitArray(str) {
        var codearray = KanjiMode.encodeText(str);
    
        var converted_binarray = new Array();
        codearray.forEach((_e) => {
            let e = parseInt(_e, 16);
    
            var buf1 = 0;
            if (e >= 0x8140 && e <= 0x9ffc) {
                // 1. substract 0x8140
                buf1 = e - 0x8140;
            }
            else if (e >= 0xe040 && e <= 0xebbf){
                // 1. substract 0xc140
                buf1 = e - 0xc140;
            } else {
                console.log("error: 1バイト文字は格納できません")
            }
            // 2. multiply 0xc0 to msb
            let buf2 = (buf1 >> 8) * 0xc0;
            // 3. add buf2 to lsb
            let buf3 = buf2 + (buf1 & 0xFF);
    
            let binstr = buf3.toString(2);
            converted_binarray.push(("0000000000000" + binstr).slice(-13));
        });
    
        return converted_binarray;
    }

    static getDataLength(rawText) {
        return Math.floor(KanjiMode.encodeToBitArray(rawText).length);
    }

    static getDataLengthBitString(rawText) {
        let dataLength = KanjiMode.getDataLength(rawText);
        let zeroFiller = new Array(KanjiMode.dataLengthBitLength);
        console.log(KanjiMode.dataLengthBitLength);
        zeroFiller.fill('0');
        return (zeroFiller.join('') + dataLength.toString(2)).slice(-KanjiMode.dataLengthBitLength);
    }
}

class QRCodeBitData {
    constructor(version, errorCorrLevel, maskID, dataEncoderClass) {
        this.dataEncoder = dataEncoderClass;
        this.dataModeID = this.dataEncoder.dataModeID;
        this._setFormatInfo(version, errorCorrLevel, maskID);
    }

    static create(version, errorCorrLevel, maskID, dataMode) {
        let dataEncoderClass;
        if (dataMode == "number") {
            dataEncoderClass = NumberMode;
        }
        else if (dataMode == "ascii") {
            dataEncoderClass = AlphabetMode;
        }
        else if (dataMode == "8bit") {
            dataEncoderClass = EightbitMode;
        }
        else if (dataMode == "kanji") {
            dataEncoderClass = KanjiMode;
        }

        return new QRCodeBitData(version, errorCorrLevel, maskID, dataEncoderClass);
    }

    _setFormatInfo(version, errorCorrLevel, maskID) {
        this.version = version;
        this.errorCorrLevel = errorCorrLevel;
        this.maskID = maskID;

        console.log("maskID", maskID);
        // set full version info (such as "1L", "3M", ...)
        this.fullVersionInfo = version.toString(10) + errorCorrLevel;
        this.fullDataCodeLength = fullDataCodeLengths[this.fullVersionInfo];
    }

    setMainDataText(rawTextInput) {
        this.rawText = rawTextInput;
        this.dataBitArray = this.dataEncoder.encodeToBitArray(rawTextInput);
        this.dataLength = this.dataEncoder.getDataLengthBitString(rawTextInput);
        console.log(this.dataBitArray);

        // convert data array into concatenated string
        this._expandToDataBitString();

        // set filler weed to make the codelength 8 no baisuu
        console.log(this.dataModeID, this.dataLength);
        let dataHeader = this.dataModeID + this.dataLength;
        this._setFillerBits(dataHeader + qrEndPattern + this.dataBitString);

        console.log("this.fillerWeedBits", this.fillerWeedBits);

        let dataMain = this.dataBitString + qrEndPattern + this.fillerWeedBits;
        this._setFillerCodes(dataHeader + dataMain, this.fullDataCodeLength);

        this.fullQRCodeData = dataHeader + dataMain + this.weedCodes;
    }

    _expandToDataBitString() {
        let dataBitString = "";
        this.dataBitArray.forEach((e) => {
            dataBitString = dataBitString + e;
        });
        this.dataBitString = dataBitString;
    }

    _setFillerBits(fullstr) {
        let cutoffLength = 8 * Math.ceil(fullstr.length / 8);
        this.fillerWeedBitsLength = cutoffLength - fullstr.length;
        if (this.fillerWeedBitsLength > 0) {
            this.fillerWeedBits = "00000000".slice(-this.fillerWeedBitsLength);
        }
        else {
            this.fillerWeedBits = "";
        }
    }

    _setFillerCodes(bitFilledFullCodes, fullDataCodeLength) {
        let currentStringBytes = Math.floor(bitFilledFullCodes.length / 8);
        let iterNum = fullDataCodeLength - currentStringBytes;

        let weedCodes = "";
        for (var i = 0; i < iterNum; i++){
            weedCodes = weedCodes + qrWeedCodes[i % 2];
        }
        this.weedCodes = weedCodes;
    }

    static makeFormattedCodes(bitString) {
        var result = new Array();
    
        var cnt = 0;
        bitString.split("").forEach((s) => {
            result.push(s);
            cnt++;
            if (cnt % 8 == 0) {
                // 8ビットおきにスペースを入れる
                result.push(" ");
            }
        });
        return result.join("");
    }

    getMaskedFormatInfoBits() {
        let formatInfoID = (errorLevelIDs[this.errorCorrLevel] << 3) + this.maskID;
        let filledInfoBits = "000000000000000" + maskedFormatInfoDatabits[formatInfoID].toString(2);
        return filledInfoBits.slice(-15);
    }
}

function showDatamode() {
    var _datamode = HTMLValueGetter.getDatamode();

    var qrVersion = HTMLValueGetter.getQRCodeVersion();
    var qrErrorLevel = HTMLValueGetter.getQRCodeErrorLevel();
    var qrMaskID = HTMLValueGetter.getMaskID();
    console.log(qrMaskID);

    var qrCode = QRCodeBitData.create(qrVersion, qrErrorLevel, qrMaskID, _datamode);

    var inputText = HTMLValueGetter.getInputText();
    qrCode.setMainDataText(inputText);

    var qrcode_form = document.getElementById("rawdata_qrcode");
    qrcode_form.value = QRCodeBitData.makeFormattedCodes(fillingWeeds(qrCode.fullQRCodeData));
}

function fillingWeeds(filledString, fullDataLength) {
    var currentStringBytes = Math.floor(filledString.length / 8);
    var iterNum = fullDataLength - currentStringBytes;

    var resultStr = filledString;
    for (var i = 0; i < iterNum; i++){
        resultStr = resultStr + qrWeedCodes[i % 2];
    }

    return resultStr
}