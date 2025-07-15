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

export const colorOptions: ColorOption[] = [
  { code: '#FF6B6B', name: '빨강', engName: 'red' },
  { code: '#FFD43B', name: '노랑', engName: 'yellow' },
  { code: '#51CF66', name: '초록', engName: 'green' },
  { code: '#38BDF8', name: '파랑', engName: 'blue' },
  { code: '#845EF7', name: '보라', engName: 'purple' },
  { code: '#FFA8D4', name: '분홍', engName: 'pink' },
];
