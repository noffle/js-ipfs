/* eslint-env mocha */

const expect = require('chai').expect
const nexpect = require('nexpect')
const httpAPI = require('../../src/http-api')

describe('object', () => {
  describe('api offline', () => {
    it('new', (done) => {
      nexpect.spawn('node', [process.cwd() + '/src/cli/bin.js', 'object', 'new'])
        .run((err, stdout, exitcode) => {
          expect(err).to.not.exist
          expect(exitcode).to.equal(0)
          expect(stdout[0])
             .to.equal('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
          done()
        })
    })

    it('get', (done) => {
      nexpect.spawn('node', [process.cwd() + '/src/cli/bin.js', 'object', 'get', 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'])
        .run((err, stdout, exitcode) => {
          expect(err).to.not.exist
          expect(exitcode).to.equal(0)
          const result = JSON.parse(stdout[0])
          expect(result.Links)
             .to.deep.equal([])
          expect(result.Data)
             .to.equal('')
          done()
        })
    })

    it('put', (done) => {
      nexpect.spawn('node', [process.cwd() + '/src/cli/bin.js', 'object', 'put', process.cwd() + '/tests/node.json'])
        .run((err, stdout, exitcode) => {
          expect(err).to.not.exist
          expect(exitcode).to.equal(0)
          expect(stdout[0])
             .to.equal('added QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm')
          done()
        })
    })
  })

  describe('api running', () => {
    before((done) => {
      httpAPI.start((err) => {
        expect(err).to.not.exist
        done()
      })
    })

    after((done) => {
      httpAPI.stop((err) => {
        expect(err).to.not.exist
        done()
      })
    })

    it('new', (done) => {
      nexpect.spawn('node', [process.cwd() + '/src/cli/bin.js', 'object', 'new'])
        .run((err, stdout, exitcode) => {
          expect(err).to.not.exist
          expect(exitcode).to.equal(0)
          expect(stdout[0])
             .to.equal('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
          done()
        })
    })

    it('get', (done) => {
      nexpect.spawn('node', [process.cwd() + '/src/cli/bin.js', 'object', 'get', 'QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'])
        .run((err, stdout, exitcode) => {
          expect(err).to.not.exist
          expect(exitcode).to.equal(0)
          const result = JSON.parse(stdout[0])
          expect(result.Links)
             .to.deep.equal([])
          expect(result.Data)
             .to.equal('')
          done()
        })
    })

    it('put', (done) => {
      nexpect.spawn('node', [process.cwd() + '/src/cli/bin.js', 'object', 'put', process.cwd() + '/tests/node.json'])
        .run((err, stdout, exitcode) => {
          expect(err).to.not.exist
          expect(exitcode).to.equal(0)
          expect(stdout[0])
             .to.equal('added QmZZmY4KCu9r3e7M2Pcn46Fc5qbn6NpzaAGaYb22kbfTqm')
          done()
        })
    })
  })
})
