const request = require('supertest');
const app = require('../app');
const { closeConnection, query } = require('../config/db.tests');
const datos = require('./datos');

describe('===USUARIOS===', () => {

  beforeAll(async (done) => {
    const sql = "INSERT INTO usuarios SET ?";
    //const res = await query(sql, datos.usuarioNuevo);

    //expect(res.insertId).toBeTruthy();
    done();
  });

  afterAll(async (done) => {
    /* const sql = "delete ";
    await query(sql); */
    await closeConnection();
    done();
  })

  it('POST /api/usuarios/nuevo should return the user row', async (done) => { 
    const res = await request(app)
    .post('/api/usuarios/nuevo')
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3Vhcmlvc19pZCI6MjYsInJvbGVzX2lkIjoyLCJleHAiOjE2ODk0NDE5OTQsImlhdCI6MTY4Njg0OTk5NH0.qVo6IEZNa8z6oPuiIU_P78wcDObQimiIxp9zZruEBcc')
    .set('Content-Type', 'application/json')
    .send(datos.usuarioNuevo)
    
    expect(res.statusCode).toBe(200);
    expect(res.body.insertId).toBeTruthy;
    done()
  });
 
  /* describe('POST /api/usuarios/login', () => { });

  describe('GET /api/usuarios', () => { });

  describe('GET /api/usuarios/:usuarios_id', () => { });

  describe('PUT /api/usuarios/:usuarios_id', () => { });

  describe('DELETE /api/usuarios/:usuarios_id', () => { });
 */


});
