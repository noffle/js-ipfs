/* eslint-env mocha */

const expect = require('chai').expect
const APIctl = require('ipfs-api')

describe('object', () => {
  describe('api', () => {
    var api

    it('api', (done) => {
      api = require('../../src/http-api').server.select('API')
      done()
    })

    describe('/object/new', () => {
      it('returns 500 for request with invalid argument', (done) => {
        api.inject({
          method: 'GET',
          url: '/api/v0/object/new?arg'
        }, (res) => {
          expect(res.statusCode).to.equal(500)
          expect(res.result.Code).to.equal(0)
          expect(res.result.Message).to.be.a('string')
          done()
        })
      })

      it('returns value', (done) => {
        api.inject({
          method: 'GET',
          url: '/api/v0/object/new'
        }, (res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.result.Hash)
            .to.equal('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
          expect(res.result.Links)
            .to.equal(null)
          done()
        })
      })
    })

    describe('/object/get', () => {
      it('returns 400 for request without argument', (done) => {
        api.inject({
          method: 'GET',
          url: '/api/v0/object/get'
        }, (res) => {
          expect(res.statusCode).to.equal(400)
          expect(res.result).to.be.a('string')
          done()
        })
      })

      it('returns 500 for request with invalid argument', (done) => {
        api.inject({
          method: 'GET',
          url: '/api/v0/object/get?arg=invalid'
        }, (res) => {
          expect(res.statusCode).to.equal(500)
          expect(res.result.Code).to.equal(0)
          expect(res.result.Message).to.be.a('string')
          done()
        })
      })

      it('returns value', (done) => {
        api.inject({
          method: 'GET',
          url: '/api/v0/object/get?arg=QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n'
        }, (res) => {
          expect(res.statusCode).to.equal(200)
          expect(res.result.Links)
             .to.deep.equal([])
          expect(res.result.Data)
             .to.equal('')
          done()
        })
      })
    })
  })

  describe('using js-ipfs-api', () => {
    var ctl

    it('start IPFS API ctl', (done) => {
      ctl = APIctl('/ip4/127.0.0.1/tcp/6001')
      done()
    })

    it('ipfs.object.new', (done) => {
      ctl.object.new(null, (err, result) => {
        expect(err).to.not.exist
        expect(result.Hash)
          .to.equal('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n')
        expect(result.Links)
          .to.equal(null)
        done()
      })
    })

    describe('ipfs.object.get', () => {
      it('returns error for request without argument', (done) => {
        ctl.object.get(null, (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns error for request with invalid argument', (done) => {
        ctl.object.get('invalid', (err, result) => {
          expect(err).to.exist
          done()
        })
      })

      it('returns value', (done) => {
        ctl.object.get('QmdfTbBqBPQ7VNxZEYEj14VmRuZBkqFbiwReogJgS1zR1n', (err, result) => {
          expect(err).to.not.exist
          expect(result.Links)
             .to.deep.equal([])
          expect(result.Data)
             .to.equal('')
          done()
        })
      })
    })
  })
})
