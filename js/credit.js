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
    var top = globalBottom - height;
    graph.attr('y',top);
    graph.attr("height",height);
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

  
  (function  () { 
    var left = 250;
    $.each(circuits, function(id) { 
      var circuit = circuits[id];
      var top = globalBottom - 10 ; 
      var cLabel = make_label_large(paper.text(left+50,600,id.substr(-2)));
      var credit = paper.rect(left, top, 100, 10, 5);
      var creditLabel = make_label_small(paper.text(left+55,top+50,"0"),"#fff");     
      var wattBox = paper.rect(left, 70, 100, 50, 5);
      wattBox.attr("fill","#fff");
      var watts = paper.text(left+50, 95, "0")

      wattBox.attr("opacity",0);
      watts.attr({"font-family": "Helvetica",
                  "font-size": 25,
                  "font-weight": "bold",
                  "fill": "black",
                 }); 

      circuit.watts = watts;
      circuit.wattBox  = wattBox ; 
      creditLabel.attr("opacity",0);
      credit.attr("fill", circuit.color);
      circuit.credit = credit;
      circuit.creditLabel = creditLabel;
      left+= 150;
    })})(); 
  

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
        
        if (d.watts > 0) { 
          c.wattBox.attr("opacity",1);
        } else { 
          c.wattBox.attr("opacity",0);
        }

        resetHeight(c.credit,d.cr*30);
        c.creditLabel.attr("text", parseFloat(d.cr) + " CFA");
        c.creditLabel.attr("opacity",1);
        c.creditLabel.attr("y",globalBottom + 20);
        c.watts.attr("text", parseFloat(d.watts) + " w");
      }); 

    }, checkMeterInterval) 
    return loop;
  }; 
  
  loop = mainLoop();

}; 
