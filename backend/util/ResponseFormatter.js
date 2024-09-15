class ResponseFormatter {
    static success(data, message = 'Success', metadata = {}) {
      return {
        status: 'success',
        message,
        data,
        metadata,
      };
    }
  
    static error(error, message = 'Error', metadata = {}) {
      return {
        status: 'error',
        message,
        error: error.message || error,
        metadata,
      };
    }
  }
  
  module.exports = ResponseFormatter;