var mData_item = {
    ts: Date.now(),
    data: "45DB100E9A93DE2B8ED524FEDB600800000B4000000960028A011B0057254750000B4000000960028A011B005725475000000000000078778800000000000000",
    sector: 0x08
}

var hbitmap = // DT 40000
        {
            f: {
                101: {offset: 0x00, size: 10},
                102: {offset: 0x0A, size: 10},
                201: {offset: 0x14, size: 32},
                111: {offset: 0x34, size: 4},
                203: {offset: -0x01, size: 1},
                204: {offset: -0x02, size: 1}
            },
            v: {
                201: {math: "('0000000000'+f[201]).substr(-10)"}
            }
        };


var bitmaps = [];

bitmaps[0x1C1] = bitmaps[0xE1] = // Layout E.1
        {
            f: {
                101: {offset: 0x00, size: 10},
                102: {offset: 0x0A, size: 10},
                201: {offset: 0x14, size: 32},
                111: {offset: 0x34, size: 4},
                112: {offset: 0x38, size: 5},
                202: {offset: 0x3D, size: 16},
                121: {offset: 0x4D, size: 10},
                //
                422: {offset: 0x80, size: 16},
                402: {offset: 0x90, size: 16},
                403: {offset: 0xA0, size: 11},
                421.1: {offset: 0xAB, size: 2},
                421.2: {offset: 0xAD, size: 2},
                432: {offset: 0xB1, size: 1},
                431: {offset: 0xB2, size: 1},
                433: {offset: 0xB3, size: 3},
                412: {offset: 0xB9, size: 8},
                322: {offset: 0xC4, size: 19},
                441: {offset: 0xD7, size: 2},
                303: {offset: 0xD9, size: 1},
                zoo: {offset: 0xDA, size: 1},
                502: {offset: 0xE0, size: 32}
            },
            v: {
                 322: { math: "(f[322]/100).toFixed(2)" },
                }
        };


bitmaps[0x1C3] = bitmaps[0xE3] = // Layout E.3
        {
            f: {
                101: {offset: 0x00, size: 10},
                102: {offset: 0x0A, size: 10},
                201: {offset: 0x14, size: 32},
                111: {offset: 0x34, size: 4},
                112: {offset: 0x38, size: 5},
                202: {offset: 61, size: 16},
                121: {offset: 0x4D, size: 10},
                322: {offset: 0xBC, size: 22},
                502: {offset: 224, size: 32},
                422: {offset: 0x80, size: 16},
                405: {offset: 0x90, size: 23},
                441: {offset: 0xD2, size: 2},
                412: {offset: 0xAB, size: 7},
                421.0: {offset: 0xB2, size: 2},
                421.1: {offset: 0xB4, size: 2},
                421.2: {offset: 0xB6, size: 2},
                421.3: {offset: 0xB8, size: 2},
                421.4: {offset: 0xBA, size: 2},
                303: {offset: 0xD4, size: 1}
            },
            v: {
                322: {math: "(f[322]/100).toFixed(2)"},
                }
        };

bitmaps[0x1C5] = bitmaps[0xE5] = // Layout E.5
{
	f: {
		101: {offset: 0x00, size: 10},	//0-9
		102: {offset: 0x0A, size: 10},	//10-19
		201: {offset: 0x14, size: 32},	//20-51
		111: {offset: 0x34, size: 4},	//52-55
		112: {offset: 0x38, size: 5},	//56-60
		202: {offset: 0x3D, size: 13},	//61-73
		121: {offset: 0x4A, size: 10},	//74-83
		317: {offset: 0x54, size: 23},	//84-106
		304: {offset: 0x6B, size: 10},	//107-116
										//117-127
		405: {offset: 0x80, size: 23},	//128-150
		414: {offset: 0x97, size: 7},	//151-157
		412: {offset: 0x9E, size: 7},	//158-164
										//165-166
		322: {offset: 0xA7, size: 19},	//167-185
		422: {offset: 0xBA, size: 16},	//186-201
		303: {offset: 0xCA, size: 1},	//202
										//203
		424: {offset: 0xCC, size: 12},	//204-215
		433: {offset: 0xD8, size: 7},	//216-222
										//223
		502: {offset: 0xE0, size: 32},	//224-255
	},
	v: {
		322: {math: "(f[322]/100).toFixed(2)"},
		}
};

function parseBitmap(dataParse) {
    var current_timestamp = mData_item.ts ? Date.parse(mData_item.ts) : Date.now();
    var offset = mData_item.sector === -1 ? 0x80 : 0x00;
    var DT = readBits(dataParse.data, 0 + offset, 10); // check application department	

    if ([0x106, 0x108, 0x10A, 0x10E, 0x110, 0x117].indexOf(DT) == -1) return null;

    var L = readBits(mData_item.data, 52 + offset, 4);
    if (L === 0x0E) L = readBits(mData_item.data, 52 + offset, 9);
    if (L === 0x0F) L = readBits(mData_item.data, 52 + offset, 14);
    var bitmap = bitmaps[L] ? bitmaps[L] : hbitmap;


    try {
        var f = {};
        for (var n in bitmap.f) {
            if (bitmap.f[n] && bitmap.f[n].size)
                f[n] = readBits(mData_item.data, bitmap.f[n].offset + offset, bitmap.f[n].size);
        }
        var v = {
            699: current_timestamp
        };
        for (var m in bitmap.v) {
            if (bitmap.v[m] && bitmap.v[m].math)
                v[m] = eval(bitmap.v[m].math);
        }
        mData_item.fvs = {
            f: f,
            v: v
        };
    } catch (e) {
        console.warn(e);
    }
    return mData_item;
}

function readBits(data, offset, size, length) {
    offset = offset || 0;
    size = size || (length || data.length) * 8;

    // Проверка на корректность входных данных
    if (offset < 0 || size < 0 || offset + size > data.length * 8) {
        throw new Error('Invalid offset or size');
    }
    
    // Вычисление индекса начала и конца части строки, которую нужно прочитать
    const startIdx = offset >>> 2;
    const endIdx = (offset + size - 1) >>> 2;
    
    // Расчет остатка от деления на 4 для правильного смещения
    const remainder = 3 - ((offset + size - 1) & 3);
    
    // Парсинг и вычисление битов
    const parsedValue = parseInt(data.substr(startIdx, 1 + endIdx - startIdx), 16);
    const shiftedValue = parsedValue / Math.pow(2, remainder);
    const result = Math.floor(shiftedValue) % Math.pow(2, size);

    return result;
}

var result = parseBitmap(mData_item)

var balance = readBits(mData_item.data, 0xA7 + 0x00, 19)

console.log(balance)