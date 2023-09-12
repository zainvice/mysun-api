const whitelistUrls = [
  "http://localhost:3500",
  "http://localhost:3000",
  "http://localhost:3001",
];

const corsOptions = {
  // origin: (origin, callback) => {
  //   if (whitelistUrls.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed"));
  //   }
  // },
  origin: '*',
  methods: ["GET", "PUT", "POST", "DELETE", "UPDATE", "PATCH"],
  credentials: true,
  optionsSucessStatus: 200,
};

module.exports = corsOptions;
