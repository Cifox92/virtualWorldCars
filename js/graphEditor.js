class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport
        this.canvas = viewport.canvas //The graphEditor needs the information to adjust mouse coordinates properly in #handleMouseMove(e)
        this.graph = graph

        this.ctx = this.canvas.getContext('2d')
        this.selected = null
        this.hovered = null
        this.dragging = false
        this.mouse = null
        
        this.#addEventListeners()
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousedown', this.#handleMouseDown.bind(this))
        this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this))
        this.canvas.addEventListener('contextmenu', e => e.preventDefault()) //Stops right-click pop-up menu from appearing
        this.canvas.addEventListener('mouseup', () => this.dragging = false) //Stops dragging the point
    }

    #handleMouseDown(e) {
        if(e.button === 2) { //Right click
            if(this.selected) {
                this.selected = null
            } else if(this.hovered) {
                this.#removePoint(this.hovered)
            }
        }

        if(e.button === 0) { //Left click
            if(this.hovered) {
                this.#select(this.hovered) //Adds a new segment between two existing points

                this.dragging = true

                return
            }

            this.graph.addPoint(this.mouse)
            this.#select(this.mouse) //Adds a new segment between the last point and the new point

            this.hovered = this.mouse
        }
    }

    #handleMouseMove(e) {
        this.mouse = this.viewport.getMouse(e) 
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom)

        if(this.dragging === true) {
            this.selected.x = this.mouse.x
            this.selected.y = this.mouse.y
        }
    }

    #select(point) {
        if(this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point))
        }

        this.selected = point
    }

    #removePoint(point) {
        this.graph.removePoint(point)
        this.hovered = null
        
        if(this.selected === point) {
            this.selected = null
        }
    }

    display() {
        this.graph.draw(this.ctx)

        if(this.hovered) {
            this.hovered.draw(this.ctx, {fill: true}) //Shows the point you are hovering with a yellow full circle
        }

        if(this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse //This makes the line to "snap" to a point that it's being hovered with the mouse

            new Segment(this.selected, intent).draw(ctx, {dash: [3, 3]}) //Shows a line between the last point and the mouse
            this.selected.draw(this.ctx, {outline: true}) //Shows the point you are selecting with a yellow hollow circle
        }
    }
}