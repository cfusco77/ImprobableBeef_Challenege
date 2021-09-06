function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value",sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    var otu_ids = result.otu_ids;
    //dictionary can use dot notation or var otu_ids = results["otu_ids"]
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    //Build Bubble Chart 
    var bubbleLayout = { 
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      margin: {t: 100}
    }

    var bubbleData = [
      { 
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: { 
          size: sample_values,
          color:otu_ids,
          colorscale: 'Earth'
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yticks = otu_ids.slice(0,10).map(function(id){
      return "OTI " + id
    }).reverse();
    

    var barData = [
      { 
        y:yticks,
        x:sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150}
    };

    Plotly.newPlot("bar", barData, barLayout);

    var metadata = data.metadata.filter(sampleObj => sampleObj.id == sample)[0]
    var wfreq = parseFloat(metadata.wfreq)
    console.log(wfreq);

    var gaugeData = [{
      value: wfreq,
      title: {text: "Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge:{ 
        axis: {range: [null,10], tickwidth: 4},
        bar:{color: "black"},
        steps: [
          {range: [0, 2], color: "Slateblue"},
          {range: [2, 4], color: "Mediumpurple"},
          {range: [4, 6], color: "Blueviolet"},
          {range: [6, 8], color: "Thistle"},
          {range: [8, 10], color: "RebeccaPurple"},
        ]}
    }];

    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      width: 500, 
      height: 300, 
      margin: { b:50 }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};

function buildMetadata(sample){
  d3.json("samples.json").then(function(data){
    var metadata = data.metadata;
    var resultsArray = metadata.filter(function(data){
      return data.id == sample;
  })
    var result = resultsArray[0];
    var PANEL = d3.select("#sample-metadata");

    //clear any exisiting data
    PANEL.html("");

    Object.entries(result).forEach(function([key, value]){
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });



  });
}


  