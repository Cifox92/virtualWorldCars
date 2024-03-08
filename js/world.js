class World {
    constructor(graph, roadwith = 100, roadRoundness = 3) {
        this.graph = graph
        this.roadwith = roadwith
        this.roadRoundness = roadRoundness

        this.envelopes = []
        this.generate()
    }

    generate() {
        this.envelopes.length = 0
        for(const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, this.roadwith, this.roadRoundness)
            )
        }
    }

    draw(ctx) {
        for(const env of this.envelopes) {
            env.draw(ctx)
        }
    }
}