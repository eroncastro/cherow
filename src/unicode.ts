import { Chars, CharType, AsciiLookup } from './chars';

/*@internal*/
export function isIdentifierPart(code: Chars): boolean {
  return (AsciiLookup[code] & CharType.IDContinue) > 0 || ((unicodeLookup[(code >>> 5) + 0] >>> code) & 31 & 1) > 0;
}

/*@internal*/
export function isIdentifierStart(code: Chars): boolean {
  return (AsciiLookup[code] & CharType.IDStart) > 0 || ((unicodeLookup[(code >>> 5) + 34816] >>> code) & 31 & 1) > 0;
}

export const unicodeLookup = ((compressed, lookup) => {
  const result = new Uint32Array(104448);
  let index = 0;
  let subIndex = 0;
  while (index < 3392) {
    const inst = compressed[index++];
    if (inst < 0) {
      subIndex -= inst;
    } else {
      let code = compressed[index++];
      if (inst & 2) code = lookup[code];
      if (inst & 1) {
        result.fill(code, subIndex, (subIndex += compressed[index++]));
      } else {
        result[subIndex++] = code;
      }
    }
  }
  return result;
})(
  [
    -1,
    2,
    28,
    2,
    29,
    2,
    5,
    -1,
    0,
    77595648,
    3,
    46,
    2,
    3,
    0,
    14,
    2,
    57,
    2,
    58,
    3,
    0,
    3,
    0,
    3168796671,
    0,
    4294956992,
    2,
    1,
    2,
    0,
    2,
    59,
    3,
    0,
    4,
    0,
    4294966523,
    3,
    0,
    4,
    2,
    15,
    2,
    60,
    2,
    0,
    0,
    4294836735,
    0,
    3221225471,
    0,
    4294901942,
    2,
    61,
    0,
    134152192,
    3,
    0,
    2,
    0,
    4294951935,
    3,
    0,
    2,
    0,
    2683305983,
    0,
    2684354047,
    2,
    17,
    2,
    0,
    0,
    4294961151,
    3,
    0,
    2,
    2,
    20,
    2,
    0,
    0,
    608174079,
    2,
    0,
    2,
    127,
    2,
    6,
    2,
    62,
    -1,
    2,
    64,
    2,
    26,
    2,
    1,
    3,
    0,
    3,
    0,
    4294901711,
    2,
    40,
    0,
    4089839103,
    0,
    2961209759,
    0,
    1342439375,
    0,
    4294543342,
    0,
    3547201023,
    0,
    1577204103,
    0,
    4194240,
    0,
    4294688750,
    2,
    2,
    0,
    80831,
    0,
    4261478351,
    0,
    4294549486,
    2,
    2,
    0,
    2965387679,
    0,
    196559,
    0,
    3594373100,
    0,
    3288319768,
    0,
    8469959,
    2,
    171,
    0,
    4294828031,
    0,
    3825204735,
    0,
    123747807,
    0,
    65487,
    2,
    3,
    0,
    4092591615,
    0,
    1080049119,
    0,
    458703,
    2,
    3,
    2,
    0,
    0,
    2163244511,
    0,
    4227923919,
    0,
    4236247020,
    2,
    68,
    0,
    4284449919,
    0,
    851904,
    2,
    4,
    2,
    16,
    0,
    67076095,
    -1,
    2,
    69,
    0,
    1006628014,
    0,
    4093591391,
    -1,
    0,
    50331649,
    0,
    3265266687,
    2,
    34,
    0,
    4294844415,
    0,
    4278190047,
    2,
    23,
    2,
    125,
    -1,
    3,
    0,
    2,
    2,
    33,
    2,
    0,
    2,
    9,
    2,
    0,
    2,
    13,
    2,
    14,
    3,
    0,
    10,
    2,
    71,
    2,
    0,
    2,
    72,
    2,
    73,
    2,
    74,
    2,
    0,
    2,
    75,
    2,
    0,
    2,
    10,
    0,
    261632,
    2,
    19,
    3,
    0,
    2,
    2,
    11,
    2,
    4,
    3,
    0,
    18,
    2,
    76,
    2,
    5,
    3,
    0,
    2,
    2,
    77,
    0,
    2088959,
    2,
    31,
    2,
    8,
    0,
    909311,
    3,
    0,
    2,
    0,
    814743551,
    2,
    42,
    0,
    67057664,
    3,
    0,
    2,
    2,
    45,
    2,
    0,
    2,
    32,
    2,
    0,
    2,
    18,
    2,
    7,
    0,
    268374015,
    2,
    30,
    2,
    51,
    2,
    0,
    2,
    78,
    0,
    134153215,
    -1,
    2,
    6,
    2,
    0,
    2,
    7,
    0,
    2684354559,
    0,
    67044351,
    0,
    1073676416,
    -2,
    3,
    0,
    2,
    2,
    43,
    0,
    1046528,
    3,
    0,
    3,
    2,
    8,
    2,
    0,
    2,
    41,
    0,
    4294960127,
    2,
    9,
    2,
    39,
    2,
    10,
    0,
    4294377472,
    2,
    21,
    3,
    0,
    7,
    0,
    4227858431,
    3,
    0,
    8,
    2,
    11,
    2,
    0,
    2,
    80,
    2,
    9,
    2,
    0,
    2,
    81,
    2,
    82,
    2,
    83,
    -1,
    2,
    122,
    0,
    1048577,
    2,
    84,
    2,
    12,
    -1,
    2,
    12,
    0,
    131042,
    2,
    85,
    2,
    86,
    2,
    87,
    2,
    0,
    2,
    35,
    -83,
    2,
    0,
    2,
    53,
    2,
    7,
    3,
    0,
    4,
    0,
    1046559,
    2,
    0,
    2,
    13,
    2,
    0,
    0,
    2147516671,
    2,
    24,
    3,
    88,
    2,
    2,
    0,
    -16,
    2,
    89,
    0,
    524222462,
    2,
    4,
    2,
    0,
    0,
    4269801471,
    2,
    4,
    2,
    0,
    2,
    14,
    2,
    79,
    2,
    15,
    3,
    0,
    2,
    2,
    49,
    2,
    16,
    -1,
    2,
    17,
    -16,
    3,
    0,
    205,
    2,
    18,
    -2,
    3,
    0,
    655,
    2,
    19,
    3,
    0,
    36,
    2,
    70,
    -1,
    2,
    17,
    2,
    9,
    3,
    0,
    8,
    2,
    91,
    2,
    119,
    2,
    0,
    0,
    3220242431,
    3,
    0,
    3,
    2,
    20,
    2,
    22,
    2,
    92,
    3,
    0,
    2,
    2,
    93,
    2,
    21,
    -1,
    2,
    22,
    2,
    0,
    2,
    27,
    2,
    0,
    2,
    8,
    3,
    0,
    2,
    0,
    67043391,
    0,
    3909091327,
    2,
    0,
    2,
    25,
    2,
    8,
    2,
    23,
    3,
    0,
    2,
    0,
    67076097,
    2,
    7,
    2,
    0,
    2,
    24,
    0,
    67059711,
    0,
    4236247039,
    3,
    0,
    2,
    0,
    939524103,
    0,
    8191999,
    2,
    97,
    2,
    98,
    2,
    14,
    2,
    95,
    3,
    0,
    3,
    0,
    67057663,
    3,
    0,
    349,
    2,
    99,
    2,
    100,
    2,
    6,
    -264,
    3,
    0,
    11,
    2,
    25,
    3,
    0,
    2,
    2,
    21,
    -1,
    0,
    3774349439,
    2,
    101,
    2,
    102,
    3,
    0,
    2,
    2,
    20,
    2,
    26,
    3,
    0,
    10,
    2,
    9,
    2,
    17,
    2,
    0,
    2,
    47,
    2,
    0,
    2,
    27,
    2,
    103,
    2,
    19,
    0,
    1638399,
    2,
    169,
    2,
    104,
    3,
    0,
    3,
    2,
    23,
    2,
    28,
    2,
    29,
    2,
    5,
    2,
    30,
    2,
    0,
    2,
    7,
    2,
    105,
    -1,
    2,
    106,
    2,
    107,
    2,
    108,
    -1,
    3,
    0,
    3,
    2,
    16,
    -2,
    2,
    0,
    2,
    31,
    -3,
    2,
    146,
    -4,
    2,
    23,
    2,
    0,
    2,
    37,
    0,
    1,
    2,
    0,
    2,
    63,
    2,
    32,
    2,
    16,
    2,
    9,
    2,
    0,
    2,
    109,
    -1,
    3,
    0,
    4,
    2,
    9,
    2,
    33,
    2,
    110,
    2,
    6,
    2,
    0,
    2,
    111,
    2,
    0,
    2,
    50,
    -4,
    3,
    0,
    9,
    2,
    24,
    2,
    18,
    2,
    27,
    -4,
    2,
    112,
    2,
    113,
    2,
    18,
    2,
    24,
    2,
    7,
    -2,
    2,
    114,
    2,
    18,
    2,
    21,
    -2,
    2,
    0,
    2,
    115,
    -2,
    0,
    4277137519,
    0,
    2269118463,
    -1,
    3,
    23,
    2,
    -1,
    2,
    34,
    2,
    38,
    2,
    0,
    3,
    18,
    2,
    2,
    36,
    2,
    20,
    -3,
    3,
    0,
    2,
    2,
    35,
    -1,
    2,
    0,
    2,
    36,
    2,
    0,
    2,
    36,
    2,
    0,
    2,
    48,
    -14,
    2,
    23,
    2,
    44,
    2,
    37,
    -5,
    3,
    0,
    2,
    2,
    38,
    0,
    2147549120,
    2,
    0,
    2,
    16,
    2,
    17,
    2,
    130,
    2,
    0,
    2,
    52,
    0,
    4294901872,
    0,
    5242879,
    3,
    0,
    2,
    0,
    402595359,
    -1,
    2,
    118,
    0,
    1090519039,
    -2,
    2,
    120,
    2,
    39,
    2,
    0,
    2,
    55,
    2,
    40,
    0,
    4226678271,
    0,
    3766565279,
    0,
    2039759,
    -4,
    3,
    0,
    2,
    0,
    1140787199,
    -1,
    3,
    0,
    2,
    0,
    67043519,
    -5,
    2,
    0,
    0,
    4282384383,
    0,
    1056964609,
    -1,
    3,
    0,
    2,
    0,
    67043345,
    -1,
    2,
    0,
    2,
    41,
    2,
    42,
    -1,
    2,
    10,
    2,
    43,
    -6,
    2,
    0,
    2,
    16,
    -3,
    3,
    0,
    2,
    0,
    2147484671,
    -8,
    2,
    0,
    2,
    7,
    2,
    44,
    2,
    0,
    0,
    603979727,
    -1,
    2,
    0,
    2,
    45,
    -8,
    2,
    54,
    2,
    46,
    0,
    67043329,
    2,
    123,
    2,
    47,
    0,
    8388351,
    -2,
    2,
    124,
    0,
    3028287487,
    2,
    48,
    2,
    126,
    0,
    33259519,
    2,
    42,
    -9,
    2,
    24,
    -8,
    3,
    0,
    28,
    2,
    21,
    -3,
    3,
    0,
    3,
    2,
    49,
    3,
    0,
    6,
    2,
    50,
    -85,
    3,
    0,
    33,
    2,
    49,
    -126,
    3,
    0,
    18,
    2,
    38,
    -269,
    3,
    0,
    17,
    2,
    45,
    2,
    7,
    2,
    42,
    -2,
    2,
    17,
    2,
    51,
    2,
    0,
    2,
    24,
    0,
    67043343,
    2,
    128,
    2,
    19,
    -21,
    3,
    0,
    2,
    -4,
    3,
    0,
    2,
    0,
    4294901791,
    2,
    7,
    2,
    164,
    -2,
    0,
    3,
    3,
    0,
    191,
    2,
    20,
    3,
    0,
    23,
    2,
    36,
    -296,
    3,
    0,
    8,
    2,
    7,
    -2,
    2,
    17,
    3,
    0,
    11,
    2,
    6,
    -72,
    3,
    0,
    3,
    2,
    129,
    0,
    1677656575,
    -166,
    0,
    4161266656,
    0,
    4071,
    0,
    15360,
    -4,
    0,
    28,
    -13,
    3,
    0,
    2,
    2,
    52,
    2,
    0,
    2,
    131,
    2,
    132,
    2,
    56,
    2,
    0,
    2,
    133,
    2,
    134,
    2,
    135,
    3,
    0,
    10,
    2,
    136,
    2,
    137,
    2,
    14,
    3,
    52,
    2,
    3,
    53,
    2,
    3,
    54,
    2,
    0,
    4294954999,
    2,
    0,
    -16,
    2,
    0,
    2,
    90,
    2,
    0,
    0,
    2105343,
    0,
    4160749584,
    0,
    65534,
    -42,
    0,
    4194303871,
    0,
    2011,
    -62,
    3,
    0,
    6,
    0,
    8323103,
    -1,
    3,
    0,
    2,
    2,
    55,
    -37,
    2,
    56,
    2,
    140,
    2,
    141,
    2,
    142,
    2,
    143,
    2,
    144,
    -138,
    3,
    0,
    1334,
    2,
    24,
    -1,
    3,
    0,
    129,
    2,
    31,
    3,
    0,
    6,
    2,
    9,
    3,
    0,
    180,
    2,
    145,
    3,
    0,
    233,
    0,
    1,
    -96,
    3,
    0,
    16,
    2,
    9,
    -22583,
    3,
    0,
    7,
    2,
    19,
    -6130,
    3,
    5,
    2,
    -1,
    0,
    69207040,
    3,
    46,
    2,
    3,
    0,
    14,
    2,
    57,
    2,
    58,
    -3,
    0,
    3168731136,
    0,
    4294956864,
    2,
    1,
    2,
    0,
    2,
    59,
    3,
    0,
    4,
    0,
    4294966275,
    3,
    0,
    4,
    2,
    15,
    2,
    60,
    2,
    0,
    2,
    35,
    -1,
    2,
    17,
    2,
    61,
    -1,
    2,
    0,
    2,
    62,
    0,
    4294885376,
    3,
    0,
    2,
    0,
    3145727,
    0,
    2617294944,
    0,
    4294770688,
    2,
    19,
    2,
    63,
    3,
    0,
    2,
    0,
    131135,
    2,
    94,
    0,
    70256639,
    0,
    71303167,
    0,
    272,
    2,
    45,
    2,
    62,
    -1,
    2,
    64,
    -2,
    2,
    96,
    0,
    603979775,
    0,
    4278255616,
    0,
    4294836227,
    0,
    4294549473,
    0,
    600178175,
    0,
    2952806400,
    0,
    268632067,
    0,
    4294543328,
    0,
    57540095,
    0,
    1577058304,
    0,
    1835008,
    0,
    4294688736,
    2,
    65,
    2,
    66,
    0,
    33554435,
    2,
    121,
    2,
    65,
    2,
    147,
    0,
    131075,
    0,
    3594373096,
    0,
    67094296,
    2,
    66,
    -1,
    2,
    67,
    0,
    603979263,
    2,
    156,
    0,
    3,
    0,
    4294828001,
    0,
    602930687,
    2,
    180,
    0,
    393219,
    2,
    67,
    0,
    671088639,
    0,
    2154840064,
    0,
    4227858435,
    0,
    4236247008,
    2,
    68,
    2,
    38,
    -1,
    2,
    4,
    0,
    917503,
    2,
    38,
    -1,
    2,
    69,
    0,
    537783470,
    0,
    4026531935,
    -1,
    0,
    1,
    -1,
    2,
    34,
    2,
    70,
    0,
    7936,
    -3,
    2,
    0,
    0,
    2147485695,
    0,
    1010761728,
    0,
    4292984930,
    0,
    16387,
    2,
    0,
    2,
    13,
    2,
    14,
    3,
    0,
    10,
    2,
    71,
    2,
    0,
    2,
    72,
    2,
    73,
    2,
    74,
    2,
    0,
    2,
    75,
    2,
    0,
    2,
    16,
    -1,
    2,
    19,
    3,
    0,
    2,
    2,
    11,
    2,
    4,
    3,
    0,
    18,
    2,
    76,
    2,
    5,
    3,
    0,
    2,
    2,
    77,
    0,
    253951,
    3,
    20,
    2,
    0,
    122879,
    2,
    0,
    2,
    8,
    0,
    276824064,
    -2,
    3,
    0,
    2,
    2,
    45,
    2,
    0,
    0,
    4294903295,
    2,
    0,
    2,
    18,
    2,
    7,
    -1,
    2,
    17,
    2,
    51,
    2,
    0,
    2,
    78,
    2,
    42,
    -1,
    2,
    24,
    2,
    0,
    2,
    31,
    -2,
    0,
    128,
    -2,
    2,
    79,
    2,
    8,
    0,
    4064,
    -1,
    2,
    117,
    0,
    4227907585,
    2,
    0,
    2,
    116,
    2,
    0,
    2,
    50,
    2,
    196,
    2,
    9,
    2,
    39,
    2,
    10,
    -1,
    0,
    6544896,
    3,
    0,
    6,
    -2,
    3,
    0,
    8,
    2,
    11,
    2,
    0,
    2,
    80,
    2,
    9,
    2,
    0,
    2,
    81,
    2,
    82,
    2,
    83,
    -3,
    2,
    84,
    2,
    12,
    -3,
    2,
    85,
    2,
    86,
    2,
    87,
    2,
    0,
    2,
    35,
    -83,
    2,
    0,
    2,
    53,
    2,
    7,
    3,
    0,
    4,
    0,
    817183,
    2,
    0,
    2,
    13,
    2,
    0,
    0,
    33023,
    2,
    24,
    3,
    88,
    2,
    -17,
    2,
    89,
    0,
    524157950,
    2,
    4,
    2,
    0,
    2,
    90,
    2,
    4,
    2,
    0,
    2,
    14,
    2,
    79,
    2,
    15,
    3,
    0,
    2,
    2,
    49,
    2,
    16,
    -1,
    2,
    17,
    -16,
    3,
    0,
    205,
    2,
    18,
    -2,
    3,
    0,
    655,
    2,
    19,
    3,
    0,
    36,
    2,
    70,
    -1,
    2,
    17,
    2,
    9,
    3,
    0,
    8,
    2,
    91,
    0,
    3072,
    2,
    0,
    0,
    2147516415,
    2,
    9,
    3,
    0,
    2,
    2,
    19,
    2,
    22,
    2,
    92,
    3,
    0,
    2,
    2,
    93,
    2,
    21,
    -1,
    2,
    22,
    0,
    4294965179,
    0,
    7,
    2,
    0,
    2,
    8,
    2,
    92,
    2,
    8,
    -1,
    0,
    1761345536,
    2,
    94,
    2,
    95,
    2,
    38,
    2,
    23,
    2,
    96,
    2,
    36,
    2,
    162,
    0,
    2080440287,
    2,
    0,
    2,
    35,
    2,
    138,
    0,
    3296722943,
    2,
    0,
    0,
    1046675455,
    0,
    939524101,
    0,
    1837055,
    2,
    97,
    2,
    98,
    2,
    14,
    2,
    95,
    3,
    0,
    3,
    0,
    7,
    3,
    0,
    349,
    2,
    99,
    2,
    100,
    2,
    6,
    -264,
    3,
    0,
    11,
    2,
    25,
    3,
    0,
    2,
    2,
    21,
    -1,
    0,
    2700607615,
    2,
    101,
    2,
    102,
    3,
    0,
    2,
    2,
    20,
    2,
    26,
    3,
    0,
    10,
    2,
    9,
    2,
    17,
    2,
    0,
    2,
    47,
    2,
    0,
    2,
    27,
    2,
    103,
    -3,
    2,
    104,
    3,
    0,
    3,
    2,
    23,
    -1,
    3,
    5,
    2,
    2,
    30,
    2,
    0,
    2,
    7,
    2,
    105,
    -1,
    2,
    106,
    2,
    107,
    2,
    108,
    -1,
    3,
    0,
    3,
    2,
    16,
    -2,
    2,
    0,
    2,
    31,
    -8,
    2,
    23,
    2,
    0,
    2,
    37,
    -1,
    2,
    0,
    2,
    63,
    2,
    32,
    2,
    18,
    2,
    9,
    2,
    0,
    2,
    109,
    -1,
    3,
    0,
    4,
    2,
    9,
    2,
    17,
    2,
    110,
    2,
    6,
    2,
    0,
    2,
    111,
    2,
    0,
    2,
    50,
    -4,
    3,
    0,
    9,
    2,
    24,
    2,
    18,
    2,
    27,
    -4,
    2,
    112,
    2,
    113,
    2,
    18,
    2,
    24,
    2,
    7,
    -2,
    2,
    114,
    2,
    18,
    2,
    21,
    -2,
    2,
    0,
    2,
    115,
    -2,
    0,
    4277075969,
    2,
    18,
    -1,
    3,
    23,
    2,
    -1,
    2,
    34,
    2,
    139,
    2,
    0,
    3,
    18,
    2,
    2,
    36,
    2,
    20,
    -3,
    3,
    0,
    2,
    2,
    35,
    -1,
    2,
    0,
    2,
    36,
    2,
    0,
    2,
    36,
    2,
    0,
    2,
    50,
    -14,
    2,
    23,
    2,
    44,
    2,
    116,
    -5,
    2,
    117,
    2,
    41,
    -2,
    2,
    117,
    2,
    19,
    2,
    17,
    2,
    35,
    2,
    117,
    2,
    38,
    0,
    4294901776,
    0,
    4718591,
    2,
    117,
    2,
    36,
    0,
    335544350,
    -1,
    2,
    118,
    2,
    119,
    -2,
    2,
    120,
    2,
    39,
    2,
    7,
    -1,
    2,
    121,
    2,
    65,
    0,
    3758161920,
    0,
    3,
    -4,
    2,
    0,
    2,
    31,
    2,
    174,
    -1,
    2,
    0,
    2,
    19,
    0,
    176,
    -5,
    2,
    0,
    2,
    49,
    2,
    182,
    -1,
    2,
    0,
    2,
    19,
    2,
    194,
    -1,
    2,
    0,
    2,
    62,
    -2,
    2,
    16,
    -7,
    2,
    0,
    2,
    119,
    -3,
    3,
    0,
    2,
    2,
    122,
    -8,
    0,
    4294965249,
    0,
    67633151,
    0,
    4026597376,
    2,
    0,
    0,
    536871887,
    -1,
    2,
    0,
    2,
    45,
    -8,
    2,
    54,
    2,
    49,
    0,
    1,
    2,
    123,
    2,
    19,
    -3,
    2,
    124,
    2,
    37,
    2,
    125,
    2,
    126,
    0,
    16778239,
    -10,
    2,
    36,
    -8,
    3,
    0,
    28,
    2,
    21,
    -3,
    3,
    0,
    3,
    2,
    49,
    3,
    0,
    6,
    2,
    50,
    -85,
    3,
    0,
    33,
    2,
    49,
    -126,
    3,
    0,
    18,
    2,
    38,
    -269,
    3,
    0,
    17,
    2,
    45,
    2,
    7,
    -3,
    2,
    17,
    2,
    127,
    2,
    0,
    2,
    19,
    2,
    50,
    2,
    128,
    2,
    19,
    -21,
    3,
    0,
    2,
    -4,
    3,
    0,
    2,
    0,
    65567,
    -1,
    2,
    26,
    -2,
    0,
    3,
    3,
    0,
    191,
    2,
    20,
    3,
    0,
    23,
    2,
    36,
    -296,
    3,
    0,
    8,
    2,
    7,
    -2,
    2,
    17,
    3,
    0,
    11,
    2,
    6,
    -72,
    3,
    0,
    3,
    2,
    129,
    2,
    130,
    -187,
    3,
    0,
    2,
    2,
    52,
    2,
    0,
    2,
    131,
    2,
    132,
    2,
    56,
    2,
    0,
    2,
    133,
    2,
    134,
    2,
    135,
    3,
    0,
    10,
    2,
    136,
    2,
    137,
    2,
    14,
    3,
    52,
    2,
    3,
    53,
    2,
    3,
    54,
    2,
    2,
    138,
    -129,
    3,
    0,
    6,
    2,
    139,
    -1,
    3,
    0,
    2,
    2,
    50,
    -37,
    2,
    56,
    2,
    140,
    2,
    141,
    2,
    142,
    2,
    143,
    2,
    144,
    -138,
    3,
    0,
    1334,
    2,
    24,
    -1,
    3,
    0,
    129,
    2,
    31,
    3,
    0,
    6,
    2,
    9,
    3,
    0,
    180,
    2,
    145,
    3,
    0,
    233,
    0,
    1,
    -96,
    3,
    0,
    16,
    2,
    9,
    -28719,
    2,
    0,
    0,
    1,
    -1,
    2,
    122,
    2,
    0,
    0,
    8193,
    -21,
    0,
    50331648,
    0,
    10255,
    0,
    4,
    -11,
    2,
    66,
    2,
    168,
    -1,
    0,
    71680,
    -1,
    2,
    157,
    0,
    4292900864,
    0,
    805306431,
    -5,
    2,
    146,
    -1,
    2,
    176,
    -1,
    0,
    6144,
    -2,
    2,
    123,
    -1,
    2,
    150,
    -1,
    2,
    153,
    2,
    147,
    2,
    161,
    2,
    0,
    0,
    3223322624,
    2,
    36,
    0,
    4,
    -4,
    2,
    188,
    0,
    205128192,
    0,
    1333757536,
    0,
    2147483696,
    0,
    423953,
    0,
    747766272,
    0,
    2717763192,
    0,
    4286578751,
    0,
    278545,
    2,
    148,
    0,
    4294886464,
    0,
    33292336,
    0,
    417809,
    2,
    148,
    0,
    1329579616,
    0,
    4278190128,
    0,
    700594195,
    0,
    1006647527,
    0,
    4286497336,
    0,
    4160749631,
    2,
    149,
    0,
    469762560,
    0,
    4171219488,
    0,
    16711728,
    2,
    149,
    0,
    202375680,
    0,
    3214918176,
    0,
    4294508592,
    0,
    139280,
    -1,
    0,
    983584,
    2,
    190,
    0,
    58720275,
    0,
    3489923072,
    0,
    10517376,
    0,
    4293066815,
    0,
    1,
    0,
    2013265920,
    2,
    175,
    2,
    0,
    0,
    17816169,
    0,
    3288339281,
    0,
    201375904,
    2,
    0,
    -2,
    0,
    256,
    0,
    122880,
    0,
    16777216,
    2,
    146,
    0,
    4160757760,
    2,
    0,
    -6,
    2,
    163,
    -11,
    0,
    3263218176,
    -1,
    0,
    49664,
    0,
    2160197632,
    0,
    8388802,
    -1,
    0,
    12713984,
    -1,
    2,
    150,
    2,
    155,
    2,
    158,
    -2,
    2,
    159,
    -20,
    0,
    3758096385,
    -2,
    2,
    151,
    0,
    4292878336,
    2,
    22,
    2,
    166,
    0,
    4294057984,
    -2,
    2,
    160,
    2,
    152,
    2,
    172,
    -2,
    2,
    151,
    -1,
    2,
    179,
    -1,
    2,
    167,
    2,
    122,
    0,
    4026593280,
    0,
    14,
    0,
    4292919296,
    -1,
    2,
    154,
    0,
    939588608,
    -1,
    0,
    805306368,
    -1,
    2,
    122,
    0,
    1610612736,
    2,
    152,
    2,
    153,
    3,
    0,
    2,
    -2,
    2,
    154,
    2,
    155,
    -3,
    0,
    267386880,
    -1,
    2,
    156,
    0,
    7168,
    -1,
    0,
    65024,
    2,
    150,
    2,
    157,
    2,
    158,
    -7,
    2,
    165,
    -8,
    2,
    159,
    -1,
    0,
    1426112704,
    2,
    160,
    -1,
    2,
    185,
    0,
    271581216,
    0,
    2149777408,
    2,
    19,
    2,
    157,
    2,
    122,
    0,
    851967,
    0,
    3758129152,
    -1,
    2,
    19,
    2,
    178,
    -4,
    2,
    154,
    -20,
    2,
    192,
    2,
    161,
    -56,
    0,
    3145728,
    2,
    184,
    -1,
    2,
    191,
    2,
    122,
    -1,
    2,
    162,
    2,
    122,
    -4,
    0,
    32505856,
    -1,
    2,
    163,
    -1,
    0,
    2147385088,
    2,
    22,
    1,
    2155905152,
    2,
    -3,
    2,
    164,
    2,
    0,
    2,
    165,
    -2,
    2,
    166,
    -6,
    2,
    167,
    0,
    4026597375,
    0,
    1,
    -1,
    0,
    1,
    -1,
    2,
    168,
    -3,
    2,
    139,
    2,
    66,
    -2,
    2,
    162,
    2,
    177,
    -1,
    2,
    173,
    2,
    122,
    -6,
    2,
    122,
    -213,
    2,
    167,
    -657,
    2,
    17,
    -36,
    2,
    169,
    -1,
    2,
    186,
    -10,
    0,
    4294963200,
    -5,
    2,
    170,
    -5,
    2,
    158,
    2,
    0,
    2,
    24,
    -1,
    0,
    4227919872,
    -1,
    2,
    170,
    -2,
    0,
    4227874752,
    -3,
    0,
    2146435072,
    2,
    155,
    -2,
    0,
    1006649344,
    2,
    122,
    -1,
    2,
    22,
    0,
    201375744,
    -3,
    0,
    134217720,
    2,
    22,
    0,
    4286677377,
    0,
    32896,
    -1,
    2,
    171,
    -3,
    2,
    172,
    -349,
    2,
    173,
    2,
    174,
    2,
    175,
    3,
    0,
    264,
    -11,
    2,
    176,
    -2,
    2,
    158,
    2,
    0,
    0,
    520617856,
    0,
    2692743168,
    0,
    36,
    -3,
    0,
    524284,
    -11,
    2,
    19,
    -1,
    2,
    183,
    -1,
    2,
    181,
    0,
    3221291007,
    2,
    158,
    -1,
    0,
    524288,
    0,
    2158720,
    -3,
    2,
    155,
    0,
    1,
    -4,
    2,
    122,
    0,
    3808625411,
    0,
    3489628288,
    0,
    4096,
    0,
    1207959680,
    0,
    3221274624,
    2,
    0,
    -3,
    2,
    177,
    0,
    120,
    0,
    7340032,
    -2,
    0,
    4026564608,
    2,
    4,
    2,
    19,
    2,
    160,
    3,
    0,
    4,
    2,
    155,
    -1,
    2,
    178,
    2,
    175,
    -1,
    0,
    8176,
    2,
    179,
    2,
    177,
    2,
    180,
    -1,
    0,
    4290773232,
    2,
    0,
    -4,
    2,
    160,
    2,
    187,
    0,
    15728640,
    2,
    175,
    -1,
    2,
    157,
    -1,
    0,
    4294934512,
    3,
    0,
    4,
    -9,
    2,
    22,
    2,
    167,
    2,
    181,
    3,
    0,
    4,
    0,
    704,
    0,
    1849688064,
    0,
    4194304,
    -1,
    2,
    122,
    0,
    4294901887,
    2,
    0,
    0,
    130547712,
    0,
    1879048192,
    0,
    2080374784,
    3,
    0,
    2,
    -1,
    2,
    182,
    2,
    183,
    -1,
    0,
    17829776,
    0,
    2025848832,
    0,
    4261477888,
    -2,
    2,
    0,
    -1,
    0,
    4286580608,
    -1,
    0,
    29360128,
    2,
    184,
    0,
    16252928,
    0,
    3791388672,
    2,
    39,
    3,
    0,
    2,
    -2,
    2,
    193,
    2,
    0,
    -1,
    2,
    26,
    -1,
    0,
    66584576,
    -1,
    2,
    189,
    3,
    0,
    9,
    2,
    122,
    3,
    0,
    4,
    -1,
    2,
    157,
    2,
    158,
    3,
    0,
    5,
    -2,
    0,
    245760,
    0,
    2147418112,
    -1,
    2,
    146,
    2,
    199,
    0,
    4227923456,
    -1,
    2,
    185,
    2,
    186,
    2,
    22,
    -2,
    2,
    176,
    0,
    4292870145,
    0,
    262144,
    2,
    122,
    3,
    0,
    2,
    0,
    1073758848,
    2,
    187,
    -1,
    0,
    4227921920,
    2,
    188,
    0,
    68289024,
    0,
    528402016,
    0,
    4292927536,
    3,
    0,
    4,
    -2,
    0,
    2483027968,
    2,
    0,
    -2,
    2,
    189,
    3,
    0,
    5,
    -1,
    2,
    184,
    2,
    160,
    2,
    0,
    -2,
    0,
    4227923936,
    2,
    63,
    -1,
    2,
    170,
    2,
    94,
    2,
    0,
    2,
    150,
    2,
    154,
    3,
    0,
    6,
    -1,
    2,
    175,
    3,
    0,
    3,
    -2,
    0,
    2146959360,
    3,
    0,
    8,
    -2,
    2,
    157,
    -1,
    2,
    190,
    2,
    117,
    -1,
    2,
    151,
    3,
    0,
    8,
    2,
    191,
    0,
    8388608,
    2,
    171,
    2,
    169,
    2,
    183,
    0,
    4286578944,
    3,
    0,
    2,
    0,
    1152,
    0,
    1266679808,
    2,
    189,
    0,
    576,
    0,
    4261707776,
    2,
    94,
    3,
    0,
    9,
    2,
    151,
    3,
    0,
    8,
    -28,
    2,
    158,
    3,
    0,
    3,
    -3,
    0,
    4292902912,
    -6,
    2,
    96,
    3,
    0,
    85,
    -33,
    2,
    164,
    3,
    0,
    126,
    -18,
    2,
    192,
    3,
    0,
    269,
    -17,
    2,
    151,
    2,
    122,
    0,
    4294917120,
    3,
    0,
    2,
    2,
    19,
    0,
    4290822144,
    -2,
    0,
    67174336,
    0,
    520093700,
    2,
    17,
    3,
    0,
    21,
    -2,
    2,
    177,
    3,
    0,
    3,
    -2,
    0,
    65504,
    2,
    122,
    2,
    49,
    3,
    0,
    2,
    2,
    92,
    -191,
    2,
    123,
    -23,
    2,
    26,
    3,
    0,
    296,
    -8,
    2,
    122,
    3,
    0,
    2,
    2,
    19,
    -11,
    2,
    175,
    3,
    0,
    72,
    -3,
    0,
    3758159872,
    0,
    201391616,
    3,
    0,
    155,
    -7,
    2,
    167,
    -1,
    0,
    384,
    -1,
    0,
    133693440,
    -3,
    2,
    193,
    -2,
    2,
    30,
    3,
    0,
    4,
    2,
    166,
    -2,
    2,
    22,
    2,
    151,
    3,
    0,
    4,
    -2,
    2,
    185,
    -1,
    2,
    146,
    0,
    335552923,
    2,
    194,
    -1,
    0,
    538974272,
    0,
    2214592512,
    0,
    132000,
    -10,
    0,
    192,
    -8,
    0,
    12288,
    -21,
    0,
    134213632,
    0,
    4294901761,
    3,
    0,
    42,
    0,
    100663424,
    0,
    4294965284,
    3,
    0,
    62,
    -6,
    0,
    4286578784,
    2,
    0,
    -2,
    0,
    1006696448,
    3,
    0,
    24,
    2,
    37,
    -1,
    2,
    195,
    3,
    0,
    10,
    2,
    194,
    0,
    4110942569,
    0,
    1432950139,
    0,
    2701658217,
    0,
    4026532864,
    0,
    4026532881,
    2,
    0,
    2,
    47,
    3,
    0,
    8,
    -1,
    2,
    154,
    -2,
    2,
    166,
    0,
    98304,
    0,
    65537,
    2,
    167,
    2,
    169,
    -2,
    2,
    154,
    -1,
    2,
    63,
    2,
    0,
    2,
    116,
    2,
    197,
    2,
    175,
    0,
    4294770176,
    2,
    30,
    3,
    0,
    4,
    -30,
    2,
    195,
    2,
    196,
    -3,
    2,
    166,
    -2,
    2,
    151,
    2,
    0,
    2,
    154,
    -1,
    2,
    189,
    -1,
    2,
    157,
    2,
    198,
    3,
    0,
    2,
    2,
    154,
    2,
    122,
    -1,
    0,
    193331200,
    -1,
    0,
    4227923960,
    2,
    197,
    -1,
    3,
    0,
    3,
    2,
    198,
    3,
    0,
    44,
    -1334,
    2,
    22,
    2,
    0,
    -129,
    2,
    195,
    -6,
    2,
    160,
    -180,
    2,
    199,
    -233,
    2,
    4,
    3,
    0,
    96,
    -16,
    2,
    160,
    3,
    0,
    22583,
    -7,
    2,
    17,
    3,
    0,
    6128
  ],
  [
    4294967295,
    4294967291,
    4092460543,
    4294828015,
    4294967294,
    134217726,
    268435455,
    2147483647,
    1048575,
    1073741823,
    3892314111,
    1061158911,
    536805376,
    4294910143,
    4160749567,
    4294901759,
    134217727,
    4294901760,
    4194303,
    65535,
    262143,
    67108863,
    4286578688,
    536870911,
    8388607,
    4294918143,
    4294443008,
    255,
    67043328,
    2281701374,
    4294967232,
    2097151,
    4294903807,
    4294902783,
    4294967039,
    511,
    524287,
    131071,
    127,
    4294902271,
    4294549487,
    16777215,
    1023,
    67047423,
    4294901888,
    33554431,
    4286578687,
    4294770687,
    67043583,
    32767,
    15,
    2047999,
    4292870143,
    4294934527,
    4294966783,
    67045375,
    4294967279,
    262083,
    20511,
    4290772991,
    41943039,
    493567,
    2047,
    4294959104,
    1071644671,
    602799615,
    65536,
    4294828000,
    805044223,
    4277151126,
    8191,
    1031749119,
    4294917631,
    2134769663,
    4286578493,
    4282253311,
    4294942719,
    33540095,
    4294905855,
    4294967264,
    2868854591,
    1608515583,
    265232348,
    534519807,
    2147614720,
    1060109444,
    4093640016,
    17376,
    2139062143,
    224,
    4169138175,
    4294909951,
    4294967292,
    4294965759,
    4294966272,
    4294901823,
    4294967280,
    8289918,
    4294934399,
    4294901775,
    4294965375,
    1602223615,
    4294967259,
    268369920,
    4292804608,
    486341884,
    4294963199,
    3087007615,
    1073692671,
    4128527,
    4279238655,
    4294902015,
    4294966591,
    2445279231,
    3670015,
    3238002687,
    63,
    4294967288,
    4294705151,
    4095,
    3221208447,
    4294549472,
    2147483648,
    4294705152,
    4294966143,
    64,
    4294966719,
    16383,
    3774873592,
    536807423,
    67043839,
    3758096383,
    3959414372,
    3755993023,
    2080374783,
    4294835295,
    4294967103,
    4160749565,
    4087,
    31,
    184024726,
    2862017156,
    1593309078,
    268434431,
    268434414,
    4294901763,
    536870912,
    2952790016,
    202506752,
    139264,
    402653184,
    4261412864,
    4227922944,
    2147532800,
    61440,
    3758096384,
    117440512,
    65280,
    4227858432,
    3233808384,
    3221225472,
    4294965248,
    32768,
    57152,
    4294934528,
    67108864,
    4293918720,
    4290772992,
    25165824,
    57344,
    4278190080,
    65472,
    4227907584,
    65520,
    1920,
    4026531840,
    49152,
    4160749568,
    4294836224,
    63488,
    1073741824,
    4294967040,
    251658240,
    196608,
    12582912,
    2097152,
    65408,
    64512,
    417808,
    4227923712,
    48,
    512,
    4294967168,
    4294966784,
    16,
    4292870144,
    4227915776,
    65528,
    4294950912,
    65532
  ]
);
