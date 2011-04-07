var circuits, loop, paper, resetHeight;
var globalBottom = 300;
var checkMeterInterval = 1000; 

var main = function() {
  var creditColor = "blue";
  var wattColor = "green";

  circuits = { 
    '192.168.1.201' : {'color': 'green'},
    '192.168.1.202' : {'color': 'green'},
    '192.168.1.203' : {'color': 'green'}, 
    '192.168.1.204' : {'color': 'green'},     
    '192.168.1.205' : {'color': 'green'},     
    // '192.168.1.206' : {'color': 'green'},     
    // '192.168.1.207' : {'color': 'green'},     
    // '192.168.1.208' : {'color': 'green'},     
    // '192.168.1.209' : {'color': 'green'},     
    // '192.168.1.210' : {'color': 'green'},     

  }; 

  paper = Raphael("graphs", 1000, 500);

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
    var left = 300;
    $.each(circuits, function(id) { 
      var circuit = circuits[id];
      var top = globalBottom - 10 ; 
      var cLabel = make_label_large(paper.text(left+45,40,id.substr(-2)));
      var emax = paper.rect(left,top, 100, 10, 5);
      emax.attr("stroke","#66ffff");
      var emaxLabel = make_label_small(paper.text(left+50,100, "0"),"#fff");
      emaxLabel.attr("opacity",0)
      var wh_today = paper.rect(left+1, top, 98, 10, 5);
      wh_today.attr("fill",wattColor);
      wh_today.attr("title",id);
      wh_today_label = make_label_small(paper.text(left+55,top,"0"),"#fff"); 
      wh_today_label.attr("opacity",0);
      var watts = make_label_small(paper.text(left+55, top + 40, "0"), "#fff"); 
      watts.attr("fill","#fff");
      var credit = paper.rect(left, top+60, 100, 10, 5);
      var creditLabel = make_label_small(paper.text(left+55,top+50,"0"),"#fff");     
      creditLabel.attr("opacity",0);
      credit.attr("fill", creditColor);
      circuit.emax = emax;
      circuit.credit = credit;
      circuit.wh_today = wh_today;
      circuit.wh_today_label = wh_today_label;
      circuit.watts = watts;
      circuit.creditLabel = creditLabel;
      circuit.emaxLabel = emaxLabel;
      left+= 120;
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
        resetHeight(c.emax, d.emax);
        resetHeight(c.wh_today, d.wh_today)
        c.credit.attr("height",d.cr/100);
        c.creditLabel.attr("text",d.cr);
        if (d.wh_today > 10 ) { 
          c.wh_today_label.attr("opacity",1);
          c.wh_today_label.attr("text",d.wh_today);
          c.wh_today_label.attr("y", globalBottom - d.wh_today - 10);
        } else { 
          c.wh_today_label.attr("opacity",0);
        }

        if (d.cr > 10) { 
          c.creditLabel.attr("opacity",1);
          c.creditLabel.attr("y",globalBottom + d.cr/100 + 60) 
        } else { 
          c.credit.attr("height",5)
          c.creditLabel.attr("opacity",0);
        };
        c.watts.attr("text",d.watts + "w");
      }); 

    }, checkMeterInterval) 
    return loop;
  }; 
  
  function make_legend() { 
    var x = 0, y =0;
    var credit = paper.rect(x+10,y+60,20,20,1);
    credit.attr("fill",creditColor);
    make_label_small(paper.text(x+108,y+68, "Circuit credit"),"#fff");
    var watthours = paper.rect(x+10,y+20,20,20,1);
    watthours.attr("fill",wattColor);
    make_label_small(paper.text(x+130,y+28,"Circuit watt hours"),"#fff");

  }

  make_legend();

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
