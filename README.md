Developer Guide for EksBorder Shipping API Admin UI

Introduction:

EksBorder Shipping API Admin UI is an application designed to manage the users, shipping accounts, and customers of a shipping platform. This guide provides instructions for installing and deploying the application.

Installation:

To install the EksBorder Shipping API Admin UI, follow the steps below:

Clone the repository from GitHub using the following command:

git clone https://github.com/jwlbjtu/eksborder-shipping-api-admin-ui.git

Install the dependencies by running the following command in the root directory:

npm install

Create a .env file in the root directory and set the following environment variables:

makefile
Copy code
PORT=<port_number>
DB_URL=<database_url>
JWT_SECRET=<jwt_secret_key>
Replace <port_number> with the port number you want the server to run on, <database_url> with the URL of your MongoDB database, and <jwt_secret_key> with a secret key for JSON Web Tokens.

Run the following command to start the server:

npm start

The server should be running on the specified port.

Deployment
To deploy the EksBorder Shipping API Admin UI on a Linux server, follow the steps below:

Connect to the server via SSH.

Install Node.js and npm by running the following command:

arduino
Copy code
sudo apt-get install nodejs npm
Install PM2 by running the following command:

Copy code
sudo npm install pm2 -g
Install MongoDB by following the instructions on the MongoDB website for your Linux distribution.

Clone the repository from GitHub using the following command:

bash
Copy code
git clone https://github.com/jwlbjtu/eksborder-shipping-api-admin-ui.git
Install the dependencies by running the following command in the root directory:

Copy code
npm install
Create a .env file in the root directory and set the following environment variables:

makefile
Copy code
PORT=<port_number>
DB_URL=<database_url>
JWT_SECRET=<jwt_secret_key>
Replace <port_number> with the port number you want the server to run on, <database_url> with the URL of your MongoDB database, and <jwt_secret_key> with a secret key for JSON Web Tokens.

Start the server with PM2 by running the following command:

sql
Copy code
pm2 start npm -- start
This will start the server with PM2 and enable it to automatically restart the server if it crashes.

To save the current PM2 configuration, run the following command:

Copy code
pm2 save
This will save the current PM2 configuration, so the server will start automatically if the server restarts.

Thank you for using EksBorder Shipping API Admin UI!
