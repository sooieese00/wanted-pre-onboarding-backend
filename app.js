const express = require('express');
const { Op, Sequelize } = require('sequelize');
const bodyParser = require('body-parser');
const { sequelize, Company, JobPosting, User, Application } = require('./models');

const app = express();
app.use(bodyParser.json());

// 데이터베이스 동기화
sequelize.sync().then(() => {
  console.log("Database synchronized");
});

// 회사의 채용공고 등록 (Create)
app.post('/jobpostings', async (req, res) => {
  try {
    const { company_id, position, reward, description, skills } = req.body;
    const jobPosting = await JobPosting.create({ company_id, position, reward, description, skills });
    res.status(201).json(jobPosting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 회사의 채용 공고 수정 (Update)
app.put('/jobpostings/:id', async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByPk(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    const { position, reward, description, skills } = req.body;
    await jobPosting.update({ position, reward, description, skills });
    res.json(jobPosting);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 회사의 채용 공고 삭제 (Delete)
app.delete('/jobpostings/:id', async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByPk(req.params.id);
    if (!jobPosting) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    await jobPosting.destroy();
    res.json({ message: 'Job posting deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 사용자의 채용 공고 조회 (Read)
app.get('/jobpostings', async (req, res) => {
  try {
    const jobPostings = await JobPosting.findAll({
      include: [{
        model: Company,
        as: 'company',
        attributes: ['name', 'country', 'region']
      }]
    });
    const result = jobPostings.map(posting => ({
      채용공고_id: posting.jobposting_id,
      회사명: posting.company.name,
      국가: posting.company.country,
      지역: posting.company.region,
      채용포지션: posting.position,
      채용보상금: posting.reward,
      사용기술: posting.skills
    }));
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 채용 공고 검색 (Search)
app.get('/jobpostings', async (req, res) => {
  try {
    const search = req.query.search || '';

    // 두 쿼리를 병렬로 실행
    const [jobPostings, companies] = await Promise.all([
      JobPosting.findAll({
        where: {
          [Op.or]: [
            { position: { [Op.like]: `%${search}%` } },
            { skills: { [Op.like]: `%${search}%` } }
          ]
        },
        include: [{
          model: Company,
          as: 'company',
          attributes: ['name', 'country', 'region']
        }]
      }),
      Company.findAll({
        where: {
          name: { [Op.like]: `%${search}%` }
        },
        include: [{
          model: JobPosting,
          as: 'jobpostings',
          attributes: ['jobposting_id', 'position', 'reward', 'skills']
        }]
      })
    ]);

    // jobPostings 결과 변환
    const jobPostingsResults = jobPostings.map(posting => ({
      채용공고_id: posting.jobposting_id,
      회사명: posting.company.name,
      국가: posting.company.country,
      지역: posting.company.region,
      채용포지션: posting.position,
      채용보상금: posting.reward,
      사용기술: posting.skills
    }));

    // companies 결과 변환
    const companyResults = companies.flatMap(company =>
      company.jobpostings.map(posting => ({
        채용공고_id: posting.jobposting_id,
        회사명: company.name,
        국가: company.country,
        지역: company.region,
        채용포지션: posting.position,
        채용보상금: posting.reward,
        사용기술: posting.skills
      }))
    );

    // 두 결과를 합침
    const allResults = [...jobPostingsResults, ...companyResults];

    // 중복 제거
    const results = allResults.filter((result, index, self) =>
      index === self.findIndex((r) => (
        r.채용공고_id === result.채용공고_id
      ))
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// 사용자의 채용 지원 (Create)
app.post('/applications', async (req, res) => {
  try {
    const { user_id, jobposting_id } = req.body;
    const application = await Application.create({ user_id, jobposting_id });
    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
