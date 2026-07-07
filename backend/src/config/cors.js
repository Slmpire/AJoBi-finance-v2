module.exports = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    const allowed = [
      'http://localhost:3000',
      'https://ajobi-frontend.vercel.app',
      'https://ajobi-frontend-dfy3gvx3t-ajobi.vercel.app',
    ];
    
    // Allow any vercel.app subdomain
    if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(null, true); // Allow all origins for hackathon
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'accountId'],
};