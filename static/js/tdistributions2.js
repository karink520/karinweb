$(document).ready(function(){
    var margin = {top: 5, right: 30, bottom: 20, left: 30},
    fullwidth = Math.min((document.getElementsByClassName('blogdate')[0]).offsetWidth, 600) - margin.left - margin.right
    height = 180 - margin.top - margin.bottom;
    
    mu_0 = 1
    sigma = 1
    n = 10

    function draw_basic_graph(svd_container_selector, data, width, domain, range, title){
            var svg = d3.select(svd_container_selector)
            .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            var xScale = d3.scaleLinear()
                .domain(domain)
                .range([ 30, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));
        
            // Add Y axis
            var yScale = d3.scaleLinear()
                .domain(range)
                .range([ height, 0]);
            svg.append("g")
                .style("opacity", 0)
                .call(d3.axisLeft(yScale));
            
            // foreignObject to contain KaTeX (Step 4)
            var foreignObject = svg.append("foreignObject")
                 .attr("x", 0)             
                 .attr("y", 20 + (margin.top ))
            .attr("width", 200)
            .attr("height", 40);

            const span = foreignObject.append("xhtml:span")
                .attr("id", "node-text")
                .style("overflow","visible")
                .html(title);

            var u2 = svg.selectAll(".normal_line")
            .data([data], function(d){ return d.x });
            u2
            .join("path")
            .attr("class","normal_line")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(function(d) {return xScale(d.x) })
                .y(function(d) {return yScale(d.y) })
                )
            return {"u":u2, "xScale": xScale, "yScale":yScale}
        }

        // normal distribution and sample mean distribution 
        normal_pdf2_data = [], sample_mean_pdf_data= [];
        for (x=-4; x <= 4; x+=0.1) {
            normal_pdf2_data.push({"x":x, "y": jStat.normal.pdf( x, mu_0, sigma)})
            sample_mean_pdf_data.push({"x": x, "y": jStat.normal.pdf(x, mu_0, sigma/Math.sqrt(n))})
        }

        //biased sample variance
        sigma_hat_pdf = [];
        for(x=0; x<=20; x+=0.1) {
            sigma_hat_pdf.push({"x": x, "y": jStat.chisquare.pdf(x, n-1)})
        }

        //test statistic
        test_statistic_pdf= [];
        for(x=-4; x<=4; x+=0.1) {
            test_statistic_pdf.push({"x": x, "y": jStat.studentt.pdf(x, n-1)})
        }

        obj_samples = draw_basic_graph('#normal_samples', normal_pdf2_data, fullwidth, [-4,4],[0,1.4],"\\(x_i \\sim N(\\mu_0, \\sigma^2) \\)")
        var xScale_samples = obj_samples.xScale.bind({});
        var yScale_samples = obj_samples.yScale.bind({});
        obj= draw_basic_graph('#sample_mean', sample_mean_pdf_data, fullwidth/2, [-4,4],[0,1.4],"\\(\\bar{x} \\sim N(\\mu_0, \\sigma^2/n) \\)")
        var xScale_sample_mean = obj.xScale.bind({});
        var yScale_sample_mean = obj.yScale.bind({});
        u3  = obj.u;
        //[a,b]= draw_basic_graph('#sample_mean', sample_mean_pdf_data, width/2, [-4,4],[0,1.5])
        obj_var = draw_basic_graph('#scaled_sample_var', sigma_hat_pdf, fullwidth/2, [0, 20],[0,.2],"\\(\\frac{\\sum(\\bar{x}-x_i)^2}{\\sigma^2} \\sim \\chi^2_{n-1} \\)")
        var xScale_sample_var = obj_var.xScale.bind({});
        var yScale_sample_var = obj_var.yScale.bind({});
        obj_tstat = draw_basic_graph('#test_statistic', test_statistic_pdf, fullwidth, [-4,4],[0,1.4],"\\(\\frac{(\\bar{x} - \\mu_0)\\sqrt{n(n-1)}}{\\sqrt{\\sum(\\bar{x} - x_i)^2}} \\sim t_{n-1} \\)")
        var xScale_tstat = obj_tstat.xScale.bind({});
        var yScale_tstat = obj_tstat.yScale.bind({});

        //UPDATE
        function update(){
          console.log("transitioning")
          observations = []
          for(i=0; i < n; i ++){
              observations.push(jStat.normal.sample(mu_0, sigma))
          }
          xbar = [d3.mean(observations)];
          var sum_of_squares = 0
          for(i=0;i<n; i++){
              sum_of_squares += (observations[i] - xbar) * (observations[i] - xbar) 
          }
          tstatistic = (xbar - mu_0) * Math.sqrt(n*(n-1)) / Math.sqrt(sum_of_squares)
          console.log(observations);
          console.log(xbar);
          console.log(sum_of_squares);
          console.log(tstatistic);

        d3.select('#normal_samples svg').selectAll("circle")
            .data(observations)
            .transition()
            .duration(1000)
            .attr("cx", function(d,i){
                return xScale_samples(d);
            })

        d3.select('#sample_mean svg').selectAll("circle")
            .data(xbar)
            .transition()
            .duration(1000)
            .attr("cx", function(d,i){
                return xScale_sample_mean(d);
            })

        d3.select('#scaled_sample_var svg').selectAll("circle")
            .data([sum_of_squares/(sigma*sigma)])
            .transition()
            .duration(1000)
            .attr("cx", function(d,i){
                return xScale_sample_var(d);
            })

        d3.select('#test_statistic svg').selectAll("circle")
            .data([tstatistic])
            .transition()
            .duration(1000)
            .attr("cx", function(d,i){
                console.log("tstat")
                return xScale_tstat(d);
                console.log(xScale_tstat)
            })
        }
        //END UPDATE

        var observations = [];
        for(i=0; i < n; i ++){
            observations.push(jStat.normal.sample(mu_0, sigma))
        }
        var xbar = [d3.mean(observations)];
        var sum_of_squares = 0
        for(i=0;i<n; i++){
            sum_of_squares += (observations[i] - xbar) * (observations[i] - xbar) 
        }
        var tstatistic = (xbar - mu_0) * Math.sqrt(n*(n-1)) / sum_of_squares

        console.log(sum_of_squares/(sigma*sigma))

        d3.select('#scaled_sample_var svg g').selectAll('circle')
            .data([sum_of_squares/(sigma*sigma)])
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function(d,i){
            return xScale_sample_var(d);
            })
            .attr("cy", function(d,i){
            return yScale_sample_var(0);
            })
        console.log(xbar)

        d3.select('#normal_samples svg g').selectAll("circle")
            .data(observations)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function(d,i){
            return xScale_samples(d);
            })
            .attr("cy", function(d,i){
            return yScale_samples(0);
            })
        
        d3.select('#sample_mean svg g').selectAll("circle")
            .data(xbar)
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function(d,i){
            return xScale_sample_mean(d);
            })
            .attr("cy", function(d,i){
            return yScale_sample_mean(0);
            })
        
        d3.select('#test_statistic svg g').selectAll("circle")
            .data([tstatistic])
            .enter()
            .append("circle")
            .attr("r", 3)
            .attr("cx", function(d,i){
            return xScale_tstat(d);
            })
            .attr("cy", function(d,i){
            return yScale_tstat(0);
            })

        update();
        d3.select('#resample').on('click', update)
    
        // var svg = d3.select("#normal_samples")
        //     .append("svg")
        //         .attr("width", width + margin.left + margin.right)
        //         .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //         .attr("transform",
        //             "translate(" + margin.left + "," + margin.top + ")");
                
        // // Add X axis
        // var xScale = d3.scaleLinear()
        //     .domain([-4, 4])
        //     .range([ 0, width]);
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(xScale));
    
        // // Add Y axis
        // var yScale = d3.scaleLinear()
        //     .domain([0, 1.5])
        //     .range([ height, 0]);
        // svg.append("g")
        //     .call(d3.axisLeft(yScale));


        // var svgMean = d3.select("#sample_mean")
        // .append("svg")
        //     .attr("width", width/2 + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        // .append("g")
        //     .attr("transform",
        //         "translate(" + margin.left + "," + margin.top + ")");
            
        // // Add X axis
        // var xMeanScale = d3.scaleLinear()
        // .domain([-4, 4])
        // .range([ 0, width/2]);
        // svgMean.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(xMeanScale));
    
        // // Add Y axis
        // var yMeanScale = d3.scaleLinear()
        //     .domain([0, 1.5])
        //     .range([ height, 0]);
        // svgMean.append("g")
        //     .call(d3.axisLeft(yMeanScale));
    
        // function update(){
    
        //     // Add lines for normal 
        //     const u2 = svg.selectAll(".normal_line")
        //     .data([normal_pdf2_data], function(d){ return d.x });
        //     u2
        //     .join("path")
        //     .attr("class","normal_line")
        //     .attr("fill", "none")
        //     .attr("stroke", "lightgray")
        //     .attr("stroke-width", 1.5)
        //     .attr("d", d3.line()
        //         .x(function(d) {return xScale(d.x) })
        //         .y(function(d) {return yScale(d.y) })
        //         )

        //     const u3 = svgMean.selectAll(".mean_line")
        //     .data([sample_mean_pdf_data], function(d){ return d.x });
        //     u3
        //         .join("path")
        //         .attr("class","mean_line")
        //         .attr("fill", "none")
        //         .attr("stroke", "lightgray")
        //         .attr("stroke-width", 1.5)
        //         .attr("d", d3.line()
        //             .x(function(d) {return xMeanScale(d.x) })
        //             .y(function(d) {return yMeanScale(d.y) })
        //             )
         
        // }
    
        //update(); // Run this once at the start
    
    });