process.stdin.on('data', function (data) {
  const n = parseInt(data, 10);
  console.log(Math.floor(n / 10), n % 10);
});
