"use strict";
class AudioResource {
    constructor(key, volume, path) {
        this.key = key;
        this.volume = volume;
        this.audio = new Audio(path);
        this.audio.volume = this.volume;
    }
    Play() {
        this.audio.currentTime = 0;
        if (this.volume)
            this.audio.play();
    }
}
const AudioResources = [
    new AudioResource('hover0', 0.65, './resources/sounds/cards-hover0.mp3'),
    new AudioResource('hover1', 0.55, './resources/sounds/cards-hover1.mp3'),
    new AudioResource('shuffle', 1, './resources/sounds/cards-shuffle.mp3'),
    new AudioResource('start', 0.6, './resources/sounds/cards-start.mp3'),
    new AudioResource('appear', 0.35, './resources/sounds/cards-appear.mp3'),
    new AudioResource('moving', 0.7, './resources/sounds/cards-moving.mp3'),
    new AudioResource('sweep0', 0.7, './resources/sounds/cards-sweep0.mp3'),
    new AudioResource('sweep1', 0.55, './resources/sounds/cards-sweep1.mp3'),
    new AudioResource('trump', 0.5, './resources/sounds/cards-trump.mp3'),
    new AudioResource('placed0', 0.2, './resources/sounds/cards-placed0.mp3'),
    new AudioResource('placed1', 0.5, './resources/sounds/cards-placed1.mp3'),
    new AudioResource('placed2', 0.5, './resources/sounds/cards-placed2.mp3'),
    new AudioResource('placed3', 0.5, './resources/sounds/cards-placed3.mp3'),
    new AudioResource('placed4', 0.5, './resources/sounds/cards-placed4.mp3'),
    new AudioResource('placed5', 0.5, './resources/sounds/cards-placed5.mp3'),
    new AudioResource('placed6', 0.5, './resources/sounds/cards-placed6.mp3'),
    new AudioResource('placed7', 0.5, './resources/sounds/cards-placed7.mp3'),
    new AudioResource('placed8', 0.5, './resources/sounds/cards-placed8.mp3'),
    new AudioResource('shoved0', 0.5, './resources/sounds/cards-shoved0.mp3'),
    new AudioResource('shoved1', 0.5, './resources/sounds/cards-shoved1.mp3'),
    new AudioResource('shoved2', 0.5, './resources/sounds/cards-shoved2.mp3'),
    new AudioResource('shoved3', 0.5, './resources/sounds/cards-shoved3.mp3'),
    new AudioResource('win', 0.5, './resources/sounds/cards-win.mp3'),
    new AudioResource('lose', 0.35, './resources/sounds/cards-lose.mp3'),
    new AudioResource('alert', 0.06, './resources/sounds/cards-alert.mp3')
];
class AudioManager {
    constructor() {
        this.Audios = [];
        this.SoundsToggle = false;
        for (const Audio of AudioResources) {
            this.Audios.push(Audio);
        }
    }
    Play(key) {
        var _a, _b, _c, _d, _e;
        if (this.SoundsToggle) {
            if (key === 'hover') {
                (_a = this.Audios.find(x => x.key === `hover${Math.floor(Math.random() * 2)}`)) === null || _a === void 0 ? void 0 : _a.Play();
            }
            else if (key === 'sweep') {
                (_b = this.Audios.find(x => x.key === `sweep${Math.floor(Math.random() * 2)}`)) === null || _b === void 0 ? void 0 : _b.Play();
            }
            else if (key === 'placed') {
                let index = Math.floor(Math.random() * this.Audios.filter(x => x.key.includes('placed')).length);
                // console.log(index!);
                (_c = this.Audios.find(x => x.key === `placed${index}`)) === null || _c === void 0 ? void 0 : _c.Play();
            }
            else if (key === 'shoved') {
                let index = Math.floor(Math.random() * this.Audios.filter(x => x.key.includes('shoved')).length);
                // console.log(index!);
                (_d = this.Audios.find(x => x.key === `shoved${index}`)) === null || _d === void 0 ? void 0 : _d.Play();
            }
            else {
                (_e = this.Audios.find(x => x.key === key)) === null || _e === void 0 ? void 0 : _e.Play();
            }
        }
    }
    Toggle() {
        return this.SoundsToggle = !this.SoundsToggle;
    }
}
