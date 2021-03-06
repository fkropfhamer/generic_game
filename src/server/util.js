export default class Util {
  constructor() {
    throw Error('Util is an abstract class and and cant be initiated');
  }

  static halfIfAnotherKeyIsPressed(key1, key2) {
    if (key1 || key2) {
      return 0.7;
    }
    return 1;
  }

  static deepFreeze(object) {
    const propNames = Object.getOwnPropertyNames(object);

    propNames.forEach((propName) => {
      const value = object[propName];
      object[propName] = value && typeof value === 'object' ? this.deepFreeze(value) : value;
    });

    return Object.freeze(object);
  }

  static mapPlayers(players) {
    return players.map((player) => {
      return {
        x: player.x,
        y: player.y,
        angle: player.angle,
        color: player.color,
        lives: player.lives,
        face: player.face,
        hitAngle: player.hitAngle,
        isShielded: player.isShielded,
        isFrozen: player.isFrozen,
      };
    });
  }

  static pointDistance(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  }

  static rotatePointAroundPoint(p1, p2, angle) {
    const rotatedX = Math.cos(angle) * (p1.x - p2.x) - Math.sin(angle) * (p1.y - p2.y) + p2.x;
    const rotatedY = Math.sin(angle) * (p1.x - p2.x) + Math.cos(angle) * (p1.y - p2.y) + p2.y;

    return { x: rotatedX, y: rotatedY };
  }

  static calculateCornerPoints(rect) {
    const a = {
      x: rect.x - rect.width / 2,
      y: rect.y - rect.height / 2,
    };

    const b = {
      x: rect.x + rect.width / 2,
      y: rect.y - rect.height / 2,
    };

    const c = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    };

    const d = {
      x: rect.x - rect.width / 2,
      y: rect.y + rect.height / 2,
    };

    return {
      a,
      b,
      c,
      d,
    };
  }

  static getClosestPointFromLine(p, a, b) {
    const ap = { x: p.x - a.x, y: p.y - a.y };
    const ab = { x: b.x - a.x, y: b.y - a.y };

    const atb2 = ab.x ** 2 + ab.y ** 2;

    const apDotab = ap.x * ab.x + ap.y * ab.y;

    const t = apDotab / atb2;

    let x = a.x + ab.x * t;
    let y = a.y + ab.y * t;

    if (x > a.x && x > b.x) {
      x = Math.max(a.x, b.x);
    }

    if (x < a.x && x < b.x) {
      x = Math.min(a.x, b.x);
    }

    if (y > a.y && y > b.y) {
      y = Math.max(a.y, b.y);
    }

    if (y < a.y && y < b.y) {
      y = Math.min(a.y, b.y);
    }

    return { x, y };
  }

  static collisionOfRectWithCircleWithoutAngle(rect, circle) {
    const corners = this.calculateCornerPoints(rect);
    const isInConstraintY = circle.y >= corners.a.y && circle.y <= corners.d.y;
    const isInConstraintX = circle.x >= corners.a.x && circle.x <= corners.b.x;

    return isInConstraintX && isInConstraintY;
  }

  static collisionOfRectWithCircle(rect, circle) {
    const corners = this.calculateCornerPoints(rect);

    const rotatedA = this.rotatePointAroundPoint(corners.a, rect, rect.angle);
    const rotatedB = this.rotatePointAroundPoint(corners.b, rect, rect.angle);
    const rotatedC = this.rotatePointAroundPoint(corners.c, rect, rect.angle);
    const rotatedD = this.rotatePointAroundPoint(corners.d, rect, rect.angle);

    const closestAB = this.getClosestPointFromLine(circle, rotatedA, rotatedB);
    const closestBC = this.getClosestPointFromLine(circle, rotatedB, rotatedC);
    const closestCD = this.getClosestPointFromLine(circle, rotatedC, rotatedD);
    const closestDA = this.getClosestPointFromLine(circle, rotatedD, rotatedA);

    const distanceAB = this.pointDistance(closestAB, circle);
    const distanceBC = this.pointDistance(closestBC, circle);
    const distanceCD = this.pointDistance(closestCD, circle);
    const distanceDA = this.pointDistance(closestDA, circle);

    if (distanceAB < circle.radius) {
      return { angle: 1.5 * Math.PI, dis: distanceAB };
    }

    if (distanceBC < circle.radius) {
      return { angle: 0, dis: distanceBC };
    }

    if (distanceCD < circle.radius) {
      return { angle: Math.PI / 2, dis: distanceCD };
    }

    if (distanceDA < circle.radius) {
      return { angle: Math.PI, dis: distanceDA };
    }

    return false;
  }

  static collisionOfCircleWithCircle(circle1, circle2) {
    const distance = this.pointDistance(circle1, circle2);
    if (distance <= circle1.radius + circle2.radius) {
      return true;
    }
    return false;
  }

  static radiusMinusDiameterOfCircle(radius1, radius2) {
    return radius1 - 2 * radius2;
  }
}
