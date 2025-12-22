#!/usr/bin/env node

const https = require('https');

// 환경변수
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_VERSION_ID = process.env.JIRA_VERSION_ID;
const RELEASE_VERSION = process.env.RELEASE_VERSION;
const GITHUB_RELEASE_URL = process.env.GITHUB_RELEASE_URL;

// 환경변수 검증
if (!JIRA_BASE_URL || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
  console.error('❌ Jira 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!JIRA_VERSION_ID || !GITHUB_RELEASE_URL) {
  console.error('❌ JIRA_VERSION_ID 또는 GITHUB_RELEASE_URL이 필요합니다.');
  process.exit(1);
}

// Jira API 요청
function jiraRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, JIRA_BASE_URL);
    const auth = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString(
      'base64'
    );

    const options = {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// 메인 실행
async function main() {
  console.log('🔄 Jira Release Description 업데이트 중...\n');
  console.log(`📋 Version ID: ${JIRA_VERSION_ID}`);
  console.log(`🔗 GitHub Release: ${GITHUB_RELEASE_URL}`);

  try {
    const releaseDate = new Date().toISOString().split('T')[0];
    const description = `Release ${RELEASE_VERSION}\n\nGitHub Release: ${GITHUB_RELEASE_URL}`;

    const updateData = {
      description: description,
      released: true,
      releaseDate: releaseDate,
    };

    await jiraRequest(
      'PUT',
      `/rest/api/2/version/${JIRA_VERSION_ID}`,
      updateData
    );

    console.log('✅ Jira Release Description 업데이트 완료!');
    console.log(`📝 Description: ${description}`);
  } catch (error) {
    console.error('❌ 업데이트 실패:', error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ 실행 실패:');
  console.error(error);
  process.exit(1);
});

