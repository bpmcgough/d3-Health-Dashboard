let currentDay = 1;
let weightsObj = {
  '1': 150,
  '2': 180,
  '3': 160
};

function createGraph(categoryX, categoryY) {

  let margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 50
  };
  let width = 600 - margin.left - margin.right;
  let height = 270 - margin.top - margin.bottom;

  let x = d3.scale.linear().range([0, width]);
  let y = d3.scale.linear().range([height, 0]);

  let xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

  let yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

  function createValueline(categoryX, categoryY) {
    return d3.svg.line()
      .x(function(d) {
        return x(d[categoryX]);
      })
      .y(function(d) {
        return y(d[categoryY]);
      });
  }

  let svg = d3.select(".dynamic-graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .attr("class", "title")
    .style("font-size", "24px")
    .style("stroke", "#B4BCBF")
    .style("fill", "#B4BCBF")
    .text("Dynamic Graph");

  d3.csv("data/data.csv", (error, data) => {
    let startingNumberX = categoryX === 'day' ? 1 : 0;
    let startingNumberY = categoryY === 'day' ? 1 : 0;
    x.domain([startingNumberX, d3.max(data, function(d) {
      return d[categoryX];
    })]);
    y.domain([startingNumberY, d3.max(data, function(d) {
      return d[categoryY];
    })]);

    let valueline = createValueline(categoryX, categoryY);

    // Add the valueline path.
    svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(data));

    // Add the X Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  });
}

function createBarChart(categoryX, categoryY) {

  let margin = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 40
  };
  let width = 600 - margin.left - margin.right;
  let height = 300 - margin.top - margin.bottom;

  // Parse the date / time

  let x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  let y = d3.scale.linear().range([height, 0]);

  let dayTickText = ["Day 1", "Day 2", "Day 3"]

  let xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickValues([1, 2, 3])
    .tickFormat((d, i) => dayTickText[i])

  let yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data/data.csv", (error, data) => {

    x.domain(data.map(d => d[categoryX]));
    y.domain([0, d3.max(data, d => d[categoryY])]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y Axis Title");

    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", d => x(d[categoryX]))
      .attr("width", x.rangeBand())
      .attr("y", d => y(d[categoryY]))
      .attr("height", d => height - y(d[categoryY]))
  });
}

function createDayBarChart(day, letterOrCal) {

  let margin = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 40
  };
  let width = 600 - margin.left - margin.right;
  let height = 300 - margin.top - margin.bottom;

  let x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

  let y = d3.scale.linear().range([height, 0]);

  let letterTicks = ["A", "B", "C"];
  let calTicks = ["Calories in", "Calories out", "Caloric Intake"]

  let xAxis;
  if (letterOrCal === 'letter') {
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues([1, 2, 3])
      .tickFormat((d, i) => letterTicks[i])
  } else {
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickValues([1, 2, 3])
      .tickFormat((d, i) => calTicks[i])
  }

  let yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  let svg = d3.select(".dashboard-charts").append("svg")
    .attr("class", `${letterOrCal}-chart`)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  d3.csv(`data/day${day}-${letterOrCal}-data.csv`, (error, data) => {

    x.domain(data.map(d => d.letter))
    y.domain([0, d3.max(data, d => d.value)])

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

    let bars = svg.selectAll("bar")
      .data(data);

    bars
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("class", "bar")
      .attr("x", d => x(d.letter))
      .attr("width", x.rangeBand())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));

    bars
      .exit().remove();
  });
}

function updateDayBarChart(day) {
  // I'm not happy with this solution to updating the chart.
  // however, I struggled with a fluid transitional update to the
  // bar chart and this works as a prototype
  document.getElementsByClassName("letter-chart")[0].remove();
  document.getElementsByClassName("cal-chart")[0].remove();
  createDayBarChart(day, 'letter');
  createDayBarChart(day, 'cal')
}

function createWeightCircle(weight) {
  let svgContainer = d3.select(".dashboard-circle").append("svg")
    .attr("width", 300)
    .attr("height", 300);

  let circle = svgContainer.append("circle")
    .attr('class', 'weight-circle')
    .attr("cx", 150)
    .attr("cy", 150)
    .attr("r", weight / 2);

  svgContainer.append("text")
    .attr('class', 'weight-circle-text')
    .attr('dx', 150)
    .attr('dy', 155)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("stroke", "#B4BCBF")
    .style("fill", "#B4BCBF")
    .text(`${weight} lbs.`);
}

function updateWeightCircle(weight) {
  let svg = d3.select(".dashboard-circle").transition();

  svg.select('.weight-circle')
    .duration(750)
    .attr("cx", 150)
    .attr("cy", 150)
    .attr("r", weight / 2);

  svg.select('.weight-circle-text')
    .attr('class', 'weight-circle-text')
    .attr('dx', 150)
    .attr('dy', 155)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("stroke", "#B4BCBF")
    .style("fill", "#B4BCBF")
    .text(`${weight} lbs.`);
}

function createDashboard(day, weight) {
  createDayBarChart(day, 'letter');
  createDayBarChart(day, 'cal');
  createWeightCircle(weight);
}

function decrementDay() {
  if (currentDay > 1) currentDay--;
  updateDayBarChart(currentDay);
  updateWeightCircle(weightsObj[String(currentDay)]);
  document.getElementById('day-number').innerHTML = `Day ${currentDay}`
}

function incrementDay() {
  if (currentDay < 3) currentDay++;
  updateDayBarChart(currentDay);
  updateWeightCircle(weightsObj[String(currentDay)]);
  document.getElementById('day-number').innerHTML = `Day ${currentDay}`
}

function updateDashboard(day, weight) {
  updateDayBarChart(day); // should be a better way than doing this twice...
  updateWeightCircle(weight);
}

function updateDynamicGraph() {
  let graph = document.getElementsByClassName('dynamic-graph')[0]
  graph.removeChild(graph.firstChild);
  let xAxis = document.getElementById('x-axis-selector');
  let xAxisValue = xAxis.options[xAxis.selectedIndex].value;
  let yAxis = document.getElementById('y-axis-selector');
  let yAxisValue = yAxis.options[yAxis.selectedIndex].value;
  createGraph(xAxisValue, yAxisValue);
}

createDashboard(1, 150)
createGraph('day', 'intake')
