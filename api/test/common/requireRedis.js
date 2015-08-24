export default function(callback) {
  before(function() {
    if(!redis) {
      this.skip();
    } else if(callback) {
      callback.call(this);
    }
  });
}
