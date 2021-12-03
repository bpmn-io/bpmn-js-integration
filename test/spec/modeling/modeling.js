var Helper = require('../helper');


describe('modeling', function() {

  var helper = new Helper(__dirname),
      testExecute = helper.testExecute;


  function ensureValidBpmn20(err, results, done) {
    if (err) {
      return done(err);
    }

    try {
      helper.validateBasic(results);

      helper.validateBpmn20(results, done);
    } catch (err) {
      return done(err);
    }
  }


  // YUP, necessary because we do JAVAAAA for validation
  this.timeout(25000);


  describe('append', function() {

    it('should append events', testExecute('append/events.js', ensureValidBpmn20));

    it('should append text-annotations', testExecute('append/text-annotation.js', ensureValidBpmn20));

  });


  describe('remove', function() {

    it('should remove connection', testExecute('remove/connection.js', ensureValidBpmn20));

    it('should remove shape', testExecute('remove/shape.js', ensureValidBpmn20));

    it('should remove complex', testExecute('remove/complex.js', ensureValidBpmn20));

  });


  describe('move', function() {

    it('should move with children', testExecute('move/children.js', ensureValidBpmn20));

    it('should move updating parent', testExecute('move/parent-changes.js', ensureValidBpmn20));

  });


  describe('label', function() {

    it('should handle labels', testExecute('label/model.js', ensureValidBpmn20));

  });


  describe('color', function() {

    it('should color', testExecute('colors/color.js', ensureValidBpmn20));

  });


  describe('elements', function() {

    it('should create and remove DataAssociation(s)', testExecute('data-association/model.js', ensureValidBpmn20));

  });


  describe('scenarios', function() {

    it('should model gateway-loop', testExecute('scenarios/gateway-loop.js', ensureValidBpmn20));

    it('should model gateway-parallel', testExecute('scenarios/gateway-parallel.js', ensureValidBpmn20));

    it('should model simple-process', testExecute('scenarios/simple-process.js', ensureValidBpmn20));

  });

});