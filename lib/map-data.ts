export type Book = "hobbit" | "lotr";

export type PlaceCategory =
  | "hobbits"
  | "elves"
  | "dwarves"
  | "humans"
  | "evil"
  | "wild";

export type EventType = "quest" | "battle" | "encounter" | "council";

export type Coordinate = {
  x: number;
  y: number;
};

export type Place = {
  id: string;
  name: string;
  category: PlaceCategory;
  region: string;
  coordinate: Coordinate;
  books: Book[];
  description: string;
};

export type StoryEvent = {
  id: string;
  title: string;
  type: EventType;
  placeId?: string;
  coordinate?: Coordinate;
  chronology: string;
  books: Book[];
  description: string;
};

export type Path = {
  id: string;
  name: string;
  quest: "Quest for Erebor" | "Quest of the Ring";
  book: Book;
  color: string;
  points: Coordinate[];
  description: string;
};

export const places: Place[] = [
  {
    id: "hobbiton",
    name: "Hobbiton",
    category: "hobbits",
    region: "The Shire",
    coordinate: { x: 0.326, y: 0.305 },
    books: ["hobbit", "lotr"],
    description:
      "The quiet Shire village where Bilbo's adventure begins and Frodo inherits the Ring.",
  },
  {
    id: "trollshaws",
    name: "Trollshaws",
    category: "wild",
    region: "Eriador",
    coordinate: { x: 0.398, y: 0.297 },
    books: ["hobbit"],
    description:
      "Wooded country east of the Shire where Thorin's company encounters the three trolls.",
  },
  {
    id: "rivendell",
    name: "Rivendell",
    category: "elves",
    region: "Imladris",
    coordinate: { x: 0.458, y: 0.294 },
    books: ["hobbit", "lotr"],
    description:
      "Elrond's hidden valley and a refuge for both Thorin's company and the Fellowship.",
  },
  {
    id: "goblin-town",
    name: "Goblin-town",
    category: "evil",
    region: "Misty Mountains",
    coordinate: { x: 0.479, y: 0.259 },
    books: ["hobbit"],
    description:
      "A goblin stronghold beneath the Misty Mountains where Bilbo is separated from the dwarves.",
  },
  {
    id: "beorns-house",
    name: "Beorn's House",
    category: "wild",
    region: "Anduin Vale",
    coordinate: { x: 0.588, y: 0.289 },
    books: ["hobbit"],
    description:
      "The home of Beorn, a skin-changer who shelters Thorin's company before Mirkwood.",
  },
  {
    id: "mirkwood",
    name: "Mirkwood",
    category: "elves",
    region: "Rhovanion",
    coordinate: { x: 0.656, y: 0.303 },
    books: ["hobbit"],
    description:
      "A dark forest of spiders, elven halls, and dangerous paths on the road to Erebor.",
  },
  {
    id: "lake-town",
    name: "Lake-town",
    category: "humans",
    region: "Long Lake",
    coordinate: { x: 0.704, y: 0.192 },
    books: ["hobbit"],
    description:
      "The trading town of Esgaroth, threatened by Smaug and bound to the fate of Erebor.",
  },
  {
    id: "erebor",
    name: "Erebor",
    category: "dwarves",
    region: "The Lonely Mountain",
    coordinate: { x: 0.686, y: 0.173 },
    books: ["hobbit"],
    description:
      "The Lonely Mountain, ancestral kingdom of Durin's folk and lair of Smaug.",
  },
  {
    id: "moria",
    name: "Moria",
    category: "dwarves",
    region: "Misty Mountains",
    coordinate: { x: 0.5, y: 0.375 },
    books: ["lotr"],
    description:
      "The ancient dwarf realm beneath the mountains, crossed by the Fellowship at great cost.",
  },
  {
    id: "lothlorien",
    name: "Lothlorien",
    category: "elves",
    region: "Anduin Vale",
    coordinate: { x: 0.548, y: 0.407 },
    books: ["lotr"],
    description:
      "The golden wood ruled by Galadriel and Celeborn, where the Fellowship takes refuge.",
  },
  {
    id: "isengard",
    name: "Isengard",
    category: "evil",
    region: "Nan Curunir",
    coordinate: { x: 0.482, y: 0.541 },
    books: ["lotr"],
    description:
      "Saruman's fortress at Orthanc, a center of treachery and war against Rohan.",
  },
  {
    id: "helms-deep",
    name: "Helm's Deep",
    category: "humans",
    region: "Rohan",
    coordinate: { x: 0.487, y: 0.581 },
    books: ["lotr"],
    description:
      "The Hornburg refuge where Rohan withstands Saruman's army.",
  },
  {
    id: "edoras",
    name: "Edoras",
    category: "humans",
    region: "Rohan",
    coordinate: { x: 0.531, y: 0.555 },
    books: ["lotr"],
    description:
      "The hill-fort capital of Rohan and seat of King Theoden.",
  },
  {
    id: "minas-tirith",
    name: "Minas Tirith",
    category: "humans",
    region: "Gondor",
    coordinate: { x: 0.624, y: 0.666 },
    books: ["lotr"],
    description:
      "The White City of Gondor, besieged during the War of the Ring.",
  },
  {
    id: "mordor",
    name: "Mordor",
    category: "evil",
    region: "The Black Land",
    coordinate: { x: 0.718, y: 0.657 },
    books: ["lotr"],
    description:
      "Sauron's realm, ringed by mountains and watched from Barad-dur.",
  },
  {
    id: "mount-doom",
    name: "Mount Doom",
    category: "evil",
    region: "Mordor",
    coordinate: { x: 0.686, y: 0.641 },
    books: ["lotr"],
    description:
      "Orodruin, the fire-mountain where the One Ring was forged and finally destroyed.",
  },
];

