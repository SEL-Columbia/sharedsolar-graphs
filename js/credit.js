var circuits, loop, paper, resetHeight;
var globalBottom = 500;
var checkMeterInterval = 1000; 

var main = function() {
  var creditColor = "green";
  var wattColor = "green";

  circuits = { 
    '192.168.1.201' : {'color': 'green'},
    '192.168.1.202' : {'color': 'green'},
    '192.168.1.203' : {'color': 'green'}, 
    '192.168.1.204' : {'color': 'green'},     
    '192.168.1.205' : {'color': 'green'},

  }; 

  paper = Raphael("graphs", 1000, 700);
  // var title = paper.text(130,40, "SharedSolar");
  // title.attr({
  //   "font-family": "Helvetica",
  //   "font-size" : 40,
  //   "fill": "#fff"
  // });

  var subtitle = paper.text(108, globalBottom + 23, "Credit:");
  subtitle.attr({
    "font-family": "Helvetica",
    "font-size": 20,
    "fill": "#fff",
  });

  var power = paper.text(108, 95, "Power:");
  power.attr({
    "font-family": "Helvetica",
    "font-size": 20,
    "fill": "#fff",
  });


  resetHeight = function(graph, height) { 
    t = globalBottom - height;
    graph.attr('y',t);
    graph.attr('height',height);
    return graph
  };

  function make_label_large(label) { 
    label.attr({ "fill": "#fff",
                 "font-family": "Helvetica",
                 "font-weight": "bold",
                 "font-size": 60
               });
    return label;
  };    

  function make_label_small(label, color) { 
    label.attr({"fill": color,
           "font-family": "Helvetica",
           "font-size"  : 20});
    return label;
  };

  
  var createBars = function  () { 
    var left = 250;
    $.each(circuits, function(id) { 
      var circuit = circuits[id];
      var top = globalBottom - 10 ; 
      var cLabel = make_label_large(paper.text(left+50,600,id.substr(-2)));
      var credit = paper.rect(left, top, 100, 10, 5);
      var creditLabel = make_label_small(paper.text(left+55,top+50,"0"),"#fff");     
      var wattBox = paper.rect(left, 70, 100, 50, 5);
      wattBox.attr("fill","#fff");
      var watts = make_label_small(paper.text(left+55, 95, "0"), "black"); 
      circuit.watts = watts;
      creditLabel.attr("opacity",0);
      credit.attr("fill", creditColor);
      circuit.credit = credit;
      circuit.creditLabel = creditLabel;
      left+= 150;
    })}; 
  

  function load_data(fn) {
    $.getJSON("/meter/admin/circuits/use", function(data) {
      $.each(data, function(id) { 
        d = data[id];
        c = circuits[d.cid];          
        if (c) { 
          fn()};
      })
    })};

  function set_emax_label() { 
    load_data(function() { 
    });     
  }

  set_emax_label()
  

  function mainLoop() {     
    var loop = setInterval(function() { 
      load_data(function() { 

        resetHeight(c.credit,d.cr/50);
        c.creditLabel.attr("text", parseInt(d.cr) + " CFA");
        c.creditLabel.attr("opacity",1);
        c.creditLabel.attr("y",globalBottom + 20);
        c.watts.attr("text", parseInt(d.watts) + " w");
      }); 

    }, checkMeterInterval) 
    return loop;
  }; 
  

  createBars();
  loop = mainLoop();


  $("#graphs rect").mouseover(function(rect){ 
    console.log(rect);
  })

  $("#stop").click(function() { 
    clearTimeout(loop); 
  })

  $("#start").click(function() { 
    loop = mainLoop();
    
  }); 

}; 
