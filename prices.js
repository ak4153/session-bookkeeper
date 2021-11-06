const prices = [
  {
    name: "Radius",
    price: 420,
  },
  { name: "Total Hip Replacement", price: 650 },
  {
    name: "Gamma",
    price: 550,
  },
  { name: "Bipolar", price: 550 },
  { name: "Heart Graft Bypass", price: 1500 },
  { name: "Trauma 2", price: 450 },
];

const calculatePrice = function (name) {
  const sesToReturn = { name: "", price: 0 };
  prices.forEach((ses) => {
    if (name === ses.name) {
      sesToReturn.name = ses.name;
      sesToReturn.price = ses.price;
      return sesToReturn;
    }
  });
  return sesToReturn;
};

const returnAllSessions = function () {
  const sessionNames = [];
  prices.forEach((ses) => {
    sessionNames.push(ses.name);
  });
  return sessionNames;
};
module.exports = {
  calculatePrice: calculatePrice,
  returnAllSessions: returnAllSessions,
};
