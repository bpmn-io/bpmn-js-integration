var Helper = require('../helper');


describe('modeling', function() {

  var helper = new Helper(__dirname),
      testExecute = helper.testExecute;


  function ensureValidBpmn20(err, results, done) {
    if (err) {
      return done(err);
    }

    helper.validateBasic(results);
    helper.validateBpmn20(results, done);
  }


  // YUP, necessary
  this.timeout(10000);

  describe('elements', function() {

    describe('events', function() {

      it('should model event', testExecute('events/types.js', ensureValidBpmn20));

    });

  });


  describe('actions', function() {

    describe('remove', function() {

      it('should remove connection', testExecute('remove/connection.js', ensureValidBpmn20));

      it('should remove shape', testExecute('remove/shape.js', ensureValidBpmn20));

      it('should remove complex', testExecute('remove/complex.js', ensureValidBpmn20));

    });


    describe('move', function() {

      it('should move with containments', testExecute('move/containments.js', ensureValidBpmn20));

    });

  });


  describe('label', function() {

    it('should handle labels', testExecute('label/model.js', ensureValidBpmn20));

  });


  describe('scenarios', function() {

    it('should model gateway-loop', testExecute('scenarios/gateway-loop.js', ensureValidBpmn20));

    it('should model gateway-parallel', testExecute('scenarios/gateway-parallel.js', ensureValidBpmn20));

    it('should model simple-process', testExecute('scenarios/simple-process.js', ensureValidBpmn20));

  });

});