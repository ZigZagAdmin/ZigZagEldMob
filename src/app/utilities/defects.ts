export const defectsVehicle = [
  "Air Compressor",
  "Battery",
  "Body",
  "Brake Accessories",
  "Coupling Devices",
  "Drive Line",
  "Exhaust",
  "Fluid Levels",
  "Front Axle",
  "Headlights",
  "Horn",
  "Muffler",
  "Parking Breaks",
  "Reflectors",
  "Service Breaks",
  "Starter",
  "Suspension System",
  "Tire Chains",
  "Transmission",
  "Turn Indicators",
  "Windows",
  "Wipers & Washers",
  "Air Lines",
  "Belts & Hoses",
  "Clutch",
  "Defroster",
  "Engine",
  "Fifth Wheel",
  "Frame & Assembly",
  "Fuel Tanks",
  "Heater",
  "Mirrors",
  "Oil Level",
  "Radiator Level",
  "Safety Equipment",
  "Service Door",
  "Steering",
  "Tail Lights",
  "Tires",
  "Trip Recorder",
  "Wheels & Rims",
  "Windshield",
];

export const defectsTrailers = [
  "Brake Connections",
  "Coupling Devices",
  "Doors",
  "Landing Gear",
  "Other",
  "Roof",
  "Suspension System",
  "Wheels & Rims",
  "Breaks",
  "Coupling Pin",
  "Hitch",
  "Lights",
  "Reflectors",
  "Straps",
  "Tarpaulin",
];

export const dvirStatuses: { code: string; name: string }[] = [
  { code: "VCS", name: "Vehicle Condition Satisfactory" },
  { code: "D", name: "Has Defects" },
  { code: "DC", name: "Defects Corrected" },
  {
    code: "DNNBC",
    name: "Defects Need Not Be Corrected",
  },
];
