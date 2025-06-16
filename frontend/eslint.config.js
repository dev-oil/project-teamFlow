import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import * as importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'import/order': [
        'warn', // 경고로 띄움 (에러는 아님)
        {
          groups: [
            'external', // 외부 라이브러리 (예: react, axios)
            'internal', // 프로젝트 내부 import (@/components 등)
            ['parent', 'sibling', 'index'], // 상대경로 import (../, ./)
          ],
          pathGroups: [
            {
              pattern: '@/**', // @로 시작하는 경로를 internal로 인식
              group: 'internal',
            },
          ],
          'newlines-between': 'always-and-inside-groups', // 그룹 간 줄바꿈
          alphabetize: {
            order: 'asc', // 알파벳순 정렬
            caseInsensitive: true, // 대소문자 구분 X
          },
        },
      ],
    },
  }
);
