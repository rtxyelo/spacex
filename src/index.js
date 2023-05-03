import {SpaceX} from "./api/spacex";
import * as d3 from "d3";
import * as Geo from './geo.json'
import {SpacexLaunchpads} from './launchPoint'

let svgMap
let launchpads
let currentLaunchpad
let projection
document.addEventListener("DOMContentLoaded", setup)

function setup() {
    projection = drawMap();
    const spaceX = new SpaceX();
    spaceX.launches().then(data => {
        const listContainer = document.getElementById("listContainer")
        RenderLaunches(data, listContainer);

    })
    spaceX.launchpads().then(data => {
        launchpads = new SpacexLaunchpads(data)
        drawPoints()
    })
}

function RenderLaunches(launches, container) {

    const list = document.createElement("ul");

    launches.forEach(launch => {
        const item = document.createElement("li");
        item.innerHTML = launch.name;
        initItemListener(item, launch.launchpad)
        list.appendChild(item);
    })
    container.replaceChildren(list);

    function initItemListener(item, launchpadId) {
        item.addEventListener("mouseover",function() {
            this.style.backgroundColor = "gray";
            showPoint(launchpadId)
        })

        item.addEventListener("mouseout",function() {
            this.style.backgroundColor = "white";
            hidePoint()
        })
    }
}

function drawMap() {
    const width = 1280;
    const height = 720;
    const margin = {top: 100, right: 10, bottom: 40, left: 0};
    svgMap = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    const projection = d3.geoMercator()
        .scale(120)
        .center([0, 20])
        .translate([width / 2 - margin.left, height / 2]);

    drawWorld(projection)
    return projection
}

function drawWorld(projection) {
    svgMap
        .selectAll("path")
        .data(Geo.features)
        .enter()
        .append("path")
        .attr("class", "topo")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", "#1f8d16")
}

function showPoint(id) {
    currentLaunchpad = new SpacexLaunchpads(launchpads,id)
    if (currentLaunchpad.features[0]===undefined) return
    svgMap
        .selectAll("points")
        .data(currentLaunchpad.features)
        .enter()
        .append("path")
        .attr("class", "tot")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", "#ffb627")
}
function hidePoint(){
    svgMap
        .selectAll("points")
        .data(currentLaunchpad.features)
        .enter()
        .append("path")
        .attr("class", "tot")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", "#ff0000")
    currentLaunchpad=undefined
}

function drawPoints() {
    svgMap
        .selectAll("points")
        .data(launchpads.features)
        .enter()
        .append("path")
        .attr("class", "top")
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", "#ff0000")
}