// subject.js
class Subject {
    constructor() {
      this.observers = [];
    }
  
    addObserver(observer) {
      this.observers.push(observer);
    }
  
    removeObserver(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }
  
    notifyObservers(topic, message) {
      for (const observer of this.observers) {
        observer.update(topic, message);
      }
    }
  }
  
  module.exports = Subject;