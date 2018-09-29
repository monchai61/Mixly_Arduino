pbc.assignD.get('i2c')['check_assign'] = function(py2block, node, targets, value) {
    var funcName = py2block.identifier(value.func.id);
    if(value._astname === "Call" 
        && funcName === "I2C" && value.keywords.length === 3)
        return true;
    return false;
}

pbc.assignD.get('i2c')['create_block'] = function(py2block, node, targets, value){

    var astname = value.keywords[0]._astname;
    if(astname === "keyword" && value.keywords[0].arg.v == "scl" 
        && value.keywords[0].value.func.id.v === "Pin"){ 
    var sdablock = null;
    var sclblock = null;
    var freqblock = null;
    var param = value.keywords[0];
    var key = py2block.identifier(param.arg);
    var i2cblock=py2block.convert(targets[0])
    for (var i = 0; i < value.keywords.length; i++) {
        var param = value.keywords[i];
        var key = py2block.identifier(param.arg);
        if (key === "sda") {
            pbc.inScope = "i2c_init";
            pbc.pinType = "pins_digital";
            sdablock = py2block.convert(param.value.args[0]);
            pbc.pinType = null;
            pbc.inScope = null;
        } else if (key === "scl") {
            pbc.inScope = "i2c_init";
            pbc.pinType = "pins_digital";
            sclblock = py2block.convert(param.value.args[0]);
            pbc.pinType = null;
            pbc.inScope = null;
        } else if (key === "freq") {
            freqblock = py2block.convert(param.value);
        }
    }
}
    if (sdablock != null && sclblock != null && freqblock != null) {
        return [block("i2c_init", node.lineno, {}, {
            "SUB":i2cblock,
            'RX': sdablock,
            'TX': sclblock,
            "freq": freqblock
        }, {
            "inline": "true"
        })];
    }
}

