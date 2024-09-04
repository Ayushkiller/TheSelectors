const { exec } = require('child_process');

// Function to run the npm start command
const runNpmStart = () => {
  exec('npm start', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing npm start: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

// Execute the function
runNpmStart();