export const events: StoryEvent[] = [
  {
    id: "unexpected-party",
    title: "An Unexpected Party",
    type: "quest",
    placeId: "hobbiton",
    chronology: "The Hobbit, Chapter 1",
    books: ["hobbit"],
    description:
      "Gandalf and thirteen dwarves arrive at Bag End and draw Bilbo into the Quest for Erebor.",
  },
  {
    id: "troll-encounter",
    title: "The Troll Encounter",
    type: "encounter",
    placeId: "trollshaws",
    chronology: "The Hobbit, Chapter 2",
    books: ["hobbit"],
    description:
      "Bilbo and the dwarves are captured by trolls before Gandalf delays them until sunrise.",
  },
  {
    id: "riddles-dark",
    title: "Riddles in the Dark",
    type: "encounter",
    placeId: "goblin-town",
    chronology: "The Hobbit, Chapter 5",
    books: ["hobbit"],
    description:
      "Bilbo meets Gollum beneath the mountains and finds the Ring.",
  },
  {
    id: "battle-five-armies",
    title: "Battle of Five Armies",
    type: "battle",
    placeId: "erebor",
    chronology: "The Hobbit, Chapter 17",
    books: ["hobbit"],
    description:
      "Dwarves, elves, men, goblins, and wargs clash at the Lonely Mountain.",
  },
  {
    id: "council-elrond",
    title: "Council of Elrond",
    type: "council",
    placeId: "rivendell",
    chronology: "The Fellowship of the Ring, Book II",
    books: ["lotr"],
    description:
      "Representatives of the Free Peoples decide that the Ring must be destroyed in Mordor.",
  },
  {
    id: "breaking-fellowship",
    title: "Breaking of the Fellowship",
    type: "quest",
    coordinate: { x: 0.559, y: 0.478 },
    chronology: "The Fellowship of the Ring, Book II",
    books: ["lotr"],
    description:
      "The Fellowship is scattered near Amon Hen, dividing the War of the Ring into many roads.",
  },
  {
    id: "helms-deep-battle",
    title: "Battle of Helm's Deep",
    type: "battle",
    placeId: "helms-deep",
    chronology: "The Two Towers, Book III",
    books: ["lotr"],
    description:
      "Rohan survives the night against Saruman's host at the Hornburg.",
  },
  {
    id: "pelennor-fields",
    title: "Battle of the Pelennor Fields",
    type: "battle",
    placeId: "minas-tirith",
    chronology: "The Return of the King, Book V",
    books: ["lotr"],
    description:
      "Gondor, Rohan, and their allies break the siege of Minas Tirith.",
  },
  {
    id: "shelobs-lair",
    title: "Shelob's Lair",
    type: "encounter",
    coordinate: { x: 0.666, y: 0.625 },
    chronology: "The Two Towers, Book IV",
    books: ["lotr"],
    description:
      "Frodo and Sam enter the pass of Cirith Ungol and are betrayed by Gollum.",
  },
  {
    id: "ring-destroyed",
    title: "The Ring Destroyed",
    type: "quest",
    placeId: "mount-doom",
    chronology: "The Return of the King, Book VI",
    books: ["lotr"],
    description:
      "The One Ring is unmade in the fire of Mount Doom, ending Sauron's power.",
  },
];

