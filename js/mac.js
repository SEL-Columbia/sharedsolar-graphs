var circuits, loop, paper, resetHeight;
var middle = 550;
var checkMeterInterval = 500; 

var main = function() {
  var creditColor = "blue";
  var wattColor = "green";

  circuits = { 
    '192.168.1.201' : {'color': 'green'},
    '192.168.1.202' : {'color': 'green'},
    '192.168.1.203' : {'color': 'green'}, 
    '192.168.1.204' : {'color': 'green'},     
    '192.168.1.205' : {'color': 'green'},     
    '192.168.1.206' : {'color': 'green'},     
    '192.168.1.207' : {'color': 'green'},     
    '192.168.1.208' : {'color': 'green'},     
    '192.168.1.209' : {'color': 'green'},     
    '192.168.1.210' : {'color': 'green'},     
  }; 

  paper = Raphael("graphs", 1000, 1000);

  resetWidth = function(graph, width) { 
    w = middle - width;
    graph.attr('x',w);
    graph.attr('width',width);
    return graph
  };

  function make_label(label) { 
    label.attr({ "fill": "#fff",
                 "font-family": "Helvetica",
                 "font-weight": "bold",
                 "font-size": 15
               });
    return label;
  };    

  
  var createBars = function  () { 
    var down = 10;
    $.each(circuits, function(id) { 
      var circuit = circuits[id];
      var cLabel = make_label(paper.text(0, down ,id.substr(-2)));
      var emax = paper.rect(middle,down, 50,20, 5);
      emax.attr("stroke","#4c7899");
      var graph = paper.rect(middle, down, 44, 20, 5);
      var watts = paper.text(middle, down, "0"); 
      watts.attr("fill","#fff");
      var credit = paper.rect(middle, down, 50, 20, 5);
      var creditLabel = paper.text(middle,down,"0");
      creditLabel.attr("fill","#fff");
      credit.attr("fill", creditColor);
      circuit.emax = emax;
      circuit.credit = credit;
      circuit.graph = graph;
      circuit.watts = watts;
      circuit.creditLabel = creditLabel;
      graph.attr("fill",wattColor);
      graph.attr("title",id);      
      down+=60 ; 

    })}; 
  

  function load_data(fn) {
    $.getJSON("/meter/admin/circuits/use", function(data) {
      $.each(data, function(id) { 
        new_circuit = data[id];
        c = circuits[new_circuit.cid];          
        fn();
      })
    })};

  function set_circuit_height() { 
    load_data(function() { 
      console.log(circuit);
    });     
  }
  
  function mainLoop() {     
    var loop = setInterval(function() { 
      load_data(function() { 
        resetWidth(c.graph, new_circuit.wh_today)
        resetWidth(c.emax, new_circuit.emax);
        cr = new_circuit.cr/10000;
        c.credit.attr("width",cr);
        c.creditLabel.attr("text",cr.toFixed(2));
        if (cr > 10) { 
          c.creditLabel.attr("opacity",1);
          c.creditLabel.attr("x", middle + cr + 20) 
        } else { 
          c.creditLabel.attr("opacity",0);
        };
        c.watts.attr("text",new_circuit.watts);
      }); 

    }, checkMeterInterval) 
    return loop;
  }; 
  
  // function make_legend() { 
  //   var x = 0, y =0;
  //   var credit = paper.rect(x+10,y+10,20,20,1);
  //   credit.attr("fill",creditColor);
  //   make_label(paper.text(x+90,y+20, "Circuit credit"));
  //   var watthours = paper.rect(x+10,y+50,20,20,1);
  //   watthours.attr("fill",wattColor);
  //   make_label(paper.text(x+110,y+60,"Circuit watt hours"));

  // }

//  make_legend();
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
