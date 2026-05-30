/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, PersonalityResult } from './types';

export const LOGO_PATH = "/src/assets/images/logo.png";

export const quizData: Question[] = [
  {
    question: "When you have a completely free weekend ahead, how do you prefer to spend it?",
    options: [
      "Enjoying quiet time on my own to recharge, read, or rest.",
      "Gathering friends or family to do something active and fun together."
    ],
    map: [0, 1] // Choice A -> Tapioca (0), Choice B -> Ragi Roti (1)
  },
  {
    question: "How do you prefer to style or organize your personal living space?",
    options: [
      "I love decorating my space with creative and beautiful items. The more the better!",
      "I default to simplicity and utility. Less is more."
    ],
    map: [2, 3] // Choice A -> Lemak (2), Choice B -> Ikan Bilis (3)
  },
  {
    question: "In a group of close friends, what sort of speaker are you?",
    options: [
      "I'll initiate conversations, and talk about anything that comes to mind!",
      "I prefer listening to what others have to say, and only chime in occasionally."
    ],
    map: [0, 3] // Choice A -> Tapioca (0), Choice B -> Ikan Bilis (3)
  },
  {
    question: "When you attend a celebratory event, where do you find your comfort?",
    options: [
      "Mingling with new people and different groups, making sure everyone is happy.",
      "Having smaller conversations, or helping the host set up a cozy ambience."
    ],
    map: [1, 2] // Choice A -> Ragi Roti (1), Choice B -> Lemak (2)
  },
  {
    question: "If you want to pick up a brand-new hobby, how do you usually start?",
    options: [
      "Dive right into learning through hands-on experience and trial-and-error.",
      "Find a guide or watch inspiration videos first."
    ],
    map: [0, 2] // Choice A -> Tapioca (0), Choice B -> Lemak (2)
  },
  {
    question: "When someone you care about is having a difficult day, what is your default support style?",
    options: [
      "Listening attentively, making sure they feel loved and less alone.",
      "Offering structured, practical advice and providing solutions."
    ],
    map: [1, 3] // Choice A -> Ragi Roti (1), Choice B -> Ikan Bilis (3)
  },
  {
    question: "You've planned some outdoor activities, but it suddenly starts raining. What do you do?",
    options: [
      "Shrug it off and stay home. There's always another day.",
      "Go out anyway, and find something else to do."
    ],
    map: [0, 3] // Choice A -> Tapioca (0), Choice B -> Ikan Bilis (3)
  },
  {
    question: "Would you rather live in the city or in the countryside?",
    options: [
      "City. I like the convenience and the urban lifestyle",
      "Countryside. I prefer the slower pace of life."
    ],
    map: [1, 2] // Choice A -> Ragi Roti (1), Choice B -> Lemak (2)
  }
];

export const personalities: PersonalityResult[] = [
  {
    id: "tapioca",
    name: "Tapioca",
    emoji: "🌱",
    color: "#5c3310",
    imgSrcs: ["/src/assets/images/tapioca.png", "/src/assets/images/tapioca_1.png"],
    traits: ["Adaptable", "Resilient", "Self-sufficient"],
    description: "You are driven by a quiet, unyielding core that focuses on practical progress under pressure.",
    strength: "You possess high resilience and are capable of functioning independently in unpredictable, low-resource settings.",
    weakness: "Your habit of managing challenges on your own can sometimes prevent you from reaching out for support.",
    pairs: "Ikan Bilis",
    clashes: "Ragi Roti",
    fact: "During WWII, tapioca replaced staples like rice, becoming the dominant crop in Singapore. It grew well in various soil conditions, and its leaves were also edible."
  },
  {
    id: "ragi-roti",
    name: "Ragi Roti",
    emoji: "🫓",
    color: "#8b4513",
    imgSrcs: ["/src/assets/images/ragi roti.png"],
    traits: ["Generous", "Loyal", "Communal"],
    description: "Your personality is anchored in empathy and group cooperation. For you, teamwork makes the dream work.",
    strength: "You naturally coordinate groups and bring people together. You can be relied upon to help others.",
    weakness: "You give so generously of your personal energy that you may sometimes forget to take care of yourself.",
    pairs: "Lemak Kangkong & Sweet Potatoes",
    clashes: "Tapioca",
    fact: "Ragi (finger millet) was also another staple during the war. It was often used to make breads or porridge."
  },
  {
    id: "lemak",
    name: "Lemak Kangkong & Sweet Potatoes",
    emoji: "🥬",
    color: "#2a5c34",
    imgSrcs: ["/src/assets/images/kangkong.png", "/src/assets/images/kangkong_1.png"],
    traits: ["Inventive", "Caring", "Thoughtful"],
    description: "You believe that a touch of care, formatting, and quality matters, especially when surroundings are bleak.",
    strength: "You bring beauty, perspective, and genuine warmth to difficult environments, lifting the spirits of those around you.",
    weakness: "You invest deep emotional commitment into your work, sometimes to your own detriment.",
    pairs: "Ragi Roti",
    clashes: "Ikan Bilis",
    fact: "During the occupation, crops like kangkong and sweet potaotes were grown at home and in schools. Coconut was a key ingredient which flavoured many dishes, especially in Malay and Peranakan cuisine."
  },
  {
    id: "ikan-bilis",
    name: "Ikan Bilis",
    emoji: "🐟",
    color: "#1e3d5c",
    imgSrcs: ["/src/assets/images/ikan bilis.png", "/src/assets/images/ikan bilis_1.png"],
    traits: ["Disciplined", "Measured", "Farsighted"],
    description: "You value organization, structure, and foresight, preparing cleanly for complications before they occur.",
    strength: "You plan with clarity and are ready for many situations. You always have a backup plan.",
    weakness: "Your preference for strictly realistic, organized solutions can sometimes be perceived as emotionally guarded.",
    pairs: "Tapioca",
    clashes: "Lemak Kangkong & Sweet Potatoes",
    fact: "Coastal communities often caught fish and salted them for preservation. Ikan bilis could be fried or used in soup stock, making it a versatile ingredient in wartime cooking."
  },
  {
    id: "wartime-rojak",
    name: "Wartime Rojak",
    emoji: "🍍",
    color: "#7a4a1e",
    imgSrcs: ["/src/assets/images/rojak.png"],
    traits: ["Creative", "Versatile", "Inclusive"],
    description: "You correspond to a balanced mix of multiple traits, which designates you as the Wartime Rojak, a creative and unique dish",
    strength: "You think creatively and are a jack of all trades. You work easily with diverse groups of people.",
    weakness: "Because you can fulfill many different roles, you occasionally find it challenging to settle on a single path.",
    pairs: "Everyone",
    clashes: "No one",
    fact: "Interestingly developed by British prisoners of war, the wartime rojak bears a curious mix of vegetables such as beetroot and cucumber, mixed with an untraditional rojak sauce of potatoes and tomatoes."
  }
];