export const paths: Path[] = [
  {
    id: "thorin-company",
    name: "Thorin and Company",
    quest: "Quest for Erebor",
    book: "hobbit",
    color: "#d9a441",
    description:
      "Bilbo, Thorin, and the dwarves travel from the Shire to the Lonely Mountain.",
    points: [
      { x: 0.326, y: 0.305 },
      { x: 0.398, y: 0.297 },
      { x: 0.458, y: 0.294 },
      { x: 0.479, y: 0.259 },
      { x: 0.588, y: 0.289 },
      { x: 0.656, y: 0.303 },
      { x: 0.704, y: 0.192 },
      { x: 0.686, y: 0.173 },
    ],
  },
  {
    id: "frodo-sam",
    name: "Frodo & Sam",
    quest: "Quest of the Ring",
    book: "lotr",
    color: "#7fd1ae",
    description:
      "The Ring-bearer and Samwise continue from the Shire through Mordor to Mount Doom.",
    points: [
      { x: 0.326, y: 0.305 },
      { x: 0.458, y: 0.294 },
      { x: 0.5, y: 0.375 },
      { x: 0.548, y: 0.407 },
      { x: 0.559, y: 0.478 },
      { x: 0.641, y: 0.602 },
      { x: 0.666, y: 0.625 },
      { x: 0.686, y: 0.641 },
    ],
  },
  {
    id: "merry-pippin",
    name: "Merry & Pippin",
    quest: "Quest of the Ring",
    book: "lotr",
    color: "#f08a5d",
    description:
      "Merry and Pippin are carried toward Isengard before their road splits into Rohan and Gondor.",
    points: [
      { x: 0.559, y: 0.478 },
      { x: 0.518, y: 0.505 },
      { x: 0.482, y: 0.541 },
      { x: 0.531, y: 0.555 },
      { x: 0.624, y: 0.666 },
    ],
  },
  {
    id: "three-hunters",
    name: "Aragorn, Legolas & Gimli",
    quest: "Quest of the Ring",
    book: "lotr",
    color: "#8fb8ff",
    description:
      "The hunters pursue the Uruk-hai across Rohan and join the defense of the West.",
    points: [
      { x: 0.559, y: 0.478 },
      { x: 0.518, y: 0.505 },
      { x: 0.531, y: 0.555 },
      { x: 0.487, y: 0.581 },
      { x: 0.624, y: 0.666 },
    ],
  },
  {
    id: "gandalf",
    name: "Gandalf the Grey / White",
    quest: "Quest of the Ring",
    book: "lotr",
    color: "#f5f3dc",
    description:
      "Gandalf moves between the Fellowship, Moria, Lothlorien, Rohan, and Gondor.",
    points: [
      { x: 0.458, y: 0.294 },
      { x: 0.5, y: 0.375 },
      { x: 0.548, y: 0.407 },
      { x: 0.531, y: 0.555 },
      { x: 0.487, y: 0.581 },
      { x: 0.624, y: 0.666 },
    ],
  },
];

export const bookLabels: Record<Book, string> = {
  hobbit: "The Hobbit",
  lotr: "The Lord of the Rings",
};

export const categoryLabels: Record<PlaceCategory, string> = {
  hobbits: "Hobbits",
  elves: "Elves",
  dwarves: "Dwarves",
  humans: "Humans",
  evil: "Evil",
  wild: "Wilds",
};

export const eventTypeLabels: Record<EventType, string> = {
  quest: "Quest",
  battle: "Battle",
  encounter: "Encounter",
  council: "Council",
};
