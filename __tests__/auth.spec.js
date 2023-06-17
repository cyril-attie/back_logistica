
describe('Peticiones authenticación', () => {

  let request;
  
  beforeAll = () => {
    jest.useFakeTimers();
    request = require('supertest');
    const app = require('../bin/www')
  }

  describe('POST /api/auth/register', () => {
    it('should test that true === true', () => {
      expect(true).toBe(true)
    })

    it('should create a new Jefe de Equipo', async () => {
      const usuario = {
        "nombre": "Jefe",
        "apellido": "ApellidoJefe",
        "email": "jefedeequipo@almacen.es",
        "contrasena": "password123",
        "ciudad": "Barcelona",
        "codigo_postal": "08005",
        "roles_id": 2
      }

      const res = await request(app)
        .post('/api/auth/register')
        .send(usuario);

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('insertId')
    })
  });

  /*   describe('POST /api/usuarios/login', ()=>{});
  
    describe('GET /api/usuarios', ()=>{});
  
    describe('GET /api/usuarios/:usuarios_id', ()=>{});
  
    describe('PUT /api/usuarios/:usuarios_id', ()=>{});
  
    describe('DELETE /api/usuarios/:usuarios_id', ()=>{});
   */


});
