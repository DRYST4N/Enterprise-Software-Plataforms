export default function factorial(n: number): number {
  if (n < 0) throw new Error("n must be >= 0");
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}