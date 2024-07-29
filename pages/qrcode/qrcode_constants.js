const polyDegree = {
    "1L": 7,
    "1M": 10,
    "1Q": 13,
    "1H": 17,
    "2L": 10,
    "2M": 16,
    "2Q": 22,
    "2H": 28,
    "3L": 15,
    "3M": 26,
    "3Q": 36,
    "3H": 44,
    "4L": 20,
    "4M": 36,
    "4Q": 52,
    "4H": 64,
};

const polyCoeffs = {
    7: [0, 87, 229, 146, 149, 238, 102, 21],
    10: [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45],
    13: [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78],
    15: [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105],
    16: [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120],
    17: [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136],
    20: [0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190],
    22: [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231],
    26: [0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153, 145, 218, 70],
    28: [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195, 212, 119, 242, 37, 9, 123],
    36: [0, 200, 183, 98, 16, 172, 31, 246, 234, 60, 152, 115, 0, 167, 152, 113, 248, 238, 107, 18, 63, 218, 37, 87, 210, 105, 177, 120, 74, 121, 196, 117, 251, 113, 233, 30, 120],
    44: [0, 190, 7, 61, 121, 71, 246, 69, 55, 168, 188, 89, 243, 191, 25, 72, 123, 9, 145, 14, 247, 1, 238, 44, 78, 143, 62, 224, 126, 118, 114, 68, 163, 52, 194, 217, 147, 204, 169, 37, 130, 113, 102, 73, 181],
    52: [0, 116, 50, 86, 186, 50, 220, 251, 89, 192, 46, 86, 127, 124, 19, 184, 233, 151, 215, 22, 14, 59, 145, 37, 242, 203, 134, 254, 89, 190, 94, 59, 65, 124, 113, 100, 233, 235, 121, 22, 76, 86, 97, 39, 242, 200, 220, 101, 33, 239, 254, 116, 51],
    64: [0, 45, 51, 175, 9, 7, 158, 159, 49, 68, 119, 92, 123, 177, 204, 187, 254, 200, 78, 141, 149, 119, 26, 127, 53, 160, 93, 199, 212, 29, 24, 145, 156, 208, 150, 218, 209, 4, 216, 91, 47, 184, 146, 47, 140, 195, 195, 125, 242, 238, 63, 99, 108, 140, 230, 242, 31, 204, 11, 178, 243, 217, 156, 213, 231]
};

const fullDataCodeLengths = {
    "1L": 19,
    "1M": 16,
    "1Q": 13,
    "1H": 9,
    "2L": 34,
    "2M": 28,
    "2Q": 22,
    "2H": 16,
    "3L": 55,
    "3M": 44,
    "3Q": 34,
    "3H": 26,
    "4L": 80,
    "4M": 64,
    "4Q": 48,
    "4H": 36,
};

