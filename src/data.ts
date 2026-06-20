/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, PersonalityResult } from './types';

// Import images statically using ES modules so Vite bundles them properly
import logoImg from './assets/images/logo.png';
import tapiocaImg from './assets/images/tapioca.png';
import tapioca2Img from './assets/images/tapioca (2).png';
import ragiRotiImg from './assets/images/ragi_roti.png';
import kangkongImg from './assets/images/kangkong.png';
import kangkong2Img from './assets/images/kangkong (2).png';
import ikanBilisImg from './assets/images/ikan_bilis.png';
import ikanBilis2Img from './assets/images/ikan_bilis (2).png';
import rojakImg from './assets/images/rojak.png';

export const LOGO_PATH = logoImg;

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
      "City. I like the convenience and the urban lifestyle.",
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
    imgSrcs: [tapiocaImg, tapioca2Img],
    traits: ["Adaptable", "Resilient", "Self-sufficient"],
    description: "You are driven by a quiet and unyielding spirit that focuses on practical progress under pressure.",
    strength: "High resilience; excels at working independently under pressure.",
    weakness: "Reluctance to ask for help when managing tough situations.",
    pairs: "Ikan Bilis",
    clashes: "Ragi Roti",
    fact: "During WWII, tapioca replaced staples like rice, becoming the dominant crop in Singapore. It grew well in various soil conditions, and its leaves were also edible."
  },
  {
    id: "ragi-roti",
    name: "Ragi Roti",
    emoji: "🫓",
    color: "#8b4513",
    imgSrcs: [ragiRotiImg],
    traits: ["Generous", "Loyal", "Communal"],
    description: "Your personality is anchored in empathy and group cooperation. For you, teamwork makes the dream work.",
    strength: "Excellent at coordinating teams and uniting groups with empathy.",
    weakness: "May neglect your own needs due to generous support of others.",
    pairs: "Lemak Kangkong & Sweet Potatoes",
    clashes: "Tapioca",
    fact: "Ragi (finger millet) was also another staple during the war. It was often used to make breads or porridge."
  },
  {
    id: "lemak",
    name: "Lemak Kangkong & Sweet Potatoes",
    emoji: "🥬",
    color: "#2a5c34",
    imgSrcs: [kangkongImg, kangkong2Img],
    traits: ["Inventive", "Caring", "Thoughtful"],
    description: "You believe that a touch of care, support, and quality matters, especially when surroundings are bleak.",
    strength: "Uplifts spirits by bringing beauty and warmth to tough situations.",
    weakness: "Deep emotional investment can lead to personal exhaustion.",
    pairs: "Ragi Roti",
    clashes: "Ikan Bilis",
    fact: "During the occupation, crops like kangkong and sweet potaotes were grown at home and in schools. Coconut was a key ingredient which flavoured many dishes, especially in Malay and Peranakan cuisine."
  },
  {
    id: "ikan-bilis",
    name: "Ikan Bilis",
    emoji: "🐟",
    color: "#1e3d5c",
    imgSrcs: [ikanBilisImg, ikanBilis2Img],
    traits: ["Disciplined", "Measured", "Farsighted"],
    description: "You value organization, structure, and foresight, preparing for complications before they occur.",
    strength: "Pragmatic planning with clear backup options for any hurdle.",
    weakness: "Highly realistic approach may seem emotionally reserved.",
    pairs: "Tapioca",
    clashes: "Lemak Kangkong & Sweet Potatoes",
    fact: "Coastal communities often caught fish and salted them for preservation. Ikan bilis could be fried or used in soup stock, making it a versatile ingredient in wartime cooking."
  },
  {
    id: "wartime-rojak",
    name: "Wartime Rojak",
    emoji: "🍍",
    color: "#7a4a1e",
    imgSrcs: [rojakImg],
    traits: ["Creative", "Versatile", "Inclusive"],
    description: "You correspond to a balanced mix of multiple traits,\nmaking you unique.",
    strength: "Creative, versatile, and excellent at collaborating with diverse groups.",
    weakness: "Can find it challenging to focus and settle on a single path.",
    pairs: "Everyone",
    clashes: "No one",
    fact: "Interestingly developed by British prisoners of war, the wartime rojak bears a curious mix of vegetables such as beetroot and cucumber, mixed with an untraditional rojak sauce of potatoes and tomatoes."
  }
];
