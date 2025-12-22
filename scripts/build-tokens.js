const { execSync } = require('child_process');
const {
  FIGMA_TOKEN_SETS,
  TOKEN_CATEGORIES,
  PATHS,
  OUTPUT_FILES,
} = require('./style-dictionary/utils/constants');
const {
  resolveProjectPath,
  writeJsonFile,
  ensureDirectories,
  readJsonFile,
} = require('./style-dictionary/utils/file-helpers');
const {
  transformTokenReferences,
  isEmptyToken,
} = require('./style-dictionary/utils/token-helpers');

/**
 * 토큰을 재귀적으로 처리하여 필요한 필드만 추출
 * @param {Object} obj - 처리할 토큰 객체
 * @returns {Object} 정제된 토큰 객체
 */
function processTokens(obj) {
  const result = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === 'object' && value.value !== undefined) {
      // 토큰 리프 노드: value, type, description만 추출
      result[key] = {
        value: value.value,
        type: value.type,
        description: value.description,
      };
    } else if (value && typeof value === 'object') {
      // 중첩 객체: 재귀 처리
      result[key] = processTokens(value);
    }
  });

  return result;
}

/**
 * Primitive 토큰 분리
 * @param {Object} primitiveTokens - Primitive 토큰 셋
 * @returns {Object} 타입별로 분리된 토큰
 */
function separatePrimitives(primitiveTokens) {
  return {
    color: primitiveTokens.color ? processTokens(primitiveTokens.color) : {},
    font: primitiveTokens.typo ? processTokens(primitiveTokens.typo) : {},
    number: primitiveTokens.number
      ? processTokens(primitiveTokens.number.unit)
      : {},
  };
}

/**
 * Semantic 토큰 분리
 * @param {Object} figmaTokens - Figma 토큰 전체
 * @returns {Object} { colors, rounded }
 */
function separateSemantics(figmaTokens) {
  const semanticColors = {};
  let roundedTokens = {};

  Object.keys(figmaTokens).forEach((setName) => {
    if (setName.startsWith(FIGMA_TOKEN_SETS.SEMANTIC_PREFIX)) {
      const tokens = figmaTokens[setName];

      // Semantic 색상 토큰 - "color" 키로 감싸서 저장
      if (tokens.color) {
        semanticColors.color = processTokens(tokens.color);
      }

      // Rounded 토큰 (shape.rounded에서 추출)
      if (tokens.shape?.rounded) {
        const processedRounded = processTokens(tokens.shape.rounded);

        // 참조 변환: {number.unit.0} → {number.0}
        roundedTokens = transformTokenReferences(
          processedRounded,
          /\{number\.unit\.(\d+)\}/g,
          '{number.$1}'
        );
      }
    }
  });

  return {
    colors: semanticColors,
    rounded: roundedTokens,
  };
}

/**
 * Brand 토큰 분리
 * @param {Object} figmaTokens - Figma 토큰 전체
 * @returns {Object} Brand 토큰
 */
function separateBrands(figmaTokens) {
  const brandTokens = { brand: {} };

  Object.keys(figmaTokens).forEach((setName) => {
    if (setName.startsWith(FIGMA_TOKEN_SETS.BRAND_PREFIX)) {
      const tokens = figmaTokens[setName];

      if (tokens.brand && isEmptyToken(brandTokens.brand)) {
        // 첫 번째 브랜드 토큰만 사용 (모든 브랜드 토큰이 동일하다고 가정)
        brandTokens.brand = processTokens(tokens.brand);
      }
    }
  });

  return brandTokens;
}

/**
 * Primitive 토큰들을 파일로 저장
 * @param {Object} primitives - 분리된 primitive 토큰
 * @param {string} outputDir - 출력 디렉토리
 */
function savePrimitiveTokens(primitives, outputDir) {
  const primitiveFiles = [
    {
      category: TOKEN_CATEGORIES.COLOR,
      fileName: OUTPUT_FILES.PRIMITIVES.COLOR,
      data: primitives.color,
    },
    {
      category: TOKEN_CATEGORIES.FONT,
      fileName: OUTPUT_FILES.PRIMITIVES.FONT,
      data: primitives.font,
    },
    {
      category: TOKEN_CATEGORIES.NUMBER,
      fileName: OUTPUT_FILES.PRIMITIVES.NUMBER,
      data: primitives.number,
    },
  ];

  primitiveFiles.forEach(({ category, fileName, data }) => {
    writeJsonFile(
      `${outputDir}/${fileName}`,
      { [category]: data },
      `✅ Primitives: ${fileName} 생성 완료`
    );
  });
}

/**
 * 메인 빌드 함수
 */
function buildTokens() {
  try {
    // 1. Figma 토큰 읽기:  파일 경로 / JSON 파일 읽기
    const figmaTokensPath = resolveProjectPath(__dirname, PATHS.FIGMA_TOKENS);
    const figmaTokens = readJsonFile(figmaTokensPath);

    // 2. 출력 디렉토리 설정 및 생성
    const primitivesDir = resolveProjectPath(__dirname, PATHS.PRIMITIVES_DIR);
    const semanticDir = resolveProjectPath(__dirname, PATHS.SEMANTIC_DIR);

    // 경로 보장 - 없으면 폴더 생성
    ensureDirectories([primitivesDir, semanticDir]);

    // 3. Primitives 토큰 분리(color, font, number 타입별)및 저장
    if (figmaTokens[FIGMA_TOKEN_SETS.PRIMITIVE]) {
      const primitives = separatePrimitives(
        figmaTokens[FIGMA_TOKEN_SETS.PRIMITIVE]
      );
      savePrimitiveTokens(primitives, primitivesDir);
    }

    // 5. Semantic 토큰 분리 및 저장
    const semantics = separateSemantics(figmaTokens);

    writeJsonFile(
      `${semanticDir}/${OUTPUT_FILES.SEMANTIC.COLORS}`,
      semantics.colors,
      `✅ Semantic: ${OUTPUT_FILES.SEMANTIC.COLORS} 생성 완료`
    );

    // 6. Rounded 토큰 저장 (semantic에서 추출)
    if (!isEmptyToken(semantics.rounded)) {
      writeJsonFile(
        `${primitivesDir}/${OUTPUT_FILES.PRIMITIVES.ROUNDED}`,
        { [TOKEN_CATEGORIES.ROUNDED]: semantics.rounded },
        `✅ Primitives: ${OUTPUT_FILES.PRIMITIVES.ROUNDED} 생성 완료`
      );
    }
    console.log('\n📦 토큰 타입별 분리 완료!');
    // 4. Brand 토큰 분리 및 저장
    const brands = separateBrands(figmaTokens);

    if (!isEmptyToken(brands.brand)) {
      writeJsonFile(
        `${semanticDir}/${OUTPUT_FILES.SEMANTIC.BRANDS}`,
        brands,
        `✅ Semantic: ${OUTPUT_FILES.SEMANTIC.BRANDS} 생성 완료`
      );
    }

    // 7. Style Dictionary 빌드 실행
    const projectRoot = resolveProjectPath(__dirname, '.');
    execSync('npx style-dictionary build --config style-dictionary.config.js', {
      stdio: 'inherit',
      cwd: projectRoot,
    });

    console.log(
      `✅ 토큰 빌드가 완료되었습니다!
  - TypeScript: src/tokens/index.ts
  - CSS 변수: src/tokens/variables.css`
    );
  } catch (error) {
    console.error('❌ 토큰 빌드 중 오류 발생:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
buildTokens();
