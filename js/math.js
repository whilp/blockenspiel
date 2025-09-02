class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }
    
    subtract(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    
    scale(s) {
        return new Vec2(this.x * s, this.y * s);
    }
}