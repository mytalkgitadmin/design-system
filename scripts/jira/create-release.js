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

  // 티켓 파싱 및 프로젝트 필터링
  const allTickets = JIRA_TICKETS
    ? JIRA_TICKETS.split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // 프로젝트 키 추출 함수 (예: FMTW-123 → FMTW)
  const getProjectKey = (ticket) => {
    const match = ticket.match(/^([A-Z]+)-\d+$/);
    return match ? match[1] : null;
  };

  // JIRA_PROJECT와 일치하는 티켓만 필터링
  const tickets = allTickets.filter((ticket) => {
    const projectKey = getProjectKey(ticket);
    return projectKey === JIRA_PROJECT;
  });

  const otherTickets = allTickets.filter((ticket) => {
    const projectKey = getProjectKey(ticket);
    return projectKey !== JIRA_PROJECT;
  });

  if (otherTickets.length > 0) {
    console.log(
      `⚠️  다른 프로젝트 티켓 ${otherTickets.length}개 무시: ${otherTickets.join(', ')}\n`
    );
  }

  if (tickets.length === 0) {
    console.log('⚠️  연결할 Jira 티켓이 없습니다.');
    console.log('📝 릴리즈만 생성하고 티켓 연결은 건너뜁니다.\n');
  } else {
    console.log(
      `🎫 ${JIRA_PROJECT} 프로젝트 티켓 ${tickets.length}개 발견: ${tickets.join(', ')}\n`
    );
  }

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
  } else {
    console.log('📝 새 릴리즈 생성 중...');
    const description = `Release ${RELEASE_VERSION}`;
    version = await createRelease(JIRA_PROJECT, RELEASE_VERSION, description);
  }

  // 버전 ID를 파일로 저장 (GitHub Actions에서 사용)
  const fs = require('fs');
  fs.writeFileSync('jira_version_id.txt', version.id.toString());

  // 티켓 연결 (티켓이 있을 때만)
  let successCount = 0;
  let failCount = 0;

  if (tickets.length > 0) {
    console.log(`\n🔗 티켓 연결 중... (${tickets.length}개)`);
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
  } else {
    console.log('\n⏭️  연결할 티켓이 없어 티켓 연결을 건너뜁니다.');
  }

  // 결과 요약
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Jira Release 생성 완료!');
  console.log('='.repeat(60));
  console.log(`📦 Release: ${RELEASE_VERSION}`);
  console.log(`🔗 Release ID: ${version.id}`);
  if (tickets.length > 0) {
    console.log(`✅ 티켓 연결 성공: ${successCount}개`);
    if (failCount > 0) {
      console.log(`⚠️  티켓 연결 실패: ${failCount}개`);
    }
  } else {
    console.log(`📝 연결된 티켓: 없음`);
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
