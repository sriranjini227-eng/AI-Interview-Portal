const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.interview.9xwjmpm.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error(err);
    } else {
      console.log(addresses);
    }
  }
);