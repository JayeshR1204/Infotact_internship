import bcrypt from 'bcryptjs';

async function test() {
  console.log("Direct import:", typeof bcrypt.hash);
  const dyn = await import('bcryptjs');
  console.log("Dynamic import:", dyn);
  console.log("Dynamic default:", dyn.default);
  console.log("Dynamic default hash:", dyn.default?.hash);
}

test();
