/* DATA
starting from an object describing the possible categories and matching colors
the idea is to fabricate an array of data points with random personality and attitude values
*/
const legend = [
  {
    name: 'Purple',
    color: 'hsl(259, 48%, 55%)',
  },
  {
    name: 'Green',
    color: 'hsl(137, 68%, 61%)',
  },
  {
    name: 'Yellow',
    color: 'hsl(57, 96%, 64%)',
  },
  {
    name: 'Orange',
    color: 'hsl(0, 99%, 71%)',
  },
];

// utility functions
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

// minimum and maximum values for the personality and user attitude
const personalitys = {
  min: 10,
  max: 40,
};
const attitudes = {
  min: 10,
  max: 40,
};

// function called to fabricate random data points
const randomDataPoint = () => {
  // compute a random personality and attitude
  const personality = randomBetween(personalitys.min, personalitys.max);
  const attitude = randomBetween(attitudes.min, attitudes.max);

  // call the function once more if the data point were to be located in the bottom right corner of the viz
  // this to avoid overlaps with the legend
  // retrieve an item from the legend array
  const item = randomItem(legend);

  /* return an object marrying the name and color with the personality and user attitude */
  return Object.assign({}, item, {
    personality,
    attitude,
  });
};

// number of data points
const dataPoints = 1;
// create an array of data points leveraging the utility functions
const data = Array(dataPoints).fill('').map(randomDataPoint);
console.log('data is ', data)// [ {name: "Yellow", color: "hsl(57, 96%, 64%)", personality: 16, attitude: 5320} ]

// VIZ
// in the .viz container include an SVG element following the margin convention
const margin = {
  top: 50,
  right: 50,
  bottom: 50,
  left: 50,
};
const width = 500;
const height = 500;
// the chart ought to be wider than taller
const innerWidth = width - (margin.left + margin.right);
const innerHeight = height - (margin.top + margin.bottom);

const svg = d3
  .select('.viz')
  .append('svg')
  .attr('viewBox', `0 0 ${innerWidth + (margin.left + margin.right)} ${innerHeight + (margin.top + margin.bottom)}`);

//建立最外層的 container
const outsideContainer = svg.append('g');

//create root
const group = svg
  .append('g')
  .attr('transform', `translate(${margin.left} ${margin.top})`);

//加上外框
group
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", innerWidth)
  .attr("height", innerHeight)
  .attr('fill', 'none')
  .attr('stroke', 'currentColor')
  .attr('stroke-width', .5);

// quadrants and labels
appendQuadrantsAndLabels(group)

// scales
// for both the x and y dimensions define linear scales, using the minimum and maximum values defined earlier
const attitudeScale = d3
  .scaleLinear()
  .domain(d3.extent(Object.values(attitudes)))
  .range([50, innerWidth - 50]);

const personalityScale = d3
  .scaleLinear()
  // .domain(d3.extent(Object.values(personalitys)))
  .domain([personalitys.max, personalitys.min])
  .range([innerHeight - 50, 50]);

// axes
const attitudeAxis = d3
  .axisBottom(attitudeScale)
  .ticks(attitudes.max - attitudes.min)
  .tickFormat(d => [10, 17, 25, 33, 40].includes(d) ? d : "");

const personalityAxis = d3
  .axisLeft(personalityScale)
  .ticks(personalitys.max - personalitys.min)
  .tickFormat(d => [10, 17, 33, 40].includes(d) ? d : "");



// add classes to later identify the axes individually and jointly
group
  .append('g')
  .attr('transform', `translate(0 ${innerHeight / 2})`)
  .attr('class', 'axis axis-attitude')
  .call(attitudeAxis)
  .selectAll("text")
  .style("text-anchor", (d, i) => d === 25 ? 'middle' : 'middle')
  .attr("transform", (d, i) => d === 25 ? "translate(5,5)rotate(-45)" : "")
  ;

group
  .append('g')
  .attr('class', 'axis axis-personality')
  .attr('transform', `translate(${innerWidth / 2} 0)`)
  .call(personalityAxis);

// style the ticks to be shorter
d3
  .select('.axis-attitude')
  .selectAll('line')
  .attr('transform', `translate(0 -5)`)
  .attr('y2', 10);

d3
  .select('.axis-personality')
  .selectAll('line')
  .attr('transform', `translate(-5 0)`)
  .attr('x2', 10);

d3
  .selectAll('.axis')
  .selectAll('text')
  .attr('font-size', '0.85rem');

