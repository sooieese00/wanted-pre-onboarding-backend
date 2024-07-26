'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Companies 테이블
    await queryInterface.bulkInsert('Companies', [
      {
        name: '원티드랩',
        country: '한국',
        region: '서울',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '네이버',
        country: '한국',
        region: '판교',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '카카오',
        country: '한국',
        region: '판교',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // JobPostings 테이블에 넣기 위해서 company_id 찾기
    const companies = await queryInterface.sequelize.query(
      `SELECT company_id, name FROM Companies;`
    );

    const companiesMap = companies[0].reduce((map, company) => {
      map[company.name] = company.company_id;
      return map;
    }, {});

    // JobPostings 테이블
    await queryInterface.bulkInsert('JobPostings', [
      {
        company_id: companiesMap['원티드랩'],
        position: '백엔드 주니어 개발자',
        reward: 1500000,
        description: `원티드랩에서 백엔드 주니어 개발자를 채용합니다. 
        팀원들과 협업하여 문제를 해결하는 능력이 필요합니다.`,
        skills: 'Python',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        company_id: companiesMap['네이버'],
        position: 'Django 백엔드 개발자',
        reward: 1000000,
        description: '네이버에서 Django 백엔드 개발자를 채용합니다.',
        skills: 'Django',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        company_id: companiesMap['원티드랩'],
        position: '데이터 분석가',
        reward: 1500000,
        description: `원티드랩에서 데이터 분석가를 채용합니다. 
        자격요건은 데이터 분석 및 시각화 도구 사용 경험이 있어야 하며, 
        Python 또는 R을 이용한 데이터 분석 경험이 필요합니다. 
        또한, 비즈니스 문제를 데이터로 해결할 수 있는 능력이 중요합니다.`,
        skills: 'Python, R',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        company_id: companiesMap['원티드랩'],
        position: '프론트엔드 주니어 개발자',
        reward: 1500000,
        description: `원티드랩에서 프론트엔드 주니어 개발자를 채용합니다. 
        자격요건은 React 및 Redux를 이용한 프로젝트 경험이 있으며,
        HTML, CSS, JavaScript에 대한 깊은 이해가 필요합니다.`,
        skills: 'React, HTML, CSS, JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Users 테이블
    await queryInterface.bulkInsert('Users', [
        {
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], {});
    },
    
  down: async (queryInterface, Sequelize) => {
    // 초기 데이터 삭제
    await queryInterface.bulkDelete('Companies', null, {});
    await queryInterface.bulkDelete('JobPostings', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
