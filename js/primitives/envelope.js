class Envelope {
    constructor(skeleton, width, roundness = 1) {
        this.skeleton = skeleton
        this.poly = this.#generatePolygon(width, roundness)
    }

    #generatePolygon(width, roundness) {
        const {p1, p2} = this.skeleton
        const radius = width / 2
        const alpha = angle(substract(p1, p2)) //Angle between p1 and p2 of the segment
        const alpha_cw = alpha + Math.PI / 2 //Angle offset by 90 degrees (clockwise)
        const alpha_ccw = alpha - Math.PI / 2 //Angle offset by 90 degrees (counterclockwise)

        //In order to make the endings of the road curved, we need to do this loop
        const points = []
        const step = Math.PI / Math.max(1, roundness)
        const eps = step / 2

        for(let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
            points.push(translate(p1, i, radius))
        }

        for(let i = alpha_ccw; i <= alpha_cw + eps; i += step) {
            points.push(translate(p2, Math.PI + i, radius))
        }

        return new Polygon(points)
    }

    draw(ctx, options) {
        this.poly.draw(ctx, options)
    }
}