// grid
// include dotted lines for each tick and for both axes
//畫中間的矩形
d3
  .select('.axis-attitude')
  .selectAll('g.tick')
  .filter((d, i) => d === 17 | d === 33)
  .append('path')
  .attr('d', `M 0 ${personalityScale(25) - personalityScale(33)} v ${personalityScale(33) - personalityScale(17)}`)
  // .attr('d', `M 0 -${attitudeScale(17)} v ${attitudeScale(33)}`)
  .attr('stroke', 'currentColor')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2')
  .attr('opacity', 0.3);

d3
  .select('.axis-personality')
  .selectAll('g.tick')
  .filter((d, i) => d === 17 | d === 33)
  .append('path')
  .attr('d', `M ${attitudeScale(25) - attitudeScale(33)} 0 h ${attitudeScale(33) - attitudeScale(17)}`)
  .attr('d', `M -${innerWidth / 4 - 20} 0 h ${innerWidth / 2 - 40}`)
  .attr('stroke', 'currentColor')
  .attr('stroke-width', 1)
  .attr('stroke-dasharray', '2')
  .attr('opacity', 0.3);


// labels
outsideContainer
  .append('g')
  .attr('class', 'label label-vertical')
  .attr('transform', `translate(${width / 2} ${0})`);

outsideContainer
  .select('g.label-vertical')
  .append('text')
  .attr('x', 0)
  .attr('y', height - 20)
  .style('text-transform', 'uppercase')
  .attr('text-anchor', 'middle')
  .text('formal')
  ;

outsideContainer
  .select('g.label-vertical')
  .append('text')
  .attr('x', 0)
  .attr('y', 20)
  .style('text-transform', 'uppercase')
  .attr('dominant-baseline', 'hanging')
  .attr('text-anchor', 'middle')
  .text('informal')
  ;

outsideContainer
  .append('g')
  .attr('class', 'label label-horizontal')
  .attr('transform', `translate(${0} ${height / 2})`);

outsideContainer
  .select('g.label-horizontal')
  .append('text')
  .attr('x', width - 20)
  .attr('y', 0)
  .attr('dominant-baseline', 'text-before-edge')
  .attr('text-anchor', 'middle')
  .style('writing-mode', 'tb')
  .style('text-orientation', 'upright')
  .style('text-transform', 'uppercase')
  .text('easygoing')
  ;
outsideContainer
  .select('g.label-horizontal')
  .append('text')
  .attr('x', 20)
  .attr('y', 0)
  .attr('dominant-baseline', 'text-after-edge')
  .style('writing-mode', 'tb')
  .style('text-orientation', 'upright')
  .style('text-transform', 'uppercase')
  .attr('text-anchor', 'middle')
  .text('dominant');


// data points
// add a group for each data point, to group circle and text elements
const dataGroup = group
  .append('g')
  .attr('class', 'data');

const dataPointsGroup = dataGroup
  .selectAll('g.data-point')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'data-point')
  .attr('transform', ({ attitude, personality }) => `translate(${attitudeScale(attitude)} ${personalityScale(personality)})`);

// circles using the defined color
dataPointsGroup
  .append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 5)
  .attr('fill', ({ color }) => color);

// labels describing the circle elements
dataPointsGroup
  .append('text')
  .attr('text-anchor', ({ attitude }, i) => attitude >= 25 ? 'start' : 'end')
  .attr('x', ({ attitude }, i) => attitude >= 25 ? 10 : -10)
  .attr('y', ({ personality }, i) => personality >= 25 ? -10 : 10)
  .attr('class', 'name')
  .text(({ personality, attitude }, i) => `[${personality} ${attitude}]`)
  .attr('dominant-baseline', 'central')
  .style('font-size', '0.55rem')
  .style('letter-spacing', '0.05rem')
  .style('pointer-events', 'none');

