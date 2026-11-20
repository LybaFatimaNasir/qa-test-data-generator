export class EdgeCaseGenerator {
  static unicodePayloads(): Record<string, string> {
    return {
      zalgo: 'T̶̤̚ê̸͕s̸̼̍t̶̘̍ ̵̫̈́D̵̛̠a̴̧̾t̶̯̂a̸̱͠',
      rtl: 'مرحبا بالعالم (Arabic RTL) / עולם שלום (Hebrew)',
      surrogatePairEmoji: '👩🏽‍❤️‍💋‍👨🏿🚀🔥⚡',
      chineseMaxBytes: '𠜎𠜱𠝹𠱓𠱸𠲖𠳏',
      zeroWidthChars: 'test\u200Buser\u200Dname\uFEFF',
      whitespaceOnly: '   \t  \n  \r  '
    };
  }

  static boundaryString(length: number, char: string = 'A'): string {
    return char.repeat(length);
  }

  static numericBoundaries(): Record<string, number | bigint> {
    return {
      int32Max: 2147483647,
      int32Min: -2147483648,
      int64Max: BigInt('9223372036854775807') as unknown as number,
      floatPrecisionLimit: 0.000000000000001,
      negativeZero: -0,
      nan: NaN
    };
  }
}
