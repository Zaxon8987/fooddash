const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    password: "$2a$10$dummyhashfordemouseraccount",
    phone: "+1 555-0123",
    addresses: [
      {
        id: 1,
        label: "Home",
        street: "123 Main Street",
        city: "New York",
        zip: "10001",
        isDefault: true
      },
      {
        id: 2,
        label: "Office",
        street: "456 Business Ave",
        city: "New York",
        zip: "10002",
        isDefault: false
      }
    ],
    paymentMethods: [
      { id: 1, type: "card", last4: "4242", brand: "Visa", isDefault: true }
    ]
  }
];

module.exports = users;
