export class SpacexLaunchpads {
    constructor(array, id) {
        this.features = []
        if (id !== undefined) {
            this.features.push(this.findLaunchPoint(array,id))
        } else
            for (let i = 0; i < array.length; i++) {
                this.features.push(new LaunchPoint(array[i]))
            }
    }

    findLaunchPoint(array, id){
        for (let i = 0; i < array.features.length; i++) {
            if (array.features[i].id===id) return array.features[i]
        }
    }

}

export class LaunchPoint {
    constructor(object) {
        this.type = "Feature"
        this.geometry = new Geometry(object.longitude, object.latitude)
        this.id = object.id
    }

}

export class Geometry {
    constructor(latitude, longitude) {
        this.type = "Point"
        this.coordinates = [latitude, longitude]
    }
}