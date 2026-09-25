const url = "http://localhost:4001/auth/register";

const body = {
  name: "Race User",
  email: "race@example.com",
  password: "FlashTix@123",
};

async function register(label: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  console.log(label, response.status, data);
}

async function main() {
  await Promise.all([
    register("Request A"),
    register("Request B"),
  ]);
}

main();