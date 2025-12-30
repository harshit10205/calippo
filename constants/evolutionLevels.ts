
export interface AnimalLevel {
  level: number;
  animal: string;
  icon: string;
  type: 'starter' | 'common' | 'strong' | 'apex' | 'legendary' | 'mythic';
  reqProtein: number; // in grams
  reqScans: number;
  description: string;
}

const ICONS: Record<string, string> = {
  "Ant": "fa-bug", "Shrimp": "fa-shrimp", "Mouse": "fa-mouse", "Hamster": "fa-mouse-field", 
  "Sparrow": "fa-dove", "Robin": "fa-dove", "Rabbit": "fa-rabbit", "Hare": "fa-rabbit-fast", 
  "Hedgehog": "fa-worm", "Squirrel": "fa-squirrel", "Pigeon": "fa-dove", "Duck": "fa-duck", 
  "Chicken": "fa-egg", "Cat": "fa-cat", "Dog": "fa-dog", "Fox": "fa-wolf", "Otter": "fa-otter", 
  "Beaver": "fa-otter", "Koala": "fa-paw", "Sloth": "fa-clock", "Wolf": "fa-wolf-howl", 
  "Tiger": "fa-cat", "Lion": "fa-shield-cat", "Bear": "fa-paw", "Dragon": "fa-dragon", 
  "T-Rex King 👑": "fa-crown", "Mammoth": "fa-hippo"
};

export const EVOLUTION_LEVELS: AnimalLevel[] = Array.from({ length: 200 }, (_, i) => {
  const level = i + 1;
  let type: AnimalLevel['type'] = 'common';
  if (level === 1) type = 'starter';
  else if (level > 150) type = 'mythic';
  else if (level > 100) type = 'legendary';
  else if (level > 50) type = 'apex';
  else if (level > 20) type = 'strong';

  // Progression logic: 
  // Level 1: 30g protein. 
  const reqProtein = Math.floor(30 * Math.pow(level, 1.6));
  const reqScans = Math.floor(level * 1.2);

  const animalNames = [
    "Ant", "Shrimp", "Mouse", "Hamster", "Sparrow", "Robin", "Rabbit", "Hare", "Hedgehog", "Squirrel",
    "Pigeon", "Duck", "Chicken", "Cat", "Dog", "Fox", "Otter", "Beaver", "Koala", "Sloth",
    "Badger", "Raccoon", "Monkey", "Lemur", "Goat", "Sheep", "Pig", "Deer", "Gazelle", "Zebra",
    "Donkey", "Pony", "Horse", "Wolf", "Coyote", "Lynx", "Bobcat", "Cheetah", "Leopard", "Jaguar",
    "Panther", "Cougar", "Tiger", "Lion", "Hyena", "Wild Boar", "Ram", "Bison", "Ox", "Bull",
    "Gorilla", "Chimpanzee", "Orangutan", "Bear", "Grizzly", "Polar Bear", "Panda", "Walrus", "Seal", "Penguin",
    "Albatross", "Eagle", "Falcon", "Hawk", "Owl", "Vulture", "Stork", "Flamingo", "Swan", "Pelican",
    "Crocodile", "Alligator", "Komodo Dragon", "Python", "Cobra", "Anaconda", "Tortoise", "Sea Turtle", "Octopus", "Squid",
    "Colossal Squid", "Shark", "Great White", "Hammerhead", "Tiger Shark", "Manta Ray", "Stingray", "Swordfish", "Marlin", "Tuna",
    "Dolphin", "Beluga", "Narwhal", "Orca", "Humpback Whale", "Blue Whale", "Sperm Whale", "Elephant", "Rhino", "Hippo",
    "Giraffe", "Camel", "Llama", "Alpaca", "Kangaroo", "Wallaby", "Platypus", "Echidna", "Tasmanian Devil", "Wombat",
    "Ostrich", "Emu", "Cassowary", "Moose", "Elk", "Caribou", "Reindeer", "Antelope", "Impala", "Wildebeest",
    "Cape Buffalo", "Yak", "Highland Cow", "Brahma Bull", "Golden Eagle", "Harpy Eagle", "Condor", "Snow Leopard", "Clouded Leopard", "Black Panther",
    "Silverback", "Kodiak Bear", "Cave Bear", "Short-Faced Bear", "Sabertooth Tiger", "Dire Wolf", "American Lion", "Marsupial Lion", "Thylacoleo", "Megalania",
    "Titanoboa", "Sarcosuchus", "Deinosuchus", "Megalodon", "Basilosaurus", "Livyatan", "Woolly Mammoth", "Mastodon", "Giant Ground Sloth", "Glyptodon",
    "Irish Elk", "Elasmotherium", "Sivatherium", "Daeodon", "Andrewsarchus", "Phorusrhacos", "Gastornis", "Argentavis", "Quetzalcoatlus", "Pterodactyl",
    "Dimetrodon", "Gorgonopsid", "Scutosaurus", "Edaphosaurus", "Inostrancevia", "Coelophysis", "Plateosaurus", "Dilophosaurus", "Ceratosaurus", "Allosaurus",
    "Spinosaurus", "Giganotosaurus", "Carcharodontosaurus", "Utahraptor", "Deinonychus", "Velociraptor", "Troodon", "Therizinosaurus", "Ankylosaurus", "Stegosaurus",
    "Triceratops", "Styracosaurus", "Pachycephalosaurus", "Parasaurolophus", "Iguanodon", "Brachiosaurus", "Diplodocus", "Apatosaurus", "Argentinosaurus", "Dreadnoughtus",
    "Carnotaurus", "Albertosaurus", "Tarbosaurus", "Daspletosaurus", "Yutyrannus", "Gorgosaurus", "Alioramus", "Nanotyrannus", "Giga-Saurus", "T-Rex King 👑"
  ];

  const animal = animalNames[i] || `Ancient Level ${level} Beast`;
  
  return {
    level,
    animal,
    icon: ICONS[animal] || "fa-dna",
    type,
    reqProtein,
    reqScans,
    description: `Requires ${reqProtein}g total protein and ${reqScans} meals scanned.`
  };
});
