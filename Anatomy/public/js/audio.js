let context;
export function playTone(type = "tick", muted = false) {
  if (muted || !(window.AudioContext || window.webkitAudioContext)) return;
  context ??= new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator(); const gain = context.createGain();
  const settings = { tick: [420,.035], correct: [680,.16], incorrect: [180,.16], zoom: [520,.08] }[type] ?? [420,.05];
  oscillator.frequency.value = settings[0]; oscillator.type = type === "correct" ? "sine" : "triangle"; gain.gain.setValueAtTime(.0001, context.currentTime); gain.gain.exponentialRampToValueAtTime(.08, context.currentTime + .01); gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + settings[1]);
  oscillator.connect(gain).connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + settings[1] + .02);
}
