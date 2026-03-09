#!/bin/bash
echo "Starting Backend..."
cd backend
npm install
node server.js &
BACKEND_PID=$!

echo "Starting Frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

# Wait for all processes to exit
wait

# Exit with success or failure depending on the jobs
exit $?