// on hover highlight the data point
dataPointsGroup
  .on('mouseenter', function (d) {
    // slightly translate the text to the left and change the fill color
    const text = d3
      .select(this)
      .select('text.name')

    text
      .transition()
      .attr('transform', 'translate(0 0)')
      .style('color', 'hsl(230, 29%, 19%)')
      .style('text-shadow', 'none');

    /* as the first child of the group add another group in which to gather the elements making up the tooltip
    - rectangle faking the text's background
    - circle highlighting the selected data point
    - path elements connecting the circle to the values on the axes
    - rectangles faking the background for the labels on the axes
    - text elements making up the labels on the axes
    */
    const tooltip = d3
      .select(this)
      .insert('g', ':first-child')
      .attr('class', 'tooltip')
      .attr('opacity', 0)
      .style('pointer-events', 'none');


    // for the rectangle retrieve the width and height of the text elements to have the rectangle match in size
    const textElement = text['_groups'][0][0];
    const { x, y, width: textWidth, height: textHeight } = textElement.getBBox();

    tooltip
      .append('rect')
      .attr('x', x - 3)
      .attr('y', y - 1.5)
      .attr('width', textWidth + 6)
      .attr('height', textHeight + 3)
      .attr('fill', 'hsl(227, 9%, 81%)')
      .attr('rx', '2')
      .transition()
      // transition the rectangle to match the text translation
      .attr('transform', 'translate(0 0)');


    // include the two dotted lines in a group to centralize their common properties
    const dashedLines = tooltip
      .append('g')
      .attr('fill', 'none')
      .attr('stroke', 'hsl(227, 9%, 81%)')
      .attr('stroke-width', 2)
      // have the animation move the path with a stroke-dashoffset considering the cumulative value of a dash and an empty space
      .attr('stroke-dasharray', '7 4')
      // animate the path elements to perennially move toward the axes
      .style('animation', 'dashOffset 1.5s linear infinite');


    dashedLines
      .append('path')
      .attr('d', ({ personality, attitude }) => `M 0 0 v ${personalityScale(25) - personalityScale(personality)}`);

    dashedLines
      .append('path')
      .attr('d', ({ attitude, personality }) => `M 0 0 h ${attitudeScale(25) - attitudeScale(attitude)}`);

    // detail a circle, with a darker fill and a larger radius
    tooltip
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('fill', 'hsl(0, 0%, 0%)')
      .attr('stroke', 'hsl(227, 9%, 81%)')
      .attr('stroke-width', 2)
      .attr('r', 0)
      // transition the circle its full radius
      .transition()
      .attr('r', 9.5);

    // transition the tooltip to be fully opaque
    tooltip
      .transition()
      .attr('opacity', 1);

  })
  // when exiting the hover state reset the appearance of the data point and remove the tooltip
  .on('mouseout', function (d) {
    d3
      .select(this)
      .select('text.name')
      .transition()
      .delay(100)
      .attr('transform', 'translate(0 0)')
      .style('color', 'inherit')
      .style('text-shadow', 'inherit');

    // remove the tooltip after rendering it fully transparent
    d3
      .select(this)
      .select('g.tooltip')
      .transition()
      .attr('opacity', 0)
      .remove();
  });


function appendQuadrantsAndLabels(group) {
  // position four rectangles and text elements to divvy up the larger shape in four sections
  const quad = [
    'promoting',
    'supporting',
    'controlling',
    'analysing',
  ];

  const quadrantsGroup = group
    .append('g')
    .attr('class', 'quadrants');

  // include one group for each quadrant
  const quadrants = quadrantsGroup
    .selectAll('g.quadrant')
    .data(quad)
    .enter()
    .append('g')
    .attr('class', 'quadrant')
    // position the groups at the four corners of the viz
    .attr('transform', (d, i) => `translate(${i % 2 === 0 ? 0 : innerWidth / 2} ${i < 2 ? 0 : innerHeight / 2})`);

  // for each quadrant add a rectangle and a label
  quadrants
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', innerWidth / 2)
    .attr('height', innerHeight / 2)
    // include a darker shade for the third quadrant
    .attr('fill', (d, i) => (i === 2 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 100%, 100%)'))
    // highlight the second and third quadrant with less transparency
    .attr('opacity', (d, i) => ((i === 1 || i === 2) ? 0.15 : 0.05));

  quadrants
    .append('text')
    .attr('x', (d, i) => i % 2 === 0 ? 0 + 40 : innerWidth / 2 - 40)
    .attr('y', (d, i) => i < 2 ? 0 + 20 : innerHeight / 2 - 20)
    .attr('text-anchor', (d, i) => i % 2 === 0 ? 'start' : 'end')
    .attr('dominant-baseline', 'central')
    .text(d => d)
    .style('text-transform', 'uppercase')
    .style('font-weight', '100')
    .style('font-size', '0.7rem')
    // .attr('transform', (d, i) => `translate(${i % 2 === 0 ? 0 : 100} 0)`)
    .attr('opacity', 0.9);

}