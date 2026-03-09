const mongoose = require('mongoose');
require('dotenv').config();

const Election = require('./src/models/Election');
const Candidate = require('./src/models/Candidate');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blockchain-voting', {
  // options deprecated
})
.then(async () => {
  console.log('✅ MongoDB Connected for Seeding');

  // Clear existing mock election to avoid duplicates
  await Election.deleteMany({ _id: '60d5ecb8b392d7001f8e4a10' });
  await Candidate.deleteMany({ electionId: '60d5ecb8b392d7001f8e4a10' });

  // Create Mock Election
  const election = await Election.create({
    _id: '60d5ecb8b392d7001f8e4a10',
    title: 'University Student Council 2026',
    status: 'active',
    startDate: new Date('2026-03-01'),
    endDate: new Date('2026-03-15')
  });

  console.log('Election Created:', election.title);

  const c1 = await Candidate.create({
    _id: '60d5ecb8b392d7001f8e4a12',
    name: 'Alice Chen',
    party: 'Progressive Student Union',
    manifesto: 'Better campus wifi and extended library hours.',
    electionId: election._id
  });

  const c2 = await Candidate.create({
    _id: '60d5ecb8b392d7001f8e4a13',
    name: 'Bob Smith',
    party: 'Student Action Group',
    manifesto: 'More funding for sports and clubs.',
    electionId: election._id
  });

  console.log('Candidates Created:', c1.name, c2.name);

  mongoose.connection.close();
  console.log('✅ Seeding Complete');
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});