const gfBaseExpr = [
    "00000001", "00000010", "00000100", "00001000", "00010000", "00100000", "01000000", "10000000",
    "00011101", "00111010", "01110100", "11101000", "11001101", "10000111", "00010011", "00100110",
    "01001100", "10011000", "00101101", "01011010", "10110100", "01110101", "11101010", "11001001",
    "10001111", "00000011", "00000110", "00001100", "00011000", "00110000", "01100000", "11000000",
    "10011101", "00100111", "01001110", "10011100", "00100101", "01001010", "10010100", "00110101",
    "01101010", "11010100", "10110101", "01110111", "11101110", "11000001", "10011111", "00100011",
    "01000110", "10001100", "00000101", "00001010", "00010100", "00101000", "01010000", "10100000",
    "01011101", "10111010", "01101001", "11010010", "10111001", "01101111", "11011110", "10100001",
    "01011111", "10111110", "01100001", "11000010", "10011001", "00101111", "01011110", "10111100",
    "01100101", "11001010", "10001001", "00001111", "00011110", "00111100", "01111000", "11110000",
    "11111101", "11100111", "11010011", "10111011", "01101011", "11010110", "10110001", "01111111",
    "11111110", "11100001", "11011111", "10100011", "01011011", "10110110", "01110001", "11100010",
    "11011001", "10101111", "01000011", "10000110", "00010001", "00100010", "01000100", "10001000",
    "00001101", "00011010", "00110100", "01101000", "11010000", "10111101", "01100111", "11001110",
    "10000001", "00011111", "00111110", "01111100", "11111000", "11101101", "11000111", "10010011",
    "00111011", "01110110", "11101100", "11000101", "10010111", "00110011", "01100110", "11001100",
    "10000101", "00010111", "00101110", "01011100", "10111000", "01101101", "11011010", "10101001",
    "01001111", "10011110", "00100001", "01000010", "10000100", "00010101", "00101010", "01010100",
    "10101000", "01001101", "10011010", "00101001", "01010010", "10100100", "01010101", "10101010",
    "01001001", "10010010", "00111001", "01110010", "11100100", "11010101", "10110111", "01110011",
    "11100110", "11010001", "10111111", "01100011", "11000110", "10010001", "00111111", "01111110",
    "11111100", "11100101", "11010111", "10110011", "01111011", "11110110", "11110001", "11111111",
    "11100011", "11011011", "10101011", "01001011", "10010110", "00110001", "01100010", "11000100",
    "10010101", "00110111", "01101110", "11011100", "10100101", "01010111", "10101110", "01000001",
    "10000010", "00011001", "00110010", "01100100", "11001000", "10001101", "00000111", "00001110",
    "00011100", "00111000", "01110000", "11100000", "11011101", "10100111", "01010011", "10100110",
    "01010001", "10100010", "01011001", "10110010", "01111001", "11110010", "11111001", "11101111",
    "11000011", "10011011", "00101011", "01010110", "10101100", "01000101", "10001010", "00001001",
    "00010010", "00100100", "01001000", "10010000", "00111101", "01111010", "11110100", "11110101",
    "11110111", "11110011", "11111011", "11101011", "11001011", "10001011", "00001011", "00010110",
    "00101100", "01011000", "10110000", "01111101", "11111010", "11101001", "11001111", "10000011",
    "00011011", "00110110", "01101100", "11011000", "10101101", "01000111", "10001110",
    // dummy element
    "00000000"
];

