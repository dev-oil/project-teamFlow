//types/colors.ts
export type ColorCode =
  | '#FF6B6B'
  | '#FFD43B'
  | '#51CF66'
  | '#38BDF8'
  | '#845EF7'
  | '#FFA8D4';

export type ColorName = '빨강' | '노랑' | '초록' | '파랑' | '보라' | '분홍';

export type ColorEngName =
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink';

export type ColorOption = {
  code: ColorCode;
  name: ColorName;
  engName: ColorEngName;
};
