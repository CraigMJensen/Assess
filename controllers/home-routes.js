const router = require('express').Router();
const { Company, Ratings, Reviews, User } = require('../models');

router.get('/', (req, res) => {
  Company.findAll({
    attributes: ['company_name', 'roles', 'id', 'user_id'],
  })
    .then((dbCompanyData) => {
      const companies = dbCompanyData.map((company) =>
        company.get({ plain: true })
      );

      res.render('homepage', { companies });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});



router.get('/company/:id', (req, res) => {
  Company.findOne({
    attributes: ['company_name', 'roles', 'id', 'user_id'],
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Reviews,
        attributes: ['id', 'reviews_text', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
    .then((dbCompanyData) => {
      if (!dbCompanyData) {
        res.status(404).json({ message: 'No company with that ID' });
        return;
      }
      
      const companies = dbCompanyData.get({ plain: true });
      console.log(companies);
let sum = 0;
      for (let i = 0; i < companies.ratings.length; i++) {
                  const element = companies.ratings[i]; 
                 sum += element.rating_value;
              }
              // console.log(sum);
               let avg = (sum/companies.ratings.length).toFixed(1);
             
              // console.log(avg);  
      res.render('single-company', { companies, avg, loggedIn: req.session.loggedIn  });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
