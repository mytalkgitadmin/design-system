const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 토큰을 재귀적으로 처리하여 변환
function processTokens(obj) {
  const result = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === 'object' && value.value !== undefined) {
      result[key] = {
        value: value.value,
        type: value.type,
        description: value.description,
      };
    } else if (value && typeof value === 'object') {
      result[key] = processTokens(value);
    }
  });

  return result;
}

// Primitives 토큰 분리
function separatePrimitives(primitiveTokens) {
  const separated = {
    color: {},
    font: {},
    number: {},
    rounded: {},
  };

  if (primitiveTokens.color) {
    separated.color = processTokens(primitiveTokens.color);
  }

  if (primitiveTokens.typo) {
    separated.font = processTokens(primitiveTokens.typo);
  }

  if (primitiveTokens.number) {
    separated.number = processTokens(primitiveTokens.number.unit);
  }

  return separated;
}

// Semantic 토큰 분리
function separateSemantics(figmaTokens) {
  const semanticColors = {};
  let roundedTokens = {};

  Object.keys(figmaTokens).forEach((setName) => {
    if (setName.startsWith('semantic/')) {
      const brandName = setName.replace('semantic/', '');
      const tokens = figmaTokens[setName];

      if (tokens.color) {
        // brandName을 키로 사용하지 않고 바로 color 토큰을 처리
        semanticColors[brandName] = processTokens(tokens.color);
      }

      // rounded 토큰 추출 (shape.rounded)
      if (tokens.shape && tokens.shape.rounded) {
        const processedRounded = processTokens(tokens.shape.rounded);

        // {number.unit.0} → {number.0} 형태로 참조 수정
        Object.keys(processedRounded).forEach((key) => {
          if (processedRounded[key].value && typeof processedRounded[key].value === 'string') {
            processedRounded[key].value = processedRounded[key].value.replace(
              /\{number\.unit\.(\d+)\}/g,
              '{number.$1}'
            );
          }
        });

        roundedTokens = processedRounded;
      }
    }
  });

  return {
    colors: semanticColors,
    rounded: roundedTokens,
  };
}

// Figma 토큰 읽기
const figmaTokensPath = path.join(__dirname, '../src/tokens/figma/tokens.json');
const figmaTokens = JSON.parse(fs.readFileSync(figmaTokensPath, 'utf8'));

// 토큰 디렉토리 생성
const tokensDir = path.join(__dirname, '../src/tokens/auto');
const primitivesDir = path.join(tokensDir, 'primitives');
const semanticDir = path.join(tokensDir, 'semantic');

[tokensDir, primitivesDir, semanticDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Primitives 토큰 분리 및 저장
if (figmaTokens['primitive/value']) {
  const primitives = separatePrimitives(figmaTokens['primitive/value']);

  // color
  fs.writeFileSync(
    path.join(primitivesDir, 'color.json'),
    JSON.stringify({ color: primitives.color }, null, 2)
  );
  console.log('✅ Primitives: color.json 생성 완료');

  // font
  fs.writeFileSync(
    path.join(primitivesDir, 'font.json'),
    JSON.stringify({ font: primitives.font }, null, 2)
  );
  console.log('✅ Primitives: font.json 생성 완료');

  // number
  fs.writeFileSync(
    path.join(primitivesDir, 'number.json'),
    JSON.stringify({ number: primitives.number }, null, 2)
  );
  console.log('✅ Primitives: number.json 생성 완료');
}

// Semantic 토큰 분리 및 저장
const semantics = separateSemantics(figmaTokens);

// colors
fs.writeFileSync(
  path.join(semanticDir, 'colors.json'),
  JSON.stringify(semantics.colors, null, 2)
);
console.log('✅ Semantic: colors.json 생성 완료');

// rounded (semantic에서 추출)
if (semantics.rounded && Object.keys(semantics.rounded).length > 0) {
  fs.writeFileSync(
    path.join(primitivesDir, 'rounded.json'),
    JSON.stringify({ rounded: semantics.rounded }, null, 2)
  );
  console.log('✅ Primitives: rounded.json 생성 완료');
}

console.log('\n📦 토큰 타입별 분리 완료!');

// style-dictionary CLI를 사용하여 빌드
try {
  execSync('npx style-dictionary build --config style-dictionary.config.js', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });

  console.log('✅ 토큰 빌드가 완료되었습니다!');
  console.log('   - TypeScript: src/tokens/auto/index.ts');
  console.log('   - CSS 변수: src/tokens/auto/variables.css');
} catch (error) {
  console.error('❌ 토큰 빌드 중 오류 발생:', error.message);
  process.exit(1);
}
