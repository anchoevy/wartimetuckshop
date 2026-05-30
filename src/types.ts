/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  context?: string;
  question: string;
  options: string[];
  map: number[]; // Index into the personalities list (0=Tapioca, 1=Ragi Roti, 2=Lemak, 3=Ikan Bilis)
}

export interface PersonalityResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  imgSrcs: string[];
  traits: string[];
  description: string;
  strength: string;
  weakness: string;
  pairs: string;
  clashes: string;
  fact: string;
}
