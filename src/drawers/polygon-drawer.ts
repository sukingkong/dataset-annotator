import {Drawer} from "./drawer";
import {CoordinatesObject} from "../objects/CoordinatesObject";
import {AnnotationsProvider, Polygon} from "../providers/annotations/annotations";

export class PolygonDrawer extends Drawer{
    private polygons: Polygon[];

    private points: CoordinatesObject[] = []; // currently drawing polygon's points

    constructor(context: CanvasRenderingContext2D,
                annotationsProvider: AnnotationsProvider){
        super(context, annotationsProvider);
        this.polygons = annotationsProvider.getPolygons();
    }

    drawFromCoordinates(start: CoordinatesObject, mouse: CoordinatesObject) {

        for (let i = 0; i < this.points.length; i++){
            let color = i === 0 ? 'white' : Drawer.DEFAULT_COLOR;
            if (this.points[i+1]) {
                super.drawCircle(this.points[i], color);
                super.drawLine(this.points[i], this.points[i+1]);
            }
            else {
                super.drawCircle(this.points[i], color);
                super.drawLine(this.points[i], mouse);
            }
        }


    }

    drawPolygon(polygon: Polygon) {
        let color = polygon === Drawer.getSelectedElement() ? Drawer.SELECTED_COLOR : Drawer.DEFAULT_COLOR;
        for (let i = 0; i < polygon.coordinates.length; i++){
            if (polygon.coordinates[i+1]) {
                super.drawCircle(polygon.coordinates[i], color);
                super.drawLine(polygon.coordinates[i], polygon.coordinates[i+1], color);
            }
        }
    }

    addPoint(point: CoordinatesObject){
        this.points.push(point);
    }

    isHovering(coordinates: CoordinatesObject) {
        for (let polygon of this.polygons.concat(new Polygon(this.points))) {
            if (PolygonDrawer.isNearCoordinates(polygon, coordinates)) {
                return true;
            }
        }
        return false;
    }

    render() {
        for(let polygon of this.polygons){
            this.drawPolygon(polygon);
        }
    }

    saveFromCoordinates(...coordinates: CoordinatesObject[]) {
        if (coordinates.length > 3) {
            this.getAnnotationsProvider().addPolygon(new Polygon(
                coordinates
            ));
        }
        this.points = [];
    }

    selectElement(coordinates: CoordinatesObject): boolean {
        for (let polygon of this.polygons) {
            if (PolygonDrawer.isNearCoordinates(polygon, coordinates)) {
                Drawer.setSelectedElement(polygon);
                return true;
            }
        }
        return false;
    }

    static isNearCoordinates(polygon: Polygon, coords: CoordinatesObject) {
        for (let point of polygon.coordinates) {
            if (Drawer.computeDistance(point, coords) < Drawer.POINT_RADIUS) {
                return true;
            }
        }
        return false;
    }

    isNearStartPoint(mouse: CoordinatesObject): boolean{
        return this.points[0] && Drawer.computeDistance(this.points[0], mouse) <= Drawer.POINT_RADIUS;

    }

    getPoints() {
        return this.points;
    }


}