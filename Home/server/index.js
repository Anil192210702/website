const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory mock database
const projects = [];

// Static rates for demonstration
const constructionRates = {
  Basic: {
    cement: 200, sand: 150, bricks: 180, iron: 220, aggregate: 120,
    windowsDoors: 200, tiles: 150, electrical: 180, painting: 120, contractor: 300,
  },
  Premium: {
    cement: 250, sand: 180, bricks: 220, iron: 280, aggregate: 150,
    windowsDoors: 280, tiles: 250, electrical: 250, painting: 200, contractor: 400,
  },
  Luxury: {
    cement: 300, sand: 220, bricks: 280, iron: 350, aggregate: 180,
    windowsDoors: 400, tiles: 400, electrical: 350, painting: 300, contractor: 500,
  }
};

const interiorRates = {
  Basic: { livingRoom: 30000, bedroom: 40000, kitchen: 50000, diningRoom: 20000, foyer: 10000, bathroom: 25000 },
  Premium: { livingRoom: 45000, bedroom: 60000, kitchen: 80000, diningRoom: 30000, foyer: 15000, bathroom: 40000 },
  Luxury: { livingRoom: 70000, bedroom: 90000, kitchen: 120000, diningRoom: 50000, foyer: 25000, bathroom: 60000 }
};

app.post('/api/estimate/construction', (req, res) => {
  const { location, packageType, area, floors, optimizationOptions } = req.body;
  
  const rates = constructionRates[packageType] || constructionRates['Basic'];
  const multiplier = floors === 'G + 1' ? 1.8 : 1;
  const areaNum = parseFloat(area) || 1000;
  
  const materialBreakdown = [
    { name: 'Cement', cost: rates.cement * areaNum * multiplier },
    { name: 'Sand', cost: rates.sand * areaNum * multiplier },
    { name: 'Bricks', cost: rates.bricks * areaNum * multiplier },
    { name: 'Iron', cost: rates.iron * areaNum * multiplier },
    { name: 'Aggregate', cost: rates.aggregate * areaNum * multiplier },
    { name: 'Windows & Doors', cost: rates.windowsDoors * areaNum * multiplier },
    { name: 'Tiles', cost: rates.tiles * areaNum * multiplier },
    { name: 'Electrical', cost: rates.electrical * areaNum * multiplier },
    { name: 'Painting', cost: rates.painting * areaNum * multiplier },
    { name: 'Contractor', cost: rates.contractor * areaNum * multiplier }
  ];

  let totalNum = materialBreakdown.reduce((sum, val) => sum + val.cost, 0);
  
  if (optimizationOptions && Array.isArray(optimizationOptions)) {
    optimizationOptions.forEach(opt => {
      totalNum -= (opt.savings || 0);
    });
  }

  res.json({
    breakdown: materialBreakdown,
    total: totalNum
  });
});

app.post('/api/estimate/interior', (req, res) => {
  const { rooms, packageType, location } = req.body;
  const rates = interiorRates[packageType] || interiorRates['Basic'];
  
  const roomCosts = (rooms || []).map(r => {
    return { name: r, cost: rates[r] || rates.bedroom };
  });

  const totalNum = roomCosts.reduce((sum, val) => sum + val.cost, 0);

  res.json({
    roomCosts,
    total: totalNum
  });
});

app.post('/api/emi', (req, res) => {
  const { principal, annualRate, tenureMonths } = req.body;
  const P = parseFloat(principal);
  const r = parseFloat(annualRate) / 12 / 100;
  const n = parseInt(tenureMonths);

  let emi = 0;
  if (r > 0 && n > 0) {
    emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    emi = P / n;
  }

  let balance = P;
  const scheduleByYear = [];
  let currentYear = new Date().getFullYear();
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;
  let yearlyTotal = 0;

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    
    yearlyPrincipal += principalPaid;
    yearlyInterest += interest;
    yearlyTotal += emi;

    if (i % 12 === 0 || i === n) {
      scheduleByYear.push({
        year: currentYear,
        totalPaid: Math.round(yearlyTotal),
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        balanceRemaining: Math.max(0, Math.round(balance)),
        completionPercentage: Math.min(100, Math.round(((P - balance) / P) * 100))
      });
      currentYear++;
      yearlyPrincipal = 0;
      yearlyInterest = 0;
      yearlyTotal = 0;
    }
  }

  res.json({
    emi: Math.round(emi),
    scheduleByYear
  });
});

app.post('/api/projects', (req, res) => {
  const { user_name, constructionTotal, interiorTotal, grandTotal } = req.body;
  const newProject = {
    id: Date.now().toString(),
    user_name,
    constructionTotal,
    interiorTotal,
    grandTotal,
    createdAt: new Date().toISOString()
  };
  projects.push(newProject);
  res.status(201).json({ message: 'Project saved successfully', project: newProject });
});

app.get('/api/projects/:id/report', (req, res) => {
  const project = projects.find(p => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
