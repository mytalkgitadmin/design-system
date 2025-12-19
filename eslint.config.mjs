import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

/**
 * ESLint 설정 (디자인 시스템용 Flat Config)
 *
 * 주요 기능:
 * - Prettier와 충돌하지 않도록 포매팅 규칙 제외
 * - Import 순서 자동 정렬: React → 외부 라이브러리 → 내부 모듈
 * - React 함수 컴포넌트는 화살표 함수 사용
 * - TypeScript type 일관성 강제
 * - Named Export 사용 (Default Export 금지)
 */
export default tseslint.config(
  // JavaScript 기본 규칙
  js.configs.recommended,

  // TypeScript 규칙
  ...tseslint.configs.recommended,

  // React 규칙
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // ========================================
      // React 규칙
      // ========================================
      // 함수 컴포넌트는 화살표 함수 사용
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      // React import 자동 감지 (React 17+에서 불필요)
      'react/react-in-jsx-scope': 'off',
      // Props spreading 허용
      'react/jsx-props-no-spreading': 'off',
      // 리스트 렌더링 시 key 필수
      'react/jsx-key': 'error',
      // prop-types 불필요 (TypeScript 사용)
      'react/prop-types': 'off',

      // ========================================
      // React Hooks 규칙
      // ========================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ========================================
      // Import 규칙
      // ========================================
      // Import 자동 정렬 (저장 시 --fix로 자동 수정)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. React 관련
            ['^react', '^react-dom'],
            // 2. 외부 라이브러리
            ['^@?\\w'],
            // 3. 내부 모듈 (@로 시작)
            ['^@/'],
            // 4. 상대 경로
            ['^\\.'],
            // 5. 타입 import
            ['^.+\\u0000$'],
            // 6. 스타일/에셋
            ['^.+\\.s?css$', '^.+\\.(png|jpg|jpeg|gif|svg)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Named Export 사용 (Default Export 금지)
      'import/no-default-export': 'error',

      // 사용하지 않는 import 경고
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // ========================================
      // TypeScript 규칙
      // ========================================
      // any 타입 경고
      '@typescript-eslint/no-explicit-any': 'warn',
      // 빈 인터페이스 허용
      '@typescript-eslint/no-empty-interface': 'off',
      // 명시적 함수 반환 타입 불필요
      '@typescript-eslint/explicit-function-return-type': 'off',
      // interface vs type 일관성 (type 우선)
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      // 빈 객체 타입 허용 ({})
      '@typescript-eslint/no-empty-object-type': 'off',

      // ========================================
      // 일반 규칙
      // ========================================
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'warn',
    },
  },

  // Storybook 파일은 Default Export 허용
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // 설정 파일 제외
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'storybook-static/**',
      '.storybook/**',
      '*.config.{js,ts,mjs,cjs}',
      'scripts/**',
      '.commitlintrc.js',
      '.cz-config.js',
      '.prettierrc.js',
    ],
  }
);
