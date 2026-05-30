export interface CarFields {
  make: string;
  model: string;
  variant?: string;
  year: number;
  mileage: number;
  price: number;
  gearbox: string;
  colour?: string;
  engine?: string;
}

export function generateCarTitle(car: CarFields): string {
  const parts = [];

  if (car.make) parts.push(car.make);
  if (car.model) parts.push(car.model);

  // Variant only if it adds info (not just "Base" or "Standard")
  if (car.variant && !['Standard', 'Base', 'Entry'].includes(car.variant)) {
    parts.push(car.variant);
  }

  if (car.year) parts.push(`(${car.year})`);

  return parts.join(' ') || 'Unnamed Car';
}

export function generateSeoTitle(car: CarFields): string {
  const baseTitle = `${car.make || ''} ${car.model || ''} ${car.variant || ''}`.trim();
  return `${baseTitle} for sale in Virginia Water | SmallCar by PMS Motors`;
}

export function generateMetaDescription(car: CarFields): string {
  return `${car.year || ''} ${car.make || ''} ${car.model || ''} with ${
    car.mileage ? car.mileage.toLocaleString() : 'low'
  } miles. ${car.gearbox || ''} · ${car.colour || ''} · ${car.engine || ''}. £${
    car.price ? car.price.toLocaleString() : ''
  }. HPI clear · Available in Virginia Water, Surrey.`;
}

export function generateSlug(car: CarFields): string {
  return `${car.make || ''}-${car.model || ''}-${car.variant || ''}-${car.year || ''}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-') // replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // trim hyphens from start/end
}
