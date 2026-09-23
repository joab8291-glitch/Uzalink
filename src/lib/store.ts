import type { Product } from "./data";

const KEY = "uzalink.created.products.v1";

function read(): Product[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function write(list: Product[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable */
  }
}

const memory: Product[] = read();

export function addCreatedProduct(p: Product) {
  memory.unshift(p);
  write(memory);
}

export function findAnyProduct(code: string): Product | undefined {
  const c = code.toLowerCase();
  return memory.find((p) => p.code.toLowerCase() === c);
}

export function randomCode() {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 6; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
