describe('Motion', function(){
    it('should exist', function(){
	expect(Motion).toBeDefined();
    });

    describe('Data', function(){
	var data;

	beforeEach(function(){
	    data = new Motion.Data();
	});

	it('should exist', function(){
	    expect(Motion.Data).toBeDefined();
	});

	it('should have a default id attribute', function(){
	    expect(data.id).toBe('?');
	});

	it('should have default attributes \'x\', \'y\' and \'z\'', function(){
	    expect(data.x).toBe(0);
	    expect(data.y).toBe(0);
	    expect(data.z).toBe(0);
	});

	it('should change attributes upon an update', function(){
	    var event = { x: 1, y: 2, z: 3 };

	    data.update(event);

	    expect(data.x).toBe(event.x);
	    expect(data.y).toBe(event.y);
	    expect(data.z).toBe(event.z);
	});

	it('should notify of an update', function(){
	    var called = false;
	    data.addListener(function(){ called = true });

	    data.update({ x: 3, y: 2, z: 1 });

	    expect(called).toBe(true);
	});
    });

    describe('DataMap', function(){
	var datas;

	beforeEach(function(){
	    datas = new Motion.DataMap();
	});

	it('should exist', function(){
	    expect(Motion.DataMap).toBeDefined();
	});

	it('should notify of new updates', function(){
	    var callCount = 0;
	    datas.addListener(function(){ callCount++; });

	    datas.update('a', { x:1, y:2, z: 3 });
	    expect(callCount).toBe(1);

	    datas.update('a', { x:1, y:2, z: 3 });
	    expect(callCount).toBe(1);
	});

	it('should return the data', function(){
	    var data = datas.update('a', { x:1, y:2, z: 3 });

	    expect(data).toBeDefined();
	});
    });

    describe('AttributeView', function(){
	var parent;
	var model;

	beforeEach(function(){
	    parent = document.createElement('div');
	});

	beforeEach(function(){
	    model = new Motion.Data();
	});

	it('should exist', function(){
	    expect(Motion.AttributeView).toBeDefined();
	});

	it('should add span to the parent', function(){
	    var view = new Motion.AttributeView(model, 'x', parent);

	    expect(parent.children.length).toBe(1);
	});

	it('should add \'attribute\'-class to the span', function(){
	    var view = new Motion.AttributeView(model, 'x', parent);

	    expect(parent.children.item(0).getAttribute('class')).toBe('attribute');
	});

	it('should write data to the span', function(){
	    var view = new Motion.AttributeView(model, 'x', parent);

	    expect(parent.children.item(0).textContent).toBe('0');
	});

	it('should change when data updates', function(){
	    var event = { x: 1, y: 0, z: 0 };
	    var view = new Motion.AttributeView(model, 'x', parent);

	    model.update(event);

	    expect(parent.children.item(0).textContent).toBe('' + event.x);
	});

	it('should use passed formatter', function(){
	    var view = new Motion.AttributeView(model, 'x', parent, function () { return 'success'; });

	    model.update({ x: 1, y: 2, z: 3 });

	    expect(parent.children.item(0).textContent).toBe('success');
	});

    });

    describe('DataView', function(){
	var parent;
	var model;

	beforeEach(function(){
	    parent = document.createElement('div');
	});

	beforeEach(function(){
	    model = new Motion.Data();
	    model.update({ id: 'a', x: 1, y: 2, z: 3 });
	});

	it('should exist', function(){
	    expect(Motion.DataView).toBeDefined();
	});

	it('should add Attribute views for each attribute to the parent', function(){
	    var view = new Motion.DataView(model, parent);

	    expect(parent.children.length).toBe(1);
	    expect(parent.children.item(0).children.length).toBe(4);
	    expect(parent.children.item(0).children.item(0).textContent).toBe('a');
	    expect(parent.children.item(0).children.item(1).textContent).toBe('1.00');
	    expect(parent.children.item(0).children.item(2).textContent).toBe('2.00');
	    expect(parent.children.item(0).children.item(3).textContent).toBe('3.00');
	});

	it('should give a \'motion\'-class to the container', function(){
	    var view = new Motion.DataView(model, parent);

	    expect(parent.children.item(0).getAttribute('class')).toBe('motion');
	});
    });

    describe('DataMapView', function(){
	var parent;
	var model;

	it('should exist', function(){
	    expect(Motion.DataMapView).toBeDefined();
	});

	beforeEach(function(){
	    parent = document.createElement('div');
	});

	beforeEach(function(){
	    model = new Motion.DataMap();
	    model.update('a', { x: 0, y: 1, z: 2 });
	});

	it('should create DataView', function(){
	    var DataMapView = new Motion.DataMapView(model, parent);

	    expect(parent.children.length).toBe(1);
	});

	it('should add DataView when new event source registers', function(){
	    var DataMapView = new Motion.DataMapView(model, parent);

	    model.update('b', { x: 3, y: 2, z: 1});

	    expect(parent.children.length).toBe(2);
	});

    });

    describe('format', function(){
	it('should exist', function(){
	    expect(Motion.format).toBeDefined();
	});

	describe('standard', function(){
	    it('should exist', function(){
		expect(Motion.format.standard).toBeDefined();
	    });

	    it('should return value unmodified', function(){
		['a', 0, 1.0].forEach(function (value) {
		    expect(Motion.format.standard(value)).toBe(value);
		});
	    });
	});

	describe('decimal', function(){
	    it('should exist', function(){
		expect(Motion.format.decimal).toBeDefined();
	    });

	    it('should return format number to certain precision', function(){
		expect(Motion.format.decimal(1)(0.123456)).toBe('0.1');
		expect(Motion.format.decimal(2)(0.123456)).toBe('0.12');
		expect(Motion.format.decimal(3)(0.123456)).toBe('0.123');
		expect(Motion.format.decimal(4)(0.123456)).toBe('0.1235');
		expect(Motion.format.decimal(5)(0.123456)).toBe('0.12346');
	    });
	});
    });

    describe('Total', function(){
	var data;

	beforeEach(function(){
	    data = new Motion.Total();
	});

	it('should exist', function(){
	    expect(Motion.Total).toBeDefined();
	});

	it('should have a default id attribute', function(){
	    expect(data.id).toBe('?');
	});

	it('should have default attributes \'total\'', function(){
	    expect(data.total).toBe(0);
	});

	it('should change attributes upon an update', function(){
	    var event = { total: 1 };

	    data.update(event);

	    expect(data.total).toBe(event.total);
	});

	it('should notify of an update', function(){
	    var called = false;
	    data.addListener(function(){ called = true });

	    data.update({ total: 3 });

	    expect(called).toBe(true);
	});
    });

    describe('TotalMap', function(){
	var datas;

	beforeEach(function(){
	    datas = new Motion.TotalMap();
	});

	it('should exist', function(){
	    expect(Motion.TotalMap).toBeDefined();
	});

	it('should notify of new updates', function(){
	    var callCount = 0;
	    datas.addListener(function(){ callCount++; });

	    datas.update('a', { total:1 });
	    expect(callCount).toBe(1);

	    datas.update('a', { total:2 });
	    expect(callCount).toBe(1);
	});

	it('should return the data', function(){
	    var data = datas.update('a', { total:1 });

	    expect(data).toBeDefined();
	});
    });

    describe('TotalView', function(){
	var parent;
	var model;

	beforeEach(function(){
	    parent = document.createElement('div');
	});

	beforeEach(function(){
	    model = new Motion.Total();
	    model.update({ id: 'a', total: 1 });
	});

	it('should exist', function(){
	    expect(Motion.TotalView).toBeDefined();
	});

	it('should add Attribute views for each attribute to the parent', function(){
	    var view = new Motion.TotalView(model, parent);

	    expect(parent.children.length).toBe(1);
	    expect(parent.children.item(0).children.length).toBe(2);
	    expect(parent.children.item(0).children.item(0).textContent).toBe('a');
	    expect(parent.children.item(0).children.item(1).textContent).toBe('1.00');
	});

	it('should give a \'total\'-class to the container', function(){
	    var view = new Motion.TotalView(model, parent);

	    expect(parent.children.item(0).getAttribute('class')).toBe('total');
	});
    });

    describe('TotalMapView', function(){
	var parent;
	var model;

	it('should exist', function(){
	    expect(Motion.TotalMapView).toBeDefined();
	});

	beforeEach(function(){
	    parent = document.createElement('div');
	});

	beforeEach(function(){
	    model = new Motion.TotalMap();
	    model.update('a', { total: 1 });
	});

	it('should create TotalView', function(){
	    var totalMapView = new Motion.TotalMapView(model, parent);

	    expect(parent.children.length).toBe(1);
	});

	it('should add TotalView when new event source registers', function(){
	    var totalMapView = new Motion.DataMapView(model, parent);

	    model.update('b', { total: 3 });

	    expect(parent.children.length).toBe(2);
	});

    });
});
