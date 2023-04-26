export const ROAD_MAP_DATA: RoadMapData[] = [
  {
    key: '1',
    content: [
      {
        type: 'content-box',
        text: `“The year is 2023.
        3200 brave recruits just embarked on their journey as Passengers.
        They are now ready to join the Colonel and crew on their mission.”`,
      },
      {
        type: 'sub-title',
        text: `First, you must enter “The Hub”`,
      },
      {
        type: 'body',
        text: `An exclusive wing of Nova Space Station, only accessible by Passengers. The HUB is where the bravest and strongest specialists in the universe strategize and prepare for their missions.`,
      },
      {
        type: 'sub-title',
        text: `It is here you will meet S.A.M`,
      },
      {
        type: 'body',
        text: `our AI system integrated into every Passenger. Throughout this journey you’ll be able to access SAM and communicate with her as we fully upgrade her software, first by text inside the HUB and then she will be voice activated in your dashboard until she becomes fully online inside Nova Station.`,
      },
      {
        type: 'body',
        text: `Passengers are fearless, but strength is not built overnight. Everything we do, we do it right.`,
      },
      {
        type: 'body',
        text: `Will you answer the call?`,
      },
      {
        type: 'body',
        text: `Your journey is written in the cosmos…`,
      },
      {
        type: 'body',
        text: `//Inventio. Prosperitas. Canones.//`,
      },
      {
        type: 'separator',
      },
      {
        type: 'title',
        text: 'Hibernal Solstice',
      },
    ],
  },
  {
    key: '2',
    title: 'tactical supply drop (TSC)',
    date: 'jan 2023',
    content: [
      {
        type: 'body',
        text: `//Mission//
Tactical upgrades, rewarding holders and allowing Passengers to upgrade their gear, traits,and metadata.

//Blueprint//
2 weeks Post mint, a snapshot will be taken at an undisclosed time. Airdropped for each single passenger, it will feature individual equip-able items for your Passenger NFT which will then take on those attributes. Your package will contain a Weapon, Jetpack, Space Kit, and a special item... Trait swapping will happen at the ‘Workbench’ (website portal), and will update and upgrade the visual
  
traits and metadata of your Passenger. All the items you unlock including what you originally minted with your passenger, can be traded on secondary markets. And if you wish to decide to keep your package unrevealed for the speculator, you may do so. 2 weeks post snapshot, the TSD will be sent to every holder and wouldn’t need claiming. *Unlocking to reveal your items will take place in Feb/March in your new dashboard hub wallet.`,
      },
    ],
  },
  {
    key: '3',
    title: 'dashboard',
    date: 'feb/mar 2023',
    content: [
      {
        type: 'body',
        text: `//Mission// 
A new way to view your Passenger and earn badges.
        
//Blueprint// 
This will be your new home. A barracks for your Passenger. The Hub will only be accessible to holders and will feature tools to craft your Passenger’s identity by earning badges that lay claim to respect and camaraderie within Nova Station.`,
      },
      {
        type: 'separator',
      },
      {
        type: 'title',
        text: 'Vernal Equinox',
      },
    ],
  },
//   {
//     key: '4',
//     date: 'mar 2023',
//     title: 'PASSENGERS AT NFT.LA',
//     content: [
//       {
//         type: 'body',
//         text: `//Mission//
// We’re going big to celebrate a successful launch and expand our reach beyond a purely digital experience. An epic event in LA as well as satellite meetups around the globe. Let’s connect and prosper together.

// //Blueprint//
// An event to be spoken of across the galaxies. We will amplify and magnify our development and creative experience via hosting an event that will take over the NFT space and transcend your senses with the mysteries of the universe. All Passenger holders are welcome, including guests.

// Beyond that, Passengers will honor its status as a global brand built around unity and allow trusted community members who can’t attend to host satellite meetups around the globe, with a smaller budget provided. `,
//       },
//     ],
//   },
  {
    key: '5',
    date: 'apr 2023',
    title: 'PASSENGERS MERCH',
    content: [
      {
        type: 'body',
        text: `//Mission//
Exclusive fashion fit for a paradigm shift in space and time.

//Blueprint//
We’re pushing the boundaries of what fashion can mean and represent for an NFT community. Think unexpected. Right before NFT NYC, All Passengers will get one free item of their choosing.`,
      },
      {
        type: 'separator',
      },
      {
        type: 'title',
        text: 'Estival Solstice',
      },
    ],
  },
//   {
//     key: '5',
//     date: 'may 2023',
//     title: 'PASSENGERS AT NFT NYC',
//     content: [
//       {
//         type: 'body',
//         text: `//Mission//
// Zoom in, look closer.

// //Blueprint//
// The meaning of 3D art in the metaverse will change when our 4K quality is brought to life in a Redeploy Studios production that challenges every boundary in the decentralized brand building space. Included will be an early cinematic of the game that can showcase how our team’s experience, talent, and capabilities are like no other.`,
//       },
//       {
//         type: 'separator',
//       },
//       {
//         type: 'title',
//         text: 'Estival Solstice',
//       },
//     ],
//   },
  {
    key: '6',
    date: 'TBA',
    title: 'SHORTFILM',
    content: [
      {
        type: 'body',
        text: `//Mission// 
The Passengers short film hits the big screen.

//Blueprint// 
An Emmy-Worthy short film that marks the beginning of Passengers becoming the most valuable IP in Web3. This short film is focused on building our brand by capturing the hearts and minds of web2 eyes. Passengers is for everyone—kids, adults and space lovers alike.`,
      },
    ],
  },
  {
    key: '7',
    date: 'TBA',
    title: 'GET READY TO PLAY',
    content: [
      {
        type: 'body',
        text: `//Mission//
The first demo for the Passengers game will be released.

//Blueprint// 
Holders will get early access to play as their Passenger and unlock value through traits, lore, and experiences.`,
      },
      {
        type: 'separator',
      },
    ],
  },
  {
    key: '8',
    content: [
      {
        type: 'body',
        text: ` Much more will be revealed over time. Trust the process and experience the journey.
        
And one more thing… a Passenger never travels alone. Crews are formed with all six factions, so whether you plan to collect all on your own, or to form an alliance with your fellow heroes, you’re going to want a full squad aboard Nova Station.`,
      },
    ],
  },
];

export interface RoadMapData {
  key: string;
  title?: string; 
  date?: string;
  content: RoadMapContentData[];
}

type RoadMapContentType = 'title' | 'body' | 'separator' | 'content-box' | 'sub-title';
export interface RoadMapContentData {
  type: RoadMapContentType;
  text?: string;
}
