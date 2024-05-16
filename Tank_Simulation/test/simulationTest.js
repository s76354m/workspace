const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Simulation', () => {
    describe('/GET setup', () => {
        it('it should GET the simulation setup page', (done) => {
            chai.request(server)
                .get('/simulation/setup')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
    });

    describe('/POST start', () => {
        it('it should POST to start a simulation', (done) => {
            const simulationData = {
                tanks: [
                    { id: 'tankId1', quantity: 3 },
                    { id: 'tankId2', quantity: 2 }
                ],
                mapId: 'mapId1',
                tankPositions: [
                    { x: 100, y: 150 },
                    { x: 200, y: 250 }
                ]
            };
            chai.request(server)
                .post('/simulation/start')
                .send(simulationData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('outcomes');
                    done();
                });
        });
    });

    describe('/GET results', () => {
        it('it should GET the simulation results page', (done) => {
            chai.request(server)
                .get('/simulation/results')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
        });
    });

    describe('/GET api/maps/:id', () => {
        it('it should GET the map data by id', (done) => {
            const mapId = 'mapId1';
            chai.request(server)
                .get(`/api/maps/${mapId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('terrains');
                    res.body.should.have.property('terrainLayouts');
                    done();
                });
        });
    });
});