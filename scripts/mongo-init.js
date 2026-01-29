// MongoDB initialization script
db = db.getSiblingDB('entreconductas');

// Create user for the application
db.createUser({
  user: 'app_user',
  pwd: 'app_password',
  roles: [
    {
      role: 'readWrite',
      db: 'entreconductas',
    },
  ],
});

// Create collections with initial setup
db.createCollection('users');

print('Database initialized successfully');
