#!/usr/bin/env node

const https = require('https');

// 환경변수
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT = process.env.JIRA_PROJECT;
const RELEASE_VERSION = process.env.RELEASE_VERSION;
const JIRA_TICKETS = process.env.JIRA_TICKETS;
const GITHUB_RELEASE_URL = process.env.GITHUB_RELEASE_URL;

// 환경변수 검증
if (!JIRA_BASE_URL || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
  console.error('❌ Jira 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

if (!JIRA_PROJECT) {
  console.error('❌ JIRA_PROJECT 환경변수가 필요합니다.');
  process.exit(1);
}

if (!RELEASE_VERSION) {
  console.error('❌ RELEASE_VERSION 환경변수가 필요합니다.');
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

// 기존 릴리즈 조회
async function findExistingRelease(projectKey, versionName) {
  try {
    const versions = await jiraRequest(
      'GET',
      `/rest/api/2/project/${projectKey}/versions`
    );
    return versions.find((v) => v.name === versionName);
  } catch (error) {
    console.error(`⚠️  릴리즈 조회 실패: ${error.message}`);
    return null;
  }
}

// 릴리즈 생성
async function createRelease(projectKey, versionName, description) {
  try {
    const releaseDate = new Date().toISOString().split('T')[0];
    const releaseData = {
      name: versionName,
      description: description || `Release ${versionName}`,
      project: projectKey,
      released: true,
      releaseDate: releaseDate,
    };

    const version = await jiraRequest(
      'POST',
      '/rest/api/2/version',
      releaseData
    );
    console.log(`✅ Jira Release 생성 완료: ${versionName} (${version.id})`);
    return version;
  } catch (error) {
    console.error(`❌ Jira Release 생성 실패: ${error.message}`);
    throw error;
  }
}

// 릴리즈 업데이트
async function updateRelease(versionId, description) {
  try {
    const releaseDate = new Date().toISOString().split('T')[0];
    const updateData = {
      description: description,
      released: true,
      releaseDate: releaseDate,
    };

    await jiraRequest('PUT', `/rest/api/2/version/${versionId}`, updateData);
    console.log(`✅ Jira Release 업데이트 완료: ${versionId}`);
  } catch (error) {
    console.error(`⚠️  Jira Release 업데이트 실패: ${error.message}`);
  }
}

// 티켓에 릴리즈 연결
async function linkTicketToRelease(issueKey, versionId, versionName) {
  try {
    // fixVersions에 릴리즈 추가
    await jiraRequest('PUT', `/rest/api/2/issue/${issueKey}`, {
      fields: {
        fixVersions: [{ id: versionId }],
      },
    });
    console.log(`  ✅ ${issueKey} → ${versionName} 연결 완료`);
    return true;
  } catch (error) {
    console.error(`  ⚠️  ${issueKey} 연결 실패: ${error.message}`);
    return false;
  }
}

// 메인 실행
async function main() {
  console.log('🚀 Jira Release 생성 시작...\n');
  console.log(`📋 프로젝트: ${JIRA_PROJECT}`);
  console.log(`🏷️  버전: ${RELEASE_VERSION}`);

  // 티켓 파싱
  const tickets = JIRA_TICKETS
    ? JIRA_TICKETS.split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  if (tickets.length === 0) {
    console.log('⚠️  연결할 Jira 티켓이 없습니다.');
    console.log('✅ 릴리즈 생성을 건너뜁니다.');
    return;
  }

  console.log(`🎫 Jira 티켓 ${tickets.length}개 발견: ${tickets.join(', ')}\n`);

  // 기존 릴리즈 확인
  console.log('🔍 기존 릴리즈 확인 중...');
  let existingRelease = await findExistingRelease(
    JIRA_PROJECT,
    RELEASE_VERSION
  );

  let version;
  if (existingRelease) {
    console.log(
      `📝 기존 릴리즈 발견: ${existingRelease.name} (${existingRelease.id})`
    );
    version = existingRelease;

    // 설명 업데이트
    const description = GITHUB_RELEASE_URL
      ? `Release ${RELEASE_VERSION}\n\nGitHub Release: ${GITHUB_RELEASE_URL}`
      : `Release ${RELEASE_VERSION}`;
    await updateRelease(version.id, description);
  } else {
    console.log('📝 새 릴리즈 생성 중...');
    const description = GITHUB_RELEASE_URL
      ? `Release ${RELEASE_VERSION}\n\nGitHub Release: ${GITHUB_RELEASE_URL}`
      : `Release ${RELEASE_VERSION}`;
    version = await createRelease(JIRA_PROJECT, RELEASE_VERSION, description);
  }

  // 티켓 연결
  console.log(`\n🔗 티켓 연결 중... (${tickets.length}개)`);
  let successCount = 0;
  let failCount = 0;

  for (const ticket of tickets) {
    const success = await linkTicketToRelease(
      ticket,
      version.id,
      RELEASE_VERSION
    );
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // 결과 요약
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Jira Release 생성 완료!');
  console.log('='.repeat(60));
  console.log(`📦 Release: ${RELEASE_VERSION}`);
  console.log(`🔗 Release ID: ${version.id}`);
  console.log(`✅ 성공: ${successCount}개`);
  if (failCount > 0) {
    console.log(`⚠️  실패: ${failCount}개`);
  }
  console.log(
    `🌐 Jira URL: ${JIRA_BASE_URL}/projects/${JIRA_PROJECT}/versions/${version.id}`
  );
  if (GITHUB_RELEASE_URL) {
    console.log(`🔗 GitHub Release: ${GITHUB_RELEASE_URL}`);
  }
  console.log('='.repeat(60));
}

// 실행
main().catch((error) => {
  console.error('\n❌ Jira Release 생성 실패:');
  console.error(error);
  process.exit(1);
});
