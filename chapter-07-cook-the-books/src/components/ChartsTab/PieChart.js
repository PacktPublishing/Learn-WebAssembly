/**
 * This component uses D3 to render a pie chart based on the specified
 * data. It allows a user to choose between raw and cooked transactions.
 */
export default {
  name: 'pie-chart',
  props: {
    title: String,
    chartData: Array
  },
  data() {
    return {
      // Used to determine which button should be highlighted for
      // type ("Raw" or "Cooked"):
      activeAmountType: AMOUNT_TYPE.raw
    };
  },
  computed: {
    // This is used as the "id" on the DOM element containing the chart
    // and is required to use d3.select:
    chartId() {
      return `${this.title}Chart`;
    },

    // Returns an array of records with positive values that correspond
    // to the current active amount type:
    chartDataForView() {
      const valueField = {
        [AMOUNT_TYPE.raw]: 'rawTotal',
        [AMOUNT_TYPE.cooked]: 'cookedTotal'
      }[this.activeAmountType];

      return this.chartData.map(record => ({
        category: record.category,
        total: Math.abs(record[valueField])
      }));
    }
  },
  methods: {
    // Draw the pie chart using D3.
    drawChart() {
      // Remove existing chart to ensure the chart isn't just getting
      // overwritten:
      const existingSvg = d3.select(`#${this.chartId} > svg`);
      if (existingSvg) existingSvg.remove();

      // One of D3's conventions is to specify the dimensions of the
      // chart elements prior to drawing:
      const width = 600;
      const height = 600;
      const radius = 225;

      // Add an SVG element to the <div>. This is the container we'll
      // use to draw our chart:
      const svg = d3
        .select(`#${this.chartId}`)
        .append('svg')
        .attr('viewBox', '0 0 800 800');

      // This is used to offset the chart so it's centered within the
      // <svg> element:
      const g = svg
        .append('g')
        .attr('transform', `translate(${width / 2 + 200}, ${height / 2})`);

      // These are used to differentiate the various categories:
      const colors = [
        '#2b6b50',
        '#676766',
        '#4cacb0',
        '#f0652f',
        '#2980b9',
        '#c72531',
        '#942979',
        '#fecc46'
      ];
      // Setup simple ordinal scale
      // @see https://github.com/d3/d3/blob/master/API.md#ordinal-scales
      const colorScale = d3.scaleOrdinal(colors);

      // Update the data to ensure the values being displayed are positive
      // and correspond with the activeAmountType in state:
      const validData = this.chartDataForView;
      const grandTotal = validData.reduce(
        (acc, record) => acc + record.total,
        0
      );

      // Create a layout for our pie chart:
      const pie = d3
        .pie()
        .sort(null)
        .value(d => d.total);

      // Defined the arc for the chart, we're creating a donut, so the
      // innerRadius is smaller than the outerRadius. If we didn't want
      // a donut, we'd set the innerRadius to 0:
      const arcPath = d3
        .arc()
        .outerRadius(radius)
        .innerRadius(radius / 2);

      // This is used to place the percentage labels. They'll be
      // located on the outside of the chart:
      const label = d3
        .arc()
        .outerRadius(radius + 35)
        .innerRadius(radius + 35);

      // Load the data using D3's General Update Pattern
      // @see http://quintonlouisaiken.com/d3-general-update-pattern/
      const arc = g
        .selectAll('.arc')
        .data(pie(validData))
        .enter()
        .append('g')
        .attr('stroke', '#fff');

      // Add a <path> element for each category at 100ms intervals using
      // D3's neat transitions API:
      arc
        .append('path')
        .attr('fill', d => colorScale(d.data.category))
        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attrTween('d', d => {
          const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
          return t => {
            d.endAngle = i(t);
            return arcPath(d);
          };
        });

      // Add the label that displays the percentage corresponding to
      // the category. I added a 500ms delay so some of the category
      // <path> elements load before the labels are displayed:
      arc
        .append('text')
        .attr('transform', d => `translate(${label.centroid(d)})`)
        .attr('dy', '.35em')
        .attr('stroke', (d, i) => colors[i])
        .style('text-anchor', 'middle')
        .style('font-size', '22px')
        .transition()
        .delay(500)
        .text(d => d3.format(',.1%')(d.value / grandTotal));

      // Create a legend to the left of the pie chart which indicates
      // what color is used for each category:
      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('x', 0)
        .attr('y', 100)
        .attr('height', '100%')
        .attr('width', 300);

      legend
        .selectAll('g')
        .data(validData)
        .enter()
        .append('g')
        .each(function(d, i) {
          const g = d3.select(this);
          g.attr('transform', `translate(0, ${i * 40})`);

          g.append('rect')
            .attr('x', 0)
            .attr('width', 16)
            .attr('height', 16)
            .attr('fill', colors[i]);

          g.append('text')
            .attr('x', 25)
            .attr('y', 10)
            .attr('alignment-baseline', 'middle')
            .attr('width', 100)
            .attr('fill', colors[i])
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text(d.category);
        });
    },

    // If the user switches from "Raw" to "Cooked" (or vice versa),
    // redraw the chart:
    switchView(event) {
      this.activeAmountType = +event.target.dataset.amountType;
      this.drawChart();
    },

    // Used to indicate which chart is currently being shown:
    getActiveClass(amountType) {
      return {
        'uk-active': this.activeAmountType === amountType
      };
    }
  },
  watch: {
    chartData() {
      this.drawChart();
    }
  },
  template: `
    <div>
      <h2 class="uk-heading-divider">{{ title }} By Category</h2>
      <ul uk-margin class="uk-subnav uk-subnav-pill">
        <li :class="getActiveClass(AMOUNT_TYPE.raw)">
          <a :data-amount-type="AMOUNT_TYPE.raw" @click="switchView">
            Raw
          </a>
        </li>
        <li :class="getActiveClass(AMOUNT_TYPE.cooked)">
          <a :data-amount-type="AMOUNT_TYPE.cooked" @click="switchView">
            Cooked
          </a>
        </li>
      </ul>
      <div :id="chartId"></div>
    </div>
  `
};
