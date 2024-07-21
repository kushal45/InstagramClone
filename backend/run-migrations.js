const { exec } = require('child_process');

function runCommand(command) {
    
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        resolve(stdout);
      });
    });
  }
  
  // Example usage in an async function
  async function runMigrations() {
    try {
      await runCommand('npx sequelize-cli db:migrate');
      console.log('Both commands completed successfully');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  
  runMigrations();