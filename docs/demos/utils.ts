import { AdditiveBlending, Sprite, SpriteMaterial, TextureLoader } from "three";
import dot from '../assets/dot.png';
export function createSprite(path = dot) {
    const map = new TextureLoader().load(path);
    const material = new SpriteMaterial({
        map: map,
        color: 0xff0000,
        blending: AdditiveBlending,
        fog: true
    });
    return new Sprite(material);
}
