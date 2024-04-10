<template>
    <div id="bar-chart-container" class="bar-chart-container"></div>
</template>
 
<script setup lang="ts">
import { onMounted, defineProps } from 'vue';
import * as d3 from 'd3';
import data from "../assets/dataset/ssc_graph.json";
import cveAffectedPackage from "../assets/dataset/cve_affected_packages.json";


const width = 928;
const height = 680;
// const color = d3.scaleOrdinal(d3.schemeCategory10);

const links = data.links.map(d => ({ ...d }));
const nodes = data.nodes.map(d => ({ ...d }));


onMounted(() => {
    drawBarChart(nodes, links);
});

// 获取选择的CVE以展示受影响的package，默认展示全部
const props = defineProps({
  selectedCve: {
    type: String,
    default: () => "notSelected",
  }
})

console.log(props.selectedCve)

let cveDate: {};
if (props.selectedCve != "notSelected") {
    cveDate = cveAffectedPackage[props.selectedCve];
}
console.log(cveDate)

function drawBarChart(nodes: any, links: any) {
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d: { id: any; }) => d.id))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());
    // Create the SVG container.
    const svg = d3.select("#bar-chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1.4);

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5);
        // .attr("fill", d => color(d.group));

    node.attr("fill", (d: { radius: number, id: any; }) => {
        if(d.radius == 0){
            return d3.schemeCategory10[3];
        }
        
        if(props.selectedCve == "notSelected" || typeof(cveDate)!= "undefined" && Object.prototype.hasOwnProperty.call(cveDate, d.id)){
            if(d.radius == 1){
                return d3.schemeCategory10[0];
            }else if(d.radius == 2){
                return d3.schemeCategory10[1];
            }else if(d.radius == 3){
                return d3.schemeCategory10[2];
            }else if(d.radius == 4){
                return d3.schemeCategory10[4];
            }else{
                return d3.schemeCategory10[3];
            }
        }else{
            return d3.schemeCategory10[7];
        }
        
    }); //d3.schemeCategory10[7]是灰色

    node.append("title")
        .text((d: { id: any; }) => d.id);

    // Add a drag behavior.
    node.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Set the position attributes of links and nodes each time the simulation ticks.
    simulation.on("tick", () => {
        link
            .attr("x1", (d: { source: { x: any; }; }) => d.source.x)
            .attr("y1", (d: { source: { y: any; }; }) => d.source.y)
            .attr("x2", (d: { target: { x: any; }; }) => d.target.x)
            .attr("y2", (d: { target: { y: any; }; }) => d.target.y);

        node
            .attr("cx", (d: { x: any; }) => d.x)
            .attr("cy", (d: { y: any; }) => d.y);
    });

    function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
}
</script>

<style>
h1 {
    font-size: medium;
    display: flex;
    align-items: center;
}
.bar-chart-container{
    text-align: center;
}
</style>