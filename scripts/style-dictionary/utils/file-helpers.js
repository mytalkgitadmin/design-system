/**
 * 파일 시스템 관련 헬퍼 함수들
 */

const fs = require('fs');
const path = require('path');

/**
 * 프로젝트 루트 경로 가져오기
 * @param {string} scriptDir - __dirname (스크립트 디렉토리)
 * @returns {string} 프로젝트 루트 경로
 */
function getProjectRoot(scriptDir) {
  return path.join(scriptDir, '..');
}

/**
 * 프로젝트 루트 기준 절대 경로 생성
 * @param {string} scriptDir - __dirname (스크립트 디렉토리)
 * @param {string} relativePath - 상대 경로
 * @returns {string} 절대 경로
 */
function resolveProjectPath(scriptDir, relativePath) {
  return path.join(getProjectRoot(scriptDir), relativePath);
}

/**
 * JSON 파일 저장
 * @param {string} filePath - 파일 경로
 * @param {Object} data - 저장할 데이터
 * @param {string} [logMessage] - 성공 시 출력할 메시지 (선택)
 */
function writeJsonFile(filePath, data, logMessage) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  if (logMessage) {
    console.log(logMessage);
  }
}

/**
 * 디렉토리가 없으면 생성
 * @param {string[]} dirs - 생성할 디렉토리 경로 배열
 */
function ensureDirectories(dirs) {
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * JSON 파일 읽기
 * @param {string} filePath - 파일 경로
 * @returns {Object} 파싱된 JSON 객체
 */
function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = {
  getProjectRoot,
  resolveProjectPath,
  writeJsonFile,
  ensureDirectories,
  readJsonFile,
};
