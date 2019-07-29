const express = require('express');
const router = express.Router();
// const pg = require('pg');
const pg = require('hdb')
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/rewards';


const client = pg.createClient({
  host     : '10.253.93.93',
  port     : 30041,
  user     : 'SBSS_70127013417422373007052407023260060293338678417465218094097250637',
  password : 'Ep08rO6ladrwsASHzyKpppKhaELrZiiap2cCmFA8GV1kaQq9MuKF87udbAuEQ9s1xly6R40g-eo60f-5xyZ_qdc07wHNxVrqqJPrA585x4-0CWvmIeBd7s1OxFtMYi_E'
});



router.get('/api/v2/hana', (req, res, next) => {


  client.on('error', function (err) {
  console.error('Network connection error', err);
  });
  client.connect(function (err) {
    if (err) {
      return console.error('Connect error', err);
    }
    client.exec('SELECT * FROM "A2F008990B284A638D1DCEAB5D55455B"."TEST";', function (err, rows) {
      client.end();
      if (err) {
        return console.error('Execute error:', err);
      }
      console.log('Results:', rows);
    });
  });

});

// HTTP GET
router.get('/api/v1/rewards', (req, res, next) => {
  
  const results = [];
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query('SELECT * FROM rewards ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});

// HTTP POST
router.post('/api/v1/rewards', (req, res, next) => {

  const data = { text: req.body.text, value: req.body.value };
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // Insert record
    const query = client.query('INSERT INTO rewards(text, value) values($1, $2)',
    [data.text, data.value]);
    
    // Close connection and respond
    query.on('end', () => {
      done();
      return res.sendStatus(201);
    });
  });
});

// HTTP PUT
router.put('/api/v1/rewards/:reward_id', (req, res, next) => {

  const id = req.params.reward_id;
  const data = { text: req.body.text, value: req.body.value };
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // Update record
    const query = client.query('UPDATE rewards SET text=($1), value=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    
    // Close connection and respond
    query.on('end', () => {
      done();
      return res.sendStatus(200);
    });
  });
});

// HTTP DELETE
router.delete('/api/v1/rewards/:reward_id', (req, res, next) => {

  const id = req.params.reward_id;
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // Delete record
    const query = client.query('DELETE FROM rewards WHERE id=($1)', [id]);
    
    // Close connection and respond
    query.on('end', () => {
      done();
      return res.sendStatus(200);
    });
  });
});

module.exports = router;
