import { Element, Combination, elements, predefinedCombinations } from "../data/elements";

// Get a random item from an array
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a random combination from two elements
export const generateRandomCombination = (): Combination => {
  // First, randomly decide if we should use a predefined combination
  const usePredefined = Math.random() < 0.4; // 40% chance to use predefined
  
  if (usePredefined && predefinedCombinations.length > 0) {
    return getRandomItem(predefinedCombinations);
  }
  
  // Otherwise generate a random combination
  const availableElements = [...elements];
  
  // Get first random element
  const element1Index = Math.floor(Math.random() * availableElements.length);
  const element1 = availableElements[element1Index];
  
  // Remove the first element to avoid duplicates
  availableElements.splice(element1Index, 1);
  
  // Get second random element
  const element2 = getRandomItem(availableElements);
  
  // Generate a combined name
  const name = element1.name.charAt(0) + element2.name;
  
  return {
    id: `random-${element1.id}-${element2.id}`,
    name,
    description: `${element1.name}和${element2.name}的奇妙组合`,
    element1,
    element2,
    emoji: `${element1.emoji}${element2.emoji}`,
  };
};

// Create particles for box opening animation
export const createParticles = (container: HTMLElement, count: number = 20) => {
  // Remove existing particles
  const existingParticles = container.querySelectorAll('.particle');
  existingParticles.forEach(p => p.remove());

  // Create new particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.width = `${Math.random() * 10 + 5}px`;
    particle.style.height = particle.style.width;
    
    // Random position
    const xPos = 50 + (Math.random() - 0.5) * 60; // center ±30%
    const yPos = 50 + (Math.random() - 0.5) * 60;
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;
    
    // Random color
    const colors = ['#9b87f5', '#F97316', '#0EA5E9', '#FFDEE2'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random direction
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
    
    container.appendChild(particle);
  }
};
