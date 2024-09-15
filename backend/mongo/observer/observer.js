class Observer {
    update(topic, message) {
      throw new Error("Method 'update()' must be implemented.");
    }
  }
  
module.exports = Observer;