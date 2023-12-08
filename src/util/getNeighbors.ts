import { Vec3 } from 'vec3';

export function getNeighbors(pos: Vec3) {
  return [
    pos.offset(1, 0, 0),
    pos.offset(-1, 0, 0),
    pos.offset(0, 1, 0),
    pos.offset(0, -1, 0),
    pos.offset(0, 0, 1),
    pos.offset(0, 0, -1),
  ];
}
