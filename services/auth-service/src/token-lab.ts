// import { verifyToken } from "./services/token.service.js";

// const originalToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQ1VTVE9NRVIiLCJpYXQiOjE3OTExNDMyMzEsImV4cCI6MTc5MTE0NDEzMSwic3ViIjoiY2RlYTM0OTAtMDNlMi00MDFhLWFlNmQtMjMwNTE5YzA0ZjNlIn0.a7MtBqkdCMQi3lA371AOaB_M0E3gMC6kQzUacjxsoko";

// const [header, payload, signature] = originalToken.split(".");
// if (!header || !payload || !signature) {
//   throw new Error("JWT contains an empty section");
// }

// // Decode payload WITHOUT verifying it
// const decodedPayload = JSON.parse(
//   Buffer.from(payload, "base64url").toString("utf8")
// );

// console.log("Original payload:", decodedPayload);

// // Pretend we are an attacker
// decodedPayload.role = "ADMIN";

// // Encode the changed payload again
// const tamperedPayload = Buffer.from(
//   JSON.stringify(decodedPayload)
// ).toString("base64url");

// // Keep the OLD signature
// const tamperedToken =
//   `${header}.${tamperedPayload}.${signature}`;

// console.log("\nTampered token:", tamperedToken);

// try {
//   const result = verifyToken(tamperedToken);

//   console.log("Verified:", result);
// } catch (error) {
//   console.log("\nVerification failed:", error);
// }



import {
  createToken,
  verifyToken,
} from "./services/token.service.js";

async function main() {
  const token = createToken({
    id: "lab-user-123",
    role: "CUSTOMER",
  });

  console.log("Token created:\n", token);

  // Verify immediately
  try {
    const result = verifyToken(token);

    console.log("\nImmediate verification:");
    console.log(result);
  } catch (error) {
    console.log("Immediate verification failed:", error);
  }

  console.log("\nWaiting 6 seconds...");

  await new Promise((resolve) =>
    setTimeout(resolve, 6000)
  );

  // Verify again after expiration
  try {
    const result = verifyToken(token);

    console.log("\nAfter 6 seconds:");
    console.log(result);
  } catch (error) {
    console.log("\nAfter 6 seconds verification failed:");
    console.log(error);
  }
}

main();