const qrCodeTemplates = {
    1:
        [
            '#######.e;;;;.#######',
            '#.....#.d;;;;.#.....#',
            '#.###.#.c;;;;.#.###.#',
            '#.###.#.b;;;;.#.###.#',
            '#.###.#.a;;;;.#.###.#',
            '#.....#.9;;;;.#.....#',
            '#######.#.#.#.#######',
            '........8;;;;........',
            '012345#67;;;;789abcde',
            ';;;;;;.;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;',
            '........#;;;;;;;;;;;;',
            '#######.6;;;;;;;;;;;;',
            '#.....#.5;;;;;;;;;;;;',
            '#.###.#.4;;;;;;;;;;;;',
            '#.###.#.3;;;;;;;;;;;;',
            '#.###.#.2;;;;;;;;;;;;',
            '#.....#.1;;;;;;;;;;;;',
            '#######.0;;;;;;;;;;;;'
        ],
    2:
        [
            '#######.e;;;;;;;;.#######',
            '#.....#.d;;;;;;;;.#.....#',
            '#.###.#.c;;;;;;;;.#.###.#',
            '#.###.#.b;;;;;;;;.#.###.#',
            '#.###.#.a;;;;;;;;.#.###.#',
            '#.....#.9;;;;;;;;.#.....#',
            '#######.#.#.#.#.#.#######',
            '........8;;;;;;;;........',
            '012345#67;;;;;;;;789abcde',
            ';;;;;;.;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;#####;;;;',
            '........#;;;;;;;#...#;;;;',
            '#######.6;;;;;;;#.#.#;;;;',
            '#.....#.5;;;;;;;#...#;;;;',
            '#.###.#.4;;;;;;;#####;;;;',
            '#.###.#.3;;;;;;;;;;;;;;;;',
            '#.###.#.2;;;;;;;;;;;;;;;;',
            '#.....#.1;;;;;;;;;;;;;;;;',
            '#######.0;;;;;;;;;;;;;;;;'
        ],
    3:
        [
            '#######.e;;;;;;;;;;;;.#######',
            '#.....#.d;;;;;;;;;;;;.#.....#',
            '#.###.#.c;;;;;;;;;;;;.#.###.#',
            '#.###.#.b;;;;;;;;;;;;.#.###.#',
            '#.###.#.a;;;;;;;;;;;;.#.###.#',
            '#.....#.9;;;;;;;;;;;;.#.....#',
            '#######.#.#.#.#.#.#.#.#######',
            '........8;;;;;;;;;;;;........',
            '012345#67;;;;;;;;;;;;789abcde',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;#####;;;;',
            '........#;;;;;;;;;;;#...#;;;;',
            '#######.6;;;;;;;;;;;#.#.#;;;;',
            '#.....#.5;;;;;;;;;;;#...#;;;;',
            '#.###.#.4;;;;;;;;;;;#####;;;;',
            '#.###.#.3;;;;;;;;;;;;;;;;;;;;',
            '#.###.#.2;;;;;;;;;;;;;;;;;;;;',
            '#.....#.1;;;;;;;;;;;;;;;;;;;;',
            '#######.0;;;;;;;;;;;;;;;;;;;;'
        ],
    4:
        [
            '#######.e;;;;;;;;;;;;;;;;.#######',
            '#.....#.d;;;;;;;;;;;;;;;;.#.....#',
            '#.###.#.c;;;;;;;;;;;;;;;;.#.###.#',
            '#.###.#.b;;;;;;;;;;;;;;;;.#.###.#',
            '#.###.#.a;;;;;;;;;;;;;;;;.#.###.#',
            '#.....#.9;;;;;;;;;;;;;;;;.#.....#',
            '#######.#.#.#.#.#.#.#.#.#.#######',
            '........8;;;;;;;;;;;;;;;;........',
            '012345#67;;;;;;;;;;;;;;;;789abcde',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;.;;;;;;;;;;;;;;;;;;;;;;;;;;',
            ';;;;;;#;;;;;;;;;;;;;;;;;#####;;;;',
            '........#;;;;;;;;;;;;;;;#...#;;;;',
            '#######.6;;;;;;;;;;;;;;;#.#.#;;;;',
            '#.....#.5;;;;;;;;;;;;;;;#...#;;;;',
            '#.###.#.4;;;;;;;;;;;;;;;#####;;;;',
            '#.###.#.3;;;;;;;;;;;;;;;;;;;;;;;;',
            '#.###.#.2;;;;;;;;;;;;;;;;;;;;;;;;',
            '#.....#.1;;;;;;;;;;;;;;;;;;;;;;;;',
            '#######.0;;;;;;;;;;;;;;;;;;;;;;;;'
        ],
};

const errorLevelIDs = {
    "L": 0b01,
    "M": 0b00,
    "Q": 0b11,
    "H": 0b10
};

const maskedFormatInfoDatabits = {
    0:  0x5412,
    1:  0x5125,
    2:  0x5e7c,
    3:  0x5b4b,
    4:  0x45f9,
    5:  0x40ce,
    6:  0x4f97,
    7:  0x4aa0,
    8:  0x77c4,
    9:  0x72f3,
    10: 0x7daa,
    11: 0x789d,
    12: 0x662f,
    13: 0x6318,
    14: 0x6c41,
    15: 0x6976,
    16: 0x1689,
    17: 0x13be,
    18: 0x1ce7,
    19: 0x19d0,
    20: 0x0762,
    21: 0x0255,
    22: 0x0d0c,
    23: 0x083b,
    24: 0x355f,
    25: 0x3068,
    26: 0x3f31,
    27: 0x3a06,
    28: 0x24b4,
    29: 0x2183,
    30: 0x2eda,
    31: 0x2bed,
};

const qrEndPattern = "0000";
const qrWeedCodes = ["11101100", "00010001"];