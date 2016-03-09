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
  })
})
